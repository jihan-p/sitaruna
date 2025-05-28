<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id(); // Primary Key auto-increment

            // Data Identitas dan Kontak Pribadi
            $table->string('nisn')->unique()->nullable(); // NISN (unique, nullable)
            $table->string('nit')->unique()->nullable(); // Nomor Induk Taruna/Siswa (unique, nullable)
            $table->string('nama_lengkap'); // Nama Lengkap
            $table->char('jenis_kelamin', 1)->nullable(); // Jenis Kelamin (L/P)
            $table->string('tempat_lahir')->nullable(); // Tempat Lahir
            $table->date('tanggal_lahir')->nullable(); // Tanggal Lahir
            $table->string('agama', 50)->nullable(); // Agama
            $table->string('no_hp', 50)->nullable(); // Nomor HP
            $table->string('email')->unique()->nullable(); // Email (unique, nullable)
            $table->text('alamat')->nullable(); // Alamat
            
            // === MODIFIKASI: Mengubah status_akun menjadi ENUM ===
            // Anda bisa menyesuaikan nilai-nilai ENUM sesuai kebutuhan aplikasi Anda.
            // Contoh: 'aktif', 'nonaktif', 'lulus', 'cuti', 'drop_out'
            $table->enum('status_akun', ['Aktif', 'Nonaktif', 'Lulus', 'Mutasi', 'Keluar'])->default('Aktif');
            // ====================================================
            $table->integer('total_poin_prestasi')->default(0);
            $table->integer('total_poin_pelanggaran')->default(0);

            $table->string('foto_profil')->nullable(); // Foto Profil path/URL
            
            // Foreign Key ke tabel users (untuk akun login)
            $table->foreignId('user_id')->nullable()->unique()->constrained('users')->nullOnDelete();

            $table->timestamps(); // created_at dan updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
