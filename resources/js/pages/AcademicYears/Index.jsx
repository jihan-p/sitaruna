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
    const { academicYearsPaginated, filters, auth: pageAuth } = usePage().props;
    const allPermissions = pageAuth.permissions; // Ambil semua izin dari props Inertia

    const resource = 'academic-years';

    // Tentukan apakah ada izin untuk aksi apapun (edit atau delete)
    const canPerformAnyAction = hasAnyPermission(allPermissions, [`${resource} edit`, `${resource} delete`]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Tahun Ajaran</h2>}
        >
            <Head title="Tahun Ajaran" />

            <Container>
                <div className="mb-4 flex items-center justify-between gap-4">
                    {hasAnyPermission(allPermissions, [`${resource} create`]) && (
                        <AddButton url={route(`${resource}.create`)} />
                    )}
                    <div className="w-full md:w-4/6">
                        <Search
                            url={route(`${resource}.index`)}
                            placeholder="Cari Tahun Ajaran...."
                            filter={filters}
                        />
                    </div>
                </div>

                <Card title="Daftar Tahun Ajaran">
                    <Table>
                        <Table.Thead>
                            <tr>
                                <Table.Th>#</Table.Th>
                                <Table.Th>Nama Tahun Ajaran</Table.Th>
                                <Table.Th>Tahun Mulai</Table.Th>
                                <Table.Th>Tahun Selesai</Table.Th>
                                {canPerformAnyAction && (
                                    <Table.Th className="text-right">Aksi</Table.Th>
                                )}
                            </tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {academicYearsPaginated.data && academicYearsPaginated.data.length > 0 ? (
                                academicYearsPaginated.data.map((year, i) => (
                                    <tr key={year.id || i}>
                                        <Table.Td>{academicYearsPaginated.from + i}</Table.Td>
                                        <Table.Td>{year.nama_tahun_ajaran}</Table.Td>
                                        <Table.Td>{year.tahun_mulai}</Table.Td>
                                        <Table.Td>{year.tahun_selesai}</Table.Td>
                                        {canPerformAnyAction && (
                                            <Table.Td className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {hasAnyPermission(allPermissions, [`${resource} edit`]) && (
                                                        <EditButton url={route(`${resource}.edit`, year.id)} />
                                                    )}
                                                    {hasAnyPermission(allPermissions, [`${resource} delete`]) && (
                                                        <DeleteButton url={route(`${resource}.destroy`, year.id)} />
                                                    )}
                                                </div>
                                            </Table.Td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <Table.Empty colSpan={canPerformAnyAction ? 5 : 4} message="Tidak ada data Tahun Ajaran." />
                            )}
                        </Table.Tbody>
                    </Table>
                </Card>

                {academicYearsPaginated.last_page > 1 && (
                    <div className="flex items-center justify-center mt-4">
                        <Pagination links={academicYearsPaginated.links} />
                    </div>
                )}
            </Container>
        </AuthenticatedLayout>
    );
}
