// resources/js/Pages/Enrollments/Create.jsx
import React from 'react';
import AuthenticatedLayout from '@/templates/AuthenticatedLayout';
import Container from '@/components/atoms/Container';
import Card from '@/components/organisms/Card';
import PrimaryButton from '@/components/molecules/PrimaryButton';
import FormGroup from '@/components/molecules/FormGroup';
import Select2 from '@/components/molecules/Select2'; // Import your Select2 component
import CancelButton from '@/components/molecules/CancelButton';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function Create({ auth }) {
    const routeResourceName = 'enrollments';

    // Destructure props from usePage().props
    const { students, classes, academic_years } = usePage().props;

    // Transform data to react-select format { value, label }
    const studentOptions = students.map(student => ({
        value: student.id,
        label: `${student.nisn} - ${student.nama_lengkap}`
    }));

    const classOptions = classes.map(kelas => ({
        value: kelas.id,
        // Safely access nama_jurusan using optional chaining
        label: `${kelas.nama_kelas} ${kelas.major ? `- ${kelas.major.nama_jurusan}` : ''}`
    }));

    const academicYearOptions = academic_years.map(year => ({
        value: year.id,
        label: year.nama_tahun_ajaran
    }));

    const { data, setData, post, processing, errors } = useForm({
        student_id: '',
        class_id: '',
        academic_year_id: '',
        semester_id: '',
        no_absen: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('enrollments.store'));
    };

    // Filter semesters based on the selected academic year
    const selectedAcademicYear = academic_years.find(
        (year) => year.id === data.academic_year_id
    );
    const semestersForSelectedYear = selectedAcademicYear
        ? selectedAcademicYear.semesters.map(semester => ({
            value: semester.id,
            label: semester.nama_semester
        }))
        : [];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tambah Pendaftaran</h2>}
        >
            <Head title="Tambah Pendaftaran" />

            <Container>
                <Card title="Form Tambah Pendaftaran">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FormGroup
                            label="Siswa"
                            htmlFor="student_id"
                            error={errors.student_id}
                        >
                            <Select2
                                id="student_id"
                                options={studentOptions}
                                value={studentOptions.find(option => option.value === data.student_id) || null}
                                onChange={(selectedOption) => setData('student_id', selectedOption ? selectedOption.value : '')}
                                placeholder="-- Pilih Siswa --"
                            />
                        </FormGroup>

                        <FormGroup
                            label="Kelas"
                            htmlFor="class_id"
                            error={errors.class_id}
                        >
                            <Select2
                                id="class_id"
                                options={classOptions}
                                value={classOptions.find(option => option.value === data.class_id) || null}
                                onChange={(selectedOption) => setData('class_id', selectedOption ? selectedOption.value : '')}
                                placeholder="-- Pilih Kelas --"
                            />
                        </FormGroup>

                        <FormGroup
                            label="Tahun Ajaran"
                            htmlFor="academic_year_id"
                            error={errors.academic_year_id}
                        >
                            <Select2
                                id="academic_year_id"
                                options={academicYearOptions}
                                value={academicYearOptions.find(option => option.value === data.academic_year_id) || null}
                                onChange={(selectedOption) => {
                                    setData('academic_year_id', selectedOption ? selectedOption.value : '');
                                    setData('semester_id', ''); // Reset semester when academic year changes
                                }}
                                placeholder="-- Pilih Tahun Ajaran --"
                            />
                        </FormGroup>

                        <FormGroup
                            label="Semester"
                            htmlFor="semester_id"
                            error={errors.semester_id}
                        >
                            <Select2
                                id="semester_id"
                                options={semestersForSelectedYear}
                                value={semestersForSelectedYear.find(option => option.value === data.semester_id) || null}
                                onChange={(selectedOption) => setData('semester_id', selectedOption ? selectedOption.value : '')}
                                placeholder="-- Pilih Semester --"
                                isDisabled={!data.academic_year_id} // Disable if no academic year is selected
                            />
                        </FormGroup>

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

                        <div className="flex justify-end gap-4">
                            <CancelButton href={route(`${routeResourceName}.index`)}>
                                Batal
                            </CancelButton>
                            <PrimaryButton type="submit" disabled={processing}>
                                Simpan
                            </PrimaryButton>
                        </div>
                    </form>
                </Card>
            </Container>
        </AuthenticatedLayout>
    );
}