import React, { useState } from 'react';
import { usePage, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function DatasetManagement({ datasets = {}, stats = {} }) {
    const { errors } = usePage().props;
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        gender: 'Male',
        age_group: '19 to 25',
        fitness_level: 'Good',
        exercise_frequency: '1 to 2 times a week',
        diet: 'Not always',
        sports_participated: '',
    });
    const [uploadFile, setUploadFile] = useState(null);

    const THEME = {
        ink: '#0a1d08',
        ice: '#fbfdf6',
        moss: '#e0e5d5',
        dew: '#d7e8b5',
        green: '#203b14',
        brown: '#4a3212',
    };

    const OPTIONS = {
        gender: [{ v: 'Male', l: 'Laki-laki' }, { v: 'Female', l: 'Perempuan' }],
        age_group: [
            { v: '15 to 18', l: '15–18 tahun' },
            { v: '19 to 25', l: '19–25 tahun' },
            { v: '26 to 30', l: '26–30 tahun' },
            { v: '31 to 40', l: '31–40 tahun' },
            { v: '40 and above', l: '40+ tahun' },
        ],
        fitness_level: [
            { v: 'Unfit', l: 'Tidak Bugar' },
            { v: 'Average', l: 'Rata-rata' },
            { v: 'Good', l: 'Bugar (Good)' },
            { v: 'Very good', l: 'Sangat Bugar' },
            { v: 'Excellent', l: 'Prima (Excellent)' },
        ],
        exercise_frequency: [
            { v: 'Never', l: 'Tidak Pernah' },
            { v: '1 to 2 times a week', l: '1–2x seminggu' },
            { v: '3 to 4 times a week', l: '3–4x seminggu' },
            { v: 'Everyday', l: 'Setiap Hari' },
        ],
        diet: [
            { v: 'No', l: 'Tidak' },
            { v: 'Not always', l: 'Kadang-kadang' },
            { v: 'Yes', l: 'Ya, Selalu' },
        ],
    };

    const handleAddDataset = (e) => {
        e.preventDefault();
        router.post(route('admin.datasets.store'), formData, {
            onSuccess: () => {
                setFormData({
                    gender: 'Male',
                    age_group: '19 to 25',
                    fitness_level: 'Good',
                    exercise_frequency: '1 to 2 times a week',
                    diet: 'Not always',
                    sports_participated: '',
                });
                setShowForm(false);
            },
        });
    };

    const handleDeleteDataset = (id) => {
        if (confirm('Yakin ingin menghapus data dataset ini?')) {
            router.delete(route('admin.datasets.destroy', id));
        }
    };

    const handleBulkImport = (e) => {
        e.preventDefault();
        if (!uploadFile) return;

        const formDataUpload = new FormData();
        formDataUpload.append('file', uploadFile);

        router.post(route('admin.datasets.bulkImport'), formDataUpload, {
            onSuccess: () => {
                setUploadFile(null);
                const fileInput = document.getElementById('csv-file-input');
                if (fileInput) fileInput.value = '';
                alert('Impor massal dataset CSV berhasil diproses!');
            },
        });
    };

    const handleExport = () => {
        window.location.href = route('admin.datasets.export');
    };

    return (
        <AdminLayout activeTab="datasets">
            <div className="space-y-8">
                {/* Header Title */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5" style={{ borderColor: THEME.moss }}>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight" style={{ color: THEME.ink, letterSpacing: '-0.03em' }}>Dataset Management</h2>
                        <p className="text-xs mt-1" style={{ color: THEME.green, opacity: 0.7 }}>Kelola dan perbarui basis data responden fitness untuk SPK Rekomendasi Olahraga.</p>
                    </div>
                    {/* Actions Group Header */}
                    <div className="flex flex-wrap gap-2.5">
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
                            style={{ backgroundColor: THEME.ink, color: THEME.ice }}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            {showForm ? 'Batal Tambah' : 'Tambah Dataset'}
                        </button>
                        <button
                            onClick={handleExport}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs border bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
                            style={{ borderColor: THEME.moss, color: THEME.ink }}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* mini KPI Cards - Statistics Row */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                        { label: 'Total Dataset', value: stats.total, color: THEME.green },
                        { label: 'Responden L', value: stats.by_gender?.Male || 0, color: THEME.brown },
                        { label: 'Responden P', value: stats.by_gender?.Female || 0, color: THEME.green },
                        { label: 'Kelompok Usia', value: stats.by_age?.length || 0, color: THEME.brown },
                        { label: 'Tingkat Kebugaran', value: stats.by_fitness?.length || 0, color: THEME.green },
                    ].map((stat, i) => (
                        <div key={i} className="p-4 rounded-2xl border bg-white shadow-xs" style={{ borderColor: THEME.moss }}>
                            <p className="text-[10px] font-mono uppercase tracking-wider opacity-60 mb-0.5">{stat.label}</p>
                            <p className="text-xl font-extrabold" style={{ color: THEME.ink }}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Collapsible Add Form (Manual Entry) */}
                {showForm && (
                    <div className="p-6 rounded-3xl border bg-white animate-fade-in" style={{ borderColor: THEME.moss }}>
                        <div className="mb-4">
                            <h3 className="font-bold text-base" style={{ color: THEME.ink }}>Tambah Dataset Baru</h3>
                            <p className="text-xs opacity-60">Isi profil responden untuk ditambahkan ke dalam database latih.</p>
                        </div>
                        <form onSubmit={handleAddDataset} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                {[
                                    { key: 'gender', label: 'Jenis Kelamin' },
                                    { key: 'age_group', label: 'Rentang Usia' },
                                    { key: 'fitness_level', label: 'Tingkat Kebugaran' },
                                    { key: 'exercise_frequency', label: 'Frekuensi Olahraga' },
                                    { key: 'diet', label: 'Pola Makan Sehat' },
                                ].map(({ key, label }) => (
                                    <div key={key} className="space-y-1.5">
                                        <label className="text-xs font-bold block" style={{ color: THEME.ink }}>{label}</label>
                                        <select
                                            value={formData[key]}
                                            onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-offset-1 transition"
                                            style={{ borderColor: THEME.moss, backgroundColor: THEME.ice, focusRingColor: THEME.green }}>
                                            {OPTIONS[key]?.map(opt => (
                                                <option key={opt.v} value={opt.v}>{opt.l}</option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold block" style={{ color: THEME.ink }}>Olahraga yang Diikuti</label>
                                <textarea
                                    value={formData.sports_participated}
                                    onChange={(e) => setFormData({ ...formData, sports_participated: e.target.value })}
                                    placeholder="Masukkan nama olahraga (pisahkan dengan koma atau titik koma, misal: Running, Yoga, Swimming)"
                                    className="w-full px-4 py-3 rounded-xl border text-xs h-20 focus:outline-none focus:ring-2 focus:ring-offset-1 transition"
                                    style={{ borderColor: THEME.moss, backgroundColor: THEME.ice }}
                                    required
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl font-bold text-xs transition"
                                    style={{ backgroundColor: THEME.green, color: THEME.ice }}>
                                    Simpan Dataset
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-5 py-2.5 rounded-xl font-bold text-xs border transition"
                                    style={{ borderColor: THEME.moss, color: THEME.ink }}>
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Bulk Import CSV Area */}
                <div className="p-6 rounded-3xl border bg-white" style={{ borderColor: THEME.moss }}>
                    <div className="mb-4">
                        <h3 className="font-bold text-base" style={{ color: THEME.ink }}>Bulk Import Dataset</h3>
                        <p className="text-xs opacity-60">Impor data fitness dalam jumlah banyak sekaligus via file CSV.</p>
                    </div>
                    <form onSubmit={handleBulkImport} className="space-y-4">
                        <div className="border-2 border-dashed rounded-2xl p-6 text-center transition hover:bg-[#e0e5d5]/10 flex flex-col items-center justify-center"
                            style={{ borderColor: THEME.moss }}>
                            <svg className="w-10 h-10 mb-3 opacity-60" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ color: THEME.green }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                            </svg>
                            <input
                                id="csv-file-input"
                                type="file"
                                accept=".csv,.txt"
                                onChange={(e) => setUploadFile(e.target.files[0])}
                                className="text-xs font-medium cursor-pointer"
                                style={{ color: THEME.ink }}
                            />
                            <p className="text-[10px] opacity-50 mt-2">Format kolom wajib: Gender, Age Group, Fitness Level, Exercise Frequency, Diet, Sports Participated</p>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={!uploadFile}
                                className="px-5 py-2.5 rounded-xl font-bold text-xs transition disabled:opacity-40 disabled:cursor-not-allowed"
                                style={{ backgroundColor: THEME.green, color: THEME.ice }}>
                                Mulai Upload
                            </button>
                        </div>
                    </form>
                </div>

                {/* Datasets Table & Pagination */}
                <div className="p-6 rounded-3xl border bg-white" style={{ borderColor: THEME.moss }}>
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-base" style={{ color: THEME.ink }}>Data Fitness Responden</h3>
                            <p className="text-xs opacity-60">Menampilkan halaman {datasets.current_page} dari total {datasets.last_page} halaman.</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-xl border" style={{ borderColor: THEME.moss }}>
                        <table className="w-full text-xs">
                            <thead>
                                <tr style={{ backgroundColor: THEME.ink, color: THEME.ice }}>
                                    <th className="text-left px-4 py-3.5 font-bold uppercase tracking-wider text-[10px]">Gender</th>
                                    <th className="text-left px-4 py-3.5 font-bold uppercase tracking-wider text-[10px]">Usia</th>
                                    <th className="text-left px-4 py-3.5 font-bold uppercase tracking-wider text-[10px]">Kebugaran</th>
                                    <th className="text-left px-4 py-3.5 font-bold uppercase tracking-wider text-[10px]">Frekuensi Olahraga</th>
                                    <th className="text-left px-4 py-3.5 font-bold uppercase tracking-wider text-[10px]">Pola Makan</th>
                                    <th className="text-left px-4 py-3.5 font-bold uppercase tracking-wider text-[10px]">Olahraga</th>
                                    <th className="text-center px-4 py-3.5 font-bold uppercase tracking-wider text-[10px]">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {datasets.data?.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-10 font-medium opacity-50">
                                            Basis data responden kosong. Tambahkan data secara manual atau impor CSV.
                                        </td>
                                    </tr>
                                ) : (
                                    datasets.data?.map((row, i) => (
                                        <tr key={row.id} className="transition-all hover:bg-[#e0e5d5]/20"
                                            style={{
                                                backgroundColor: i % 2 === 0 ? THEME.ice : THEME.ice,
                                                borderTop: `1px solid ${THEME.moss}`
                                            }}>
                                            <td className="px-4 py-3.5">
                                                {row.gender === 'Male' ? (
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}>Laki-laki</span>
                                                ) : (
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: '#fce7f3', color: '#be185d' }}>Perempuan</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3.5">{row.age_group}</td>
                                            <td className="px-4 py-3.5 font-medium">{row.fitness_level}</td>
                                            <td className="px-4 py-3.5 opacity-85">{row.exercise_frequency}</td>
                                            <td className="px-4 py-3.5 opacity-85">{row.diet}</td>
                                            <td className="px-4 py-3.5 max-w-xs truncate" title={row.sports_participated}>
                                                {row.sports_participated}
                                            </td>
                                            <td className="px-4 py-3.5 text-center">
                                                <button
                                                    onClick={() => handleDeleteDataset(row.id)}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border font-bold text-[10px] transition-all duration-200 hover:bg-red-50 hover:text-red-700"
                                                    style={{ borderColor: '#fca5a5', color: '#ef4444' }}>
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* SPA Custom Pagination using Inertia Link */}
                    {datasets.links && (
                        <div className="mt-8 flex flex-wrap justify-center items-center gap-1.5">
                            {datasets.links.map((link, i) => {
                                if (!link.url) {
                                    return (
                                        <span
                                            key={i}
                                            className="px-3 py-1.5 rounded-xl text-[10px] font-semibold border opacity-45 cursor-not-allowed select-none"
                                            style={{ borderColor: THEME.moss, color: THEME.ink }}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                }

                                return (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        className="px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all duration-200 hover:-translate-y-0.5"
                                        style={{
                                            borderColor: link.active ? THEME.green : THEME.moss,
                                            backgroundColor: link.active ? THEME.dew : 'white',
                                            color: link.active ? THEME.green : THEME.ink,
                                        }}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
