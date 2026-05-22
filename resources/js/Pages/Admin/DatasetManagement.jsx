import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';

export default function DatasetManagement({ datasets = {}, stats = {} }) {
    const { errors } = usePage().props;
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        gender: 'Male',
        age_group: '15 to 18',
        fitness_level: 'Average',
        exercise_frequency: 'Never',
        diet: 'No',
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
                    age_group: '15 to 18',
                    fitness_level: 'Average',
                    exercise_frequency: 'Never',
                    diet: 'No',
                    sports_participated: '',
                });
                setShowForm(false);
            },
        });
    };

    const handleUpdateDataset = (dataset) => {
        router.patch(route('admin.datasets.update', dataset.id), editData, {
            onSuccess: () => {
                setEditingId(null);
                setEditData({});
            },
        });
    };

    const handleDeleteDataset = (id) => {
        if (confirm('Yakin ingin menghapus data ini?')) {
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
                alert('Bulk import berhasil!');
            },
        });
    };

    const handleExport = () => {
        window.location.href = route('admin.datasets.export');
    };

    return (
        <div style={{ backgroundColor: THEME.ice, minHeight: '100vh' }}>
            {/* Header */}
            <div style={{ backgroundColor: THEME.ink, color: THEME.ice, padding: '2rem' }}>
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold mb-2">Dataset Management</h1>
                    <p style={{ opacity: 0.7 }}>Kelola data fitness untuk sistem rekomendasi</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-10">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <div className="p-4 rounded-xl border" style={{ backgroundColor: THEME.ice, borderColor: THEME.moss }}>
                        <p style={{ color: THEME.green, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Total Dataset</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: THEME.ink }}>{stats.total}</p>
                    </div>
                    <div className="p-4 rounded-xl border" style={{ backgroundColor: THEME.ice, borderColor: THEME.moss }}>
                        <p style={{ color: THEME.green, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Laki-laki</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: THEME.ink }}>{stats.by_gender?.Male || 0}</p>
                    </div>
                    <div className="p-4 rounded-xl border" style={{ backgroundColor: THEME.ice, borderColor: THEME.moss }}>
                        <p style={{ color: THEME.green, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Perempuan</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: THEME.ink }}>{stats.by_gender?.Female || 0}</p>
                    </div>
                    <div className="p-4 rounded-xl border" style={{ backgroundColor: THEME.ice, borderColor: THEME.moss }}>
                        <p style={{ color: THEME.green, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Age Groups</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: THEME.ink }}>{stats.by_age?.length || 0}</p>
                    </div>
                    <div className="p-4 rounded-xl border" style={{ backgroundColor: THEME.ice, borderColor: THEME.moss }}>
                        <p style={{ color: THEME.green, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Fitness Levels</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: THEME.ink }}>{stats.by_fitness?.length || 0}</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mb-8">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-6 py-2 rounded-xl font-bold text-sm"
                        style={{ backgroundColor: THEME.brown, color: THEME.ice }}
                    >
                        + Tambah Dataset
                    </button>
                    <button
                        onClick={handleExport}
                        className="px-6 py-2 rounded-xl font-bold text-sm border"
                        style={{ borderColor: THEME.moss, color: THEME.ink }}
                    >
                        📥 Export CSV
                    </button>
                </div>

                {/* Bulk Import Form */}
                <div className="p-6 rounded-2xl border mb-8" style={{ backgroundColor: THEME.dew, borderColor: THEME.moss }}>
                    <h2 className="text-lg font-bold mb-4" style={{ color: THEME.ink }}>Bulk Import CSV</h2>
                    <form onSubmit={handleBulkImport} className="flex gap-3">
                        <input
                            type="file"
                            accept=".csv,.txt"
                            onChange={(e) => setUploadFile(e.target.files[0])}
                            className="flex-1 px-4 py-2 rounded-xl border"
                            style={{ borderColor: THEME.moss }}
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 rounded-xl font-bold text-sm"
                            style={{ backgroundColor: THEME.green, color: THEME.ice }}
                        >
                            Upload
                        </button>
                    </form>
                    <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', opacity: 0.6 }}>
                        Format: Gender, Age Group, Fitness Level, Exercise Frequency, Diet, Sports Participated
                    </p>
                </div>

                {/* Add Form */}
                {showForm && (
                    <div className="p-6 rounded-2xl border mb-8" style={{ backgroundColor: THEME.ice, borderColor: THEME.moss }}>
                        <h2 className="text-lg font-bold mb-4" style={{ color: THEME.ink }}>Tambah Dataset Baru</h2>
                        <form onSubmit={handleAddDataset} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { key: 'gender', label: 'Jenis Kelamin' },
                                    { key: 'age_group', label: 'Rentang Usia' },
                                    { key: 'fitness_level', label: 'Tingkat Kebugaran' },
                                    { key: 'exercise_frequency', label: 'Frekuensi Olahraga' },
                                ].map(({ key, label }) => (
                                    <div key={key}>
                                        <label className="text-sm font-bold block mb-1">{label}</label>
                                        <select
                                            value={formData[key]}
                                            onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border"
                                            style={{ borderColor: THEME.moss }}
                                        >
                                            {OPTIONS[key]?.map(opt => (
                                                <option key={opt.v} value={opt.v}>{opt.l}</option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                                <div>
                                    <label className="text-sm font-bold block mb-1">Pola Makan</label>
                                    <select
                                        value={formData.diet}
                                        onChange={(e) => setFormData({ ...formData, diet: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border"
                                        style={{ borderColor: THEME.moss }}
                                    >
                                        {OPTIONS.diet.map(opt => (
                                            <option key={opt.v} value={opt.v}>{opt.l}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-bold block mb-1">Olahraga yang Diikuti</label>
                                <textarea
                                    value={formData.sports_participated}
                                    onChange={(e) => setFormData({ ...formData, sports_participated: e.target.value })}
                                    placeholder="Pisahkan dengan koma atau semicolon (misal: Running, Yoga; Swimming)"
                                    className="w-full px-4 py-2 rounded-xl border h-20"
                                    style={{ borderColor: THEME.moss }}
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded-xl font-bold text-sm"
                                    style={{ backgroundColor: THEME.green, color: THEME.ice }}
                                >
                                    Simpan Dataset
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-6 py-2 rounded-xl font-bold text-sm border"
                                    style={{ borderColor: THEME.moss, color: THEME.ink }}
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Datasets Table */}
                <div className="p-6 rounded-2xl border" style={{ backgroundColor: THEME.ice, borderColor: THEME.moss }}>
                    <h2 className="text-lg font-bold mb-4" style={{ color: THEME.ink }}>Data Fitness (Page {datasets.current_page || 1})</h2>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ backgroundColor: THEME.ink, color: THEME.ice }}>
                                    <th className="text-left px-4 py-3 font-bold">Gender</th>
                                    <th className="text-left px-4 py-3 font-bold">Age</th>
                                    <th className="text-left px-4 py-3 font-bold">Fitness</th>
                                    <th className="text-left px-4 py-3 font-bold">Frequency</th>
                                    <th className="text-left px-4 py-3 font-bold">Diet</th>
                                    <th className="text-left px-4 py-3 font-bold">Sports</th>
                                    <th className="text-left px-4 py-3 font-bold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {datasets.data?.map((row, i) => (
                                    <tr key={row.id} style={{
                                        backgroundColor: i % 2 === 0 ? THEME.ice : THEME.dew,
                                        borderTop: `1px solid ${THEME.moss}`
                                    }}>
                                        <td className="px-4 py-3 text-xs">{row.gender}</td>
                                        <td className="px-4 py-3 text-xs">{row.age_group}</td>
                                        <td className="px-4 py-3 text-xs">{row.fitness_level}</td>
                                        <td className="px-4 py-3 text-xs">{row.exercise_frequency}</td>
                                        <td className="px-4 py-3 text-xs">{row.diet}</td>
                                        <td className="px-4 py-3 text-xs truncate" title={row.sports_participated}>
                                            {row.sports_participated?.substring(0, 30)}...
                                        </td>
                                        <td className="px-4 py-3 text-xs flex gap-2">
                                            <button
                                                onClick={() => handleDeleteDataset(row.id)}
                                                className="px-3 py-1 rounded-lg border font-bold"
                                                style={{ borderColor: '#ef4444', color: '#ef4444' }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {datasets.links && (
                        <div className="mt-6 flex justify-center gap-2">
                            {datasets.links.map((link, i) => (
                                <a
                                    key={i}
                                    href={link.url}
                                    className={`px-3 py-1 rounded-lg border font-bold text-sm ${
                                        link.active
                                            ? 'bg-green-600 text-white border-green-600'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
