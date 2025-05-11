// resources/js/Pages/Permissions/Index.jsx
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
    const { permissions, filters } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Permissions</h2>}
        >
            <Head title={'Permissions'}/>
            <Container>
                <div className='mb-4 flex items-center justify-between gap-4'>
                    {hasAnyPermission(['permissions create']) &&
                        <AddButton url={route('permissions.create')}/>
                    }
                    <div className='w-full md:w-4/6'>
                        <Search url={route('permissions.index')} placeholder={'Search permissions data by name...'} filter={filters}/>
                    </div>
                </div>

                <Card title={'Permissions'}>
                    <Table>
                        <Table.Thead>{<tr><Table.Th>#</Table.Th><Table.Th>Permission Name</Table.Th><Table.Th className='text-right'>Action</Table.Th></tr>}</Table.Thead><Table.Tbody>
                            {permissions && permissions.data && permissions.data.length > 0 ? (
                                permissions.data.map((permission, i) => (
                                    <tr key={permission.id || i}>
                                        <Table.Td>{permissions.from + i}</Table.Td>
                                        <Table.Td>{permission.name}</Table.Td>
                                        <Table.Td className='text-right'>
                                            <div className='flex items-center justify-end gap-2'>
                                                {hasAnyPermission(['permissions edit']) && (
                                                    <EditButton url={route('permissions.edit', permission.id)}/>
                                                )}
                                                {hasAnyPermission(['permissions delete']) && (
                                                    <DeleteButton url={route('permissions.destroy', permission.id)}/>
                                                )}
                                            </div>
                                        </Table.Td>
                                    </tr>
                                ))
                            ) : (
                                <Table.Empty colSpan={3} message={'No data available'}/>
                            )}
                        </Table.Tbody>
                    </Table>
                </Card>

                {permissions && permissions.last_page > 1 && (
                    <div className='flex items-center justify-center mt-4'>
                        <Pagination links={permissions.links}/>
                    </div>
                )}
            </Container>
        </AuthenticatedLayout>
    );
}