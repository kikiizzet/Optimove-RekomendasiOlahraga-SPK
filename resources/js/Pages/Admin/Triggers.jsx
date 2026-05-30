import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Triggers({ appTriggers = [], dbTriggers = [], auditLogs = [], sportStats = [] }) {
    const THEME = {
        ink: '#0a1d08',
        ice: '#fbfdf6',
        moss: '#e0e5d5',
        dew: '#d7e8b5',
        green: '#203b14',
        brown: '#4a3212',
    };

    return (
        <AdminLayout activeTab="triggers">
            <div className="space-y-10 animate-fade-in">
                
                {/* Header Title */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5" style={{ borderColor: THEME.moss }}>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight" style={{ color: THEME.ink, letterSpacing: '-0.03em' }}>
                            Sistem Automasi & Audit Trail
                        </h2>
                        <p className="text-xs mt-1" style={{ color: THEME.green, opacity: 0.7 }}>
                            Pusat monitoring kontrol logika bisnis asinkron, sinkronisasi basis data otomatis, dan pelacakan audit transaksi secara real-time.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <span className="text-xs px-3 py-1.5 rounded-full font-bold bg-green-50 text-green-700 border border-green-200">
                            ● Status Basis Data: Aktif
                        </span>
                    </div>
                </div>

                {/* Section 1: App Triggers */}
                <div className="space-y-5">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold tracking-tight" style={{ color: THEME.ink }}>
                            1.Automasi Layanan & Proses Bisnis (Application Hooks)
                        </h3>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-forest-dew text-valley-green border border-stone-moss">
                            Workflow Aktif
                        </span>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {appTriggers.map(trg => (
                            <div 
                                key={trg.id} 
                                className="p-5 bg-white rounded-3xl border flex flex-col justify-between hover:shadow-md transition duration-300"
                                style={{ borderColor: THEME.moss }}
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <span className="w-6 h-6 rounded-full bg-stone-50 text-xs font-mono font-bold flex items-center justify-center border border-stone-200">
                                            0{trg.id}
                                        </span>
                                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#d7e8b5] text-[#203b14] border border-stone-moss uppercase">
                                            SYSTEM-TASK
                                        </span>
                                    </div>
                                    <h4 className="font-extrabold text-sm mb-2" style={{ color: THEME.ink }}>
                                        {trg.name}
                                    </h4>
                                    <div className="space-y-2 mt-3 text-xs leading-relaxed text-stone-600">
                                        <p>
                                            <strong className="text-adaline-ink">Peristiwa (Event):</strong> {trg.event}
                                        </p>
                                        <p>
                                            <strong className="text-adaline-ink font-semibold">Tindakan (Action):</strong> {trg.action}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-[9px] font-mono text-stone-400">
                                    <span>Lokasi: {trg.location}</span>
                                    <span className="text-[#203b14] font-extrabold">● AKTIF</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 2: MySQL Triggers */}
                <div className="space-y-5">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold tracking-tight" style={{ color: THEME.ink }}>
                            2.Trigger Database & Konsistensi Data (Native DB Triggers)
                        </h3>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                            Keamanan & Integritas
                        </span>
                    </div>

                    <div className="overflow-hidden bg-white border rounded-2xl shadow-xs" style={{ borderColor: THEME.moss }}>
                        <table className="w-full text-xs">
                            <thead>
                                <tr style={{ backgroundColor: THEME.ink, color: THEME.ice }}>
                                    {['Nama Trigger', 'Event & Target Tabel', 'Deskripsi / Logika SQL', 'Status'].map(h => (
                                        <th key={h} className="text-left px-5 py-4 font-bold uppercase tracking-wider text-[10px]">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {dbTriggers.map((trg, i) => (
                                    <tr 
                                        key={trg.name} 
                                        className="transition-all hover:bg-stone-50/50"
                                        style={{ borderTop: `1px solid ${THEME.moss}` }}
                                    >
                                        <td className="px-5 py-4 font-mono font-bold text-adaline-ink text-xs">
                                            {trg.name}
                                        </td>
                                        <td className="px-5 py-4 font-mono text-stone-500">
                                            {trg.event}
                                        </td>
                                        <td className="px-5 py-4 text-stone-600 max-w-sm leading-relaxed">
                                            {trg.purpose}
                                        </td>
                                        <td className="px-5 py-4">
                                            {trg.active ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#d7e8b5] text-[#203b14] border border-stone-moss">
                                                    <span className="w-1.5 h-1.5 bg-[#203b14] rounded-full animate-ping" />
                                                    AKTIF
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                                                    TIDAK AKTIF
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}
