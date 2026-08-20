<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    /**
     * GET /api/articles?per_page=10&page=1&limit=5
     * Paginated list of published articles, ordered by published_at DESC.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->query('per_page', $request->query('limit', 10));
        $perPage = min(max($perPage, 1), 50);

        $paginated = Article::where('is_published', true)
            ->orderBy('is_pinned', 'desc')
            ->orderBy('published_at', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

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
     * GET /api/articles/{id}
     * Returns single article details (by ID or slug).
     */
    public function show(string $id): JsonResponse
    {
        $article = Article::where('is_published', true)
            ->where(function ($q) use ($id) {
                if (is_numeric($id)) {
                    $q->where('id', $id)->orWhere('slug', $id);
                } else {
                    $q->where('slug', $id);
                }
            })
            ->first();

        if (!$article) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Artikel tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data'   => $article,
        ]);
    }
}
