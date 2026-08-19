<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class KhutbahController extends Controller
{
    private const CHANNEL_ID = 'UCdGtxP_p0YFpBJ39Qz3hkBA'; // @Al-haramain-Sermons channel ID
    private const CACHE_TTL  = 120; // 2 minutes cache for live status

    /**
     * GET /api/khutbah/live
     *
     * Checks Al-Haramain Sermons channel for an active Indonesian live stream
     * and, if none is found, returns upcoming scheduled streams.
     *
     * Response shape:
     *  { status: 'live' | 'upcoming' | 'none', live: {...}|null, upcoming: [...] }
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
        try {
            $html = Http::withHeaders([
                'User-Agent'      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Accept-Language' => 'en-US,en;q=0.9',
            ])
                ->timeout(15)
                ->get('https://www.youtube.com/@Al-haramain-Sermons/streams')
                ->body();

            return $this->parseStreamsPage($html);
        } catch (\Throwable $e) {
            return [
                'status'   => 'error',
                'live'     => null,
                'upcoming' => [],
                'error'    => $e->getMessage(),
            ];
        }
    }

    private function parseStreamsPage(string $html): array
    {
        // Extract ytInitialData JSON from the YouTube page
        preg_match('/var ytInitialData\s*=\s*(\{.+?\});/', $html, $matches);
        if (empty($matches[1])) {
            // Try alternative pattern
            preg_match('/ytInitialData\s*=\s*(\{.+?\});/', $html, $matches);
        }

        if (empty($matches[1])) {
            return ['status' => 'none', 'live' => null, 'upcoming' => []];
        }

        $data = json_decode($matches[1], true);
        if (!$data) {
            return ['status' => 'none', 'live' => null, 'upcoming' => []];
        }

        // Walk the JSON tree to find video renderers
        $videoRenderers = $this->extractVideoRenderers($data);

        $liveVideo     = null;
        $upcomingList  = [];

        foreach ($videoRenderers as $renderer) {
            $title        = $this->extractTitle($renderer);
            $videoId      = $renderer['videoId'] ?? null;
            $isLive       = $this->isLiveBadge($renderer);
            $isUpcoming   = $this->isUpcomingBadge($renderer);
            $isIndonesian = $this->isIndonesian($title);

            if (!$videoId || !$title) continue;

            $thumbnailUrl = "https://i.ytimg.com/vi/{$videoId}/hqdefault.jpg";
            $scheduledAt  = $this->extractScheduledTime($renderer);

            $item = [
                'videoId'     => $videoId,
                'title'       => $title,
                'thumbnail'   => $thumbnailUrl,
                'url'         => "https://www.youtube.com/watch?v={$videoId}",
                'scheduledAt' => $scheduledAt,
                'isIndonesian' => $isIndonesian,
            ];

            if ($isLive && $isIndonesian && !$liveVideo) {
                $liveVideo = $item;
            } elseif ($isUpcoming) {
                $upcomingList[] = $item;
            }
        }

        if ($liveVideo) {
            return [
                'status'   => 'live',
                'live'     => $liveVideo,
                'upcoming' => $upcomingList,
            ];
        }

        if (!empty($upcomingList)) {
            return [
                'status'   => 'upcoming',
                'live'     => null,
                'upcoming' => $upcomingList,
            ];
        }

        return [
            'status'   => 'none',
            'live'     => null,
            'upcoming' => [],
        ];
    }

    /**
     * Recursively extract all videoRenderer objects from yt data
     */
    private function extractVideoRenderers(array $data): array
    {
        $results = [];
        array_walk_recursive($data, function ($value, $key) {
            // noop — we need structural, not leaf walk
        });

        return $this->deepFind($data, 'videoRenderer');
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
        // title.runs[0].text or title.simpleText
        $title = $renderer['title']['simpleText']
            ?? $renderer['title']['runs'][0]['text']
            ?? '';
        return trim($title);
    }

    private function isLiveBadge(array $renderer): bool
    {
        // Check badges for LIVE badge
        $badges = $renderer['badges'] ?? [];
        foreach ($badges as $badge) {
            $label = strtoupper($badge['metadataBadgeRenderer']['label'] ?? '');
            if (str_contains($label, 'LIVE')) return true;
        }

        // Check thumbnailOverlays for LIVE
        $overlays = $renderer['thumbnailOverlays'] ?? [];
        foreach ($overlays as $overlay) {
            $text = strtoupper(json_encode($overlay));
            if (str_contains($text, '"LIVE"') || str_contains($text, 'LIVE_NOW')) return true;
        }

        // Check viewCountText for "watching now"
        $viewText = strtolower(json_encode($renderer['viewCountText'] ?? []));
        if (str_contains($viewText, 'watching')) return true;

        return false;
    }

    private function isUpcomingBadge(array $renderer): bool
    {
        // upcomingEventData presence means it's scheduled
        if (!empty($renderer['upcomingEventData'])) return true;

        // Check badges
        $badges = $renderer['badges'] ?? [];
        foreach ($badges as $badge) {
            $style = strtoupper($badge['metadataBadgeRenderer']['style'] ?? '');
            $label = strtoupper($badge['metadataBadgeRenderer']['label'] ?? '');
            if (str_contains($style, 'UPCOMING') || str_contains($label, 'UPCOMING') || str_contains($label, 'SCHEDULED')) {
                return true;
            }
        }

        return false;
    }

    private function isIndonesian(string $title): bool
    {
        return (bool) preg_match('/\bindonesi[a-z]*/i', $title);
    }

    private function extractScheduledTime(array $renderer): ?string
    {
        // upcomingEventData.startTime is unix timestamp
        $startTime = $renderer['upcomingEventData']['startTime'] ?? null;
        if ($startTime) {
            return date('c', (int)$startTime);
        }

        // Try text
        $text = $renderer['upcomingEventData']['upcomingEventText']['runs'][0]['text'] ?? null;
        return $text;
    }
}
