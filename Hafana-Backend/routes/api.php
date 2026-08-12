<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

// Login
Route::post('auth/login', [AuthController::class, 'login'])->middleware('throttle: 10,1');

// Logout 
Route::post('auth/logout', [AuthController::class, 'logout'])->middleware('throttle:10,1')->middleware('auth:sanctum');

// Get user profile (protected by auth middleware below)
Route::get('user', [AuthController::class, 'me'])->middleware('auth:sanctum');

// ──────────────────────────────────────────────────────
// ⚙️ SETTINGS ROUTE (Public - mobile app)
// ──────────────────────────────────────────────────────
Route::get('settings', [\App\Http\Controllers\Api\SettingController::class, 'index']);

// ──────────────────────────────────────────────────────
// 🖼️ GALERI & TESTIMONI ROUTES (Public - mobile app)
// ──────────────────────────────────────────────────────
Route::get('galeri', [\App\Http\Controllers\Api\GaleriController::class, 'index']);
Route::get('galeri/youtube-playlist', [\App\Http\Controllers\Api\GaleriController::class, 'youtubePlaylist']);

// ──────────────────────────────────────────────────────
// 📦 PAKET UMRAH ROUTES (Public - mobile app)
// ──────────────────────────────────────────────────────
Route::get('pakets', [\App\Http\Controllers\Api\PaketController::class, 'index']);
Route::get('pakets/{id}', [\App\Http\Controllers\Api\PaketController::class, 'show']);

// ──────────────────────────────────────────────────────
// 📰 ARTIKEL ROUTES (Public - mobile app)
// ──────────────────────────────────────────────────────
Route::get('articles', [\App\Http\Controllers\Api\ArticleController::class, 'index']);
Route::get('articles/{id}', [\App\Http\Controllers\Api\ArticleController::class, 'show']);


// // ──────────────────────────────────────────────────────
// // 🌍 DESTINATION ROUTES (Public access)
// // ──────────────────────────────────────────────────────

// // Get all destinations
// Route::get('destinations', [App\Http\Controllers\Api\DestinationController::class, 'index']);

// // Get single destination by ID
// Route::get('destinations/{id}', [App\Http\Controllers\Api\DestinationController::class, 'show']);

// // Get popular destinations (4 items)
// Route::get('destinations/popular', [App\Http\Controllers\Api\DestinationController::class, 'popular']);

// // ──────────────────────────────────────────────────────
// // 📝 BOOKING ROUTES (Protected by auth middleware)
// // ──────────────────────────────────────────────────────

// // Apply all booking routes with auth middleware
// Route::middleware('auth:api')->group(function () {
//     // Create booking
//     Route::post('bookings', [App\Http\Controllers\Api\BookingController::class, 'store']);

//     // Get user's bookings
//     Route::get('my-bookings', [App\Http\Controllers\Api\BookingController::class, 'myBookings']);

//     // Get booking by ID
//     Route::get('bookings/{id}', [App\Http\Controllers\Api\BookingController::class, 'show']);

//     // Cancel booking
//     Route::delete('bookings/{id}', [App\Http\Controllers\Api\BookingController::class, 'destroy']);

//     // Add guest to booking
//     Route::post('bookings/{id}/guests', [App\Http\Controllers\Api\BookingController::class, 'addGuest']);
// });