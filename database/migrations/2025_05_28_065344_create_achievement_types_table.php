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
        Schema::create('achievement_types', function (Blueprint $table) {
            $table->id();
            $table->string('deskripsi'); // e.g., "Menjadi juara kegiatan tingkat regional dan internasional"
            $table->integer('poin'); // Poin yang didapat
            $table->boolean('aktif')->default(true); // Status aktif/nonaktif jenis prestasi
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
        Schema::dropIfExists('achievement_types'); // Pastikan nama tabel konsisten
    }
};