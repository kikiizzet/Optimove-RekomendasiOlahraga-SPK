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
        <GuestLayout 
            leftTitle="Selamat Datang Kembali!"
            leftSubtitle="Masuk untuk melanjutkan perjalanan sehat Anda bersama Optimove"
            leftImage="/images/Gambar Lari.png"
            leftHighlights={[
                "Simpan hasil analisis dan rekomendasi olahraga Anda",
                "Pantau progress dan jadwal latihan personal",
                "Dapatkan pengalaman yang lebih personal"
            ]}
        >
            <Head title="Login" />

            {/* Header inside the Card */}
            <div className="mb-6 text-left">
                <h2 className="text-2xl font-extrabold tracking-tight mb-1" style={{ color: THEME.ink }}>
                    Login Optimove
                </h2>
                <p className="text-sm font-medium opacity-70" style={{ color: THEME.green }}>
                    Silahkan masuk ke Akun Anda untuk mengakses dashboard
                </p>
            </div>

            {status && (
                <div className="mb-4 p-4 rounded-xl text-sm font-medium"
                    style={{ backgroundColor: THEME.dew, color: THEME.green }}>
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                {/* Email */}
                <div>
                    <label className="block text-sm font-bold mb-1.5" style={{ color: THEME.ink }}>
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        placeholder="Masukkan email Anda"
                        autoComplete="username"
                        autoFocus
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-1 focus:ring-offset-0 transition"
                        style={{
                            borderColor: errors.email ? '#ef4444' : '#cbd5e1',
                            color: THEME.ink,
                            backgroundColor: '#ffffff',
                            focusRingColor: THEME.green,
                        }}
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm" style={{ color: '#ef4444' }}>{errors.email}</p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-bold mb-1.5" style={{ color: THEME.ink }}>
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        placeholder="Masukkan password Anda"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-1 focus:ring-offset-0 transition"
                        style={{
                            borderColor: errors.password ? '#ef4444' : '#cbd5e1',
                            color: THEME.ink,
                            backgroundColor: '#ffffff',
                        }}
                    />
                    {errors.password && (
                        <p className="mt-1 text-sm" style={{ color: '#ef4444' }}>{errors.password}</p>
                    )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300"
                            style={{
                                accentColor: THEME.green,
                            }}
                        />
                        <span className="text-sm font-medium" style={{ color: THEME.ink, opacity: 0.7 }}>
                            Ingat saya
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-xs font-semibold hover:underline opacity-80 hover:opacity-100"
                            style={{ color: THEME.green }}
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-3 rounded-xl font-bold text-sm transition hover:opacity-90 disabled:opacity-60 cursor-pointer"
                    style={{
                        backgroundColor: THEME.green,
                        color: '#ffffff',
                    }}
                >
                    {processing ? 'Sedang masuk...' : 'Masuk'}
                </button>


                {/* Footer Link */}
                <div className="text-center mt-6 text-sm" style={{ color: THEME.ink }}>
                    Belum punya akun?{' '}
                    <Link
                        href={route('register')}
                        className="font-bold hover:underline"
                        style={{ color: THEME.green }}
                    >
                        Daftar Sekarang
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
