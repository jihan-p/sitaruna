import React, { useState } from 'react';
import AuthenticatedLayout from '@/templates/AuthenticatedLayout';
import Container from '@/components/atoms/Container';
import Card from '@/components/organisms/Card';
import FormGroup from '@/components/molecules/FormGroup';
import TextInput from '@/components/atoms/TextInput';
import PrimaryButton from '@/components/molecules/PrimaryButton';
import CancelButton from '@/components/molecules/CancelButton';
import { Head, useForm, usePage } from '@inertiajs/react';
import Checkbox from '@/components/atoms/Checkbox'; // Untuk remove_foto_profil
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Edit({ auth }) {
  const { educationStaff: staff } = usePage().props;
  const resource = 'education-staff'; // Gunakan kebab-case

  const { data, setData, post, processing, errors } = useForm({
    nip: staff.nip || '',
    name: staff.name || '',
    gender: staff.gender || '',
    position: staff.position || '',
    email: staff.email || '',
    hire_date: staff.hire_date || '',
    place_of_birth: staff.place_of_birth || '',
    date_of_birth: staff.date_of_birth || '',
    address: staff.address || '',
    phone_number: staff.phone_number || '',
    last_education: staff.last_education || '',
    major_education: staff.major_education || '',
    foto_profil: null,
    remove_foto_profil: false, // Untuk menandai penghapusan foto
    _method: 'put',
  });

  const [hireDate, setHireDate] = useState(staff.hire_date ? new Date(staff.hire_date) : null);
  const [dateOfBirth, setDateOfBirth] = useState(staff.date_of_birth ? new Date(staff.date_of_birth) : null);

  const handleHireDateChange = (date) => {
    setHireDate(date);
    setData('hire_date', date ? date.toISOString().split('T')[0] : '');
  };

  const handleDateOfBirthChange = (date) => {
    setDateOfBirth(date);
    setData('date_of_birth', date ? date.toISOString().split('T')[0] : '');
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    post(route(`${resource}.update`, staff.id));
  };

  return (
    <AuthenticatedLayout
      user={auth.user} // Perbaiki prop di sini
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit PTK</h2>}
    >
      <Head title={`Edit PTK: ${staff.name}`} />

      <Container>
        <Card title="Form Edit PTK">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormGroup label="NIP" error={errors.nip}>
                <TextInput id="nip" name="nip" value={data.nip} onChange={e => setData('nip', e.target.value)} placeholder="Masukkan NIP (jika ada)" />
              </FormGroup>

              <FormGroup label="Nama Lengkap" error={errors.name}>
                <TextInput id="name" name="name" value={data.name} onChange={e => setData('name', e.target.value.toUpperCase())} placeholder="Masukkan Nama Lengkap" />
              </FormGroup>

              <FormGroup label="Jenis Kelamin" error={errors.gender}>
                <select id="gender" name="gender" value={data.gender} onChange={e => setData('gender', e.target.value)} className="w-full px-4 py-2 border text-sm rounded-md focus:outline-none focus:ring-0 bg-white text-gray-700 border-gray-300">
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </FormGroup>

              <FormGroup label="Tempat Lahir" error={errors.place_of_birth}>
                <TextInput id="place_of_birth" name="place_of_birth" value={data.place_of_birth} onChange={e => setData('place_of_birth', e.target.value)} placeholder="Masukkan Tempat Lahir" />
              </FormGroup>

              <FormGroup label="Tanggal Lahir" error={errors.date_of_birth}>
                <DatePicker selected={dateOfBirth} onChange={handleDateOfBirthChange} dateFormat="dd/MM/yyyy" className="w-full px-4 py-2 border text-sm rounded-md focus:outline-none focus:ring-0 bg-white text-gray-700 border-gray-300" placeholderText="DD/MM/YYYY" isClearable showYearDropdown scrollableYearDropdown yearDropdownItemNumber={30} />
              </FormGroup>

              <FormGroup label="No. HP" error={errors.phone_number}>
                <TextInput id="phone_number" name="phone_number" type="tel" value={data.phone_number} onChange={e => setData('phone_number', e.target.value)} placeholder="Masukkan Nomor HP" />
              </FormGroup>

              <FormGroup label="Email" error={errors.email}>
                <TextInput id="email" name="email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="Masukkan Email" />
              </FormGroup>

              <FormGroup label="Jabatan" error={errors.position}>
                <TextInput id="position" name="position" value={data.position} onChange={e => setData('position', e.target.value)} placeholder="Masukkan Jabatan" />
              </FormGroup>

              <FormGroup label="Tanggal Masuk Kerja" error={errors.hire_date}>
                <DatePicker selected={hireDate} onChange={handleHireDateChange} dateFormat="dd/MM/yyyy" className="w-full px-4 py-2 border text-sm rounded-md focus:outline-none focus:ring-0 bg-white text-gray-700 border-gray-300" placeholderText="DD/MM/YYYY" isClearable showYearDropdown scrollableYearDropdown yearDropdownItemNumber={30} />
              </FormGroup>

              <FormGroup label="Pendidikan Terakhir" error={errors.last_education}>
                <TextInput id="last_education" name="last_education" value={data.last_education} onChange={e => setData('last_education', e.target.value)} placeholder="Contoh: S1, SMA" />
              </FormGroup>

              <FormGroup label="Jurusan Pendidikan" error={errors.major_education}>
                <TextInput id="major_education" name="major_education" value={data.major_education} onChange={e => setData('major_education', e.target.value)} placeholder="Contoh: Teknik Informatika" />
              </FormGroup>

              <FormGroup label="Alamat" error={errors.address} className="md:col-span-2">
                <textarea id="address" name="address" value={data.address} onChange={e => setData('address', e.target.value)} rows="3" className="w-full px-4 py-2 border text-sm rounded-md focus:outline-none focus:ring-0 bg-white text-gray-700 border-gray-300" placeholder="Masukkan Alamat Lengkap"></textarea>
              </FormGroup>

              <FormGroup label="Foto Profil" error={errors.foto_profil} className="md:col-span-2">
                <input type="file" onChange={e => setData('foto_profil', e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                {data.foto_profil instanceof File && (
                  <img src={URL.createObjectURL(data.foto_profil)} alt="Preview Foto Baru" className="mt-2 h-32 w-32 object-cover rounded-md" />
                )}
                {!data.foto_profil && staff.foto_profil && !data.remove_foto_profil && (
                  <div className="mt-2">
                    <img src={`/storage/${staff.foto_profil}`} alt="Foto Profil Saat Ini" className="h-32 w-32 object-cover rounded-md" />
                    <Checkbox
                      id="remove_foto_profil"
                      name="remove_foto_profil"
                      label="Hapus foto profil saat ini"
                      checked={data.remove_foto_profil}
                      onChange={e => setData('remove_foto_profil', e.target.checked)}
                      className="mt-2"
                    />
                  </div>
                )}
              </FormGroup>
            </div>

        <div className="flex items-center justify-end gap-2 mt-4">
          <CancelButton url={route(`${resource}.index`)}>Batal</CancelButton>
          <PrimaryButton type="submit" disabled={processing}>Perbarui</PrimaryButton>
            </div>
          </form>
        </Card>
      </Container>
    </AuthenticatedLayout>
  );
}
