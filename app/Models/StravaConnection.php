<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StravaConnection extends Model
{
    protected $fillable = [
        'user_id',
        'strava_athlete_id',
        'access_token',
        'refresh_token',
        'token_expires_at',
        'athlete_data',
    ];

    protected function casts(): array
    {
        return [
            'token_expires_at' => 'datetime',
            'athlete_data'     => 'array',
        ];
    }

    /**
     * Relasi ke User.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Cek apakah access token sudah expired.
     */
    public function isTokenExpired(): bool
    {
        return $this->token_expires_at->isPast();
    }
}
