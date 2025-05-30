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
        Schema::create('violation_types', function (Blueprint $table) {
            $table->id();
            $table->string('kategori'); // e.g., "Pelanggaran Sangat Berat", "Pelanggaran Ringan"
            $table->string('deskripsi'); // e.g., "Membocorkan hal-hal yang bersifat rahasia negara"
            $table->integer('poin'); // Poin yang dikurangi
            $table->boolean('aktif')->default(true); // Status aktif/nonaktif jenis pelanggaran
            $table->date('tanggal_berlaku')->nullable(); // Tanggal mulai berlaku
            $table->date('tanggal_akhir_berlaku')->nullable(); // Tanggal akhir berlaku (opsional)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('violation_types');
    }
};