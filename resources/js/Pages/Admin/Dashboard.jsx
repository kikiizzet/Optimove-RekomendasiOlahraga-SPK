import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#203b14', '#4a3212', '#e0e5d5', '#d7e8b5', '#c5ccb6'];

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

    return (
        <div style={{ backgroundColor: THEME.ice, minHeight: '100vh' }}>
            {/* Header */}
            <div style={{ backgroundColor: THEME.ink, color: THEME.ice, padding: '2rem' }}>
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
                            <p style={{ opacity: 0.7 }}>Sistem Pendukung Keputusan - Optimove</p>
                        </div>
                        <div style={{ fontSize: '2rem' }}>📊</div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-10">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {[
                        { label: 'Total Users', value: stats.total_users, icon: '👥', color: THEME.green },
                        { label: 'Total Admin', value: stats.total_admins, icon: '🔐', color: THEME.brown },
                        { label: 'Dataset Entries', value: stats.total_datasets, icon: '📋', color: THEME.green },
                        { label: 'Total Recommendations', value: stats.total_recommendations, icon: '🏆', color: THEME.brown },
                    ].map((stat, i) => (
                        <div key={i} className="p-6 rounded-2xl border" style={{ backgroundColor: THEME.ice, borderColor: THEME.moss }}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p style={{ color: THEME.green, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                        {stat.label}
                                    </p>
                                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: THEME.ink }}>
                                        {stat.value}
                                    </p>
                                </div>
                                <div style={{ fontSize: '2.5rem' }}>{stat.icon}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                    {/* Top Sports Chart */}
                    <div className="p-6 rounded-2xl border" style={{ backgroundColor: THEME.ice, borderColor: THEME.moss }}>
                        <h2 className="text-xl font-bold mb-4" style={{ color: THEME.ink }}>Top 10 Olahraga yang Direkomendasikan</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={topSportsData}>
                                <CartesianGrid strokeDasharray="3 3" stroke={THEME.moss} />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: THEME.ice, border: `1px solid ${THEME.moss}` }}
                                    labelStyle={{ color: THEME.ink }}
                                />
                                <Bar dataKey="count" fill={THEME.green} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Age Distribution */}
                    <div className="p-6 rounded-2xl border" style={{ backgroundColor: THEME.ice, borderColor: THEME.moss }}>
                        <h2 className="text-xl font-bold mb-4" style={{ color: THEME.ink }}>Distribusi Usia Dataset</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={ageData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ age, count }) => `${age}: ${count}`}
                                    outerRadius={80}
                                    fill={THEME.green}
                                    dataKey="count"
                                >
                                    {ageData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Fitness Level Distribution */}
                <div className="p-6 rounded-2xl border mb-10" style={{ backgroundColor: THEME.ice, borderColor: THEME.moss }}>
                    <h2 className="text-xl font-bold mb-4" style={{ color: THEME.ink }}>Distribusi Tingkat Kebugaran Dataset</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={fitnessData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke={THEME.moss} />
                            <XAxis type="number" />
                            <YAxis dataKey="level" type="category" width={150} tick={{ fontSize: 12 }} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: THEME.ice, border: `1px solid ${THEME.moss}` }}
                                labelStyle={{ color: THEME.ink }}
                            />
                            <Bar dataKey="count" fill={THEME.brown} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Recent Recommendations Table */}
                <div className="p-6 rounded-2xl border" style={{ backgroundColor: THEME.ice, borderColor: THEME.moss }}>
                    <h2 className="text-xl font-bold mb-4" style={{ color: THEME.ink }}>20 Rekomendasi Terakhir</h2>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ backgroundColor: THEME.ink, color: THEME.ice }}>
                                    {['Waktu', 'Usia', 'Gender', 'Kebugaran', 'Frekuensi', 'Diet', 'Rekomendasi', 'Skor'].map(h => (
                                        <th key={h} className="text-left px-4 py-3 font-bold">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {recentRecommendations.map((r, i) => (
                                    <tr key={r.id} style={{ 
                                        backgroundColor: i % 2 === 0 ? THEME.ice : THEME.dew,
                                        borderTop: `1px solid ${THEME.moss}`
                                    }}>
                                        <td className="px-4 py-3 text-xs font-mono" style={{ opacity: 0.6 }}>
                                            {new Date(r.created_at).toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-4 py-3 text-xs">{r.age_group}</td>
                                        <td className="px-4 py-3 text-xs">{r.gender === 'Male' ? 'L' : 'P'}</td>
                                        <td className="px-4 py-3 text-xs">{r.fitness_level}</td>
                                        <td className="px-4 py-3 text-xs">{r.exercise_frequency}</td>
                                        <td className="px-4 py-3 text-xs">{r.diet}</td>
                                        <td className="px-4 py-3 text-xs font-bold" style={{ color: THEME.green }}>
                                            {r.top_recommendation}
                                        </td>
                                        <td className="px-4 py-3 text-xs font-mono font-bold" style={{ color: THEME.green }}>
                                            {r.top_score}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
