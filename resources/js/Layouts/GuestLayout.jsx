import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

const THEME = {
    ink: '#0a1d08',
    ice: '#fbfdf6',
    moss: '#e0e5d5',
    dew: '#d7e8b5',
    green: '#203b14',
    brown: '#4a3212',
};

export default function GuestLayout({ children, title = '' }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative" style={{ backgroundColor: THEME.ice }}>
            {/* Decorative gradient */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 rounded-full" 
                    style={{ background: `radial-gradient(circle, ${THEME.dew} 0%, transparent 70%)`, opacity: 0.4 }} />
                <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full" 
                    style={{ background: `radial-gradient(circle, ${THEME.moss} 0%, transparent 70%)`, opacity: 0.3 }} />
            </div>

            <div className="relative z-10 w-full max-w-md px-6">
                {/* Header */}
                <div className="text-center mb-10">
                    <Link href="/" className="inline-block mb-6">
                        <span className="text-3xl font-bold" style={{ color: THEME.ink, letterSpacing: '-0.04em' }}>
                            Optimove
                        </span>
                    </Link>
                    {title && (
                        <>
                            <h1 className="text-2xl font-bold mb-2" style={{ color: THEME.ink, letterSpacing: '-0.04em' }}>
                                {title}
                            </h1>
                            <p style={{ color: THEME.green, opacity: 0.7, fontSize: '0.875rem' }}>
                                Sistem Pendukung Keputusan Rekomendasi Olahraga
                            </p>
                        </>
                    )}
                </div>

                {/* Card */}
                <div className="rounded-3xl border p-8 md:p-10 backdrop-blur-sm" 
                    style={{ backgroundColor: THEME.ice, borderColor: THEME.moss, boxShadow: `0 8px 40px rgba(32,59,20,0.08)` }}>
                    {children}
                </div>

                {/* Footer Link */}
                <p className="text-center text-xs mt-6" style={{ color: THEME.green, opacity: 0.6 }}>
                    <Link href="/" className="hover:opacity-80 transition font-bold" style={{ color: THEME.green }}>
                        ← Kembali ke Beranda
                    </Link>
                </p>
            </div>
        </div>
    );
}
