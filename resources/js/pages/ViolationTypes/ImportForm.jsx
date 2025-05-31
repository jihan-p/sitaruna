import React from 'react';
import AuthenticatedLayout from '@/templates/AuthenticatedLayout';
import Container from '@/components/atoms/Container';
import Card from '@/components/organisms/Card';
import FormGroup from '@/components/molecules/FormGroup';
import PrimaryButton from '@/components/molecules/PrimaryButton';
import CancelButton from '@/components/molecules/CancelButton';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function ImportViolationTypeForm({ auth }) {
  const resource = 'violation-types';
  // Ambil error dari props halaman, termasuk error validasi detail dari controller
  const { errors: pageErrors = {}, import_errors: validationFailures } = usePage().props;

  const { data, setData, post, processing, errors, progress } = useForm({
    import_file: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route(`${resource}.import.process`), {
      forceFormData: true, // Penting untuk upload file
      // onSuccess dan onError akan ditangani oleh Inertia dan error props
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
            <FormGroup
              label="Pilih File (Excel/CSV)"
              error={errors.import_file || pageErrors.import_file} // Gabungkan error dari useForm dan pageErrors
            >
              <input
                type="file"
                id="import_file"
                name="import_file"
                onChange={(e) => setData('import_file', e.target.files[0])}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-2"
              />
              <a
                href={route(`${resource}.import.example`)}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                Unduh file contoh (.xlsx)
              </a>

              {/* Menampilkan detail kesalahan validasi dari Laravel Excel */}
              {validationFailures && Array.isArray(validationFailures) && validationFailures.length > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <h4 className="text-sm font-semibold text-red-700 mb-2">Detail Kesalahan Impor:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-red-600">
                    {validationFailures.map((failure, idx) => (
                      <li key={`failure-${idx}`}>
                        Baris {failure && typeof failure.row !== 'undefined' ? failure.row : 'N/A'}:
                        Kolom '{failure && typeof failure.attribute !== 'undefined' ? failure.attribute : 'N/A'}'
                        -
                        {failure && Array.isArray(failure.errors) && failure.errors.length > 0
                          ? failure.errors.join(', ')
                          : 'Pesan error tidak spesifik.'}
                      </li>
                    ))}
                  </ul>
                </div>
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