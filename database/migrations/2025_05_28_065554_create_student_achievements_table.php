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
        Schema::create('student_achievements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade'); // Link ke tabel students
            $table->foreignId('jenis_prestasi_id')->constrained('jenis_prestasi')->onDelete('cascade'); // Link ke tabel jenis_prestasi
            $table->date('tanggal_prestasi');
            $table->text('keterangan_tambahan')->nullable(); // Detail prestasi (misalnya: "Juara 1 Lomba Pidato")
            $table->string('bukti_prestasi')->nullable(); // Path/URL file bukti (sertifikat, foto, dll.)

            // Kolom untuk mencatat siapa yang menginput
            $table->foreignId('education_staff_id')->nullable()->constrained('education_staff')->nullOnDelete(); // Link ke tabel education_staff

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prestasi_taruna');
    }
};