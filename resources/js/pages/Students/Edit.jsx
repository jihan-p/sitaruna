import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AuthenticatedLayout from '@/templates/AuthenticatedLayout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';

import Container from '@/components/atoms/Container';
import Card from '@/components/organisms/Card';
import FormGroup from '@/components/molecules/FormGroup';
import TextInput from '@/components/atoms/TextInput';
import PrimaryButton from '@/components/molecules/PrimaryButton';import CancelButton from '@/components/molecules/CancelButton';

export default function Edit({ auth }) {
  const { student } = usePage().props;

  const { data, setData, post, errors, processing } = useForm({
    nisn: student.nisn || '',
    nit: student.nit || '',
    nama_lengkap: student.nama_lengkap || '',
    jenis_kelamin: student.jenis_kelamin || '',
    tempat_lahir: student.tempat_lahir || '',
    tanggal_lahir: student.tanggal_lahir || null,
    agama: student.agama || '',
    no_hp: student.no_hp || '',
    email: student.email || '',
    alamat: student.alamat || '',
    status_akun: student.status_akun || '',
    foto_profil: null,
    _method: 'put',
  });

  const routeResource = 'students';

  const handleDateChange = (date) => {
    const formatted = date ? date.toISOString().split('T')[0] : null;
    setData('tanggal_lahir', formatted);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route(`${routeResource}.update`, student.id));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Peserta Didik</h2>}
    >
      <Head title={`Edit Peserta Didik: ${student.nama_lengkap}`} />
      <Container>
        <Card title="Edit Data Peserta Didik">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <FormGroup label="NISN" error={errors.nisn}>
              <TextInput
                id="nisn"
                name="nisn"
                value={data.nisn}
                onChange={e => setData('nisn', e.target.value)}
                placeholder="Masukkan NISN"
              />
            </FormGroup>

            <FormGroup label="NIT" error={errors.nit}>
              <TextInput
                id="nit"
                name="nit"
                value={data.nit}
                onChange={e => setData('nit', e.target.value)}
                placeholder="Masukkan NIT"
              />
            </FormGroup>

            <FormGroup label="Nama Lengkap" error={errors.nama_lengkap}>
              <TextInput
                id="nama_lengkap"
                name="nama_lengkap"
                value={data.nama_lengkap}
                onChange={e => setData('nama_lengkap', e.target.value.toUpperCase())}
                placeholder="Masukkan nama lengkap"
              />
            </FormGroup>

            <FormGroup label="Jenis Kelamin" error={errors.jenis_kelamin}>
              <select
                id="jenis_kelamin"
                name="jenis_kelamin"
                value={data.jenis_kelamin}
                onChange={e => setData('jenis_kelamin', e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm w-full"
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </FormGroup>

            <FormGroup label="Tempat Lahir" error={errors.tempat_lahir}>
              <TextInput
                id="tempat_lahir"
                name="tempat_lahir"
                value={data.tempat_lahir}
                onChange={e =>
                  setData(
                    'tempat_lahir',
                    e.target.value.replace(/\w\S*/g, w =>
                      w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
                    )
                  )
                }
                placeholder="Masukkan tempat lahir"
              />
            </FormGroup>

            <FormGroup label="Tanggal Lahir" error={errors.tanggal_lahir}>
              <DatePicker
                selected={data.tanggal_lahir ? new Date(data.tanggal_lahir) : null}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm w-full"
                placeholderText="DD/MM/YYYY"
                isClearable
              />
            </FormGroup>

            <FormGroup label="Agama" error={errors.agama}>
              <TextInput
                id="agama"
                name="agama"
                value={data.agama}
                onChange={e =>
                    setData(
                      'agama',
                      e.target.value.replace(/\w\S*/g, w =>
                        w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
                      )
                    )
                  }
                placeholder="Masukkan agama"
              />
            </FormGroup>

            <FormGroup label="Nomor HP" error={errors.no_hp}>
              <TextInput
                id="no_hp"
                name="no_hp"
                type="tel"
                value={data.no_hp}
                onChange={e => setData('no_hp', e.target.value)}
                placeholder="Masukkan nomor HP"
              />
            </FormGroup>

            <FormGroup label="Email" error={errors.email}>
              <TextInput
                id="email"
                name="email"
                type="email"
                value={data.email}
                onChange={e => setData('email', e.target.value)}
                placeholder="Masukkan email"
              />
            </FormGroup>

            <FormGroup label="Alamat" error={errors.alamat}>
              <textarea
                id="alamat"
                name="alamat"
                value={data.alamat}
                onChange={e => setData('alamat', e.target.value)}
                placeholder="Masukkan alamat"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm w-full p-2"
                rows={3}
              />
            </FormGroup>

            <FormGroup label="Status Akun" error={errors.status_akun}>
              <select
                id="status_akun"
                name="status_akun"
                value={data.status_akun}
                onChange={e => setData('status_akun', e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm w-full"
              >
                <option value="">Pilih Status Akun</option>
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
                <option value="Lulus">Lulus</option>
                <option value="Mutasi">Mutasi</option>
                <option value="Keluar">Keluar</option>
              </select>
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
              {student.foto_profil && data.foto_profil === null && (
                <img
                  src={`/storage/${student.foto_profil}`}
                  alt="Foto lama"
                  className="mt-2 w-full max-w-sm md:max-w-xs lg:max-w-sm h-auto rounded-md shadow"
                />
              )}
            </FormGroup>

            <div className="flex items-center justify-end gap-2 mt-4">
                <CancelButton url={route(`${routeResource}.index`)}>Kembali</CancelButton>
                <PrimaryButton type="submit" disabled={processing}>Perbarui</PrimaryButton>
            </div>
          </form>
        </Card>
      </Container>
    </AuthenticatedLayout>
  );
}
