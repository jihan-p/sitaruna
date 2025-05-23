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
import { Link } from '@inertiajs/react';
import { IconEye } from '@tabler/icons-react';
import hasAnyPermission from '@/utils/Permissions';

export default function Index({ auth }) {
  const { students, filters, auth: pageAuth } = usePage().props;
  const allPermissions = pageAuth.permissions; // Ambil semua izin dari props Inertia

  const resource = 'students';

  // Tentukan apakah ada izin untuk aksi apapun (show, edit, atau delete)
  const canPerformAnyAction = hasAnyPermission(allPermissions, [`${resource} show`, `${resource} edit`, `${resource} delete`]);

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Peserta Didik</h2>}
    >
      <Head title="Manajemen Peserta Didik" />

      <Container>
        <div className="mb-4 flex items-center justify-between gap-4">
          {hasAnyPermission(allPermissions, [`${resource} create`]) && (
            <AddButton url={route(`${resource}.create`)} />
          )}
          <div className="w-full md:w-4/6">
            <Search
              url={route(`${resource}.index`)}
              placeholder="Cari peserta didik berdasarkan nama, NISN, NIT..."
              filter={filters}
            />
          </div>
        </div>

        <Card title="Daftar Peserta Didik">
          <Table>
            <Table.Thead>
              <tr>
                <Table.Th>#</Table.Th>
                <Table.Th>NISN</Table.Th>
                <Table.Th>NIT</Table.Th>
                <Table.Th>Nama Lengkap</Table.Th>
                <Table.Th>Jenis Kelamin</Table.Th>
                <Table.Th>Status</Table.Th>
                {canPerformAnyAction && (
                  <Table.Th className="text-right">Aksi</Table.Th>
                )}
              </tr>
            </Table.Thead>
            <Table.Tbody>
              {students.data.length > 0 ? (
                students.data.map((student, i) => (
                  <tr key={student.id} className="bg-white border-b hover:bg-gray-50">
                    <Table.Td>{students.from + i}</Table.Td>
                    <Table.Td>{student.nisn}</Table.Td>
                    <Table.Td>{student.nit}</Table.Td>
                    <Table.Td>{student.nama_lengkap}</Table.Td>
                    <Table.Td>{student.jenis_kelamin}</Table.Td>
                    <Table.Td>{student.status_akun}</Table.Td>
                    {canPerformAnyAction && (
                      <Table.Td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {hasAnyPermission(allPermissions, [`${resource} show`]) && (
                            <Link
                              href={route(`${resource}.show`, student.id)}
                              className="inline-flex items-center p-2 hover:bg-gray-100 rounded"
                              title="Detail"
                            >
                              <IconEye size={18} />
                            </Link>
                          )}
                          {hasAnyPermission(allPermissions, [`${resource} edit`]) && (
                            <EditButton url={route(`${resource}.edit`, student.id)} />
                          )}
                          {hasAnyPermission(allPermissions, [`${resource} delete`]) && (
                            <DeleteButton url={route(`${resource}.destroy`, student.id)} />
                          )}
                        </div>
                      </Table.Td>
                    )}
                  </tr>
                ))
              ) : (
                <Table.Empty colSpan={canPerformAnyAction ? 7 : 6} message="Tidak ada data Peserta Didik." />
              )}
            </Table.Tbody>
          </Table>
        </Card>

        {students.last_page > 1 && (
          <div className="flex items-center justify-center mt-4">
            <Pagination links={students.links} />
          </div>
        )}
      </Container>
    </AuthenticatedLayout>
  );
}
