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

export default function EditStudentViolation({ auth }) {
  const { studentViolation, students, violationTypes } = usePage().props;
  const resource = 'student-violations';

  const getInitialTime = (datetimeString) => {
    if (!datetimeString) return '';
    const date = new Date(datetimeString);
    if (isNaN(date.getTime())) return ''; // Menangani string tanggal yang tidak valid
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const { data, setData, post, processing, errors } = useForm({
    student_id: studentViolation.student_id || '',
    violation_type_id: studentViolation.violation_type_id || '',
    tanggal_pelanggaran: studentViolation.tanggal_pelanggaran || '',
    jam_pelanggaran: getInitialTime(studentViolation.jam_pelanggaran),
    keterangan_kejadian: studentViolation.keterangan_kejadian || '',
    bukti_pelanggaran: null, // Untuk file baru
    remove_bukti_pelanggaran: false,
    _method: 'put',
  });

  const parseTimeStringToDate = (timeString) => {
    if (!timeString) return null;
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  };

  const [tanggalPelanggaran, setTanggalPelanggaran] = useState(
    studentViolation.tanggal_pelanggaran ? new Date(studentViolation.tanggal_pelanggaran) : null
  );
  const [jamPelanggaranState, setJamPelanggaranState] = useState(
    parseTimeStringToDate(data.jam_pelanggaran)
  );

  const studentOptions = students.map(student => ({ value: student.id, label: `${student.nit || 'N/A'} - ${student.nama_lengkap}` }));
  const violationTypeOptions = violationTypes.map(type => ({ value: type.id, label: `(${type.kategori || 'N/A'}) ${type.deskripsi} - ${type.poin} poin` }));

  const handleTanggalPelanggaranChange = (date) => {
    setTanggalPelanggaran(date);
    setData('tanggal_pelanggaran', date ? date.toISOString().split('T')[0] : '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route(`${resource}.update`, studentViolation.id), {
      forceFormData: true,
    });
  };

  const handleJamPelanggaranChange = (time) => {
    setJamPelanggaranState(time);
    setData('jam_pelanggaran', time ? `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}` : '');
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Pelanggaran Taruna</h2>}
    >
      <Head title={`Edit Pelanggaran: ${studentViolation.student?.nama_lengkap || 'N/A'}`} />

      <Container>
        <Card title="Form Edit Pelanggaran Taruna">
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
                <DatePicker
                  id="jam_pelanggaran"
                  selected={jamPelanggaranState}
                  onChange={handleJamPelanggaranChange}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Jam"
                  dateFormat="HH:mm" // Format tampilan
                  timeFormat="HH:mm" // Format untuk picker
                  placeholder="JJ:MM"
                  className="w-1/2 px-4 py-2 border text-sm rounded-md focus:outline-none focus:ring-0 bg-white text-gray-700 border-gray-300"
                  wrapperClassName="w-full"
                  isClearable
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
                  alt="Preview Bukti Baru"
                  className="mt-2 h-32 object-contain rounded-md border"
                />
              )}
              {!data.bukti_pelanggaran && studentViolation.bukti_pelanggaran && !data.remove_bukti_pelanggaran && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">Bukti saat ini:</p>
                  <a href={`/storage/${studentViolation.bukti_pelanggaran}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                    Lihat Bukti
                  </a>
                  <Checkbox
                    id="remove_bukti_pelanggaran"
                    name="remove_bukti_pelanggaran"
                    label="Hapus bukti saat ini"
                    checked={data.remove_bukti_pelanggaran}
                    onChange={e => setData('remove_bukti_pelanggaran', e.target.checked)}
                    className="mt-2"
                  />
                </div>
              )}
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