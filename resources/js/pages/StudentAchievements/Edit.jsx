import React, { useState } from 'react';
import AuthenticatedLayout from '@/templates/AuthenticatedLayout';
import Container from '@/components/atoms/Container';
import Card from '@/components/organisms/Card';
import FormGroup from '@/components/molecules/FormGroup';
import Textarea from '@/components/atoms/Textarea';
import PrimaryButton from '@/components/molecules/PrimaryButton';
import CancelButton from '@/components/molecules/CancelButton';
import Select2 from '@/components/molecules/Select2';
import Checkbox from '@/components/atoms/Checkbox';
import { Head, useForm, usePage } from '@inertiajs/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function EditStudentAchievement({ auth }) {
  const { studentAchievement, students, achievementTypes } = usePage().props;
  const resource = 'student-achievements';

  const { data, setData, post, processing, errors } = useForm({
    student_id: studentAchievement.student_id || '',
    achievement_type_id: studentAchievement.achievement_type_id || '',
    tanggal_prestasi: studentAchievement.tanggal_prestasi || '',
    keterangan_tambahan: studentAchievement.keterangan_tambahan || '',
    bukti_prestasi: null, // Untuk file baru
    remove_bukti_prestasi: false, // Untuk menghapus file lama
    _method: 'put',
  });

  const [tanggalPrestasi, setTanggalPrestasi] = useState(
    studentAchievement.tanggal_prestasi ? new Date(studentAchievement.tanggal_prestasi) : null
  );

  const studentOptions = students.map(student => ({ value: student.id, label: `${student.nit || 'N/A'} - ${student.nama_lengkap}` }));
  const achievementTypeOptions = achievementTypes.map(type => ({ value: type.id, label: `${type.deskripsi} (${type.poin} poin)` }));

  const handleTanggalPrestasiChange = (date) => {
    setTanggalPrestasi(date);
    setData('tanggal_prestasi', date ? date.toISOString().split('T')[0] : '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route(`${resource}.update`, studentAchievement.id), {
      forceFormData: true, // Penting untuk upload file
    });
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Prestasi Taruna</h2>}
    >
      <Head title={`Edit Prestasi: ${studentAchievement.student?.nama_lengkap} - ${studentAchievement.achievement_type?.deskripsi}`} />

      <Container>
        <Card title="Form Edit Prestasi Taruna">
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
                  isDisabled={true} // Biasanya student tidak diubah saat edit prestasi
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

              <FormGroup label="Bukti Prestasi" error={errors.bukti_prestasi} className="md:col-span-2">
                <input
                  type="file"
                  id="bukti_prestasi"
                  name="bukti_prestasi"
                  onChange={e => setData('bukti_prestasi', e.target.files[0])}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {data.bukti_prestasi instanceof File && (
                  <img src={URL.createObjectURL(data.bukti_prestasi)} alt="Preview Bukti Baru" className="mt-2 h-32 w-auto object-contain rounded-md" />
                )}
                {!data.bukti_prestasi && studentAchievement.bukti_prestasi && !data.remove_bukti_prestasi && (
                  <div className="mt-2">
                    <a href={`/storage/${studentAchievement.bukti_prestasi}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Lihat Bukti Saat Ini</a>
                    <Checkbox
                      id="remove_bukti_prestasi"
                      name="remove_bukti_prestasi"
                      label="Hapus bukti prestasi saat ini"
                      checked={data.remove_bukti_prestasi}
                      onChange={e => setData('remove_bukti_prestasi', e.target.checked)}
                      className="mt-2"
                    />
                  </div>
                )}
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
                {processing ? 'Memperbarui...' : 'Perbarui'}
              </PrimaryButton>
            </div>
          </form>
        </Card>
      </Container>
    </AuthenticatedLayout>
  );
}