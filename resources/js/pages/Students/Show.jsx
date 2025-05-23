import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AuthenticatedLayout from '@/templates/AuthenticatedLayout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';

import Container from '@/components/atoms/Container';
import Card from '@/components/organisms/Card';
import FormGroup from '@/components/molecules/FormGroup';
import TextInput from '@/components/atoms/TextInput';
import PrimaryButton from '@/components/molecules/PrimaryButton';
import hasAnyPermission from '@/utils/Permissions';
import { IconEye } from '@tabler/icons-react'; // Make sure IconEye is imported if used

export default function Show({ auth }) {
  const { student } = usePage().props;

  const routeResourceName = 'students';

  const formatJenisKelamin = (jenis_kelamin) => {
    if (jenis_kelamin === 'L') {
      return 'Laki-laki';
    } else if (jenis_kelamin === 'P') {
      return 'Perempuan';
    }
    return '-';
  };

  const defaultProfilePhoto = '/images/default-profile.png';

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Detail Peserta Didik</h2>}
    >
      <Head title={`Detail ${student.nama_lengkap}`} />

      <Container>
        <Card title="Detail Peserta Didik">
          <div className="flex justify-center mb-6">
            {student.foto_profil ? (
              <img
                src={`/storage/${student.foto_profil}`}
                alt={`Foto ${student.nama_lengkap}`}
                className="w-48 h-48 rounded-full object-cover border-2 border-gray-300 shadow-md"
              />
            ) : (
              <img
                src={defaultProfilePhoto}
                alt="Foto Profil Kosong"
                className="w-48 h-48 rounded-full object-cover border-2 border-gray-300 shadow-md"
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm font-medium text-gray-600">NISN:</p>
              <p className="text-lg font-semibold text-gray-900">{student.nisn || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">NIT:</p>
              <p className="text-lg font-semibold text-gray-900">{student.nit || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Nama Lengkap:</p>
              <p className="text-lg font-semibold text-gray-900">{student.nama_lengkap}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Jenis Kelamin:</p>
              <p className="text-lg font-semibold text-gray-900">{formatJenisKelamin(student.jenis_kelamin)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Tempat, Tanggal Lahir:</p>
              <p className="text-lg font-semibold text-gray-900">
                {student.tempat_lahir || '-'}, {student.tanggal_lahir ? new Date(student.tanggal_lahir).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Agama:</p>
              <p className="text-lg font-semibold text-gray-900">{student.agama || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">No. HP:</p>
              <p className="text-lg font-semibold text-gray-900">{student.no_hp || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Email:</p>
              <p className="text-lg font-semibold text-gray-900">{student.email || '-'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-gray-600">Alamat:</p>
              <p className="text-lg font-semibold text-gray-900">{student.alamat || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Status Akun:</p>
              <p className="text-lg font-semibold text-gray-900">{student.status_akun || '-'}</p>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Link
              href={route('students.index')}
              className="inline-flex items-center justify-center px-4 py-2 bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-gray-800 uppercase tracking-widest hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150 w-full md:w-auto"
            >
              Kembali
            </Link>

            {auth.user && hasAnyPermission(['students edit']) && (
              <Link
                href={route('students.edit', student.id)}
                className="inline-flex items-center justify-center px-4 py-2 bg-yellow-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition ease-in-out duration-150 w-full md:w-auto"
              >
                Edit
              </Link>
            )}
          </div>
        </Card>
      </Container>
    </AuthenticatedLayout>
  );
}
