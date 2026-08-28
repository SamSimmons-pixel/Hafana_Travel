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
            // 'screenshots/01-beranda.jpg',
            // 'screenshots/02-paket.jpg',
            // 'screenshots/03-khutbah.jpg',
            // 'screenshots/04-profil.jpg',
            // 'screenshots/05-waktu-sholat.jpg',
            // 'screenshots/06-kiblat.jpg',
            // 'screenshots/07-doa.jpg',
            // 'screenshots/08-quran.jpg',
        ];

        // ── Download Link ───────────────────────────────────────────────────────
        // Replace with your GitHub Releases APK download URL.
        // Example: 'https://github.com/yourusername/hafana-travel/releases/download/v1.0.0/hafana-travel-v1.0.0.apk'
        $apkDownloadUrl = '#'; // TODO: ganti dengan link GitHub Release APK kamu

        return view('app.landing', compact('screenshots', 'apkDownloadUrl'));
    }
}
