import React from 'react';
import AuthenticatedLayout from '@/templates/AuthenticatedLayout';
import Container from '@/components/atoms/Container';
import Card from '@/components/organisms/Card';
import Table from '@/components/organisms/Table';
import Pagination from '@/components/molecules/Pagination';
import Search from '@/components/molecules/Search';
import AddButton from '@/components/molecules/AddButton';
import ImportButton from '@/components/molecules/ImportButton'; // Import ImportButton
import EditButton from '@/components/molecules/EditButton';
import DeleteButton from '@/components/molecules/DeleteButton';
import { Head, usePage } from '@inertiajs/react';
import hasAnyPermission from '@/utils/Permissions';
import { IconCircleCheck, IconCircleX } from '@tabler/icons-react';

export default function ViolationTypeIndex({ auth }) {
  const { violationTypes, filters, auth: pageAuth } = usePage().props;
  const allPermissions = pageAuth.permissions;

  const resource = 'violation-types'; // Sesuai dengan nama rute di web.php

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
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Jenis Pelanggaran</h2>}
    >
      <Head title="Manajemen Jenis Pelanggaran" />

      <Container>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {hasAnyPermission(allPermissions, [`${resource} create`]) && (
              <AddButton url={route(`${resource}.create`)}>
                Tambah
              </AddButton>
            )}
            {hasAnyPermission(allPermissions, [`${resource} import`]) && ( // Tambahkan permission check untuk import
              <ImportButton url={route(`${resource}.import.form`)}> {/* Ganti 'import.form' dengan nama rute Anda */}
                Impor
              </ImportButton>
            )}
          </div>
          <div className="w-full md:w-4/6">
            <Search
              url={route(`${resource}.index`)}
              placeholder="Cari berdasarkan deskripsi atau kategori..."
              filter={filters}
            />
          </div>
        </div>
        <Card title="Daftar Jenis Pelanggaran">
          <Table>
            <Table.Thead>
              <tr>
                <Table.Th>No.</Table.Th>
                <Table.Th>Kategori</Table.Th>
                <Table.Th>Deskripsi</Table.Th>
                <Table.Th>Poin</Table.Th>
                <Table.Th>Tgl Berlaku</Table.Th>
                <Table.Th>Tgl Akhir</Table.Th>
                <Table.Th>Status Aktif</Table.Th>
                {canPerformAnyAction && <Table.Th className="text-right">Aksi</Table.Th>}
              </tr>
            </Table.Thead>
            <Table.Tbody>
              {violationTypes.data.length > 0 ? (
                violationTypes.data.map((item, index) => (
                  <tr key={item.id}>
                    <Table.Td>{violationTypes.from + index}</Table.Td>
                    <Table.Td>{item.kategori}</Table.Td>
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
                <Table.Empty colSpan={canPerformAnyAction ? 8 : 7} message="Tidak ada data jenis pelanggaran." />
              )}
            </Table.Tbody>
          </Table>
        </Card>

        {violationTypes.last_page > 1 && (
          <div className="flex items-center justify-center mt-4">
            <Pagination links={violationTypes.links} />
          </div>
        )}
      </Container>
    </AuthenticatedLayout>
  );
}