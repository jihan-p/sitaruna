<?php

namespace Database\Factories;

use App\Models\EducationStaff;
use App\Models\User;
use Spatie\Permission\Models\Role; // Import Role model
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class EducationStaffFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = EducationStaff::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $gender = $this->faker->randomElement(EducationStaff::ALL_GENDERS);
        
        // Create a new user for each EducationStaff
        $user = User::factory()->create([
            'email' => $this->faker->unique()->safeEmail(),
            'password' => Hash::make('password'), // Default password
        ]);

        // Assign a 'teacher' role to the created user (ensure this role exists)
        // You might want to randomize roles or assign a default one like 'teacher' or 'staff'
        $teacherRole = Role::where('name', 'teacher')->first() ?? Role::create(['name' => 'teacher']);
        $user->assignRole($teacherRole);

        return [
            'user_id' => $user->id,
            'nip' => $this->faker->unique()->numerify('##########'),
            'name' => $this->faker->name($gender == 'L' ? 'male' : 'female'),
            'gender' => $gender,
            'place_of_birth' => $this->faker->city,
            'date_of_birth' => $this->faker->date(),
            'address' => $this->faker->address,
            'phone_number' => $this->faker->phoneNumber,
            'email' => $user->email, // Use the user's email for consistency
            'position' => $this->faker->randomElement(['Guru', 'Staff Tata Usaha', 'Kepala Sekolah', 'Pustakawan']),
            'hire_date' => $this->faker->date('Y-m-d', '-5 years'),
            'last_education' => $this->faker->randomElement(['SMA', 'D3', 'S1', 'S2']),
            'major_education' => $this->faker->randomElement(['Pendidikan Matematika', 'Manajemen Pendidikan', 'Ilmu Komputer', 'Bahasa Inggris']),
            'foto_profil' => null, // Or use Storage::url('path/to/dummy/photo.jpg') if you have dummy images
        ];
    }
}