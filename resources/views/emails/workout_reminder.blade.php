<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reminder Latihan Harian - Optimove</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f7faf6;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(32, 59, 20, 0.05);
            border: 1px solid #e2ebd9;
        }
        .header {
            background-color: #203b14;
            padding: 32px;
            text-align: center;
            position: relative;
        }
        .header h1 {
            color: #ffffff;
            font-size: 24px;
            font-weight: 800;
            margin: 0;
            letter-spacing: -0.02em;
        }
        .header p {
            color: #d7e8b5;
            font-size: 13px;
            margin: 8px 0 0 0;
            font-weight: 500;
        }
        .content {
            padding: 40px 32px;
        }
        .greeting {
            font-size: 18px;
            font-weight: 700;
            color: #0a1d08;
            margin-bottom: 16px;
        }
        .intro-text {
            font-size: 14px;
            color: #4b5563;
            line-height: 1.6;
            margin-bottom: 24px;
        }
        .workout-card {
            background-color: #edf6ed;
            border: 1px solid #d7e8b5;
            border-radius: 16px;
            padding: 20px 24px;
            margin-bottom: 32px;
        }
        .workout-title {
            font-size: 12px;
            font-weight: 800;
            text-transform: uppercase;
            color: #203b14;
            letter-spacing: 0.05em;
            margin-bottom: 4px;
        }
        .workout-activity {
            font-size: 18px;
            font-weight: 800;
            color: #0a1d08;
            margin-bottom: 2px;
        }
        .workout-duration {
            font-size: 13px;
            color: #556b43;
            font-weight: 600;
        }
        .cta-button {
            display: inline-block;
            background-color: #203b14;
            color: #ffffff !important;
            text-decoration: none;
            padding: 14px 28px;
            font-size: 14px;
            font-weight: 700;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(32, 59, 20, 0.15);
        }
        .cta-container {
            text-align: center;
            margin-bottom: 32px;
        }
        .footer {
            background-color: #f7faf6;
            padding: 24px 32px;
            text-align: center;
            border-top: 1px solid #edf2e8;
        }
        .footer p {
            font-size: 11px;
            color: #8c9c80;
            line-height: 1.5;
            margin: 0;
        }
        .footer a {
            color: #203b14;
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>OPTIMOVE</h1>
            <p>Jurnal & Rekomendasi Olahraga Personal Anda</p>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">Halo, {{ $user->name }}! 👋</div>
            <div class="intro-text">
                Semangat pagi! Hari ini adalah hari <strong>{{ $dayName }}</strong>. Jangan lupa untuk tetap konsisten menjaga kebugaran tubuh Anda. Berikut adalah jadwal latihan yang direkomendasikan untuk Anda hari ini:
            </div>

            <!-- Workout Card -->
            <div class="workout-card">
                <div class="workout-title">Rekomendasi Hari Ini</div>
                <div class="workout-activity">{{ $programInfo['activity'] }}</div>
                <div class="workout-duration">⏱️ Durasi: {{ $programInfo['duration'] }}</div>
            </div>

            <!-- CTA -->
            <div class="cta-container">
                <a href="{{ config('app.url') }}/workspace?tab=program" class="cta-button">
                    Mulai Latihan Sekarang
                </a>
            </div>

            <div class="intro-text" style="margin-bottom: 0;">
                Setelah selesai melakukan latihan, pastikan untuk mengisi checklist harian di personal workspace Anda untuk menjaga konsistensi dan melacak streak mingguan Anda!
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>
                Anda menerima email ini karena Anda mengaktifkan pengingat latihan harian di akun Optimove Anda.
                <br>
                Ingin menonaktifkan pengingat ini? Buka <a href="{{ config('app.url') }}/workspace">Profil Saya</a> di aplikasi untuk mematikan email reminder.
            </p>
            <p style="margin-top: 12px; font-weight: bold;">
                © {{ date('Y') }} Optimove. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
