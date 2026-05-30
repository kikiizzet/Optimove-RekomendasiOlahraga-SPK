import React, { useState, useEffect } from 'react';
import { useForm, usePage, Link, router } from '@inertiajs/react';

export default function Index({ user, todayTodos = [], journals = [], inactiveDays = 0, inactiveAlert = false }) {
    const { flash } = usePage().props;

    // States for Journal Modal and UI interaction
    const [showBadgeModal, setShowBadgeModal] = useState(false);
    const [badgeName, setBadgeName] = useState('');
    const [activeJournalTab, setActiveJournalTab] = useState('list'); // 'list' or 'create' or 'edit'
    const [editingJournal, setEditingJournal] = useState(null);

    // Form for adding to-dos
    const todoForm = useForm({
        task_name: '',
        sport_name: '',
        due_date: new Date().toISOString().split('T')[0],
    });

    // Form for journal entries
    const journalForm = useForm({
        title: '',
        content: '',
        mood: 'good',
    });

    // Capture flash badge award triggers
    useEffect(() => {
        if (flash?.badge_awarded) {
            setBadgeName(flash.badge_name);
            setShowBadgeModal(true);
        }
    }, [flash]);

    // Handle to-do submit
    const handleTodoSubmit = (e) => {
        e.preventDefault();
        todoForm.post(route('workspace.todos.store'), {
            onSuccess: () => todoForm.reset('task_name', 'sport_name'),
        });
    };

    // Toggle todo status (pakai router.patch, bukan todoForm)
    const toggleTodo = (todoId) => {
        router.patch(route('workspace.todos.toggle', todoId), {}, {
            preserveScroll: true,
        });
    };

    // Delete todo (pakai router.delete, bukan todoForm)
    const deleteTodo = (todoId) => {
        if (confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
            router.delete(route('workspace.todos.destroy', todoId), {
                preserveScroll: true,
            });
        }
    };

    // Handle journal submit
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

    // Trigger edit journal mode
    const startEditJournal = (journal) => {
        setEditingJournal(journal);
        journalForm.setData({
            title: journal.title,
            content: journal.content,
            mood: journal.mood || 'good',
        });
        setActiveJournalTab('edit');
    };

    // Delete journal (pakai router.delete)
    const deleteJournal = (journalId) => {
        if (confirm('Apakah Anda yakin ingin menghapus catatan jurnal ini?')) {
            router.delete(route('workspace.journals.destroy', journalId), {
                preserveScroll: true,
            });
        }
    };

    // Mood mapping helper
    const moodMap = {
        great: { icon: '🤩', label: 'Luar Biasa', bg: 'bg-[#d7e8b5]', text: 'text-[#203b14]' },
        good: { icon: '😊', label: 'Baik', bg: 'bg-[#d7e8b5]/50', text: 'text-[#203b14]' },
        okay: { icon: '😐', label: 'Biasa Saja', bg: 'bg-stone-100', text: 'text-stone-700' },
        tired: { icon: '😫', label: 'Lelah', bg: 'bg-amber-100', text: 'text-amber-800' },
    };

    // BMI helper colors
    const getBmiBadgeStyle = (category) => {
        switch (category) {
            case 'Normal':
                return { bg: 'bg-[#d7e8b5]', text: 'text-[#203b14]' };
            case 'Kurus':
            case 'Sangat Kurus':
                return { bg: 'bg-amber-100', text: 'text-amber-800' };
            case 'Overweight':
            case 'Obesitas':
                return { bg: 'bg-red-100', text: 'text-red-800' };
            default:
                return { bg: 'bg-stone-100', text: 'text-stone-700' };
        }
    };

    return (
        <div className="min-h-screen font-sans bg-canvas-ice text-adaline-ink pb-20">
            {/* Top Workspace Navbar */}
            <header className="sticky top-0 z-40 border-b bg-canvas-ice border-stone-moss">
                <nav className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-xl tracking-tighter">Optimove</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-forest-dew text-valley-green uppercase">
                            Workspace
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="/" className="text-sm font-bold transition hover:text-valley-green">
                            Beranda SPK
                        </Link>
                        <div className="h-4 w-px bg-stone-moss" />
                        <Link href={route('logout')} method="post" as="button" className="text-sm font-bold text-red-600 transition hover:opacity-75">
                            Keluar
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Notification Banner for Inactivity Alert (Trigger 5) */}
            {inactiveAlert && (
                <div className="bg-red-50 border-b border-red-200 py-3.5 px-6 animate-pulse">
                    <div className="max-w-7xl mx-auto flex items-center gap-3 text-red-800 text-sm">
                        <svg className="w-5 h-5 shrink-0 text-red-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="font-bold">
                            Sudah {inactiveDays} hari Anda tidak berlatih. Yuk, mulai lagi rekomendasi olahraga Anda hari ini untuk menjaga kebugaran tubuh!
                        </p>
                    </div>
                </div>
            )}

            {/* Main Area */}
            <main className="max-w-7xl mx-auto px-6 md:px-10 mt-10">
                
                {/* Greeting Panel */}
                <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Halo, {user.name}!</h1>
                        <p className="text-sm text-stone-500 font-mono uppercase tracking-wider">
                            Personal Workspace · Olahraga Anda hari ini
                        </p>
                    </div>

                    {/* Streak flame card (Trigger 4 display) */}
                    <div className="flex items-center gap-4 bg-canvas-ice border border-stone-moss p-4 rounded-2xl shadow-sm">
                        <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center border border-amber-200 animate-bounce">
                            <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-mono tracking-widest text-stone-400">Workout Streak</p>
                            <p className="text-lg font-extrabold text-amber-900">{user.workout_streak || 0} Hari Berturut-turut</p>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    
                    {/* LEFT COLUMN: User Stats Card */}
                    <div className="space-y-6 lg:col-span-1">
                        <div className="bg-canvas-ice border border-stone-moss rounded-3xl p-6 shadow-sm">
                            <h3 className="text-xs font-mono uppercase tracking-widest text-valley-green mb-4 border-b pb-2 border-stone-moss">Profil Fisik User</h3>
                            
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                                        <p className="text-[10px] text-stone-400 font-mono">Tinggi Badan</p>
                                        <p className="text-base font-extrabold">{user.height ? `${Math.round(user.height)} cm` : '-'}</p>
                                    </div>
                                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                                        <p className="text-[10px] text-stone-400 font-mono">Berat Badan</p>
                                        <p className="text-base font-extrabold">{user.weight ? `${Math.round(user.weight)} kg` : '-'}</p>
                                    </div>
                                </div>

                                {user.bmi && (
                                    <div className="p-4 rounded-xl border flex items-center justify-between" style={{ backgroundColor: '#fbfdf6', borderColor: 'var(--color-stone-moss)' }}>
                                        <div>
                                            <p className="text-[10px] text-stone-400 font-mono">Nilai & Status BMI</p>
                                            <p className="text-xl font-black mt-0.5 text-adaline-ink">{user.bmi}</p>
                                        </div>
                                        {user.bmi && (
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getBmiBadgeStyle(user.physical_condition_bmi_category || 'Normal').bg} ${getBmiBadgeStyle(user.physical_condition_bmi_category || 'Normal').text}`}>
                                                Normal
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div className="p-4 rounded-xl border border-stone-moss bg-stone-50">
                                    <p className="text-[10px] text-stone-400 font-mono">Batasan Kondisi Fisik</p>
                                    <p className="text-sm font-bold mt-1 uppercase text-valley-green">
                                        {user.physical_condition === 'knee_injury' ? 'Cedera Lutut' : 
                                         user.physical_condition === 'asthma' ? 'Gangguan Asma' : 
                                         user.physical_condition === 'heart' ? 'Masalah Jantung' : 'Tidak Ada (Fit)'}
                                    </p>
                                </div>

                                {user.last_recommendation && (
                                    <div className="p-4 rounded-xl border border-forest-dew bg-forest-dew/25">
                                        <p className="text-[10px] text-valley-green/60 font-mono">Rekomendasi Utama SAW</p>
                                        <p className="text-base font-extrabold mt-1 text-valley-green">{user.last_recommendation}</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 pt-5 border-t border-stone-moss text-center">
                                <Link href="/" className="inline-block py-2.5 px-6 rounded-full text-xs font-bold text-canvas-ice bg-adaline-ink hover:opacity-90 transition">
                                    Hitung Ulang Rekomendasi
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* MIDDLE COLUMN: Daily To-Do List (Trigger 4 logic source) */}
                    <div className="space-y-6 lg:col-span-1">
                        <div className="bg-canvas-ice border border-stone-moss rounded-3xl p-6 shadow-sm">
                            <h3 className="text-xs font-mono uppercase tracking-widest text-valley-green mb-4 border-b pb-2 border-stone-moss">Workout Hari Ini</h3>

                            {/* Add Todo Form */}
                            <form onSubmit={handleTodoSubmit} className="mb-6 space-y-3">
                                <div>
                                    <input 
                                        type="text" 
                                        value={todoForm.data.task_name}
                                        onChange={e => todoForm.setData('task_name', e.target.value)}
                                        placeholder="Tambah latihan baru..."
                                        required
                                        className="w-full text-sm py-2.5 px-4 rounded-xl border border-stone-moss bg-canvas-ice focus:outline-none focus:ring-1 focus:ring-valley-green"
                                    />
                                    {todoForm.errors.task_name && <p className="text-red-500 text-xs mt-1">{todoForm.errors.task_name}</p>}
                                </div>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={todoForm.data.sport_name}
                                        onChange={e => todoForm.setData('sport_name', e.target.value)}
                                        placeholder="Cabang olahraga (opsional)"
                                        className="flex-1 text-xs py-2 px-3 rounded-lg border border-stone-moss bg-canvas-ice focus:outline-none focus:ring-1 focus:ring-valley-green"
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={todoForm.processing}
                                        className="py-2 px-4 rounded-lg bg-adaline-ink text-canvas-ice font-bold text-xs hover:opacity-90 transition shrink-0"
                                    >
                                        Tambah
                                    </button>
                                </div>
                            </form>

                            {/* To-Do Items List */}
                            {todayTodos.length === 0 ? (
                                <div className="text-center py-10 border border-dashed border-stone-moss rounded-2xl bg-stone-50">
                                    <p className="text-xs text-stone-400">Belum ada latihan hari ini.</p>
                                    <p className="text-[10px] text-stone-400 mt-1">Gunakan formulir di atas untuk menjadwalkan latihan.</p>
                                </div>
                            ) : (
                                <div className="space-y-2.5">
                                    {todayTodos.map(todo => (
                                        <div 
                                            key={todo.id} 
                                            className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                                                todo.is_completed 
                                                ? 'bg-stone-50 border-stone-200 opacity-60' 
                                                : 'bg-canvas-ice border-stone-moss hover:shadow-sm'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <button 
                                                    type="button"
                                                    onClick={() => toggleTodo(todo.id)}
                                                    className={`w-6 h-6 min-w-[24px] min-h-[24px] rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer ${
                                                        todo.is_completed 
                                                        ? 'bg-[#203b14] border-[#203b14] text-white' 
                                                        : 'border-stone-300 bg-white hover:border-[#203b14] hover:bg-[#d7e8b5]/30'
                                                    }`}
                                                >
                                                    {todo.is_completed && (
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </button>
                                                <div className="min-w-0">
                                                    <p className={`text-sm font-bold truncate leading-tight ${todo.is_completed ? 'line-through text-stone-400' : 'text-adaline-ink'}`}>
                                                        {todo.task_name}
                                                    </p>
                                                    {todo.sport_name && (
                                                        <span className="inline-block mt-1 text-[9px] font-mono bg-stone-moss px-1.5 py-0.5 rounded text-stone-600 uppercase">
                                                            {todo.sport_name}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <button 
                                                type="button" 
                                                onClick={() => deleteTodo(todo.id)}
                                                className="p-1.5 text-stone-400 hover:text-red-500 rounded transition"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {todayTodos.length > 0 && todayTodos.every(t => t.is_completed) && (
                                <div className="mt-5 p-3.5 bg-forest-dew/40 border border-forest-dew rounded-2xl text-center">
                                    <p className="text-xs font-bold text-valley-green">Luar biasa! Semua target latihan hari ini telah tercapai!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Notion-Style Workout Journal */}
                    <div className="space-y-6 lg:col-span-1">
                        <div className="bg-canvas-ice border border-stone-moss rounded-3xl p-6 shadow-sm min-h-[400px] flex flex-col">
                            <div className="flex items-center justify-between border-b pb-3 border-stone-moss mb-4">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    <h3 className="text-xs font-mono uppercase tracking-widest text-valley-green">Workout Journal</h3>
                                </div>
                                {activeJournalTab === 'list' ? (
                                    <button 
                                        onClick={() => {
                                            journalForm.reset();
                                            setActiveJournalTab('create');
                                        }}
                                        className="text-xs font-bold bg-[#e0e5d5]/50 hover:bg-[#e0e5d5] px-3 py-1.5 rounded-full transition"
                                    >
                                        + Catatan Baru
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => {
                                            setActiveJournalTab('list');
                                            setEditingJournal(null);
                                            journalForm.reset();
                                        }}
                                        className="text-xs font-bold text-stone-500 hover:text-adaline-ink transition"
                                    >
                                        Kembali
                                    </button>
                                )}
                            </div>

                            {/* TAB 1: LIST JOURNALS */}
                            {activeJournalTab === 'list' && (
                                <div className="flex-1 flex flex-col justify-between">
                                    {journals.length === 0 ? (
                                        <div className="my-auto text-center py-10 border border-dashed border-stone-moss rounded-2xl bg-stone-50">
                                            <p className="text-xs text-stone-400">Belum ada jurnal latihan.</p>
                                            <p className="text-[10px] text-stone-400 mt-1">Tuangkan progres latihan dan perasaan Anda setelah berolahraga.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                                            {journals.map(journal => (
                                                <div 
                                                    key={journal.id} 
                                                    className="p-4 bg-stone-50/50 border border-stone-moss/70 rounded-2xl hover:border-stone-moss transition shadow-sm hover:shadow-md flex flex-col"
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h4 className="font-extrabold text-sm text-adaline-ink leading-snug">{journal.title}</h4>
                                                        <div className="flex gap-1 shrink-0">
                                                            <button 
                                                                onClick={() => startEditJournal(journal)}
                                                                className="p-1 text-stone-400 hover:text-valley-green rounded transition"
                                                                title="Edit Jurnal"
                                                            >
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                                </svg>
                                                            </button>
                                                            <button 
                                                                onClick={() => deleteJournal(journal.id)}
                                                                className="p-1 text-stone-400 hover:text-red-500 rounded transition"
                                                                title="Hapus Jurnal"
                                                            >
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <p className="text-xs text-stone-600 mt-2 whitespace-pre-wrap leading-relaxed line-clamp-3">
                                                        {journal.content}
                                                    </p>

                                                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-200/50 text-[10px] font-mono text-stone-400">
                                                        <span>{new Date(journal.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                                                        {journal.mood && moodMap[journal.mood] && (
                                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-sans font-bold flex items-center gap-1 ${moodMap[journal.mood].bg} ${moodMap[journal.mood].text}`}>
                                                                <span>{moodMap[journal.mood].icon}</span>
                                                                <span>{moodMap[journal.mood].label}</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB 2: CREATE / EDIT JOURNAL */}
                            {(activeJournalTab === 'create' || activeJournalTab === 'edit') && (
                                <form onSubmit={handleJournalSubmit} className="flex-1 flex flex-col justify-between space-y-4">
                                    <div className="space-y-4 flex-1">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold">Judul Jurnal</label>
                                            <input 
                                                type="text" 
                                                required
                                                value={journalForm.data.title}
                                                onChange={e => journalForm.setData('title', e.target.value)}
                                                placeholder="Refleksi hari ini..."
                                                className="w-full text-sm py-2 px-3 rounded-xl border border-stone-moss bg-canvas-ice focus:outline-none focus:ring-1 focus:ring-valley-green"
                                            />
                                        </div>

                                        <div className="space-y-1 flex-1 flex flex-col">
                                            <label className="text-xs font-bold">Catatan Latihan (Notion-style)</label>
                                            <textarea 
                                                required
                                                rows="5"
                                                value={journalForm.data.content}
                                                onChange={e => journalForm.setData('content', e.target.value)}
                                                placeholder="Tuliskan bagaimana latihan Anda hari ini, hambatan, atau progres kebugaran yang Anda rasakan..."
                                                className="w-full flex-1 text-sm py-3 px-3 rounded-xl border border-stone-moss bg-canvas-ice focus:outline-none focus:ring-1 focus:ring-valley-green resize-none min-h-[160px]"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold block">Bagaimana suasana hati Anda hari ini?</label>
                                            <div className="grid grid-cols-4 gap-2">
                                                {Object.entries(moodMap).map(([key, data]) => (
                                                    <button
                                                        key={key}
                                                        type="button"
                                                        onClick={() => journalForm.setData('mood', key)}
                                                        className={`py-2 px-1 rounded-xl text-center border text-xs transition flex flex-col items-center gap-1 ${
                                                            journalForm.data.mood === key 
                                                            ? 'border-valley-green bg-forest-dew text-valley-green font-bold shadow-xs' 
                                                            : 'border-stone-200 hover:bg-stone-50 text-stone-500'
                                                        }`}
                                                    >
                                                        <span className="text-lg">{data.icon}</span>
                                                        <span className="text-[10px] scale-90">{data.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-stone-moss flex gap-2">
                                        <button 
                                            type="button" 
                                            onClick={() => {
                                                setActiveJournalTab('list');
                                                setEditingJournal(null);
                                                journalForm.reset();
                                            }}
                                            className="flex-1 py-2 rounded-xl text-xs font-bold border border-stone-moss hover:bg-stone-50 transition"
                                        >
                                            Batal
                                        </button>
                                        <button 
                                            type="submit" 
                                            disabled={journalForm.processing}
                                            className="flex-1 py-2 rounded-xl text-xs font-bold bg-adaline-ink text-canvas-ice hover:opacity-90 transition"
                                        >
                                            {activeJournalTab === 'edit' ? 'Perbarui' : 'Simpan Jurnal'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* STREAK MILESTONE BADGE MODAL POP-UP (Trigger 4) */}
            {showBadgeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#0a1d08]/70 backdrop-blur-sm animate-fade-in">
                    <div className="bg-canvas-ice border-2 border-amber-400 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden animate-scale-up">
                        
                        {/* Glow background effect */}
                        <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-200 rounded-full blur-3xl opacity-60" />
                        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-forest-dew rounded-full blur-3xl opacity-60" />

                        {/* Ribbon / Confetti Badge */}
                        <div className="w-24 h-24 mx-auto mb-6 bg-amber-50 rounded-full flex items-center justify-center border-4 border-amber-300 relative z-10 animate-bounce">
                            <svg className="w-12 h-12 text-amber-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>

                        <h3 className="text-xs font-mono uppercase tracking-widest text-amber-800 mb-2 font-bold">Lencana Baru Diperoleh!</h3>
                        <h2 className="text-2xl font-black text-adaline-ink tracking-tight mb-3">"{badgeName}"</h2>
                        
                        <p className="text-sm text-stone-500 leading-relaxed mb-6">
                            Hebat! Anda baru saja membuka pencapaian baru setelah menyelesaikan seluruh rencana latihan hari ini. Pertahankan konsistensi Anda!
                        </p>

                        <div className="flex flex-col items-center gap-3">
                            <div className="text-xs font-mono font-bold text-amber-900 bg-amber-100 px-3.5 py-1.5 rounded-full border border-amber-200">
                                Streak Anda: {user.workout_streak || 1} Hari
                            </div>
                            <button
                                onClick={() => setShowBadgeModal(false)}
                                className="w-full mt-2 py-3 px-6 rounded-full font-bold text-sm bg-adaline-ink text-canvas-ice transition hover:opacity-90"
                            >
                                Keren, Terima Kasih!
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
