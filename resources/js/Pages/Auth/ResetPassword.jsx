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

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout title="Atur Ulang Password">
            <Head title="Reset Password" />

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

                {/* Password */}
                <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: THEME.ink }}>
                        Password Baru
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        autoFocus
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

                {/* Confirm Password */}
                <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: THEME.ink }}>
                        Konfirmasi Password
                    </label>
                    <input
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-offset-2 transition"
                        style={{
                            borderColor: errors.password_confirmation ? '#ef4444' : THEME.moss,
                            color: THEME.ink,
                            backgroundColor: THEME.ice,
                        }}
                    />
                    {errors.password_confirmation && (
                        <p className="mt-2 text-sm" style={{ color: '#ef4444' }}>{errors.password_confirmation}</p>
                    )}
                </div>

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
                    {processing ? 'Sedang mengatur...' : 'Atur Ulang Password'}
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
