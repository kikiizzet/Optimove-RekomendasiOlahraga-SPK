import React, { useState, useEffect } from 'react';
import { useForm, usePage, Link, router } from '@inertiajs/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Weekly Workout Plans Database matching mockup columns exactly
const WEEKLY_PROGRAMS = {
    'Walking or jogging': {
        name: 'Cardio & Endurance (Jogging)',
        sport: 'Jogging',
        tag: 'Cardio & Endurance',
        duration: '4 Minggu',
        duration_sub: '20 Mei - 16 Juni 2026',
        target: '3 Sesi',
        target_sub: 'Minimal olahraga per minggu',
        duration_per_sesi: '30-45 Menit',
        duration_per_sesi_sub: 'Sesuai intensitas',
        focus: 'Cardio & Stamina',
        focus_sub: 'Meningkatkan daya tahan tubuh',
        desc: 'Olahraga terbaik untuk meningkatkan kebugaran kardio dan menjaga kesehatan jantung.',
        schedule: [
            { day: 'Senin', activity: 'Jogging Ringan + Peregangan', duration: '20 Menit', intensity: 'Rendah', intensityColor: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
            { day: 'Selasa', activity: 'Istirahat Aktif (Peregangan / Jalan Kaki)', duration: '15-20 Menit', intensity: 'Rendah', intensityColor: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
            { day: 'Rabu', activity: 'Jogging Sedang + Peregangan', duration: '30 Menit', intensity: 'Sedang', intensityColor: 'bg-amber-50 text-amber-700 border-amber-100' },
            { day: 'Kamis', activity: 'Istirahat Aktif (Core / Yoga Ringan)', duration: '20 Menit', intensity: 'Rendah', intensityColor: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
            { day: 'Jumat', activity: 'Jogging Intensitas Sedang + Peregangan', duration: '40 Menit', intensity: 'Sedang', intensityColor: 'bg-amber-50 text-amber-700 border-amber-100' },
            { day: 'Sabtu', activity: 'Jalan Kaki Santai + Peregangan', duration: '20-30 Menit', intensity: 'Rendah', intensityColor: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
            { day: 'Minggu', activity: 'Istirahat Total', duration: '-', intensity: '-', intensityColor: 'bg-stone-50 text-stone-400' },
        ]
    },
    'Gym': {
        name: 'Strength Building (Gym / Fitness)',
        sport: 'Gym',
        tag: 'Strength Building',
        duration: '4 Minggu',
        duration_sub: '1 Februari - 28 Februari 2026',
        target: '4 Sesi',
        target_sub: 'Latihan angkat beban',
        duration_per_sesi: '45 Menit',
        duration_per_sesi_sub: 'Sesuai target otot',
        focus: 'Strength Building',
        focus_sub: 'Membangun kekuatan otot',
        desc: 'Latihan beban dinamis untuk pembentukan massa otot, kekuatan tulang, dan metabolisme prima.',
        schedule: [
            { day: 'Senin', activity: 'Upper Body Day (Latihan Dada, Bahu, Lengan)', duration: '45 Menit', intensity: 'Sedang', intensityColor: 'bg-amber-50 text-amber-700 border-amber-100' },
            { day: 'Selasa', activity: 'Lower Body Day (Latihan Paha, Betis, Bokong)', duration: '45 Menit', intensity: 'Sedang', intensityColor: 'bg-amber-50 text-amber-700 border-amber-100' },
            { day: 'Rabu', activity: 'Active Recovery (Cardio Ringan / Jalan Santai)', duration: '25 Menit', intensity: 'Rendah', intensityColor: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
            { day: 'Kamis', activity: 'Core & Stabilitas (Otot Perut & Stabilitas)', duration: '30 Menit', intensity: 'Rendah', intensityColor: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
            { day: 'Jumat', activity: 'Pull & Back Workout (Punggung & Bahu Belakang)', duration: '45 Menit', intensity: 'Sedang', intensityColor: 'bg-amber-50 text-amber-700 border-amber-100' },
            { day: 'Sabtu', activity: 'Rest & Stretch (Peregangan Ringan)', duration: '15 Menit', intensity: 'Rendah', intensityColor: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
            { day: 'Minggu', activity: 'Istirahat Total', duration: '-', intensity: '-', intensityColor: 'bg-stone-50 text-stone-400' },
        ]
    },
    'Yoga': {
        name: 'Flexibility & Balance (Yoga)',
        sport: 'Yoga',
        tag: 'Flexibility & Balance',
        duration: '4 Minggu',
        duration_sub: '10 April - 8 Mei 2026',
        target: '4 Sesi',
        target_sub: 'Kelenturan tubuh & relaksasi',
        duration_per_sesi: '30-40 Menit',
        duration_per_sesi_sub: 'Sesuai porsi',
        focus: 'Flexibility & Balance',
        focus_sub: 'Keseimbangan & ketenangan',
        desc: 'Penyelarasan tubuh dan pikiran untuk memperbaiki kelenturan sendi dan meredakan stres.',
        schedule: [
            { day: 'Senin', activity: 'Hatha Yoga (Pengenalan Pose Dasar)', duration: '30 Menit', intensity: 'Rendah', intensityColor: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
            { day: 'Selasa', activity: 'Vinyasa Flow (Pernapasan & Gerakan)', duration: '40 Menit', intensity: 'Sedang', intensityColor: 'bg-amber-50 text-amber-700 border-amber-100' },
            { day: 'Rabu', activity: 'Istirahat Aktif & Pranayama (Napas)', duration: '15 Menit', intensity: 'Rendah', intensityColor: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
            { day: 'Kamis', activity: 'Yin Yoga (Peregangan Sendi Dalam)', duration: '45 Menit', intensity: 'Rendah', intensityColor: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
            { day: 'Jumat', activity: 'Power Yoga (Kekuatan Core & Otot Perut)', duration: '30 Menit', intensity: 'Sedang', intensityColor: 'bg-amber-50 text-amber-700 border-amber-100' },
            { day: 'Sabtu', activity: 'Jalan Kaki Santai / Pemulihan Ringan', duration: '20 Menit', intensity: 'Rendah', intensityColor: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
            { day: 'Minggu', activity: 'Istirahat Total', duration: '-', intensity: '-', intensityColor: 'bg-stone-50 text-stone-400' },
        ]
    },
    'Cycling': {
        name: 'Cardio & Strength (Cycling)',
        sport: 'Bersepeda',
        tag: 'Cardio & Strength',
        duration: '4 Minggu',
        duration_sub: '1 Maret - 30 Maret 2026',
        target: '3 Sesi',
        target_sub: 'Latihan ketahanan kayuhan',
        duration_per_sesi: '30-50 Menit',
        duration_per_sesi_sub: 'Jarak menengah',
        focus: 'Cardio & Strength',
        focus_sub: 'Ketahanan kardio & kaki',
        desc: 'Melatih kardiorespirasi dan ketahanan otot kaki tanpa beban tekanan sendi berlebih.',
        schedule: [
            { day: 'Senin', activity: 'Bersepeda Santai (Rute Datar, Konstan)', duration: '30 Menit', intensity: 'Rendah', intensityColor: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
            { day: 'Selasa', activity: 'Istirahat Aktif & Peregangan Otot Kaki', duration: '15-20 Menit', intensity: 'Rendah', intensityColor: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
            { day: 'Rabu', activity: 'Bersepeda Latihan Interval (Sprint 1 Min)', duration: '35 Menit', intensity: 'Sedang', intensityColor: 'bg-amber-50 text-amber-700 border-amber-100' },
            { day: 'Kamis', activity: 'Latihan Penguatan Core & Stabilitas', duration: '25 Menit', intensity: 'Rendah', intensityColor: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
            { day: 'Jumat', activity: 'Bersepeda Ketahanan Jarak Menengah', duration: '45 Menit', intensity: 'Sedang', intensityColor: 'bg-amber-50 text-amber-700 border-amber-100' },
            { day: 'Sabtu', activity: 'Jalan Kaki Santai / Recovery', duration: '20 Menit', intensity: 'Rendah', intensityColor: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
            { day: 'Minggu', activity: 'Istirahat Total', duration: '-', intensity: '-', intensityColor: 'bg-stone-50 text-stone-400' },
        ]
    },
    'Swimming': {
        name: 'Full Body Conditioning (Swimming)',
        sport: 'Renang',
        tag: 'Full Body Conditioning',
        duration: '4 Minggu',
        duration_sub: 'Aktif Berkelanjutan',
        target: '3 Sesi',
        target_sub: 'Latihan kardio air',
        duration_per_sesi: '25-45 Menit',
        duration_per_sesi_sub: 'Porsi renang bertahap',
        focus: 'Full Body Conditioning',
        focus_sub: 'Melatih seluruh kelompok otot',
        desc: 'Melatih stamina, kekuatan otot punggung, dan kapasitas paru secara seimbang dalam air.',
        schedule: [
            { day: 'Senin', activity: 'Renang Ketahanan Dasar (Gaya Dada)', duration: '30 Menit', intensity: 'Rendah', intensityColor: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
            { day: 'Selasa', activity: 'Active Recovery & Peregangan Bahu', duration: '15 Menit', intensity: 'Rendah', intensityColor: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
            { day: 'Rabu', activity: 'Latihan Renang Interval (Gaya Bebas)', duration: '25 Menit', intensity: 'Sedang', intensityColor: 'bg-amber-50 text-amber-700 border-amber-100' },
            { day: 'Kamis', activity: 'Latihan Penguatan Core & Kaki', duration: '20 Menit', intensity: 'Rendah', intensityColor: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
            { day: 'Jumat', activity: 'Renang Jarak Jauh (Gaya Bebas)', duration: '45 Menit', intensity: 'Sedang', intensityColor: 'bg-amber-50 text-amber-700 border-amber-100' },
            { day: 'Sabtu', activity: 'Istirahat Aktif & Peregangan', duration: '15 Menit', intensity: 'Rendah', intensityColor: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
            { day: 'Minggu', activity: 'Istirahat Total', duration: '-', intensity: '-', intensityColor: 'bg-stone-50 text-stone-400' },
        ]
    }
};

// Historical Workout Programs now handled dynamically

// Weight tracking chart data
const weightHistoryData = [
    { month: 'Jan', weight: 72.0 },
    { month: 'Feb', weight: 71.2 },
    { month: 'Mar', weight: 70.5 },
    { month: 'Apr', weight: 69.5 },
    { month: 'Mei', weight: 68.6 },
    { month: 'Jun', weight: 68.0 },
];

const SPORT_RECOMMENDATION_DETAILS = {
    'Jogging': {
        name: 'Jogging',
        suitability: 'Sangat Cocok untuk Anda',
        stars: 3,
        intensityLabel: '(Sedang)',
        duration: '30 - 45 Menit',
        frequency: '3 - 4 kali/minggu',
        calories: '300 - 500 kkal',
        desc: 'Olahraga terbaik untuk meningkatkan kebugaran kardiovaskular dan menjaga kesehatan jantung.',
        score: 92,
    },
    'Bersepeda': {
        name: 'Bersepeda',
        suitability: 'Sangat Cocok untuk Anda',
        stars: 3,
        intensityLabel: '(Sedang)',
        duration: '30 - 50 Menit',
        frequency: '3 - 4 kali/minggu',
        calories: '250 - 450 kkal',
        desc: 'Meningkatkan daya tahan tubuh dan memperkuat otot kaki serta jantung.',
        score: 80,
    },
    'Yoga': {
        name: 'Yoga',
        suitability: 'Sangat Cocok untuk Anda',
        stars: 2,
        intensityLabel: '(Rendah)',
        duration: '30 - 40 Menit',
        frequency: '4 kali/minggu',
        calories: '150 - 250 kkal',
        desc: 'Meningkatkan fleksibilitas tubuh, keseimbangan, dan kesehatan mental.',
        score: 78,
    },
    'Renang': {
        name: 'Renang',
        suitability: 'Sangat Cocok untuk Anda',
        stars: 4,
        intensityLabel: '(Tinggi)',
        duration: '25 - 45 Menit',
        frequency: '3 kali/minggu',
        calories: '400 - 600 kkal',
        desc: 'Melatih seluruh tubuh dan sistem pernapasan tanpa tekanan sendi berlebih.',
        score: 74,
    },
    'Gym / Fitness': {
        name: 'Gym / Fitness',
        suitability: 'Sangat Cocok untuk Anda',
        stars: 4,
        intensityLabel: '(Tinggi)',
        duration: '45 Menit',
        frequency: '4 kali/minggu',
        calories: '300 - 600 kkal',
        desc: 'Latihan beban untuk kekuatan otot, kepadatan tulang, dan metabolisme prima.',
        score: 60,
    }
};

export default function Index({ user, todayTodos = [], journals = [], inactiveDays = 0, inactiveAlert = false, testimonials = [] }) {
    const { flash } = usePage().props;

    // Sidebar tab state
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showBadgeModal, setShowBadgeModal] = useState(false);
    const [badgeName, setBadgeName] = useState('');
    const [showWeeklyAchievementModal, setShowWeeklyAchievementModal] = useState(false);
    
    // Profil page sub-tab state
    const [profileSubTab, setProfileSubTab] = useState('pribadi');

    // Profile inline edit states
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileSaving, setProfileSaving] = useState(false);
    const [profileForm, setProfileForm] = useState({
        name:           user.name || '',
        gender:         user.gender || '',
        date_of_birth:  user.date_of_birth ? String(user.date_of_birth).split('T')[0] : '',
        age:            user.age || '',
        phone:          user.phone || '',
        address:        user.address || '',
        job:            user.job || '',
        activity_level: user.activity_level || '',
    });

    const handleProfileSave = (e) => {
        e.preventDefault();
        setProfileSaving(true);
        router.patch(route('workspace.profile.update'), profileForm, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditingProfile(false);
                setProfileSaving(false);
            },
            onError: () => setProfileSaving(false),
        });
    };

    // ── Language / i18n ────────────────────────────────────────────────────
    const [lang, setLang] = useState(() => localStorage.getItem('optimove_lang') || 'id');

    const handleLangChange = (newLang) => {
        setLang(newLang);
        localStorage.setItem('optimove_lang', newLang);
    };

    const translations = {
        id: {
            // Sidebar nav
            nav_dashboard: 'Dashboard',
            nav_analisis: 'Analisis SAW',
            nav_rekomendasi: 'Hasil Rekomendasi',
            nav_program: 'Program Latihan',
            nav_riwayat: 'Riwayat',
            nav_testimoni: 'Testimoni Saya',
            nav_profil: 'Profil Saya',
            nav_logout: 'Logout',
            nav_konsisten: 'Tetap Konsisten!',
            nav_konsisten_sub: 'Konsistensi kecil hari ini membawa perubahan besar untuk masa depan.',
            // Header titles
            h_dashboard: 'Dashboard Utama',
            h_analisis: 'Hasil Analisis SAW',
            h_program: 'Program Latihan Personal',
            h_riwayat: 'Riwayat Aktivitas',
            h_testimoni: 'Testimoni Saya',
            h_profil: 'Profil Saya',
            // Dashboard
            greeting: `Halo, ${user.name}!`,
            greeting_sub: 'Pantau progres rencana kebugaran dan catat kemajuan Anda di sini.',
            progress_today: 'Progres Hari Ini',
            done: 'Selesai',
            program_aktif: 'Program Aktif',
            streak_label: 'Streak Aktif',
            streak_unit: 'Hari',
            total_analisis: 'Total Analisis',
            kali: 'Kali',
            // Profile
            informasi_pribadi: 'Informasi Pribadi',
            ringkasan_statistik: 'Ringkasan Statistik',
            pengaturan_akun: 'Pengaturan Akun',
            pengaturan_sub: 'Atur preferensi dasar akun Anda.',
            bahasa_aplikasi: 'Bahasa Aplikasi',
            bahasa_sub: 'Bahasa yang digunakan di aplikasi',
            satuan: 'Satuan Pengukuran',
            satuan_sub: 'Satuan untuk tinggi badan dan berat badan',
            hapus_akun: 'Hapus Akun',
            hapus_sub: 'Hapus akun dan semua data secara permanen. Tindakan ini tidak dapat dibatalkan.',
            hapus_btn: 'Hapus Akun Saya',
            edit_btn: 'Edit',
            batal: 'Batal',
            simpan: 'Simpan',
            menyimpan: 'Menyimpan...',
            nama_lengkap: 'Nama Lengkap',
            jenis_kelamin: 'Jenis Kelamin',
            tanggal_lahir: 'Tanggal Lahir',
            usia: 'Usia',
            email: 'Email',
            no_telepon: 'Nomor Telepon',
            alamat: 'Alamat',
            pekerjaan: 'Pekerjaan',
            target_aktivitas: 'Target Aktivitas',
            laki: 'Laki-laki',
            perempuan: 'Perempuan',
            pilih: '-- Pilih --',
            bergabung: 'Bergabung sejak',
            aktif: 'Aktif',
            // Stats labels
            stat_total: 'Total Analisis',
            stat_selesai: 'Program Selesai',
            stat_konsisten: 'Hari Konsisten',
            stat_progress: 'Rata - rata Progress',
            stat_kalori: 'Kalori Terbakar',
            // Chip labels
            chip_usia: 'Usia',
            chip_tinggi: 'Tinggi',
            chip_berat: 'Berat',
        },
        en: {
            nav_dashboard: 'Dashboard',
            nav_analisis: 'SAW Analysis',
            nav_rekomendasi: 'Recommendation',
            nav_program: 'Training Program',
            nav_riwayat: 'History',
            nav_testimoni: 'My Testimonials',
            nav_profil: 'My Profile',
            nav_logout: 'Logout',
            nav_konsisten: 'Stay Consistent!',
            nav_konsisten_sub: 'Small consistency today brings big changes for the future.',
            h_dashboard: 'Main Dashboard',
            h_analisis: 'SAW Analysis Result',
            h_program: 'Personal Training Program',
            h_riwayat: 'Activity History',
            h_testimoni: 'My Testimonials',
            h_profil: 'My Profile',
            greeting: `Hello, ${user.name}!`,
            greeting_sub: 'Track your fitness plan progress and record your achievements here.',
            progress_today: "Today's Progress",
            done: 'Completed',
            program_aktif: 'Active Program',
            streak_label: 'Active Streak',
            streak_unit: 'Days',
            total_analisis: 'Total Analysis',
            kali: 'Times',
            informasi_pribadi: 'Personal Information',
            ringkasan_statistik: 'Statistics Summary',
            pengaturan_akun: 'Account Settings',
            pengaturan_sub: 'Manage your basic account preferences.',
            bahasa_aplikasi: 'Application Language',
            bahasa_sub: 'Language used in the application',
            satuan: 'Measurement Unit',
            satuan_sub: 'Unit for height and weight measurements',
            hapus_akun: 'Delete Account',
            hapus_sub: 'Permanently delete your account and all data. This action cannot be undone.',
            hapus_btn: 'Delete My Account',
            edit_btn: 'Edit',
            batal: 'Cancel',
            simpan: 'Save',
            menyimpan: 'Saving...',
            nama_lengkap: 'Full Name',
            jenis_kelamin: 'Gender',
            tanggal_lahir: 'Date of Birth',
            usia: 'Age',
            email: 'Email',
            no_telepon: 'Phone Number',
            alamat: 'Address',
            pekerjaan: 'Occupation',
            target_aktivitas: 'Activity Target',
            laki: 'Male',
            perempuan: 'Female',
            pilih: '-- Select --',
            bergabung: 'Joined since',
            aktif: 'Active',
            stat_total: 'Total Analysis',
            stat_selesai: 'Programs Completed',
            stat_konsisten: 'Consistent Days',
            stat_progress: 'Average Progress',
            stat_kalori: 'Calories Burned',
            chip_usia: 'Age',
            chip_tinggi: 'Height',
            chip_berat: 'Weight',
        },
    };

    const t = (key) => translations[lang]?.[key] ?? translations['id'][key] ?? key;

    // Notion-style journal states
    const [activeJournalTab, setActiveJournalTab] = useState('list');
    const [editingJournal, setEditingJournal] = useState(null);

    // Mount state for SSR Recharts prevention
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Form inputs
    const todoForm = useForm({
        task_name: '',
        sport_name: '',
        due_date: new Date().toISOString().split('T')[0],
    });

    const journalForm = useForm({
        title: '',
        content: '',
        mood: 'good',
    });

    const testimonialForm = useForm({
        content: '',
        rating: 5,
    });

    // Flash alerts state
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertType, setAlertType] = useState('success');

    // Determine the user active program based on their landing page calculation
    const getProgramKey = (sportName) => {
        if (!sportName) return 'Walking or jogging';
        if (/walk|jog/i.test(sportName)) return 'Walking or jogging';
        if (/gym|fitness/i.test(sportName)) return 'Gym';
        if (/yoga/i.test(sportName)) return 'Yoga';
        if (/cycle|bike/i.test(sportName)) return 'Cycling';
        if (/swim/i.test(sportName)) return 'Swimming';
        return 'Walking or jogging';
    };

    const getSportIcon = (sportName) => {
        const name = (sportName || '').toLowerCase();
        if (name.includes('walk') || name.includes('jog') || name.includes('running') || name.includes('lari')) {
            return (
                <div className="w-10 h-10 rounded-full bg-[#edf1e6] flex items-center justify-center shrink-0">
                    <img src="/images/running (1).png" alt="Running" className="w-6 h-6 object-contain" />
                </div>
            );
        }
        if (name.includes('yoga') || name.includes('stretch') || name.includes('peregangan') || name.includes('medit')) {
            return (
                <div className="w-10 h-10 rounded-full bg-[#edf1e6] flex items-center justify-center shrink-0">
                    <img src="/images/running (2).png" alt="Meditation" className="w-6 h-6 object-contain" />
                </div>
            );
        }
        if (name.includes('swim') || name.includes('renang')) {
            return (
                <div className="w-10 h-10 rounded-full bg-[#edf1e6] flex items-center justify-center shrink-0">
                    <img src="/images/running (3).png" alt="Swimming" className="w-6 h-6 object-contain" />
                </div>
            );
        }
        if (name.includes('cycle') || name.includes('sepeda')) {
            return (
                <div className="w-10 h-10 rounded-full bg-[#edf1e6] flex items-center justify-center shrink-0 text-lg">
                    🚴
                </div>
            );
        }
        if (name.includes('gym') || name.includes('fitness') || name.includes('angkat') || name.includes('beban')) {
            return (
                <div className="w-10 h-10 rounded-full bg-[#edf1e6] flex items-center justify-center shrink-0">
                    <img src="/images/dumbbell 2.png" alt="Gym" className="w-6 h-6 object-contain" />
                </div>
            );
        }
        return (
            <div className="w-10 h-10 rounded-full bg-[#edf1e6] flex items-center justify-center shrink-0 text-lg">
                💪
            </div>
        );
    };

    const getSportImage = (key) => {
        switch(key) {
            case 'Walking or jogging': return '/images/Gambar Lari.png';
            case 'Cycling': return '/images/cycle.png';
            case 'Yoga': return '/images/yoga.png';
            case 'Swimming': return '/images/swimming.png';
            case 'Gym': return '/images/gym.png';
            default: return '/images/Gambar Lari.png';
        }
    };

    const getSportIconPath = (sportName) => {
        if (!sportName) return '/images/running (1).png';
        if (/walk|jog/i.test(sportName)) return '/images/running (1).png';
        if (/yoga/i.test(sportName)) return '/images/running (2).png';
        if (/swimming|renang/i.test(sportName)) return '/images/running (3).png';
        if (/cycle|sepeda/i.test(sportName)) return '/images/bicycle 3.png';
        if (/gym|fitness/i.test(sportName)) return '/images/dumbbell 2.png';
        return '/images/running (1).png';
    };

    const getDynamicDateRange = () => {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + 28); // 4 weeks later
        
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        
        const startDay = startDate.getDate();
        const startMonth = months[startDate.getMonth()];
        const startYear = startDate.getFullYear();
        
        const endDay = endDate.getDate();
        const endMonth = months[endDate.getMonth()];
        const endYear = endDate.getFullYear();
        
        if (startYear === endYear) {
            if (startMonth === endMonth) {
                return `${startDay} - ${endDay} ${startMonth} ${startYear}`;
            }
            return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${startYear}`;
        }
        return `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`;
    };

    const getWeekdayDateStr = (dayName) => {
        const dayMap = { Senin: 1, Selasa: 2, Rabu: 3, Kamis: 4, Jumat: 5, Sabtu: 6, Minggu: 0 };
        const targetDayOfWeek = dayMap[dayName];
        
        const today = new Date();
        const todayDayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday...
        
        // Find Monday of the current week
        const daysToSubtract = todayDayOfWeek === 0 ? 6 : todayDayOfWeek - 1;
        const mondayOfThisWeek = new Date(today);
        mondayOfThisWeek.setDate(today.getDate() - daysToSubtract);
        
        // Find the target day of the current week
        const dayOffsetMap = { Senin: 0, Selasa: 1, Rabu: 2, Kamis: 3, Jumat: 4, Sabtu: 5, Minggu: 6 };
        const dayOffset = dayOffsetMap[dayName];
        
        const targetDate = new Date(mondayOfThisWeek);
        const weekOffsetDays = (currentWeek - 1) * 7;
        targetDate.setDate(mondayOfThisWeek.getDate() + weekOffsetDays + dayOffset);
        
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        return `${targetDate.getDate()} ${months[targetDate.getMonth()]}`;
    };

    const activeProgramKey = getProgramKey(user.last_recommendation);
    const [selectedProgramKey, setSelectedProgramKey] = useState(activeProgramKey);

    const normalizeSportName = (name) => {
        if (!name) return 'Jogging';
        if (/walk|jog/i.test(name)) return 'Jogging';
        if (/cycle|sepeda/i.test(name)) return 'Bersepeda';
        if (/yoga/i.test(name)) return 'Yoga';
        if (/swimming|renang/i.test(name)) return 'Renang';
        if (/gym|fitness/i.test(name)) return 'Gym / Fitness';
        return 'Jogging';
    };

    const [selectedRecommendSport, setSelectedRecommendSport] = useState(normalizeSportName(user.last_recommendation));

    const handleSelectRecommendSport = (sportName) => {
        setSelectedRecommendSport(sportName);
        
        // Map back to WEEKLY_PROGRAMS keys: 'Walking or jogging', 'Cycling', 'Yoga', 'Swimming', 'Gym'
        let progKey = 'Walking or jogging';
        if (sportName === 'Bersepeda') progKey = 'Cycling';
        else if (sportName === 'Yoga') progKey = 'Yoga';
        else if (sportName === 'Renang') progKey = 'Swimming';
        else if (sportName === 'Gym / Fitness') progKey = 'Gym';
        
        setSelectedProgramKey(progKey);
    };

    // Reset selected program if user recommendation changes
    useEffect(() => {
        const normalized = normalizeSportName(user.last_recommendation);
        setSelectedProgramKey(activeProgramKey);
        setSelectedRecommendSport(normalized);
    }, [user.last_recommendation]);

    // Handle badge & flash trigger
    useEffect(() => {
        if (flash?.badge_awarded) {
            setBadgeName(flash.badge_name);
            setShowBadgeModal(true);
        }
        if (flash?.success) {
            setAlertMessage(flash.success);
            setAlertType('success');
            const timer = setTimeout(() => setAlertMessage(null), 5000);
            return () => clearTimeout(timer);
        } else if (flash?.error) {
            setAlertMessage(flash.error);
            setAlertType('error');
            const timer = setTimeout(() => setAlertMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    // Todo Submit
    const handleTodoSubmit = (e) => {
        e.preventDefault();
        todoForm.post(route('workspace.todos.store'), {
            onSuccess: () => todoForm.reset('task_name', 'sport_name'),
        });
    };

    // Toggle todo status
    const toggleTodo = (todoId) => {
        router.patch(route('workspace.todos.toggle', todoId), {}, {
            preserveScroll: true,
        });
    };

    // Delete todo
    const deleteTodo = (todoId) => {
        if (confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
            router.delete(route('workspace.todos.destroy', todoId), {
                preserveScroll: true,
            });
        }
    };

    // Journal Submit
    const handleJournalSubmit = (e) => {
        e.preventDefault();
        if (activeJournalTab === 'edit' && editingJournal) {
            journalForm.patch(route('workspace.journals.update', editingJournal.id), {
                onSuccess: () => {
                    setActiveJournalTab('list');
                    setEditingJournal(null);
                    journalForm.reset();
                }
            });
        } else {
            journalForm.post(route('workspace.journals.store'), {
                onSuccess: () => {
                    setActiveJournalTab('list');
                    journalForm.reset();
                }
            });
        }
    };

    // Edit journal
    const startEditJournal = (journal) => {
        setEditingJournal(journal);
        journalForm.setData({
            title: journal.title,
            content: journal.content,
            mood: journal.mood || 'good',
        });
        setActiveJournalTab('edit');
    };

    // Delete journal
    const deleteJournal = (journalId) => {
        if (confirm('Apakah Anda yakin ingin menghapus catatan jurnal ini?')) {
            router.delete(route('workspace.journals.destroy', journalId), {
                preserveScroll: true,
            });
        }
    };

    // Upload foto profil
    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('photo', file);

        router.post(route('workspace.profile.photo'), formData, {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    // Submit testimoni
    const handleTestimonialSubmit = (e) => {
        e.preventDefault();
        testimonialForm.post(route('workspace.testimonials.store'), {
            preserveScroll: true,
            onSuccess: () => {
                testimonialForm.reset('content');
            }
        });
    };

    // Hapus testimoni
    const deleteTestimonial = (testimonialId) => {
        if (confirm('Apakah Anda yakin ingin menghapus testimoni ini?')) {
            router.delete(route('workspace.testimonials.destroy', testimonialId), {
                preserveScroll: true,
            });
        }
    };

    // Workout checklist states for week schedule — persisted from DB
    const defaultChecklist = { Senin: false, Selasa: false, Rabu: false, Kamis: false, Jumat: false, Sabtu: false, Minggu: false, current_week: 1 };
    const [weeklyChecklist, setWeeklyChecklist] = useState(() => ({
        ...defaultChecklist,
        ...(user.weekly_checklist || {})
    }));

    // Calculate if the streak is broken/active
    const isStreakActive = () => {
        if (!user.last_workout_date) return false;
        const lastDate = new Date(user.last_workout_date);
        lastDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        return lastDate.getTime() === today.getTime() || lastDate.getTime() === yesterday.getTime();
    };

    const activeStreak = isStreakActive() ? (user.workout_streak || 0) : 0;

    const currentWeek = weeklyChecklist.current_week || 1;
    const checklistDays = {
        Senin: !!weeklyChecklist.Senin,
        Selasa: !!weeklyChecklist.Selasa,
        Rabu: !!weeklyChecklist.Rabu,
        Kamis: !!weeklyChecklist.Kamis,
        Jumat: !!weeklyChecklist.Jumat,
        Sabtu: !!weeklyChecklist.Sabtu,
        Minggu: !!weeklyChecklist.Minggu,
    };
    const checkedDaysCount = Object.values(checklistDays).filter(Boolean).length;
    const completedWeeks = currentWeek - 1;
    const currentProgress = Math.min(100, Math.round(((completedWeeks * 7 + checkedDaysCount) / 28) * 100));
    const currentWeekProgress = Math.round((checkedDaysCount / 7) * 100);

    const activeProgramsCount = (user.last_recommendation || currentProgress > 0) && currentProgress < 100 ? 1 : 0;
    const totalCompletedWorkouts = journals.length + todayTodos.filter(t => t.is_completed).length;
    const totalAnalisisCount = user.last_recommendation ? 1 : 0;

    const displayedHistory = currentProgress === 100 ? [{
        period: getDynamicDateRange(),
        duration: '4 Minggu',
        type: WEEKLY_PROGRAMS[selectedProgramKey]?.tag || 'Cardio & Endurance',
        sport: WEEKLY_PROGRAMS[selectedProgramKey]?.sport || normalizeSportName(user.last_recommendation),
        progress: 100,
        status: 'SELESAI',
        statusColor: 'bg-[#edf6ed] text-[#166534] border-emerald-200/50'
    }] : [];

    const toggleWeekDay = (day) => {
        const updated = { ...weeklyChecklist, [day]: !weeklyChecklist[day] };
        setWeeklyChecklist(updated);
        router.patch(route('workspace.checklist.update'), { checklist: updated }, { preserveScroll: true });

        // Cek jika baru saja mencentang semua hari di minggu ini
        const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
        const wasAllDone = days.every(d => weeklyChecklist[d]);
        const isAllDoneNow = days.every(d => updated[d]);
        if (!wasAllDone && isAllDoneNow) {
            setShowWeeklyAchievementModal(true);
        }
    };

    // Download workout schedule plan (.txt blob)
    const handleDownloadSchedule = () => {
        const prog = WEEKLY_PROGRAMS[selectedProgramKey];
        let content = `PROGRAM LATIHAN PERSONAL - ${prog.name.toUpperCase()}\n`;
        content += `Durasi Program: ${prog.duration} (${getDynamicDateRange()})\n`;
        content += `Target Mingguan: ${prog.target} (${prog.target_sub})\n`;
        content += `Durasi Per Sesi: ${prog.duration_per_sesi} (${prog.duration_per_sesi_sub})\n`;
        content += `Fokus Program: ${prog.focus} (${prog.focus_sub})\n\n`;
        content += `JADWAL MINGGUAN:\n`;
        content += `------------------------------------------------------------\n`;
        content += `Hari   | Aktivitas                        | Durasi   | Intensitas\n`;
        content += `------------------------------------------------------------\n`;
        prog.schedule.forEach(row => {
            content += `${row.day.padEnd(6)} | ${row.activity.padEnd(32)} | ${row.duration.padEnd(8)} | ${row.intensity}\n`;
        });
        content += `------------------------------------------------------------\n`;
        
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `jadwal_latihan_${selectedProgramKey}.txt`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Mood mapping
    const moodMap = {
        great: { icon: '🤩', label: 'Luar Biasa', bg: 'bg-emerald-50 text-emerald-700' },
        good: { icon: '😊', label: 'Baik', bg: 'bg-emerald-50/60 text-emerald-700' },
        okay: { icon: '😐', label: 'Biasa Saja', bg: 'bg-stone-50 text-stone-600' },
        tired: { icon: '😫', label: 'Lelah', bg: 'bg-amber-50 text-amber-800' },
    };

    return (
        <div className="min-h-screen font-sans bg-canvas-ice text-adaline-ink flex">
            
            {/* SIDEBAR NAVIGATION */}
            <aside className="w-64 bg-white border-r border-stone-200/80 shrink-0 hidden md:flex flex-col justify-between py-6 px-4">
                <div className="space-y-8 flex-1 flex flex-col">
                    {/* Brand logo */}
                    <div className="flex items-center gap-2 px-3 shrink-0">
                        <div className="w-8 h-8 rounded-lg bg-valley-green flex items-center justify-center text-white shadow-xs">
                            <svg className="w-5 h-5 text-forest-dew" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span className="font-extrabold text-lg text-valley-green tracking-tight">Optimove</span>
                    </div>

                    {/* Navigation list */}
                    <nav className="space-y-1 shrink-0">
                        {[
                            { id: 'dashboard', label: 'Dashboard', icon: (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            )},
                            { id: 'analisis', label: 'Analisis SAW', link: route('home') + '#form', icon: (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            )},
                            { id: 'rekomendasi', label: 'Hasil Rekomendasi', icon: (
                                <img 
                                    src="/images/heart-beat 2.png" 
                                    className="w-[18px] h-[18px] object-contain transition-all duration-200" 
                                    style={{ filter: activeTab === 'rekomendasi' ? 'none' : 'grayscale(100%) brightness(0.6) opacity(0.6)' }}
                                    alt="Hasil Rekomendasi" 
                                />
                            )},
                            { id: 'program', label: 'Program Latihan', icon: (
                                <img 
                                    src="/images/running (1).png" 
                                    className="w-[18px] h-[18px] object-contain transition-all duration-200" 
                                    style={{ filter: activeTab === 'program' ? 'none' : 'grayscale(100%) brightness(0.6) opacity(0.6)' }}
                                    alt="Program Latihan" 
                                />
                            )},
                            { id: 'riwayat', label: 'Riwayat', icon: (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )},
                            { id: 'testimoni', label: 'Testimoni Saya', icon: (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            )},
                            { id: 'profil', label: 'Profil Saya', icon: (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            )},
                        ].map((item) => {
                            if (item.link) {
                                return (
                                    <a key={item.id} href={item.link} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-stone-500 hover:text-valley-green hover:bg-stone-50 transition">
                                        {item.icon}
                                        {item.label}
                                    </a>
                                );
                            }
                            const isActive = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition ${
                                        isActive 
                                        ? 'bg-forest-dew/40 text-valley-green' 
                                        : 'text-stone-500 hover:text-valley-green hover:bg-stone-50'
                                    }`}
                                >
                                    {item.icon}
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Tetap Konsisten Banner Card matching mockup */}
                    <div className="mt-auto bg-stone-50 border border-stone-200/50 rounded-2xl p-4 text-left relative overflow-hidden shrink-0">
                        <h4 className="font-bold text-xs text-valley-green">Tetap Konsisten!</h4>
                        <p className="text-[10px] text-stone-400 leading-relaxed mt-1">Konsistensi kecil hari ini membawa perubahan besar untuk masa depan.</p>
                        <div className="flex justify-center mt-3 bg-white py-2 rounded-xl border border-stone-100 shadow-2xs">
                            {/* Running shoe and water bottle vector representation */}
                            <svg className="w-16 h-10 text-valley-green/30" viewBox="0 0 64 40" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M12 30h40c2 0 4-1 5-3l4-8c1-2-1-4-3-4H42l-6-6-8 4-8-4-8 10-2 2v6c0 1 1 3 2 3z" strokeLinecap="round" strokeLinejoin="round" />
                                <rect x="6" y="16" width="6" height="14" rx="1.5" />
                                <path d="M8 16v-3h2v3" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-stone-100 shrink-0">
                    <Link href={route('logout')} method="post" as="button" className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </Link>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen">
                
                {/* Header navbar */}
                <header className="sticky top-0 z-30 bg-canvas-ice/90 backdrop-blur-md border-b border-stone-200/50 py-4 px-6 md:px-10 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <h2 className="font-extrabold text-base capitalize text-valley-green">
                            {activeTab === 'dashboard' && 'Dashboard Utama'}
                            {activeTab === 'rekomendasi' && 'Hasil Analisis SAW'}
                            {activeTab === 'program' && 'Program Latihan Personal'}
                            {activeTab === 'riwayat' && 'Riwayat Aktivitas'}
                            {activeTab === 'testimoni' && 'Testimoni Saya'}
                            {activeTab === 'profil' && 'Profil Saya'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Notification alert icon */}
                        <div className="w-9 h-9 rounded-full border border-stone-200 bg-white flex items-center justify-center text-stone-500 relative cursor-pointer hover:bg-stone-50">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            {inactiveAlert && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"></span>}
                        </div>
                        
                        {/* Profile chip */}
                        <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-full py-1 pl-1 pr-3 shadow-2xs hover:bg-stone-50 cursor-pointer">
                            <img className="w-7 h-7 rounded-full object-cover" src={user.profile_photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&color=166534&background=f0fdf4`} alt={user.name} />
                            <span className="text-xs font-bold text-valley-green truncate max-w-28">{user.name}</span>
                        </div>
                    </div>
                </header>

                {/* Inactivity Alert Notification strip */}
                {inactiveAlert && (
                    <div className="bg-red-50 border-b border-red-200/50 py-3 px-6 md:px-10 flex items-center gap-3 text-red-900 text-xs font-medium leading-relaxed shrink-0">
                        <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0">⚠️</span>
                        <p>
                            Sudah <strong>{inactiveDays} hari</strong> Anda tidak melakukan aktivitas olahraga. Yuk, mulai latih lagi rekomendasi program olahraga Anda demi kesehatan tubuh!
                        </p>
                    </div>
                )}

                {/* Tab content wrapper */}
                <main className="flex-1 p-6 md:p-10 bg-canvas-ice/30">
                    
                    {/* Global Flash Alert Notification */}
                    {alertMessage && (
                        <div className={`mb-6 p-4 rounded-2xl border flex items-center justify-between gap-4 animate-fade-in shadow-xs ${
                            alertType === 'success'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                            : 'bg-red-50 border-red-200 text-red-950'
                        }`}>
                            <div className="flex items-center gap-2.5 text-xs font-semibold">
                                <span className="text-base shrink-0">{alertType === 'success' ? '✓' : '⚠️'}</span>
                                <p>{alertMessage}</p>
                            </div>
                            <button onClick={() => setAlertMessage(null)} className="text-stone-400 hover:text-stone-700 text-xs font-bold font-mono cursor-pointer">
                                ✕
                            </button>
                        </div>
                    )}
                    
                    {/* TAB 1: DASHBOARD TAB */}
                    {activeTab === 'dashboard' && (
                        <div className="space-y-6 animate-fade-in">
                            
                            {/* Row 1: Greeting & Progress */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Welcome Banner */}
                                <div className="lg:col-span-2 bg-white border border-stone-200/80 rounded-3xl p-6 md:p-8 shadow-sm flex items-center justify-between gap-6 relative h-[180px]">
                                    <div className="space-y-2 relative z-10 max-w-[60%] text-left">
                                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#203b14]">Halo, {user.name}!</h1>
                                        <p className="text-xs md:text-sm text-stone-500 font-semibold leading-relaxed">Pantau progres rencana kebugaran dan catat kemajuan Anda di sini.</p>
                                    </div>
                                    <div className="absolute right-4 bottom-0 top-[-35px] flex items-end justify-end w-[40%] pointer-events-none select-none z-20">
                                        <img 
                                            src="/images/dashboard.png" 
                                            alt="Waving guy illustration" 
                                            className="h-[215px] max-h-[215px] object-contain object-bottom"
                                        />
                                    </div>
                                </div>
                                
                                {/* Progres Hari Ini Card */}
                                {(() => {
                                    const totalToday = todayTodos.length;
                                    const doneToday = todayTodos.filter(t => t.is_completed).length;
                                    const percentage = totalToday > 0 ? Math.round((doneToday / totalToday) * 100) : 0;
                                    const strokeDashoffset = 113.09 - (113.09 * percentage) / 100;
                                    return (
                                        <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-sm flex items-center justify-center gap-6 h-[180px]">
                                            <div className="relative w-20 h-20 shrink-0">
                                                {/* Circle Ring */}
                                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 42 42">
                                                    <circle className="text-stone-100" strokeWidth="4" stroke="currentColor" fill="none" cx="21" cy="21" r="18" />
                                                    <circle className="text-[#075e3d]" strokeDasharray="113.09" strokeDashoffset={strokeDashoffset} strokeWidth="4" strokeLinecap="round" stroke="currentColor" fill="none" cx="21" cy="21" r="18" />
                                                </svg>
                                                {/* Dumbbell Icon in center */}
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <img src="/images/dumbbell 2.png" alt="Dumbbell" className="w-7 h-7 object-contain translate-y-1.5" />
                                                </div>
                                            </div>
                                            <div className="text-left">
                                                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">Progres Hari Ini</span>
                                                <span className="text-2xl font-black text-valley-green block mt-0.5">{totalToday > 0 ? `${doneToday} dari ${totalToday}` : '0 dari 0'}</span>
                                                <span className="text-xs font-bold text-emerald-600 block mt-0.5">Selesai</span>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* Row 2: Four Metric Cards */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Card 1: Program Aktif */}
                                <div className="bg-white border border-stone-200/80 rounded-2xl p-4 flex items-center gap-3 shadow-2xs text-left">
                                    <div className="w-12 h-12 rounded-full bg-[#edf1e6] flex items-center justify-center shrink-0">
                                        <img src="/images/Calendar.png" alt="Calendar" className="w-6 h-6 object-contain" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Program Aktif</span>
                                        <span className="text-lg font-black text-valley-green mt-0.5 block leading-none">
                                            {activeProgramsCount}
                                        </span>
                                        <span className="text-[10px] text-stone-400 font-semibold block mt-1">
                                            {activeProgramsCount > 0 ? 'Program berjalan' : 'Belum ada program'}
                                        </span>
                                    </div>
                                </div>

                                {/* Card 2: Latihan Selesai */}
                                <div className="bg-white border border-stone-200/80 rounded-2xl p-4 flex items-center gap-3 shadow-2xs text-left">
                                    <div className="w-12 h-12 rounded-full bg-[#edf1e6] flex items-center justify-center shrink-0">
                                        <img src="/images/Check circle.png" alt="Check circle" className="w-6 h-6 object-contain" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Latihan Selesai</span>
                                        <span className="text-lg font-black text-valley-green mt-0.5 block leading-none font-bold">
                                            {totalCompletedWorkouts}
                                        </span>
                                        <span className="text-[10px] text-stone-400 font-semibold block mt-1">Sesi latihan</span>
                                    </div>
                                </div>

                                {/* Card 3: Streak */}
                                <div className="bg-white border border-stone-200/80 rounded-2xl p-4 flex items-center gap-3 shadow-2xs text-left">
                                    <div className="w-12 h-12 rounded-full bg-[#fef7e0] flex items-center justify-center shrink-0 text-xl">
                                        🔥
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Streak</span>
                                        <span className="text-lg font-black text-valley-green mt-0.5 block leading-none font-bold">
                                            {activeStreak} hari
                                        </span>
                                        <span className="text-[10px] text-stone-400 font-semibold block mt-1">
                                            {activeStreak > 0 ? 'Konsistensi luar biasa!' : 'Mulai olahraga hari ini!'}
                                        </span>
                                    </div>
                                </div>

                                {/* Card 4: Rata-rata Progress */}
                                <div className="bg-white border border-stone-200/80 rounded-2xl p-4 flex items-center gap-3 shadow-2xs text-left">
                                    <div className="w-12 h-12 rounded-full bg-[#edf1e6] flex items-center justify-center shrink-0">
                                        <img src="/images/Icon Rentang Usia.png" alt="Rata-rata progress" className="w-6 h-6 object-contain" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Rata - rata Progress</span>
                                        <span className="text-lg font-black text-valley-green mt-0.5 block leading-none">
                                            {currentProgress}%
                                        </span>
                                        <span className="text-[10px] text-stone-400 font-semibold block mt-1">Seminggu terakhir</span>
                                    </div>
                                </div>
                            </div>

                            {/* Row 3: Workout To-Dos & Stacked Journal/Progress */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                                
                                {/* Left Side: Workout To-Dos (takes 7 columns) */}
                                <div className="lg:col-span-7 bg-white border border-stone-200 rounded-3xl p-6 shadow-sm text-left">
                                    <div className="mb-4">
                                        <h3 className="text-xs font-mono uppercase tracking-widest text-[#203b14] font-bold">LATIHAN HARI INI</h3>
                                        <p className="text-xs text-stone-400 font-medium mt-1">Rencanakan dan selesaikan latihan Anda hari ini</p>
                                    </div>
                                    
                                    <form onSubmit={handleTodoSubmit} className="mb-6">
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                value={todoForm.data.task_name}
                                                onChange={e => todoForm.setData('task_name', e.target.value)}
                                                placeholder="Tambahkan tugas latihan baru hari ini..."
                                                required
                                                className="flex-grow text-xs py-2.5 px-4 rounded-xl border border-stone-200 bg-stone-50/50 focus:border-valley-green outline-none transition"
                                            />
                                            <button 
                                                type="submit" 
                                                disabled={todoForm.processing}
                                                className="py-2.5 px-5 rounded-xl bg-[#203b14] hover:opacity-90 text-white font-bold text-xs transition disabled:opacity-50 cursor-pointer">
                                                Tambah
                                            </button>
                                        </div>
                                    </form>

                                    {todayTodos.length === 0 ? (
                                        <div className="text-center py-10 border border-dashed border-stone-200 rounded-2xl bg-stone-50/50">
                                            <span className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-300 font-bold mx-auto mb-2 text-sm">✓</span>
                                            <p className="text-xs text-stone-400 font-medium">Belum ada latihan hari ini.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {todayTodos.map(todo => (
                                                <div key={todo.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                                                    todo.is_completed ? 'bg-stone-50/70 border-stone-200 opacity-60' : 'bg-white border-stone-200 hover:shadow-xs'
                                                }`}>
                                                    <div className="flex items-center gap-3.5 min-w-0">
                                                        {getSportIcon(todo.sport_name || todo.task_name)}
                                                        <div className="min-w-0">
                                                            <p className={`text-xs font-bold leading-tight ${todo.is_completed ? 'line-through text-stone-400' : 'text-adaline-ink'}`}>
                                                                {todo.task_name}
                                                            </p>
                                                            <span className="inline-block text-[8px] font-bold uppercase font-mono text-stone-400 mt-1.5">
                                                                {todo.sport_name || 'LATIHAN'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button 
                                                            type="button" 
                                                            onClick={() => toggleTodo(todo.id)}
                                                            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                                                                todo.is_completed ? 'bg-[#203b14] border-[#203b14] text-white' : 'border-stone-300 bg-white hover:border-valley-green'
                                                            }`}>
                                                            {todo.is_completed && (
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                        <button onClick={() => deleteTodo(todo.id)} className="p-1.5 text-stone-300 hover:text-red-500 rounded transition cursor-pointer">
                                                            ✕
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Right Side: Journal & Weekly Progress (takes 5 columns) */}
                                <div className="lg:col-span-5 space-y-6 text-left">
                                    
                                    {/* Catatan Jurnal */}
                                    <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[260px]">
                                        <div>
                                            <div className="flex justify-between items-center border-b border-stone-100 pb-3 mb-4">
                                                <h3 className="text-xs font-mono uppercase tracking-widest text-[#203b14] font-bold">CATATAN JURNAL</h3>
                                                {activeJournalTab === 'list' ? (
                                                    <button onClick={() => { journalForm.reset(); setActiveJournalTab('create'); }} className="text-[10px] font-bold bg-[#203b14] text-white px-3 py-1 rounded-lg hover:opacity-90 transition cursor-pointer">
                                                        + Baru
                                                    </button>
                                                ) : (
                                                    <button onClick={() => { setActiveJournalTab('list'); journalForm.reset(); }} className="text-[10px] text-stone-400 hover:text-adaline-ink font-bold cursor-pointer">
                                                        Batal
                                                    </button>
                                                )}
                                            </div>

                                            {activeJournalTab === 'list' ? (
                                                <div className="space-y-4 max-h-[180px] overflow-y-auto pr-1">
                                                    {journals.length === 0 ? (
                                                        <div className="text-center py-8">
                                                            <p className="text-xs text-stone-400 font-medium">Jurnal latihan kosong.</p>
                                                            <p className="text-[10px] text-stone-400 mt-1">Mulai catat latihan dan percakapan Anda hari ini.</p>
                                                        </div>
                                                    ) : (
                                                        journals.map(j => (
                                                            <div key={j.id} className="p-4 bg-stone-50/50 border border-stone-200/70 rounded-2xl flex flex-col justify-between gap-3 hover:border-stone-300 transition">
                                                                <div className="flex justify-between items-start gap-2">
                                                                    <h4 className="font-bold text-xs text-adaline-ink">{j.title}</h4>
                                                                    <div className="flex gap-1 shrink-0">
                                                                        <button onClick={() => startEditJournal(j)} className="p-0.5 text-stone-400 hover:text-valley-green transition cursor-pointer">✏️</button>
                                                                        <button onClick={() => deleteJournal(j.id)} className="p-0.5 text-stone-400 hover:text-red-500 transition cursor-pointer">✕</button>
                                                                    </div>
                                                                </div>
                                                                <p className="text-[11px] text-stone-500 leading-relaxed line-clamp-2">{j.content}</p>
                                                                <div className="flex justify-between items-center text-[9px] font-mono text-stone-400 mt-2 border-t border-stone-100 pt-2">
                                                                    <span>{new Date(j.created_at).toLocaleDateString('id-ID')}</span>
                                                                    {j.mood && moodMap[j.mood] && (
                                                                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${moodMap[j.mood].bg}`}>
                                                                            {moodMap[j.mood].icon} {moodMap[j.mood].label}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            ) : (
                                                <form onSubmit={handleJournalSubmit} className="space-y-4">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold text-stone-400 uppercase">Judul Jurnal</label>
                                                        <input type="text" required value={journalForm.data.title} onChange={e => journalForm.setData('title', e.target.value)} placeholder="Refleksi hari ini..." className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-200 bg-canvas-ice/30 outline-none focus:border-valley-green" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold text-stone-400 uppercase">Isi Catatan</label>
                                                        <textarea required rows="3" value={journalForm.data.content} onChange={e => journalForm.setData('content', e.target.value)} placeholder="Tulis progres latihan Anda..." className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-200 bg-canvas-ice/30 outline-none focus:border-valley-green resize-none" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-stone-400 uppercase block">Suasana Hati</label>
                                                        <div className="grid grid-cols-4 gap-2">
                                                            {Object.entries(moodMap).map(([key, data]) => (
                                                                <button key={key} type="button" onClick={() => journalForm.setData('mood', key)} className={`py-1.5 rounded-xl border text-[10px] flex flex-col items-center gap-1 transition cursor-pointer ${
                                                                    journalForm.data.mood === key ? 'border-valley-green bg-forest-dew/40 text-valley-green font-bold' : 'border-stone-200 text-stone-400'
                                                                }`}>
                                                                    <span>{data.icon}</span>
                                                                    <span className="scale-90">{data.label}</span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <button type="submit" disabled={journalForm.processing} className="w-full py-2.5 bg-valley-green hover:opacity-90 text-white rounded-xl font-bold text-xs transition cursor-pointer">
                                                        {activeJournalTab === 'edit' ? 'Perbarui' : 'Simpan Jurnal'}
                                                    </button>
                                                </form>
                                            )}
                                        </div>
                                    </div>

                                    {/* Progress Minggu Ini */}
                                    <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
                                        <div className="border-b border-stone-100 pb-3 mb-4">
                                            <h3 className="text-xs font-mono uppercase tracking-widest text-[#203b14] font-bold">PROGRESS MINGGU INI</h3>
                                        </div>
                                        
                                        <div className="flex justify-between items-end h-32 px-1 mt-4 relative">
                                            {/* Y-Axis Lines (Grid lines) */}
                                            <div className="absolute inset-x-0 bottom-[120px] border-t border-stone-100"></div>
                                            <div className="absolute inset-x-0 bottom-[90px] border-t border-stone-100"></div>
                                            <div className="absolute inset-x-0 bottom-[60px] border-t border-stone-100"></div>
                                            <div className="absolute inset-x-0 bottom-[30px] border-t border-stone-100"></div>
                                            <div className="absolute inset-x-0 bottom-0 border-t border-stone-200"></div>

                                            {/* Chart Bars */}
                                            {[
                                                { day: 'Sen', pct: 60, color: 'bg-emerald-600' },
                                                { day: 'Sel', pct: 50, color: 'bg-emerald-600' },
                                                { day: 'Rab', pct: 95, color: 'bg-emerald-600' },
                                                { day: 'Kam', pct: 35, color: 'bg-emerald-600' },
                                                { day: 'Jum', pct: 15, color: 'bg-emerald-600' },
                                                { day: 'Sab', pct: 0, color: 'bg-emerald-100' },
                                                { day: 'Min', pct: 0, color: 'bg-emerald-100' },
                                            ].map((item, idx) => (
                                                <div key={idx} className="flex flex-col items-center gap-1.5 flex-1 relative z-10">
                                                    <span className="text-[8px] font-mono font-bold text-stone-400 leading-none">{item.pct}%</span>
                                                    <div className="w-5.5 bg-stone-50 rounded-t-md h-20 flex items-end overflow-hidden border border-stone-100/50">
                                                        <div className={`w-full ${item.color} rounded-t-sm transition-all duration-500`} style={{ height: `${item.pct}%` }}></div>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-stone-400 mt-0.5 leading-none">{item.day}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>
                    )}

                    {/* TAB 2: PROGRAM LATIHAN TAB */}
                    {activeTab === 'program' && (
                        <div className="space-y-6 animate-fade-in pb-12 text-left">
                            
                            {/* Header */}
                            <div>
                                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Program Latihan Personal</span>
                                <h1 className="text-2xl font-black text-adaline-ink mt-0.5">Program Latihan Personal Anda</h1>
                                <p className="text-xs text-stone-400 mt-1">
                                    Program ini dibuat berdasarkan pilihan Anda dari hasil rekomendasi.
                                </p>
                            </div>

                            {/* Main Illustration and Description (No Card Wrapper) */}
                            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 max-w-4xl relative">
                                <img 
                                    src={getSportImage(selectedProgramKey)} 
                                    alt={WEEKLY_PROGRAMS[selectedProgramKey].sport} 
                                    className="w-72 h-56 object-contain shrink-0 md:w-[340px] md:h-[260px] relative z-10 pointer-events-none" 
                                />
                                <div className="space-y-2.5">
                                    <h2 className="text-4xl font-black text-adaline-ink">
                                        {WEEKLY_PROGRAMS[selectedProgramKey].sport}
                                    </h2>
                                    <div>
                                        <span className="inline-block bg-[#166534] text-white text-xs font-semibold px-3.5 py-1 rounded-full">
                                            Program Terpilih
                                        </span>
                                    </div>
                                    <p className="text-xs text-stone-500 leading-relaxed max-w-xl">
                                        {WEEKLY_PROGRAMS[selectedProgramKey].desc}
                                    </p>
                                </div>
                            </div>

                            {/* Details summary row (4 grid cards) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl">
                                {[
                                    { lbl: 'Durasi Program', val: WEEKLY_PROGRAMS[selectedProgramKey].duration, sub: getDynamicDateRange(), icon: '/images/Calendar.png' },
                                    { lbl: 'Target Mingguan', val: WEEKLY_PROGRAMS[selectedProgramKey].target, sub: WEEKLY_PROGRAMS[selectedProgramKey].target_sub, icon: '/images/Target.png' },
                                    { lbl: 'Durasi per Sesi', val: WEEKLY_PROGRAMS[selectedProgramKey].duration_per_sesi, sub: WEEKLY_PROGRAMS[selectedProgramKey].duration_per_sesi_sub, icon: '/images/Clock.png' },
                                    { lbl: 'Fokus Program', val: WEEKLY_PROGRAMS[selectedProgramKey].focus, sub: WEEKLY_PROGRAMS[selectedProgramKey].focus_sub, icon: '/images/Activity.png' },
                                ].map((card, idx) => (
                                    <div key={idx} className="bg-white border border-stone-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-3xs text-left">
                                        <div className="w-12 h-12 rounded-full bg-[#edf6ed] flex items-center justify-center shrink-0">
                                            <img src={card.icon} alt={card.lbl} className="w-6 h-6 object-contain" />
                                        </div>
                                        <div className="min-w-0">
                                            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block leading-none">{card.lbl}</span>
                                            <span className="text-sm font-black text-valley-green block mt-2 leading-none">{card.val}</span>
                                            <span className="text-[9px] text-stone-400 block mt-1 leading-normal truncate">{card.sub}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Jadwal Mingguan Table matching page 2 exactly */}
                            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-md space-y-4">
                                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                                    <div>
                                        <h3 className="font-extrabold text-sm text-valley-green">Jadwal Mingguan (Minggu {currentWeek} dari 4)</h3>
                                        <p className="text-[10px] text-stone-400 leading-normal mt-0.5">Ikuti jadwal latihan berikut secara konsisten untuk hasil yang optimal.</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {checkedDaysCount === 7 && currentWeek < 4 && (
                                            <button 
                                                onClick={() => {
                                                    if (confirm(`Apakah Anda yakin ingin menyelesaikan Minggu ${currentWeek} dan lanjut ke Minggu ${currentWeek + 1}?`)) {
                                                        const nextWeekChecklist = { Senin: false, Selasa: false, Rabu: false, Kamis: false, Jumat: false, Sabtu: false, Minggu: false, current_week: currentWeek + 1 };
                                                        setWeeklyChecklist(nextWeekChecklist);
                                                        router.patch(route('workspace.checklist.update'), { checklist: nextWeekChecklist }, { preserveScroll: true });
                                                    }
                                                }}
                                                className="py-2.5 px-4 rounded-xl border border-emerald-200 hover:border-emerald-600 text-emerald-700 hover:bg-emerald-50/50 font-bold text-xs transition flex items-center gap-1.5 shadow-3xs cursor-pointer bg-white">
                                                <span>⏭️</span> Lanjut ke Minggu {currentWeek + 1}
                                            </button>
                                        )}
                                        {checkedDaysCount === 7 && currentWeek === 4 && (
                                            <button 
                                                onClick={() => {
                                                    if (confirm('Selamat! Anda telah menyelesaikan seluruh program latihan 4 minggu. Klik OK untuk menyelesaikan dan mereset program.')) {
                                                        const resetChecklist = { Senin: false, Selasa: false, Rabu: false, Kamis: false, Jumat: false, Sabtu: false, Minggu: false, current_week: 1 };
                                                        setWeeklyChecklist(resetChecklist);
                                                        router.patch(route('workspace.checklist.update'), { checklist: resetChecklist }, { preserveScroll: true });
                                                    }
                                                }}
                                                className="py-2.5 px-4 rounded-xl border border-emerald-200 hover:border-emerald-600 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-bold text-xs transition flex items-center gap-1.5 shadow-3xs cursor-pointer animate-pulse">
                                                <span>🎉</span> Selesaikan Program
                                            </button>
                                        )}
                                        {checkedDaysCount > 0 && checkedDaysCount < 7 && (
                                            <button 
                                                onClick={() => {
                                                    if (confirm(`Apakah Anda yakin ingin mereset progres latihan Minggu ${currentWeek} ini?`)) {
                                                        const resetChecklist = { Senin: false, Selasa: false, Rabu: false, Kamis: false, Jumat: false, Sabtu: false, Minggu: false, current_week: currentWeek };
                                                        setWeeklyChecklist(resetChecklist);
                                                        router.patch(route('workspace.checklist.update'), { checklist: resetChecklist }, { preserveScroll: true });
                                                    }
                                                }}
                                                className="py-2.5 px-4 rounded-xl border border-red-200 hover:border-red-600 text-red-600 hover:text-red-700 bg-white hover:bg-red-50/50 font-bold text-xs transition flex items-center gap-1.5 shadow-3xs cursor-pointer">
                                                <span>🔄</span> Reset Progres Minggu Ini
                                            </button>
                                        )}
                                        <button 
                                            onClick={handleDownloadSchedule}
                                            className="py-2.5 px-4 rounded-xl border border-stone-200 hover:border-valley-green text-stone-600 hover:text-valley-green bg-white hover:bg-stone-50 font-bold text-xs transition flex items-center gap-1.5 shadow-3xs cursor-pointer">
                                            <span>📥</span> Unduh Jadwal
                                        </button>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs md:text-sm text-left">
                                        <thead>
                                            <tr className="bg-stone-50 border-b border-stone-100 text-stone-400 font-bold uppercase tracking-wider text-[10px]">
                                                <th className="px-5 py-4 w-28">Hari</th>
                                                <th className="px-5 py-4">Aktivitas</th>
                                                <th className="px-5 py-4 w-32">Durasi</th>
                                                <th className="px-5 py-4 w-32">Intensitas</th>
                                                <th className="px-5 py-4 w-32">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-100">
                                            {WEEKLY_PROGRAMS[selectedProgramKey].schedule.map((row) => {
                                                const isCompleted = weeklyChecklist[row.day];
                                                return (
                                                    <tr key={row.day} className={`hover:bg-stone-50/40 transition ${isCompleted ? 'bg-emerald-50/10 opacity-75' : ''}`}>
                                                        <td className="px-5 py-4 font-bold text-valley-green">
                                                            <div>{row.day}</div>
                                                            <div className="text-[10px] text-stone-400 font-semibold mt-0.5">{getWeekdayDateStr(row.day)}</div>
                                                        </td>
                                                        <td className={`px-5 py-4 font-bold ${isCompleted ? 'line-through text-stone-400' : 'text-adaline-ink'}`}>{row.activity}</td>
                                                        <td className="px-5 py-4 text-stone-500 font-medium">{row.duration}</td>
                                                        <td className="px-5 py-4">
                                                            {row.intensity !== '-' ? (
                                                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${row.intensityColor}`}>
                                                                    {row.intensity}
                                                                </span>
                                                            ) : '-'}
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <button 
                                                                onClick={() => toggleWeekDay(row.day)}
                                                                className={`inline-flex items-center gap-1.5 cursor-pointer text-left select-none text-[11px] font-bold ${
                                                                    isCompleted ? 'text-emerald-600' : 'text-stone-400 hover:text-stone-600'
                                                                }`}>
                                                                {isCompleted ? (
                                                                    <img src="/images/Check circle.png" alt="Selesai" className="w-4.5 h-4.5 object-contain" />
                                                                ) : (
                                                                    <span className="w-4 h-4 rounded-full border border-stone-300 bg-white flex items-center justify-center" />
                                                                )}
                                                                {isCompleted ? 'Selesai' : 'Belum'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    )}

                    {/* TAB 3: RIWAYAT TAB (Redesigned matching page 1 exactly) */}
                    {activeTab === 'riwayat' && (
                        <div className="space-y-8 animate-fade-in text-left">
                            {/* Top statistics card */}
                            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                                <div className="absolute right-0 top-0 w-32 h-32 bg-forest-dew/10 rounded-full blur-2xl"></div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                                    <div className="space-y-1.5 max-w-xl">
                                        <h2 className="text-xl font-extrabold text-valley-green">Riwayat Aktivitas Anda</h2>
                                        <p className="text-xs text-stone-400">Pantau perkembangan rekomendasi dan program latihan yang telah Anda jalani.</p>
                                    </div>
                                    <div className="hidden sm:flex items-center shrink-0 w-28 h-20 relative select-none pointer-events-none">
                                        <svg className="w-full h-full" viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            {/* Leaves/Foliage Backdrop */}
                                            <path d="M 20,70 C 10,50 30,30 50,40 C 60,20 80,30 90,50 C 100,70 80,90 60,80 C 40,90 30,85 20,70 Z" fill="#d7e8b5" opacity="0.35" />
                                            <path d="M 85,30 C 95,20 110,35 105,45 Z" fill="#4ade80" opacity="0.25" />

                                            {/* Calendar (sitting on the left) */}
                                            {/* Base Card */}
                                            <rect x="15" y="25" width="45" height="46" rx="6" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
                                            {/* Calendar Header (forest green) */}
                                            <path d="M 15,31 C 15,27.7 17.7,25 21,25 L 54,25 C 57.3,25 60,27.7 60,31 L 60,35 L 15,35 Z" fill="#166534" />
                                            
                                            {/* Spiral Rings */}
                                            <rect x="23" y="21" width="3.5" height="8" rx="1.5" fill="#94a3b8" />
                                            <rect x="38" y="21" width="3.5" height="8" rx="1.5" fill="#94a3b8" />
                                            <rect x="53" y="21" width="3.5" height="8" rx="1.5" fill="#94a3b8" />

                                            {/* Grid dots */}
                                            <circle cx="25" cy="44" r="2" fill="#cbd5e1" />
                                            <circle cx="37" cy="44" r="2" fill="#cbd5e1" />
                                            <circle cx="49" cy="44" r="2" fill="#cbd5e1" />
                                            <circle cx="25" cy="56" r="2" fill="#cbd5e1" />
                                            <circle cx="37" cy="56" r="2" fill="#cbd5e1" />
                                            <circle cx="49" cy="56" r="2" fill="#cbd5e1" />
                                            <circle cx="25" cy="68" r="2" fill="#cbd5e1" />
                                            <circle cx="37" cy="68" r="2" fill="#cbd5e1" />

                                            {/* Checkmarks over grid */}
                                            <path d="M 22,44 L 24,46 L 28,41" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                            <path d="M 34,56 L 36,58 L 40,53" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                            <path d="M 46,44 L 48,46 L 52,41" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

                                            {/* Stopwatch (overlapping the calendar on the right) */}
                                            {/* Outer Casing */}
                                            <circle cx="78" cy="52" r="23" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
                                            {/* Inner Dial Face */}
                                            <circle cx="78" cy="52" r="19" fill="#f8fafc" stroke="#4ade80" strokeWidth="1.5" />
                                            
                                            {/* Stopwatch Markings */}
                                            <line x1="78" y1="33" x2="78" y2="37" stroke="#cbd5e1" strokeWidth="1.5" />
                                            <line x1="97" y1="52" x2="93" y2="52" stroke="#cbd5e1" strokeWidth="1.5" />
                                            <line x1="78" y1="71" x2="78" y2="67" stroke="#cbd5e1" strokeWidth="1.5" />
                                            <line x1="59" y1="52" x2="63" y2="52" stroke="#cbd5e1" strokeWidth="1.5" />

                                            {/* Chrono hand */}
                                            <line x1="78" y1="52" x2="86" y2="41" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" />
                                            <circle cx="78" cy="52" r="3.5" fill="#166534" />
                                            
                                            {/* Buttons */}
                                            <rect x="75" y="25" width="6" height="4" fill="#64748b" rx="1" /> {/* Crown */}
                                            <path d="M 92,35 L 95,38" stroke="#64748b" strokeWidth="3.5" strokeLinecap="round" /> {/* Side Split Button */}
                                        </svg>
                                    </div>
                                </div>
                                
                                {/* 4 Stats counters row */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-stone-100 mt-6 pt-6 border-t border-stone-100">
                                    {[
                                        { 
                                            label: 'Total Analisis', 
                                            value: totalAnalisisCount.toString(), 
                                            change: totalAnalisisCount > 0 ? 'Analisis berhasil dilakukan' : 'Belum ada analisis', 
                                            icon: '/images/Activity.png' 
                                        },
                                        { 
                                            label: 'Program Aktif', 
                                            value: activeProgramsCount.toString(), 
                                            change: activeProgramsCount > 0 ? 'Sedang Berjalan' : 'Tidak ada program aktif', 
                                            icon: '/images/Clipboard.png' 
                                        },
                                        { 
                                            label: 'Latihan Selesai', 
                                            value: totalCompletedWorkouts.toString(), 
                                            change: 'Sesi latihan selesai', 
                                            icon: '/images/Award.png' 
                                        },
                                        { 
                                            label: 'Konsistensi', 
                                            value: `${currentProgress}%`, 
                                            change: currentProgress >= 80 ? 'Sangat bagus!' : currentProgress >= 50 ? 'Bagus!' : 'Tingkatkan lagi!', 
                                            icon: '/images/Target.png' 
                                        },
                                    ].map((stat, idx) => (
                                        <div key={idx} className={`flex items-center gap-4 ${idx > 0 ? 'pt-4 lg:pt-0 lg:pl-6' : ''}`}>
                                            <div className="w-11 h-11 rounded-full bg-[#edf6ed] flex items-center justify-center shrink-0">
                                                <img src={stat.icon} alt={stat.label} className="w-5.5 h-5.5 object-contain" />
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block leading-none">{stat.label}</span>
                                                <span className="text-xl font-extrabold text-adaline-ink mt-2.5 block leading-none">{stat.value}</span>
                                                <span className="text-[9px] text-stone-400 block font-medium mt-1.5 leading-normal">{stat.change}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Riwayat Program Latihan card */}
                            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
                                <h3 className="font-extrabold text-sm text-valley-green mb-4 pb-2 border-b border-stone-100">Riwayat Program Latihan</h3>
                                
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs md:text-sm text-left">
                                        <thead>
                                            <tr className="bg-[#edf6ed]/70 text-valley-green font-bold uppercase tracking-wider text-[10px]">
                                                <th className="px-5 py-4">Periode</th>
                                                <th className="px-5 py-4">Program</th>
                                                <th className="px-5 py-4">Rekomendasi</th>
                                                <th className="px-5 py-4">Progress</th>
                                                <th className="px-5 py-4">Status</th>
                                                <th className="px-5 py-4">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-100">
                                            {displayedHistory.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="px-5 py-8 text-center text-stone-400 font-semibold text-xs">
                                                        Belum ada riwayat program latihan. Selesaikan 100% target mingguan program latihan Anda untuk memunculkannya di sini.
                                                    </td>
                                                </tr>
                                            ) : (
                                                displayedHistory.map((prog, i) => (
                                                    <tr key={i} className="hover:bg-stone-50/50 transition">
                                                        <td className="px-5 py-4 text-left">
                                                            <span className="text-xs font-bold text-adaline-ink block">{prog.period}</span>
                                                            <span className="text-[10px] text-stone-400 font-semibold block mt-0.5">({prog.duration})</span>
                                                        </td>
                                                        <td className="px-5 py-4 font-bold text-adaline-ink text-left">{prog.type}</td>
                                                        <td className="px-5 py-4 text-left">
                                                            <div className="flex items-center gap-2">
                                                                <img src={getSportIconPath(prog.sport)} className="w-5.5 h-5.5 object-contain shrink-0" alt={prog.sport} />
                                                                <span className="text-xs font-bold text-adaline-ink">{prog.sport}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-4 text-left">
                                                            <div className="flex items-center gap-2.5">
                                                                <div className="w-20 h-1.5 bg-stone-100 rounded-full overflow-hidden shrink-0">
                                                                    <div className="h-full bg-valley-green rounded-full" style={{ width: `${prog.progress}%` }}></div>
                                                                </div>
                                                                <span className="font-bold text-[10px] text-stone-600">{prog.progress}%</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-4 text-left">
                                                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${prog.statusColor}`}>
                                                                {prog.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-4 text-left">
                                                            <button 
                                                                onClick={() => { 
                                                                    const key = getProgramKey(prog.sport);
                                                                    setSelectedProgramKey(key); 
                                                                    setActiveTab('program'); 
                                                                }} 
                                                                className="text-xs font-bold text-stone-500 hover:text-valley-green transition cursor-pointer">
                                                                Lihat Detail
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 4: PROFIL TAB */}
                    {activeTab === 'profil' && (() => {

                        // BMI category
                        const getBmiCategory = (bmi) => {
                            if (!bmi) return { label: '-', color: 'text-stone-400' };
                            const b = parseFloat(bmi);
                            if (b < 17)   return { label: 'Sangat Kurus', color: 'text-blue-500' };
                            if (b < 18.5) return { label: 'Kurus',        color: 'text-sky-500' };
                            if (b < 25)   return { label: 'Normal',       color: 'text-emerald-600' };
                            if (b < 30)   return { label: 'Overweight',   color: 'text-amber-500' };
                            return              { label: 'Obesitas',       color: 'text-red-500' };
                        };
                        const bmiCat = getBmiCategory(user.bmi);

                        // Stats for ringkasan
                        const statsData = [
                            { icon: '🔥', label: 'Total Analisis',       val: `${totalAnalisisCount} Kali`,    color: 'bg-orange-50 text-orange-500' },
                            { icon: '✅', label: 'Program Selesai',       val: `${displayedHistory.length} Program`, color: 'bg-emerald-50 text-emerald-600' },
                            { icon: '📅', label: 'Hari Konsisten',        val: `${activeStreak} Hari`,          color: 'bg-blue-50 text-blue-500' },
                            { icon: '📈', label: 'Rata - rata Progress',  val: `${currentProgress}%`,           color: 'bg-violet-50 text-violet-500' },
                            { icon: '🔥', label: 'Kalori Terbakar',       val: totalCompletedWorkouts > 0 ? `${(totalCompletedWorkouts * 350).toLocaleString('id-ID')} kkal` : '-', color: 'bg-red-50 text-red-500' },
                        ];

                        // Join date from created_at
                        const joinDate = user.created_at
                            ? new Date(user.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
                            : 'Mei 2026';

                        return (
                            <div className="space-y-5 animate-fade-in text-left pb-10">

                                {/* ── HEADER CARD ──────────────────────────────── */}
                                <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                                    <div className="absolute right-0 top-0 w-48 h-48 bg-forest-dew/10 rounded-full blur-3xl pointer-events-none" />
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-5 relative z-10">

                                        {/* Avatar */}
                                        <div className="relative group shrink-0">
                                            <img
                                                className="w-20 h-20 rounded-full border-2 border-forest-dew/60 object-cover shadow-md"
                                                src={user.profile_photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&color=166534&background=edf6ed&size=160`}
                                                alt={user.name}
                                            />
                                            <label className="absolute inset-0 rounded-full bg-black/50 flex flex-col items-center justify-center text-white text-[9px] font-bold opacity-0 group-hover:opacity-100 cursor-pointer transition-all select-none">
                                                <span className="text-lg">📷</span>
                                                <span className="mt-0.5">UBAH</span>
                                                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                                            </label>
                                        </div>

                                        {/* Name + meta */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h1 className="text-2xl font-extrabold text-valley-green">{user.name}</h1>
                                                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[9px] uppercase tracking-wider">Aktif</span>
                                            </div>
                                            <p className="text-xs text-stone-400 mt-0.5">{user.email}</p>
                                            <p className="text-[10px] text-stone-400 mt-0.5">Bergabung sejak {joinDate}</p>
                                        </div>

                                        {/* Stat chips */}
                                        <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
                                            {[
                                                { icon: '/images/Icon Rentang Usia.png', label: 'Usia',   val: user.age ? `${user.age} Tahun` : '-' },
                                                { icon: '/images/Icon Tinggi.png',       label: 'Tinggi', val: user.height ? `${Math.round(user.height)} cm` : '-' },
                                                { icon: '/images/Icon Usia.png',         label: 'Berat',  val: user.weight ? `${Math.round(user.weight)} kg` : '-' },
                                            ].map((chip, idx) => (
                                                <div key={idx} className="flex items-center gap-2 bg-stone-50 border border-stone-200/70 rounded-xl px-3 py-2 min-w-[80px]">
                                                    <div className="w-7 h-7 rounded-full bg-[#edf6ed] flex items-center justify-center shrink-0">
                                                        <img src={chip.icon} alt={chip.label} className="w-4 h-4 object-contain" onError={e => { e.target.style.display = 'none'; }} />
                                                    </div>
                                                    <div>
                                                        <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider block leading-none">{chip.label}</span>
                                                        <span className="text-xs font-extrabold text-valley-green leading-tight block mt-0.5">{chip.val}</span>
                                                    </div>
                                                </div>
                                            ))}
                                            {/* BMI chip — special */}
                                            <div className="flex items-center gap-2 bg-stone-50 border border-stone-200/70 rounded-xl px-3 py-2 min-w-[80px]">
                                                <div className="w-7 h-7 rounded-full bg-[#edf6ed] flex items-center justify-center shrink-0 text-[10px] font-black text-valley-green">BMI</div>
                                                <div>
                                                    <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider block leading-none">BMI</span>
                                                    <span className={`text-xs font-extrabold leading-tight block mt-0.5 ${bmiCat.color}`}>{user.bmi ? Number(user.bmi).toFixed(1) : '-'}</span>
                                                    <span className="text-[8px] text-stone-400 block leading-none">{bmiCat.label}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ── BODY ROW: Info + Stats ─────────────────── */}
                                <div className="grid lg:grid-cols-5 gap-5 items-start">

                                    {/* Left: Informasi Pribadi */}
                                    <div className="lg:col-span-3 bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
                                        <div className="flex justify-between items-center mb-5 pb-3 border-b border-stone-100">
                                            <h3 className="font-extrabold text-sm text-valley-green">Informasi Pribadi</h3>
                                            {!isEditingProfile ? (
                                                <button
                                                    onClick={() => setIsEditingProfile(true)}
                                                    className="flex items-center gap-1.5 text-[11px] font-bold border border-stone-200 hover:border-valley-green px-3.5 py-1.5 rounded-xl text-stone-600 hover:text-valley-green transition cursor-pointer bg-white"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                    Edit
                                                </button>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setIsEditingProfile(false)}
                                                        className="text-[11px] font-bold text-stone-400 hover:text-stone-600 px-3 py-1.5 rounded-xl border border-stone-200 hover:border-stone-300 transition cursor-pointer"
                                                    >
                                                        Batal
                                                    </button>
                                                    <button
                                                        form="profile-edit-form"
                                                        type="submit"
                                                        disabled={profileSaving}
                                                        className="text-[11px] font-bold bg-valley-green text-white px-3.5 py-1.5 rounded-xl hover:opacity-90 transition cursor-pointer disabled:opacity-50"
                                                    >
                                                        {profileSaving ? 'Menyimpan...' : 'Simpan'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* READ MODE */}
                                        {!isEditingProfile && (
                                            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                                                {[
                                                    { icon: '👤', lbl: 'Nama Lengkap',  val: user.name },
                                                    { icon: '⚥',  lbl: 'Jenis Kelamin', val: user.gender === 'Male' ? 'Laki-laki' : user.gender === 'Female' ? 'Perempuan' : '-' },
                                                    { icon: '🎂', lbl: 'Tanggal Lahir', val: user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-' },
                                                    { icon: '🔢', lbl: 'Usia',           val: user.age ? `${user.age} Tahun` : '-' },
                                                    { icon: '📧', lbl: 'Email',          val: user.email },
                                                    { icon: '📞', lbl: 'Nomor Telepon',  val: user.phone || '-' },
                                                    { icon: '🏠', lbl: 'Alamat',         val: user.address || '-' },
                                                    { icon: '💼', lbl: 'Pekerjaan',      val: user.job || '-' },
                                                    { icon: '🎯', lbl: 'Target Aktivitas', val: user.activity_level || '-' },
                                                ].map((row, idx) => (
                                                    <div key={idx} className="flex items-start gap-3 pb-3.5 border-b border-stone-50 last:border-0">
                                                        <div className="w-8 h-8 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center shrink-0 text-sm">
                                                            {row.icon}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider block leading-none">{row.lbl}</span>
                                                            <span className="text-xs font-semibold text-adaline-ink mt-1 block break-words">{row.val || '-'}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* EDIT MODE */}
                                        {isEditingProfile && (
                                            <form id="profile-edit-form" onSubmit={handleProfileSave}>
                                                <div className="grid sm:grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold text-stone-400 uppercase">Nama Lengkap *</label>
                                                        <input required type="text" value={profileForm.name} onChange={e => setProfileForm(p => ({...p, name: e.target.value}))} placeholder="Nama lengkap" className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-stone-200 bg-stone-50/50 focus:border-valley-green outline-none transition" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold text-stone-400 uppercase">Jenis Kelamin</label>
                                                        <select value={profileForm.gender} onChange={e => setProfileForm(p => ({...p, gender: e.target.value}))} className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-stone-200 bg-stone-50/50 focus:border-valley-green outline-none transition">
                                                            <option value="">-- Pilih --</option>
                                                            <option value="Male">Laki-laki</option>
                                                            <option value="Female">Perempuan</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold text-stone-400 uppercase">Tanggal Lahir</label>
                                                        <input type="date" value={profileForm.date_of_birth} onChange={e => setProfileForm(p => ({...p, date_of_birth: e.target.value}))} className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-stone-200 bg-stone-50/50 focus:border-valley-green outline-none transition" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold text-stone-400 uppercase">Usia (Tahun)</label>
                                                        <input type="number" min="1" max="120" value={profileForm.age} onChange={e => setProfileForm(p => ({...p, age: e.target.value}))} placeholder="22" className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-stone-200 bg-stone-50/50 focus:border-valley-green outline-none transition" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold text-stone-400 uppercase">Nomor Telepon</label>
                                                        <input type="tel" value={profileForm.phone} onChange={e => setProfileForm(p => ({...p, phone: e.target.value}))} placeholder="+62 812 xxxx xxxx" className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-stone-200 bg-stone-50/50 focus:border-valley-green outline-none transition" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold text-stone-400 uppercase">Pekerjaan</label>
                                                        <input type="text" value={profileForm.job} onChange={e => setProfileForm(p => ({...p, job: e.target.value}))} placeholder="Pelajar / Mahasiswa..." className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-stone-200 bg-stone-50/50 focus:border-valley-green outline-none transition" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold text-stone-400 uppercase">Target Aktivitas</label>
                                                        <select value={profileForm.activity_level} onChange={e => setProfileForm(p => ({...p, activity_level: e.target.value}))} className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-stone-200 bg-stone-50/50 focus:border-valley-green outline-none transition">
                                                            <option value="">-- Pilih --</option>
                                                            <option value="Rendah">Rendah</option>
                                                            <option value="Sedang">Sedang</option>
                                                            <option value="Tinggi">Tinggi</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-1 sm:col-span-2">
                                                        <label className="text-[10px] font-bold text-stone-400 uppercase">Alamat</label>
                                                        <input type="text" value={profileForm.address} onChange={e => setProfileForm(p => ({...p, address: e.target.value}))} placeholder="Kota / Provinsi..." className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-stone-200 bg-stone-50/50 focus:border-valley-green outline-none transition" />
                                                    </div>
                                                </div>
                                                <p className="text-[9px] text-stone-400 mt-3">* Wajib diisi. Email tidak dapat diubah dari sini.</p>
                                            </form>
                                        )}
                                    </div>

                                    {/* Right: Ringkasan Statistik */}
                                    <div className="lg:col-span-2 bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
                                        <h3 className="font-extrabold text-sm text-valley-green mb-4 pb-3 border-b border-stone-100">Ringkasan Statistik</h3>
                                        <div className="space-y-3">
                                            {statsData.map((s, idx) => (
                                                <div key={idx} className="flex items-center justify-between py-2 border-b border-stone-50 last:border-0">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-full ${s.color} flex items-center justify-center text-sm shrink-0`}>
                                                            {s.icon}
                                                        </div>
                                                        <span className="text-xs text-stone-500 font-medium">{s.label}</span>
                                                    </div>
                                                    <span className="text-sm font-extrabold text-valley-green">{s.val}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* ── BOTTOM ROW: Pengaturan + Hapus Akun ──── */}
                                <div className="grid lg:grid-cols-5 gap-5 items-start">
                                    {/* Pengaturan Akun */}
                                    <div className="lg:col-span-3 bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
                                        <h3 className="font-extrabold text-sm text-valley-green mb-1 pb-3 border-b border-stone-100">Pengaturan Akun</h3>
                                        <p className="text-[10px] text-stone-400 mb-4 mt-1">Atur preferensi dasar akun Anda.</p>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between gap-4">
                                                <div>
                                                    <span className="text-xs font-bold text-adaline-ink block">Bahasa Aplikasi</span>
                                                    <span className="text-[10px] text-stone-400 mt-0.5 block">Bahasa yang digunakan di aplikasi</span>
                                                </div>
                                                <select className="text-xs border border-stone-200 bg-white rounded-xl px-3 py-2 focus:border-valley-green outline-none cursor-pointer shrink-0">
                                                    <option>Bahasa Indonesia</option>
                                                    <option>English</option>
                                                </select>
                                            </div>
                                            <div className="flex items-center justify-between gap-4 pt-4 border-t border-stone-50">
                                                <div>
                                                    <span className="text-xs font-bold text-adaline-ink block">Satuan Pengukuran</span>
                                                    <span className="text-[10px] text-stone-400 mt-0.5 block">Satuan untuk tinggi badan dan berat badan</span>
                                                </div>
                                                <select className="text-xs border border-stone-200 bg-white rounded-xl px-3 py-2 focus:border-valley-green outline-none cursor-pointer shrink-0">
                                                    <option>cm / kg</option>
                                                    <option>in / lbs</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hapus Akun */}
                                    <div className="lg:col-span-2 bg-white border border-red-100 rounded-3xl p-6 shadow-sm">
                                        <div className="flex items-start gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                                                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </div>
                                            <div>
                                                <h3 className="font-extrabold text-sm text-red-600">Hapus Akun</h3>
                                                <p className="text-[10px] text-stone-400 mt-0.5 leading-relaxed">Hapus akun dan semua data secara permanen. Tindakan ini tidak dapat dibatalkan.</p>
                                            </div>
                                        </div>
                                        <Link
                                            href={route('profile.destroy')}
                                            method="delete"
                                            as="button"
                                            data={{ password: '' }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const pw = prompt('Masukkan password Anda untuk mengonfirmasi penghapusan akun:');
                                                if (pw !== null && pw.trim() !== '') {
                                                    if (confirm('Apakah Anda benar-benar yakin ingin menghapus akun ini? Semua data akan hilang permanen.')) {
                                                        router.delete(route('profile.destroy'), { data: { password: pw }, preserveScroll: false });
                                                    }
                                                }
                                            }}
                                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-400 text-red-600 rounded-xl font-bold text-xs transition cursor-pointer"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            Hapus Akun Saya
                                        </Link>
                                    </div>
                                </div>

                            </div>
                        );
                    })()}

                    {/* TAB 5: HASIL REKOMENDASI TAB */}
                    {activeTab === 'rekomendasi' && (() => {
                        const sportDetails = SPORT_RECOMMENDATION_DETAILS[selectedRecommendSport] || SPORT_RECOMMENDATION_DETAILS['Jogging'];
                        const formattedBmi = user.bmi ? Number(user.bmi).toFixed(2) : '21.75';
                        const bmiStatus = user.bmi ? (
                            user.bmi < 18.5 ? 'Kurus' :
                            user.bmi < 25 ? 'Normal' :
                            user.bmi < 30 ? 'Overweight' : 'Obesitas'
                        ) : 'Normal';

                        const translateCondition = (cond) => {
                            switch(cond) {
                                case 'knee_injury': return 'Cedera Lutut';
                                case 'asthma': return 'Gangguan Asma';
                                case 'heart': return 'Masalah Jantung';
                                default: return 'Tidak Ada (Fit)';
                            }
                        };

                        const renderStars = (count) => {
                            return (
                                <div className="flex gap-0.5 justify-center">
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <svg
                                            key={index}
                                            className={`w-3.5 h-3.5 ${index < count ? 'text-amber-400 fill-amber-400' : 'text-white/30 fill-none stroke-current stroke-2'}`}
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                        </svg>
                                    ))}
                                </div>
                            );
                        };

                        return (
                            <div className="animate-fade-in pb-12 max-w-[850px] text-left">
                                {/* Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                        <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Hasil Rekomendasi</span>
                                        <h1 className="text-2xl font-black text-adaline-ink mt-0.5">Hasil Rekomendasi Olahraga Anda</h1>
                                        <p className="text-xs text-stone-400 mt-1">
                                            Berdasarkan data profil dan kebiasaan Anda berikut rekomendasi olahraga yang paling sesuai
                                        </p>
                                    </div>
                                    <a href={route('home') + '#form'} className="py-2.5 px-5 rounded-xl border border-stone-200 hover:border-valley-green text-stone-600 hover:text-valley-green bg-white font-bold text-xs transition self-start sm:self-center shrink-0">
                                        Analisis Ulang ↺
                                    </a>
                                </div>

                                {/* Main Green Card */}
                                <div className="mt-6 bg-[#0a482e] rounded-[32px] p-6 md:p-8 shadow-lg text-white flex flex-col justify-between gap-6 relative overflow-hidden">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        {/* Left Side: Badge + Info */}
                                        <div className="flex items-start gap-4 md:gap-6">
                                            <img 
                                                src="/images/badge 1.png" 
                                                alt="Gold Medal Badge" 
                                                className="w-16 h-16 md:w-20 md:h-20 object-contain shrink-0 mt-1" 
                                            />
                                            
                                            <div className="space-y-1">
                                                <span className="inline-block bg-[#e2f3e5] text-[#0a482e] text-[10px] font-extrabold tracking-wider px-3 py-1 rounded-full uppercase">
                                                    Rekomendasi Utama
                                                </span>
                                                
                                                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-1 text-white">
                                                    {sportDetails.name}
                                                </h2>
                                                
                                                <div className="mt-2">
                                                    <span className="inline-block bg-[#0c5938] text-white text-xs font-semibold px-3.5 py-1 rounded-full border border-white/10">
                                                        {sportDetails.suitability}
                                                    </span>
                                                </div>
                                                
                                                <div className="mt-4 pt-2 space-y-1 text-xs text-white/95">
                                                    <h4 className="font-bold text-xs text-white">Kenapa Direkomendasikan ?</h4>
                                                    <div className="grid grid-cols-[105px_16px_1fr] gap-y-1 items-center mt-1.5 text-[11px] md:text-xs text-white/80">
                                                        <span>BMI / IMT</span>
                                                        <span className="text-center">:</span>
                                                        <span className="font-semibold text-white">{formattedBmi} ({bmiStatus})</span>
                                                        
                                                        <span>Kondisi Fisik</span>
                                                        <span className="text-center">:</span>
                                                        <span className="font-semibold text-white">{translateCondition(user.physical_condition)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Right Side: Circular Progress */}
                                        <div className="flex flex-col items-center justify-center self-center md:mr-4 shrink-0">
                                            <div className="relative w-32 h-32 flex items-center justify-center">
                                                {/* SVG Progress Circle */}
                                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                                    {/* Track */}
                                                    <circle
                                                        cx="50"
                                                        cy="50"
                                                        r="40"
                                                        className="stroke-white/10"
                                                        strokeWidth="4"
                                                        fill="none"
                                                    />
                                                    {/* Progress Bar */}
                                                    <circle
                                                        cx="50"
                                                        cy="50"
                                                        r="40"
                                                        className="stroke-[#A3E635]"
                                                        strokeWidth="8"
                                                        strokeDasharray={2 * Math.PI * 40}
                                                        strokeDashoffset={2 * Math.PI * 40 * (1 - sportDetails.score / 100)}
                                                        strokeLinecap="round"
                                                        fill="none"
                                                    />
                                                    
                                                    {/* Decorative Accent Dot at top-left of circle */}
                                                    <circle
                                                        cx={50 + 40 * Math.cos((-105 * Math.PI) / 180)}
                                                        cy={50 + 40 * Math.sin((-105 * Math.PI) / 180)}
                                                        r="4"
                                                        fill="#e2f3e5"
                                                    />
                                                </svg>
                                                
                                                {/* Content Inside */}
                                                <div className="absolute text-center flex flex-col items-center justify-center">
                                                    <span className="text-3xl font-extrabold tracking-tight text-white leading-none">
                                                        {sportDetails.score}%
                                                    </span>
                                                    <span className="text-[9px] text-white/75 font-semibold tracking-wide mt-1 block">
                                                        Skor Kecocokan
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Bottom Section: 4 outlined boxes */}
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mt-2">
                                        <div className="border border-white/15 rounded-2xl p-4 bg-white/5 flex flex-col items-center justify-center text-center backdrop-blur-3xs">
                                            <span className="text-[11px] text-white/70 font-semibold block mb-1">
                                                Intensitas
                                            </span>
                                            {renderStars(sportDetails.stars)}
                                            <span className="text-[10px] text-white font-medium block mt-1.5 leading-none">
                                                {sportDetails.intensityLabel}
                                            </span>
                                        </div>
                                        
                                        <div className="border border-white/15 rounded-2xl p-4 bg-white/5 flex flex-col items-center justify-center text-center backdrop-blur-3xs">
                                            <span className="text-[11px] text-white/70 font-semibold block mb-1">
                                                Durasi Disarankan
                                            </span>
                                            <span className="text-xs md:text-sm text-white font-bold mt-1.5 block leading-none">
                                                {sportDetails.duration}
                                            </span>
                                        </div>
                                        
                                        <div className="border border-white/15 rounded-2xl p-4 bg-white/5 flex flex-col items-center justify-center text-center backdrop-blur-3xs">
                                            <span className="text-[11px] text-white/70 font-semibold block mb-1">
                                                Frekuensi
                                            </span>
                                            <span className="text-xs md:text-sm text-white font-bold mt-1.5 block leading-none">
                                                {sportDetails.frequency}
                                            </span>
                                        </div>
                                        
                                        <div className="border border-white/15 rounded-2xl p-4 bg-white/5 flex flex-col items-center justify-center text-center backdrop-blur-3xs">
                                            <span className="text-[11px] text-white/70 font-semibold block mb-1">
                                                Kalori Terbakar
                                            </span>
                                            <span className="text-xs md:text-sm text-white font-bold mt-1.5 block leading-none">
                                                {sportDetails.calories}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Pilih Rekomendasi */}
                                <div className="mt-8 space-y-4">
                                    <div className="text-left">
                                        <h3 className="font-extrabold text-lg text-adaline-ink">Pilih Rekomendasi</h3>
                                        <p className="text-xs text-stone-400">
                                            Pilih salah satu rekomendasi terbaik yang ingin Anda jadikan dasar program latihan
                                        </p>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {[
                                            { 
                                                key: 'Jogging', 
                                                title: 'Jogging', 
                                                desc: 'Olahraga terbaik untuk meningkatkan kebugaran kardiovaskular dan menjaga kesehatan jantung.',
                                                pct: 92 
                                            },
                                            { 
                                                key: 'Bersepeda', 
                                                title: 'Bersepeda', 
                                                desc: 'Meningkatkan daya tahan tubuh dan memperkuat otot kaki serta jantung.',
                                                pct: 80 
                                            },
                                            { 
                                                key: 'Yoga', 
                                                title: 'Yoga', 
                                                desc: 'Meningkatkan fleksibilitas tubuh, keseimbangan, dan kesehatan mental.',
                                                pct: 78 
                                            }
                                        ].map((item) => {
                                            const isSelected = selectedRecommendSport === item.key;
                                            return (
                                                <div
                                                    key={item.key}
                                                    onClick={() => handleSelectRecommendSport(item.key)}
                                                    className={`bg-white border rounded-[20px] p-5 cursor-pointer transition-all duration-300 flex flex-col justify-between h-full text-left ${
                                                        isSelected 
                                                            ? 'border-valley-green ring-2 ring-valley-green/10 shadow-md transform scale-[1.01]' 
                                                            : 'border-stone-200 hover:border-stone-300 hover:shadow-xs'
                                                    }`}
                                                >
                                                    <div className="space-y-2">
                                                        <h4 className="font-bold text-sm text-[#0a482e] uppercase tracking-wide">
                                                            {item.title}
                                                        </h4>
                                                        <p className="text-[11px] text-stone-500 leading-relaxed">
                                                            {item.desc}
                                                        </p>
                                                    </div>
                                                    
                                                    {/* Compatibility Progress bar at bottom */}
                                                    <div className="mt-5 space-y-1">
                                                        <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                                                            <div 
                                                                className="h-full bg-valley-green rounded-full transition-all duration-500" 
                                                                style={{ width: `${item.pct}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

                    {activeTab === 'testimoni' && (
                        <div className="space-y-8 animate-fade-in text-left">
                            {/* Hero section */}
                            <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-6 md:gap-8 max-w-4xl relative overflow-visible">
                                <img 
                                    src="/images/halooo.png" 
                                    alt="Waving guy illustration" 
                                    className="h-32 md:h-36 object-contain shrink-0"
                                />
                                <div className="space-y-1.5 text-left">
                                    <h1 className="text-xl md:text-2xl font-extrabold text-valley-green">Bagikan Pengalaman Anda</h1>
                                    <p className="text-xs text-stone-500 font-semibold leading-relaxed max-w-lg">
                                        Testimoni yang Anda berikan sangat berarti untuk membantu kami terus berkembang dan memotivasi pengguna lain.
                                    </p>
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-12 gap-8 items-start">
                                {/* Left: Testimonial Form */}
                                <div className="lg:col-span-7 bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-5 text-left">
                                    <div>
                                        <h4 className="font-extrabold text-sm text-valley-green">Kirim Testimoni</h4>
                                        <p className="text-[11px] text-stone-400 font-semibold mt-1">
                                            Berikan ulasan jujur Anda tentang Optimove
                                        </p>
                                    </div>

                                    {testimonials.length > 0 ? (
                                        <div className="p-5 bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs rounded-2xl font-medium leading-relaxed space-y-2">
                                            <div className="flex items-center gap-2 font-black text-sm text-valley-green">
                                                <span>✓</span> Testimoni Terkirim
                                            </div>
                                            <p>
                                                Terima kasih telah membagikan ulasan Anda! Untuk menghindari spam, setiap pengguna dibatasi maksimal 1 testimoni.
                                            </p>
                                            <p className="text-[11px] text-emerald-700/90 font-bold">
                                                💡 Jika ingin mengirim testimoni baru, silakan hapus testimoni Anda yang ada terlebih dahulu.
                                            </p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-stone-400 uppercase block">Rating Anda</label>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex gap-1">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                onClick={() => testimonialForm.setData('rating', star)}
                                                                className="text-2xl transition hover:scale-110 outline-none cursor-pointer"
                                                            >
                                                                <span className={star <= testimonialForm.data.rating ? 'text-emerald-700' : 'text-stone-300'}>
                                                                    ★
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <span className="text-xs font-bold text-stone-500">
                                                        {testimonialForm.data.rating === 1 && 'Sangat Buruk'}
                                                        {testimonialForm.data.rating === 2 && 'Buruk'}
                                                        {testimonialForm.data.rating === 3 && 'Cukup'}
                                                        {testimonialForm.data.rating === 4 && 'Baik'}
                                                        {testimonialForm.data.rating === 5 && 'Luar biasa'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-[10px] font-bold text-stone-400 uppercase">Pesan Testimoni</label>
                                                    <span className="text-[9px] text-stone-400">
                                                        {300 - (testimonialForm.data.content?.length || 0)}/300 karakter
                                                    </span>
                                                </div>
                                                <textarea
                                                    required
                                                    maxLength="300"
                                                    rows="5"
                                                    value={testimonialForm.data.content || ''}
                                                    onChange={e => testimonialForm.setData('content', e.target.value)}
                                                    placeholder="Tulis pesan testimoni Anda di sini... (maksimal 300 karakter)"
                                                    className="w-full text-xs py-3 px-4 rounded-xl border border-stone-200 bg-canvas-ice/30 outline-none focus:border-valley-green resize-none"
                                                />
                                                {testimonialForm.errors.content && (
                                                    <span className="text-[10px] text-red-500 font-medium block mt-1">
                                                        {testimonialForm.errors.content}
                                                    </span>
                                                )}
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={testimonialForm.processing}
                                                className="w-full py-3 bg-[#0a482e] hover:bg-[#0a482e]/90 text-white rounded-xl font-bold text-xs transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                                            >
                                                <svg className="w-3.5 h-3.5 transform rotate-45 -translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                                Kirim Testimoni
                                            </button>
                                        </form>
                                    )}
                                </div>

                                {/* Right: Existing Testimonial List & Status */}
                                <div className="lg:col-span-5 bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-4 text-left">
                                    <div>
                                        <h4 className="font-extrabold text-sm text-valley-green">Status Testimoni Anda</h4>
                                        <p className="text-[11px] text-stone-400 font-semibold mt-1">Lihat status pengiriman Anda di sini</p>
                                    </div>

                                    {testimonials.length === 0 ? (
                                        <div className="bg-[#edf6ed]/40 border border-[#edf6ed]/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3">
                                            <img src="/images/image 2.png" alt="No testimonial" className="w-14 h-14 object-contain" />
                                            <div className="space-y-0.5">
                                                <p className="text-xs font-bold text-adaline-ink">Anda belum mengirimkan testimoni,</p>
                                                <p className="text-[10px] text-stone-400 font-semibold leading-relaxed">Kirim pesan testimoni untuk berbagi pengalaman Anda</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {testimonials.map((testi) => (
                                                <div key={testi.id} className="p-4 bg-stone-50/50 border border-stone-200/70 rounded-2xl space-y-3">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <div className="flex gap-0.5 text-amber-400 font-bold text-sm">
                                                            {Array.from({ length: testi.rating }).map((_, i) => '★')}
                                                            {Array.from({ length: 5 - testi.rating }).map((_, i) => '☆')}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => deleteTestimonial(testi.id)}
                                                            className="text-stone-400 hover:text-red-500 text-xs font-bold transition"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </div>
                                                    <p className="text-[11px] text-stone-600 leading-relaxed italic">
                                                        "{testi.content}"
                                                    </p>
                                                    <div className="flex justify-between items-center text-[9px] font-mono text-stone-400 mt-2 border-t border-stone-100 pt-2">
                                                        <span>{new Date(testi.created_at).toLocaleDateString('id-ID')}</span>
                                                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${
                                                            testi.is_published 
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                                            : 'bg-amber-50 text-amber-800 border border-amber-100'
                                                        }`}>
                                                            {testi.is_published ? 'Diterbitkan' : 'Menunggu Persetujuan'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                </main>
            </div>
            
            {/* STREAK MILESTONE BADGE MODAL POP-UP */}
            {showBadgeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white border-2 border-amber-400 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden animate-scale-up">
                        <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-100 rounded-full blur-3xl opacity-60" />
                        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-forest-dew/40 rounded-full blur-3xl opacity-60" />

                        <div className="w-20 h-20 mx-auto mb-5 bg-amber-50 rounded-full flex items-center justify-center border-4 border-amber-300 relative z-10 animate-bounce">
                            <svg className="w-10 h-10 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>

                        <h3 className="text-[10px] font-mono uppercase tracking-widest text-amber-800 mb-1 font-bold">Lencana Baru Diperoleh!</h3>
                        <h2 className="text-xl font-black text-adaline-ink tracking-tight mb-3">"{badgeName}"</h2>
                        
                        <p className="text-xs text-stone-500 leading-relaxed mb-6">
                            Hebat! Anda baru saja membuka pencapaian baru setelah menyelesaikan seluruh rencana latihan hari ini. Pertahankan konsistensi Anda!
                        </p>

                        <div className="flex flex-col items-center gap-3">
                            <div className="text-[10px] font-mono font-bold text-amber-900 bg-amber-100 px-3.5 py-1.5 rounded-full border border-amber-200">
                                Streak Anda: {user.workout_streak} Hari
                            </div>
                            <button onClick={() => setShowBadgeModal(false)} className="w-full mt-2 py-2.5 rounded-full font-bold text-xs bg-valley-green hover:opacity-90 text-white transition">
                                Keren, Terima Kasih!
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* WEEKLY ACHIEVEMENT CONGRATS MODAL POP-UP */}
            {showWeeklyAchievementModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white border-2 border-[#166534] rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden animate-scale-up">
                        <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#edf6ed] rounded-full blur-3xl opacity-60" />
                        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-forest-dew/40 rounded-full blur-3xl opacity-60" />

                        <div className="w-20 h-20 mx-auto mb-5 bg-[#edf6ed] rounded-full flex items-center justify-center border-4 border-[#d7e8b5] relative z-10 animate-bounce">
                            <img src="/images/badge 1.png" alt="Gold Medal" className="w-10 h-10 object-contain" />
                        </div>

                        <h3 className="text-[10px] font-mono uppercase tracking-widest text-[#166534] mb-1 font-bold">Pencapaian Luar Biasa!</h3>
                        <h2 className="text-xl font-black text-adaline-ink tracking-tight mb-3">Minggu Ini Selesai</h2>
                        
                        <p className="text-xs text-stone-500 leading-relaxed mb-6">
                            Selamat! Anda telah menyelesaikan seluruh aktivitas latihan mingguan Anda secara konsisten. Tubuh Anda berterima kasih atas komitmen luar biasa ini!
                        </p>

                        <div className="flex flex-col items-center gap-3">
                            <div className="text-[10px] font-mono font-bold text-[#166534] bg-[#edf6ed] px-3.5 py-1.5 rounded-full border border-[#d7e8b5]/50">
                                Status: 100% Selesai! 🎉
                            </div>
                            <button onClick={() => setShowWeeklyAchievementModal(false)} className="w-full mt-2 py-2.5 rounded-xl font-bold text-xs bg-[#0a482e] hover:bg-[#0a482e]/90 text-white transition">
                                Mantap, Lanjutkan!
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    );
}
