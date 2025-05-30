<?php

namespace App\Imports;

use App\Models\ViolationType;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
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
        $aktif = true;
        if (isset($row['aktif'])) {
            if (is_string($row['aktif'])) {
                $aktifValue = strtolower(trim($row['aktif']));
                if ($aktifValue === 'false' || $aktifValue === '0' || $aktifValue === 'tidak aktif' || $aktifValue === 'nonaktif') {
                    $aktif = false;
                }
            } elseif (is_numeric($row['aktif'])) {
                $aktif = (bool)$row['aktif'];
            }
        }

        return new ViolationType([
            'kategori'              => $row['kategori'] ?? null,
            'deskripsi'             => $row['deskripsi'] ?? null,
            'poin'                  => $row['poin'] ?? 0,
            'aktif'                 => $aktif,
            'tanggal_berlaku'       => isset($row['tanggal_berlaku']) ? Carbon::createFromFormat('d/m/Y', $row['tanggal_berlaku'])->format('Y-m-d') : null,
            'tanggal_akhir_berlaku' => isset($row['tanggal_akhir_berlaku']) ? Carbon::createFromFormat('d/m/Y', $row['tanggal_akhir_berlaku'])->format('Y-m-d') : null,
        ]);
    }

    public function rules(): array
    {
        return [
            'kategori' => 'required|string|max:255',
            'deskripsi' => 'required|string|max:255',
            'poin' => 'required|integer|min:0', // Poin bisa 0 jika pelanggaran hanya peringatan
            'aktif' => 'nullable', // Biarkan model() yang menangani konversi
            'tanggal_berlaku' => 'nullable|date_format:d/m/Y',
            'tanggal_akhir_berlaku' => 'nullable|date_format:d/m/Y|after_or_equal:tanggal_berlaku',
        ];
    }

    public function customValidationMessages()
    {
        return [
            'tanggal_berlaku.date_format' => 'Format Tanggal Berlaku harus DD/MM/YYYY.',
            'tanggal_akhir_berlaku.date_format' => 'Format Tanggal Akhir Berlaku harus DD/MM/YYYY.',
            'tanggal_akhir_berlaku.after_or_equal' => 'Tanggal Akhir Berlaku harus setelah atau sama dengan Tanggal Berlaku.',
        ];
    }
}
