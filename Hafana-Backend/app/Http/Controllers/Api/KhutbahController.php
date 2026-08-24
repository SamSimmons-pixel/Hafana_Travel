<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class KhutbahController extends Controller
{
    private const CHANNEL_ID = 'UCB0qibtjzOIemPjQSaoWkGg'; // @Al-haramain-Sermons channel ID
    private const RSS_URL    = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCB0qibtjzOIemPjQSaoWkGg';
    private const CACHE_TTL  = 120; // 2 minutes cache for live status

    /**
     * GET /api/khutbah/live
     *
     * Checks Al-Haramain Sermons channel for active Indonesian live/upcoming stream.
     * Uses dual-layer fetch: Web scraping with Consent bypass + YouTube RSS feed fallback.
     */
    public function liveStatus(): JsonResponse
    {
        $result = Cache::remember('khutbah_live_status', self::CACHE_TTL, function () {
            return $this->fetchFromYouTube();
        });

        return response()->json($result);
    }

    private function fetchFromYouTube(): array
    {
        // 1. Try HTML scraping with Cookie Consent bypass headers
        try {
            $html = Http::withHeaders([
                'User-Agent'      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Accept-Language' => 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                'Cookie'          => 'SOCS=CAESEwgDEgk2OTg0MzI4MjQaAmVuIAEaBgiA_LyaBg; CONSENT=PENDING+999;',
            ])
                ->timeout(10)
                ->get('https://www.youtube.com/@Al-haramain-Sermons/streams')
                ->body();

            $result = $this->parseStreamsPage($html);
            if ($result !== null) {
                return $result;
            }
        } catch (\Throwable $e) {
            // Silently proceed to RSS fallback
        }

        // 2. Reliable Fallback: Official YouTube RSS Feed (100% immune to Datacenter IP blocking)
        try {
            $rssResult = $this->fetchFromRssFeed();
            if ($rssResult !== null) {
                return $rssResult;
            }
        } catch (\Throwable $e) {
            // Silently fallback to empty
        }

        return $this->buildEmptyResponse();
    }

    /**
     * Official YouTube RSS Feed parser (bypasses datacenter block/consent page)
     */
    private function fetchFromRssFeed(): array
    {
        $response = Http::timeout(10)->get(self::RSS_URL);
        if (!$response->successful()) {
            return $this->buildEmptyResponse();
        }

        $xml = @simplexml_load_string($response->body());
        if (!$xml || !isset($xml->entry)) {
            return $this->buildEmptyResponse();
        }

        $now            = new \DateTime('now', new \DateTimeZone('UTC'));
        $liveVideo      = null;
        $upcomingList   = [];
        $haramLive      = null;
        $haramUpcoming  = [];
        $nabawiLive     = null;
        $nabawiUpcoming = [];

        foreach ($xml->entry as $entry) {
            $title = (string)$entry->title;
            if (!$this->isIndonesian($title)) continue;

            $yt = $entry->children('http://www.youtube.com/xml/schemas/2015');
            $videoId = (string)$yt->videoId;
            if (!$videoId) continue;

            $masjid      = $this->detectMasjid($title);
            $published   = (string)$entry->published;
            $scheduledAt = $this->calculateKhutbahTime($published, $masjid);

            $schedDate = new \DateTime($scheduledAt, new \DateTimeZone('UTC'));
            // Khutbah duration is ~2 hours. If scheduled time + 2 hours has passed, the sermon is finished (State 1)
            $endedDate = (clone $schedDate)->modify('+2 hours');

            if ($now > $endedDate) {
                // Stream has ended/finished! Do not count as upcoming or live.
                continue;
            }

            $isLive = ($now >= $schedDate && $now <= $endedDate);
            $isUpcoming = ($now < $schedDate);

            $item = [
                'videoId'      => $videoId,
                'title'        => $title,
                'thumbnail'    => "https://i.ytimg.com/vi/{$videoId}/hqdefault.jpg",
                'url'          => "https://www.youtube.com/watch?v={$videoId}",
                'scheduledAt'  => $scheduledAt,
                'isIndonesian' => true,
                'masjid'       => $masjid,
                'isLive'       => $isLive,
                'isUpcoming'   => $isUpcoming,
            ];

            if ($isLive) {
                if (!$liveVideo) $liveVideo = $item;
                if ($masjid === 'haram' && !$haramLive) $haramLive = $item;
                elseif ($masjid === 'nabawi' && !$nabawiLive) $nabawiLive = $item;
            } elseif ($isUpcoming) {
                $upcomingList[] = $item;
                if ($masjid === 'haram' && empty($haramUpcoming)) $haramUpcoming[] = $item;
                elseif ($masjid === 'nabawi' && empty($nabawiUpcoming)) $nabawiUpcoming[] = $item;
            }
        }

        if (!$liveVideo && empty($upcomingList)) {
            return $this->buildEmptyResponse();
        }

        $overallStatus  = $liveVideo ? 'live' : 'upcoming';
        $overallStateId = $liveVideo ? 3 : 2;
        $stateTitle     = $liveVideo ? 'Sedang Berlangsung (Live)' : 'Siaran Terjadwal (Upcoming)';

        $haramStatus  = $haramLive ? 'live' : (!empty($haramUpcoming) ? 'upcoming' : 'none');
        $haramStateId = $haramLive ? 3 : (!empty($haramUpcoming) ? 2 : 1);

        $nabawiStatus  = $nabawiLive ? 'live' : (!empty($nabawiUpcoming) ? 'upcoming' : 'none');
        $nabawiStateId = $nabawiLive ? 3 : (!empty($nabawiUpcoming) ? 2 : 1);

        return [
            'status'         => $overallStatus,
            'state_id'       => $overallStateId,
            'state_title'    => $stateTitle,
            'live'           => $liveVideo,
            'upcoming'       => $upcomingList,
            'masjidil_haram' => [
                'status'   => $haramStatus,
                'state_id' => $haramStateId,
                'live'     => $haramLive,
                'upcoming' => $haramUpcoming,
                'name'     => 'Masjidil Haram (Makkah)',
            ],
            'masjid_nabawi'  => [
                'status'   => $nabawiStatus,
                'state_id' => $nabawiStateId,
                'live'     => $nabawiLive,
                'upcoming' => $nabawiUpcoming,
                'name'     => 'Masjid Nabawi (Madinah)',
            ],
        ];
    }


    /**
     * Calculates the exact Friday broadcast time for the Khutbah sermon
     */
    private function calculateKhutbahTime(string $published, string $masjid): string
    {
        try {
            $pubDate = new \DateTime($published, new \DateTimeZone('UTC'));
            $dayOfWeek = (int)$pubDate->format('N'); // 1 (Mon) to 7 (Sun), 5 = Friday
            if ($dayOfWeek <= 5) {
                $diff = 5 - $dayOfWeek;
                $pubDate->modify("+{$diff} days");
            } else {
                $diff = 12 - $dayOfWeek;
                $pubDate->modify("+{$diff} days");
            }

            // Friday Khutbah prayer is ~12:24 local AST (09:24 UTC) for Haram, ~12:25 for Nabawi
            $hour = 9;
            $min  = ($masjid === 'nabawi') ? 25 : 24;
            $pubDate->setTime($hour, $min, 0);

            return $pubDate->format('c'); // ISO-8601 UTC timestamp
        } catch (\Throwable $e) {
            return $published;
        }
    }



    private function parseStreamsPage(string $html): ?array
    {
        // Extract ytInitialData JSON from the YouTube page
        preg_match('/var ytInitialData\s*=\s*(\{.+?\});/', $html, $matches);
        if (empty($matches[1])) {
            preg_match('/ytInitialData\s*=\s*(\{.+?\});/', $html, $matches);
        }

        if (empty($matches[1])) {
            return null; // Return null so fetchFromYouTube falls back to RSS
        }

        $data = json_decode($matches[1], true);
        if (!$data) {
            return null;
        }

        // Extract all video items supporting both lockupViewModel (modern) and videoRenderer (legacy)
        $allItems = $this->extractAllVideoItems($data);

        $liveVideo          = null;
        $upcomingList       = [];
        $haramLive          = null;
        $haramUpcoming      = [];
        $nabawiLive         = null;
        $nabawiUpcoming     = [];

        foreach ($allItems as $item) {
            $isLive       = $item['isLive'] ?? false;
            $isUpcoming   = $item['isUpcoming'] ?? false;
            $isIndonesian = $item['isIndonesian'] ?? false;
            $masjid       = $item['masjid'] ?? 'haram';

            // Strict Filter: Only include streams with Indonesian translation
            if (!$isIndonesian) {
                continue;
            }

            if ($isLive) {
                // State 3: Live stream active (Indonesian translation)
                if (!$liveVideo) {
                    $liveVideo = $item;
                }

                if ($masjid === 'haram') {
                    $haramLive = $item;
                } elseif ($masjid === 'nabawi') {
                    $nabawiLive = $item;
                }
            } elseif ($isUpcoming) {
                // State 2: Upcoming stream (Indonesian translation)
                $upcomingList[] = $item;
                if ($masjid === 'haram') {
                    $haramUpcoming[] = $item;
                } elseif ($masjid === 'nabawi') {
                    $nabawiUpcoming[] = $item;
                }
            }
        }

        // If general live exists, assign to active mosque if empty
        if ($liveVideo && !$haramLive && !$nabawiLive) {
            if ($liveVideo['masjid'] === 'nabawi') {
                $nabawiLive = $liveVideo;
            } else {
                $haramLive = $liveVideo;
            }
        }

        // Determine 3-State for overall status
        $overallStateId = 1;
        $overallStatus  = 'none';
        $stateTitle     = 'Belum Ada Jadwal Siaran (Standby)';

        if ($liveVideo || $haramLive || $nabawiLive) {
            $overallStateId = 3;
            $overallStatus  = 'live';
            $stateTitle     = 'Siaran Langsung (Live Now)';
        } elseif (!empty($upcomingList)) {
            $overallStateId = 2;
            $overallStatus  = 'upcoming';
            $stateTitle     = 'Siaran Terjadwal (Upcoming)';
        }

        // Determine State for Masjidil Haram
        $haramStateId = 1;
        $haramStatus  = 'none';
        if ($haramLive) {
            $haramStateId = 3;
            $haramStatus  = 'live';
        } elseif (!empty($haramUpcoming)) {
            $haramStateId = 2;
            $haramStatus  = 'upcoming';
        }

        // Determine State for Masjid Nabawi
        $nabawiStateId = 1;
        $nabawiStatus  = 'none';
        if ($nabawiLive) {
            $nabawiStateId = 3;
            $nabawiStatus  = 'live';
        } elseif (!empty($nabawiUpcoming)) {
            $nabawiStateId = 2;
            $nabawiStatus  = 'upcoming';
        }

        return [
            'status'         => $overallStatus,
            'state_id'       => $overallStateId,
            'state_title'    => $stateTitle,
            'live'           => $liveVideo ?? $haramLive ?? $nabawiLive,
            'upcoming'       => $upcomingList,
            'masjidil_haram' => [
                'status'   => $haramStatus,
                'state_id' => $haramStateId,
                'live'     => $haramLive,
                'upcoming' => $haramUpcoming,
                'name'     => 'Masjidil Haram (Makkah)',
            ],
            'masjid_nabawi'  => [
                'status'   => $nabawiStatus,
                'state_id' => $nabawiStateId,
                'live'     => $nabawiLive,
                'upcoming' => $nabawiUpcoming,
                'name'     => 'Masjid Nabawi (Madinah)',
            ],
        ];
    }

    private function buildEmptyResponse(): array
    {
        return [
            'status'         => 'none',
            'state_id'       => 1,
            'state_title'    => 'Belum Ada Jadwal Siaran (Standby)',
            'live'           => null,
            'upcoming'       => [],
            'masjidil_haram' => [
                'status'   => 'none',
                'state_id' => 1,
                'live'     => null,
                'upcoming' => [],
                'name'     => 'Masjidil Haram (Makkah)',
            ],
            'masjid_nabawi'  => [
                'status'   => 'none',
                'state_id' => 1,
                'live'     => null,
                'upcoming' => [],
                'name'     => 'Masjid Nabawi (Madinah)',
            ],
        ];
    }

    /**
     * Extract video items supporting modern lockupViewModel and legacy videoRenderer
     */
    private function extractAllVideoItems(array $data): array
    {
        $items = [];

        // 1. Modern lockupViewModel (YouTube 2025/2026 Web format)
        $lockups = $this->deepFind($data, 'lockupViewModel');
        foreach ($lockups as $lockup) {
            $parsed = $this->parseLockupViewModel($lockup);
            if ($parsed) $items[] = $parsed;
        }

        // 2. Legacy videoRenderer (Classic YouTube format)
        $renderers = $this->deepFind($data, 'videoRenderer');
        foreach ($renderers as $renderer) {
            $parsed = $this->parseVideoRenderer($renderer);
            if ($parsed) $items[] = $parsed;
        }

        // Deduplicate by videoId
        $unique = [];
        foreach ($items as $item) {
            if (!empty($item['videoId']) && !isset($unique[$item['videoId']])) {
                $unique[$item['videoId']] = $item;
            }
        }

        return array_values($unique);
    }

    private function parseLockupViewModel(array $node): ?array
    {
        $videoId = $node['contentId']
            ?? $node['rendererContext']['commandContext']['onTap']['innertubeCommand']['watchEndpoint']['videoId']
            ?? null;

        $title = $node['metadata']['lockupMetadataViewModel']['title']['content']
            ?? $node['rendererContext']['accessibilityContext']['label']
            ?? '';

        if (!$videoId || !$title) return null;

        $jsonString = json_encode($node);

        // Check LIVE badge
        $isLive = false;
        $overlays = $node['contentImage']['thumbnailViewModel']['overlays'] ?? [];
        $overlayText = strtoupper(json_encode($overlays));
        if (str_contains($overlayText, '"LIVE"') || str_contains($overlayText, 'LIVE_NOW') || str_contains($overlayText, 'THUMBNAIL_OVERLAY_BADGE_STYLE_LIVE')) {
            $isLive = true;
        }

        // Check UPCOMING badge (Must have real UPCOMING badge/reminder, not past text)
        $isUpcoming = false;
        if (
            str_contains($overlayText, '"UPCOMING"') ||
            str_contains($overlayText, 'THUMBNAIL_OVERLAY_BADGE_STYLE_UPCOMING') ||
            str_contains($jsonString, 'addUpcomingEventReminderEndpoint') ||
            !empty($node['upcomingEventData'])
        ) {
            $isUpcoming = true;
        }

        // Scheduled time text
        $scheduledAt = null;
        if ($isUpcoming) {
            $metadataRows = $node['metadata']['lockupMetadataViewModel']['metadata']['contentMetadataViewModel']['metadataRows'] ?? [];
            foreach ($metadataRows as $row) {
                foreach ($row['metadataParts'] ?? [] as $part) {
                    $text = $part['text']['content'] ?? '';
                    if (str_contains($text, 'Scheduled') || str_contains($text, 'Terjadwal')) {
                        $scheduledAt = $text;
                        break 2;
                    }
                }
            }
        }

        $isIndonesian = $this->isIndonesian($title);
        $masjid       = $this->detectMasjid($title);

        return [
            'videoId'      => $videoId,
            'title'        => $title,
            'thumbnail'    => "https://i.ytimg.com/vi/{$videoId}/hqdefault.jpg",
            'url'          => "https://www.youtube.com/watch?v={$videoId}",
            'scheduledAt'  => $scheduledAt,
            'isIndonesian' => $isIndonesian,
            'masjid'       => $masjid,
            'isLive'       => $isLive,
            'isUpcoming'   => $isUpcoming,
        ];
    }

    private function parseVideoRenderer(array $renderer): ?array
    {
        $videoId = $renderer['videoId'] ?? null;
        $title   = $this->extractTitle($renderer);
        if (!$videoId || !$title) return null;

        $isLive       = $this->isLiveBadge($renderer);
        $isUpcoming   = $this->isUpcomingBadge($renderer);
        $scheduledAt  = $this->extractScheduledTime($renderer);
        $isIndonesian = $this->isIndonesian($title);
        $masjid       = $this->detectMasjid($title);

        return [
            'videoId'      => $videoId,
            'title'        => $title,
            'thumbnail'    => "https://i.ytimg.com/vi/{$videoId}/hqdefault.jpg",
            'url'          => "https://www.youtube.com/watch?v={$videoId}",
            'scheduledAt'  => $scheduledAt,
            'isIndonesian' => $isIndonesian,
            'masjid'       => $masjid,
            'isLive'       => $isLive,
            'isUpcoming'   => $isUpcoming,
        ];
    }

    private function deepFind(array $data, string $key): array
    {
        $results = [];
        foreach ($data as $k => $v) {
            if ($k === $key && is_array($v)) {
                $results[] = $v;
            } elseif (is_array($v)) {
                $results = array_merge($results, $this->deepFind($v, $key));
            }
        }
        return $results;
    }

    private function extractTitle(array $renderer): string
    {
        $title = $renderer['title']['simpleText']
            ?? $renderer['title']['runs'][0]['text']
            ?? '';
        return trim($title);
    }

    private function isLiveBadge(array $renderer): bool
    {
        $badges = $renderer['badges'] ?? [];
        foreach ($badges as $badge) {
            $label = strtoupper($badge['metadataBadgeRenderer']['label'] ?? '');
            if (str_contains($label, 'LIVE')) return true;
        }

        $overlays = $renderer['thumbnailOverlays'] ?? [];
        foreach ($overlays as $overlay) {
            $text = strtoupper(json_encode($overlay));
            if (str_contains($text, '"LIVE"') || str_contains($text, 'LIVE_NOW')) return true;
        }

        $viewText = strtolower(json_encode($renderer['viewCountText'] ?? []));
        if (str_contains($viewText, 'watching')) return true;

        return false;
    }

    private function isUpcomingBadge(array $renderer): bool
    {
        if (!empty($renderer['upcomingEventData'])) return true;

        $badges = $renderer['badges'] ?? [];
        foreach ($badges as $badge) {
            $style = strtoupper($badge['metadataBadgeRenderer']['style'] ?? '');
            $label = strtoupper($badge['metadataBadgeRenderer']['label'] ?? '');
            if (str_contains($style, 'UPCOMING') || $label === 'UPCOMING' || $label === 'SEGERA') {
                return true;
            }
        }

        $overlays = $renderer['thumbnailOverlays'] ?? [];
        foreach ($overlays as $overlay) {
            $text = strtoupper(json_encode($overlay));
            if (str_contains($text, '"UPCOMING"') || str_contains($text, 'THUMBNAIL_OVERLAY_BADGE_STYLE_UPCOMING')) return true;
        }

        return false;
    }

    private function isIndonesian(string $title): bool
    {
        return (bool) preg_match('/(indonesi[a-z]*|indonesia|إندونيسية|اندونيسية)/ui', $title);
    }

    private function extractScheduledTime(array $renderer): ?string
    {
        $startTime = $renderer['upcomingEventData']['startTime'] ?? null;
        if ($startTime) {
            return date('c', (int)$startTime);
        }

        $text = $renderer['upcomingEventData']['upcomingEventText']['runs'][0]['text'] ?? null;
        return $text;
    }

    private function detectMasjid(string $title): string
    {
        // Check for Prophet's Mosque / Masjid Nabawi (Arabic, English, French, Russian, Indonesian/Malay)
        if (preg_match('/(nabawi|madinah|medina|نبوي|prophet|proph[eé]tique|пророка)/ui', $title)) {
            return 'nabawi';
        }
        // Check for Grand Mosque / Masjidil Haram
        if (preg_match('/(haram|makkah|mecca|حرام|grand mosque|sacr[eé]e|аль-харам)/ui', $title)) {
            return 'haram';
        }
        return 'haram';
    }

}


