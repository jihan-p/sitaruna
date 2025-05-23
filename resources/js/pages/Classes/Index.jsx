// resources/js/Pages/Classes/Index.jsx

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
    const { classes, filters, auth: pageAuth } = usePage().props; // Ambil auth: pageAuth
    const allPermissions = pageAuth.permissions; // Ambil semua izin dari props Inertia

    const routeResourceName = 'classes';

    // Tentukan apakah ada izin untuk aksi apapun (edit atau delete)
    const canPerformAnyAction = hasAnyPermission(allPermissions, [`${routeResourceName} edit`, `${routeResourceName} delete`]);


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Kelas</h2>}
        >
            <Head title={'Manajemen Kelas'} />

            <Container>
                <div className='mb-4 flex items-center justify-between gap-4'>
                    {hasAnyPermission(allPermissions, [`${routeResourceName} create`]) && (
                        <AddButton url={route(`${routeResourceName}.create`)}/>//Tambah Kelas</AddButton>
                        // <AddButton url={route('classes.create')}/>
                    )}
                    <div className='w-full md:w-4/6'>
                        <Search
                            url={route(`${routeResourceName}.index`)}
                            placeholder={'Cari kelas berdasarkan nama atau jurusan...'}
                            filter={filters}
                            showPerPage
                            perPageOptions={[10, 25, 50, classes.total]}
                        />
                    </div>
                </div>

                <Card title={'Daftar Kelas'}>
                    <Table>
                        <Table.Thead>
                            <tr>
                                <Table.Th>No</Table.Th>
                                <Table.Th>Nama Kelas</Table.Th>
                                <Table.Th>Jurusan</Table.Th>
                                {canPerformAnyAction && ( // Header kolom Aksi kondisional
                                    <Table.Th className='text-right'>Aksi</Table.Th>
                                )}
                            </tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {classes?.data?.length > 0 ? (
                                classes.data.map((classItem, i) => (
                                    <tr key={classItem.id}>
                                        <Table.Td>{classes.from + i}</Table.Td>
                                        <Table.Td>{classItem.nama_kelas}</Table.Td>
                                        <Table.Td>{classItem.major?.nama_jurusan || '-'}</Table.Td>
                                        {canPerformAnyAction && ( // Sel kolom Aksi kondisional
                                            <Table.Td className='text-right'>
                                                <div className='flex items-center justify-end gap-2'>
                                                    {hasAnyPermission(allPermissions, [`${routeResourceName} edit`]) && (
                                                        <EditButton url={route(`${routeResourceName}.edit`, classItem.id)} />
                                                    )}
                                                    {hasAnyPermission(allPermissions, [`${routeResourceName} delete`]) && (
                                                        <DeleteButton url={route(`${routeResourceName}.destroy`, classItem.id)} />
                                                    )}
                                                </div>
                                            </Table.Td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <Table.Empty colSpan={canPerformAnyAction ? 4 : 3} message={'Tidak ada data Kelas'} />
                            )}
                        </Table.Tbody>
                    </Table>
                </Card>

                {classes.last_page > 1 && (
                    <div className='flex items-center justify-center mt-4'>
                        <Pagination links={classes.links} />
                    </div>
                )}
            </Container>
        </AuthenticatedLayout>
    );
}
