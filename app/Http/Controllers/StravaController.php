<?php

namespace App\Http\Controllers;

use App\Models\StravaConnection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;
use Carbon\Carbon;

class StravaController extends Controller
{
    /**
     * Redirect user ke halaman OAuth Strava atau simulasi/demo jika credentials kosong.
     */
    public function redirect(Request $request)
    {
        // Jika client_id kosong atau ada parameter demo, arahkan ke simulasi
        if (empty(config('services.strava.client_id')) || $request->query('demo') === 'true') {
            return $this->mockCallback();
        }

        try {
            return Socialite::driver('strava')
                ->scopes(['read', 'activity:read_all'])
                ->redirect();
        } catch (\Exception $e) {
            Log::warning('Socialite Strava failed, fallback to mock: ' . $e->getMessage());
            return $this->mockCallback();
        }
    }

    /**
     * Handle callback dari Strava setelah user approve.
     */
    public function callback()
    {
        try {
            $stravaUser = Socialite::driver('strava')->user();

            $user = Auth::user();

            // Simpan atau update koneksi Strava
            StravaConnection::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'strava_athlete_id' => $stravaUser->getId(),
                    'access_token'      => $stravaUser->token,
                    'refresh_token'     => $stravaUser->refreshToken,
                    'token_expires_at'  => Carbon::createFromTimestamp($stravaUser->expiresIn),
                    'athlete_data'      => [
                        'name'       => $stravaUser->getName(),
                        'avatar'     => $stravaUser->getAvatar(),
                        'username'   => $stravaUser->getNickname(),
                    ],
                ]
            );

