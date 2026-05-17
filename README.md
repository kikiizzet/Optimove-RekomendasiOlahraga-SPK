# Optimove - Sistem Pendukung Keputusan (SPK) Rekomendasi Olahraga

Optimove adalah aplikasi Sistem Pendukung Keputusan (SPK) berbasis web untuk memberikan rekomendasi olahraga terbaik yang paling sesuai dengan profil fisik dan kebiasaan pengguna. Aplikasi ini dirancang menggunakan metode Simple Additive Weighting (SAW) berdasarkan analisis kecocokan profil terhadap data historis dari dataset kebugaran nyata (700+ responden).

Aplikasi ini dibangun menggunakan Laravel 12 (Backend), React.js & Inertia.js (Frontend), Tailwind CSS (Adaline Design System), dan MySQL (Database).

---

## Metodologi SPK (Metode SAW)

Sistem menghitung kecocokan profil menggunakan 5 kriteria utama dengan bobot akademis sebagai berikut:

| No | Kriteria | Jenis Kriteria | Skala Pengukuran | Bobot |
|---|---|---|---|---|
| 1 | Tingkat Kebugaran | Benefit | Ordinal (5 Level) | 30% (0.30) |
| 2 | Rentang Usia | Benefit | Ordinal (5 Rentang) | 25% (0.25) |
| 3 | Frekuensi Olahraga | Benefit | Ordinal (4 Level) | 25% (0.25) |
| 4 | Jenis Kelamin | Benefit | Nominal (Biner) | 10% (0.10) |
| 5 | Pola Makan Sehat | Benefit | Ordinal (3 Level) | 10% (0.10) |

### Algoritma Pencocokan Hybrid
1. Penyaringan Jarak Usia (Age-Thresholding): Sistem hanya mengevaluasi responden di dataset yang memiliki usia dekat (skor ordinal usia >= 0.5) agar rekomendasi relevan secara biologis.
2. Perhitungan SAW: Setiap baris data dinilai kecocokannya menggunakan normalisasi linier ordinal: 1 - (|Input - Data| / Rentang Maks).
3. Skor Hybrid (Popularitas + Kemiripan): Skor akhir dihitung dengan rumus:
   Skor Hybrid = Rata-rata SAW * log(Jumlah Responden + 1)
4. Normalisasi Relatif: Hasil dipetakan ke rentang 40% – 100% menggunakan penskalaan Min-Max agar visualisasi progress bar di halaman hasil terlihat kontras dan mudah dibaca.

---

## Panduan Pemasangan & Cara Menjalankan Aplikasi

Ikuti langkah-langkah di bawah ini untuk memasang dan menjalankan proyek Optimove di komputer lokal Anda.

### Prasyarat Sistem
Pastikan perangkat Anda sudah terpasang:
- PHP >= 8.2
- Composer (Dependency manager PHP)
- Node.js & NPM (Minimal Node v18)
- MySQL Database Server (XAMPP, Laragon, atau MySQL installer mandiri)

---

### Langkah-Langkah Pemasangan

#### 1. Kloning Repository (Jika mengunduh dari GitHub)
```bash
git clone https://github.com/kikiizzet/Optimove-RekomendasiOlahraga-SPK.git
cd Optimove-RekomendasiOlahraga-SPK
```

#### 2. Install Dependensi Backend (Laravel)
Jalankan perintah berikut untuk mengunduh semua library PHP yang dibutuhkan:
```bash
composer install
```

#### 3. Install Dependensi Frontend (React & Vite)
Jalankan perintah berikut untuk memasang paket-paket Node.js (seperti Inertia, React, Tailwind, dll):
```bash
npm install
```

#### 4. Konfigurasi Environment File (.env)
Salin file .env.example menjadi .env:
```bash
copy .env.example .env
```
Buka file .env di text editor Anda, lalu sesuaikan bagian konfigurasi database MySQL Anda:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306  # Sesuaikan dengan port MySQL Anda (default biasanya 3306)
DB_DATABASE=optimove
DB_USERNAME=root
DB_PASSWORD=
```
*Catatan: Pastikan Anda sudah membuat database kosong bernama optimove di phpMyAdmin atau MySQL client Anda sebelum lanjut.*

#### 5. Generate Application Key
```bash
php artisan key:generate
```

#### 6. Jalankan Migrasi & Impor Dataset (Seeding)
Aplikasi ini membaca dataset awal dari file Excel BD20-1-Fitness-Dataset.xlsx. Perintah di bawah ini akan membuat tabel database sekaligus membaca & mengimpor dataset secara otomatis ke MySQL:
```bash
php artisan migrate:fresh --seed
```

#### 7. Build Aset Frontend
Untuk menjalankan aplikasi dalam mode produksi (lebih cepat & ringan):
```bash
npm run build
```
Atau jika Anda ingin dalam mode pengembangan (hot-reloading):
```bash
npm run dev
```

#### 8. Jalankan Local Server Laravel
```bash
php artisan serve
```

Aplikasi Anda kini sudah siap! Buka browser Anda dan akses alamat:
http://127.0.0.1:8000

---

## Antarmuka Halaman (Adaline Design System)

Desain antarmuka dibuat profesional, bersih, dan bebas dari ornamen bergaya AI / chat bot sesuai standar akademis sistem informasi:
1. Navigasi Sticky: Akses instan ke Statistik, Metodologi, Form Analisis, dan Riwayat.
2. Dashboard Statistik Dataset: Distribusi demografis responden nyata (Kelompok usia, Jenis Kelamin, Tingkat Kebugaran, Frekuensi, dan Olahraga terpopuler) berbasis diagram batang horizontal minimalis.
3. Formulir Kriteria SAW Transparan: Setiap dropdown pilihan dilengkapi dengan label informasi persentase bobot akademisnya.
4. Visualisasi Skor Persentase: Hasil rekomendasi Top 5 ditampilkan rapi dengan ranking, warna harmonis, badge status, dan indikator progress bar persentase skor kecocokan.
5. Riwayat Pencarian Otomatis: Menyimpan dan menampilkan 10 riwayat kalkulasi terakhir yang dimasukkan oleh pengguna ke database.
