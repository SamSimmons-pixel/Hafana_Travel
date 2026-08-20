<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;

class SettingController extends Controller
{
    /**
     * GET /api/settings
     * Returns app settings including app_logo
     */
    public function index(): JsonResponse
    {
        $appLogo = Setting::get('app_logo');

        return response()->json([
            'status' => 'success',
            'data'   => [
                'app_logo' => $appLogo,
            ],
        ]);
    }
}
