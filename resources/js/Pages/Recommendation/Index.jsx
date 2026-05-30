import { useForm, usePage, Link } from '@inertiajs/react';
import { useRef, useEffect, useState } from 'react';

const rankStyle = (rank) => {
    if (rank === 1) return { bg: 'var(--color-adaline-ink)', text: 'var(--color-canvas-ice)' };
    if (rank === 2) return { bg: 'var(--color-valley-green)', text: 'var(--color-canvas-ice)' };
    if (rank === 3) return { bg: 'var(--color-amber-seed)', text: 'var(--color-canvas-ice)' };
    return { bg: 'var(--color-stone-moss)', text: 'var(--color-adaline-ink)' };
};

const FIELDS = [
    { key: 'gender', label: 'Jenis Kelamin', weight: '10%', opts: [{ v: 'Male', l: 'Laki-laki' }, { v: 'Female', l: 'Perempuan' }] },
    { key: 'age_group', label: 'Rentang Usia', weight: '25%', opts: [{ v: '15 to 18', l: '15–18 tahun' }, { v: '19 to 25', l: '19–25 tahun' }, { v: '26 to 30', l: '26–30 tahun' }, { v: '31 to 40', l: '31–40 tahun' }, { v: '40 and above', l: '40+ tahun' }] },
    { key: 'fitness_level', label: 'Tingkat Kebugaran', weight: '30%', opts: [{ v: 'Unfit', l: 'Tidak Bugar' }, { v: 'Average', l: 'Rata-rata' }, { v: 'Good', l: 'Bugar (Good)' }, { v: 'Very good', l: 'Sangat Bugar' }, { v: 'Excellent', l: 'Prima (Excellent)' }] },
    { key: 'exercise_frequency', label: 'Frekuensi Olahraga', weight: '25%', opts: [{ v: 'Never', l: 'Tidak Pernah' }, { v: '1 to 2 times a week', l: '1–2x seminggu' }, { v: '3 to 4 times a week', l: '3–4x seminggu' }, { v: 'Everyday', l: 'Setiap Hari' }] },
    { key: 'diet', label: 'Pola Makan Sehat', weight: '10%', opts: [{ v: 'No', l: 'Tidak' }, { v: 'Not always', l: 'Kadang-kadang' }, { v: 'Yes', l: 'Ya, Selalu' }] },
];



function AnimatedCounter({ target, duration = 1800 }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started.current) {
                started.current = true;
                const start = performance.now();
                const tick = (now) => {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    setCount(Math.floor(eased * target));
                    if (progress < 1) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
            }
        }, { threshold: 0.3 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target, duration]);

    return <span ref={ref}>{count.toLocaleString('id-ID')}</span>;
}

