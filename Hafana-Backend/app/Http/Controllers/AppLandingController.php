<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AppLandingController extends Controller
{
    /**
     * GET /  (app.hafanatravel.com or /app path fallback)
     *
     * Promotional landing page for Hafana Tour & Travel Android app.
     * No authentication required — public showcase only.
     */
    public function index()
    {
        // ── App Screenshots ─────────────────────────────────────────────────────
        // To add screenshots: upload the image files to public/images/app/
        // then add the filename to the array below.
        // Example: 'screenshots/01-beranda.jpg'
        //
        // File path on server: public/images/app/screenshots/01-beranda.jpg
        // URL will be: https://app.hafanatravel.com/images/app/screenshots/01-beranda.jpg
        //
        $screenshots = [
            'mockupapp-img/mockup (1).jpg',
            'mockupapp-img/mockup (2).jpg',
            'mockupapp-img/mockup (3).jpg',
            'mockupapp-img/mockup (4).jpg',
            'mockupapp-img/mockup (5).jpg',
            'mockupapp-img/mockup (6).jpg',
            'mockupapp-img/mockup (7).jpg',
            'mockupapp-img/mockup (8).jpg',
        ];

        // ── Download Link ───────────────────────────────────────────────────────
        // Replace with your GitHub Releases APK download URL.
        // Example: 'https://github.com/yourusername/hafana-travel/releases/download/v1.0.0/hafana-travel-v1.0.0.apk'
        $apkDownloadUrl = 'https://github.com/SamSimmons-pixel/Hafana_Travel/releases/download/v1.0.0/Hafana.apk';

        return view('app.landing', compact('screenshots', 'apkDownloadUrl'));
    }
}
