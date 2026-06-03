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
        duration_sub: '12 Mei - 8 Juni 2026',
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

// Historical Workout Programs Mock data matching mockup exactly
const HISTORICAL_PROGRAMS = [
    { period: '12 Mei - 8 Juni 2026', duration: '4 Minggu', type: 'Cardio & Endurance', sport: 'Jogging', progress: 100, status: 'Selesai', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { period: '10 April - 8 Mei 2026', duration: '4 Minggu', type: 'Flexibility & Balance', sport: 'Yoga', progress: 85, status: 'Selesai', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { period: '1 Maret - 30 Maret 2026', duration: '4 Minggu', type: 'Cardio & Strength', sport: 'Bersepeda', progress: 70, status: 'Dihentikan', statusColor: 'bg-amber-50 text-amber-700 border-amber-200' },
    { period: '1 Februari - 28 Februari 2026', duration: '4 Minggu', type: 'Strength Building', sport: 'Gym', progress: 100, status: 'Selesai', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
];

// Weight tracking chart data
const weightHistoryData = [
    { month: 'Jan', weight: 72.0 },
    { month: 'Feb', weight: 71.2 },
    { month: 'Mar', weight: 70.5 },
    { month: 'Apr', weight: 69.5 },
    { month: 'Mei', weight: 68.6 },
    { month: 'Jun', weight: 68.0 },
];

export default function Index({ user, todayTodos = [], journals = [], inactiveDays = 0, inactiveAlert = false, testimonials = [] }) {
    const { flash } = usePage().props;

    // Sidebar tab state
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showBadgeModal, setShowBadgeModal] = useState(false);
    const [badgeName, setBadgeName] = useState('');
    
    // Profil page sub-tab state
    const [profileSubTab, setProfileSubTab] = useState('pribadi');

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

    const activeProgramKey = getProgramKey(user.last_recommendation);
    const [selectedProgramKey, setSelectedProgramKey] = useState(activeProgramKey);

    // Reset selected program if user recommendation changes
    useEffect(() => {
        setSelectedProgramKey(activeProgramKey);
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
    const defaultChecklist = { Senin: false, Selasa: false, Rabu: false, Kamis: false, Jumat: false, Sabtu: false, Minggu: false };
    const [weeklyChecklist, setWeeklyChecklist] = useState(() => ({
        ...defaultChecklist,
        ...(user.weekly_checklist || {})
    }));

    const toggleWeekDay = (day) => {
        const updated = { ...weeklyChecklist, [day]: !weeklyChecklist[day] };
        setWeeklyChecklist(updated);
        router.patch(route('workspace.checklist.update'), { checklist: updated }, { preserveScroll: true });
    };

    // Download workout schedule plan (.txt blob)
    const handleDownloadSchedule = () => {
        const prog = WEEKLY_PROGRAMS[selectedProgramKey];
        let content = `PROGRAM LATIHAN PERSONAL - ${prog.name.toUpperCase()}\n`;
        content += `Durasi Program: ${prog.duration} (${prog.duration_sub || '12 Mei - 8 Juni 2026'})\n`;
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
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )},
                            { id: 'program', label: 'Program Latihan', icon: (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
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
                <header className="sticky top-0 z-30 bg-canvas-ice/90 backdrop-blur-xs border-b border-stone-200/50 py-4 px-6 md:px-10 flex justify-between items-center shrink-0">
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
                        <div className="space-y-8 animate-fade-in">
                            {/* Top Greeting card */}
                            <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                                <div className="absolute right-0 bottom-0 w-44 h-44 bg-forest-dew/10 rounded-full blur-2xl"></div>
                                <div className="space-y-2 relative z-10">
                                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-valley-green">Halo, {user.name}!</h1>
                                    <p className="text-sm text-stone-500 font-medium">Pantau progres rencana kebugaran dan catat kemajuan Anda di sini.</p>
                                </div>
                                {(() => {
                                    const totalToday = todayTodos.length;
                                    const doneToday = todayTodos.filter(t => t.is_completed).length;
                                    return (
                                        <div className="flex items-center gap-4 bg-forest-dew/10 border border-valley-green/10 px-5 py-4 rounded-2xl shrink-0 relative z-10">
                                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-300 text-lg">📈</div>
                                            <div>
                                                <span className="text-[9px] uppercase font-mono tracking-widest text-stone-400 block font-bold">Progres Hari Ini</span>
                                                <span className="text-base font-black text-valley-green">{totalToday > 0 ? `${doneToday} dari ${totalToday} Selesai` : 'Belum ada tugas'}</span>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* To-Dos & Notion Journal side by side */}
                            <div className="grid lg:grid-cols-2 gap-8 items-start">
                                
                                {/* Workout To-Dos */}
                                <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
                                    <h3 className="text-xs font-mono uppercase tracking-widest text-valley-green mb-4 pb-2 border-b border-stone-100 font-bold">Latihan Hari Ini</h3>
                                    
                                    <form onSubmit={handleTodoSubmit} className="mb-6 space-y-3">
                                        <input 
                                            type="text" 
                                            value={todoForm.data.task_name}
                                            onChange={e => todoForm.setData('task_name', e.target.value)}
                                            placeholder="Tambahkan tugas latihan baru hari ini..."
                                            required
                                            className="w-full text-xs py-3 px-4 rounded-xl border border-stone-200 bg-canvas-ice/50 focus:border-valley-green outline-none transition"
                                        />
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                value={todoForm.data.sport_name}
                                                onChange={e => todoForm.setData('sport_name', e.target.value)}
                                                placeholder="Nama cabang olahraga (opsional)..."
                                                className="flex-1 text-[11px] py-2 px-3 rounded-lg border border-stone-200 bg-canvas-ice/50 focus:border-valley-green outline-none"
                                            />
                                            <button 
                                                type="submit" 
                                                disabled={todoForm.processing}
                                                className="py-2 px-4 rounded-lg bg-valley-green hover:opacity-90 text-white font-bold text-xs transition disabled:opacity-50">
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
                                        <div className="space-y-2.5">
                                            {todayTodos.map(todo => (
                                                <div key={todo.id} className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                                                    todo.is_completed ? 'bg-stone-50/70 border-stone-200 opacity-60' : 'bg-white border-stone-200 hover:shadow-xs'
                                                }`}>
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <button 
                                                            type="button" 
                                                            onClick={() => toggleTodo(todo.id)}
                                                            className={`w-5.5 h-5.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                                                                todo.is_completed ? 'bg-valley-green border-valley-green text-white' : 'border-stone-300 bg-white hover:border-valley-green'
                                                            }`}>
                                                            {todo.is_completed && (
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                        <div className="min-w-0">
                                                            <p className={`text-xs font-bold leading-tight ${todo.is_completed ? 'line-through text-stone-400' : 'text-adaline-ink'}`}>
                                                                {todo.task_name}
                                                            </p>
                                                            {todo.sport_name && (
                                                                <span className="inline-block text-[8px] font-bold uppercase font-mono bg-forest-dew/40 text-valley-green px-1.5 py-0.5 rounded mt-1">
                                                                    {todo.sport_name}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <button onClick={() => deleteTodo(todo.id)} className="p-1.5 text-stone-400 hover:text-red-500 rounded transition">
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Workout Journal */}
                                <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[400px]">
                                    <div>
                                        <div className="flex justify-between items-center border-b border-stone-100 pb-3 mb-4">
                                            <h3 className="text-xs font-mono uppercase tracking-widest text-valley-green font-bold">Catatan Jurnal</h3>
                                            {activeJournalTab === 'list' ? (
                                                <button onClick={() => { journalForm.reset(); setActiveJournalTab('create'); }} className="text-[10px] font-bold bg-forest-dew/50 text-valley-green px-3 py-1 rounded-full hover:bg-forest-dew transition">
                                                    + Baru
                                                </button>
                                            ) : (
                                                <button onClick={() => { setActiveJournalTab('list'); journalForm.reset(); }} className="text-[10px] text-stone-400 hover:text-adaline-ink font-bold">
                                                    Batal
                                                </button>
                                            )}
                                        </div>

                                        {activeJournalTab === 'list' ? (
                                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                                                {journals.length === 0 ? (
                                                    <div className="text-center py-10 border border-dashed border-stone-200 rounded-2xl bg-stone-50/50">
                                                        <p className="text-xs text-stone-400 font-medium">Jurnal latihan kosong.</p>
                                                    </div>
                                                ) : (
                                                    journals.map(j => (
                                                        <div key={j.id} className="p-4 bg-stone-50/50 border border-stone-200/70 rounded-2xl flex flex-col justify-between gap-3 hover:border-stone-300 transition">
                                                            <div className="flex justify-between items-start gap-2">
                                                                <h4 className="font-bold text-xs text-adaline-ink">{j.title}</h4>
                                                                <div className="flex gap-1 shrink-0">
                                                                    <button onClick={() => startEditJournal(j)} className="p-0.5 text-stone-400 hover:text-valley-green transition">✏️</button>
                                                                    <button onClick={() => deleteJournal(j.id)} className="p-0.5 text-stone-400 hover:text-red-500 transition">✕</button>
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
                                                    <textarea required rows="4" value={journalForm.data.content} onChange={e => journalForm.setData('content', e.target.value)} placeholder="Tulis progres latihan Anda..." className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-200 bg-canvas-ice/30 outline-none focus:border-valley-green resize-none" />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-stone-400 uppercase block">Suasana Hati</label>
                                                    <div className="grid grid-cols-4 gap-2">
                                                        {Object.entries(moodMap).map(([key, data]) => (
                                                            <button key={key} type="button" onClick={() => journalForm.setData('mood', key)} className={`py-1.5 rounded-xl border text-[10px] flex flex-col items-center gap-1 transition ${
                                                                journalForm.data.mood === key ? 'border-valley-green bg-forest-dew/40 text-valley-green font-bold' : 'border-stone-200 text-stone-400'
                                                            }`}>
                                                                <span>{data.icon}</span>
                                                                <span className="scale-90">{data.label}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <button type="submit" disabled={journalForm.processing} className="w-full py-3 bg-valley-green hover:opacity-90 text-white rounded-full font-bold text-xs transition">
                                                    {activeJournalTab === 'edit' ? 'Perbarui' : 'Simpan Jurnal'}
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                    {/* TAB 2: PROGRAM LATIHAN TAB (Rebuilt matching mockup page 2 exactly) */}
                    {activeTab === 'program' && (
                        <div className="space-y-8 animate-fade-in">
                            
                            {/* Main banner card with custom grids and graphic */}
                            <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden flex flex-col gap-6">
                                
                                {/* Background design runner illustration */}
                                <div className="absolute right-4 bottom-0 top-0 w-[220px] hidden lg:flex items-center justify-center select-none pointer-events-none">
                                    <svg className="w-full h-full" viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        {/* Background Hills */}
                                        <path d="M -10,140 Q 60,110 130,130 T 210,100 L 210,180 L -10,180 Z" fill="#166534" opacity="0.06" />
                                        <path d="M -10,155 Q 70,135 140,145 T 210,125 L 210,180 L -10,180 Z" fill="#4ade80" opacity="0.08" />
                                        
                                        {/* Background Trees (Circular Foliage) */}
                                        <rect x="165" y="100" width="3" height="50" fill="#203b14" opacity="0.2" />
                                        <circle cx="166" cy="95" r="18" fill="#166534" opacity="0.8" />
                                        <circle cx="172" cy="90" r="14" fill="#22c55e" opacity="0.75" />

                                        <rect x="40" y="115" width="2.5" height="40" fill="#203b14" opacity="0.2" />
                                        <circle cx="41" cy="110" r="13" fill="#4ade80" opacity="0.8" />
                                        <circle cx="38" cy="107" r="10" fill="#15803d" opacity="0.7" />

                                        <rect x="140" y="110" width="2.5" height="45" fill="#203b14" opacity="0.2" />
                                        <circle cx="141" cy="103" r="15" fill="#86efac" opacity="0.85" />
                                        <circle cx="145" cy="99" r="11" fill="#166534" opacity="0.6" />

                                        {/* Sun / Soft Glow */}
                                        <circle cx="110" cy="45" r="24" fill="#d7e8b5" opacity="0.25" />
                                        <circle cx="110" cy="45" r="16" fill="#ffffff" opacity="0.3" />

                                        {/* Winding Track/Road */}
                                        <path d="M -10,165 Q 60,140 120,155 T 210,140" stroke="#e0e5d5" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.6" />
                                        <path d="M -10,165 Q 60,140 120,155 T 210,140" stroke="#166534" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.1" />

                                        {/* Premium Detailed Runner Character */}
                                        <g transform="translate(45, 45)">
                                            {/* Back Arm */}
                                            <path d="M 42,42 L 31,48 L 22,43" stroke="#fcd34d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.85" />
                                            <circle cx="22" cy="43" r="1.5" fill="#fcd34d" />

                                            {/* Back Leg */}
                                            <path d="M 45,68 L 30,76 L 19,70" stroke="#e0e5d5" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                            <path d="M 19,70 L 14,73" stroke="#166534" strokeWidth="5.5" strokeLinecap="round" fill="none" /> {/* Shoe */}

                                            {/* Torso & Shorts */}
                                            {/* Hip/Shorts (black/charcoal) */}
                                            <path d="M 41,61 L 52,61 L 50,70 L 39,70 Z" fill="#1f2937" />
                                            <path d="M 40,61 L 43,72" stroke="#1f2937" strokeWidth="5" strokeLinecap="round" />
                                            <path d="M 49,61 L 47,71" stroke="#1f2937" strokeWidth="5" strokeLinecap="round" />

                                            {/* Shirt (green) */}
                                            <path d="M 40,43 L 53,41 L 53,61 L 41,61 Z" fill="#22c55e" />
                                            <path d="M 43,45 L 49,44 L 49,52 L 43,52 Z" fill="#4ade80" opacity="0.8" /> {/* Shirt highlight */}

                                            {/* Neck & Head */}
                                            <rect x="44" y="37" width="4" height="6" fill="#fcd34d" />
                                            <circle cx="46" cy="32" r="7.5" fill="#fcd34d" />
                                            {/* Hair */}
                                            <path d="M 39,32 C 39,24 51,24 52,31 C 52,28 47,27 45,27 C 42,27 40,28 39,32 Z" fill="#111827" />

                                            {/* Front Leg */}
                                            <path d="M 48,68 L 58,78 L 53,92" stroke="#fcd34d" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                            <path d="M 53,92 L 62,94" stroke="#166534" strokeWidth="5.5" strokeLinecap="round" fill="none" /> {/* Shoe */}

                                            {/* Front Arm */}
                                            <path d="M 50,42 L 63,48 L 68,60" stroke="#fcd34d" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                            <circle cx="68" cy="60" r="1.8" fill="#fcd34d" />
                                        </g>
                                    </svg>
                                </div>

                                <div>
                                    <h1 className="text-2xl font-black text-adaline-ink flex items-center gap-2">
                                        Program Latihan <span className="text-valley-green">Personal</span>
                                    </h1>
                                    <p className="text-xs text-stone-400 mt-1 leading-snug">
                                        Program latihan ini disusun khusus untuk Anda berdasarkan hasil analisis dan rekomendasi sistem.
                                    </p>
                                </div>

                                {/* Recommended Sport Badge Card */}
                                <div className="bg-[#fcfdfa] border border-stone-200/70 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-2xl relative z-10 shadow-3xs">
                                    <div className="flex items-start gap-4">
                                        {/* Dynamic Sport Icon */}
                                        <div className="w-12 h-12 rounded-full bg-forest-dew/40 text-valley-green flex items-center justify-center shrink-0 border border-valley-green/10 shadow-xs">
                                            {selectedProgramKey === 'Walking or jogging' && (
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                    <circle cx="18" cy="5" r="2" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 9h5l11-4M9 9v5L6 20M12 14v4l5 4" />
                                                </svg>
                                            )}
                                            {selectedProgramKey === 'Gym' && (
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18h12M6 6h12M3 12h18M3 9v6M21 9v6" />
                                                </svg>
                                            )}
                                            {selectedProgramKey === 'Yoga' && (
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                    <circle cx="12" cy="5" r="2" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v10M8 11h8M6 21c3-1 9-1 12 0" />
                                                </svg>
                                            )}
                                            {selectedProgramKey === 'Cycling' && (
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                    <circle cx="5.5" cy="17.5" r="2.5" />
                                                    <circle cx="18.5" cy="17.5" r="2.5" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 6h2M6.5 17.5l3-7h5.5l3 7M9.5 10.5l2.5-4.5h3" />
                                                </svg>
                                            )}
                                            {selectedProgramKey === 'Swimming' && (
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 10a4 4 0 0 1 8 0 4 4 0 0 1 8 0 4 4 0 0 1 4 0M2 14a4 4 0 0 1 8 0 4 4 0 0 1 8 0 4 4 0 0 1 4 0" />
                                                </svg>
                                            )}
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Rekomendasi Utama Anda</span>
                                            <span className="text-base font-extrabold text-valley-green block mt-0.5">
                                                {WEEKLY_PROGRAMS[selectedProgramKey].sport}
                                            </span>
                                            <span className="text-[11px] text-stone-500 mt-1 block leading-relaxed max-w-lg">
                                                {WEEKLY_PROGRAMS[selectedProgramKey].desc}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap self-end sm:self-center shrink-0">
                                        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 px-4 py-3 rounded-2xl">
                                            <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center border border-amber-300 text-base">🔥</div>
                                            <div>
                                                <span className="text-[9px] uppercase font-mono tracking-widest text-amber-800 block font-bold">Workout Streak</span>
                                                <span className="text-sm font-black text-amber-900">{user.workout_streak || 0} Hari</span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                setActiveTab('rekomendasi');
                                            }}
                                            className="py-2.5 px-4 rounded-xl bg-valley-green hover:opacity-90 text-white text-xs font-bold transition flex items-center gap-1 shadow-3xs shrink-0">
                                            Lihat Detail Rekomendasi <span>→</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Details summary row (4 grid cards) */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10 mt-2">
                                    {[
                                        { lbl: 'Durasi Program', val: WEEKLY_PROGRAMS[selectedProgramKey].duration, sub: WEEKLY_PROGRAMS[selectedProgramKey].duration_sub, icon: '📅' },
                                        { lbl: 'Target Mingguan', val: WEEKLY_PROGRAMS[selectedProgramKey].target, sub: WEEKLY_PROGRAMS[selectedProgramKey].target_sub, icon: '🎯' },
                                        { lbl: 'Durasi Per Sesi', val: WEEKLY_PROGRAMS[selectedProgramKey].duration_per_sesi, sub: WEEKLY_PROGRAMS[selectedProgramKey].duration_per_sesi_sub, icon: '⏱️' },
                                        { lbl: 'Fokus Program', val: WEEKLY_PROGRAMS[selectedProgramKey].focus, sub: WEEKLY_PROGRAMS[selectedProgramKey].focus_sub, icon: '🔥' },
                                    ].map((card, idx) => (
                                        <div key={idx} className="bg-stone-50/50 border border-stone-200/60 p-4 rounded-2xl flex flex-col justify-between gap-1 shadow-3xs">
                                            <div className="flex justify-between items-center text-stone-400">
                                                <span className="text-[10px] font-bold uppercase tracking-wider block">{card.lbl}</span>
                                                <span className="text-xs">{card.icon}</span>
                                            </div>
                                            <div className="mt-2">
                                                <span className="text-base font-black text-valley-green block leading-tight">{card.val}</span>
                                                <span className="text-[9px] text-stone-400 block font-semibold mt-0.5 leading-none">{card.sub}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Jadwal Mingguan Table matching page 2 exactly */}
                            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-md space-y-4">
                                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                                    <div>
                                        <h3 className="font-extrabold text-sm text-valley-green">Jadwal Mingguan</h3>
                                        <p className="text-[10px] text-stone-400 leading-normal mt-0.5">Ikuti jadwal latihan berikut secara konsisten untuk hasil yang optimal.</p>
                                    </div>
                                    <button 
                                        onClick={handleDownloadSchedule}
                                        className="py-2.5 px-4 rounded-xl border border-stone-200 hover:border-valley-green text-stone-600 hover:text-valley-green bg-white hover:bg-stone-50 font-bold text-xs transition flex items-center gap-1.5 shadow-3xs">
                                        <span>📥</span> Unduh Jadwal
                                    </button>
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
                                                        <td className="px-5 py-4 font-bold text-valley-green flex items-center gap-2">
                                                            <span className="w-5.5 h-5.5 rounded-lg bg-stone-50 border border-stone-100 flex items-center justify-center shrink-0">📅</span>
                                                            {row.day}
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
                                                                className={`inline-flex items-center gap-1.5 cursor-pointer text-left select-none text-[10px] font-bold ${
                                                                    isCompleted ? 'text-emerald-600' : 'text-stone-400 hover:text-stone-600'
                                                                }`}>
                                                                <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                                                    isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-stone-300 bg-white'
                                                                }`}>
                                                                    {isCompleted && '✓'}
                                                                </span>
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
                        <div className="space-y-8 animate-fade-in">
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
                                        { label: 'Total Analisis', value: '12', change: '+2 dari bulan lalu', icon: '📈' },
                                        { label: 'Program Aktif', value: '2', change: 'Sedang berjalan', icon: '📋' },
                                        { label: 'Latihan Selesai', value: '24', change: 'Sesi latihan selesai', icon: '🏆' },
                                        { label: 'Konsistensi', value: '86%', change: 'Bagus sekali! 🔥', icon: '🎯' },
                                    ].map((stat, idx) => (
                                        <div key={idx} className={`flex items-center gap-4 ${idx > 0 ? 'pt-4 lg:pt-0 lg:pl-6' : ''}`}>
                                            <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-lg">{stat.icon}</div>
                                            <div>
                                                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">{stat.label}</span>
                                                <span className="text-xl font-extrabold text-adaline-ink mt-0.5 block">{stat.value}</span>
                                                <span className="text-[9px] text-stone-400 block font-medium mt-0.5">{stat.change}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Riwayat Program Latihan card */}
                            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
                                <h3 className="text-xs font-mono uppercase tracking-widest text-valley-green mb-4 pb-2 border-b border-stone-100 font-bold">Riwayat Program Latihan</h3>
                                
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs md:text-sm text-left">
                                        <thead>
                                            <tr className="bg-stone-50 border-b border-stone-100 text-stone-400 font-bold uppercase tracking-wider text-[10px]">
                                                <th className="px-5 py-4">Periode</th>
                                                <th className="px-5 py-4">Program</th>
                                                <th className="px-5 py-4">Rekomendasi</th>
                                                <th className="px-5 py-4">Progress</th>
                                                <th className="px-5 py-4">Status</th>
                                                <th className="px-5 py-4 text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-100">
                                            {HISTORICAL_PROGRAMS.map((prog, i) => (
                                                <tr key={i} className="hover:bg-stone-50/50 transition">
                                                    <td className="px-5 py-3.5 font-mono text-stone-400 text-[10px]">
                                                        {prog.period} <span className="block text-[9px] font-sans">({prog.duration})</span>
                                                    </td>
                                                    <td className="px-5 py-3.5 font-bold text-valley-green">{prog.type}</td>
                                                    <td className="px-5 py-3.5 text-stone-600 font-medium flex items-center gap-1.5">
                                                        <span className="text-xs">🏃</span> {prog.sport}
                                                    </td>
                                                    <td className="px-5 py-3.5">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-20 h-1.5 bg-stone-100 rounded-full overflow-hidden shrink-0">
                                                                <div className="h-full bg-emerald-500" style={{ width: `${prog.progress}%` }}></div>
                                                            </div>
                                                            <span className="font-mono text-[10px] text-stone-500">{prog.progress}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-3.5">
                                                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${prog.statusColor}`}>
                                                            {prog.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-3.5 text-right">
                                                        <button 
                                                            onClick={() => { 
                                                                const key = getProgramKey(prog.sport);
                                                                setSelectedProgramKey(key); 
                                                                setActiveTab('program'); 
                                                            }} 
                                                            className="py-2.5 px-4 border border-stone-200 hover:border-valley-green rounded-xl text-[10px] font-bold text-stone-600 hover:text-valley-green bg-white hover:bg-stone-50 transition shadow-3xs">
                                                            Lihat Detail
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 4: PROFIL TAB */}
                    {activeTab === 'profil' && (
                        <div className="space-y-8 animate-fade-in">
                            {/* Top profile summary card */}
                            <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                                <div className="absolute right-0 top-0 w-36 h-36 bg-forest-dew/20 rounded-full blur-2xl"></div>
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="relative group shrink-0">
                                        <img className="w-16 h-16 rounded-full border-2 border-forest-dew object-cover" src={user.profile_photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&color=166534&background=f0fdf4`} alt={user.name} />
                                        <label className="absolute inset-0 rounded-full bg-black/45 flex flex-col items-center justify-center text-white text-[9px] font-bold opacity-0 group-hover:opacity-100 cursor-pointer transition select-none">
                                            <span>📷 UBAH</span>
                                            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                                        </label>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-xl font-extrabold text-valley-green">{user.name}</h2>
                                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[8px] uppercase tracking-wider">Aktif</span>
                                        </div>
                                        <p className="text-xs text-stone-400 mt-1">{user.email} · bergabung Mei 2025</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 gap-4 relative z-10 shrink-0 divide-x divide-stone-100">
                                    <div className="text-center px-3">
                                        <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider block">Usia</span>
                                        <span className="text-sm font-black text-valley-green mt-0.5 block">{user.age || 22} Thn</span>
                                    </div>
                                    <div className="text-center px-3">
                                        <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider block">Tinggi</span>
                                        <span className="text-sm font-black text-valley-green mt-0.5 block">{user.height ? `${Math.round(user.height)} cm` : '-'}</span>
                                    </div>
                                    <div className="text-center px-3">
                                        <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider block">Berat</span>
                                        <span className="text-sm font-black text-valley-green mt-0.5 block">{user.weight ? `${Math.round(user.weight)} kg` : '-'}</span>
                                    </div>
                                    <div className="text-center px-3">
                                        <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider block">IMT (BMI)</span>
                                        <span className="text-sm font-black text-emerald-600 mt-0.5 block">{user.bmi || '22.2'} <span className="text-[9px] font-medium text-stone-400 block font-sans">(Normal)</span></span>
                                    </div>
                                </div>
                            </div>

                            {/* Sub-tabs Selection bar */}
                            <div className="flex border-b border-stone-200 gap-6 text-sm shrink-0 overflow-x-auto">
                                {[
                                    { id: 'pribadi', label: 'Informasi Pribadi' },
                                    { id: 'preferensi', label: 'Preferensi Kesehatan' },
                                    { id: 'keamanan', label: 'Keamanan Akun' },
                                    { id: 'notifikasi', label: 'Setelan Akun' },
                                ].map(tab => (
                                    <button 
                                        key={tab.id} 
                                        onClick={() => setProfileSubTab(tab.id)}
                                        className={`pb-2.5 font-bold transition border-b-2 outline-none cursor-pointer ${
                                            profileSubTab === tab.id 
                                            ? 'border-valley-green text-valley-green' 
                                            : 'border-transparent text-stone-400 hover:text-stone-600'
                                        }`}>
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Sub-tab Content Panels */}
                            <div className="animate-fade-in">
                                
                                {/* SUB-TAB: INFORMASI PRIBADI */}
                                {profileSubTab === 'pribadi' && (
                                    <div className="grid lg:grid-cols-12 gap-8 items-start">
                                        {/* Left: Info Card */}
                                        <div className="lg:col-span-8 bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
                                            <div className="flex justify-between items-center mb-4 border-b border-stone-100 pb-3">
                                                <h4 className="font-bold text-xs text-valley-green uppercase font-mono">Informasi Pribadi</h4>
                                                <button className="text-[10px] font-bold border border-stone-200 hover:border-valley-green px-3 py-1 rounded-full text-stone-600 hover:text-valley-green transition">Edit</button>
                                            </div>
                                            <div className="grid sm:grid-cols-2 gap-4 text-xs">
                                                {[
                                                    { lbl: 'Nama Lengkap', val: user.name },
                                                    { lbl: 'Jenis Kelamin', val: user.gender === 'Male' || !user.gender ? 'Laki-laki' : 'Perempuan' },
                                                    { lbl: 'Tanggal Lahir', val: '15 Maret 2003' },
                                                    { lbl: 'Usia', val: `${user.age || 22} Tahun` },
                                                    { lbl: 'Email', val: user.email },
                                                    { lbl: 'Nomor Telepon', val: '0812-3456-7890' },
                                                    { lbl: 'Alamat', val: 'Jl. Merdeka No. 25, Malang, Jawa Timur' },
                                                    { lbl: 'Pekerjaan', val: 'Mahasiswa' },
                                                    { lbl: 'Tingkat Aktivitas', val: 'Sedang' },
                                                ].map((row, idx) => (
                                                    <div key={idx} className="border-b border-stone-50 pb-2.5">
                                                        <span className="text-[10px] text-stone-400 font-bold block">{row.lbl}</span>
                                                        <span className="text-adaline-ink font-semibold mt-0.5 block">{row.val || '-'}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Right: Stats Summary Card */}
                                        <div className="lg:col-span-4 bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-4">
                                            <h4 className="font-bold text-xs text-valley-green uppercase font-mono border-b border-stone-100 pb-2">Ringkasan Statistik</h4>
                                            
                                            <div className="space-y-3.5">
                                                {[
                                                    { lbl: 'Total Analisis', val: '12 Kali' },
                                                    { lbl: 'Program Selesai', val: '4 Program' },
                                                    { lbl: 'Hari Konsisten', val: '18 Hari' },
                                                    { lbl: 'Rata-rata Progress', val: '82%' },
                                                    { lbl: 'Kalori Terbakar', val: '3.245 kkal' },
                                                ].map((stat, idx) => (
                                                    <div key={idx} className="flex justify-between items-center text-xs pb-1 border-b border-stone-50">
                                                        <span className="text-stone-400 font-medium">{stat.lbl}</span>
                                                        <span className="font-extrabold text-valley-green">{stat.val}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* SUB-TAB: PREFERENSI KESEHATAN */}
                                {profileSubTab === 'preferensi' && (
                                    <div className="grid lg:grid-cols-12 gap-8 items-start">
                                        {/* Left: Preferences Card */}
                                        <div className="lg:col-span-6 bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-4">
                                            <div className="flex justify-between items-center border-b border-stone-100 pb-3 mb-1">
                                                <h4 className="font-bold text-xs text-valley-green uppercase font-mono">Preferensi Kesehatan</h4>
                                                <button className="text-[10px] font-bold border border-stone-200 hover:border-valley-green px-3 py-1 rounded-full text-stone-600 hover:text-valley-green transition">Edit</button>
                                            </div>
                                            
                                            <div className="space-y-3.5 text-xs">
                                                {[
                                                    { lbl: 'Tujuan Utama', val: 'Menjaga Kesehatan Jantung' },
                                                    { lbl: 'Preferensi Olahraga', val: 'Cardio, Outdoor, Low Impact' },
                                                    { lbl: 'Frekuensi Olahraga', val: '3 - 4 kali per minggu' },
                                                    { lbl: 'Durasi Ideal', val: '30 - 45 menit per sesi' },
                                                    { lbl: 'Waktu Olahraga', val: 'Pagi Hari (06.00 - 09.00)' },
                                                    { lbl: 'Kondisi Kesehatan', val: user.physical_condition === 'none' ? 'Tidak ada riwayat penyakit serius' : 
                                                                                         user.physical_condition === 'knee_injury' ? 'Cedera Lutut' :
                                                                                         user.physical_condition === 'asthma' ? 'Gangguan Asma' : 'Masalah Jantung' },
                                                    { lbl: 'Pantangan / Alergi', val: 'Tidak ada' },
                                                ].map((pref, idx) => (
                                                    <div key={idx} className="flex justify-between items-start gap-4 pb-2.5 border-b border-stone-50">
                                                        <span className="text-stone-400 font-medium w-36 shrink-0">{pref.lbl}</span>
                                                        <span className="font-bold text-valley-green text-right">{pref.val}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Right: Weight Tracking Chart */}
                                        <div className="lg:col-span-6 bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-4">
                                            <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                                                <h4 className="font-bold text-xs text-valley-green uppercase font-mono">Berat Badan (Tracking)</h4>
                                                <span className="text-[10px] text-stone-400 font-mono">6 Bulan Terakhir</span>
                                            </div>
                                            
                                            {isMounted && (
                                                <div className="h-44 w-full text-[10px]">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <LineChart data={weightHistoryData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                                            <XAxis dataKey="month" stroke="#a3a3a3" />
                                                            <YAxis domain={[60, 80]} stroke="#a3a3a3" />
                                                            <Tooltip />
                                                            <Line type="monotone" dataKey="weight" stroke="var(--color-valley-green)" strokeWidth={2.5} activeDot={{ r: 6 }} dot={{ r: 4 }} />
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            )}

                                            <div className="flex justify-between items-center p-3.5 bg-stone-50 rounded-2xl border border-stone-100 text-xs">
                                                <div>
                                                    <span className="text-[9px] text-stone-400 uppercase tracking-wider block font-bold">Berat Terakhir</span>
                                                    <span className="text-base font-extrabold text-valley-green">{user.weight ? `${Math.round(user.weight)} kg` : '68 kg'}</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[9px] text-stone-400 uppercase tracking-wider block font-bold">Perubahan</span>
                                                    <span className="text-xs font-black text-emerald-600">- 4.0 kg ↓</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* SUB-TAB: KEAMANAN AKUN */}
                                {profileSubTab === 'keamanan' && (
                                    <div className="max-w-md bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-4">
                                        <h4 className="font-bold text-xs text-valley-green uppercase font-mono border-b border-stone-100 pb-3">Ubah Password</h4>
                                        <form className="space-y-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-stone-400 uppercase">Password Saat Ini</label>
                                                <input type="password" placeholder="••••••••" className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-200 bg-canvas-ice/30 outline-none focus:border-valley-green" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-stone-400 uppercase">Password Baru</label>
                                                <input type="password" placeholder="••••••••" className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-200 bg-canvas-ice/30 outline-none focus:border-valley-green" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-stone-400 uppercase">Konfirmasi Password Baru</label>
                                                <input type="password" placeholder="••••••••" className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-200 bg-canvas-ice/30 outline-none focus:border-valley-green" />
                                            </div>
                                            <button type="button" className="w-full py-2.5 bg-valley-green hover:opacity-90 text-white rounded-full font-bold text-xs transition">
                                                Simpan Perubahan
                                            </button>
                                        </form>
                                    </div>
                                )}

                                {/* SUB-TAB: NOTIFIKASI / SETELAN */}
                                {profileSubTab === 'notifikasi' && (
                                    <div className="grid lg:grid-cols-2 gap-8 items-start">
                                        <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-4">
                                            <h4 className="font-bold text-xs text-valley-green uppercase font-mono border-b border-stone-100 pb-3">Pengaturan Akun</h4>
                                            
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center text-xs">
                                                    <div>
                                                        <span className="font-bold text-valley-green block">Bahasa Aplikasi</span>
                                                        <span className="text-[10px] text-stone-400 block mt-0.5">Bahasa yang digunakan di aplikasi</span>
                                                    </div>
                                                    <select className="text-xs border border-stone-200 bg-white rounded-lg p-1.5 focus:border-valley-green outline-none">
                                                        <option>Bahasa Indonesia</option>
                                                        <option>English</option>
                                                    </select>
                                                </div>

                                                <div className="flex justify-between items-center text-xs pt-4 border-t border-stone-50">
                                                    <div>
                                                        <span className="font-bold text-valley-green block">Satuan Pengukuran</span>
                                                        <span className="text-[10px] text-stone-400 block mt-0.5">Satuan untuk tinggi badan dan berat badan</span>
                                                    </div>
                                                    <select className="text-xs border border-stone-200 bg-white rounded-lg p-1.5 focus:border-valley-green outline-none">
                                                        <option>cm / kg</option>
                                                        <option>in / lbs</option>
                                                    </select>
                                                </div>

                                                <div className="pt-4 border-t border-stone-50 flex flex-col gap-2">
                                                    <span className="font-bold text-red-500 text-xs block">Hapus Akun</span>
                                                    <span className="text-[10px] text-stone-400 leading-relaxed">Hapus akun dan semua data secara permanen. Tindakan ini tidak dapat dibatalkan.</span>
                                                    <button type="button" className="py-2.5 px-4 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-xl font-bold text-xs transition mt-2 self-start">
                                                        Hapus Akun Saya
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-4">
                                            <h4 className="font-bold text-xs text-valley-green uppercase font-mono border-b border-stone-100 pb-3">Perangkat Terhubung</h4>
                                            
                                            <div className="text-center py-10 border border-dashed border-stone-200 rounded-2xl bg-stone-50/50 flex flex-col items-center">
                                                <span className="text-2xl mb-3">⌚</span>
                                                <h5 className="font-bold text-xs text-valley-green mb-1">Tidak ada perangkat terhubung</h5>
                                                <p className="text-[10px] text-stone-400 max-w-xs leading-normal mb-4">Hubungkan smartwatch atau aplikasi lain untuk sinkronisasi data latihan secara otomatis.</p>
                                                <button className="py-2 px-5 bg-valley-green hover:opacity-90 text-white rounded-lg text-[10px] font-bold transition">Hubungkan Perangkat</button>
                                            </div>
                                        </div>
                                    </div>
                                )}


                            </div>
                        </div>
                    )}

                    {/* TAB 5: HASIL REKOMENDASI TAB */}
                    {activeTab === 'rekomendasi' && (
                        <div className="space-y-8 animate-fade-in">
                            <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-md">
                                <div className="flex justify-between items-center border-b border-stone-100 pb-4 mb-6">
                                    <div>
                                        <h3 className="font-extrabold text-lg text-valley-green">Hasil Rekomendasi Olahraga</h3>
                                        <p className="text-xs text-stone-400 mt-1">Berdasarkan hasil analisis SAW terakhir Anda di landing page.</p>
                                    </div>
                                    <a href={route('home') + '#form'} className="py-2.5 px-5 rounded-full bg-valley-green hover:opacity-90 text-white text-xs font-bold transition shadow-3xs">
                                        Analisis Ulang ↺
                                    </a>
                                </div>

                                <div className="grid md:grid-cols-12 gap-8 items-start">
                                    {/* Left: Summary card */}
                                    <div className="md:col-span-5 bg-stone-50/50 border border-stone-200/60 p-6 rounded-2xl flex flex-col items-center text-center shadow-3xs">
                                        <div className="relative w-24 h-24 flex items-center justify-center mb-4">
                                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                                <path className="text-stone-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                                <path className="text-emerald-500" strokeDasharray="92, 100" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                            </svg>
                                            <div className="absolute font-mono text-xl font-black text-valley-green">92%</div>
                                        </div>
                                        
                                        <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Rekomendasi Utama</span>
                                        <h4 className="text-lg font-black text-valley-green mt-1">{WEEKLY_PROGRAMS[activeProgramKey].sport}</h4>
                                        <p className="text-xs text-stone-500 mt-2 leading-relaxed max-w-xs">{WEEKLY_PROGRAMS[activeProgramKey].desc}</p>
                                        
                                        {/* Physical profile stats inside card */}
                                        <div className="w-full border-t border-stone-200/80 mt-5 pt-4 space-y-2 text-xs text-left">
                                            <div className="flex justify-between">
                                                <span className="text-stone-400">BMI / IMT:</span>
                                                <span className="font-bold text-adaline-ink">{user.bmi || '22.2'} (Normal)</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-stone-400">Kondisi Fisik:</span>
                                                <span className="font-bold text-adaline-ink">
                                                    {user.physical_condition === 'knee_injury' ? 'Cedera Lutut' : 
                                                     user.physical_condition === 'asthma' ? 'Gangguan Asma' : 
                                                     user.physical_condition === 'heart' ? 'Masalah Jantung' : 'Tidak Ada (Fit)'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Ranking list */}
                                    <div className="md:col-span-7 space-y-4">
                                        <h4 className="font-bold text-xs text-stone-400 uppercase tracking-widest font-mono">Peringkat Alternatif Olahraga</h4>
                                        
                                        <div className="space-y-3">
                                            {[
                                                { rank: 1, name: 'Jogging', pct: 92, active: activeProgramKey === 'Walking or jogging' },
                                                { rank: 2, name: 'Bersepeda', pct: 80, active: activeProgramKey === 'Cycling' },
                                                { rank: 3, name: 'Yoga', pct: 78, active: activeProgramKey === 'Yoga' },
                                                { rank: 4, name: 'Renang', pct: 74, active: activeProgramKey === 'Swimming' },
                                                { rank: 5, name: 'Gym / Fitness', pct: 60, active: activeProgramKey === 'Gym' },
                                            ].map((sport) => (
                                                <div key={sport.rank} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                                                    sport.active ? 'bg-forest-dew/10 border-valley-green/30' : 'bg-white border-stone-100 hover:border-stone-200'
                                                }`}>
                                                    <div className="flex items-center gap-3.5 min-w-0">
                                                        <span className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
                                                            sport.active ? 'bg-valley-green text-white' : 'bg-stone-50 text-stone-500 border border-stone-200/55'
                                                        }`}>
                                                            {sport.rank}
                                                        </span>
                                                        <div className="min-w-0">
                                                            <span className="font-bold text-xs text-adaline-ink block leading-snug">{sport.name}</span>
                                                            {sport.active && (
                                                                <span className="inline-block text-[8px] font-bold uppercase font-mono bg-forest-dew/40 text-valley-green px-1.5 py-0.5 rounded mt-0.5">
                                                                    Rekomendasi Terpilih
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-mono text-xs font-bold text-valley-green">{sport.pct}%</span>
                                                        <div className="w-16 h-1.5 rounded-full bg-stone-100 overflow-hidden shrink-0">
                                                            <div className="h-full bg-emerald-500" style={{ width: `${sport.pct}%` }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 6: TESTIMONI SAYA (Standalone Sidebar Tab) */}
                    {activeTab === 'testimoni' && (
                        <div className="space-y-8 animate-fade-in">
                            {/* Hero section */}
                            <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                                <div className="absolute right-0 bottom-0 w-40 h-40 bg-forest-dew/10 rounded-full blur-2xl"></div>
                                <div className="space-y-2 relative z-10">
                                    <h1 className="text-xl font-extrabold tracking-tight text-valley-green flex items-center gap-2">💬 Testimoni Saya</h1>
                                    <p className="text-xs text-stone-400 max-w-lg leading-relaxed">Bagikan pengalaman Anda menggunakan Optimove. Testimoni yang disetujui admin akan ditampilkan di halaman utama untuk memotivasi pengguna lain.</p>
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-12 gap-8 items-start">
                                {/* Left: Testimonial Form */}
                                <div className="lg:col-span-7 bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-5">
                                    <div>
                                        <h4 className="font-bold text-xs text-valley-green uppercase font-mono border-b border-stone-100 pb-3">Kirim Pesan Testimoni</h4>
                                        <p className="text-[11px] text-stone-400 mt-2 leading-normal">
                                            Berikan ulasan jujur Anda tentang Optimove untuk membantu kami terus berkembang dan memberikan motivasi bagi pengguna lain.
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
                                                <div className="flex gap-1.5">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onClick={() => testimonialForm.setData('rating', star)}
                                                            className="text-2xl transition hover:scale-110 outline-none cursor-pointer"
                                                        >
                                                            {star <= testimonialForm.data.rating ? '★' : '☆'}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-[10px] font-bold text-stone-400 uppercase">Pesan Testimoni</label>
                                                    <span className="text-[9px] text-stone-400">
                                                        {300 - (testimonialForm.data.content?.length || 0)} karakter tersisa
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
                                                className="w-full py-3 bg-valley-green hover:opacity-90 text-white rounded-full font-bold text-xs transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                                Kirim Testimoni
                                            </button>
                                        </form>
                                    )}
                                </div>

                                {/* Right: Existing Testimonial List & Status */}
                                <div className="lg:col-span-5 bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-4">
                                    <h4 className="font-bold text-xs text-valley-green uppercase font-mono border-b border-stone-100 pb-2">Status Testimoni Anda</h4>

                                    {testimonials.length === 0 ? (
                                        <div className="text-center py-12 border border-dashed border-stone-200 rounded-2xl bg-stone-50/50">
                                            <span className="text-3xl block mb-3">💬</span>
                                            <p className="text-xs text-stone-400 font-medium">Anda belum mengirimkan testimoni.</p>
                                            <p className="text-[10px] text-stone-400 mt-1">Kirim pesan testimoni untuk berbagi pengalaman Anda.</p>
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
                                Streak Anda: {user.workout_streak || 1} Hari
                            </div>
                            <button onClick={() => setShowBadgeModal(false)} className="w-full mt-2 py-2.5 rounded-full font-bold text-xs bg-valley-green hover:opacity-90 text-white transition">
                                Keren, Terima Kasih!
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    );
}
