<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Models\WorkoutTodo;
use App\Models\WorkoutJournal;

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

        // Semua jurnal (terbaru di atas)
        $journals = WorkoutJournal::where('user_id', $user->id)
            ->latest()
            ->get();

        return Inertia::render('Workspace/Index', [
            'user'         => $user,
            'todayTodos'   => $todayTodos,
            'journals'     => $journals,
            'inactiveDays' => $inactiveDays,
            'inactiveAlert'=> $inactiveAlert,
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
}
