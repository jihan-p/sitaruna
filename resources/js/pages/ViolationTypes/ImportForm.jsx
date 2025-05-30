import React from 'react';
import AuthenticatedLayout from '@/templates/AuthenticatedLayout';
import Container from '@/components/atoms/Container';
import Card from '@/components/organisms/Card';
import FormGroup from '@/components/molecules/FormGroup';
import PrimaryButton from '@/components/molecules/PrimaryButton';
import CancelButton from '@/components/molecules/CancelButton';
import { Head, useForm, usePage } from '@inertiajs/react';
import InputError from '@/components/atoms/InputError'; // Untuk menampilkan error spesifik file

export default function ImportViolationTypeForm({ auth }) {
  const resource = 'violation-types';
  const { errors: pageErrors } = usePage().props; // Mengambil error dari props halaman

  const { data, setData, post, processing, errors, progress } = useForm({
    import_file: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route(`${resource}.import.process`), {
      // onSuccess: () => { // Ditangani oleh controller dengan redirect dan flash message
      // },
      // onError: () => { // Error akan ditampilkan melalui pageErrors atau errors dari useForm
      // }
    });
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Impor Jenis Pelanggaran</h2>}
    >
      <Head title="Impor Jenis Pelanggaran" />

      <Container>
        <Card title="Form Impor Jenis Pelanggaran">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <FormGroup label="Pilih File (Excel/CSV)" error={errors.import_file || pageErrors.import_file}>
              <input
                type="file"
                id="import_file"
                name="import_file"
                onChange={(e) => setData('import_file', e.target.files[0])}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {/* Menampilkan error spesifik dari validasi backend jika ada */}
              {pageErrors.import_file && !errors.import_file && (
                <InputError message={pageErrors.import_file} className="mt-2" />
              )}
            </FormGroup>

            {progress && (
              <div className="w-full bg-gray-200 rounded-full mt-2">
                <div
                  className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                  style={{ width: `${progress.percentage}%` }}
                >
                  {progress.percentage}%
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 mt-6">
              <CancelButton url={route(`${resource}.index`)}>Batal</CancelButton>
              <PrimaryButton type="submit" disabled={processing || !data.import_file}>
                {processing ? 'Mengimpor...' : 'Impor File'}
              </PrimaryButton>
            </div>
          </form>
        </Card>
      </Container>
    </AuthenticatedLayout>
  );
}