// resources/js/Pages/Users/Edit.jsx

import React ,{useEffect, useState }from 'react';
import AuthenticatedLayout from '@/templates/AuthenticatedLayout';
import Container from '@/components/atoms/Container';
import { Head, useForm, usePage } from '@inertiajs/react';
import TextInput from '@/components/atoms/TextInput';
import PrimaryButton from '@/components/molecules/PrimaryButton';
import CancelButton from '@/components/molecules/CancelButton';
import Card from '@/components/organisms/Card';
import FormGroup from '@/components/molecules/FormGroup';
import Select2 from '@/components/molecules/Select2';
import Swal from 'sweetalert2';

export default function Edit({auth}) {

    const { user, roles } = usePage().props;

    const { data, setData, post, errors, processing } = useForm({
        name : user.name,
        email: user.email,
        selectedRoles : user.roles.map(role => role.name),
        filterRole : user.roles.map(role => ({
            value: role.name,
            label: role.name
        })),
        password: '', // Tambahkan state untuk password baru
        password_confirmation: '', // Tambahkan state untuk konfirmasi password baru
        _method: 'put'
    });

    const formattedRoles = roles.map(role => ({
        value: role.name,
        label: role.name
    }));

    const handleSelectedRoles = (selectedOptions) => {
        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setData('selectedRoles', selectedValues);
    }

    const handleUpdateData = async (e) => {
        e.preventDefault();

        // Jika password atau password_confirmation diisi, kirim data password juga
        // Jika tidak, pastikan tidak mengirim bidang password kosong
        const formData = {
            name: data.name,
            email: data.email,
            selectedRoles: data.selectedRoles,
        };

        if (data.password) { // Hanya kirim password jika diisi
            formData.password = data.password;
            formData.password_confirmation = data.password_confirmation;
        }

        post(route('users.update', user.id), {
            data: formData, // Kirim formData yang sudah disesuaikan
            onSuccess: () => {
                Swal.fire({
                    title: 'Success!',
                    text: 'Data updated successfully!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                });
                // Reset password fields setelah sukses update
                setData('password', '');
                setData('password_confirmation', '');
            },
             onError: (errors) => {
                console.error('Validation Errors:', errors);
             }
        });
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit User</h2>}
        >
            <Head title={'Edit Users'}/>
             <Container>
                <Card title={'Edit user'}>
                    <form onSubmit={handleUpdateData}>
                         <div className='mb-4'>
                             <FormGroup label={'Name'} error={errors.name}>
                                 <TextInput
                                     id="name"
                                     name="name"
                                     type={'text'}
                                     value={data.name}
                                     onChange={e => setData('name', e.target.value)}
                                     placeholder="Input name user.."
                                 />
                             </FormGroup>
                         </div>

                        <div className='mb-4'>
                            <FormGroup label={'Email'} error={errors.email}>
                                <TextInput
                                    id="email"
                                    name="email"
                                    type={'email'}
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="Input email user.."
                                />
                            </FormGroup>
                        </div>

                         <div className='mb-4'>
                             <FormGroup label={'Roles'} error={errors.selectedRoles}>
                                 <Select2
                                     options={formattedRoles}
                                     onChange={handleSelectedRoles}
                                     defaultValue={data.filterRole}
                                     placeholder="Pilih Role..."
                                     isMulti={true}
                                 />
                             </FormGroup>
                         </div>

                        {/* Bagian untuk update password */}
                        <div className='mb-4'>
                            <FormGroup label={'New Password'} error={errors.password}>
                                <TextInput
                                    id="password"
                                    name="password"
                                    type={'password'}
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    placeholder="Enter new password (optional)"
                                />
                            </FormGroup>
                        </div>

                        <div className='mb-4'>
                            <FormGroup label={'Confirm New Password'} error={errors.password_confirmation}>
                                <TextInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type={'password'}
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    placeholder="Confirm new password"
                                />
                            </FormGroup>
                        </div>

                    <div className='flex items-center justify-end gap-2'>
                        <CancelButton url={route('users.index')}> Go Back </CancelButton> {/* Atau "Kembali" */}
                        <PrimaryButton type={'submit'} disabled={processing}> Perbarui </PrimaryButton>
                        </div>
                    </form>
                </Card>
            </Container>
        </AuthenticatedLayout>
    );
}
