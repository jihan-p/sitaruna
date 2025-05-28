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
        Schema::create('jenis_pelanggaran', function (Blueprint $table) {
            $table->id();
            $table->string('kategori'); // e.g., "Pelanggaran Sangat Berat", "Pelanggaran Ringan"
            $table->string('deskripsi'); // e.g., "Membocorkan hal-hal yang bersifat rahasia negara"
            $table->integer('poin'); // Poin yang dikurangi
            $table->boolean('aktif')->default(true); // Status aktif/nonaktif jenis pelanggaran
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jenis_pelanggaran');
    }
};