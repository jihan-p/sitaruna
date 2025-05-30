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
        Schema::create('student_violations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('violation_type_id')->constrained('violation_types')->onDelete('cascade'); // Mengacu ke tabel violation_types
            $table->date('tanggal_pelanggaran');
            $table->time('jam_pelanggaran')->nullable();
            $table->text('keterangan_kejadian')->nullable(); // Detail insiden pelanggaran
            $table->string('bukti_pelanggaran')->nullable();

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
        Schema::dropIfExists('student_violations');
    }
};