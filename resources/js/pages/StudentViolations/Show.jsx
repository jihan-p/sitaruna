import React from 'react';
import AuthenticatedLayout from '@/templates/AuthenticatedLayout';
import Container from '@/components/atoms/Container';
import Card from '@/components/organisms/Card';
import { Head, Link, usePage } from '@inertiajs/react';
import CancelButton from '@/components/molecules/CancelButton';
import EditButton from '@/components/molecules/EditButton';
import hasAnyPermission from '@/utils/Permissions';

export default function ShowStudentViolation({ auth }) {
  const { studentViolation, auth: pageAuth } = usePage().props;
  const resource = 'student-violations';

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '-';
    const date = new Date(`1970-01-01T${timeString}`);
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Detail Pelanggaran Taruna</h2>}
    >
      <Head title={`Detail Pelanggaran: ${studentViolation.student?.nama_lengkap || 'N/A'}`} />

      <Container>
        <Card title="Detail Data Pelanggaran Taruna">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">Nama Taruna:</p>
              <p className="text-lg font-semibold text-gray-900">{studentViolation.student?.nama_lengkap || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">NIT/NISN Taruna:</p>
              <p className="text-lg font-semibold text-gray-900">{studentViolation.student?.nit || studentViolation.student?.nisn || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Jenis Pelanggaran:</p>
              <p className="text-lg font-semibold text-gray-900">{studentViolation.violation_type?.deskripsi || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Kategori Pelanggaran:</p>
              <p className="text-lg font-semibold text-gray-900">{studentViolation.violation_type?.kategori || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Poin Pelanggaran:</p>
              <p className="text-lg font-semibold text-gray-900">{studentViolation.violation_type?.poin || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tanggal Pelanggaran:</p>
              <p className="text-lg font-semibold text-gray-900">{formatDate(studentViolation.tanggal_pelanggaran)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Jam Pelanggaran:</p>
              <p className="text-lg font-semibold text-gray-900">{formatTime(studentViolation.jam_pelanggaran)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Dilaporkan Oleh:</p>
              <p className="text-lg font-semibold text-gray-900">{studentViolation.reporter?.name || 'Data Pelapor Tidak Ditemukan'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600">Keterangan Kejadian:</p>
              <p className="text-lg font-semibold text-gray-900 whitespace-pre-wrap">{studentViolation.keterangan_kejadian || '-'}</p>
            </div>
            {studentViolation.bukti_pelanggaran && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600">Bukti Pelanggaran:</p>
                <a
                  href={`/storage/${studentViolation.bukti_pelanggaran}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Lihat Bukti
                </a>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <CancelButton url={route(`${resource}.index`)}>Kembali</CancelButton>
            {hasAnyPermission(pageAuth.permissions, [`${resource} edit`]) && (
              <EditButton url={route(`${resource}.edit`, studentViolation.id)} />
            )}
          </div>
        </Card>
      </Container>
    </AuthenticatedLayout>
  );
}