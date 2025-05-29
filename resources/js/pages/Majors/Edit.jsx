import React from 'react';
import AuthenticatedLayout from '@/templates/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

import Container from '@/components/atoms/Container';
import Card from '@/components/organisms/Card';
import FormGroup from '@/components/molecules/FormGroup';
import TextInput from '@/components/atoms/TextInput';

import PrimaryButton from '@/components/molecules/PrimaryButton';
import CancelButton from '@/components/molecules/CancelButton';

export default function Edit({ auth, major }) {
  const routeResourceName = 'majors';

  const { data, setData, put, errors, processing } = useForm({
    nama_jurusan: major.nama_jurusan || '',
  });

  // Fungsi title case dengan pengecualian kata sambung
  const toTitleCase = (str) => {
    const smallWords = ['dan', 'di', 'ke', 'dari', 'yang', 'untuk', 'dengan', 'atau', 'pada'];
    return str
      .toLowerCase()
      .split(' ')
      .map((word, index) => {
        if (index === 0 || !smallWords.includes(word)) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        }
        return word;
      })
      .join(' ');
  };

  const handleUpdateData = (e) => {
    e.preventDefault();
    put(route(`${routeResourceName}.update`, major.id), {
      onSuccess: () => {
        console.log("Data Jurusan berhasil diperbarui!");
      },
      onError: (errors) => {
        console.error("Ada error saat memperbarui data Jurusan:", errors);
      },
      onFinish: () => {
        console.log("Proses submit form selesai.");
      }
    });
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Jurusan</h2>}
    >
      <Head title="Edit Jurusan" />

      <Container>
        <Card title="Form Edit Jurusan">
          <form onSubmit={handleUpdateData}>
            <FormGroup label="Nama Jurusan" error={errors.nama_jurusan}>
              <TextInput
                id="nama_jurusan"
                name="nama_jurusan"
                type="text"
                value={data.nama_jurusan}
                onChange={e => setData('nama_jurusan', toTitleCase(e.target.value))}
                placeholder="Input Nama Jurusan.."
                className="mt-1 block w-full"
              />
            </FormGroup>

        <div className="flex items-center justify-end gap-2 mt-4">
          <CancelButton url={route(`${routeResourceName}.index`)}>Kembali</CancelButton>
          <PrimaryButton type="submit" disabled={processing}>Perbarui</PrimaryButton>
            </div>
          </form>
        </Card>
      </Container>
    </AuthenticatedLayout>
  );
}
