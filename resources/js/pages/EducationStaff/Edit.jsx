// resources/js/pages/EducationStaff/Edit.jsx
import React, { useState } from 'react';
import AuthenticatedLayout from '@/templates/AuthenticatedLayout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import FormGroup from '@/components/molecules/FormGroup';
import InputLabel from '@/components/atoms/InputLabel';
import TextInput from '@/components/atoms/TextInput';
import InputError from '@/components/atoms/InputError';
import PrimaryButton from '@/components/molecules/PrimaryButton';
import CancelButton from '@/components/molecules/CancelButton';
import Container from '@/components/atoms/Container';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Card from '@/components/organisms/Card';

export default function EducationStaffEdit({ auth }) {
    const { educationStaff } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        nip: educationStaff.nip || '',
        name: educationStaff.name || '',
        gender: educationStaff.gender || '',
        place_of_birth: educationStaff.place_of_birth || '',
        date_of_birth: educationStaff.date_of_birth ? new Date(educationStaff.date_of_birth) : null,
        address: educationStaff.address || '',
        phone_number: educationStaff.phone_number || '',
        email: educationStaff.email || '',
        position: educationStaff.position || '',
        hire_date: educationStaff.hire_date ? new Date(educationStaff.hire_date) : null,
        last_education: educationStaff.last_education || '',
        major_education: educationStaff.major_education || '',
        foto_profil: null, // For new file upload
        _method: 'put', // Important for Inertia PUT request with file uploads
        foto_profil_removed: false, // Flag to indicate if existing photo is removed
    });

    const handleDateOfBirthChange = (date) => {
        setData('date_of_birth', date);
    };

    const handleHireDateChange = (date) => {
        setData('hire_date', date);
    };

    const handlePhotoRemove = () => {
        setData({ ...data, foto_profil: null, foto_profil_removed: true });
    };

    const submit = (e) => {
        e.preventDefault();
        // Use post with _method: 'put' for file uploads in Inertia
        post(route('education-staff.update', educationStaff.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Pendidik dan Tenaga Kependidikan (PTK)</h2>}
        >
            <Head title="Edit PTK" />

            <Container>
                <Card title="Form Edit PTK">
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
                                selected={data.date_of_birth}
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
                                selected={data.hire_date}
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
                                    alt="Preview"
                                    className="mt-2 w-full max-w-sm md:max-w-xs lg:max-w-sm h-auto rounded-md shadow"
                                />
                            )}
                            {educationStaff.foto_profil && data.foto_profil === null && !data.foto_profil_removed && (
                                <div className="mt-2">
                                    <img
                                        src={`/storage/${educationStaff.foto_profil}`}
                                        alt="Foto Lama"
                                        className="w-full max-w-sm md:max-w-xs lg:max-w-sm h-auto rounded-md shadow"
                                    />
                                    <button
                                        type="button"
                                        onClick={handlePhotoRemove}
                                        className="mt-2 text-red-600 hover:text-red-900 text-sm"
                                    >
                                        Hapus Foto Profil
                                    </button>
                                </div>
                            )}
                        </FormGroup>

                        <div className="flex items-center justify-end mt-4">
                            <CancelButton href={route('education-staff.index')} className="me-4">
                                Batal
                            </CancelButton>
                            <PrimaryButton type="submit" disabled={processing}>
                                Perbarui Data PTK
                            </PrimaryButton>
                        </div>
                    </form>
                </Card>
            </Container>
        </AuthenticatedLayout>
    );
}