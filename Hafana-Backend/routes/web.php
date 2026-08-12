<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Admin\PaketController as AdminPaketController;
use App\Http\Controllers\Admin\GaleriController as AdminGaleriController;
use App\Http\Controllers\Admin\SettingController as AdminSettingController;
use App\Http\Controllers\Admin\GroupController as AdminGroupController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\AdminUserController as AdminCrewController;

Route::get('/', function () {
    return redirect()->route('admin.login');
});

// Serve uploaded storage files (guarantees images work even if Windows symlink is absent)
Route::get('/storage/{path}', function ($path) {
    $fullPath = storage_path('app/public/' . $path);
    if (!file_exists($fullPath)) {
        abort(404);
    }
    return response()->file($fullPath);
})->where('path', '.*');

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

    // Galeri & Testimoni management
    Route::resource('galeri', AdminGaleriController::class);
    Route::post('galeri/{galeri}/toggle', [AdminGaleriController::class, 'toggleVisibility'])
        ->name('galeri.toggle');

    // Settings management (Logo)
    Route::get('settings', [AdminSettingController::class, 'index'])->name('settings.index');
    Route::post('settings', [AdminSettingController::class, 'update'])->name('settings.update');

    // Group & JSON Import management
    Route::resource('groups', AdminGroupController::class);
    Route::post('groups/{group}/append-json', [AdminGroupController::class, 'appendJson'])
        ->name('groups.append-json');

    // Jemaah User management
    Route::resource('users', AdminUserController::class);

    // Admin Crew management
    Route::resource('admins', AdminCrewController::class);

    // Article management
    Route::resource('articles', \App\Http\Controllers\Admin\ArticleController::class);
    Route::post('articles/{article}/toggle-pin', [\App\Http\Controllers\Admin\ArticleController::class, 'togglePin'])
        ->name('articles.toggle-pin');
});
