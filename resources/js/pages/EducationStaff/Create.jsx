// resources/js/pages/EducationStaff/Create.jsx
import React, { useState } from 'react';
import AuthenticatedLayout from '@/templates/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import FormGroup from '@/components/molecules/FormGroup';
import InputLabel from '@/components/atoms/InputLabel';
import TextInput from '@/components/atoms/TextInput';
import InputError from '@/components/atoms/InputError';
import PrimaryButton from '@/components/molecules/PrimaryButton';
import CancelButton from '@/components/molecules/CancelButton';
import Container from '@/components/atoms/Container';
import Checkbox from '@/components/atoms/Checkbox';
import Select2 from '@/components/molecules/Select2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Card from '@/components/organisms/Card'; // Assuming you want to wrap forms in cards

export default function EducationStaffCreate({ auth }) {
    const { roles } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        nip: '',
        name: '',
        gender: '',
        place_of_birth: '',
        date_of_birth: null, // Change to null for DatePicker
        address: '',
        phone_number: '',
        email: '',
        position: '',
        hire_date: null, // Change to null for DatePicker
        last_education: '',
        major_education: '',
        foto_profil: null, // For file input
        create_user_account: false,
        password: '',
        password_confirmation: '',
        role_id: '',
    });

    const handleDateOfBirthChange = (date) => {
        setData('date_of_birth', date ? date.toISOString().split('T')[0] : null);
    };

    const handleHireDateChange = (date) => {
        setData('hire_date', date ? date.toISOString().split('T')[0] : null);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('education-staff.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tambah Pendidik dan Tenaga Kependidikan (PTK)</h2>}
        >
            <Head title="Tambah PTK" />

            <Container>
                <Card title="Form Tambah PTK">
                    <form onSubmit={submit} className="space-y-6">
                        <FormGroup label="Nama Lengkap" htmlFor="name" error={errors.name}>
                            <TextInput
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                        </FormGroup>

                        <FormGroup label="NIP (Nomor Induk Pegawai)" htmlFor="nip" error={errors.nip}>
                            <TextInput
                                id="nip"
                                type="text"
                                name="nip"
                                value={data.nip}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('nip', e.target.value)}
                            />
                        </FormGroup>

                        <FormGroup label="Jenis Kelamin" htmlFor="gender" error={errors.gender}>
                            <select
                                id="gender"
                                name="gender"
                                value={data.gender}
                                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full"
                                onChange={(e) => setData('gender', e.target.value)}
                            >
                                <option value="">Pilih Jenis Kelamin</option>
                                <option value="L">Laki-laki</option>
                                <option value="P">Perempuan</option>
                            </select>
                        </FormGroup>

                        <FormGroup label="Tempat Lahir" htmlFor="place_of_birth" error={errors.place_of_birth}>
                            <TextInput
                                id="place_of_birth"
                                type="text"
                                name="place_of_birth"
                                value={data.place_of_birth}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('place_of_birth', e.target.value)}
                            />
                        </FormGroup>

                        <FormGroup label="Tanggal Lahir" htmlFor="date_of_birth" error={errors.date_of_birth}>
                            <DatePicker
                                id="date_of_birth"
                                selected={data.date_of_birth ? new Date(data.date_of_birth) : null}
                                onChange={handleDateOfBirthChange}
                                dateFormat="yyyy-MM-dd"
                                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full"
                                placeholderText="YYYY-MM-DD"
                            />
                        </FormGroup>

                        <FormGroup label="Alamat" htmlFor="address" error={errors.address}>
                            <TextInput
                                id="address"
                                type="text"
                                name="address"
                                value={data.address}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('address', e.target.value)}
                            />
                        </FormGroup>

                        <FormGroup label="Nomor Telepon" htmlFor="phone_number" error={errors.phone_number}>
                            <TextInput
                                id="phone_number"
                                type="text"
                                name="phone_number"
                                value={data.phone_number}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('phone_number', e.target.value)}
                            />
                        </FormGroup>

                        <FormGroup label="Email" htmlFor="email" error={errors.email}>
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                        </FormGroup>

                        <FormGroup label="Jabatan" htmlFor="position" error={errors.position}>
                            <TextInput
                                id="position"
                                type="text"
                                name="position"
                                value={data.position}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('position', e.target.value)}
                            />
                        </FormGroup>

                        <FormGroup label="Tanggal Masuk" htmlFor="hire_date" error={errors.hire_date}>
                            <DatePicker
                                id="hire_date"
                                selected={data.hire_date ? new Date(data.hire_date) : null}
                                onChange={handleHireDateChange}
                                dateFormat="yyyy-MM-dd"
                                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full"
                                placeholderText="YYYY-MM-DD"
                            />
                        </FormGroup>

                        <FormGroup label="Pendidikan Terakhir" htmlFor="last_education" error={errors.last_education}>
                            <TextInput
                                id="last_education"
                                type="text"
                                name="last_education"
                                value={data.last_education}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('last_education', e.target.value)}
                            />
                        </FormGroup>

                        <FormGroup label="Jurusan Pendidikan" htmlFor="major_education" error={errors.major_education}>
                            <TextInput
                                id="major_education"
                                type="text"
                                name="major_education"
                                value={data.major_education}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('major_education', e.target.value)}
                            />
                        </FormGroup>

                        <FormGroup label="Foto Profil" error={errors.foto_profil}>
                            <input
                                id="foto_profil"
                                name="foto_profil"
                                type="file"
                                onChange={e => setData('foto_profil', e.target.files[0])}
                                className="w-full"
                            />
                            {data.foto_profil instanceof File && (
                                <img
                                    src={URL.createObjectURL(data.foto_profil)}
                                    alt="Preview Foto Profil"
                                    className="mt-2 w-full max-w-sm md:max-w-xs lg:max-w-sm h-auto rounded-md shadow"
                                />
                            )}
                        </FormGroup>

                        <div className="block mt-4">
                            <label className="flex items-center">
                                <Checkbox
                                    name="create_user_account"
                                    checked={data.create_user_account}
                                    onChange={(e) => setData('create_user_account', e.target.checked)}
                                />
                                <span className="ms-2 text-sm text-gray-600">Buat Akun Pengguna untuk PTK ini</span>
                            </label>
                        </div>

                        {data.create_user_account && (
                            <>
                                <FormGroup label="Password" htmlFor="password" error={errors.password}>
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('password', e.target.value)}
                                        required={data.create_user_account}
                                    />
                                </FormGroup>

                                <FormGroup label="Konfirmasi Password" htmlFor="password_confirmation" error={errors.password_confirmation}>
                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required={data.create_user_account}
                                    />
                                </FormGroup>

                                {roles && (
                                    <FormGroup label="Pilih Role Pengguna" htmlFor="role_id" error={errors.role_id}>
                                        <Select2
                                            id="role_id"
                                            name="role_id"
                                            value={data.role_id}
                                            onChange={(e) => setData('role_id', e.target.value)}
                                            options={roles.map(role => ({ value: role.id, label: role.name }))}
                                            placeholder="Pilih Role"
                                            required={data.create_user_account}
                                        />
                                    </FormGroup>
                                )}
                            </>
                        )}


                        <div className="flex items-center justify-end mt-4">
                            <CancelButton href={route('education-staff.index')} className="me-4">
                                Batal
                            </CancelButton>
                            <PrimaryButton type="submit" disabled={processing}>
                                Simpan Data PTK
                            </PrimaryButton>
                        </div>
                    </form>
                </Card>
            </Container>
        </AuthenticatedLayout>
    );
}