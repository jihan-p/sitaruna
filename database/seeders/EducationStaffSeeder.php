<?php

namespace Database\Seeders;

use App\Models\EducationStaff;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EducationStaffSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        echo "Seeding Education Staff...\\n";
        EducationStaff::factory()->count(20)->create();
        echo "Finished seeding Education Staff.\\n";
    }
}