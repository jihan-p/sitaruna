import React, { useState } from 'react'; // Pastikan useState diimpor
import AuthenticatedLayout from '@/templates/AuthenticatedLayout';
import Container from '@/components/atoms/Container';
import Card from '@/components/organisms/Card';
import FormGroup from '@/components/molecules/FormGroup';
import TextInput from '@/components/atoms/TextInput';
import Textarea from '@/components/atoms/Textarea'; // Impor Textarea
import PrimaryButton from '@/components/molecules/PrimaryButton';
import CancelButton from '@/components/molecules/CancelButton';
import Checkbox from '@/components/atoms/Checkbox';
import { Head, useForm, usePage } from '@inertiajs/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function EditViolationType({ auth }) {
  const { violationType } = usePage().props;
  const resource = 'violation-types';

  const { data, setData, post, processing, errors } = useForm({
    kategori: violationType.kategori || '',
    deskripsi: violationType.deskripsi || '',
    poin: violationType.poin || '',
    aktif: violationType.aktif, // Diambil dari DB, sudah boolean
    tanggal_berlaku: violationType.tanggal_berlaku || '',
    tanggal_akhir_berlaku: violationType.tanggal_akhir_berlaku || '',
    _method: 'put', // Penting untuk form update
  });

  const [tanggalBerlaku, setTanggalBerlaku] = useState(
    violationType.tanggal_berlaku ? new Date(violationType.tanggal_berlaku) : null
  );
  const [tanggalAkhirBerlaku, setTanggalAkhirBerlaku] = useState(
    violationType.tanggal_akhir_berlaku ? new Date(violationType.tanggal_akhir_berlaku) : null
  );

  const handleTanggalBerlakuChange = (date) => {
    setTanggalBerlaku(date);
    setData('tanggal_berlaku', date ? date.toISOString().split('T')[0] : '');
  };
  const handleTanggalAkhirBerlakuChange = (date) => {
    setTanggalAkhirBerlaku(date);
    setData('tanggal_akhir_berlaku', date ? date.toISOString().split('T')[0] : '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route(`${resource}.update`, violationType.id), {
      // onSuccess: () => { // Tidak perlu reset di form edit
      //   // Tambahkan notifikasi sukses jika perlu
      // },
    });
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Jenis Pelanggaran</h2>}
    >
      <Head title={`Edit Jenis Pelanggaran: ${violationType.deskripsi}`} />

      <Container>
        <Card title="Form Edit Jenis Pelanggaran">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormGroup label="Kategori Pelanggaran" error={errors.kategori}>
                <TextInput
                  id="kategori"
                  name="kategori"
                  value={data.kategori}
                  onChange={(e) => setData('kategori', e.target.value)}
                  placeholder="Contoh: Pelanggaran Ringan, Sedang, Berat"
                />
              </FormGroup>

              <FormGroup label="Poin Pelanggaran" error={errors.poin}>
                <TextInput
                  id="poin"
                  name="poin"
                  type="number"
                  value={data.poin}
                  onChange={(e) => setData('poin', e.target.value)}
                  placeholder="Masukkan jumlah poin"
                />
              </FormGroup>

              <FormGroup label="Tanggal Mulai Berlaku" error={errors.tanggal_berlaku}>
                <DatePicker
                    selected={tanggalBerlaku}
                    onChange={handleTanggalBerlakuChange}
                    dateFormat="dd/MM/yyyy"
                    className="w-full px-4 py-2 border text-sm rounded-md focus:outline-none focus:ring-0 bg-white text-gray-700 border-gray-300"
                    placeholderText="DD/MM/YYYY"
                    isClearable
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={15} />
              </FormGroup>

              <FormGroup label="Tanggal Akhir Berlaku (Opsional)" error={errors.tanggal_akhir_berlaku}>
                <DatePicker
                    selected={tanggalAkhirBerlaku}
                    onChange={handleTanggalAkhirBerlakuChange}
                    dateFormat="dd/MM/yyyy"
                    className="w-full px-4 py-2 border text-sm rounded-md focus:outline-none focus:ring-0 bg-white text-gray-700 border-gray-300"
                    placeholderText="DD/MM/YYYY"
                    isClearable
                    minDate={tanggalBerlaku}
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={15} />
              </FormGroup>
            </div>

            <FormGroup label="Deskripsi Pelanggaran" error={errors.deskripsi} className="mt-4">
              <Textarea
                id="deskripsi"
                name="deskripsi"
                value={data.deskripsi}
                onChange={(e) => setData('deskripsi', e.target.value)}
                placeholder="Jelaskan jenis pelanggarannya"
              />
            </FormGroup>

            <FormGroup error={errors.aktif} className="mt-4">
              <Checkbox id="aktif" name="aktif" label="Aktifkan Jenis Pelanggaran ini?" checked={data.aktif} onChange={(e) => setData('aktif', e.target.checked)} />
            </FormGroup>

            <div className="flex items-center justify-end gap-2 mt-6">
              <CancelButton url={route(`${resource}.index`)}>Batal</CancelButton>
              <PrimaryButton type="submit" disabled={processing}>Perbarui</PrimaryButton>
            </div>
          </form>
        </Card>
      </Container>
    </AuthenticatedLayout>
  );
}