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
        Schema::create('education_staff', function (Blueprint $table) {
            $table->id();
            // Link to users table, nullable if not every PTK needs a login right away
            $table->foreignId('user_id')->nullable()->unique()->constrained('users')->nullOnDelete();
            
            $table->string('nip')->unique()->nullable(); // Nomor Induk Pegawai (Employee ID Number)
            $table->string('name');
            $table->enum('gender', ['L', 'P'])->nullable(); // Laki-laki (Male), Perempuan (Female)
            $table->string('place_of_birth')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->text('address')->nullable();
            $table->string('phone_number', 50)->nullable();
            $table->string('email')->unique(); // Email should generally be unique for login if associated with user
            $table->string('position')->nullable(); // e.g., Guru (Teacher), Staff Tata Usaha (Administrative Staff)
            $table->date('hire_date')->nullable();
            $table->string('last_education')->nullable();
            $table->string('major_education')->nullable();
            $table->string('foto_profil')->nullable(); // Profile photo path/URL
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('education_staff');
    }
};