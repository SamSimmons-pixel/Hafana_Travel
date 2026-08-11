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
}
