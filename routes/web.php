<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RecommendationController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\DatasetManagementController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [RecommendationController::class, 'index'])->name('home');
Route::post('/recommend', [RecommendationController::class, 'recommend'])->name('recommend');

Route::get('/dashboard', function () {
    return redirect()->route('admin.dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin Routes
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    
    Route::get('/datasets', [DatasetManagementController::class, 'index'])->name('datasets.index');
    Route::post('/datasets', [DatasetManagementController::class, 'store'])->name('datasets.store');
    Route::patch('/datasets/{dataset}', [DatasetManagementController::class, 'update'])->name('datasets.update');
    Route::delete('/datasets/{dataset}', [DatasetManagementController::class, 'destroy'])->name('datasets.destroy');
    Route::post('/datasets/bulk-import', [DatasetManagementController::class, 'bulkImport'])->name('datasets.bulkImport');
    Route::get('/datasets/export', [DatasetManagementController::class, 'export'])->name('datasets.export');
});

require __DIR__.'/auth.php';
