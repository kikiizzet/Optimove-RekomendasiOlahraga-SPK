<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $request->session()->regenerate();

        $user    = Auth::user();
        $pending = session('pending_recommendation');

        // Admin langsung ke dashboard
        if ($user->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        // Jika ada pending recommendation dari guest, terapkan
        if ($pending) {
            $lastGuestHistory = \App\Models\RecommendationHistory::whereNull('user_id')
                ->latest()
                ->first();
            if ($lastGuestHistory) {
                $lastGuestHistory->update(['user_id' => $user->id]);
            }

            $user->update([
                'age'                 => $pending['age'] ?? $user->age,
                'height'              => $pending['height'] ?? $user->height,
                'weight'              => $pending['weight'] ?? $user->weight,
                'bmi'                 => $pending['bmi'] ?? $user->bmi,
                'physical_condition'  => $pending['physical_condition'] ?? $user->physical_condition,
                'last_recommendation' => $pending['top_sports'][0]['sport'] ?? $user->last_recommendation,
            ]);

            foreach (array_slice($pending['top_sports'] ?? [], 0, 3) as $s) {
                \App\Models\WorkoutTodo::firstOrCreate([
                    'user_id'   => $user->id,
                    'sport_name'=> $s['sport'],
                    'due_date'  => \Carbon\Carbon::today()->toDateString(),
                ], [
                    'task_name' => 'Lakukan ' . $s['sport'] . ' hari ini',
                ]);
            }

            session()->forget('pending_recommendation');
            return redirect()->route('workspace.index')->with('success', 'Rencana latihanmu sudah diperbarui!');
        }

        return redirect()->route('workspace.index');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
