<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User; // Pastikan model User diimpor
use App\Models\Enrollment; // Pastikan model Enrollment diimpor

class Student extends Model
{
    use HasFactory;

    // === Tambahkan konstanta untuk nilai ENUM status_akun ===
    public const STATUS_AKTIF = 'Aktif';
    public const STATUS_NONAKTIF = 'Nonaktif';
    public const STATUS_LULUS = 'Lulus';
    public const STATUS_MUTASI = 'Mutasi';
    public const STATUS_KELUAR = 'Keluar';

    public const ALL_STATUSES = [
        self::STATUS_AKTIF,
        self::STATUS_NONAKTIF,
        self::STATUS_LULUS,
        self::STATUS_MUTASI,
        self::STATUS_KELUAR,
    ];
    // =======================================================

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nisn',
        'nit',
        'nama_lengkap',
        'jenis_kelamin',
        'tempat_lahir',
        'tanggal_lahir',
        'agama',
        'no_hp',
        'email',
        'alamat',
        'status_akun', // Tambahkan ini
        'foto_profil',
        'user_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tanggal_lahir' => 'date',
        ];
    }

    /**
     * Get the user that owns the student.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the enrollments for the student.
     */
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }
}
