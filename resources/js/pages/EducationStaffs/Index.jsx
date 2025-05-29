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

export default function EducationStaffIndex({ auth }) {
  const { educationStaff, filters, auth: pageAuth } = usePage().props;
  const allPermissions = pageAuth.permissions;

  const resource = 'education_staff';

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

  const canPerformAnyAction = hasAnyPermission(allPermissions, [
    'education-staff show', 'education-staff edit', 'education-staff delete'
  ]);

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Pendidik dan Tenaga Kependidikan</h2>}
    >
      <Head title="Manajemen Pendidik dan Tenaga Kependidikan" />

      <Container>
        <div className="mb-4 flex items-center justify-between gap-4">
          {hasAnyPermission(allPermissions, ['education-staff create']) && (
            <AddButton url={route(`${resource}.create`)}>
              Tambah PTK
            </AddButton>
          )}
          <Search defaultValue={filters.search} />
        </div>
        <Card title="Daftar Pendidik dan Tenaga Kependidikan">
          <Table>
            <Table.Thead>
              <tr>
                <Table.Th>Foto</Table.Th>
                <Table.Th>NIP</Table.Th>
                <Table.Th>Nama</Table.Th>
                <Table.Th>Jenis Kelamin</Table.Th>
                <Table.Th>Jabatan</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Tanggal Masuk</Table.Th>
                {canPerformAnyAction && <Table.Th>Aksi</Table.Th>}
              </tr>
            </Table.Thead>
            <Table.Tbody>
              {educationStaff.data.length > 0 ? (
                educationStaff.data.map((staff) => (
                  <tr key={staff.id}>
                    <Table.Td>
                      {staff.foto_profil ? (
                        <img
                          src={`/storage/${staff.foto_profil}`}
                          alt="Foto Profil"
                          className="w-10 h-10 object-cover rounded-full"
                        />
                      ) : (
                        <img
                          src="/images/default-profile.png"
                          alt="Default Foto Profil"
                          className="w-10 h-10 object-cover rounded-full"
                        />
                      )}
                    </Table.Td>
                    <Table.Td>{staff.nip || '-'}</Table.Td>
                    <Table.Td>{staff.name}</Table.Td>
                    <Table.Td>{formatGender(staff.gender)}</Table.Td>
                    <Table.Td>{staff.position || '-'}</Table.Td>
                    <Table.Td>{staff.email}</Table.Td>
                    <Table.Td>{formatDate(staff.hire_date)}</Table.Td>
                    {canPerformAnyAction && (
                      <Table.Td>
                        <div className="flex items-center justify-end gap-2">
                          {hasAnyPermission(allPermissions, ['education-staff show']) && (
                            <Link
                              href={route(`${resource}.show`, staff.id)}
                              className="inline-flex items-center p-2 hover:bg-gray-100 rounded"
                              title="Detail"
                            >
                              <IconEye size={18} />
                            </Link>
                          )}
                          {hasAnyPermission(allPermissions, ['education-staff edit']) && (
                            <EditButton url={route(`${resource}.edit`, staff.id)} />
                          )}
                          {hasAnyPermission(allPermissions, ['education-staff delete']) && (
                            <DeleteButton url={route(`${resource}.destroy`, staff.id)} />
                          )}
                        </div>
                      </Table.Td>
                    )}
                  </tr>
                ))
              ) : (
                <Table.Empty colSpan={canPerformAnyAction ? 8 : 7} message="Tidak ada data PTK." />
              )}
            </Table.Tbody>
          </Table>
        </Card>

        {educationStaff.last_page > 1 && (
          <div className="flex items-center justify-center mt-4">
            <Pagination links={educationStaff.links} />
          </div>
        )}
      </Container>
    </AuthenticatedLayout>
  );
}