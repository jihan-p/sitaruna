import React, { useEffect } from 'react';
import AuthenticatedLayout from '@/templates/AuthenticatedLayout';
import Container from '@/components/atoms/Container';
import Card from '@/components/organisms/Card';
import PrimaryButton from '@/components/molecules/PrimaryButton';
import FormGroup from '@/components/molecules/FormGroup';
import Select2 from '@/components/molecules/Select2';
import CancelButton from '@/components/molecules/CancelButton';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function Edit({ auth }) {
    const routeResourceName = 'enrollments';

    // Destructure dengan default value untuk menghindari undefined
    const { 
        enrollment = {}, 
        students = [], 
        classes = [], 
        academic_years = [] 
    } = usePage().props;

    // Generate options dengan optional chaining
    const studentOptions = students?.map(student => ({
        value: student.id,
        label: `${student.nisn} - ${student.nama_lengkap}`
    })) || [];

    const classOptions = classes?.map(kelas => ({
        value: kelas.id,
        label: `${kelas.nama_kelas} ${kelas.major ? `- ${kelas.major.nama_jurusan}` : ''}`
    })) || [];

    const academicYearOptions = academic_years?.map(year => ({
        value: year.id,
        label: year.nama_tahun_ajaran
    })) || [];

    const { data, setData, put, processing, errors } = useForm({
        student_id: enrollment?.student_id || '',
        class_id: enrollment?.class_id || '',
        academic_year_id: enrollment?.academic_year_id || '',
        semester_id: enrollment?.semester_id || '',
        no_absen: enrollment?.no_absen || '',
    });

    // Handle perubahan tahun ajaran dan semester
    useEffect(() => {
        if (data.academic_year_id) {
            const selectedAcademicYear = academic_years?.find(
                (year) => year.id === data.academic_year_id
            );

            if (selectedAcademicYear) {
                const semesterExists = selectedAcademicYear.semesters?.some(
                    (semester) => semester.id === data.semester_id
                );

                if (!semesterExists) {
                    setData('semester_id', '');
                }
            }
        } else {
            setData('semester_id', '');
        }
    }, [data.academic_year_id]);

    // Generate opsi semester
    const selectedAcademicYear = academic_years?.find(
        (year) => year.id === data.academic_year_id
    );
    const semestersForSelectedYear = selectedAcademicYear?.semesters?.map(semester => ({
        value: semester.id,
        label: semester.nama_semester
    })) || [];

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('enrollments.update', enrollment?.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Pendaftaran</h2>}
        >
            <Head title="Edit Pendaftaran" />

            <Container>
                <Card title="Form Edit Pendaftaran">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Field Siswa */}
                        <FormGroup
                            label="Siswa"
                            htmlFor="student_id"
                            error={errors.student_id}
                        >
                            <Select2
                                id="student_id"
                                options={studentOptions}
                                value={studentOptions.find(option => option.value === data.student_id) || null}
                                onChange={(selectedOption) => setData('student_id', selectedOption?.value || '')}
                                placeholder="-- Pilih Siswa --"
                            />
                        </FormGroup>

                        {/* Field Kelas */}
                        <FormGroup
                            label="Kelas"
                            htmlFor="class_id"
                            error={errors.class_id}
                        >
                            <Select2
                                id="class_id"
                                options={classOptions}
                                value={classOptions.find(option => option.value === data.class_id) || null}
                                onChange={(selectedOption) => setData('class_id', selectedOption?.value || '')}
                                placeholder="-- Pilih Kelas --"
                            />
                        </FormGroup>

                        {/* Field Tahun Ajaran */}
                        <FormGroup
                            label="Tahun Ajaran"
                            htmlFor="academic_year_id"
                            error={errors.academic_year_id}
                        >
                            <Select2
                                id="academic_year_id"
                                options={academicYearOptions}
                                value={academicYearOptions.find(option => option.value === data.academic_year_id) || null}
                                onChange={(selectedOption) => setData('academic_year_id', selectedOption?.value || '')}
                                placeholder="-- Pilih Tahun Ajaran --"
                            />
                        </FormGroup>

                        {/* Field Semester */}
                        <FormGroup
                            label="Semester"
                            htmlFor="semester_id"
                            error={errors.semester_id}
                        >
                            <Select2
                                id="semester_id"
                                options={semestersForSelectedYear}
                                value={semestersForSelectedYear.find(option => option.value === data.semester_id) || null}
                                onChange={(selectedOption) => setData('semester_id', selectedOption?.value || '')}
                                placeholder="-- Pilih Semester --"
                                isDisabled={!data.academic_year_id}
                            />
                        </FormGroup>

                        {/* Field Nomor Absen */}
                        <FormGroup
                            label="Nomor Absen"
                            htmlFor="no_absen"
                            error={errors.no_absen}
                        >
                            <input
                                type="number"
                                id="no_absen"
                                className="input input-bordered w-full"
                                value={data.no_absen}
                                onChange={(e) => setData('no_absen', e.target.value)}
                                placeholder="Masukkan nomor absen"
                            />
                        </FormGroup>

                        {/* Tombol Aksi */}
                        <div className="flex justify-end gap-4">
                            <CancelButton url={route(`${routeResourceName}.index`)}>
                                Batal
                            </CancelButton>
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