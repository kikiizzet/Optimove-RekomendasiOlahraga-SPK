<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Tabel audit log — dicatat oleh trigger MySQL
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->string('table_name');
            $table->string('action'); // INSERT, UPDATE, DELETE
            $table->unsignedBigInteger('record_id')->nullable();
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });

        // Tabel akumulasi statistik rekomendasi — diisi oleh trigger MySQL
        Schema::create('sport_recommendation_stats', function (Blueprint $table) {
            $table->id();
            $table->string('sport_name')->unique();
            $table->unsignedBigInteger('total_recommended')->default(0);
            $table->timestamps();
        });

        // =====================================================================
        // TRIGGER 1 (DB): BEFORE INSERT on fitness_datasets
        // Tujuan: Normalisasi data — trim whitespace & kapitalisasi gender
        // =====================================================================
        DB::unprepared('DROP TRIGGER IF EXISTS trg_before_fitness_dataset_insert');
        DB::unprepared("
            CREATE TRIGGER trg_before_fitness_dataset_insert
            BEFORE INSERT ON fitness_datasets
            FOR EACH ROW
            BEGIN
                SET NEW.gender          = TRIM(NEW.gender);
                SET NEW.age_group       = TRIM(NEW.age_group);
                SET NEW.fitness_level   = TRIM(NEW.fitness_level);
                SET NEW.exercise_frequency = TRIM(NEW.exercise_frequency);
                SET NEW.diet            = TRIM(NEW.diet);
                SET NEW.sports_participated = TRIM(NEW.sports_participated);
                IF NEW.name IS NULL OR NEW.name = '' THEN
                    SET NEW.name = 'Anonymous Respondent';
                END IF;
            END
        ");

        // =====================================================================
        // TRIGGER 2 (DB): AFTER INSERT on fitness_datasets
        // Tujuan: Audit log — catat data baru yang dimasukkan
        // =====================================================================
        DB::unprepared('DROP TRIGGER IF EXISTS trg_after_fitness_dataset_insert');
        DB::unprepared("
            CREATE TRIGGER trg_after_fitness_dataset_insert
            AFTER INSERT ON fitness_datasets
            FOR EACH ROW
            BEGIN
                INSERT INTO audit_logs (table_name, action, record_id, old_values, new_values)
                VALUES (
                    'fitness_datasets',
                    'INSERT',
                    NEW.id,
                    NULL,
                    JSON_OBJECT(
                        'id', NEW.id,
                        'name', NEW.name,
                        'gender', NEW.gender,
                        'age_group', NEW.age_group,
                        'fitness_level', NEW.fitness_level,
                        'exercise_frequency', NEW.exercise_frequency,
                        'diet', NEW.diet
                    )
                );
            END
        ");

        // =====================================================================
        // TRIGGER 3 (DB): AFTER UPDATE on fitness_datasets
        // Tujuan: Audit log — catat perubahan data (old vs new)
        // =====================================================================
        DB::unprepared('DROP TRIGGER IF EXISTS trg_after_fitness_dataset_update');
        DB::unprepared("
            CREATE TRIGGER trg_after_fitness_dataset_update
            AFTER UPDATE ON fitness_datasets
            FOR EACH ROW
            BEGIN
                INSERT INTO audit_logs (table_name, action, record_id, old_values, new_values)
                VALUES (
                    'fitness_datasets',
                    'UPDATE',
                    NEW.id,
                    JSON_OBJECT(
                        'name', OLD.name,
                        'gender', OLD.gender,
                        'age_group', OLD.age_group,
                        'fitness_level', OLD.fitness_level,
                        'exercise_frequency', OLD.exercise_frequency,
                        'diet', OLD.diet
                    ),
                    JSON_OBJECT(
                        'name', NEW.name,
                        'gender', NEW.gender,
                        'age_group', NEW.age_group,
                        'fitness_level', NEW.fitness_level,
                        'exercise_frequency', NEW.exercise_frequency,
                        'diet', NEW.diet
                    )
                );
            END
        ");

        // =====================================================================
        // TRIGGER 4 (DB): AFTER DELETE on fitness_datasets
        // Tujuan: Audit log — simpan salinan data yang dihapus
        // =====================================================================
        DB::unprepared('DROP TRIGGER IF EXISTS trg_after_fitness_dataset_delete');
        DB::unprepared("
            CREATE TRIGGER trg_after_fitness_dataset_delete
            AFTER DELETE ON fitness_datasets
            FOR EACH ROW
            BEGIN
                INSERT INTO audit_logs (table_name, action, record_id, old_values, new_values)
                VALUES (
                    'fitness_datasets',
                    'DELETE',
                    OLD.id,
                    JSON_OBJECT(
                        'id', OLD.id,
                        'name', OLD.name,
                        'gender', OLD.gender,
                        'age_group', OLD.age_group,
                        'fitness_level', OLD.fitness_level,
                        'exercise_frequency', OLD.exercise_frequency,
                        'diet', OLD.diet
                    ),
                    NULL
                );
            END
        ");

        // =====================================================================
        // TRIGGER 5 (DB): AFTER INSERT on recommendation_histories
        // Tujuan: Catat log rekomendasi & update statistik olahraga (UPSERT)
        // =====================================================================
        DB::unprepared('DROP TRIGGER IF EXISTS trg_after_recommendation_history_insert');
        DB::unprepared("
            CREATE TRIGGER trg_after_recommendation_history_insert
            AFTER INSERT ON recommendation_histories
            FOR EACH ROW
            BEGIN
                INSERT INTO audit_logs (table_name, action, record_id, new_values)
                VALUES (
                    'recommendation_histories',
                    'INSERT',
                    NEW.id,
                    JSON_OBJECT(
                        'gender', NEW.gender,
                        'age_group', NEW.age_group,
                        'fitness_level', NEW.fitness_level,
                        'top_recommendation', NEW.top_recommendation,
                        'top_score', NEW.top_score
                    )
                );
                INSERT INTO sport_recommendation_stats (sport_name, total_recommended, created_at, updated_at)
                VALUES (NEW.top_recommendation, 1, NOW(), NOW())
                ON DUPLICATE KEY UPDATE
                    total_recommended = total_recommended + 1,
                    updated_at = NOW();
            END
        ");
    }

    public function down(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS trg_before_fitness_dataset_insert');
        DB::unprepared('DROP TRIGGER IF EXISTS trg_after_fitness_dataset_insert');
        DB::unprepared('DROP TRIGGER IF EXISTS trg_after_fitness_dataset_update');
        DB::unprepared('DROP TRIGGER IF EXISTS trg_after_fitness_dataset_delete');
        DB::unprepared('DROP TRIGGER IF EXISTS trg_after_recommendation_history_insert');
        Schema::dropIfExists('sport_recommendation_stats');
        Schema::dropIfExists('audit_logs');
    }
};
