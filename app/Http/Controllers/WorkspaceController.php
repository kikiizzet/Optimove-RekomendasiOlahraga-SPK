<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Models\WorkoutTodo;
use App\Models\WorkoutJournal;
use App\Models\Testimonial;
use App\Models\RecommendationHistory;

class WorkspaceController extends Controller
{
    /**
     * Tampilkan halaman Personal Workspace.
     */
    public function index()
    {
        $user = Auth::user();

        // Trigger 5 (App): Cek inactivity > 3 hari
        $inactiveDays   = 0;
        $inactiveAlert  = false;
        if ($user->last_workout_date) {
            $inactiveDays  = Carbon::parse($user->last_workout_date)->diffInDays(Carbon::today());
            $inactiveAlert = $inactiveDays >= 3;
        }

        // To-Do List hari ini
        $todayTodos = WorkoutTodo::where('user_id', $user->id)
            ->whereDate('due_date', Carbon::today())
            ->orderBy('is_completed')
            ->orderBy('id')
            ->get();

        if ($todayTodos->isEmpty()) {
            // Gunakan rekomendasi terbaru user jika ada
            $topSports = [];
            if ($user->last_recommendation) {
                // Ambil top 3 dari riwayat rekomendasi terakhir user
                $lastHistory = RecommendationHistory::latest()->first();
                if ($lastHistory && !empty($lastHistory->all_recommendations)) {
                    $allRecs = is_array($lastHistory->all_recommendations)
                        ? $lastHistory->all_recommendations
                        : json_decode($lastHistory->all_recommendations, true);
                    $topSports = array_slice($allRecs ?? [], 0, 3);
                }
            }

            if (!empty($topSports)) {
                // Buat todo dari top 3 rekomendasi
                foreach ($topSports as $s) {
                    WorkoutTodo::create([
                        'user_id'    => $user->id,
                        'task_name'  => 'Lakukan ' . $s['sport'] . ' hari ini',
                        'sport_name' => $s['sport'],
                        'due_date'   => Carbon::today(),
                        'is_completed' => false,
                    ]);
                }
            } else {
                // Fallback: buat 1 todo generik berdasarkan rekomendasi atau default
                $sport = $user->last_recommendation ?? 'Walking or jogging';
                WorkoutTodo::create([
                    'user_id'    => $user->id,
                    'task_name'  => 'Lakukan ' . $sport . ' hari ini',
                    'sport_name' => $sport,
                    'due_date'   => Carbon::today(),
                    'is_completed' => false,
                ]);
            }

            $todayTodos = WorkoutTodo::where('user_id', $user->id)
                ->whereDate('due_date', Carbon::today())
                ->orderBy('is_completed')
                ->orderBy('id')
                ->get();
        }

        // Semua jurnal (terbaru di atas)
        $journals = WorkoutJournal::where('user_id', $user->id)
            ->latest()
            ->get();

        // Semua testimoni user (untuk status persetujuan)
        $testimonials = Testimonial::where('user_id', $user->id)
            ->latest()
            ->get();

        return Inertia::render('Workspace/Index', [
            'user'         => $user,
            'todayTodos'   => $todayTodos,
            'journals'     => $journals,
            'inactiveDays' => $inactiveDays,
            'inactiveAlert'=> $inactiveAlert,
            'testimonials' => $testimonials,
        ]);
    }

    /**
     * Tambah to-do item baru.
     */
    public function storeTodo(Request $request)
    {
        $request->validate([
            'task_name'  => 'required|string|max:255',
            'sport_name' => 'nullable|string|max:100',
            'due_date'   => 'required|date',
        ]);

        WorkoutTodo::create([
            'user_id'    => Auth::id(),
            'task_name'  => $request->task_name,
            'sport_name' => $request->sport_name,
            'due_date'   => $request->due_date,
        ]);

        return back()->with('success', 'Tugas olahraga berhasil ditambahkan!');
    }

