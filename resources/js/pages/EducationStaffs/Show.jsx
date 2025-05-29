import React from 'react';
import AuthenticatedLayout from '@/templates/AuthenticatedLayout';
import Container from '@/components/atoms/Container';
import Card from '@/components/organisms/Card';
import { Head, Link, usePage } from '@inertiajs/react';
    import CancelButton from '@/components/molecules/CancelButton'; // Assuming CancelButton exists
    import EditButton from '@/components/molecules/EditButton'; // Assuming EditButton exists
import hasAnyPermission from '@/utils/Permissions';

export default function Show({ auth }) {
  const { educationStaff: staff, auth: pageAuth } = usePage().props;

  const formatGender = (gender) => {
    if (gender === 'L') return 'Laki-laki';
    if (gender === 'P') return 'Perempuan';
    return '-';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Detail PTK</h2>}
    >
      <Head title={`Detail PTK: ${staff.name}`} />

      <Container>
        <Card title="Detail Data Pendidik dan Tenaga Kependidikan">
          <div className="flex justify-center mb-6">
            <img
              src={staff.foto_profil ? `/storage/${staff.foto_profil}` : '/images/default-profile.png'}
              alt="Foto Profil"
              className="w-48 h-48 rounded-full object-cover border-2 border-gray-300 shadow-md"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">NIP:</p>
              <p className="text-lg font-semibold text-gray-900">{staff.nip || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Nama Lengkap:</p>
              <p className="text-lg font-semibold text-gray-900">{staff.name || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Jenis Kelamin:</p>
              <p className="text-lg font-semibold text-gray-900">{formatGender(staff.gender)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Jabatan:</p>
              <p className="text-lg font-semibold text-gray-900">{staff.position || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email:</p>
              <p className="text-lg font-semibold text-gray-900">{staff.email || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tanggal Masuk:</p>
              <p className="text-lg font-semibold text-gray-900">{formatDate(staff.hire_date)}</p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <CancelButton url={route('education_staff.index')}>Kembali</CancelButton>

            {hasAnyPermission(pageAuth.permissions, ['education_staff edit']) && (
              <EditButton url={route('education_staff.edit', staff.id)} />
            )}
          </div>
        </Card>
      </Container>
    </AuthenticatedLayout>
  );
}
