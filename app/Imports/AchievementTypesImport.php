<?php

namespace App\Imports;

use App\Models\AchievementType;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use PhpOffice\PhpSpreadsheet\Shared\Date as ExcelDate;
use Carbon\Carbon;

class AchievementTypesImport implements ToModel, WithHeadingRow, WithValidation
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        $isAktif = true;
        if (array_key_exists('aktif', $row) && $row['aktif'] !== null) {
            $value = $row['aktif'];
            if (is_bool($value)) {
                $isAktif = $value;
            } elseif (is_numeric($value)) {
                $isAktif = (bool)floatval($value);
            } elseif (is_string($value)) {
                $normalizedValue = strtolower(trim($value));
                if (in_array($normalizedValue, ['false', '0', 'no', 'n', 'off', 'tidak', 'tidak aktif', 'nonaktif'])) {
                    $isAktif = false;
                } elseif (in_array($normalizedValue, ['true', '1', 'yes', 'y', 'on', 'aktif'])) {
                    $isAktif = true;
                }
            }
        }

        $tanggalBerlaku = null;
        if (!empty($row['tanggal_berlaku'])) {
            try {
                if (is_numeric($row['tanggal_berlaku'])) {
                    $tanggalBerlaku = ExcelDate::excelToDateTimeObject($row['tanggal_berlaku'])->format('Y-m-d');
                } else {
                    $tanggalBerlaku = Carbon::createFromFormat('d/m/Y', $row['tanggal_berlaku'])->format('Y-m-d');
                }
            } catch (\Throwable $th) {
                \Illuminate\Support\Facades\Log::warning("Gagal parsing tanggal_berlaku di model AchievementType: " . $row['tanggal_berlaku'] . " Error: " . $th->getMessage());
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
                \Illuminate\Support\Facades\Log::warning("Gagal parsing tanggal_akhir_berlaku di model AchievementType: " . $row['tanggal_akhir_berlaku'] . " Error: " . $th->getMessage());
            }
        }

        return new AchievementType([
            'deskripsi'             => $row['deskripsi'] ?? null,
            'poin'                  => $row['poin'] ?? 0,
            'aktif'                 => $isAktif,
            'tanggal_berlaku'       => $tanggalBerlaku,
            'tanggal_akhir_berlaku' => $tanggalAkhirBerlaku,
        ]);
    }

    public function rules(): array
    {
        return [
            '*.deskripsi' => 'required|string|max:255',
            '*.poin' => 'required|integer|min:0',
            '*.aktif' => 'nullable',
            '*.tanggal_berlaku' => 'required|date_format:d/m/Y',
            '*.tanggal_akhir_berlaku' => 'nullable|date_format:d/m/Y|after_or_equal:*.tanggal_berlaku',
        ];
    }

    public function customValidationMessages()
    {
        return [
            '*.deskripsi.required' => 'Kolom Deskripsi pada baris :row wajib diisi.',
            '*.poin.required' => 'Kolom Poin pada baris :row wajib diisi.',
            '*.poin.integer' => 'Kolom Poin pada baris :row harus berupa angka.',
            '*.poin.min' => 'Kolom Poin pada baris :row minimal :min.',
            '*.tanggal_berlaku.required' => 'Kolom Tanggal Berlaku pada baris :row wajib diisi.',
            '*.tanggal_berlaku.date_format' => 'Format Tanggal Berlaku pada baris :row harus DD/MM/YYYY.',
            '*.tanggal_akhir_berlaku.date_format' => 'Format Tanggal Akhir Berlaku pada baris :row harus DD/MM/YYYY.',
            '*.tanggal_akhir_berlaku.after_or_equal' => 'Tanggal Akhir Berlaku pada baris :row harus setelah atau sama dengan Tanggal Berlaku.',
        ];
    }
}