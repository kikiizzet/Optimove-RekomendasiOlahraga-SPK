<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkoutTodo extends Model
{
    protected $fillable = [
        'user_id', 'task_name', 'sport_name',
        'is_completed', 'due_date', 'completed_at',
    ];

    protected $casts = [
        'is_completed' => 'boolean',
        'due_date'     => 'date',
        'completed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
