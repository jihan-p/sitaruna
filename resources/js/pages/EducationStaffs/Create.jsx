import React, { useState } from 'react';
import AuthenticatedLayout from '@/templates/AuthenticatedLayout';
import Container from '@/components/atoms/Container';
import Card from '@/components/organisms/Card';
import FormGroup from '@/components/molecules/FormGroup';
import TextInput from '@/components/atoms/TextInput';
import PrimaryButton from '@/components/molecules/PrimaryButton';
import CancelButton from '@/components/molecules/CancelButton';
import { Head, useForm } from '@inertiajs/react';
import Select2 from '@/components/molecules/Select2'; // Jika Anda ingin menggunakan Select2 untuk Roles
import Checkbox from '@/components/atoms/Checkbox'; // Untuk create_user_account
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Create({ auth, roles }) { // Tambahkan roles sebagai prop
  const resource = 'education-staff';

  const { data, setData, post, processing, errors } = useForm({
    nip: '',
    name: '',
    gender: '',
    position: '',
    email: '',
    hire_date: '',
    place_of_birth: '',
    date_of_birth: '',
    address: '',
    phone_number: '',
    last_education: '',
    major_education: '',
    foto_profil: null,
    create_user_account: false,
    password: '',
    role_id: '',
  });

  const [hireDate, setHireDate] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState(null);

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
    post(route(`${resource}.store`));
  };

  return (
    <AuthenticatedLayout
      user={auth.user} // Perbaiki prop di sini
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tambah PTK</h2>}
    >
      <Head title="Tambah PTK" />

      <Container>
        <Card title="Form Tambah PTK">
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
                  <img src={URL.createObjectURL(data.foto_profil)} alt="Preview Foto Profil" className="mt-2 h-32 w-32 object-cover rounded-md" />
                )}
              </FormGroup>
            </div>

            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Akun Pengguna</h3>
              <FormGroup error={errors.create_user_account}>
                <Checkbox
                  id="create_user_account"
                  name="create_user_account"
                  label="Buatkan Akun Pengguna untuk PTK ini?"
                  checked={data.create_user_account}
                  onChange={e => setData('create_user_account', e.target.checked)}
                />
              </FormGroup>

              {data.create_user_account && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <FormGroup label="Password Akun" error={errors.password}>
                    <TextInput id="password" name="password" type="password" value={data.password} onChange={e => setData('password', e.target.value)} placeholder="Masukkan Password Akun" />
                  </FormGroup>
                  <FormGroup label="Role Akun" error={errors.role_id}>
                    <select id="role_id" name="role_id" value={data.role_id} onChange={e => setData('role_id', e.target.value)} className="w-full px-4 py-2 border text-sm rounded-md focus:outline-none focus:ring-0 bg-white text-gray-700 border-gray-300">
                      <option value="">Pilih Role</option>
                      {roles && roles.map(role => (
                        <option key={role.id} value={role.id}>{role.name}</option>
                      ))}
                    </select>
                  </FormGroup>
                </div>
              )}
            </div>

        <div className="flex items-center justify-end gap-2 mt-4">
          <CancelButton url={route(`${resource}.index`)}>Batal</CancelButton>
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
