// resources/js/pages/EducationStaff/Index.jsx
import React from 'react';
import AuthenticatedLayout from '@/templates/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import Table from '@/components/organisms/Table';
import PrimaryButton from '@/components/molecules/PrimaryButton';
import DangerButton from '@/components/molecules/DangerButton';
import EditButton from '@/components/molecules/EditButton';
import AddButton from '@/components/molecules/AddButton';
import Pagination from '@/components/molecules/Pagination';
import Search from '@/components/molecules/Search';
import Container from '@/components/atoms/Container';
import hasAnyPermission from '@/utils/Permissions'; // Import permission helper
import { IconEye } from '@tabler/icons-react'; // Import IconEye if you use it for "Lihat" button

export default function EducationStaffIndex({ auth }) {
    const { educationStaff, filters, can: permissions } = usePage().props; // Get permissions from props
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data PTK ini?')) {
            destroy(route('education-staff.destroy', id));
        }
    };

    const formatJenisKelamin = (gender) => {
        if (gender === 'L') {
            return 'Laki-laki';
        } else if (gender === 'P') {
            return 'Perempuan';
        }
        return '-';
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    const columns = [
        {
            header: 'Foto',
            cell: ({ row }) => (
                row.foto_profil ? (
                    <img
                        src={`/storage/${row.foto_profil}`}
                        alt="Foto Profil"
                        className="w-10 h-10 object-cover rounded-full"
                    />
                ) : (
                    <img
                        src="/images/default-profile.png" // Use your default profile image
                        alt="Default Foto Profil"
                        className="w-10 h-10 object-cover rounded-full"
                    />
                )
            ),
        },
        {
            header: 'NIP',
            accessorKey: 'nip',
        },
        {
            header: 'Nama',
            accessorKey: 'name',
        },
        {
            header: 'Jenis Kelamin',
            accessorKey: 'gender',
            cell: ({ value }) => formatJenisKelamin(value),
        },
        {
            header: 'Jabatan',
            accessorKey: 'position',
        },
        {
            header: 'Email',
            accessorKey: 'email',
        },
        {
            header: 'Tanggal Masuk',
            accessorKey: 'hire_date',
            cell: ({ value }) => formatDate(value),
        },
        {
            header: 'Aksi',
            cell: ({ row }) => (
                <div className="flex space-x-2">
                    {permissions.show && (
                        <Link href={route('education-staff.show', row.id)}>
                            <PrimaryButton title="Lihat"><IconEye size={18} /></PrimaryButton>
                        </Link>
                    )}
                    {permissions.edit && (
                        <Link href={route('education-staff.edit', row.id)}>
                            <EditButton />
                        </Link>
                    )}
                    {permissions.delete && (
                        <DangerButton onClick={() => handleDelete(row.id)}>
                            Hapus
                        </DangerButton>
                    )}
                </div>
            ),
        },
    ];

    const canPerformAnyAction = permissions.show || permissions.edit || permissions.delete;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Data Pendidik dan Tenaga Kependidikan (PTK)</h2>}
        >
            <Head title="Data PTK" />

            <Container>
                <div className="mb-4 flex items-center justify-between gap-4">
                    <Search defaultValue={filters.search} />
                    {permissions.create && (
                        <AddButton href={route('education-staff.create')}>
                            Tambah PTK
                        </AddButton>
                    )}
                </div>
                <Table
                    columns={columns}
                    data={educationStaff.data}
                    // If your Table component handles pagination directly
                    // Otherwise, use the Pagination component separately
                >
                    {!educationStaff.data.length && (
                        <Table.Empty colSpan={canPerformAnyAction ? 8 : 7} message="Tidak ada data Pendidik dan Tenaga Kependidikan." />
                    )}
                </Table>
                {educationStaff.last_page > 1 && (
                    <div className="flex items-center justify-center mt-4">
                        <Pagination links={educationStaff.links} />
                    </div>
                )}
            </Container>
        </AuthenticatedLayout>
    );
}