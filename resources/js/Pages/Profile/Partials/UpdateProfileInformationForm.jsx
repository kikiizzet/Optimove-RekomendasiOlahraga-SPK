import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name || '',
            email: user.email || '',
            gender: user.gender || '',
            date_of_birth: user.date_of_birth || '',
            phone: user.phone || '',
            address: user.address || '',
            job: user.job || '',
            activity_level: user.activity_level || '',
            age: user.age || '',
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <form onSubmit={submit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <InputLabel htmlFor="name" value="Nama Lengkap" />
                        <TextInput
                            id="name"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            isFocused
                            autoComplete="name"
                        />
                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div>
                        <InputLabel htmlFor="gender" value="Jenis Kelamin" />
                        <select
                            id="gender"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.gender}
                            onChange={(e) => setData('gender', e.target.value)}
                        >
                            <option value="">Pilih Jenis Kelamin</option>
                            <option value="Male">Laki-laki</option>
                            <option value="Female">Perempuan</option>
                        </select>
                        <InputError className="mt-2" message={errors.gender} />
                    </div>

                    <div>
                        <InputLabel htmlFor="date_of_birth" value="Tanggal Lahir" />
                        <TextInput
                            id="date_of_birth"
                            type="date"
                            className="mt-1 block w-full"
                            value={data.date_of_birth}
                            onChange={(e) => setData('date_of_birth', e.target.value)}
                        />
                        <InputError className="mt-2" message={errors.date_of_birth} />
                    </div>

                    <div>
                        <InputLabel htmlFor="age" value="Usia (Tahun)" />
                        <TextInput
                            id="age"
                            type="number"
                            className="mt-1 block w-full"
                            value={data.age}
                            onChange={(e) => setData('age', e.target.value)}
                        />
                        <InputError className="mt-2" message={errors.age} />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                        />
                        <InputError className="mt-2" message={errors.email} />
                    </div>

                    <div>
                        <InputLabel htmlFor="phone" value="Nomor Telepon" />
                        <TextInput
                            id="phone"
                            type="tel"
                            className="mt-1 block w-full"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            placeholder="08xx-xxxx-xxxx"
                        />
                        <InputError className="mt-2" message={errors.phone} />
                    </div>

                    <div className="md:col-span-2">
                        <InputLabel htmlFor="address" value="Alamat" />
                        <TextInput
                            id="address"
                            className="mt-1 block w-full"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            placeholder="Jl. Nama, No. xx, Kota, Provinsi"
                        />
                        <InputError className="mt-2" message={errors.address} />
                    </div>

                    <div>
                        <InputLabel htmlFor="job" value="Pekerjaan" />
                        <TextInput
                            id="job"
                            className="mt-1 block w-full"
                            value={data.job}
                            onChange={(e) => setData('job', e.target.value)}
                        />
                        <InputError className="mt-2" message={errors.job} />
                    </div>

                    <div>
                        <InputLabel htmlFor="activity_level" value="Tingkat Aktivitas" />
                        <select
                            id="activity_level"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.activity_level}
                            onChange={(e) => setData('activity_level', e.target.value)}
                        >
                            <option value="">Pilih Tingkat Aktivitas</option>
                            <option value="Rendah">Rendah</option>
                            <option value="Sedang">Sedang</option>
                            <option value="Tinggi">Tinggi</option>
                        </select>
                        <InputError className="mt-2" message={errors.activity_level} />
                    </div>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 pt-4">
                    <PrimaryButton disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition">
                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-green-600 font-medium">
                            ✓ Tersimpan dengan berhasil
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
