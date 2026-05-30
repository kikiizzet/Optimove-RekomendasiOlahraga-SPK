<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\SportRecommendationStat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TriggerController extends Controller
{
    /**
     * Tampilkan halaman monitoring triggers & audit log.
     */
    public function index()
    {
        // Ambil daftar trigger dari MySQL secara dinamis
        $mysqlTriggers = DB::select("SHOW TRIGGERS");

        // Ambil 50 audit log terbaru
        $auditLogs = AuditLog::orderByDesc('created_at')->limit(50)->get();

        // Statistik rekomendasi olahraga dari trigger 5
        $sportStats = SportRecommendationStat::orderByDesc('total_recommended')->get();

        // Definisi 5 trigger app untuk ditampilkan secara deskriptif
        $appTriggers = [
            [
                'id'          => 1,
                'name'        => 'Form Submission & BMI Calculation',
                'event'       => 'User menekan tombol "Proses Analisis SAW"',
                'action'      => 'Sistem menghitung BMI otomatis, memfilter rekomendasi berdasarkan kondisi fisik, dan menampilkan hasil perangkingan SAW beserta status BMI.',
                'location'    => 'Frontend (React) + Backend (RecommendationController)',
                'type'        => 'app',
            ],
            [
                'id'          => 2,
                'name'        => 'Age-Based Restriction',
                'event'       => 'User menginput usia di form (onChange)',
                'action'      => 'Jika usia < 15 atau > 60 tahun, sistem menampilkan banner peringatan real-time tanpa submit ke server.',
                'location'    => 'Frontend (React state & useEffect)',
                'type'        => 'app',
            ],
            [
                'id'          => 3,
                'name'        => 'Physical Condition UI State',
                'event'       => 'User memilih kondisi fisik tertentu (misal: Cedera Lutut)',
                'action'      => 'Muncul info real-time bahwa olahraga high-impact akan diberi tanda peringatan, sedangkan olahraga low-impact di-highlight hijau.',
                'location'    => 'Frontend (React state)',
                'type'        => 'app',
            ],
            [
                'id'          => 4,
                'name'        => 'Streak & Milestone Badge',
                'event'       => 'User mencentang semua to-do olahraga hari ini sebagai selesai',
                'action'      => 'Sistem memperbarui workout_streak di database. Jika mencapai milestone (1, 3, 7, 14, 30 hari), pop-up modal badge pencapaian ditampilkan.',
                'location'    => 'Frontend (modal pop-up) + Backend (WorkspaceController::toggleTodo)',
                'type'        => 'app',
            ],
            [
                'id'          => 5,
                'name'        => 'Inactivity Reminder',
                'event'       => 'User membuka halaman /workspace setelah ≥ 3 hari tidak aktif',
                'action'      => 'Sistem menampilkan card peringatan merah di bagian atas workspace: "Sudah X hari Anda tidak berlatih. Yuk mulai lagi!"',
                'location'    => 'Backend (WorkspaceController::index) + Frontend (Workspace/Index.jsx)',
                'type'        => 'app',
            ],
        ];

        // Ringkasan 5 trigger database MySQL
        $dbTriggerDefs = [
            [
                'name'    => 'trg_before_fitness_dataset_insert',
                'event'   => 'BEFORE INSERT on fitness_datasets',
                'purpose' => 'Normalisasi data: TRIM whitespace, isi nama default jika kosong.',
            ],
            [
                'name'    => 'trg_after_fitness_dataset_insert',
                'event'   => 'AFTER INSERT on fitness_datasets',
                'purpose' => 'Catat log INSERT ke tabel audit_logs.',
            ],
            [
                'name'    => 'trg_after_fitness_dataset_update',
                'event'   => 'AFTER UPDATE on fitness_datasets',
                'purpose' => 'Catat log UPDATE (old & new values) ke tabel audit_logs.',
            ],
            [
                'name'    => 'trg_after_fitness_dataset_delete',
                'event'   => 'AFTER DELETE on fitness_datasets',
                'purpose' => 'Catat log DELETE ke tabel audit_logs sebagai backup riwayat.',
            ],
            [
                'name'    => 'trg_after_recommendation_history_insert',
                'event'   => 'AFTER INSERT on recommendation_histories',
                'purpose' => 'Catat log rekomendasi + UPSERT akumulasi ke sport_recommendation_stats.',
            ],
        ];

        // Tandai mana yang aktif dari hasil SHOW TRIGGERS
        $activeTriggerNames = collect($mysqlTriggers)->pluck('Trigger')->toArray();
        foreach ($dbTriggerDefs as &$def) {
            $def['active'] = in_array($def['name'], $activeTriggerNames);
        }

        return Inertia::render('Admin/Triggers', [
            'appTriggers'   => $appTriggers,
            'dbTriggers'    => $dbTriggerDefs,
            'auditLogs'     => $auditLogs,
            'sportStats'    => $sportStats,
        ]);
    }

    /**
     * Reset statistik rekomendasi olahraga.
     */
    public function resetStats()
    {
        SportRecommendationStat::truncate();
        return back()->with('success', 'Statistik rekomendasi olahraga berhasil direset.');
    }
}
