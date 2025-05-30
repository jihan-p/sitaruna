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

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
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
    Route::resource('achievement-types', AchievementTypeController::class);

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
