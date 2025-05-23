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
import { Head, usePage, router } from '@inertiajs/react';
import hasAnyPermission from '@/utils/Permissions';

export default function Index({ auth }) {
    const { enrollments, filters, flash = {}, auth: pageAuth } = usePage().props;
    const allPermissions = pageAuth.permissions;

    const resource = 'enrollments';

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            router.delete(route(`${resource}.destroy`, id), {
                onSuccess: () => {
                    // Handle success, e.g., show flash message
                },
                onError: () => {
                    // Handle error
                }
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Pendaftaran</h2>}
        >
            <Head title="Pendaftaran" />

            <Container>
                {flash.success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
                        <span className="font-semibold">Sukses:</span> {flash.success}
                    </div>
                )}

                <div className="mb-4 flex items-center justify-between gap-4">
                    {hasAnyPermission(allPermissions, [`${resource} create`]) && (
                        <AddButton url={route('enrollments.create')} />
                    )}
                    <div className="w-full md:w-4/6">
                        <Search
                            url={route('enrollments.index')}
                            placeholder="Cari siswa, kelas, tahun ajaran, semester..."
                            filter={filters}
                        />
                    </div>
                </div>

                <Card title="Data Pendaftaran">
                    <Table>
                        <Table.Thead>
                            <tr>
                                <Table.Th>#</Table.Th>
                                <Table.Th>NISN</Table.Th>
                                <Table.Th>Nama Siswa</Table.Th>
                                <Table.Th>Kelas</Table.Th>
                                <Table.Th>Jurusan</Table.Th>
                                <Table.Th>Tahun Ajaran</Table.Th>
                                <Table.Th>Semester</Table.Th>
                                <Table.Th>No. Absen</Table.Th>
                                <Table.Th className="text-right">Aksi</Table.Th>
                            </tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {enrollments?.data?.length > 0 ? (
                                enrollments.data.map((item, index) => (
                                    <tr key={item.id}>
                                        <Table.Td>{enrollments.from + index}</Table.Td>
                                        <Table.Td>{item.student.nisn}</Table.Td>
                                        <Table.Td>{item.student.nama_lengkap}</Table.Td>
                                        <Table.Td>{item.class.nama_kelas}</Table.Td>
                                        <Table.Td>{item.class.major?.nama_jurusan}</Table.Td>
                                        <Table.Td>{item.academic_year.nama_tahun_ajaran}</Table.Td>
                                        <Table.Td>{item.semester.nama_semester}</Table.Td>
                                        <Table.Td>{item.no_absen}</Table.Td>
                                        <Table.Td className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Mengembalikan kondisi hasAnyPermission */}
                                                {hasAnyPermission(allPermissions, [`${resource} edit`]) && (
                                                    <EditButton url={route(`${resource}.edit`, item.id)} />
                                                )}
                                                {/* Mengembalikan kondisi hasAnyPermission */}
                                                {hasAnyPermission(allPermissions, [`${resource} delete`]) && (
                                                    <DeleteButton url={route(`${resource}.destroy`, item.id)} />
                                                )}
                                            </div>
                                        </Table.Td>
                                    </tr>
                                ))
                            ) : (
                                <Table.Empty colSpan={9} message="Tidak ada data tersedia." />
                            )}
                        </Table.Tbody>
                    </Table>
                </Card>

                {enrollments?.last_page > 1 && (
                    <div className="flex items-center justify-center mt-4">
                        <Pagination links={enrollments.links} />
                    </div>
                )}
            </Container>
        </AuthenticatedLayout>
    );
}
