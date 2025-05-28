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
    ];

    protected $casts = [
        'aktif' => 'boolean',
    ];

    public function studentViolations()
    {
        return $this->hasMany(StudentViolation::class, 'violation_type_id'); // FOREIGN KEY DIPERBARUI
    }
}