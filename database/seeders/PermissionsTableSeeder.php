<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $guardName = 'web';

        // Definisi semua permissions yang akan dibuat
        $allPermissions = [];

        // Permissions untuk modul Users
        $userPermissions = [
            'users index',
            'users create',
            'users edit',
            'users delete',
            'users show', // Tambahkan jika ada halaman detail
        ];
        $allPermissions = array_merge($allPermissions, $userPermissions);

        // Permissions untuk modul Roles
        $rolePermissions = [
            'roles index',
            'roles create',
            'roles edit',
            'roles delete',
            'roles show', // Tambahkan jika ada halaman detail
        ];
        $allPermissions = array_merge($allPermissions, $rolePermissions);

        // Permissions untuk modul Permissions itu sendiri
        $permissionPermissions = [
            'permissions index',
            'permissions create',
            'permissions edit',
            'permissions delete',
            'permissions show', // Tambahkan jika ada halaman detail
        ];
        $allPermissions = array_merge($allPermissions, $permissionPermissions);

        // Permissions untuk modul Students
        $studentPermissions = [
            'students index',
            'students create',
            'students edit',
            'students delete',
            'students show', // Tambahkan jika ada halaman detail
        ];
        $allPermissions = array_merge($allPermissions, $studentPermissions);

        // Permissions untuk modul Majors
        $majorPermissions = [
            'majors index',
            'majors create',
            'majors edit',
            'majors delete',
            'majors show', // Tambahkan jika ada halaman detail
        ];
        $allPermissions = array_merge($allPermissions, $majorPermissions);

        // Permissions untuk modul Academic Years
        $academicYearPermissions = [
            'academic-years index',
            'academic-years create',
            'academic-years edit',
            'academic-years delete',
            'academic-years show', // Tambahkan jika ada halaman detail
        ];
        $allPermissions = array_merge($allPermissions, $academicYearPermissions);

        // Permissions untuk modul Semesters
        $semesterPermissions = [
            'semesters index',
            'semesters create',
            'semesters edit',
            'semesters delete',
            'semesters show', // Tambahkan jika ada halaman detail
        ];
        $allPermissions = array_merge($allPermissions, $semesterPermissions);

        // Permissions untuk modul Classes
        $classPermissions = [
            'classes index',
            'classes create',
            'classes edit',
            'classes delete',
            'classes show', // Tambahkan jika ada halaman detail
        ];
        $allPermissions = array_merge($allPermissions, $classPermissions);

        // ==========================================================
        // === Tambahkan Permissions untuk modul Enrollments di sini ===
        $enrollmentPermissions = [
            'enrollments index',
            'enrollments create',
            'enrollments edit',
            'enrollments delete',
            'enrollments show', // Opsional, jika Anda akan memiliki halaman detail enrollment
        ];
        $allPermissions = array_merge($allPermissions, $enrollmentPermissions);
        // ==========================================================

        $educationStaffPermissions = [
            'education_staff index',
            'education_staff create',
            'education_staff edit',
            'education_staff delete',
            'education_staff show',
        ];
        $allPermissions = array_merge($allPermissions, $educationStaffPermissions);

    
        $prestasiTarunaPermissions = [
            'achievement_types index',
            'achievement_types create',
            'achievement_types edit',
            'achievement_types delete',
            'student_achievements index',
            'student_achievements create',
            'student_achievements edit',
            'student_achievements delete',
            'student_achievements show',
        ];
        $allPermissions = array_merge($allPermissions, $prestasiTarunaPermissions);

        $pelanggaranTarunaPermissions = [
            'violation_types index',
            'violation_types create',
            'violation_types edit',
            'violation_types delete',
            'student_violations index',
            'student_violations create',
            'student_violations edit',
            'student_violations delete',
            'student_violations show',
        ];
        $allPermissions = array_merge($allPermissions, $pelanggaranTarunaPermissions);

        // Buat atau perbarui semua permissions yang didefinisikan
        echo "Seeding Permissions...\\n";
        foreach ($allPermissions as $permissionName) {
            Permission::firstOrCreate(['name' => $permissionName, 'guard_name' => $guardName]);
            echo "  - Permission '{$permissionName}' created/ensured.\\n";
        }
        echo "Finished seeding Permissions.\\n";


        // Assign permissions ke role 'admin'
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => $guardName]);
        if ($adminRole) {
            // Berikan semua permissions yang ada ke role admin
            $allPermissionsInDb = Permission::where('guard_name', $guardName)->get();
            if ($allPermissionsInDb->isNotEmpty()) {
                 $adminRole->syncPermissions($allPermissionsInDb);
                 echo "All permissions ({$allPermissionsInDb->count()}) synced to role '{$adminRole->name}'.\\n";
            } else {
                 echo "Warning: No permissions found in database to sync to role '{$adminRole->name}'.\\n";
            }
        } else {
             echo "Warning: Role 'admin' not found. Cannot assign permissions.\\n";
        }

        // Assign permissions ke role 'user' (atau role lain yang Anda miliki)
        $userRole = Role::firstOrCreate(['name' => 'user', 'guard_name' => $guardName]);
        if ($userRole) {
            $userSpecificPermissions = [
                'dashboard index',
                'majors index',
                'academic-years index',
                'semesters index',
                'classes index',
                'students index', // User mungkin perlu melihat daftar siswa
                'enrollments index', // User mungkin perlu melihat daftar pendaftaran
                // Tambahkan permissions lain yang sesuai untuk role 'user'
            ];
            $permissionsToAssignToUser = Permission::whereIn('name', $userSpecificPermissions)->where('guard_name', $guardName)->get();

            if ($permissionsToAssignToUser->isNotEmpty()) {
                $userRole->syncPermissions($permissionsToAssignToUser);
                echo "Specific permissions synced to role '{$userRole->name}'.\\n";
            } else {
                 echo "Warning: No specific permissions found to sync to role '{$userRole->name}'.\\n";
            }
        } else {
             echo "Warning: Role 'user' not found. Cannot assign permissions.\\n";
        }
        echo "Finished assigning permissions.\\n";

        // Pastikan cache permission dibersihkan setelah operasi seeding
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
    }
}