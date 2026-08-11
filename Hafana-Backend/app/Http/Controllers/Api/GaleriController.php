<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Galeri;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GaleriController extends Controller
{
    /**
     * GET /api/galeri?type=galeri&page=1&per_page=30
     * Returns visible items, type-filtered, paginated.
     */
    public function index(Request $request): JsonResponse
    {
        $type    = $request->query('type');         // 'galeri' | 'testimoni' | null (all)
        $perPage = min((int) $request->query('per_page', 30), 100);

        $query = Galeri::where('is_visible', true)
            ->orderBy('urutan', 'asc')
            ->orderBy('created_at', 'desc');

        if ($type && in_array($type, ['galeri', 'testimoni'])) {
            $query->where('type', $type);
        }

        $paginated = $query->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data'   => $paginated->items(),
            'meta'   => [
                'current_page' => $paginated->currentPage(),
                'last_page'    => $paginated->lastPage(),
                'total'        => $paginated->total(),
                'per_page'     => $paginated->perPage(),
                'has_more'     => $paginated->hasMorePages(),
            ],
        ]);
    }

    /**
     * GET /api/galeri/youtube-playlist
     * Dynamically fetches real video items from the YouTube playlist and caches for 1 hour.
     */
    public function youtubePlaylist(Request $request): JsonResponse
    {
        $playlistId = $request->query('playlist_id', 'PLFHRRlk0D7jsc9j-8ikXXXNrLLIeBO9V_');
        $cacheKey   = 'yt_playlist_' . $playlistId;

        $videos = \Illuminate\Support\Facades\Cache::remember($cacheKey, 3600, function () use ($playlistId) {
            try {
                $response = \Illuminate\Support\Facades\Http::withHeaders([
                    'User-Agent'      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept-Language' => 'id-ID,id;q=0.9,en;q=0.8',
                ])->timeout(10)->get("https://www.youtube.com/playlist?list={$playlistId}");

                if ($response->successful()) {
                    $html = $response->body();
                    preg_match_all('/"videoId":"([a-zA-Z0-9_-]{11})"/', $html, $matches);
                    $uniqueIds = array_values(array_unique($matches[1] ?? []));

                    if (!empty($uniqueIds)) {
                        $result = [];
                        foreach ($uniqueIds as $idx => $vId) {
                            $result[] = [
                                'id'        => (string) ($idx + 1),
                                'videoId'   => $vId,
                                'title'     => 'Testimoni Jamaah Hafana #' . ($idx + 1),
                                'duration'  => '',
                                'tag'       => 'Testimoni',
                                'thumbnail' => "https://i.ytimg.com/vi/{$vId}/hqdefault.jpg",
                            ];
                        }
                        return $result;
                    }
                }
            } catch (\Throwable $e) {
                // Log error if needed
            }
            return [];
        });

        return response()->json([
            'status' => 'success',
            'data'   => $videos,
        ]);
    }
}
