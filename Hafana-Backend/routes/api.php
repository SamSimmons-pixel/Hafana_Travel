<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

// ──────────────────────────────────────────────────────
// 🎯 AUTH ROUTES (No auth middleware needed for these)
// ──────────────────────────────────────────────────────

// Register
Route::post('auth/register', [AuthController::class, 'register']);

// Login
Route::post('auth/login', [AuthController::class, 'login']);

// Logout (protected by auth middleware below)
Route::post('auth/logout', [AuthController::class, 'logout'])->middleware('auth:api');

// Get user profile (protected by auth middleware below)
Route::get('user', [AuthController::class, 'user'])->middleware('auth:api');

// ──────────────────────────────────────────────────────
// 🌍 DESTINATION ROUTES (Public access)
// ──────────────────────────────────────────────────────

// Get all destinations
Route::get('destinations', [App\Http\Controllers\Api\DestinationController::class, 'index']);

// Get single destination by ID
Route::get('destinations/{id}', [App\Http\Controllers\Api\DestinationController::class, 'show']);

// Get popular destinations (4 items)
Route::get('destinations/popular', [App\Http\Controllers\Api\DestinationController::class, 'popular']);

// ──────────────────────────────────────────────────────
// 📝 BOOKING ROUTES (Protected by auth middleware)
// ──────────────────────────────────────────────────────

// Apply all booking routes with auth middleware
Route::middleware('auth:api')->group(function () {
    // Create booking
    Route::post('bookings', [App\Http\Controllers\Api\BookingController::class, 'store']);

    // Get user's bookings
    Route::get('my-bookings', [App\Http\Controllers\Api\BookingController::class, 'myBookings']);

    // Get booking by ID
    Route::get('bookings/{id}', [App\Http\Controllers\Api\BookingController::class, 'show']);

    // Cancel booking
    Route::delete('bookings/{id}', [App\Http\Controllers\Api\BookingController::class, 'destroy']);

    // Add guest to booking
    Route::post('bookings/{id}/guests', [App\Http\Controllers\Api\BookingController::class, 'addGuest']);
});