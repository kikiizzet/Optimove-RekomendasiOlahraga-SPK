import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#203b14', '#4a3212', '#a3b18a', '#588157', '#344e41'];

export default function Dashboard({ stats = {}, topSports = [], recentRecommendations = [], datasetStats = {} }) {
    const THEME = {
        ink: '#0a1d08',
        ice: '#fbfdf6',
        moss: '#e0e5d5',
        dew: '#d7e8b5',
        green: '#203b14',
        brown: '#4a3212',
    };

    // Format data untuk chart
    const topSportsData = topSports.map(item => ({
        name: item.top_recommendation || 'Unknown',
        count: item.count,
    }));

    const ageData = datasetStats.by_age?.map(item => ({
        age: item.age_group,
        count: item.count,
    })) || [];

    const fitnessData = datasetStats.by_fitness?.map(item => ({
        level: item.fitness_level,
        count: item.count,
    })) || [];

    const totalAgeCount = ageData.reduce((sum, item) => sum + item.count, 0) || 1;

    // Component untuk Empty State Chart
    const EmptyState = ({ title, message }) => (
        <div className="flex flex-col items-center justify-center text-center py-12 px-6 rounded-2xl border border-dashed"
            style={{ borderColor: THEME.moss, minHeight: '260px' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-110" 
                style={{ backgroundColor: THEME.dew }}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ color: THEME.green }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <h4 className="font-bold text-sm mb-1" style={{ color: THEME.ink }}>{title}</h4>
            <p className="text-xs max-w-xs leading-relaxed" style={{ color: THEME.ink, opacity: 0.5 }}>{message}</p>
        </div>
    );

    return (
        <AdminLayout activeTab="dashboard">
            <div className="space-y-8">
                {/* Header Title */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5" style={{ borderColor: THEME.moss }}>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight" style={{ color: THEME.ink, letterSpacing: '-0.03em' }}>Dashboard Overview</h2>
                        <p className="text-xs mt-1" style={{ color: THEME.green, opacity: 0.7 }}>Pantau performa sistem rekomendasi dan statistik dataset terkini.</p>
                    </div>
                    <div className="text-xs font-mono px-3 py-1.5 rounded-full border bg-white" style={{ borderColor: THEME.moss, color: THEME.green }}>
                        📍 Mode: SPK Administrator
                    </div>
                </div>

                {/* KPI Cards - Matching Guest Design */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Pengguna', value: stats.total_users, icon: (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        ), bgAccent: THEME.dew, iconColor: THEME.green },
                        { label: 'Total Admin', value: stats.total_admins, icon: (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        ), bgAccent: THEME.moss, iconColor: THEME.brown },
                        { label: 'Entri Dataset', value: stats.total_datasets, icon: (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        ), bgAccent: THEME.dew, iconColor: THEME.green },
                        { label: 'Rekomendasi Diproses', value: stats.total_recommendations, icon: (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        ), bgAccent: THEME.moss, iconColor: THEME.brown },
                    ].map((stat, i) => (
                        <div key={i} className="p-6 rounded-2xl border transition-all duration-300 bg-white flex items-center justify-between hover:shadow-sm"
                            style={{ borderColor: THEME.moss }}>
                            <div>
                                <p className="text-[10px] font-mono uppercase tracking-wider mb-1" style={{ color: THEME.green, opacity: 0.8 }}>
                                    {stat.label}
                                </p>
                                <p className="text-2xl font-extrabold tracking-tight" style={{ color: THEME.ink }}>
                                    {stat.value}
                                </p>
                            </div>
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 hover:rotate-12"
                                style={{ backgroundColor: stat.bgAccent, color: stat.iconColor }}>
                                {stat.icon}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Grid Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Top 10 Sports Chart (Recommends) */}
                    <div className="p-6 rounded-2xl border bg-white" style={{ borderColor: THEME.moss }}>
                        <div className="mb-6">
                            <h3 className="font-bold text-base" style={{ color: THEME.ink, letterSpacing: '-0.02em' }}>Top Olahraga yang Direkomendasikan</h3>
                            <p className="text-xs opacity-60 mt-0.5">Berdasarkan frekuensi rekomendasi utama hasil pengolahan SAW.</p>
                        </div>
                        
                        {topSportsData.length === 0 ? (
                            <EmptyState 
                                title="Data Rekomendasi Kosong" 
                                message="Belum ada aktivitas analisis dari pengguna di halaman utama. Riwayat olahraga yang direkomendasikan akan muncul di sini setelah dicoba."
                            />
                        ) : (
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={topSportsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={THEME.moss} opacity={0.5} />
                                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: THEME.ink }} />
                                    <YAxis tick={{ fontSize: 10, fill: THEME.ink }} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: THEME.ice, border: `1px solid ${THEME.moss}`, borderRadius: '12px' }}
                                        labelStyle={{ color: THEME.ink, fontWeight: 'bold' }}
                                    />
                                    <Bar dataKey="count" fill={THEME.green} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Donut Chart (Age Distribution) - Fixed Overlaps & Premium Side Legend */}
                    <div className="p-6 rounded-2xl border bg-white flex flex-col justify-between" style={{ borderColor: THEME.moss }}>
                        <div>
                            <h3 className="font-bold text-base" style={{ color: THEME.ink, letterSpacing: '-0.02em' }}>Distribusi Usia Dataset</h3>
                            <p className="text-xs opacity-60 mt-0.5">Proporsi kelompok usia responden dalam basis dataset.</p>
                        </div>
                        
                        {ageData.length === 0 ? (
                            <EmptyState 
                                title="Data Distribusi Kosong" 
                                message="Data usia tidak ditemukan dalam dataset saat ini."
                            />
                        ) : (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-4">
                                {/* Donut Chart */}
                                <div className="w-full sm:w-1/2 flex justify-center">
                                    <ResponsiveContainer width="100%" height={200}>
                                        <PieChart>
                                            <Pie
                                                data={ageData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={85}
                                                paddingAngle={3}
                                                dataKey="count"
                                            >
                                                {ageData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => [`${value} responden`, 'Jumlah']} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Custom Legenda di Samping */}
                                <div className="w-full sm:w-1/2 space-y-2">
                                    {ageData.map((item, index) => {
                                        const pct = ((item.count / totalAgeCount) * 100).toFixed(1);
                                        return (
                                            <div key={item.age} className="flex items-center justify-between text-xs p-2 rounded-xl transition hover:bg-[#e0e5d5]/30">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                                    <span className="font-medium truncate" style={{ color: THEME.ink }}>{item.age} tahun</span>
                                                </div>
                                                <div className="text-right font-mono font-bold">
                                                    <span style={{ color: THEME.green }}>{item.count}</span>
                                                    <span className="text-[10px] ml-1.5 opacity-55">({pct}%)</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Fitness Level Distribution Chart (Horizontal) */}
                <div className="p-6 rounded-2xl border bg-white" style={{ borderColor: THEME.moss }}>
                    <div className="mb-6">
                        <h3 className="font-bold text-base" style={{ color: THEME.ink, letterSpacing: '-0.02em' }}>Distribusi Tingkat Kebugaran Dataset</h3>
                        <p className="text-xs opacity-60 mt-0.5">Proporsi tingkat kebugaran responden dalam basis dataset.</p>
                    </div>

                    {fitnessData.length === 0 ? (
                        <EmptyState 
                            title="Data Tingkat Kebugaran Kosong" 
                            message="Tidak ada data tingkat kebugaran dalam basis dataset saat ini."
                        />
                    ) : (
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={fitnessData} layout="vertical" margin={{ top: 10, right: 10, left: 15, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={THEME.moss} opacity={0.5} />
                                <XAxis type="number" tick={{ fontSize: 10, fill: THEME.ink }} />
                                <YAxis dataKey="level" type="category" width={80} tick={{ fontSize: 10, fill: THEME.ink }} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: THEME.ice, border: `1px solid ${THEME.moss}`, borderRadius: '12px' }}
                                    labelStyle={{ color: THEME.ink, fontWeight: 'bold' }}
                                />
                                <Bar dataKey="count" fill={THEME.brown} radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Recent Recommendations Table - Redesigned with Empty State & Hover highlight */}
                <div className="p-6 rounded-2xl border bg-white" style={{ borderColor: THEME.moss }}>
                    <div className="mb-6">
                        <h3 className="font-bold text-base" style={{ color: THEME.ink, letterSpacing: '-0.02em' }}>20 Rekomendasi Terakhir</h3>
                        <p className="text-xs opacity-60 mt-0.5">Riwayat kalkulasi SPK SAW yang dilakukan oleh pengguna.</p>
                    </div>

                    {recentRecommendations.length === 0 ? (
                        <EmptyState 
                            title="Belum Ada Riwayat Rekomendasi" 
                            message="Basis data riwayat rekomendasi Anda masih kosong. Silakan masuk ke halaman utama web, isi form profil, dan tekan tombol analisis untuk mengisi data di sini."
                        />
                    ) : (
                        <div className="overflow-x-auto rounded-xl border animate-fade-in" style={{ borderColor: THEME.moss }}>
                            <table className="w-full text-xs">
                                <thead>
                                    <tr style={{ backgroundColor: THEME.ink, color: THEME.ice }}>
                                        {['Waktu', 'Usia', 'Gender', 'Kebugaran', 'Frekuensi', 'Diet', 'Rekomendasi Utama', 'Skor Akhir'].map(h => (
                                            <th key={h} className="text-left px-4 py-3.5 font-bold uppercase tracking-wider text-[10px]">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentRecommendations.map((r, i) => (
                                        <tr key={r.id} className="transition-all hover:bg-[#e0e5d5]/20"
                                            style={{ 
                                                backgroundColor: i % 2 === 0 ? THEME.ice : THEME.ice,
                                                borderTop: `1px solid ${THEME.moss}`
                                            }}>
                                            <td className="px-4 py-3.5 font-mono opacity-65">
                                                {new Date(r.created_at).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="px-4 py-3.5">{r.age_group}</td>
                                            <td className="px-4 py-3.5">
                                                {r.gender === 'Male' ? (
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}>Laki-laki</span>
                                                ) : (
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: '#fce7f3', color: '#be185d' }}>Perempuan</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3.5 font-medium">{r.fitness_level}</td>
                                            <td className="px-4 py-3.5 opacity-85">{r.exercise_frequency}</td>
                                            <td className="px-4 py-3.5 opacity-85">{r.diet}</td>
                                            <td className="px-4 py-3.5 font-bold text-sm" style={{ color: THEME.green }}>
                                                {r.top_recommendation}
                                            </td>
                                            <td className="px-4 py-3.5 font-mono font-bold text-sm" style={{ color: THEME.green }}>
                                                {r.top_score}%
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
