<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SportRecommendationStat extends Model
{
    protected $fillable = ['sport_name', 'total_recommended'];
}