    /**
     * Toggle selesai/belum untuk satu to-do item.
     * Trigger 4 (App): Streak & Badge Milestone.
     */
    public function toggleTodo(WorkoutTodo $todo)
    {
        if ($todo->user_id !== Auth::id()) abort(403);

        $todo->is_completed  = !$todo->is_completed;
        $todo->completed_at  = $todo->is_completed ? now() : null;
        $todo->save();

        $user = Auth::user();
        $badgeAwarded = false;
        $badgeName    = null;

        // Jika baru saja diselesaikan, cek apakah semua tugas hari ini sudah selesai
        if ($todo->is_completed) {
            $allTodayDone = WorkoutTodo::where('user_id', $user->id)
                ->whereDate('due_date', Carbon::today())
                ->where('is_completed', false)
                ->count() === 0;

            if ($allTodayDone) {
                $lastDate = $user->last_workout_date;
                $today    = Carbon::today();
                $yesterday = Carbon::yesterday();

                if ($lastDate && Carbon::parse($lastDate)->equalTo($yesterday)) {
                    $user->workout_streak = $user->workout_streak + 1;
                } elseif (!$lastDate || !Carbon::parse($lastDate)->equalTo($today)) {
                    $user->workout_streak = 1;
                }

                $user->last_workout_date = $today;
                $user->save();

                // Trigger 4 (App): Cek milestone badge
                $streakMilestones = [1 => 'Langkah Pertama', 3 => 'Pemula Disiplin', 7 => 'Pejuang Mingguan', 14 => 'Konsisten Dua Minggu', 30 => 'Juara Bulanan'];
                if (isset($streakMilestones[$user->workout_streak])) {
                    $badgeAwarded = true;
                    $badgeName    = $streakMilestones[$user->workout_streak];
                }
            }
        }

        return back()->with([
            'success'      => 'Status tugas diperbarui!',
            'badge_awarded'=> $badgeAwarded,
            'badge_name'   => $badgeName,
            'streak'       => $user->fresh()->workout_streak,
        ]);
    }

    /**
     * Hapus satu to-do item.
     */
    public function destroyTodo(WorkoutTodo $todo)
    {
        if ($todo->user_id !== Auth::id()) abort(403);
        $todo->delete();
        return back()->with('success', 'Tugas dihapus.');
    }

    /**
     * Simpan jurnal harian baru.
     */
    public function storeJournal(Request $request)
    {
        $request->validate([
            'title'   => 'required|string|max:255',
            'content' => 'required|string',
            'mood'    => 'nullable|in:great,good,okay,tired',
        ]);

        WorkoutJournal::create([
            'user_id' => Auth::id(),
            'title'   => $request->title,
            'content' => $request->content,
            'mood'    => $request->mood ?? 'good',
        ]);

        return back()->with('success', 'Jurnal berhasil disimpan!');
    }

    /**
     * Update jurnal.
     */
    public function updateJournal(Request $request, WorkoutJournal $journal)
    {
        if ($journal->user_id !== Auth::id()) abort(403);

        $request->validate([
            'title'   => 'required|string|max:255',
            'content' => 'required|string',
            'mood'    => 'nullable|in:great,good,okay,tired',
        ]);

        $journal->update($request->only('title', 'content', 'mood'));
        return back()->with('success', 'Jurnal diperbarui!');
    }

    /**
     * Hapus jurnal.
     */
    public function destroyJournal(WorkoutJournal $journal)
    {
        if ($journal->user_id !== Auth::id()) abort(403);
        $journal->delete();
        return back()->with('success', 'Jurnal dihapus.');
    }

    /**
     * Upload foto profil baru.
     */
    public function uploadPhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = Auth::user();

        if ($request->hasFile('photo')) {
            // Hapus foto lama jika ada
            if ($user->profile_photo) {
                Storage::disk('public')->delete($user->profile_photo);
            }

            // Simpan foto baru
            $path = $request->file('photo')->store('avatars', 'public');

            $user->profile_photo = $path;
            $user->save();

            return back()->with('success', 'Foto profil berhasil diperbarui!');
        }

        return back()->withErrors(['photo' => 'Gagal mengupload foto profil.']);
    }

    /**
     * Simpan status checklist jadwal mingguan.
     */
    public function updateChecklist(Request $request)
    {
        $request->validate([
            'checklist' => 'required|array',
        ]);

        $user = Auth::user();
        $user->weekly_checklist = $request->checklist;
        $user->save();

        return back();
    }

    /**
     * Update profil user (nama, jenis kelamin, dll.) dari halaman workspace.
     */
    public function updateProfile(Request $request)
    {
        $request->validate([
            'name'           => 'required|string|max:255',
            'gender'         => 'nullable|in:Male,Female',
            'date_of_birth'  => 'nullable|date',
            'phone'          => 'nullable|string|max:20',
            'address'        => 'nullable|string|max:500',
            'job'            => 'nullable|string|max:100',
            'activity_level' => 'nullable|in:Rendah,Sedang,Tinggi',
            'age'            => 'nullable|integer|min:1|max:120',
        ]);

        $user = Auth::user();
        $user->fill($request->only([
            'name', 'gender', 'date_of_birth', 'phone', 'address', 'job', 'activity_level', 'age'
        ]));
        $user->save();

        return back()->with('success', 'Profil berhasil diperbarui!');
    }
}
