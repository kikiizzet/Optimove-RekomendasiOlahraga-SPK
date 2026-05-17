import { useForm, usePage } from '@inertiajs/react';
import { useRef } from 'react';

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

function BarChart({ data, total }) {
    const max = Math.max(...Object.values(data));
    return (
        <div className="space-y-2">
            {Object.entries(data).map(([label, count]) => (
                <div key={label} className="flex items-center gap-3 text-xs">
                    <div className="w-28 shrink-0 truncate" style={{ opacity: 0.7 }}>{label}</div>
                    <div className="flex-1 rounded-full h-2 overflow-hidden" style={{ backgroundColor: 'var(--color-stone-moss)' }}>
                        <div className="h-full rounded-full" style={{ width: `${(count / max) * 100}%`, backgroundColor: 'var(--color-valley-green)' }} />
                    </div>
                    <div className="w-8 text-right font-mono" style={{ color: 'var(--color-valley-green)' }}>{count}</div>
                </div>
            ))}
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
    const { recommendations } = usePage().props;
    const formRef = useRef(null);

    const { data, setData, post, processing, errors } = useForm({
        age_group: formData?.age_group || '19 to 25',
        gender: formData?.gender || 'Male',
        fitness_level: formData?.fitness_level || 'Good',
        exercise_frequency: formData?.exercise_frequency || '1 to 2 times a week',
        diet: formData?.diet || 'Not always',
    });

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

    return (
        <div className="min-h-screen font-sans" style={{ backgroundColor: ice, color: ink }}>

            {/* NAVBAR */}
            <header className="sticky top-0 z-50 border-b" style={{ backgroundColor: ice, borderColor: moss }}>
                <nav className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-10">
                        <span className="font-bold text-lg" style={{ letterSpacing: '-0.04em' }}>Optimove</span>
                        <div className="hidden md:flex gap-8 text-sm">
                            <a href="#statistik" className="transition hover:opacity-50">Statistik Dataset</a>
                            <a href="#metodologi" className="transition hover:opacity-50">Metodologi SAW</a>
                            <a href="#form" className="transition hover:opacity-50">Mulai Analisis</a>
                            <a href="#riwayat" className="transition hover:opacity-50">Riwayat</a>
                        </div>
                    </div>
                    <button onClick={scrollToForm} className="py-2 px-6 rounded-full text-sm font-bold transition hover:opacity-80"
                        style={{ backgroundColor: amber, color: ice }}>
                        Mulai Sekarang
                    </button>
                </nav>
            </header>

            {/* HERO */}
            <section className="relative overflow-hidden" style={{ minHeight: '90vh' }}>
                <img src="/images/hero-bg.png" alt="Landscape" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.28 }} />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(251,253,246,0.05) 0%, rgba(251,253,246,0.82) 65%, rgba(251,253,246,1) 100%)` }} />
                <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center" style={{ minHeight: '90vh' }}>
                    <div className="inline-flex px-4 py-1.5 rounded-full text-xs font-mono mb-8 border" style={{ borderColor: moss, color: green }}>
                        Sistem Pendukung Keputusan · Metode SAW · {stats.total || 0} Responden
                    </div>
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

            {/* STATISTIK DATASET */}
            <section id="statistik" className="py-28" style={{ backgroundColor: moss }}>
                <div className="max-w-7xl mx-auto px-6 md:px-10">
                    <div className="text-center mb-14">
                        <SectionLabel>Statistik Dataset</SectionLabel>
                        <h2 className="font-bold" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', letterSpacing: '-0.04em' }}>
                            Distribusi Data Responden
                        </h2>
                        <p className="mt-3 text-sm max-w-lg mx-auto" style={{ opacity: 0.6 }}>
                            Dataset terdiri dari {stats.total || 0} responden dengan beragam latar belakang kebugaran. Distribusi ini menjadi dasar perhitungan SAW.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        {[
                            { label: 'Total Responden', value: stats.total || 0 },
                            { label: 'Kelompok Usia', value: Object.keys(stats.age || {}).length },
                            { label: 'Jenis Olahraga', value: Object.keys(stats.top_sports || {}).length + '+' },
                            { label: 'Kriteria SAW', value: 5 },
                        ].map(s => (
                            <Card key={s.label}>
                                <div className="text-3xl font-bold mb-1" style={{ letterSpacing: '-0.04em', color: green }}>{s.value}</div>
                                <div className="text-sm" style={{ opacity: 0.55 }}>{s.label}</div>
                            </Card>
                        ))}
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stats.gender && (
                            <Card>
                                <div className="text-sm font-bold mb-4">Distribusi Jenis Kelamin</div>
                                <BarChart data={stats.gender} total={stats.total} />
                            </Card>
                        )}
                        {stats.age && (
                            <Card>
                                <div className="text-sm font-bold mb-4">Distribusi Rentang Usia</div>
                                <BarChart data={stats.age} total={stats.total} />
                            </Card>
                        )}
                        {stats.fitness && (
                            <Card>
                                <div className="text-sm font-bold mb-4">Distribusi Tingkat Kebugaran</div>
                                <BarChart data={stats.fitness} total={stats.total} />
                            </Card>
                        )}
                        {stats.frequency && (
                            <Card>
                                <div className="text-sm font-bold mb-4">Distribusi Frekuensi Olahraga</div>
                                <BarChart data={stats.frequency} total={stats.total} />
                            </Card>
                        )}
                        {stats.top_sports && (
                            <Card className="lg:col-span-2">
                                <div className="text-sm font-bold mb-4">Olahraga Paling Populer di Dataset</div>
                                <BarChart data={stats.top_sports} total={stats.total} />
                            </Card>
                        )}
                    </div>
                </div>
            </section>

            {/* METODOLOGI */}
            <section id="metodologi" className="py-28" style={{ backgroundColor: ice }}>
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
            <section id="form" ref={formRef} className="py-28" style={{ backgroundColor: dew }}>
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
                            <form onSubmit={submit} className="space-y-5">
                                {FIELDS.map(({ key, label, weight, opts }) => (
                                    <div key={key} className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-bold">{label}</label>
                                            <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ backgroundColor: moss, color: green }}>
                                                Bobot {weight}
                                            </span>
                                        </div>
                                        <select value={data[key]} onChange={e => setData(key, e.target.value)}
                                            className="w-full rounded-xl text-sm py-3 px-4 border focus:outline-none transition"
                                            style={{ borderColor: moss, backgroundColor: ice, color: ink }}>
                                            {opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                                        </select>
                                        {errors[key] && <div className="text-red-500 text-xs">{errors[key]}</div>}
                                    </div>
                                ))}
                                <button type="submit" disabled={processing}
                                    className="w-full py-4 rounded-xl font-bold text-sm transition mt-2"
                                    style={{ backgroundColor: ink, color: ice, opacity: processing ? 0.6 : 1 }}>
                                    {processing ? 'Menghitung Skor SAW...' : 'Proses Analisis SAW'}
                                </button>
                            </form>
                        </div>

                        {/* Result */}
                        <div>
                            {recommendations ? (
                                <div className="space-y-3">
                                    <div className="mb-5">
                                        <h3 className="font-bold text-lg mb-1" style={{ letterSpacing: '-0.03em' }}>Hasil Peringkat SAW</h3>
                                        <p className="text-xs" style={{ opacity: 0.5 }}>Skor dinormalisasi ke rentang 40–100% agar perbedaan antar olahraga terlihat jelas.</p>
                                    </div>
                                    {recommendations.map(item => {
                                        const rs = rankStyle(item.rank);
                                        return (
                                            <div key={item.rank} className="flex items-center gap-4 p-4 rounded-2xl border"
                                                style={{ backgroundColor: ice, borderColor: moss }}>
                                                <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                                                    style={{ backgroundColor: rs.bg, color: rs.text }}>
                                                    {item.rank}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-bold text-sm truncate">{item.sport}</div>
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
                                        );
                                    })}
                                    <p className="text-xs p-4 rounded-xl font-mono mt-4" style={{ backgroundColor: moss, opacity: 0.75 }}>
                                        Skor dihitung dengan SAW 5 kriteria berbobot. Nilai merepresentasikan rata-rata kemiripan profil Anda terhadap responden yang melakukan olahraga yang sama.
                                    </p>
                                </div>
                            ) : (
                                <div className="min-h-80 flex flex-col items-center justify-center text-center rounded-3xl border-2 border-dashed p-10"
                                    style={{ borderColor: 'var(--color-mist-gray)' }}>
                                    <div className="w-10 h-10 rounded-full border-2 mb-5" style={{ borderColor: 'var(--color-mist-gray)' }} />
                                    <h3 className="font-bold mb-2">Hasil Analisis Muncul di Sini</h3>
                                    <p className="text-sm max-w-xs" style={{ opacity: 0.45 }}>
                                        Isi formulir dan tekan "Proses Analisis SAW" untuk melihat rekomendasi olahraga berbasis perhitungan bobot.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* RIWAYAT */}
            <section id="riwayat" className="py-28" style={{ backgroundColor: ice }}>
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
            <footer className="py-10 border-t text-center text-xs font-mono tracking-widest uppercase"
                style={{ borderColor: moss, color: 'var(--color-mist-gray)', backgroundColor: ice }}>
                Optimove · SPK Rekomendasi Olahraga · Metode SAW · 2026
            </footer>
        </div>
    );
}
