// resources/js/Pages/Classes/Edit.jsx

import React, { useEffect } from 'react';
import AuthenticatedLayout from '@/templates/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

import Container from '@/components/atoms/Container';
import Card from '@/components/organisms/Card';
import FormGroup from '@/components/molecules/FormGroup';
import TextInput from '@/components/atoms/TextInput';
import Select2 from '@/components/molecules/Select2';
import PrimaryButton from '@/components/molecules/PrimaryButton';
import CancelButton from '@/components/molecules/CancelButton';

export default function Edit({ auth, class: classData, majors }) {
    const routeResourceName = 'classes';

    const { data, setData, put, processing, errors } = useForm({
        nama_kelas: '',
        major_id: '',
    });

    const majorOptions = majors.map((major) => ({
        value: major.id,
        label: major.nama_jurusan,
    }));

    useEffect(() => {
        if (classData) {
            setData({
                nama_kelas: classData.nama_kelas,
                major_id: classData.major_id,
            });
        }
    }, [classData]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setData(name, type === 'checkbox' ? checked : value);
    };

    const handleSelect2Change = (selectedOption) => {
        setData('major_id', selectedOption ? selectedOption.value : '');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('classes.update', classData.id), {
            onSuccess: () => {
                // redirect otomatis ke index
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Kelas</h2>}
        >
            <Head title="Edit Kelas" />

            <Container>
                <Card title="Form Edit Kelas">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FormGroup label="Nama Kelas" htmlFor="nama_kelas" error={errors.nama_kelas}>
                            <TextInput
                                id="nama_kelas"
                                name="nama_kelas"
                                value={data.nama_kelas}
                                onChange={handleInputChange}
                                className="mt-1 block w-full"
                                required
                                autoFocus
                            />
                        </FormGroup>

                        <FormGroup label="Jurusan" htmlFor="major_id" error={errors.major_id}>
                            <Select2
                                id="major_id"
                                name="major_id"
                                options={majorOptions}
                                value={majorOptions.find((opt) => opt.value === data.major_id)}
                                onChange={handleSelect2Change}
                                placeholder="Pilih Jurusan"
                                required
                                className="mt-1 block w-full"
                            />
                        </FormGroup>

                        <div className="flex justify-end gap-4">
                            <CancelButton url={route(`${routeResourceName}.index`)}>
                                Batal
                            </CancelButton>
                            <PrimaryButton type="submit" disabled={processing}>
                                Perbarui
                            </PrimaryButton>
                        </div>
                    </form>
                </Card>
            </Container>
        </AuthenticatedLayout>
    );
}
