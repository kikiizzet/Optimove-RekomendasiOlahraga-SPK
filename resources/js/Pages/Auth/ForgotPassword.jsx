import InputError from '@/Components/InputError';
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

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout title="Lupa Password">
            <Head title="Forgot Password" />

            <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: THEME.dew }}>
                <p style={{ color: THEME.ink, fontSize: '0.875rem', lineHeight: '1.5' }}>
                    Lupa password? Tidak masalah! Masukkan email Anda dan kami akan mengirimkan link untuk mengatur ulang password.
                </p>
            </div>

            {status && (
                <div className="mb-4 p-4 rounded-xl text-sm font-medium"
                    style={{ backgroundColor: THEME.dew, color: THEME.green }}>
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
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
                        autoFocus
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-offset-2 transition"
                        style={{
                            borderColor: errors.email ? '#ef4444' : THEME.moss,
                            color: THEME.ink,
                            backgroundColor: THEME.ice,
                        }}
                    />
                    {errors.email && (
                        <p className="mt-2 text-sm" style={{ color: '#ef4444' }}>{errors.email}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-3 rounded-xl font-bold text-sm transition hover:opacity-90 disabled:opacity-60"
                    style={{
                        backgroundColor: THEME.brown,
                        color: THEME.ice,
                    }}
                >
                    {processing ? 'Sedang mengirim...' : 'Kirim Link Reset Password'}
                </button>

                <Link
                    href={route('login')}
                    className="block text-center py-3 rounded-xl text-sm font-bold border transition hover:opacity-80"
                    style={{
                        borderColor: THEME.moss,
                        color: THEME.ink,
                        backgroundColor: THEME.dew,
                    }}
                >
                    Kembali ke Login
                </Link>
            </form>
        </GuestLayout>
    );
}
