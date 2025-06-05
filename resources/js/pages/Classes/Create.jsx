// resources/js/Pages/Classes/Create.jsx

import React from 'react';
import AuthenticatedLayout from '@/templates/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

import Container from '@/components/atoms/Container';
import Card from '@/components/organisms/Card';
import FormGroup from '@/components/molecules/FormGroup';
import TextInput from '@/components/atoms/TextInput';
import Select2 from '@/components/molecules/Select2';
import PrimaryButton from '@/components/molecules/PrimaryButton';
import CancelButton from '@/components/molecules/CancelButton';

export default function Create({ auth, majors }) {
    const routeResourceName = 'classes';

    const { data, setData, post, processing, errors } = useForm({
        nama_kelas: '',
        major_id: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleSelectChange = (selected) => {
        setData('major_id', selected ? selected.value : '');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route(`${routeResourceName}.store`));
    };

    const majorOptions = majors.map((major) => ({
        value: major.id,
        label: major.nama_jurusan,
    }));

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tambah Kelas</h2>}
        >
            <Head title="Tambah Kelas" />

            <Container>
                <Card title="Form Tambah Kelas">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FormGroup label="Nama Kelas" htmlFor="nama_kelas" error={errors.nama_kelas}>
                            <TextInput
                                id="nama_kelas"
                                name="nama_kelas"
                                value={data.nama_kelas}
                                onChange={handleChange}
                                className="mt-1 block w-full"
                                required
                                isFocused
                            />
                        </FormGroup>

                        <FormGroup label="Jurusan" htmlFor="major_id" error={errors.major_id}>
                            <Select2
                                id="major_id"
                                name="major_id"
                                options={majorOptions}
                                value={majorOptions.find((opt) => opt.value === data.major_id)}
                                onChange={handleSelectChange}
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
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </PrimaryButton>
                        </div>
                    </form>
                </Card>
            </Container>
        </AuthenticatedLayout>
    );
}
