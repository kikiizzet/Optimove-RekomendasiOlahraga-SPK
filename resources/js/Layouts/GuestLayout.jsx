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

export default function GuestLayout({ 
    children, 
    title = '', 
    leftTitle = '',
    leftSubtitle = '',
    leftImage = '',
    leftHighlights = []
}) {
    const lang = typeof window !== 'undefined' ? (localStorage.getItem('optimove_lang') || 'id') : 'id';
    const isSplit = !!leftTitle;

    if (isSplit) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 relative overflow-hidden" style={{ backgroundColor: '#f5f7f2' }}>
                {/* Decorative background gradients */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full filter blur-3xl" 
                        style={{ background: `radial-gradient(circle, ${THEME.dew} 0%, transparent 70%)`, opacity: 0.5 }} />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full filter blur-3xl" 
                        style={{ background: `radial-gradient(circle, ${THEME.moss} 0%, transparent 70%)`, opacity: 0.4 }} />
                </div>

                <div className="relative z-10 w-full max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                        {/* Left Column: Welcome & Info */}
                        <div className="lg:col-span-5 flex flex-col justify-center text-left py-4">
                            <Link href="/" className="inline-flex items-center gap-2 mb-8 group self-start">
                                <img src="/images/icon hijau.png" alt="Optimove" className="w-8 h-8 object-contain" />
                                <span className="text-3xl font-extrabold tracking-tight transition group-hover:opacity-80" style={{ color: THEME.ink }}>
                                    Optimove
                                </span>
                            </Link>

                            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-4 leading-tight" style={{ color: THEME.ink }}>
                                {leftTitle}
                            </h1>
                            <p className="text-sm lg:text-base mb-8 opacity-80 leading-relaxed font-medium" style={{ color: THEME.green }}>
                                {leftSubtitle}
                            </p>

                            {leftImage && (
                                <div className="w-full max-w-[420px] mx-auto lg:mx-0 mb-8 flex justify-center lg:justify-start">
                                    <img 
                                        src={leftImage} 
                                        alt="Welcome Illustration" 
                                        className="w-full h-auto max-h-[360px] object-contain"
                                        style={{ filter: 'drop-shadow(0 15px 25px rgba(32,59,20,0.1))' }}
                                    />
                                </div>
                            )}

                            {leftHighlights && leftHighlights.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold tracking-tight" style={{ color: THEME.ink }}>
                                        {lang === 'id' ? 'Mengapa Login?' : 'Why Login?'}
                                    </h3>
                                    <ul className="space-y-3.5">
                                        {leftHighlights.map((highlight, index) => (
                                            <li key={index} className="flex items-start gap-3 text-sm font-medium" style={{ color: THEME.green }}>
                                                <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-[#075e3d] text-white">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                    </svg>
                                                </span>
                                                <span className="opacity-95 leading-tight">{highlight}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Card with form */}
                        <div className="lg:col-span-7 flex justify-center lg:justify-end w-full">
                            <div className="w-full max-w-xl bg-white rounded-[2rem] p-8 sm:p-10 md:p-12 shadow-[0_12px_50px_rgba(0,0,0,0.04)] border border-[#e8ecde]">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative p-6" style={{ backgroundColor: THEME.ice }}>
            {/* Decorative gradient */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 rounded-full" 
                    style={{ background: `radial-gradient(circle, ${THEME.dew} 0%, transparent 70%)`, opacity: 0.4 }} />
                <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full" 
                    style={{ background: `radial-gradient(circle, ${THEME.moss} 0%, transparent 70%)`, opacity: 0.3 }} />
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-4 justify-center">
                        <img src="/images/icon hijau.png" alt="Optimove" className="w-8 h-8 object-contain" />
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
                                {lang === 'id' ? 'Sistem Pendukung Keputusan Rekomendasi Olahraga' : 'Sports Recommendation Decision Support System'}
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
                        {lang === 'id' ? '← Kembali ke Beranda' : '← Back to Home'}
                    </Link>
                </p>
            </div>
        </div>
    );
}
