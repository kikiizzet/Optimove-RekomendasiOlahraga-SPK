<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tambahkan kolom data fisik dan workout tracking ke tabel users
        Schema::table('users', function (Blueprint $table) {
            $table->integer('age')->nullable()->after('role');
            $table->decimal('height', 5, 1)->nullable()->after('age'); // cm
            $table->decimal('weight', 5, 1)->nullable()->after('height'); // kg
            $table->decimal('bmi', 5, 2)->nullable()->after('weight');
            $table->string('physical_condition')->nullable()->after('bmi'); // none, knee_injury, asthma, heart
            $table->integer('workout_streak')->default(0)->after('physical_condition');
            $table->date('last_workout_date')->nullable()->after('workout_streak');
            $table->string('last_recommendation')->nullable()->after('last_workout_date');
            $table->json('pending_recommendation')->nullable()->after('last_recommendation');
        });

        // Tabel to-do list olahraga
        Schema::create('workout_todos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('task_name');
            $table->string('sport_name')->nullable();
            $table->boolean('is_completed')->default(false);
            $table->date('due_date');
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });

        // Tabel jurnal harian olahraga (Notion-style)
        Schema::create('workout_journals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('content');
            $table->string('mood')->nullable(); // great, good, okay, tired
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workout_journals');
        Schema::dropIfExists('workout_todos');
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'age', 'height', 'weight', 'bmi', 'physical_condition',
                'workout_streak', 'last_workout_date', 'last_recommendation', 'pending_recommendation',
            ]);
        });
    }
};
