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

export default function Register() {
    const lang = typeof window !== 'undefined' ? (localStorage.getItem('optimove_lang') || 'id') : 'id';
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout 
            leftTitle={lang === 'id' ? "Mulai Perjalanan Sehat Anda!" : "Start Your Healthy Journey!"}
            leftSubtitle={lang === 'id' ? "Daftar sekarang untuk mendapatkan rekomendasi olahraga terbaik yang dirancang khusus untuk Anda." : "Register now to get the best workout recommendations specifically designed for you."}
            leftImage="/images/Main hp.png"
            leftHighlights={
                lang === 'id' ? [
                    "Rekomendasi olahraga personal yang akurat",
                    "Pantau aktivitas fisik mingguan Anda",
                    "Catat jurnal dan to-do list harian Anda"
                ] : [
                    "Accurate personalized workout recommendations",
                    "Track your weekly physical activity",
                    "Record daily journals and to-do lists"
                ]
            }
        >
            <Head title="Register" />

            {/* Header inside the Card */}
            <div className="mb-6 text-left">
                <h2 className="text-2xl font-extrabold tracking-tight mb-1" style={{ color: THEME.ink }}>
                    {lang === 'id' ? 'Daftar Optimove' : 'Register to Optimove'}
                </h2>
                <p className="text-sm font-medium opacity-70" style={{ color: THEME.green }}>
                    {lang === 'id' ? 'Silahkan lengkapi data di bawah ini untuk membuat akun baru' : 'Please complete the details below to create a new account'}
                </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                {/* Name */}
                <div>
                    <label className="block text-sm font-bold mb-1.5" style={{ color: THEME.ink }}>
                        {lang === 'id' ? 'Nama Lengkap' : 'Full Name'}
                    </label>
                    <input
                        id="name"
                        name="name"
                        value={data.name}
                        placeholder={lang === 'id' ? "Masukkan nama lengkap Anda" : "Enter your full name"}
                        autoComplete="name"
                        autoFocus
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-1 focus:ring-offset-0 transition"
                        style={{
                            borderColor: errors.name ? '#ef4444' : '#cbd5e1',
                            color: THEME.ink,
                            backgroundColor: '#ffffff',
                        }}
                        required
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm" style={{ color: '#ef4444' }}>{errors.name}</p>
                    )}
                </div>

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
                        placeholder={lang === 'id' ? "Masukkan email Anda" : "Enter your email"}
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-1 focus:ring-offset-0 transition"
                        style={{
                            borderColor: errors.email ? '#ef4444' : '#cbd5e1',
                            color: THEME.ink,
                            backgroundColor: '#ffffff',
                        }}
                        required
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
                        placeholder={lang === 'id' ? "Masukkan password Anda" : "Enter your password"}
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-1 focus:ring-offset-0 transition"
                        style={{
                            borderColor: errors.password ? '#ef4444' : '#cbd5e1',
                            color: THEME.ink,
                            backgroundColor: '#ffffff',
                        }}
                        required
                    />
                    {errors.password && (
                        <p className="mt-1 text-sm" style={{ color: '#ef4444' }}>{errors.password}</p>
                    )}
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="block text-sm font-bold mb-1.5" style={{ color: THEME.ink }}>
                        {lang === 'id' ? 'Konfirmasi Password' : 'Confirm Password'}
                    </label>
                    <input
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        placeholder={lang === 'id' ? "Masukkan kembali password Anda" : "Re-enter your password"}
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-1 focus:ring-offset-0 transition"
                        style={{
                            borderColor: errors.password_confirmation ? '#ef4444' : '#cbd5e1',
                            color: THEME.ink,
                            backgroundColor: '#ffffff',
                        }}
                        required
                    />
                    {errors.password_confirmation && (
                        <p className="mt-1 text-sm" style={{ color: '#ef4444' }}>{errors.password_confirmation}</p>
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
                    {processing ? (lang === 'id' ? 'Sedang membuat akun...' : 'Creating account...') : (lang === 'id' ? 'Daftar' : 'Register')}
                </button>

                {/* Login Link */}
                <div className="text-center mt-6 text-sm" style={{ color: THEME.ink }}>
                    {lang === 'id' ? 'Sudah memiliki akun? ' : 'Already have an account? '}
                    <Link
                        href={route('login')}
                        className="font-bold hover:underline"
                        style={{ color: THEME.green }}
                    >
                        {lang === 'id' ? 'Masuk Sekarang' : 'Log In Now'}
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
