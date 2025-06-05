// resources/js/Pages/Permissions/Create.jsx (Setelah penerapan FormGroup dan perbaikan impor Input)

import React from 'react';
// Import komponen Atomic Design dari lokasi baru
import AuthenticatedLayout from '@/templates/AuthenticatedLayout'; // Import template (Langkah 10)
import Container from '@/components/atoms/Container'; // Import atom Container
import { Head, useForm } from '@inertiajs/react';
// import Input from '@/components/atoms/Input'; // <-- HAPUS IMPOR INI - Input.jsx sudah tidak digunakan
import TextInput from '@/components/atoms/TextInput'; // <-- PASTIKAN IMPOR INI ADA (Langkah 2)
import PrimaryButton from '@/components/molecules/PrimaryButton'; // Import molekul PrimaryButton (Langkah 1)
import CancelButton from '@/components/molecules/CancelButton'; // Import molekul CancelButton (Langkah 1)
import Card from '@/components/organisms/Card'; // Import organisme Card (Langkah 7)
import FormGroup from '@/components/molecules/FormGroup'; // Import molekul FormGroup (Langkah 3)

import Swal from 'sweetalert2';
// Utilitas tetap di Utils
import hasAnyPermission from '@/utils/Permissions'; // <-- PASTIKAN PATH INI BENAR (huruf kecil)


export default function Create({auth}) {

    // define state with helper inertia
    const { data, setData, post, errors, processing } = useForm({
        name : '',
    });

    // define method handleStoreData
    const handleStoreData = async (e) => {
        e.preventDefault();

        post(route('permissions.store'), {
            onSuccess: () => {
                Swal.fire({
                    title: 'Success!',
                    text: 'Data created successfully!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                });
            },
             onError: (errors) => {
                console.error('Validation Errors:', errors);
                // Inertia secara otomatis akan mengisi errors state, FormGroup akan menampilkannya
             }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create Permission</h2>} // Sesuaikan header
        >
            <Head title={'Create Permissions'}/>
            <Container> {/* Menggunakan atom Container */}
                <Card title={'Create new permission'}> {/* Menggunakan organisme Card */}
                    <form onSubmit={handleStoreData}>
                        {/* Gunakan FormGroup untuk input Nama Permission */}
                        <div className='mb-4'> {/* Tambahkan margin bawah jika diperlukan di sini atau di dalam FormGroup */}
                            <FormGroup label={'Permission Name'} error={errors.name}>
                                {/* Gunakan TextInput sebagai children dari FormGroup */}
                                <TextInput // <-- Gunakan TextInput BUKAN Input
                                    id="name" // Tambahkan ID
                                    name="name" // Tambahkan name
                                    type={'text'}
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Input permission name.."
                                    // props lain seperti isFocused bisa ditambahkan di sini
                                />
                            </FormGroup>
                        </div>

                    <div className='flex items-center justify-end gap-2'>
                        <CancelButton url={route('permissions.index')}> Go Back </CancelButton> {/* Atau "Kembali" */}
                        <PrimaryButton type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </PrimaryButton>
                        </div>
                    </form>
                </Card>
            </Container>
        </AuthenticatedLayout>
    );
}
