// resources/js/Pages/Users/Create.jsx (Setelah penerapan FormGroup)

import React from 'react';
// Import komponen Atomic Design dari lokasi baru
import AuthenticatedLayout from '@/templates/AuthenticatedLayout'; // Import template
import Container from '@/components/atoms/Container'; // Jika Container tetap di Components (sesuaikan jika dipindah)
import { Head, useForm, usePage } from '@inertiajs/react';
// import Input from '@/components/atoms/Input'; // Input.jsx sudah digabung ke TextInput (Langkah 2)
import TextInput from '@/components/atoms/TextInput'; // Import TextInput (Langkah 2)
import PrimaryButton from '@/components/molecules/PrimaryButton'; // Jika sudah jadi molekul (Langkah 1)
import CancelButton from '@/components/molecules/CancelButton'; // Jika sudah jadi molekul (Langkah 1)
import Card from '@/components/organisms/Card'; // Jika Card sudah jadi organisme (Langkah 7)
import FormGroup from '@/components/molecules/FormGroup'; // Import molekul FormGroup (Langkah 3)
import Select2 from '@/components/molecules/Select2'; // Import molekul Select2 (Langkah 8)
import Swal from 'sweetalert2';

export default function Create({auth}) {

    // destruct roles from usepage props
    const { roles } = usePage().props;

    // define state with helper inertia
    const { data, setData, post, errors, processing } = useForm({
        name : '',
        email: '',
        selectedRoles : [], // Array untuk menyimpan nama-nama peran yang dipilih
        password: '',
        password_confirmation: ''
    });

    // Format data roles dari backend untuk prop options Select2
    const formattedRoles = roles.map(role => ({
        value: role.name, // Nilai yang akan disimpan
        label: role.name  // Teks yang ditampilkan
    }));

    // define method handleSelectedroles saat Select2 berubah
    const handleSelectedRoles = (selectedOptions) => {
        // selectedOptions adalah array objek {value, label} dari react-select
        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : []; // Ekstrak hanya valuenya
        setData('selectedRoles', selectedValues); // Update state form dengan array of strings (nama peran)
    }

    // define method handleStoreData
    const handleStoreData = async (e) => {
        e.preventDefault();

        post(route('users.store'), {
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create User</h2>} // Sesuaikan header
        >
            <Head title={'Create Users'}/>
            <Container> {/* Asumsi Container tetap di Components atau dipindah */}
                <Card title={'Create new user'}> {/* Asumsi Card adalah organisme (Langkah 7) */}
                    <form onSubmit={handleStoreData}>
                        {/* Gunakan FormGroup untuk input Nama */}
                        <div className='mb-4'> {/* Tambahkan margin bawah jika diperlukan di sini atau di dalam FormGroup */}
                            <FormGroup label={'Name'} error={errors.name}>
                                <TextInput
                                    id="name" // Tambahkan ID
                                    name="name" // Tambahkan name
                                    type={'text'}
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Input name user.."
                                    // props lain seperti isFocused bisa ditambahkan di sini
                                />
                            </FormGroup>
                        </div>

                        {/* Gunakan FormGroup untuk input Email */}
                        <div className='mb-4'> {/* Tambahkan margin bawah */}
                            <FormGroup label={'Email'} error={errors.email}>
                                <TextInput
                                    id="email" // Tambahkan ID
                                    name="email" // Tambahkan name
                                    type={'email'}
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="Input email user.."
                                    // props lain
                                />
                            </FormGroup>
                        </div>

                         {/* Gunakan FormGroup untuk pemilihan Roles */}
                         <div className='mb-4'> {/* Tambahkan margin bawah */}
                             {/* FormGroup membungkus Select2 */}
                             <FormGroup label={'Roles'} error={errors.selectedRoles}> {/* Passing error untuk field selectedRoles */}
                                 <Select2
                                     options={formattedRoles} // Gunakan data roles yang sudah diformat
                                     onChange={handleSelectedRoles} // Gunakan handler yang dibuat
                                     placeholder="Pilih Role..."
                                     isMulti={true} // Aktifkan multi-select
                                     // defaultValue={...} // Tidak ada nilai default di form create
                                     // className, id, name bisa diteruskan
                                 />
                             </FormGroup>
                         </div>


                        {/* Gunakan FormGroup untuk input Password */}
                        <div className='mb-4'> {/* Tambahkan margin bawah */}
                            <FormGroup label={'Password'} error={errors.password}>
                                <TextInput
                                    id="password" // Tambahkan ID
                                    name="password" // Tambahkan name
                                    type={'password'}
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    placeholder="Input password user.."
                                    // props lain
                                />
                            </FormGroup>
                        </div>

                        {/* Gunakan FormGroup untuk input Password Confirmation */}
                        <div className='mb-4'> {/* Tambahkan margin bawah */}
                            <FormGroup label={'Password Confirmation'} error={errors.password_confirmation}>
                                <TextInput
                                    id="password_confirmation" // Tambahkan ID
                                    name="password_confirmation" // Tambahkan name
                                    type={'password'}
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    placeholder="Input password confirmation..."
                                    // props lain
                                />
                            </FormGroup>
                        </div>

                    <div className='flex items-center justify-end gap-2'>
                        <CancelButton url={route('users.index')}> Go Back </CancelButton> {/* Atau "Kembali" */}
                        <PrimaryButton type={'submit'} disabled={processing}> Simpan </PrimaryButton>
                        </div>
                    </form>
                </Card>
            </Container>
        </AuthenticatedLayout>
    );
}
