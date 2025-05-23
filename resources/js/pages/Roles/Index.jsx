// resources/js/Pages/Roles/Index.jsx

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


export default function Index({auth}) {

    // Ambil roles, filters, dan auth dari usePage().props secara tidak bersyarat
    const { roles, filters, auth: pageAuth } = usePage().props;
    // Dapatkan semua izin pengguna secara tidak bersyarat
    const allPermissions = pageAuth.permissions;

    // Definisikan resource untuk konsistensi
    const resource = 'roles';

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Roles</h2>}
        >
            <Head title={'Roles'}/>
            <Container>
                <div className='mb-4 flex items-center justify-between gap-4'>
                    {/* Teruskan allPermissions ke hasAnyPermission */}
                    {hasAnyPermission(allPermissions, [`${resource} create`]) &&
                        <AddButton url={route('roles.create')}/>
                    }
                    <div className='w-full md:w-4/6'>
                        <Search url={route('roles.index')} placeholder={'Search roles data by name...'} filter={filters}/>
                    </div>
                </div>

                <Card title={'Roles'}>
                    <Table>
                        <Table.Thead>{<tr><Table.Th>#</Table.Th><Table.Th>Role Name</Table.Th><Table.Th>Permissions</Table.Th><Table.Th className='text-right'>Action</Table.Th></tr>}</Table.Thead><Table.Tbody>
                            {roles && roles.data && roles.data.length > 0 ? (
                                roles.data.map((role, i) => (
                                    <tr key={role.id || i}>
                                        <Table.Td>{roles.from + i}</Table.Td>
                                        <Table.Td>{role.name}</Table.Td>
                                        <Table.Td>
                                             <div className="flex items-center gap-2 flex-wrap">
                                                {role.name === "super-admin" ? (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-sky-100 text-sky-700">
                                                        all-permissions
                                                    </span>
                                                ) : (
                                                    role.permissions && Array.isArray(role.permissions) && role.permissions.map(
                                                        (permission, permIndex) => (
                                                            <span
                                                                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-sky-100 text-sky-700"
                                                                key={permission.id || permission.name || permIndex}
                                                            >
                                                                {permission.name}
                                                            </span>
                                                        )
                                                    )
                                                )}
                                            </div>
                                        </Table.Td>
                                        <Table.Td className='text-right'>
                                            <div className='flex items-center justify-end gap-2'>
                                                {/* Teruskan allPermissions ke hasAnyPermission */}
                                                {hasAnyPermission(allPermissions, [`${resource} edit`]) && (
                                                     <EditButton url={route(`${resource}.edit`, role.id)}/>
                                                )}
                                                {/* Teruskan allPermissions ke hasAnyPermission */}
                                                 {hasAnyPermission(allPermissions, [`${resource} delete`]) && (
                                                     <DeleteButton url={route(`${resource}.destroy`, role.id)}/>
                                                 )}
                                            </div>
                                        </Table.Td>
                                    </tr>
                                ))
                            ) : (
                                <Table.Empty colSpan={4} message={'No data available'}>
                                </Table.Empty>
                            )}
                        </Table.Tbody>
                    </Table>
                </Card>

                {roles && roles.last_page > 1 && (
                    <div className='flex items-center justify-center mt-4'>
                        <Pagination links={roles.links}/>
                    </div>
                )}
            </Container>
        </AuthenticatedLayout>
    );
}
