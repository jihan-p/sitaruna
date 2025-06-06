import React from 'react';
import AuthenticatedLayout from '@/templates/AuthenticatedLayout';
import Container from '@/components/atoms/Container';
import Card from '@/components/organisms/Card';
import { Head, Link, usePage } from '@inertiajs/react';
import CancelButton from '@/components/molecules/CancelButton';
import EditButton from '@/components/molecules/EditButton';
import hasAnyPermission from '@/utils/Permissions';

export default function ShowStudentAchievement({ auth }) {
  const { studentAchievement, auth: pageAuth } = usePage().props;
  const resource = 'student-achievements';

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Detail Prestasi Taruna</h2>}
    >
      <Head title={`Detail Prestasi: ${studentAchievement.student?.nama_lengkap} - ${studentAchievement.achievement_type?.deskripsi}`} />

      <Container>
        <Card title="Detail Data Prestasi Taruna">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-600">Nama Taruna:</p>
              <p className="text-lg font-semibold text-gray-900">{studentAchievement.student?.nama_lengkap || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">NIT Taruna:</p>
              <p className="text-lg font-semibold text-gray-900">{studentAchievement.student?.nit || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Jenis Prestasi:</p>
              <p className="text-lg font-semibold text-gray-900">{studentAchievement.achievement_type?.deskripsi || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Poin Prestasi:</p>
              <p className="text-lg font-semibold text-gray-900">{studentAchievement.achievement_type?.poin || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tanggal Prestasi:</p>
              <p className="text-lg font-semibold text-gray-900">{formatDate(studentAchievement.tanggal_prestasi)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Dicatat Oleh:</p>
              <p className="text-lg font-semibold text-gray-900">{studentAchievement.education_staff?.name || 'Sistem'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600">Keterangan Tambahan:</p>
              <p className="text-lg text-gray-900 whitespace-pre-wrap">{studentAchievement.keterangan_tambahan || '-'}</p>
            </div>
            {studentAchievement.bukti_prestasi && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600">Bukti Prestasi:</p>
                {studentAchievement.bukti_prestasi.match(/\.(jpeg|jpg|gif|png)$/) != null ? (
                  <img
                    src={`/storage/${studentAchievement.bukti_prestasi}`}
                    alt="Bukti Prestasi"
                    className="mt-2 max-w-md h-auto rounded-md border border-gray-300 shadow"
                  />
                ) : (
                  <a
                    href={`/storage/${studentAchievement.bukti_prestasi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-lg"
                  >
                    Lihat Dokumen Bukti
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <CancelButton url={route(`${resource}.index`)}>Kembali</CancelButton>
            {hasAnyPermission(pageAuth.permissions, [`${resource} edit`]) && (
              <EditButton url={route(`${resource}.edit`, studentAchievement.id)} />
            )}
          </div>
        </Card>
      </Container>
    </AuthenticatedLayout>
  );
}