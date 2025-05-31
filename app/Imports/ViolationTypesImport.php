<?php

namespace App\Imports;

use App\Models\ViolationType;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
    use PhpOffice\PhpSpreadsheet\Shared\Date as ExcelDate; // Tambahkan use statement yang benar
use Carbon\Carbon;

class ViolationTypesImport implements ToModel, WithHeadingRow, WithValidation
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        $isAktif = true; // Default value, mengasumsikan 'aktif' kecuali dinyatakan sebaliknya
        if (array_key_exists('aktif', $row) && $row['aktif'] !== null) {
            $value = $row['aktif'];
            if (is_bool($value)) {
                $isAktif = $value;
            } elseif (is_numeric($value)) {
                // Menangani "0", "1" sebagai angka, dan angka lainnya (misal, 0.0)
                // floatval akan mengubah string angka menjadi float, lalu (bool) akan mengkonversinya.
                $isAktif = (bool)floatval($value);
            } elseif (is_string($value)) {
                $normalizedValue = strtolower(trim($value));
                if (in_array($normalizedValue, ['false', '0', 'no', 'n', 'off', 'tidak', 'tidak aktif', 'nonaktif'])) {
                    $isAktif = false;
                } elseif (in_array($normalizedValue, ['true', '1', 'yes', 'y', 'on', 'aktif'])) {
                    $isAktif = true;
                }
                // Jika string tidak ada dalam daftar di atas, $isAktif akan tetap pada nilai defaultnya (true).
                // Ini umumnya perilaku yang dapat diterima; string yang tidak dikenal tidak membuatnya false.
            }
        }

        $tanggalBerlaku = null;
        if (!empty($row['tanggal_berlaku'])) {
            try {
                // Jika numeric, anggap Excel date serial. Jika string, coba parse dengan format.
                if (is_numeric($row['tanggal_berlaku'])) {
                    $tanggalBerlaku = ExcelDate::excelToDateTimeObject($row['tanggal_berlaku'])->format('Y-m-d');
                } else {
                    $tanggalBerlaku = Carbon::createFromFormat('d/m/Y', $row['tanggal_berlaku'])->format('Y-m-d');
                }
            } catch (\Throwable $th) {
                // Jika parsing gagal di sini, berarti validasi date_format di rules() mungkin tidak menangkapnya
                // atau ada kasus yang tidak terduga. Seharusnya tidak terjadi jika rules() sudah benar.
                // Biarkan null, validasi seharusnya sudah menangani.
                \Illuminate\Support\Facades\Log::warning("Gagal parsing tanggal_berlaku di model: " . $row['tanggal_berlaku'] . " Error: " . $th->getMessage());
            }
        }

        $tanggalAkhirBerlaku = null;
        if (!empty($row['tanggal_akhir_berlaku'])) {
             try {
                if (is_numeric($row['tanggal_akhir_berlaku'])) {
                    $tanggalAkhirBerlaku = ExcelDate::excelToDateTimeObject($row['tanggal_akhir_berlaku'])->format('Y-m-d');
                } else {
                    $tanggalAkhirBerlaku = Carbon::createFromFormat('d/m/Y', $row['tanggal_akhir_berlaku'])->format('Y-m-d');
                }
            } catch (\Throwable $th) {
                \Illuminate\Support\Facades\Log::warning("Gagal parsing tanggal_akhir_berlaku di model: " . $row['tanggal_akhir_berlaku'] . " Error: " . $th->getMessage());
            }
        }

        return new ViolationType([
            'kategori'              => $row['kategori'] ?? null,
            'deskripsi'             => $row['deskripsi'] ?? null,
            'poin'                  => $row['poin'] ?? 0,
            'aktif'                 => $isAktif,
            'tanggal_berlaku'       => $tanggalBerlaku, // Gunakan variabel yang sudah diproses
            'tanggal_akhir_berlaku' => $tanggalAkhirBerlaku, // Gunakan variabel yang sudah diproses
        ]);
    }

    public function rules(): array
    {
        return [
            // Tambahkan prefix '*.nama_kolom' untuk validasi per baris
            '*.kategori' => 'required|string|max:255',
            '*.deskripsi' => 'required|string|max:255',
            '*.poin' => 'required|integer|min:0', // Poin bisa 0 jika pelanggaran hanya peringatan
            '*.aktif' => 'nullable', // Membiarkan metode model() menangani konversi boolean yang fleksibel
            '*.tanggal_berlaku' => 'required|date_format:d/m/Y', // Jadikan required jika memang wajib
            '*.tanggal_akhir_berlaku' => 'nullable|date_format:d/m/Y|after_or_equal:*.tanggal_berlaku',
        ];
    }

    public function customValidationMessages()
    {
        return [
            // Tambahkan prefix '*.nama_kolom' juga di sini
            '*.kategori.required' => 'Kolom Kategori pada baris :row wajib diisi.',
            '*.deskripsi.required' => 'Kolom Deskripsi pada baris :row wajib diisi.',
            '*.poin.required' => 'Kolom Poin pada baris :row wajib diisi.',
            '*.poin.integer' => 'Kolom Poin pada baris :row harus berupa angka.',
            '*.poin.min' => 'Kolom Poin pada baris :row minimal :min.',
            // Jika Anda memutuskan untuk menggunakan 'boolean' pada rules untuk 'aktif':
            // '*.aktif.boolean' => 'Kolom Aktif pada baris :row harus bernilai TRUE/FALSE atau 1/0.',
            '*.tanggal_berlaku.required' => 'Kolom Tanggal Berlaku pada baris :row wajib diisi.',
            '*.tanggal_berlaku.date_format' => 'Format Tanggal Berlaku pada baris :row harus DD/MM/YYYY.',
            '*.tanggal_akhir_berlaku.date_format' => 'Format Tanggal Akhir Berlaku pada baris :row harus DD/MM/YYYY.',
            '*.tanggal_akhir_berlaku.after_or_equal' => 'Tanggal Akhir Berlaku pada baris :row harus setelah atau sama dengan Tanggal Berlaku.',
        ];
    }
}
