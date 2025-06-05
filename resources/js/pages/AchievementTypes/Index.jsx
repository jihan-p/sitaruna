import React from 'react';
import AuthenticatedLayout from '@/templates/AuthenticatedLayout';
import Container from '@/components/atoms/Container';
import Card from '@/components/organisms/Card';
import Table from '@/components/organisms/Table';
import Pagination from '@/components/molecules/Pagination';
import Search from '@/components/molecules/Search';
import AddButton from '@/components/molecules/AddButton';
import ImportButton from '@/components/molecules/ImportButton'; // Impor ImportButton
import EditButton from '@/components/molecules/EditButton';
import DeleteButton from '@/components/molecules/DeleteButton';
import { Head, usePage } from '@inertiajs/react';
import hasAnyPermission from '@/utils/Permissions';
import { IconCircleCheck, IconCircleX } from '@tabler/icons-react';

export default function AchievementTypeIndex({ auth }) {
  const { achievementTypes, filters, auth: pageAuth } = usePage().props;
  const allPermissions = pageAuth.permissions;

  const resource = 'achievement-types'; // Sesuai dengan nama rute di web.php

  const canPerformAnyAction = hasAnyPermission(allPermissions, [
    `${resource} edit`, `${resource} delete`,
  ]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Jenis Prestasi</h2>}
    >
      <Head title="Manajemen Jenis Prestasi" />

      <Container>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {hasAnyPermission(allPermissions, [`${resource} create`]) && (
              <AddButton url={route(`${resource}.create`)}>
                Tambah Jenis Prestasi
              </AddButton>
            )}
            {hasAnyPermission(allPermissions, [`${resource} import`]) && (
              <ImportButton url={route(`${resource}.import.form`)}>Impor</ImportButton>
            )}
          </div>
          <div className="w-full md:w-4/6">
            <Search
              url={route(`${resource}.index`)}
              placeholder="Cari berdasarkan deskripsi..."
              filter={filters}
            />
          </div>
        </div>
        <Card title="Daftar Jenis Prestasi">
          <Table>
            <Table.Thead>
              <tr>
                <Table.Th>No.</Table.Th>
                <Table.Th>Deskripsi</Table.Th>
                <Table.Th>Poin</Table.Th>
                <Table.Th>Tgl Berlaku</Table.Th>
                <Table.Th>Tgl Akhir</Table.Th>
                <Table.Th>Status Aktif</Table.Th>
                {canPerformAnyAction && <Table.Th className="text-right">Aksi</Table.Th>}
              </tr>
            </Table.Thead>
            <Table.Tbody>
              {achievementTypes.data.length > 0 ? (
                achievementTypes.data.map((item, index) => (
                  <tr key={item.id}>
                    <Table.Td>{achievementTypes.from + index}</Table.Td>
                    <Table.Td>{item.deskripsi}</Table.Td>
                    <Table.Td>{item.poin}</Table.Td>
                    <Table.Td>{formatDate(item.tanggal_berlaku)}</Table.Td>
                    <Table.Td>{formatDate(item.tanggal_akhir_berlaku)}</Table.Td>
                    <Table.Td>
                      {item.aktif ? (
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                          <IconCircleCheck size={14} /> Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
                          <IconCircleX size={14} /> Tidak Aktif
                        </span>
                      )}
                    </Table.Td>
                    {canPerformAnyAction && (
                      <Table.Td>
                        <div className="flex items-center justify-end gap-2">
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
                <Table.Empty colSpan={canPerformAnyAction ? 7 : 6} message="Tidak ada data jenis prestasi." />
              )}
            </Table.Tbody>
          </Table>
        </Card>

        {achievementTypes.last_page > 1 && (
          <div className="flex items-center justify-center mt-4">
            <Pagination links={achievementTypes.links} />
          </div>
        )}
      </Container>
    </AuthenticatedLayout>
  );
}