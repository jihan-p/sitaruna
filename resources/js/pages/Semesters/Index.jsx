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
import { Head, usePage } from '@inertiajs/react';
import hasAnyPermission from '@/utils/Permissions';

export default function Index({ auth }) {
  const { semesters, filters, auth: pageAuth } = usePage().props;
  const allPermissions = pageAuth.permissions; // Ambil semua izin dari props Inertia

  const resource = 'semesters';

  // Tentukan apakah ada izin untuk aksi apapun (edit atau delete)
  const canPerformAnyAction = hasAnyPermission(allPermissions, [`${resource} edit`, `${resource} delete`]);

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Semester</h2>}
    >
      <Head title="Manajemen Semester" />

      <Container>
        <div className="mb-4 flex items-center justify-between gap-4">
          {hasAnyPermission(allPermissions, [`${resource} create`]) && (
            <AddButton url={route(`${resource}.create`)}>
                Tambah Semester
            </AddButton>
          )}
          <div className="w-full md:w-4/6">
            <Search
              url={route(`${resource}.index`)}
              placeholder="Cari Semester..."
              filter={filters}
            />
          </div>
        </div>

        <Card title="Daftar Semester">
          <Table>
            <Table.Thead>
              <tr>
                <Table.Th>#</Table.Th>
                <Table.Th>Nama Semester</Table.Th>
                <Table.Th>Tahun Ajaran</Table.Th>
                <Table.Th>Aktif</Table.Th>
                {canPerformAnyAction && (
                  <Table.Th className="text-right">Aksi</Table.Th>
                )}
              </tr>
            </Table.Thead>
            <Table.Tbody>
              {semesters.data.length > 0 ? (
                semesters.data.map((semester, i) => (
                  <tr key={semester.id} className="bg-white border-b hover:bg-gray-50">
                    <Table.Td>{semesters.from + i}</Table.Td>
                    <Table.Td>{semester.nama_semester}</Table.Td>
                    <Table.Td>{semester.academic_year?.nama_tahun_ajaran ?? '-'}</Table.Td>
                    <Table.Td>{semester.is_active ? 'Ya' : 'Tidak'}</Table.Td>
                    {canPerformAnyAction && (
                      <Table.Td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {hasAnyPermission(allPermissions, [`${resource} edit`]) && (
                            <EditButton url={route(`${resource}.edit`, semester.id)} />
                          )}
                          {hasAnyPermission(allPermissions, [`${resource} delete`]) && (
                            <DeleteButton url={route(`${resource}.destroy`, semester.id)} />
                          )}
                        </div>
                      </Table.Td>
                    )}
                  </tr>
                ))
              ) : (
                <Table.Empty colSpan={canPerformAnyAction ? 5 : 4} message="Tidak ada data Semester." />
              )}
            </Table.Tbody>
          </Table>
        </Card>

        {semesters.last_page > 1 && (
          <div className="flex items-center justify-center mt-4">
            <Pagination links={semesters.links} />
          </div>
        )}
      </Container>
    </AuthenticatedLayout>
  );
}
