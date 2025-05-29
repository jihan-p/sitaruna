import React, { useState } from 'react';
import AuthenticatedLayout from '@/templates/AuthenticatedLayout';
import Container from '@/components/atoms/Container';
import Card from '@/components/organisms/Card';
import FormGroup from '@/components/molecules/FormGroup';
import TextInput from '@/components/atoms/TextInput';
import PrimaryButton from '@/components/molecules/PrimaryButton';
import CancelButton from '@/components/molecules/CancelButton';
import { Head, useForm, usePage } from '@inertiajs/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Edit({ auth }) {
  const { educationStaff: staff } = usePage().props;
  const resource = 'education_staff';

  const { data, setData, post, processing, errors } = useForm({
    nip: staff.nip || '',
    name: staff.name || '',
    gender: staff.gender || '',
    position: staff.position || '',
    email: staff.email || '',
    hire_date: staff.hire_date || '',
    foto_profil: null,
    _method: 'put',
  });

  const [hireDate, setHireDate] = useState(staff.hire_date ? new Date(staff.hire_date) : null);

  const handleDateChange = (date) => {
    setHireDate(date);
    setData('hire_date', date ? date.toISOString().split('T')[0] : '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route(`${resource}.update`, staff.id));
  };

  return (
    <AuthenticatedLayout
      auth={auth}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit PTK</h2>}
    >
      <Head title={`Edit PTK: ${staff.name}`} />

      <Container>
        <Card title="Form Edit PTK">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <FormGroup label="NIP" error={errors.nip}>
              <TextInput id="nip" name="nip" value={data.nip} onChange={e => setData('nip', e.target.value)} />
            </FormGroup>

            <FormGroup label="Nama Lengkap" error={errors.name}>
              <TextInput id="name" name="name" value={data.name} onChange={e => setData('name', e.target.value.toUpperCase())} />
            </FormGroup>

            <FormGroup label="Jenis Kelamin" error={errors.gender}>
              <select id="gender" name="gender" value={data.gender} onChange={e => setData('gender', e.target.value)} className="w-full rounded-md border-gray-300">
                <option value="">Pilih</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </FormGroup>

            <FormGroup label="Jabatan" error={errors.position}>
              <TextInput id="position" name="position" value={data.position} onChange={e => setData('position', e.target.value)} />
            </FormGroup>

            <FormGroup label="Email" error={errors.email}>
              <TextInput id="email" name="email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} />
            </FormGroup>

            <FormGroup label="Tanggal Masuk" error={errors.hire_date}>
              <DatePicker selected={hireDate} onChange={handleDateChange} dateFormat="dd/MM/yyyy" className="w-full rounded-md border-gray-300" placeholderText="DD/MM/YYYY" isClearable />
            </FormGroup>

            <FormGroup label="Foto Profil" error={errors.foto_profil}>
              <input type="file" onChange={e => setData('foto_profil', e.target.files[0])} className="w-full" />
              {data.foto_profil instanceof File && (
                <img src={URL.createObjectURL(data.foto_profil)} alt="Preview" className="mt-2 w-full max-w-xs rounded-md" />
              )}
              {staff.foto_profil && data.foto_profil === null && (
                <img src={`/storage/${staff.foto_profil}`} alt="Foto lama" className="mt-2 w-full max-w-xs rounded-md" />
              )}
            </FormGroup>

            <div className="flex items-center gap-2 mt-4">
              <PrimaryButton type="submit" disabled={processing}>Simpan Perubahan</PrimaryButton>
              <CancelButton url={route(`${resource}.index`)}>Batal</CancelButton>
            </div>
          </form>
        </Card>
      </Container>
    </AuthenticatedLayout>
  );
}
