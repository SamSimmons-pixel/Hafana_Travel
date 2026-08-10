<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Admin\PaketController as AdminPaketController;
use App\Http\Controllers\Admin\GroupController as AdminGroupController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\AdminUserController as AdminCrewController;

Route::get('/', function () {
    return redirect()->route('admin.login');
});

// Fallback: Laravel's Authenticate middleware defaults to route('login').
// This ensures expired sessions redirect to admin login, not a 404/500.
Route::redirect('/login', '/admin/login')->name('login');

// Admin Auth (Guest only)
Route::middleware('guest:admin')->prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [AdminAuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AdminAuthController::class, 'login'])->name('login.submit');
});

// Admin Protected Routes
Route::middleware('auth:admin')->prefix('admin')->name('admin.')->group(function () {
    Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');

    // Paket management
    Route::resource('pakets', AdminPaketController::class);
    Route::post('pakets/{paket}/toggle', [AdminPaketController::class, 'toggleVisibility'])
        ->name('pakets.toggle');

    // Group & JSON Import management
    Route::resource('groups', AdminGroupController::class);
    Route::post('groups/{group}/append-json', [AdminGroupController::class, 'appendJson'])
        ->name('groups.append-json');

    // Jemaah User management
    Route::resource('users', AdminUserController::class);

    // Admin Crew management
    Route::resource('admins', AdminCrewController::class);
});
