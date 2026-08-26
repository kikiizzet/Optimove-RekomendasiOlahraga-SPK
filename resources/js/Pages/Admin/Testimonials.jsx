import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { router } from '@inertiajs/react';

export default function Testimonials({ testimonials = [] }) {
    const THEME = {
        ink: '#0a1d08',
        ice: '#fbfdf6',
        moss: '#e0e5d5',
        dew: '#d7e8b5',
        green: '#203b14',
        brown: '#4a3212',
    };

    const [filter, setFilter] = useState('all'); // all, pending, published

    const filteredTestimonials = testimonials.filter(item => {
        if (filter === 'pending') return !item.is_published;
        if (filter === 'published') return item.is_published;
        return true;
    });

    const handleApprove = (id) => {
        if (confirm('Apakah Anda yakin ingin menyetujui testimoni ini?')) {
            router.patch(route('admin.testimonials.approve', id), {}, {
                preserveScroll: true,
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus/menolak testimoni ini?')) {
            router.delete(route('admin.testimonials.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout activeTab="testimonials">
            <div className="space-y-8">
                {/* Header Title */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5" style={{ borderColor: THEME.moss }}>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight" style={{ color: THEME.ink, letterSpacing: '-0.03em' }}>Manajemen Testimoni</h2>
                        <p className="text-xs mt-1" style={{ color: THEME.green, opacity: 0.7 }}>Tinjau, setujui, atau tolak testimoni yang dikirimkan oleh pengguna.</p>
                    </div>
                </div>

                {/* Filter Sub-Tabs */}
                <div className="flex gap-4 border-b border-stone-200 pb-1">
                    {[
                        { id: 'all', label: 'Semua', count: testimonials.length },
                        { id: 'pending', label: 'Menunggu Persetujuan', count: testimonials.filter(t => !t.is_published).length },
                        { id: 'published', label: 'Diterbitkan', count: testimonials.filter(t => t.is_published).length },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setFilter(tab.id)}
                            className={`pb-2.5 px-1 font-bold text-xs transition-all border-b-2 outline-none cursor-pointer flex items-center gap-1.5 ${
                                filter === tab.id
                                    ? 'border-valley-green text-valley-green scale-102'
                                    : 'border-transparent text-stone-400 hover:text-stone-600'
                            }`}
                        >
                            <span>{tab.label}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                                filter === tab.id
                                    ? 'bg-forest-dew text-valley-green'
                                    : 'bg-stone-100 text-stone-500'
                            }`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Testimonials Tables */}
                <div className="bg-white border rounded-3xl overflow-hidden shadow-xs" style={{ borderColor: THEME.moss }}>
                    {filteredTestimonials.length === 0 ? (
                        <div className="text-center py-16 flex flex-col items-center justify-center">
                            <span className="text-3xl mb-3">💬</span>
                            <h4 className="font-bold text-sm text-adaline-ink">Tidak ada testimoni</h4>
                            <p className="text-xs text-stone-400 max-w-xs mt-1 leading-normal">
                                Tidak ada testimoni yang ditemukan untuk kriteria filter ini.
                            </p>
                        </div>
                        //ssapa
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead>
                                    <tr style={{ backgroundColor: THEME.green, color: THEME.ice }}>
                                        <th className="px-5 py-4 w-12 text-center font-bold uppercase tracking-wider text-[10px]">ID</th>
                                        <th className="px-5 py-4 w-52 font-bold uppercase tracking-wider text-[10px]">Pengguna</th>
                                        <th className="px-5 py-4 w-28 font-bold uppercase tracking-wider text-[10px]">Rating</th>
                                        <th className="px-5 py-4 font-bold uppercase tracking-wider text-[10px]">Isi Testimoni</th>
                                        <th className="px-5 py-4 w-32 font-bold uppercase tracking-wider text-[10px]">Tanggal Kirim</th>
                                        <th className="px-5 py-4 w-32 font-bold uppercase tracking-wider text-[10px]">Status</th>
                                        <th className="px-5 py-4 w-40 text-right font-bold uppercase tracking-wider text-[10px]">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100">
                                    {filteredTestimonials.map((item, idx) => (
                                        <tr key={item.id} className="hover:bg-stone-50/50 transition">
                                            <td className="px-5 py-4 text-center font-mono text-stone-400">{item.id}</td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        className="w-8 h-8 rounded-full object-cover border border-stone-200"
                                                        src={item.user?.profile_photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.user?.name || 'User')}&color=166534&background=f0fdf4`}
                                                        alt={item.user?.name}
                                                    />
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-adaline-ink leading-none truncate">{item.user?.name || 'Pengguna'}</p>
                                                        <p className="text-[10px] text-stone-400 leading-none mt-1 truncate">{item.user?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex gap-0.5 text-amber-500 font-bold text-xs">
                                                    {Array.from({ length: item.rating }).map((_, i) => '★')}
                                                    {Array.from({ length: 5 - item.rating }).map((_, i) => '☆')}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-stone-600 font-medium leading-relaxed italic">
                                                "{item.content}"
                                            </td>
                                            <td className="px-5 py-4 font-mono text-stone-400">
                                                {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                                                    item.is_published
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                        : 'bg-amber-50 text-amber-800 border-amber-200'
                                                }`}>
                                                    {item.is_published ? 'Diterbitkan' : 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {!item.is_published && (
                                                        <button
                                                            onClick={() => handleApprove(item.id)}
                                                            className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition shadow-3xs"
                                                        >
                                                            Setujui
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="py-1.5 px-3 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 bg-white font-bold text-[10px] transition shadow-3xs"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
