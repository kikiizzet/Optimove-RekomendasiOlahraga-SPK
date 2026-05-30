import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function AdminLayout({ children, activeTab = 'dashboard' }) {
    const user = usePage().props.auth.user;
    const [showingMobileMenu, setShowingMobileMenu] = useState(false);

    const THEME = {
        ink: '#0a1d08',
        ice: '#fbfdf6',
        moss: '#e0e5d5',
        dew: '#d7e8b5',
        green: '#203b14',
        brown: '#4a3212',
    };

    return (
        <div className="h-screen flex flex-col md:flex-row font-sans overflow-hidden" style={{ backgroundColor: THEME.ice, color: THEME.ink }}>
            
            {/* MOBILE TOP HEADER */}
            <header className="md:hidden flex items-center justify-between px-6 py-4 border-b z-50 sticky top-0 backdrop-blur-md bg-opacity-90" 
                style={{ backgroundColor: THEME.ice, borderColor: THEME.moss }}>
                <div className="flex items-center gap-2">
                    <span className="font-bold text-lg tracking-tight" style={{ letterSpacing: '-0.04em', color: THEME.ink }}>Optimove</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold" style={{ backgroundColor: THEME.dew, color: THEME.green }}>ADMIN</span>
                </div>
                <button onClick={() => setShowingMobileMenu(!showingMobileMenu)} className="p-1 focus:outline-none" style={{ color: THEME.ink }}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        {showingMobileMenu ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </header>

            {/* MOBILE DROPDOWN MENU */}
            {showingMobileMenu && (
                <div className="md:hidden fixed inset-x-0 top-[57px] z-40 border-b flex flex-col p-4 space-y-2 shadow-lg backdrop-blur-md bg-opacity-95" 
                    style={{ backgroundColor: THEME.ice, borderColor: THEME.moss }}>
                    <Link href={route('admin.dashboard')} onClick={() => setShowingMobileMenu(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                            activeTab === 'dashboard' 
                            ? 'bg-[#d7e8b5] text-[#203b14]' 
                            : 'hover:bg-[#e0e5d5]/30'
                        }`}>
                        Dashboard Overview
                    </Link>
                    <Link href={route('admin.datasets.index')} onClick={() => setShowingMobileMenu(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                            activeTab === 'datasets' 
                            ? 'bg-[#d7e8b5] text-[#203b14]' 
                            : 'hover:bg-[#e0e5d5]/30'
                        }`}>
                        Dataset Management
                    </Link>
                    <Link href={route('admin.triggers.index')} onClick={() => setShowingMobileMenu(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                            activeTab === 'triggers' 
                            ? 'bg-[#d7e8b5] text-[#203b14]' 
                            : 'hover:bg-[#e0e5d5]/30'
                        }`}>
                        Automasi & Log Audit
                    </Link>
                    <div className="border-t my-2" style={{ borderColor: THEME.moss }} />
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold hover:bg-[#e0e5d5]/30" style={{ color: THEME.green }}>
                        Kembali ke Beranda
                    </Link>
                    <Link href={route('logout')} method="post" as="button" className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50">
                        Keluar (Logout)
                    </Link>
                </div>
            )}

            {/* DESKTOP SIDEBAR - MATCHING GUEST NAV BAR */}
            <aside className="hidden md:flex flex-col w-72 shrink-0 border-r h-screen sticky top-0" 
                style={{ backgroundColor: THEME.ice, borderColor: THEME.moss }}>
                
                {/* Brand Area */}
                <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: THEME.moss }}>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-2xl tracking-tighter" style={{ letterSpacing: '-0.04em', color: THEME.ink }}>Optimove</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold" style={{ backgroundColor: THEME.dew, color: THEME.green }}>ADMIN</span>
                        </div>
                        <p className="text-[10px] uppercase tracking-widest font-mono" style={{ color: 'var(--color-mist-gray)', opacity: 0.8 }}>Sistem Pendukung Keputusan</p>
                    </div>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 p-6 space-y-2">
                    <Link href={route('admin.dashboard')}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group hover:-translate-y-0.5 ${
                            activeTab === 'dashboard' 
                            ? 'bg-[#d7e8b5] shadow-sm translate-x-1' 
                            : 'hover:bg-[#e0e5d5]/30'
                        }`}
                        style={{ color: activeTab === 'dashboard' ? THEME.green : THEME.ink }}>
                        <svg className="w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Dashboard Overview
                    </Link>

                    <Link href={route('admin.datasets.index')}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group hover:-translate-y-0.5 ${
                            activeTab === 'datasets' 
                            ? 'bg-[#d7e8b5] shadow-sm translate-x-1' 
                            : 'hover:bg-[#e0e5d5]/30'
                        }`}
                        style={{ color: activeTab === 'datasets' ? THEME.green : THEME.ink }}>
                        <svg className="w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                        </svg>
                        Dataset Management
                    </Link>

                    <Link href={route('admin.triggers.index')}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group hover:-translate-y-0.5 ${
                            activeTab === 'triggers' 
                            ? 'bg-[#d7e8b5] shadow-sm translate-x-1' 
                            : 'hover:bg-[#e0e5d5]/30'
                        }`}
                        style={{ color: activeTab === 'triggers' ? THEME.green : THEME.ink }}>
                        <svg className="w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Automasi & Log Audit
                    </Link>
                </nav>

                {/* Profile & Footer Actions */}
                <div className="p-6 border-t space-y-4" style={{ borderColor: THEME.moss }}>
                    
                    {/* Active Profile Info */}
                    <div className="flex items-center gap-3 p-3 rounded-2xl border" style={{ backgroundColor: THEME.ice, borderColor: THEME.moss }}>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm select-none" 
                            style={{ backgroundColor: THEME.dew, color: THEME.green }}>
                            {user.name ? user.name.substring(0, 2).toUpperCase() : 'AD'}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold truncate leading-tight" style={{ color: THEME.ink }}>{user.name}</p>
                            <p className="text-[10px] truncate leading-tight mt-1" style={{ color: THEME.green, opacity: 0.7 }}>{user.email}</p>
                        </div>
                    </div>

                    {/* Footer Nav Links */}
                    <div className="space-y-1">
                        <Link href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition hover:bg-[#e0e5d5]/30"
                            style={{ color: THEME.green }}>
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Kembali ke Beranda
                        </Link>
                        
                        <Link href={route('logout')} method="post" as="button" className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition text-left">
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </Link>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 min-w-0 overflow-y-auto h-full px-6 md:px-10 py-8" style={{ backgroundColor: THEME.ice }}>
                {children}
            </main>
        </div>
    );
}
