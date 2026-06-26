<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RecommendationController;
use App\Http\Controllers\WorkspaceController;
use App\Http\Controllers\TestimonialController;
use App\Http\Controllers\PushNotificationController;
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
    if (auth()->user()->role === 'admin') {
        return redirect()->route('admin.dashboard');
    }
    return redirect()->route('workspace.index');
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

    // Activate/change program
    Route::post('/workspace/program/activate', [WorkspaceController::class, 'updateActiveProgram'])->name('workspace.program.activate');

    // Toggle Email Reminder
    Route::post('/workspace/profile/toggle-email-reminder', [WorkspaceController::class, 'toggleEmailReminder'])->name('workspace.profile.toggle-email-reminder');

    // Push Notifications
    Route::get('/api/push/public-key', [PushNotificationController::class, 'getPublicKey']);
    Route::post('/api/push/subscribe', [PushNotificationController::class, 'subscribe']);
    Route::post('/api/push/unsubscribe', [PushNotificationController::class, 'unsubscribe']);
    Route::post('/api/push/test', [PushNotificationController::class, 'sendTest']);

    // Strava Integration
    Route::get('/auth/strava/redirect', [\App\Http\Controllers\StravaController::class, 'redirect'])->name('strava.redirect');
    Route::get('/auth/strava/callback', [\App\Http\Controllers\StravaController::class, 'callback'])->name('strava.callback');
    Route::post('/strava/disconnect', [\App\Http\Controllers\StravaController::class, 'disconnect'])->name('strava.disconnect');
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
