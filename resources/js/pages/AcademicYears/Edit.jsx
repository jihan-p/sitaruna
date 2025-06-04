import React from 'react';
import AuthenticatedLayout from '@/templates/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

import Container from '@/components/atoms/Container';
import Card from '@/components/organisms/Card';
import FormGroup from '@/components/molecules/FormGroup';
import TextInput from '@/components/atoms/TextInput';
import PrimaryButton from '@/components/molecules/PrimaryButton';
import CancelButton from '@/components/molecules/CancelButton';

export default function Edit({ auth, academicYear }) {
  const routeResourceName = 'academic-years';

  const { data, setData, put, processing, errors } = useForm({
    nama_tahun_ajaran: academicYear.nama_tahun_ajaran || '',
    tahun_mulai: academicYear.tahun_mulai || '',
    tahun_selesai: academicYear.tahun_selesai || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route(`${routeResourceName}.update`, academicYear.id));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Tahun Ajaran</h2>}
    >
      <Head title="Edit Tahun Ajaran" />

      <Container>
        <Card title="Form Edit Tahun Ajaran">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormGroup
              label="Nama Tahun Ajaran"
              error={errors.nama_tahun_ajaran}
            >
              <TextInput
                id="nama_tahun_ajaran"
                name="nama_tahun_ajaran"
                type="text"
                value={data.nama_tahun_ajaran}
                onChange={e => setData('nama_tahun_ajaran', e.target.value)}
                placeholder="Masukkan nama tahun ajaran"
                className="mt-1 block w-full"
              />
            </FormGroup>

            <FormGroup
              label="Tahun Mulai"
              error={errors.tahun_mulai}
            >
              <TextInput
                id="tahun_mulai"
                name="tahun_mulai"
                type="number"
                value={data.tahun_mulai}
                onChange={e => setData('tahun_mulai', e.target.value)}
                placeholder="Masukkan tahun mulai"
                className="mt-1 block w-full"
              />
            </FormGroup>

            <FormGroup
              label="Tahun Selesai"
              error={errors.tahun_selesai}
            >
              <TextInput
                id="tahun_selesai"
                name="tahun_selesai"
                type="number"
                value={data.tahun_selesai}
                onChange={e => setData('tahun_selesai', e.target.value)}
                placeholder="Masukkan tahun selesai"
                className="mt-1 block w-full"
              />
            </FormGroup>

            <div className="flex items-center gap-2 mt-4 justify-end">
              <CancelButton url={route(`${routeResourceName}.index`)}>Batal</CancelButton>
              <PrimaryButton type="submit" disabled={processing}>
                {processing ? 'Memperbarui...' : 'Perbarui'}
              </PrimaryButton>
            </div>
          </form>
        </Card>
      </Container>
    </AuthenticatedLayout>
  );
}
