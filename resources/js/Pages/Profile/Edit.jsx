import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout>
            <Head title="Profile" />

            <div className="py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Pengaturan Profil</h1>
                        <p className="mt-2 text-gray-600">Kelola informasi akun dan pengaturan keamanan Anda</p>
                    </div>

                    {/* Profile Information Form */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 mb-6">
                        <div className="border-b border-gray-200 pb-6 mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Informasi Profil</h2>
                            <p className="mt-1 text-sm text-gray-600">Perbarui informasi pribadi dan alamat email Anda</p>
                        </div>
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className=""
                        />
                    </div>

                    {/* Password Update Form */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 mb-6">
                        <div className="border-b border-gray-200 pb-6 mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Perbarui Kata Sandi</h2>
                            <p className="mt-1 text-sm text-gray-600">Pastikan akun Anda menggunakan kata sandi yang kuat dan unik</p>
                        </div>
                        <UpdatePasswordForm className="" />
                    </div>

                    {/* Delete Account Form */}
                    <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6 sm:p-8">
                        <div className="border-b border-red-200 pb-6 mb-6">
                            <h2 className="text-xl font-semibold text-red-900">Hapus Akun</h2>
                            <p className="mt-1 text-sm text-red-700">Tindakan ini tidak dapat dibatalkan. Data Anda akan dihapus secara permanen.</p>
                        </div>
                        <DeleteUserForm className="" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
