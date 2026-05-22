import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const THEME = {
    ink: '#0a1d08',
    ice: '#fbfdf6',
    moss: '#e0e5d5',
    dew: '#d7e8b5',
    green: '#203b14',
    brown: '#4a3212',
};

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout title="Masuk Akun">
            <Head title="Login" />

            {status && (
                <div className="mb-4 p-4 rounded-xl text-sm font-medium"
                    style={{ backgroundColor: THEME.dew, color: THEME.green }}>
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                {/* Email */}
                <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: THEME.ink }}>
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        placeholder="nama@example.com"
                        autoComplete="username"
                        autoFocus
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-offset-2 transition"
                        style={{
                            borderColor: errors.email ? '#ef4444' : THEME.moss,
                            color: THEME.ink,
                            backgroundColor: THEME.ice,
                            focusRingColor: THEME.green,
                        }}
                    />
                    {errors.email && (
                        <p className="mt-2 text-sm" style={{ color: '#ef4444' }}>{errors.email}</p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: THEME.ink }}>
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-offset-2 transition"
                        style={{
                            borderColor: errors.password ? '#ef4444' : THEME.moss,
                            color: THEME.ink,
                            backgroundColor: THEME.ice,
                        }}
                    />
                    {errors.password && (
                        <p className="mt-2 text-sm" style={{ color: '#ef4444' }}>{errors.password}</p>
                    )}
                </div>

                {/* Remember Me */}
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        name="remember"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                        className="w-4 h-4 rounded"
                        style={{
                            borderColor: THEME.moss,
                            accentColor: THEME.green,
                        }}
                    />
                    <span className="text-sm" style={{ color: THEME.ink, opacity: 0.7 }}>
                        Ingat saya
                    </span>
                </label>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-3 rounded-xl font-bold text-sm transition hover:opacity-90 disabled:opacity-60"
                    style={{
                        backgroundColor: THEME.brown,
                        color: THEME.ice,
                    }}
                >
                    {processing ? 'Sedang masuk...' : 'Masuk Akun'}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-px" style={{ backgroundColor: THEME.moss }} />
                    <span className="text-xs" style={{ color: THEME.green, opacity: 0.6 }}>ATAU</span>
                    <div className="flex-1 h-px" style={{ backgroundColor: THEME.moss }} />
                </div>

                {/* Links */}
                <div className="space-y-3">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="block text-center py-3 rounded-xl text-sm font-bold border transition hover:opacity-80"
                            style={{
                                borderColor: THEME.moss,
                                color: THEME.ink,
                                backgroundColor: THEME.dew,
                            }}
                        >
                            Lupa Password?
                        </Link>
                    )}

                    <Link
                        href={route('register')}
                        className="block text-center py-3 rounded-xl text-sm font-bold border transition hover:opacity-80"
                        style={{
                            borderColor: THEME.moss,
                            color: THEME.ink,
                            backgroundColor: THEME.dew,
                        }}
                    >
                        Buat Akun Baru
                    </Link>
                </div>

                {/* Demo Info */}
                <div className="mt-6 p-4 rounded-xl text-xs" style={{ backgroundColor: THEME.dew, borderLeft: `3px solid ${THEME.green}` }}>
                    <p style={{ color: THEME.ink, marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        Demo Admin:
                    </p>
                    <p style={{ color: THEME.ink, opacity: 0.7, fontFamily: 'monospace' }}>
                        📧 admin@optimove.test<br/>
                        🔐 password
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
