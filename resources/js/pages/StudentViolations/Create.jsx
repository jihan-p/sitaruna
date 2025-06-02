import React, { useState } from 'react';
import AuthenticatedLayout from '@/templates/AuthenticatedLayout';
import Container from '@/components/atoms/Container';
import Card from '@/components/organisms/Card';
import FormGroup from '@/components/molecules/FormGroup';
import TextInput from '@/components/atoms/TextInput';
import Textarea from '@/components/atoms/Textarea';
import PrimaryButton from '@/components/molecules/PrimaryButton';
import CancelButton from '@/components/molecules/CancelButton';
import Select2 from '@/components/molecules/Select2'; // Untuk pilihan Taruna dan Jenis Pelanggaran
import { Head, useForm, usePage } from '@inertiajs/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function CreateStudentViolation({ auth }) {
  const { students, violationTypes } = usePage().props;
  const resource = 'student-violations';

  const { data, setData, post, processing, errors, reset } = useForm({
    student_id: '',
    violation_type_id: '',
    tanggal_pelanggaran: '',
    jam_pelanggaran: '',
    keterangan_kejadian: '',
    bukti_pelanggaran: null,
  });

  const [tanggalPelanggaran, setTanggalPelanggaran] = useState(null);

  const studentOptions = students.map(student => ({ value: student.id, label: `${student.nit || 'N/A'} - ${student.nama_lengkap}` }));
  const violationTypeOptions = violationTypes.map(type => ({ value: type.id, label: `(${type.kategori}) ${type.deskripsi} - ${type.poin} poin` }));

  const handleTanggalPelanggaranChange = (date) => {
    setTanggalPelanggaran(date);
    setData('tanggal_pelanggaran', date ? date.toISOString().split('T')[0] : '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route(`${resource}.store`), {
      forceFormData: true,
      onSuccess: () => {
        reset();
        setTanggalPelanggaran(null);
        // Tambahkan notifikasi sukses jika perlu
      },
    });
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tambah Pelanggaran Taruna</h2>}
    >
      <Head title="Tambah Pelanggaran Taruna" />

      <Container>
        <Card title="Form Tambah Pelanggaran Taruna">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormGroup label="Pilih Taruna" error={errors.student_id}>
                <Select2
                  id="student_id"
                  options={studentOptions}
                  value={studentOptions.find(option => option.value === data.student_id)}
                  onChange={option => setData('student_id', option ? option.value : '')}
                  placeholder="Cari Taruna..."
                  isClearable
                />
              </FormGroup>

              <FormGroup label="Jenis Pelanggaran" error={errors.violation_type_id}>
                <Select2
                  id="violation_type_id"
                  options={violationTypeOptions}
                  value={violationTypeOptions.find(option => option.value === data.violation_type_id)}
                  onChange={option => setData('violation_type_id', option ? option.value : '')}
                  placeholder="Pilih Jenis Pelanggaran..."
                  isClearable
                />
              </FormGroup>

              <FormGroup label="Tanggal Pelanggaran" error={errors.tanggal_pelanggaran}>
                <DatePicker
                  selected={tanggalPelanggaran}
                  onChange={handleTanggalPelanggaranChange}
                  dateFormat="dd/MM/yyyy"
                  className="w-full px-4 py-2 border text-sm rounded-md focus:outline-none focus:ring-0 bg-white text-gray-700 border-gray-300"
                  placeholderText="DD/MM/YYYY"
                  isClearable
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={15}
                />
              </FormGroup>

              <FormGroup label="Jam Pelanggaran (Opsional)" error={errors.jam_pelanggaran}>
                <TextInput
                  id="jam_pelanggaran"
                  type="time"
                  value={data.jam_pelanggaran}
                  onChange={(e) => setData('jam_pelanggaran', e.target.value)}
                  placeholder="JJ:MM"
                  className="w-full"
                />
              </FormGroup>
            </div>

            <FormGroup label="Keterangan Kejadian (Opsional)" error={errors.keterangan_kejadian} className="mt-4">
              <Textarea
                id="keterangan_kejadian"
                value={data.keterangan_kejadian}
                onChange={(e) => setData('keterangan_kejadian', e.target.value)}
                placeholder="Jelaskan detail kejadian pelanggaran"
                rows="3"
              />
            </FormGroup>

            <FormGroup label="Bukti Pelanggaran (Opsional)" error={errors.bukti_pelanggaran} className="mt-4">
              <input
                type="file"
                id="bukti_pelanggaran"
                onChange={(e) => setData('bukti_pelanggaran', e.target.files[0])}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {data.bukti_pelanggaran && typeof data.bukti_pelanggaran === 'object' && (
                <img
                  src={URL.createObjectURL(data.bukti_pelanggaran)}
                  alt="Preview Bukti"
                  className="mt-2 h-32 object-contain rounded-md border"
                />
              )}
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