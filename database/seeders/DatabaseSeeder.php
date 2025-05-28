<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\AcademicYear;
use App\Models\Semester;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Panggil seeder lain yang diperlukan terlebih dahulu
        // Urutan ini penting: Roles -> Permissions -> User -> Major -> AcademicYear -> Semester -> Class -> Student -> Enrollment

        $this->call(RolesTableSeeder::class);
        $this->call(PermissionsTableSeeder::class);
        $this->call(UserTableSeeder::class); // UserTableSeeder harus mengisi user yang akan digunakan oleh StudentFactory

        // Seeder untuk data master
        $this->call(MajorSeeder::class);

        // Pastikan AcademicYear dijalankan sebelum Semester
        echo "Seeding Academic Years...\n"; // Log
        AcademicYear::factory()->count(5)->create(); // Buat 5 Tahun Ajaran dummy (sesuaikan jumlah jika perlu)
        echo "Finished seeding Academic Years.\n"; // Log

        echo "Seeding Semesters...\n"; // Log
        // Buat semester Ganjil dan Genap untuk setiap Tahun Ajaran yang ada
        $academicYears = AcademicYear::all();
        foreach ($academicYears as $academicYear) {
            Semester::firstOrCreate(
                [
                    'nama_semester' => 'Ganjil',
                    'tahun_ajaran_id' => $academicYear->id,
                ],
                [
                    'is_active' => false,
                ]
            );
            echo "Ensured Semester 'Ganjil' for Academic Year '{$academicYear->nama_tahun_ajaran}'.\n"; // Log

            Semester::firstOrCreate(
                [
                    'nama_semester' => 'Genap',
                    'tahun_ajaran_id' => $academicYear->id,
                ],
                [
                    'is_active' => false,
                ]
            );
            echo "Ensured Semester 'Genap' for Academic Year '{$academicYear->nama_tahun_ajaran}'.\n"; // Log
        }
        echo "Finished seeding Semesters.\n"; // Log

        // Panggil seeder untuk Kelas, Siswa, dan Pendaftaran
        // Pastikan seeder-seeder ini sudah Anda buat di langkah sebelumnya
        $this->call(ClassModelSeeder::class); // Membutuhkan Major
        $this->call(StudentSeeder::class); // Membutuhkan User
        $this->call(EducationStaffSeeder::class);
        $this->call(EnrollmentSeeder::class); // Membutuhkan Student, Class, AcademicYear, Semester
    }
}
