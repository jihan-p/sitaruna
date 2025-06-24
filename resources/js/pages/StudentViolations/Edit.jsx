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
  const { studentViolation, incidentViolations, students, violationTypes } = usePage().props;
  const resource = 'student-violations';

  const initialViolationEntry = {
    violation_type_id: '',
    keterangan_kejadian: '',
    bukti_pelanggaran: null,
  };

  const initialViolations = incidentViolations.map(v => ({
    id: v.id,
    violation_type_id: v.violation_type_id,
    keterangan_kejadian: v.keterangan_kejadian || '',
    bukti_pelanggaran: null,
    existing_bukti_pelanggaran: v.bukti_pelanggaran,
    remove_bukti_pelanggaran: false,
  }));

  const getInitialTime = (datetimeString) => {
    if (!datetimeString) return '';
    const date = new Date(datetimeString);
    if (isNaN(date.getTime())) return ''; // Menangani string tanggal yang tidak valid
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const { data, setData, post, processing, errors, transform } = useForm({
    student_id: studentViolation.student_id || '',
    tanggal_pelanggaran: studentViolation.tanggal_pelanggaran || '',
    jam_pelanggaran: getInitialTime(studentViolation.jam_pelanggaran),
    violations: initialViolations.length > 0 ? initialViolations : [{ ...initialViolationEntry, id: `new_${Date.now()}` }],
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

  const handleJamPelanggaranChange = (time) => {
    setJamPelanggaranState(time);
    setData('jam_pelanggaran', time ? `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}` : '');
  };

  const handleViolationChange = (index, field, value) => {
    const updatedViolations = data.violations.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setData('violations', updatedViolations);
  };

  const handleViolationFileChange = (index, file) => {
    const updatedViolations = data.violations.map((item, i) =>
      i === index ? { ...item, bukti_pelanggaran: file } : item
    );
    setData('violations', updatedViolations);
  };

  const addViolationEntry = () => {
    setData('violations', [...data.violations, { ...initialViolationEntry, id: `new_${Date.now()}` }]);
  };

  const removeViolationEntry = (index) => {
    if (data.violations.length > 1) {
      const updatedViolations = data.violations.filter((_, i) => i !== index);
      setData('violations', updatedViolations);
    }
  };

  // Membersihkan data sebelum dikirim ke backend
  transform((data) => ({
    ...data,
    violations: data.violations.map(v => {
      const newV = { ...v };
      // Hapus ID sementara untuk entri baru
      if (typeof newV.id !== 'number') {
        delete newV.id;
      }
      // Hapus properti helper frontend
      delete newV.existing_bukti_pelanggaran;
      return newV;
    })
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Karena ada file, Inertia akan otomatis menggunakan `multipart/form-data`
    post(route(`${resource}.update`, studentViolation.id));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Pelanggaran Taruna</h2>}
    >
      <Head title={`Edit Pelanggaran: ${studentViolation.student?.nama_lengkap || 'Taruna'}`} />

      <Container>
        <Card title="Form Edit Pelanggaran Taruna">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <FormGroup label="Pilih Taruna" error={errors.student_id}>
                <Select2
                  id="student_id"
                  options={studentOptions}
                  value={studentOptions.find(option => option.value === data.student_id)}
                  onChange={option => setData('student_id', option ? option.value : '')}
                  placeholder="Cari Taruna..."
                  isClearable={false} // Sebaiknya tidak bisa diubah saat edit insiden
                  isDisabled={true}
                />
              </FormGroup>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

              <FormGroup label="Jam Pelanggaran (Opsional)" error={errors.jam_pelanggaran} className="md:col-span-1">
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
            {/* Baris untuk Pelapor */}
            <div className="grid grid-cols-1 gap-4">
              <FormGroup label="Pelapor">
                <input
                  type="text"
                  value={auth.user.name}
                  disabled
                  className="w-full px-4 py-2 border text-sm rounded-md bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed"
                />
              </FormGroup>
            </div>

            <hr className="my-6 border-gray-300" />

            {data.violations.map((violation, index) => (
              <div key={violation.id} className="p-4 mb-4 border border-gray-200 rounded-md relative bg-gray-50">
                {data.violations.length > 1 && (
                  <button type="button" onClick={() => removeViolationEntry(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors" title="Hapus Pelanggaran Ini">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                  </button>
                )}
                <h3 className="text-md font-semibold mb-3 text-gray-700">Pelanggaran #{index + 1}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormGroup label="Jenis Pelanggaran" error={errors[`violations.${index}.violation_type_id`]}>
                    <Select2 id={`violation_type_id_${index}`} options={violationTypeOptions} value={violationTypeOptions.find(option => option.value === violation.violation_type_id)} onChange={option => handleViolationChange(index, 'violation_type_id', option ? option.value : '')} placeholder="Pilih Jenis Pelanggaran..." isClearable />
                  </FormGroup>
                  <FormGroup label="Keterangan Kejadian (Opsional)" error={errors[`violations.${index}.keterangan_kejadian`]}>
                    <Textarea id={`keterangan_kejadian_${index}`} value={violation.keterangan_kejadian} onChange={(e) => handleViolationChange(index, 'keterangan_kejadian', e.target.value)} placeholder="Jelaskan detail kejadian pelanggaran" rows="3" />
                  </FormGroup>
                </div>
                <FormGroup label="Bukti Pelanggaran (Opsional)" error={errors[`violations.${index}.bukti_pelanggaran`]} className="mt-4">
                  <input type="file" id={`bukti_pelanggaran_${index}`} onChange={(e) => handleViolationFileChange(index, e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                  {violation.bukti_pelanggaran && typeof violation.bukti_pelanggaran === 'object' && (
                    <img src={URL.createObjectURL(violation.bukti_pelanggaran)} alt={`Preview Bukti Baru ${index + 1}`} className="mt-2 h-32 object-contain rounded-md border border-gray-300" />
                  )}
                  {!violation.bukti_pelanggaran && violation.existing_bukti_pelanggaran && !violation.remove_bukti_pelanggaran && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-1">Bukti saat ini:</p>
                      <a href={`/storage/${violation.existing_bukti_pelanggaran}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">Lihat Bukti</a>
                      <Checkbox id={`remove_bukti_pelanggaran_${index}`} name={`remove_bukti_pelanggaran_${index}`} label="Hapus bukti saat ini" checked={violation.remove_bukti_pelanggaran} onChange={e => handleViolationChange(index, 'remove_bukti_pelanggaran', e.target.checked)} className="mt-2" />
                    </div>
                  )}
                </FormGroup>
              </div>
            ))}

            <button type="button" onClick={addViolationEntry} className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium py-2 px-3 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors">
              + Tambah Jenis Pelanggaran Lain
            </button>

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