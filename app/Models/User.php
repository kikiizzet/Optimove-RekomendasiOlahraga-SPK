<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'profile_photo',
        'password',
        'role',
        'age',
        'date_of_birth',
        'phone',
        'address',
        'job',
        'activity_level',
        'gender',
        'height',
        'weight',
        'bmi',
        'physical_condition',
        'workout_streak',
        'last_workout_date',
        'last_recommendation',
        'pending_recommendation',
        'weekly_checklist',
        'email_reminder',
    ];

    protected $appends = [
        'profile_photo_url',
    ];

    /**
     * URL foto profil user (dari storage) atau null jika tidak ada.
     */
    public function getProfilePhotoUrlAttribute(): ?string
    {
        if ($this->profile_photo) {
            return asset('storage/' . $this->profile_photo);
        }
        return null;
    }

    public function workoutTodos(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(WorkoutTodo::class);
    }

    public function workoutJournals(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(WorkoutJournal::class);
    }

    public function testimonials(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Testimonial::class);
    }

    public function pushSubscriptions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(PushSubscription::class);
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at'      => 'datetime',
            'password'               => 'hashed',
            'last_workout_date'      => 'date',
            'pending_recommendation' => 'array',
            'weekly_checklist'       => 'array',
            'email_reminder'         => 'boolean',
        ];
    }
}
