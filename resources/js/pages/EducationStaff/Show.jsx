// resources/js/pages/EducationStaff/Show.jsx
import React from 'react';
import AuthenticatedLayout from '@/templates/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import Container from '@/components/atoms/Container';
import PrimaryButton from '@/components/molecules/PrimaryButton';
import EditButton from '@/components/molecules/EditButton';
import Card from '@/components/organisms/Card'; // Import Card component
import hasAnyPermission from '@/utils/Permissions';

export default function EducationStaffShow({ auth }) {
    const { educationStaff, auth: pageAuth } = usePage().props;
    const allPermissions = pageAuth.permissions;
    const defaultProfilePhoto = '/images/default-profile.png';

    const formatJenisKelamin = (gender) => {
        if (gender === 'L') {
            return 'Laki-laki';
        } else if (gender === 'P') {
            return 'Perempuan';
        }
        return '-';
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Detail Pendidik dan Tenaga Kependidikan (PTK)</h2>}
        >
            <Head title={`Detail PTK: ${educationStaff.name}`} />

            <Container>
                <Card title="Detail Informasi PTK">
                    <div className="flex justify-center mb-6">
                        <img
                            src={educationStaff.foto_profil ? `/storage/${educationStaff.foto_profil}` : defaultProfilePhoto}
                            alt="Foto Profil"
                            className="w-32 h-32 object-cover rounded-full shadow-md"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Nama Lengkap:</p>
                            <p className="text-lg font-semibold text-gray-900">{educationStaff.name}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">NIP:</p>
                            <p className="text-lg font-semibold text-gray-900">{educationStaff.nip || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Jenis Kelamin:</p>
                            <p className="text-lg font-semibold text-gray-900">{formatJenisKelamin(educationStaff.gender)}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Tempat, Tanggal Lahir:</p>
                            <p className="text-lg font-semibold text-gray-900">{educationStaff.place_of_birth || '-'}, {formatDate(educationStaff.date_of_birth) || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Alamat:</p>
                            <p className="text-lg font-semibold text-gray-900">{educationStaff.address || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Nomor Telepon:</p>
                            <p className="text-lg font-semibold text-gray-900">{educationStaff.phone_number || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Email:</p>
                            <p className="text-lg font-semibold text-gray-900">{educationStaff.email}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Jabatan:</p>
                            <p className="text-lg font-semibold text-gray-900">{educationStaff.position || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Tanggal Masuk:</p>
                            <p className="text-lg font-semibold text-gray-900">{formatDate(educationStaff.hire_date) || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Pendidikan Terakhir:</p>
                            <p className="text-lg font-semibold text-gray-900">{educationStaff.last_education || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Jurusan Pendidikan:</p>
                            <p className="text-lg font-semibold text-gray-900">{educationStaff.major_education || '-'}</p>
                        </div>
                        {educationStaff.user && (
                            <div>
                                <p className="text-sm font-medium text-gray-600">Akun Pengguna:</p>
                                <p className="text-lg font-semibold text-gray-900">{educationStaff.user.email}</p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <Link href={route('education-staff.index')}>
                            <PrimaryButton>Kembali</PrimaryButton>
                        </Link>
                        {hasAnyPermission(allPermissions, ['education_staff edit']) && (
                            <Link href={route('education-staff.edit', educationStaff.id)}>
                                <EditButton>Edit PTK</EditButton>
                            </Link>
                        )}
                    </div>
                </Card>
            </Container>
        </AuthenticatedLayout>
    );
}