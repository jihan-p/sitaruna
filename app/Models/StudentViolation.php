<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentViolation extends Model
{
    use HasFactory;

    protected $table = 'student_violations'; // NAMA TABEL DIPERBARUI
    protected $fillable = [
        'student_id',
        'violation_type_id', // NAMA FOREIGN KEY DIPERBARUI
        'tanggal_pelanggaran',
        'jam_pelanggaran',
        'keterangan_kejadian',
        'bukti_pelanggaran',
    ];

    protected $casts = [
        'tanggal_pelanggaran' => 'date',
        'jam_pelanggaran' => 'datetime',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function violationType() // Relasi violationType tetap sama
    {
        return $this->belongsTo(ViolationType::class, 'violation_type_id'); // FOREIGN KEY DIPERBARUI
    }
    /**
     * Get the reporter (User or EducationStaff) of the violation.
     */
    public function reporter() // Nama fungsi tetap 'reporter' untuk konsistensi
    {
        return $this->morphTo(null, 'pelapor_type', 'pelapor_id');
    }
}