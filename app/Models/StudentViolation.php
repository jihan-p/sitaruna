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
        'education_staff_id',
    ];

    protected $casts = [
        'tanggal_pelanggaran' => 'date',
        'jam_pelanggaran' => 'datetime',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function violationType()
    {
        return $this->belongsTo(ViolationType::class, 'violation_type_id'); // FOREIGN KEY DIPERBARUI
    }

    public function educationStaff()
    {
        return $this->belongsTo(EducationStaff::class, 'education_staff_id');
    }
}