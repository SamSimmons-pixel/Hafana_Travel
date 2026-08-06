<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Admin\PaketController as AdminPaketController;

Route::get('/', function () {
    return redirect()->route('admin.login');
});

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
});
