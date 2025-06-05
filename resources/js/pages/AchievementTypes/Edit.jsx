import React, { useState } from 'react';
import AuthenticatedLayout from '@/templates/AuthenticatedLayout';
import Container from '@/components/atoms/Container';
import Card from '@/components/organisms/Card';
import FormGroup from '@/components/molecules/FormGroup';
import TextInput from '@/components/atoms/TextInput';
import Textarea from '@/components/atoms/Textarea';
import PrimaryButton from '@/components/molecules/PrimaryButton';
import CancelButton from '@/components/molecules/CancelButton';
import Checkbox from '@/components/atoms/Checkbox';
import { Head, useForm, usePage } from '@inertiajs/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function EditAchievementType({ auth }) {
  const { achievementType } = usePage().props;
  const resource = 'achievement-types';

  const { data, setData, post, processing, errors } = useForm({
    deskripsi: achievementType.deskripsi || '',
    poin: achievementType.poin || '',
    aktif: achievementType.aktif,
    tanggal_berlaku: achievementType.tanggal_berlaku || '',
    tanggal_akhir_berlaku: achievementType.tanggal_akhir_berlaku || '',
    _method: 'put',
  });

  const [tanggalBerlaku, setTanggalBerlaku] = useState(
    achievementType.tanggal_berlaku ? new Date(achievementType.tanggal_berlaku) : null
  );
  const [tanggalAkhirBerlaku, setTanggalAkhirBerlaku] = useState(
    achievementType.tanggal_akhir_berlaku ? new Date(achievementType.tanggal_akhir_berlaku) : null
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
    post(route(`${resource}.update`, achievementType.id));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Jenis Prestasi</h2>}
    >
      <Head title={`Edit Jenis Prestasi: ${achievementType.deskripsi}`} />

      <Container>
        <Card title="Form Edit Jenis Prestasi">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormGroup label="Poin Prestasi" error={errors.poin} className="md:col-span-2">
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

            <FormGroup label="Deskripsi Prestasi" error={errors.deskripsi} className="mt-4">
              <Textarea
                id="deskripsi"
                name="deskripsi"
                value={data.deskripsi}
                onChange={(e) => setData('deskripsi', e.target.value)}
                placeholder="Jelaskan jenis prestasinya"
              />
            </FormGroup>

            <FormGroup error={errors.aktif} className="mt-4">
              <Checkbox id="aktif" name="aktif" label="Aktifkan Jenis Prestasi ini?" checked={data.aktif} onChange={(e) => setData('aktif', e.target.checked)} />
            </FormGroup>

            <div className="flex items-center justify-end gap-2 mt-6">
              <CancelButton url={route(`${resource}.index`)}>Batal</CancelButton>
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