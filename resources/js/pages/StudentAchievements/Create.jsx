import React, { useState } from 'react';
import AuthenticatedLayout from '@/templates/AuthenticatedLayout';
import Container from '@/components/atoms/Container';
import Card from '@/components/organisms/Card';
import FormGroup from '@/components/molecules/FormGroup';
import Textarea from '@/components/atoms/Textarea';
import PrimaryButton from '@/components/molecules/PrimaryButton';
import CancelButton from '@/components/molecules/CancelButton';
import Select2 from '@/components/molecules/Select2';
import { Head, useForm, usePage } from '@inertiajs/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function CreateStudentAchievement({ auth }) {
  const { students, achievementTypes } = usePage().props;
  const resource = 'student-achievements';

  const { data, setData, post, processing, errors, reset } = useForm({
    student_id: '',
    achievement_type_id: '',
    tanggal_prestasi: '',
    keterangan_tambahan: '',
    bukti_prestasi: null,
  });

  const [tanggalPrestasi, setTanggalPrestasi] = useState(null);

  const studentOptions = students.map(student => ({ value: student.id, label: `${student.nit || 'N/A'} - ${student.nama_lengkap}` }));
  const achievementTypeOptions = achievementTypes.map(type => ({ value: type.id, label: `${type.deskripsi} (${type.poin} poin)` }));

  const handleTanggalPrestasiChange = (date) => {
    setTanggalPrestasi(date);
    setData('tanggal_prestasi', date ? date.toISOString().split('T')[0] : '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route(`${resource}.store`), {
      forceFormData: true, // Penting untuk upload file
      onSuccess: () => {
        reset();
        setTanggalPrestasi(null);
        // Tambahkan notifikasi sukses jika perlu
      },
    });
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tambah Prestasi Taruna</h2>}
    >
      <Head title="Tambah Prestasi Taruna" />

      <Container>
        <Card title="Form Tambah Prestasi Taruna">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormGroup label="Pilih Taruna" error={errors.student_id}>
                <Select2
                  id="student_id"
                  name="student_id"
                  options={studentOptions}
                  placeholder="Cari NIT atau Nama Taruna..."
                  onChange={option => setData('student_id', option ? option.value : '')}
                  value={studentOptions.find(option => option.value === data.student_id)}
                />
              </FormGroup>

              <FormGroup label="Jenis Prestasi" error={errors.achievement_type_id}>
                <Select2
                  id="achievement_type_id"
                  name="achievement_type_id"
                  options={achievementTypeOptions}
                  placeholder="Pilih Jenis Prestasi..."
                  onChange={option => setData('achievement_type_id', option ? option.value : '')}
                  value={achievementTypeOptions.find(option => option.value === data.achievement_type_id)}
                />
              </FormGroup>

              <FormGroup label="Tanggal Prestasi" error={errors.tanggal_prestasi}>
                <DatePicker
                  selected={tanggalPrestasi}
                  onChange={handleTanggalPrestasiChange}
                  dateFormat="dd/MM/yyyy"
                  className="w-full px-4 py-2 border text-sm rounded-md focus:outline-none focus:ring-0 bg-white text-gray-700 border-gray-300"
                  placeholderText="DD/MM/YYYY"
                  isClearable
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={15}
                />
              </FormGroup>

              <FormGroup label="Bukti Prestasi (Opsional)" error={errors.bukti_prestasi} className="md:col-span-2">
                <input
                  type="file"
                  id="bukti_prestasi"
                  name="bukti_prestasi"
                  onChange={e => setData('bukti_prestasi', e.target.files[0])}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </FormGroup>
            </div>

            <FormGroup label="Keterangan Tambahan (Opsional)" error={errors.keterangan_tambahan} className="mt-4">
              <Textarea
                id="keterangan_tambahan"
                name="keterangan_tambahan"
                value={data.keterangan_tambahan}
                onChange={(e) => setData('keterangan_tambahan', e.target.value)}
                placeholder="Jelaskan detail prestasi jika perlu"
                rows="3"
              />
            </FormGroup>

            <div className="flex items-center justify-end gap-2 mt-6">
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