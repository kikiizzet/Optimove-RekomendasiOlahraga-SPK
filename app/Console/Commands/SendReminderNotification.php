<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Mail\WorkoutReminderMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Console\Command;

class SendReminderNotification extends Command
{
    protected $signature = 'reminder:send';
    protected $description = 'Kirim email reminder pagi untuk workout schedule';

    public function handle()
    {
        $this->info('🔔 Mengirim email reminder...');

        // Ambil semua user biasa (bukan admin) yang punya jadwal workout dan mengaktifkan email reminder
        $users = User::whereNotNull('last_recommendation')
            ->where('email_reminder', true)
            ->where('role', '!=', 'admin')
            ->get();

        if ($users->isEmpty()) {
            $this->warn('❌ Tidak ada user dengan jadwal workout yang mengaktifkan email reminder');
            return;
        }

        $today = now();
        $dayName = $this->getDayInIndonesian($today->dayName);

        $sentCount = 0;
        $failedCount = 0;

        // Skip sending on Sunday since it's a total rest day for all programs
        if ($dayName === 'Minggu') {
            $this->info('Hari ini Minggu (Istirahat Total), tidak ada reminder dikirim.');
            return;
        }

        foreach ($users as $user) {
            // Cek apakah hari ini sudah diselesaikan (true di weekly_checklist)
            $checklist = $user->weekly_checklist ?? [];
            
            if (isset($checklist[$dayName]) && $checklist[$dayName] === true) {
                continue; // Sudah selesai hari ini, tidak perlu dikirim
            }

            // Ambil informasi program
            $programInfo = $this->getProgramInfo($user->last_recommendation);

            try {
                Mail::to($user->email)->send(new WorkoutReminderMail($user, $programInfo, $dayName));
                $sentCount++;
            } catch (\Exception $e) {
                \Log::error("Gagal mengirim email reminder ke {$user->email}: " . $e->getMessage());
                $failedCount++;
            }
        }

        $this->info("✅ Email terkirim: {$sentCount}");
        if ($failedCount > 0) {
            $this->warn("❌ Email gagal: {$failedCount}");
        }
    }

    /**
     * Convert hari ke bahasa Indonesia
     */
    private function getDayInIndonesian($dayName)
    {
        $days = [
            'Monday' => 'Senin',
            'Tuesday' => 'Selasa',
            'Wednesday' => 'Rabu',
            'Thursday' => 'Kamis',
            'Friday' => 'Jumat',
            'Saturday' => 'Sabtu',
            'Sunday' => 'Minggu',
        ];

        return $days[$dayName] ?? $dayName;
    }

    /**
     * Dapatkan info program berdasarkan sport name
     */
    private function getProgramInfo($sportName)
    {
        $programs = [
            'jogging' => ['activity' => 'Jogging', 'duration' => '30-45 menit'],
            'gym' => ['activity' => 'Gym / Fitness', 'duration' => '45 menit'],
            'yoga' => ['activity' => 'Yoga', 'duration' => '30-40 menit'],
            'cycling' => ['activity' => 'Bersepeda', 'duration' => '30-50 menit'],
            'swimming' => ['activity' => 'Renang', 'duration' => '25-45 menit'],
            'running' => ['activity' => 'Berlari', 'duration' => '30-45 menit'],
            'football' => ['activity' => 'Sepak Bola', 'duration' => '45-60 menit'],
            'soccer' => ['activity' => 'Sepak Bola', 'duration' => '45-60 menit'],
            'sepak bola' => ['activity' => 'Sepak Bola', 'duration' => '45-60 menit'],
            'basketball' => ['activity' => 'Bola Basket', 'duration' => '45-60 menit'],
            'bola basket' => ['activity' => 'Bola Basket', 'duration' => '45-60 menit'],
            'volleyball' => ['activity' => 'Bola Voli', 'duration' => '40-60 menit'],
            'bola voli' => ['activity' => 'Bola Voli', 'duration' => '40-60 menit'],
            'badminton' => ['activity' => 'Badminton', 'duration' => '30-45 menit'],
            'team' => ['activity' => 'Olahraga Tim', 'duration' => '45-60 menit'],
            'esport' => ['activity' => 'Olahraga Tim', 'duration' => '45-60 menit'],
        ];

        $key = strtolower($sportName);
        foreach ($programs as $k => $v) {
            if (str_contains($key, $k)) {
                return $v;
            }
        }

        return ['activity' => 'Workout', 'duration' => '30 menit'];
    }
}
