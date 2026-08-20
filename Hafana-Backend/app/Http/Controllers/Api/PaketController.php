<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Paket;
use Illuminate\Http\JsonResponse;

class PaketController extends Controller
{
    /**
     * GET /api/pakets
     * Returns only visible packages for the mobile app
     */
    public function index(): JsonResponse
    {
        $pakets = Paket::where('is_visible', true)
            ->orderBy('tanggal_berangkat', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $pakets,
        ]);
    }

    /**
     * GET /api/pakets/{id}
     */
    public function show(string $id): JsonResponse
    {
        $paket = Paket::where('is_visible', true)->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $paket,
        ]);
    }
}
