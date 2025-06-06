// resources/js/Pages/Users/Index.jsx
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
    // Call usePage() unconditionally to get all props, including auth.permissions
    const { users, filters, auth: pageAuth } = usePage().props;
    const allPermissions = pageAuth.permissions; // Get permissions unconditionally

    const resource = 'users'; // Define resource for consistency

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Users</h2>}
        >
            <Head title={'Users'}/>
            <Container>
                <div className='mb-4 flex items-center justify-between gap-4'>
                    {/* Pass allPermissions to hasAnyPermission */}
                    {hasAnyPermission(allPermissions, [`${resource} create`]) &&
                        <AddButton url={route(`${resource}.create`)}>
                            Tambah User
                        </AddButton>
                    }
                    <div className='w-full md:w-4/6'>
                        <Search url={route('users.index')} placeholder={'Search users data by name...'} filter={filters}/>
                    </div>
                </div>

                <Card title={'Users'}>
                    <Table>
                        <Table.Thead>{<tr><Table.Th>#</Table.Th><Table.Th>Name</Table.Th><Table.Th>Email</Table.Th><Table.Th>Roles</Table.Th><Table.Th className='text-right'>Action</Table.Th></tr>}</Table.Thead><Table.Tbody>
                            {users && users.data && users.data.length > 0 ? (
                                users.data.map((user, i) => (
                                    <tr key={user.id || i}>
                                        <Table.Td>{users.from + i}</Table.Td>
                                        <Table.Td>{user.name}</Table.Td>
                                        <Table.Td>{user.email}</Table.Td>
                                        <Table.Td>
                                            {user.roles && Array.isArray(user.roles) && user.roles.map(role => (
                                                <span key={role.id || role.name} className="inline-block bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full mr-1">
                                                    {role.name}
                                                </span>
                                            ))}
                                        </Table.Td>
                                        <Table.Td className='text-right'>
                                            <div className='flex items-center justify-end gap-2'>
                                                {/* Pass allPermissions to hasAnyPermission */}
                                                {hasAnyPermission(allPermissions, [`${resource} edit`]) && (
                                                    !user.roles.some(role => role.name === 'admin' || role.name === 'super-admin') && <EditButton url={route('users.edit', user.id)}/>
                                                )}
                                                {/* Pass allPermissions to hasAnyPermission */}
                                                {hasAnyPermission(allPermissions, [`${resource} delete`]) && (
                                                    !user.roles.some(role => role.name === 'admin' || role.name === 'super-admin') && <DeleteButton url={route('users.destroy', user.id)}/>
                                                )}
                                            </div>
                                        </Table.Td>
                                    </tr>
                                ))
                            ) : (
                                <Table.Empty colSpan={5} message={'No data available'}/>
                            )}
                        </Table.Tbody>
                    </Table>
                </Card>

                {users && users.last_page > 1 && (
                    <div className='flex items-center justify-center mt-4'>
                        <Pagination links={users.links}/>
                    </div>
                )}
            </Container>
        </AuthenticatedLayout>
    );
}
