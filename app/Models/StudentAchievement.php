<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentAchievement extends Model
{
    use HasFactory;

    protected $table = 'student_achievements'; // NAMA TABEL DIPERBARUI
    protected $fillable = [
        'student_id',
        'achievement_type_id', // NAMA FOREIGN KEY DIPERBARUI
        'tanggal_prestasi',
        'keterangan_tambahan',
        'bukti_prestasi',
        'education_staff_id',
    ];

    protected $casts = [
        'tanggal_prestasi' => 'date',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function achievementType()
    {
        return $this->belongsTo(AchievementType::class, 'achievement_type_id'); // FOREIGN KEY DIPERBARUI
    }

    public function educationStaff()
    {
        return $this->belongsTo(EducationStaff::class, 'education_staff_id');
    }
}