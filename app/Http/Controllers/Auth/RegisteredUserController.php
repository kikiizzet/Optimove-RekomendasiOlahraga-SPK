<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));
        Auth::login($user);

        // Ambil pending recommendation dari session (ditaruh saat guest submit form)
        $pending = session('pending_recommendation');
        if ($pending) {
            $historyId = $pending['history_id'] ?? null;
            if ($historyId) {
                $guestHistory = \App\Models\RecommendationHistory::find($historyId);
                if ($guestHistory) {
                    $guestHistory->update(['user_id' => $user->id]);
                }
            } else {
                $lastGuestHistory = \App\Models\RecommendationHistory::whereNull('user_id')
                    ->latest()
                    ->first();
                if ($lastGuestHistory) {
                    $lastGuestHistory->update(['user_id' => $user->id]);
                }
            }

            $user->update([
                'age'                 => $pending['age'] ?? null,
                'height'              => $pending['height'] ?? null,
                'weight'              => $pending['weight'] ?? null,
                'bmi'                 => $pending['bmi'] ?? null,
                'physical_condition'  => $pending['physical_condition'] ?? 'none',
                'last_recommendation' => $pending['top_sports'][0]['sport'] ?? null,
            ]);

            // Auto-generate to-do dari Top 3 rekomendasi
            foreach (array_slice($pending['top_sports'] ?? [], 0, 3) as $s) {
                \App\Models\WorkoutTodo::create([
                    'user_id'    => $user->id,
                    'task_name'  => 'Lakukan ' . $s['sport'] . ' hari ini',
                    'sport_name' => $s['sport'],
                    'due_date'   => \Carbon\Carbon::today(),
                ]);
            }

            session()->forget('pending_recommendation');
            return redirect()->route('workspace.index')->with('success', 'Selamat datang! Rencana latihanmu sudah siap 🎉');
        }

        return redirect()->route('workspace.index');
    }
}
