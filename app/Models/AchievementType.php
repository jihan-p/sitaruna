<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AchievementType extends Model
{
    use HasFactory;

    protected $table = 'achievement_types'; // NAMA TABEL DIPERBARUI
    protected $fillable = [
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

    public function studentAchievements()
    {
        return $this->hasMany(StudentAchievement::class, 'achievement_type_id'); // FOREIGN KEY DIPERBARUI
    }
}