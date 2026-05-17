<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('recommendation_histories', function (Blueprint $table) {
            $table->id();
            $table->string('gender');
            $table->string('age_group');
            $table->string('fitness_level');
            $table->string('exercise_frequency');
            $table->string('diet');
            $table->string('top_recommendation');
            $table->decimal('top_score', 5, 2);
            $table->json('all_recommendations');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recommendation_histories');
    }
};
