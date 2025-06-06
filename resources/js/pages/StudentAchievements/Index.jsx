import React from 'react';
import AuthenticatedLayout from '@/templates/AuthenticatedLayout';
import Container from '@/components/atoms/Container';
import Card from '@/components/organisms/Card';
import Table from '@/components/organisms/Table';
import Pagination from '@/components/molecules/Pagination';
import Search from '@/components/molecules/Search';
import AddButton from '@/components/molecules/AddButton';
import EditButton from '@/components/molecules/EditButton';
import DeleteButton from '@/components/molecules/DeleteButton';
import { Head, usePage, Link } from '@inertiajs/react';
import { IconEye } from '@tabler/icons-react';
import hasAnyPermission from '@/utils/Permissions';

export default function StudentAchievementIndex({ auth }) {
  const { studentAchievements, filters, auth: pageAuth } = usePage().props;
  const allPermissions = pageAuth.permissions;

  const resource = 'student-achievements';

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  const canPerformAnyAction = hasAnyPermission(allPermissions, [
    `${resource} show`, `${resource} edit`, `${resource} delete`,
  ]);

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Prestasi Taruna</h2>}
    >
      <Head title="Manajemen Prestasi Taruna" />

      <Container>
        <div className="mb-4 flex items-center justify-between gap-4">
          {hasAnyPermission(allPermissions, [`${resource} create`]) && (
            <AddButton url={route(`${resource}.create`)}>
              Tambah Prestasi
            </AddButton>
          )}
          <div className="w-full md:w-4/6">
            <Search
              url={route(`${resource}.index`)}
              placeholder="Cari berdasarkan nama taruna, jenis prestasi..."
              filter={filters}
            />
          </div>
        </div>
        <Card title="Daftar Prestasi Taruna">
          <Table>
            <Table.Thead>
              <tr>
                <Table.Th>No.</Table.Th>
                <Table.Th>Nama Taruna</Table.Th>
                <Table.Th>Jenis Prestasi</Table.Th>
                <Table.Th>Poin</Table.Th>
                <Table.Th>Tanggal</Table.Th>
                <Table.Th>Pelapor</Table.Th>
                {canPerformAnyAction && <Table.Th className="text-right">Aksi</Table.Th>}
              </tr>
            </Table.Thead>
            <Table.Tbody>
              {studentAchievements.data.length > 0 ? (
                studentAchievements.data.map((item, index) => (
                  <tr key={item.id}>
                    <Table.Td>{studentAchievements.from + index}</Table.Td>
                    <Table.Td>{item.student?.nama_lengkap || 'N/A'}</Table.Td>
                    <Table.Td>{item.achievement_type?.deskripsi || 'N/A'}</Table.Td>
                    <Table.Td>{item.achievement_type?.poin || 'N/A'}</Table.Td>
                    <Table.Td>{formatDate(item.tanggal_prestasi)}</Table.Td>
                    <Table.Td>{item.education_staff?.name || 'N/A'}</Table.Td>
                    {canPerformAnyAction && (
                      <Table.Td>
                        <div className="flex items-center justify-end gap-2">
                          {hasAnyPermission(allPermissions, [`${resource} show`]) && (
                            <Link
                              href={route(`${resource}.show`, item.id)}
                              className="inline-flex items-center p-2 hover:bg-gray-100 rounded"
                              title="Detail"
                            >
                              <IconEye size={18} />
                            </Link>
                          )}
                          {hasAnyPermission(allPermissions, [`${resource} edit`]) && (
                            <EditButton url={route(`${resource}.edit`, item.id)} />
                          )}
                          {hasAnyPermission(allPermissions, [`${resource} delete`]) && (
                            <DeleteButton url={route(`${resource}.destroy`, item.id)} />
                          )}
                        </div>
                      </Table.Td>
                    )}
                  </tr>
                ))
              ) : (
                <Table.Empty colSpan={canPerformAnyAction ? 7 : 6} message="Tidak ada data prestasi taruna." />
              )}
            </Table.Tbody>
          </Table>
        </Card>

        {studentAchievements.last_page > 1 && (
          <div className="flex items-center justify-center mt-4">
            <Pagination links={studentAchievements.links} />
          </div>
        )}
      </Container>
    </AuthenticatedLayout>
  );
}