function MiniBar({ value, max, color }) {
    return (
        <div className="flex-1 rounded-full h-1.5 overflow-hidden" style={{ backgroundColor: 'var(--color-stone-moss)' }}>
            <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.round((value / max) * 100)}%`, backgroundColor: color }}
            />
        </div>
    );
}

function Card({ children, className = '' }) {
    return (
        <div className={`rounded-2xl border p-6 ${className}`} style={{ backgroundColor: 'var(--color-canvas-ice)', borderColor: 'var(--color-stone-moss)' }}>
            {children}
        </div>
    );
}

function SectionLabel({ children }) {
    return <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: 'var(--color-valley-green)' }}>{children}</p>;
}

export default function Index({ formData, histories = [], stats = {} }) {
    const { recommendations, auth, bmi, bmiCategory } = usePage().props;
    const formRef = useRef(null);

    const { data, setData, post, processing, errors } = useForm({
        age: formData?.age || '',
        age_group: formData?.age_group || '19 to 25',
        gender: formData?.gender || 'Male',
        fitness_level: formData?.fitness_level || 'Good',
        exercise_frequency: formData?.exercise_frequency || '1 to 2 times a week',
        diet: formData?.diet || 'Not always',
        height: formData?.height || '',
        weight: formData?.weight || '',
        physical_condition: formData?.physical_condition || 'none',
    });

    const [ageWarning, setAgeWarning] = useState('');
    const [conditionInfo, setConditionInfo] = useState('');

    useEffect(() => {
        const ageVal = parseInt(data.age);
        if (ageVal) {
            let grp = '40 and above';
            if (ageVal <= 18) grp = '15 to 18';
            else if (ageVal <= 25) grp = '19 to 25';
            else if (ageVal <= 30) grp = '26 to 30';
            else if (ageVal <= 40) grp = '31 to 40';
            setData('age_group', grp);
        }
    }, [data.age]);

    useEffect(() => {
        const ageVal = parseInt(data.age);
        if (ageVal && (ageVal < 15 || ageVal > 60)) {
            setAgeWarning('⚠️ Perhatian: Metode SAW dioptimalkan untuk usia produktif (15 - 60 tahun). Rekomendasi di luar rentang ini mungkin kurang relevan.');
        } else {
            setAgeWarning('');
        }
    }, [data.age]);

    useEffect(() => {
        if (data.physical_condition === 'knee_injury') {
            setConditionInfo('💡 Cedera Lutut Terdeteksi: Sistem akan membatasi olahraga beban sendi tinggi (High-Impact) seperti Lari & Basket, serta menyarankan olahraga beban sendi rendah (Low-Impact) seperti Renang & Yoga.');
        } else if (data.physical_condition === 'asthma') {
            setConditionInfo('💡 Gangguan Asma Terdeteksi: Sistem akan menandai olahraga intensitas kardio tinggi dengan penanda peringatan, dan merekomendasikan olahraga bernapas stabil (Low-Impact) seperti Yoga atau Berjalan.');
        } else if (data.physical_condition === 'heart') {
            setConditionInfo('💡 Masalah Jantung Terdeteksi: Dianjurkan berkonsultasi dengan dokter. Sistem akan menyaring olahraga berintensitas tinggi (High-Impact).');
        } else {
            setConditionInfo('');
        }
    }, [data.physical_condition]);

    const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth' });

    const submit = (e) => {
        e.preventDefault();
        post(route('recommend'), {
            preserveScroll: true,
            onSuccess: () => setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth' }), 100),
        });
    };

    const ink = 'var(--color-adaline-ink)';
    const ice = 'var(--color-canvas-ice)';
    const moss = 'var(--color-stone-moss)';
    const green = 'var(--color-valley-green)';
    const amber = 'var(--color-amber-seed)';
    const dew = 'var(--color-forest-dew)';

    // Derived stats
    const topSportsEntries = Object.entries(stats.top_sports || {}).slice(0, 8);
    const maxSportCount = topSportsEntries.length > 0 ? Math.max(...topSportsEntries.map(([, c]) => c)) : 1;
    const genderMale = stats.gender?.Male || 0;
    const genderFemale = stats.gender?.Female || 0;
    const totalGender = genderMale + genderFemale || 1;
    const fitnessEntries = Object.entries(stats.fitness || {});
    const maxFitness = fitnessEntries.length > 0 ? Math.max(...fitnessEntries.map(([, c]) => c)) : 1;
    const totalDataset = stats.total || 0;
    const totalSports = topSportsEntries.length;

    return (
        <div className="min-h-screen font-sans" style={{ backgroundColor: ice, color: ink }}>

            {/* NAVBAR */}
            <header className="sticky top-0 z-50 border-b" style={{ backgroundColor: ice, borderColor: moss }}>
                <nav className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-10">
                        <span className="font-bold text-lg" style={{ letterSpacing: '-0.04em' }}>Optimove</span>
                        <div className="hidden md:flex gap-8 text-sm">
                            <a href="#statistik" className="transition hover:opacity-50">Dataset</a>
                            <a href="#metodologi" className="transition hover:opacity-50">Metodologi SAW</a>
                            <a href="#form" className="transition hover:opacity-50">Mulai Analisis</a>
                            <a href="#riwayat" className="transition hover:opacity-50">Riwayat</a>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 md:gap-4">
                        {auth?.user ? (
                            <>
                                {auth.user.role === 'admin' ? (
                                    <a href={route('admin.dashboard')} className="py-2 px-4 rounded-xl text-xs font-bold transition hover:opacity-80 border"
                                        style={{ borderColor: green, color: green }}>
                                        Dashboard Admin
                                    </a>
                                ) : (
                                    <Link href={route('workspace.index')} className="py-2 px-4 rounded-xl text-xs font-bold transition hover:opacity-85 border"
                                        style={{ borderColor: green, color: green, backgroundColor: dew }}>
                                        Personal Workspace
                                    </Link>
                                )}
                                <Link href={route('logout')} method="post" as="button" className="ml-2 text-xs font-bold transition hover:opacity-60"
                                    style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                                    Logout
                                </Link>
                            </>
                        ) : (
                            <button onClick={scrollToForm} className="py-2 px-4 md:px-6 rounded-xl text-xs md:text-sm font-bold transition hover:opacity-90"
                                style={{ backgroundColor: amber, color: ice }}>
                                Mulai
                            </button>
                        )}
                    </div>
                </nav>
            </header>

            {/* HERO */}
            <section className="relative overflow-hidden" style={{ minHeight: '90vh' }}>
                <img src="/images/hero-bg.png" alt="Landscape" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.28 }} />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(251,253,246,0.05) 0%, rgba(251,253,246,0.82) 65%, rgba(251,253,246,1) 100%)` }} />
                <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center" style={{ minHeight: '90vh' }}>
                    
                    <h1 className="font-bold mb-6" style={{ fontSize: 'clamp(2.5rem,6vw,4.5rem)', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                        Olahraga yang Tepat,<br />Dimulai dari Data Anda
                    </h1>
                    <p className="max-w-xl mx-auto mb-10" style={{ opacity: 0.65, fontSize: '1.1rem' }}>
                        Optimove menggunakan metode <strong>Simple Additive Weighting (SAW)</strong> berbasis dataset
                        kebugaran nyata untuk merekomendasikan olahraga yang paling sesuai profil Anda secara terukur.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button onClick={scrollToForm} className="py-4 px-8 rounded-full font-bold text-base hover:opacity-90 transition"
                            style={{ backgroundColor: ink, color: ice }}>
                            Mulai Analisis Sekarang
                        </button>
                        <a href="#metodologi" className="py-4 px-8 rounded-full font-bold text-base border transition"
                            style={{ borderColor: moss, color: green }}>
                            Lihat Metodologi
                        </a>
                    </div>
                </div>
            </section>

            {/* COUNTER STRIP */}
            <section style={{ backgroundColor: ink, color: ice }}>
                <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {[
                        { label: 'Responden Dataset', value: totalDataset, suffix: '' },
                        { label: 'Jenis Olahraga', value: totalSports > 0 ? totalSports : 15, suffix: '+' },
                        { label: 'Kriteria Penilaian', value: 5, suffix: '' },
                        { label: 'Rekomendasi Diproses', value: histories.length > 0 ? undefined : 0, static: true },
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <div className="text-4xl font-extrabold tracking-tighter" style={{ letterSpacing: '-0.04em', color: dew }}>
                                {item.static
                                    ? <AnimatedCounter target={0} />
                                    : item.value !== undefined
                                        ? <><AnimatedCounter target={item.value} />{item.suffix}</>
                                        : <AnimatedCounter target={0} />
                                }
                            </div>
                            <div className="text-xs font-mono uppercase tracking-widest" style={{ opacity: 0.6 }}>{item.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* STATISTIK DATASET */}
            {totalDataset > 0 && (
                <section id="statistik" className="py-24" style={{ backgroundColor: dew }}>
                    <div className="max-w-7xl mx-auto px-6 md:px-10">
                        <div className="text-center mb-14">
                            <SectionLabel>Transparansi Data</SectionLabel>
                            <h2 className="font-bold" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', letterSpacing: '-0.04em' }}>
                                Mengenal Dataset Kami
                            </h2>
                            <p className="mt-3 text-sm max-w-lg mx-auto" style={{ opacity: 0.65 }}>
                                Rekomendasi Optimove didasarkan pada dataset fitness nyata dengan <strong>{totalDataset.toLocaleString('id-ID')} responden</strong>. Berikut distribusi datanya.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Distribusi Gender */}
                            <Card>
                                <div className="font-mono text-xs mb-4 uppercase tracking-widest" style={{ color: green }}>Distribusi Gender</div>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm font-bold mb-2">
                                            <span>Laki-laki</span>
                                            <span className="font-mono" style={{ color: green }}>
                                                {genderMale.toLocaleString('id-ID')}
                                                <span className="text-xs font-normal ml-1 opacity-60">({Math.round((genderMale / totalGender) * 100)}%)</span>
                                            </span>
                                        </div>
                                        <div className="w-full rounded-full h-2 overflow-hidden" style={{ backgroundColor: moss }}>
                                            <div className="h-full rounded-full" style={{ width: `${Math.round((genderMale / totalGender) * 100)}%`, backgroundColor: green }} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm font-bold mb-2">
                                            <span>Perempuan</span>
                                            <span className="font-mono" style={{ color: amber }}>
                                                {genderFemale.toLocaleString('id-ID')}
                                                <span className="text-xs font-normal ml-1 opacity-60">({Math.round((genderFemale / totalGender) * 100)}%)</span>
                                            </span>
                                        </div>
                                        <div className="w-full rounded-full h-2 overflow-hidden" style={{ backgroundColor: moss }}>
                                            <div className="h-full rounded-full" style={{ width: `${Math.round((genderFemale / totalGender) * 100)}%`, backgroundColor: amber }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 pt-4 border-t text-xs" style={{ borderColor: moss, opacity: 0.5 }}>
                                    Total {totalDataset.toLocaleString('id-ID')} responden terverifikasi
                                </div>
                            </Card>

                            {/* Distribusi Tingkat Kebugaran */}
                            <Card>
                                <div className="font-mono text-xs mb-4 uppercase tracking-widest" style={{ color: green }}>Tingkat Kebugaran</div>
                                <div className="space-y-2.5">
                                    {[
                                        { key: 'Unfit', label: 'Tidak Bugar' },
                                        { key: 'Average', label: 'Rata-rata' },
                                        { key: 'Good', label: 'Bugar' },
                                        { key: 'Very good', label: 'Sangat Bugar' },
                                        { key: 'Excellent', label: 'Prima' },
                                    ].map(({ key, label }) => {
                                        const val = stats.fitness?.[key] || 0;
                                        return (
                                            <div key={key} className="flex items-center gap-3 text-xs">
                                                <div className="w-20 shrink-0 font-medium" style={{ opacity: 0.8 }}>{label}</div>
                                                <MiniBar value={val} max={maxFitness} color={green} />
                                                <div className="w-10 text-right font-mono font-bold" style={{ color: green }}>{val}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card>

                            {/* Top Olahraga Populer di Dataset */}
                            <Card>
                                <div className="font-mono text-xs mb-4 uppercase tracking-widest" style={{ color: green }}>Olahraga Terpopuler</div>
                                <div className="space-y-2.5">
                                    {topSportsEntries.slice(0, 5).map(([sport, count]) => (
                                        <div key={sport} className="flex items-center gap-3 text-xs">
                                            <div className="flex-1 min-w-0 font-medium truncate" style={{ opacity: 0.85 }}>{sport}</div>
                                            <MiniBar value={count} max={maxSportCount} color={green} />
                                            <div className="w-10 text-right font-mono font-bold" style={{ color: green }}>{count}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-5 pt-4 border-t text-xs" style={{ borderColor: moss, opacity: 0.5 }}>
                                    {totalSports} jenis olahraga dalam dataset
                                </div>
                            </Card>
                        </div>
                    </div>
                </section>
            )}

            {/* OLAHRAGA TERSEDIA — SPORT GRID */}
            {topSportsEntries.length > 0 && (
                <section className="py-20" style={{ backgroundColor: ice }}>
                    <div className="max-w-7xl mx-auto px-6 md:px-10">
                        <div className="text-center mb-12">
                            <SectionLabel>Koleksi Olahraga</SectionLabel>
                            <h2 className="font-bold" style={{ fontSize: 'clamp(1.6rem,3.5vw,2.5rem)', letterSpacing: '-0.04em' }}>
                                Olahraga yang Didukung Sistem
                            </h2>
                            <p className="mt-3 text-sm max-w-md mx-auto" style={{ opacity: 0.55 }}>
                                Sistem SAW kami mencakup berbagai jenis aktivitas fisik dari dataset responden nyata.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {topSportsEntries.map(([sport, count], i) => (
                                <div
                                    key={sport}
                                    className="flex flex-col items-center text-center p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-default"
                                    style={{
                                        backgroundColor: i === 0 ? ink : ice,
                                        borderColor: i === 0 ? ink : moss,
                                        color: i === 0 ? ice : ink,
                                    }}
                                >
                                    <div className="font-bold text-sm leading-tight mb-1">{sport}</div>
                                    <div className="text-xs font-mono mt-1" style={{ opacity: i === 0 ? 0.7 : 0.45 }}>
                                        {count} responden
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* METODOLOGI */}
            <section id="metodologi" className="py-28" style={{ backgroundColor: dew }}>
                <div className="max-w-5xl mx-auto px-6 md:px-10">
                    <div className="text-center mb-12">
                        <SectionLabel>Metodologi</SectionLabel>
                        <h2 className="font-bold" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', letterSpacing: '-0.04em' }}>
                            Tabel Bobot Kriteria SAW
                        </h2>
                    </div>
                    <div className="overflow-hidden rounded-2xl border" style={{ borderColor: moss }}>
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ backgroundColor: ink, color: ice }}>
                                    {['No.', 'Kriteria', 'Skala Pengukuran', 'Tipe', 'Bobot', '%'].map(h => (
                                        <th key={h} className="text-left px-5 py-4 font-bold">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { no: 1, name: 'Tingkat Kebugaran', scale: 'Ordinal (5 level)', w: 0.30 },
                                    { no: 2, name: 'Rentang Usia', scale: 'Ordinal (5 rentang)', w: 0.25 },
                                    { no: 3, name: 'Frekuensi Olahraga', scale: 'Ordinal (4 level)', w: 0.25 },
                                    { no: 4, name: 'Jenis Kelamin', scale: 'Nominal (biner)', w: 0.10 },
                                    { no: 5, name: 'Pola Makan Sehat', scale: 'Ordinal (3 level)', w: 0.10 },
                                ].map((row, i) => (
                                    <tr key={row.no} style={{ backgroundColor: i % 2 === 0 ? ice : dew, borderTop: `1px solid ${moss}` }}>
                                        <td className="px-5 py-3 font-mono text-xs" style={{ opacity: 0.4 }}>{row.no}</td>
                                        <td className="px-5 py-3 font-bold">{row.name}</td>
                                        <td className="px-5 py-3 text-xs" style={{ opacity: 0.6 }}>{row.scale}</td>
                                        <td className="px-5 py-3">
                                            <span className="px-3 py-1 rounded-full text-xs font-mono" style={{ backgroundColor: dew, color: green }}>Benefit</span>
                                        </td>
                                        <td className="px-5 py-3 font-mono text-sm">{row.w.toFixed(2)}</td>
                                        <td className="px-5 py-3 font-bold">{(row.w * 100).toFixed(0)}%</td>
                                    </tr>
                                ))}
                                <tr style={{ backgroundColor: moss, borderTop: `2px solid var(--color-mist-gray)` }}>
                                    <td colSpan={4} className="px-5 py-3 font-bold">Total</td>
                                    <td className="px-5 py-3 font-mono font-bold">1.00</td>
                                    <td className="px-5 py-3 font-bold">100%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-10 grid md:grid-cols-3 gap-5">
                        {[
                            { step: '01', title: 'Input 5 Kriteria', desc: 'Pengguna mengisi profil: usia, gender, kebugaran, frekuensi olahraga, pola makan.' },
                            { step: '02', title: 'Hitung Skor SAW', desc: 'Tiap baris dataset diberi skor kemiripan ordinal per kriteria lalu dikalikan bobotnya masing-masing.' },
                            { step: '03', title: 'Normalisasi & Peringkat', desc: 'Rata-rata skor per olahraga dinormalisasi ke rentang 40–100% agar perbedaan antar pilihan terlihat jelas.' },
                        ].map(s => (
                            <Card key={s.step}>
                                <div className="font-mono text-xs mb-2" style={{ color: green }}>Langkah {s.step}</div>
                                <div className="font-bold text-sm mb-2">{s.title}</div>
                                <div className="text-xs leading-relaxed" style={{ opacity: 0.6 }}>{s.desc}</div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* FORM + RESULT */}
            <section id="form" ref={formRef} className="py-28" style={{ backgroundColor: ice }}>
                <div className="max-w-7xl mx-auto px-6 md:px-10">
                    <div className="text-center mb-12">
                        <SectionLabel>Analisis SPK</SectionLabel>
                        <h2 className="font-bold" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', letterSpacing: '-0.04em' }}>
                            Masukkan Data Profil Anda
                        </h2>
                        <p className="mt-3 text-sm max-w-md mx-auto" style={{ opacity: 0.6 }}>
                            Sistem akan menghitung skor SAW dan menampilkan peringkat olahraga terbaik berdasarkan dataset.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto items-start">
                        {/* Form */}
                        <div className="p-8 md:p-10 rounded-3xl" style={{ backgroundColor: ice, border: `1px solid ${moss}`, boxShadow: '0 8px 40px rgba(32,59,20,0.08)' }}>
                            <form onSubmit={submit} className="space-y-4">
                                {/* Gender */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold">Jenis Kelamin</label>
                                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full" style={{ backgroundColor: moss, color: green }}>Bobot 10%</span>
                                    </div>
                                    <select value={data.gender} onChange={e => setData('gender', e.target.value)}
                                        className="w-full rounded-xl text-sm py-3 px-4 border focus:outline-none transition"
                                        style={{ borderColor: moss, backgroundColor: ice, color: ink }}>
                                        <option value="Male">Laki-laki</option>
                                        <option value="Female">Perempuan</option>
                                    </select>
                                    {errors.gender && <div className="text-red-500 text-xs">{errors.gender}</div>}
                                </div>

                                {/* Age */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold">Usia (Tahun)</label>
                                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full" style={{ backgroundColor: moss, color: green }}>Bobot 25%</span>
                                    </div>
                                    <input type="number" value={data.age} onChange={e => setData('age', e.target.value)} required min="5" max="100" placeholder="Masukkan usia (angka)..."
                                        className="w-full rounded-xl text-sm py-3 px-4 border focus:outline-none transition"
                                        style={{ borderColor: moss, backgroundColor: ice, color: ink }} />
                                    {ageWarning && <p className="text-xs text-amber-900 font-mono leading-relaxed mt-1 animate-pulse">{ageWarning}</p>}
                                    {errors.age && <div className="text-red-500 text-xs">{errors.age}</div>}
                                </div>

                                {/* Height & Weight */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold">Tinggi Badan (cm)</label>
                                        <input type="number" value={data.height} onChange={e => setData('height', e.target.value)} required min="50" max="250" placeholder="cm"
                                            className="w-full rounded-xl text-sm py-3 px-4 border focus:outline-none transition"
                                            style={{ borderColor: moss, backgroundColor: ice, color: ink }} />
                                        {errors.height && <div className="text-red-500 text-xs">{errors.height}</div>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold">Berat Badan (kg)</label>
                                        <input type="number" value={data.weight} onChange={e => setData('weight', e.target.value)} required min="10" max="300" placeholder="kg"
                                            className="w-full rounded-xl text-sm py-3 px-4 border focus:outline-none transition"
                                            style={{ borderColor: moss, backgroundColor: ice, color: ink }} />
                                        {errors.weight && <div className="text-red-500 text-xs">{errors.weight}</div>}
                                    </div>
                                </div>

                                {/* Physical Condition */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold">Kondisi Fisik / Batasan</label>
                                    <select value={data.physical_condition} onChange={e => setData('physical_condition', e.target.value)}
                                        className="w-full rounded-xl text-sm py-3 px-4 border focus:outline-none transition"
                                        style={{ borderColor: moss, backgroundColor: ice, color: ink }}>
                                        <option value="none">Tidak Ada Batasan (Fit)</option>
                                        <option value="knee_injury">Cedera Lutut</option>
                                        <option value="asthma">Gangguan Asma</option>
                                        <option value="heart">Masalah Jantung</option>
                                    </select>
                                    {conditionInfo && <p className="text-xs text-valley-green font-mono leading-relaxed mt-1">{conditionInfo}</p>}
                                    {errors.physical_condition && <div className="text-red-500 text-xs">{errors.physical_condition}</div>}
                                </div>

                                {/* Fitness Level */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold">Tingkat Kebugaran</label>
                                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full" style={{ backgroundColor: moss, color: green }}>Bobot 30%</span>
                                    </div>
                                    <select value={data.fitness_level} onChange={e => setData('fitness_level', e.target.value)}
                                        className="w-full rounded-xl text-sm py-3 px-4 border focus:outline-none transition"
                                        style={{ borderColor: moss, backgroundColor: ice, color: ink }}>
                                        <option value="Unfit">Tidak Bugar</option>
                                        <option value="Average">Rata-rata</option>
                                        <option value="Good">Bugar</option>
                                        <option value="Very good">Sangat Bugar</option>
                                        <option value="Excellent">Prima</option>
                                    </select>
                                    {errors.fitness_level && <div className="text-red-500 text-xs">{errors.fitness_level}</div>}
                                </div>

                                {/* Exercise Frequency */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold">Frekuensi Olahraga</label>
                                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full" style={{ backgroundColor: moss, color: green }}>Bobot 25%</span>
                                    </div>
                                    <select value={data.exercise_frequency} onChange={e => setData('exercise_frequency', e.target.value)}
                                        className="w-full rounded-xl text-sm py-3 px-4 border focus:outline-none transition"
                                        style={{ borderColor: moss, backgroundColor: ice, color: ink }}>
                                        <option value="Never">Tidak Pernah</option>
                                        <option value="1 to 2 times a week">1–2x seminggu</option>
                                        <option value="3 to 4 times a week">3–4x seminggu</option>
                                        <option value="Everyday">Setiap Hari</option>
                                    </select>
                                    {errors.exercise_frequency && <div className="text-red-500 text-xs">{errors.exercise_frequency}</div>}
                                </div>

                                {/* Diet */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold">Pola Makan Sehat</label>
                                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full" style={{ backgroundColor: moss, color: green }}>Bobot 10%</span>
                                    </div>
                                    <select value={data.diet} onChange={e => setData('diet', e.target.value)}
                                        className="w-full rounded-xl text-sm py-3 px-4 border focus:outline-none transition"
                                        style={{ borderColor: moss, backgroundColor: ice, color: ink }}>
                                        <option value="No">Tidak</option>
                                        <option value="Not always">Kadang-kadang</option>
                                        <option value="Yes">Ya, Selalu</option>
                                    </select>
                                    {errors.diet && <div className="text-red-500 text-xs">{errors.diet}</div>}
                                </div>

                                <button type="submit" disabled={processing}
                                    className="w-full py-4 rounded-xl font-bold text-sm transition mt-2 cursor-pointer hover:opacity-90"
                                    style={{ backgroundColor: ink, color: ice, opacity: processing ? 0.6 : 1 }}>
                                    {processing ? 'Menghitung Skor SAW...' : 'Proses Analisis SAW'}
                                </button>
                            </form>
                        </div>

                        {/* Result */}
                        <div>
                            {recommendations ? (
                                <div className="space-y-5 animate-fade-in">
                                    
                                    {/* BMI Display Card (Trigger 1) */}
                                    {bmi && (
                                        <div className="p-5 rounded-3xl border border-stone-moss flex items-center justify-between shadow-xs bg-white">
                                            <div>
                                                <p className="text-[10px] text-stone-400 font-mono uppercase tracking-wider">Kalkulasi Indeks Massa Tubuh (IMT / BMI)</p>
                                                <div className="flex items-baseline gap-2 mt-1">
                                                    <span className="text-2xl font-black">{bmi}</span>
                                                    <span className="text-xs text-stone-500">Normal (18.5 - 24.9)</span>
                                                </div>
                                            </div>
                                            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#d7e8b5] text-[#203b14]">
                                                {bmiCategory || 'Normal'}
                                            </span>
                                        </div>
                                    )}

                                    <div>
                                        <h3 className="font-bold text-lg mb-1" style={{ letterSpacing: '-0.03em' }}>Hasil Peringkat SAW</h3>
                                        <p className="text-xs" style={{ opacity: 0.5 }}>Skor dinormalisasi ke rentang 40–100% berdasarkan rata-rata kemiripan dataset.</p>
                                    </div>

                                    <div className="space-y-3">
                                        {recommendations.map(item => {
                                            const rs = rankStyle(item.rank);
                                            return (
                                                <div key={item.rank} className={`flex flex-col p-4 rounded-2xl border transition-all hover:shadow-xs ${
                                                    item.warning ? 'bg-amber-50/30 border-amber-200' : 'bg-white border-stone-moss'
                                                }`}>
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                                                            style={{ backgroundColor: rs.bg, color: rs.text }}>
                                                            {item.rank}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-bold text-sm truncate flex items-center gap-2">
                                                                <span>{item.sport}</span>
                                                                {item.low_impact && (
                                                                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-green-50 text-green-700 border border-green-200">
                                                                        Low-Impact
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-xs mt-0.5" style={{ opacity: 0.45 }}>
                                                                {item.rank === 1 ? 'Rekomendasi Utama' : `Alternatif ke-${item.rank - 1}`}
                                                            </div>
                                                        </div>
                                                        <div className="shrink-0 text-right">
                                                            <div className="text-sm font-mono font-bold" style={{ color: green }}>{item.score}%</div>
                                                            <div className="w-20 h-1.5 rounded-full mt-1" style={{ backgroundColor: moss }}>
                                                                <div className="h-full rounded-full" style={{ width: `${item.score}%`, backgroundColor: green }} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Warning Banner inside card (Trigger 3) */}
                                                    {item.warning && (
                                                        <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-[10px] text-amber-900 leading-snug">
                                                            <span className="shrink-0 w-4 h-4 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center text-[9px] font-mono select-none">!</span>
                                                            <p>High-impact: Kurang disarankan untuk kondisi fisik lutut/asma/jantung Anda saat ini.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Action Register Option */}
                                    <div className="mt-6 p-6 rounded-3xl border border-stone-moss bg-stone-50/50 flex flex-col items-center text-center shadow-xs">
                                        <h4 className="font-extrabold text-sm mb-1">Simpan Rencana Olahraga & Rutin Berlatih!</h4>
                                        <p className="text-xs text-stone-500 max-w-sm mb-4 leading-relaxed">
                                            Simpan data profil kebugaran Anda, status BMI, dan otomatis generate to-do list harian olahraga di Notion-style Personal Workspace.
                                        </p>
                                        
                                        {auth?.user ? (
                                            <Link href={route('workspace.index')} className="inline-flex items-center gap-1.5 py-3 px-8 rounded-full font-bold text-xs bg-adaline-ink text-canvas-ice hover:opacity-90 transition shadow-sm">
                                                Buka Personal Workspace Anda ↗
                                            </Link>
                                        ) : (
                                            <div className="flex gap-2.5 w-full max-w-xs">
                                                <Link href={route('register')} className="flex-1 py-3 px-4 rounded-full font-bold text-xs text-center bg-adaline-ink text-canvas-ice hover:opacity-90 transition shadow-sm">
                                                    Daftar Akun Baru
                                                </Link>
                                                <Link href={route('login')} className="flex-1 py-3 px-4 rounded-full font-bold text-xs text-center border border-stone-moss bg-white hover:bg-stone-50 transition shadow-sm">
                                                    Masuk (Login)
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="min-h-80 flex flex-col items-center justify-center text-center rounded-3xl border-2 border-dashed p-10 bg-white"
                                    style={{ borderColor: 'var(--color-mist-gray)' }}>
                                    <div className="w-10 h-10 rounded-full border-2 mb-5 flex items-center justify-center text-stone-300 font-bold" style={{ borderColor: 'var(--color-mist-gray)' }}>?</div>
                                    <h3 className="font-bold mb-2 text-adaline-ink">Hasil Analisis Muncul di Sini</h3>
                                    <p className="text-sm max-w-xs text-stone-400">
                                        Isi formulir data tubuh di samping dan klik "Proses Analisis SAW" untuk melacak skor BMI dan rekomendasi olahraga terbaik.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* RIWAYAT */}
            <section id="riwayat" className="py-28" style={{ backgroundColor: dew }}>
                <div className="max-w-7xl mx-auto px-6 md:px-10">
                    <div className="mb-10">
                        <SectionLabel>Riwayat</SectionLabel>
                        <h2 className="font-bold" style={{ fontSize: 'clamp(1.5rem,3vw,2.2rem)', letterSpacing: '-0.04em' }}>
                            Riwayat Analisis Terakhir
                        </h2>
                        <p className="mt-2 text-sm" style={{ opacity: 0.5 }}>10 analisis terbaru yang telah diproses sistem.</p>
                    </div>

                    {histories.length === 0 ? (
                        <div className="text-center py-16 rounded-2xl border border-dashed" style={{ borderColor: moss }}>
                            <p className="text-sm" style={{ opacity: 0.4 }}>Belum ada riwayat analisis. Lakukan analisis pertama Anda di atas.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: moss }}>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr style={{ backgroundColor: ink, color: ice }}>
                                        {['Waktu', 'Usia', 'Gender', 'Kebugaran', 'Frekuensi', 'Diet', 'Rekomendasi Utama', 'Skor'].map(h => (
                                            <th key={h} className="text-left px-4 py-3 font-bold text-xs whitespace-nowrap">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {histories.map((h, i) => (
                                        <tr key={h.id} style={{ backgroundColor: i % 2 === 0 ? ice : dew, borderTop: `1px solid ${moss}` }}>
                                            <td className="px-4 py-3 text-xs font-mono whitespace-nowrap" style={{ opacity: 0.5 }}>
                                                {new Date(h.created_at).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="px-4 py-3 text-xs">{h.age_group}</td>
                                            <td className="px-4 py-3 text-xs">{h.gender === 'Male' ? 'L' : 'P'}</td>
                                            <td className="px-4 py-3 text-xs">{h.fitness_level}</td>
                                            <td className="px-4 py-3 text-xs">{h.exercise_frequency}</td>
                                            <td className="px-4 py-3 text-xs">{h.diet}</td>
                                            <td className="px-4 py-3 font-bold text-xs">{h.top_recommendation}</td>
                                            <td className="px-4 py-3 text-xs font-mono font-bold" style={{ color: green }}>{h.top_score}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-12 border-t text-xs font-mono"
                style={{ borderColor: moss, color: 'var(--color-mist-gray)', backgroundColor: ice }}>
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="tracking-widest uppercase text-center md:text-left">
                        Optimove · SPK Rekomendasi Olahraga · Metode SAW · 2026
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href={route('admin.dashboard')} 
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-bold tracking-normal uppercase transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
                            style={{ 
                                borderColor: moss, 
                                color: ink,
                                backgroundColor: dew,
                            }}>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Masuk Halaman Admin
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
