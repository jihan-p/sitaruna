<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EducationStaffController; 
use App\Http\Controllers\StudentController;
use App\Http\Controllers\MajorController;
use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\SemesterController;
use App\Http\Controllers\ClassController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\AcademicPeriodController;
use App\Http\Controllers\AchievementTypeController;
use App\Http\Controllers\StudentAchievementController;
use App\Http\Controllers\ViolationTypeController;
use App\Http\Controllers\StudentViolationController;

// Model untuk Dashboard
use App\Models\Student;
use App\Models\EducationStaff;
use App\Models\Major;
use App\Models\ClassModel;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission as SpatiePermission; // Alias untuk menghindari konflik
use App\Models\ViolationType;
use App\Models\StudentViolation;
use App\Models\AchievementType;
use App\Models\StudentAchievement;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function (Request $request) {
    // Ambil periode akademik aktif dari session jika ada
    // $activeAcademicYearId = $request->session()->get('active_academic_year_id');
    // $activeSemesterId = $request->session()->get('active_semester_id');

    $stats = [
        'totalStudents' => Student::count(),
        'totalEducationStaff' => EducationStaff::count(),
        'totalMajors' => Major::count(),
        'totalClasses' => ClassModel::count(),
        'totalUsers' => User::count(),
        'totalRoles' => Role::count(),
        // 'totalPermissions' => SpatiePermission::count(), // Jika diperlukan
        'totalViolationTypes' => ViolationType::count(),
        'totalStudentViolations' => StudentViolation::count(), // Bisa difilter by periode aktif
        'totalAchievementTypes' => AchievementType::count(),
        'totalStudentAchievements' => StudentAchievement::count(), // Bisa difilter by periode aktif
    ];

    return Inertia::render('Dashboard', ['stats' => $stats]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {

    Route::get('/api/academic-years', [AcademicYearController::class, 'index'])->name('api.academic-years.index');
    Route::get('/api/semesters', [SemesterController::class, 'index'])->name('api.semesters.index');

    // permissions route
    Route::resource('/permissions', PermissionController::class);

    // roles route
    Route::resource('roles', RoleController::class)->except('show');

    // users route
        Route::resource('/users', UserController::class)->except('show');

    // students route
    Route::resource('/students', StudentController::class);

    // === Routes untuk Modul Jurusan ===
    Route::resource('majors', MajorController::class);

    // academic_years route
    Route::resource('academic-years', AcademicYearController::class);

    // semesters route
    Route::resource('semesters', SemesterController::class)->except('show');

    // class route
    Route::resource('classes', ClassController::class)->except('show');

    // enrollments route
    Route::resource('enrollments', EnrollmentController::class);

    Route::resource('education-staff', EducationStaffController::class);

    // Rute untuk Jenis Prestasi
    Route::resource('achievement-types', AchievementTypeController::class)->except(['show']);

    // Rute untuk Impor Jenis Prestasi
    Route::get('achievement-types/import', [AchievementTypeController::class, 'showImportForm'])->name('achievement-types.import.form');
    Route::post('achievement-types/import', [AchievementTypeController::class, 'processImport'])->name('achievement-types.import.process');
    Route::get('achievement-types/import/example', [AchievementTypeController::class, 'downloadImportExample'])->name('achievement-types.import.example');

    // Rute untuk Prestasi Taruna
    Route::resource('student-achievements', StudentAchievementController::class);

    // Rute untuk Jenis Pelanggaran
    Route::resource('violation-types', ViolationTypeController::class)->except(['show']);

    // Rute untuk Pelanggaran Taruna
    Route::resource('student-violations', StudentViolationController::class);

    Route::post('/set-academic-period', [AcademicPeriodController::class, 'setActiveAcademicPeriod'])->name('set.academic.period');

    // Di dalam grup middleware auth
    Route::get('violation-types/import', [ViolationTypeController::class, 'showImportForm'])->name('violation-types.import.form');
    Route::post('violation-types/import', [ViolationTypeController::class, 'processImport'])->name('violation-types.import.process');
    Route::get('violation-types/import/example', [ViolationTypeController::class, 'downloadImportExample'])->name('violation-types.import.example');
    
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