            return redirect()->route('workspace.index')
                ->with('success', '✅ Akun Strava berhasil dihubungkan!');

        } catch (\Exception $e) {
            Log::error('Strava OAuth Error: ' . $e->getMessage());

            return redirect()->route('workspace.index')
                ->withErrors(['strava' => 'Gagal menghubungkan akun Strava. Silakan coba lagi.']);
        }
    }

    /**
     * Simulasi callback Strava untuk keperluan demo/presentasi (tanpa API credentials).
     */
    public function mockCallback()
    {
        try {
            $user = Auth::user();

            StravaConnection::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'strava_athlete_id' => '12345678',
                    'access_token'      => 'mock_access_token',
                    'refresh_token'     => 'mock_refresh_token',
                    'token_expires_at'  => Carbon::now()->addHours(6),
                    'athlete_data'      => [
                        'name'       => $user->name . ' (Strava Demo)',
                        'avatar'     => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
                        'username'   => strtolower(str_replace(' ', '', $user->name)) . '_strava',
                    ],
                ]
            );

            return redirect()->route('workspace.index')
                ->with('success', '✅ Akun Strava (Simulasi Demo) berhasil dihubungkan!');

        } catch (\Exception $e) {
            Log::error('Strava Mock Callback Error: ' . $e->getMessage());

            return redirect()->route('workspace.index')
                ->withErrors(['strava' => 'Gagal menghubungkan akun Strava simulasi.']);
        }
    }

    /**
     * Putuskan koneksi Strava.
     */
    public function disconnect()
    {
        $user = Auth::user();
        $connection = $user->stravaConnection;

        if ($connection) {
            if ($connection->access_token !== 'mock_access_token') {
                // Opsional: revoke token di Strava
                try {
                    Http::post('https://www.strava.com/oauth/deauthorize', [
                        'access_token' => $connection->access_token,
                    ]);
                } catch (\Exception $e) {
                    Log::warning('Strava deauthorize failed: ' . $e->getMessage());
                }
            }

            $connection->delete();
        }

        return back()->with('success', 'Koneksi Strava berhasil diputus.');
    }

    /**
     * Ambil aktivitas terbaru dari Strava API (atau data mock jika simulasi).
     *
     * @param StravaConnection $connection
     * @param int $limit
     * @return array
     */
    public static function fetchActivities(StravaConnection $connection, int $limit = 5): array
    {
        // Jika koneksi mock, kembalikan data mock
        if ($connection->access_token === 'mock_access_token') {
            return self::getMockActivities($limit);
        }

        // Refresh token jika expired
        if ($connection->isTokenExpired()) {
            $connection = self::refreshToken($connection);
            if (!$connection) {
                return [];
            }
        }

        try {
            $response = Http::withToken($connection->access_token)
                ->get('https://www.strava.com/api/v3/athlete/activities', [
                    'per_page' => $limit,
                    'page'     => 1,
                ]);

            if ($response->successful()) {
                return collect($response->json())->map(function ($activity) {
                    return [
                        'id'           => $activity['id'],
                        'name'         => $activity['name'],
                        'type'         => $activity['type'] ?? $activity['sport_type'] ?? 'Workout',
                        'distance'     => round(($activity['distance'] ?? 0) / 1000, 2), // km
                        'moving_time'  => $activity['moving_time'] ?? 0, // seconds
                        'elapsed_time' => $activity['elapsed_time'] ?? 0,
                        'calories'     => $activity['calories'] ?? null,
                        'start_date'   => $activity['start_date_local'] ?? $activity['start_date'],
                        'average_speed'     => round(($activity['average_speed'] ?? 0) * 3.6, 1), // m/s to km/h
                        'max_heartrate'     => $activity['max_heartrate'] ?? null,
                        'average_heartrate' => $activity['average_heartrate'] ?? null,
                        'total_elevation_gain' => $activity['total_elevation_gain'] ?? 0,
                    ];
                })->toArray();
            }

            Log::warning('Strava API error: ' . $response->status() . ' - ' . $response->body());
            return [];

        } catch (\Exception $e) {
            Log::error('Strava fetch activities error: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Data simulasi aktivitas olahraga untuk keperluan demo.
     */
    private static function getMockActivities(int $limit = 5): array
    {
        $activities = [
            [
                'id'           => 10000001,
                'name'         => 'Pagi Hari Lari Santai 🏃',
                'type'         => 'Run',
                'distance'     => 5.24, // km
                'moving_time'  => 1845, // 30 mins 45 secs
                'elapsed_time' => 1920,
                'calories'     => 420,
                'start_date'   => Carbon::now()->subHours(2)->toIso8601String(),
                'average_speed'     => 10.2, // km/h
                'max_heartrate'     => 165,
                'average_heartrate' => 142,
                'total_elevation_gain' => 35,
            ],
            [
                'id'           => 10000002,
                'name'         => 'Gowes Sore Keliling Kota 🚴',
                'type'         => 'Ride',
                'distance'     => 15.80, // km
                'moving_time'  => 3120, // 52 mins
                'elapsed_time' => 3450,
                'calories'     => 580,
                'start_date'   => Carbon::now()->subDays(1)->subHours(4)->toIso8601String(),
                'average_speed'     => 18.2, // km/h
                'max_heartrate'     => 150,
                'average_heartrate' => 128,
                'total_elevation_gain' => 120,
            ],
            [
                'id'           => 10000003,
                'name'         => 'Renang Gaya Bebas di Kolam 🏊',
                'type'         => 'Swim',
                'distance'     => 1.50, // km
                'moving_time'  => 2700, // 45 mins
                'elapsed_time' => 3000,
                'calories'     => 490,
                'start_date'   => Carbon::now()->subDays(3)->toIso8601String(),
                'average_speed'     => 2.0, // km/h
                'max_heartrate'     => 158,
                'average_heartrate' => 135,
                'total_elevation_gain' => 0,
            ],
            [
                'id'           => 10000004,
                'name'         => 'Latihan Kekuatan Otot (Gym) 🏋️',
                'type'         => 'WeightTraining',
                'distance'     => 0, // km
                'moving_time'  => 3600, // 1 hour
                'elapsed_time' => 3600,
                'calories'     => 320,
                'start_date'   => Carbon::now()->subDays(5)->toIso8601String(),
                'average_speed'     => 0, // km/h
                'max_heartrate'     => 145,
                'average_heartrate' => 115,
                'total_elevation_gain' => 0,
            ],
            [
                'id'           => 10000005,
                'name'         => 'Lari Sore Akhir Pekan 🏃',
                'type'         => 'Run',
                'distance'     => 8.10, // km
                'moving_time'  => 2940, // 49 mins
                'elapsed_time' => 3050,
                'calories'     => 670,
                'start_date'   => Carbon::now()->subDays(7)->toIso8601String(),
                'average_speed'     => 9.9, // km/h
                'max_heartrate'     => 170,
                'average_heartrate' => 148,
                'total_elevation_gain' => 50,
            ],
        ];

        return array_slice($activities, 0, $limit);
    }

    /**
     * Refresh expired Strava access token.
     *
     * @param StravaConnection $connection
     * @return StravaConnection|null
     */
    private static function refreshToken(StravaConnection $connection): ?StravaConnection
    {
        if ($connection->access_token === 'mock_access_token') {
            $connection->update([
                'token_expires_at' => Carbon::now()->addHours(6),
            ]);
            return $connection->fresh();
        }

        try {
            $response = Http::post('https://www.strava.com/oauth/token', [
                'client_id'     => config('services.strava.client_id'),
                'client_secret' => config('services.strava.client_secret'),
                'grant_type'    => 'refresh_token',
                'refresh_token' => $connection->refresh_token,
            ]);

            if ($response->successful()) {
                $data = $response->json();

                $connection->update([
                    'access_token'     => $data['access_token'],
                    'refresh_token'    => $data['refresh_token'],
                    'token_expires_at' => Carbon::createFromTimestamp($data['expires_at']),
                ]);

                return $connection->fresh();
            }

            Log::error('Strava token refresh failed: ' . $response->body());
            return null;

        } catch (\Exception $e) {
            Log::error('Strava token refresh exception: ' . $e->getMessage());
            return null;
        }
    }
}
