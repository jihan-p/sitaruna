import React from 'react';
import AuthenticatedLayout from '@/templates/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

import Container from '@/components/atoms/Container';
import Card from '@/components/organisms/Card';
import FormGroup from '@/components/molecules/FormGroup';
import TextInput from '@/components/atoms/TextInput';
import Select2 from '@/components/molecules/Select2';
import Checkbox from '@/components/atoms/Checkbox';
import PrimaryButton from '@/components/molecules/PrimaryButton';
import CancelButton from '@/components/molecules/CancelButton';

export default function Create({ auth, academicYears }) {
  const routeResource = 'semesters';

  const { data, setData, post, processing, errors } = useForm({
    nama_semester: '',
    tahun_ajaran_id: '',
    is_active: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route(`${routeResource}.store`), {
      onError: () => {
        // Fokus atau logika tambahan jika perlu
      },
    });
  };

  // Map academicYears ke options Select2
  const options = academicYears.map((year) => ({
    value: year.id,
    label: year.nama_tahun_ajaran,
  }));

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tambah Semester</h2>}
    >
      <Head title="Tambah Semester" />

      <Container>
        <Card title="Form Tambah Semester">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormGroup
              label="Nama Semester"
              htmlFor="nama_semester"
              error={errors.nama_semester}
            >
              <TextInput
                id="nama_semester"
                name="nama_semester"
                value={data.nama_semester}
                onChange={e => setData('nama_semester', e.target.value)}
                placeholder="Masukkan nama semester"
                className="mt-1 block w-full"
              />
            </FormGroup>

            <FormGroup
              label="Tahun Ajaran"
              htmlFor="tahun_ajaran_id"
              error={errors.tahun_ajaran_id}
            >
              <Select2
                id="tahun_ajaran_id"
                options={options}
                placeholder="Pilih Tahun Ajaran"
                defaultValue={options.find(o => o.value === data.tahun_ajaran_id) || null}
                onChange={option => setData('tahun_ajaran_id', option ? option.value : '')}
                className="mt-1"
              />
            </FormGroup>

            <div className="flex items-center">
              <Checkbox
                id="is_active"
                name="is_active"
                checked={data.is_active}
                onChange={e => setData('is_active', e.target.checked)}
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                Aktif
              </label>
            </div>

            <div className="flex justify-end gap-2">
              <CancelButton url={route(`${routeResource}.index`)}>Batal</CancelButton>
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
