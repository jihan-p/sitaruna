<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AcademicYear extends Model
{
    use HasFactory;

    // === Konfigurasi Nama Tabel ===
    // Secara default, Eloquent akan menggunakan nama tabel 'academic_years'
    // (bentuk plural snake_case dari nama model 'AcademicYear').
    // Jadi, baris ini sebenarnya opsional jika nama tabel sesuai konvensi,
    // tapi baik untuk eksplisitas.
    protected $table = 'academic_years';
    // ============================

    // === Kolom yang Diizinkan Mass Assignment ===
    // Definisikan kolom-kolom yang bisa diisi saat menggunakan metode create() atau update()
    protected $fillable = [
        'tahun_mulai',
        'tahun_selesai',
        'nama_tahun_ajaran',
    ];
    // =========================================

    // === Casting Atribut (Opsional) ===
    // Jika ada kolom yang perlu di-cast ke tipe data tertentu (misal: array, boolean, datetime, dll.)
    // protected $casts = [
    //     'email_verified_at' => 'datetime',
    //     'password' => 'hashed',
    // ];
    // =================================

    // === Relasi (Opsional, akan ditambahkan nanti jika perlu) ===
    // Contoh: Relasi one-to-many ke tabel enrollments jika ada foreign key academic_year_id di tabel enrollments
    // public function enrollments()
    // {
    //     return $this->hasMany(Enrollment::class);
    // }
    // =========================================================

    /**
     * Get the semesters for the academic year.
     */
    public function semesters()
    {
        // Sebuah AcademicYear memiliki banyak Semester
        // foreign key default akan 'academic_year_id'
        // Jika nama foreign key di tabel 'semesters' bukan 'academic_year_id',
        // Anda perlu menentukannya secara eksplisit, misalnya:
        // return $this->hasMany(Semester::class, 'nama_kolom_foreign_key_di_tabel_semesters');
        // Berdasarkan migrasi yang Anda berikan, nama kolomnya adalah 'tahun_ajaran_id'.
        return $this->hasMany(Semester::class, 'tahun_ajaran_id');
    }
}