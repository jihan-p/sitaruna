<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ViolationType extends Model
{
    use HasFactory;

    protected $table = 'violation_types'; // NAMA TABEL DIPERBARUI
    protected $fillable = [
        'kategori',
        'deskripsi',
        'poin',
        'aktif',
        'tanggal_berlaku',
        'tanggal_akhir_berlaku',
    ];

    protected $casts = [
        'aktif' => 'boolean',
        'tanggal_berlaku' => 'date',
        'tanggal_akhir_berlaku' => 'date',
    ];

    public function studentViolations()
    {
        return $this->hasMany(StudentViolation::class, 'violation_type_id'); // FOREIGN KEY DIPERBARUI
    }
}