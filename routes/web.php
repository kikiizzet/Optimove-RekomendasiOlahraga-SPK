<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RecommendationController;
use App\Http\Controllers\WorkspaceController;
use App\Http\Controllers\TestimonialController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\DatasetManagementController;
use App\Http\Controllers\Admin\TriggerController;
use App\Http\Controllers\Admin\TestimonialAdminController;
use Illuminate\Support\Facades\Route;

Route::get('/', [RecommendationController::class, 'index'])->name('home');
Route::post('/recommend', [RecommendationController::class, 'recommend'])->name('recommend');
// Fallback: GET /recommend → redirect ke home (mencegah 405 saat refresh setelah POST)
Route::get('/recommend', fn() => redirect()->route('home'));

Route::get('/dashboard', function () {
    return redirect()->route('admin.dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// ─── Personal Workspace (User Biasa) ─────────────────────────────────────────
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Workspace
    Route::get('/workspace', [WorkspaceController::class, 'index'])->name('workspace.index');

    // To-Do List
    Route::post('/workspace/todos', [WorkspaceController::class, 'storeTodo'])->name('workspace.todos.store');
    Route::patch('/workspace/todos/{todo}/toggle', [WorkspaceController::class, 'toggleTodo'])->name('workspace.todos.toggle');
    Route::delete('/workspace/todos/{todo}', [WorkspaceController::class, 'destroyTodo'])->name('workspace.todos.destroy');

    // Journal
    Route::post('/workspace/journals', [WorkspaceController::class, 'storeJournal'])->name('workspace.journals.store');
    Route::patch('/workspace/journals/{journal}', [WorkspaceController::class, 'updateJournal'])->name('workspace.journals.update');
    Route::delete('/workspace/journals/{journal}', [WorkspaceController::class, 'destroyJournal'])->name('workspace.journals.destroy');

    // Testimonials
    Route::post('/workspace/testimonials', [TestimonialController::class, 'store'])->name('workspace.testimonials.store');
    Route::delete('/workspace/testimonials/{testimonial}', [TestimonialController::class, 'destroy'])->name('workspace.testimonials.destroy');

    // Profile Photo Upload
    Route::post('/workspace/profile/photo', [WorkspaceController::class, 'uploadPhoto'])->name('workspace.profile.photo');

    // Weekly Checklist
    Route::patch('/workspace/checklist', [WorkspaceController::class, 'updateChecklist'])->name('workspace.checklist.update');

    // Profile Update (inline from workspace)
    Route::patch('/workspace/profile', [WorkspaceController::class, 'updateProfile'])->name('workspace.profile.update');
});

// ─── Admin Routes ─────────────────────────────────────────────────────────────
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    Route::get('/datasets', [DatasetManagementController::class, 'index'])->name('datasets.index');
    Route::post('/datasets', [DatasetManagementController::class, 'store'])->name('datasets.store');
    Route::patch('/datasets/{dataset}', [DatasetManagementController::class, 'update'])->name('datasets.update');
    Route::delete('/datasets/{dataset}', [DatasetManagementController::class, 'destroy'])->name('datasets.destroy');
    Route::post('/datasets/bulk-import', [DatasetManagementController::class, 'bulkImport'])->name('datasets.bulkImport');
    Route::get('/datasets/export', [DatasetManagementController::class, 'export'])->name('datasets.export');

    // Triggers & Audit Log
    Route::get('/triggers', [TriggerController::class, 'index'])->name('triggers.index');
    Route::post('/triggers/reset-stats', [TriggerController::class, 'resetStats'])->name('triggers.resetStats');

    // Testimonials Management
    Route::get('/testimonials', [TestimonialAdminController::class, 'index'])->name('testimonials.index');
    Route::patch('/testimonials/{testimonial}/approve', [TestimonialAdminController::class, 'approve'])->name('testimonials.approve');
    Route::delete('/testimonials/{testimonial}', [TestimonialAdminController::class, 'destroy'])->name('testimonials.destroy');
});

require __DIR__.'/auth.php';
