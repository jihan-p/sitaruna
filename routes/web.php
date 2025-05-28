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
    Route::resource('/users', UserController::class);

    // students route
    Route::resource('/students', StudentController::class);

    // === Routes untuk Modul Jurusan ===
    Route::resource('majors', MajorController::class);

    // academic_years route
    Route::resource('academic-years', AcademicYearController::class);

    // semesters route
    Route::resource('semesters', SemesterController::class);

    // class route
    Route::resource('classes', ClassController::class);

    // enrollments route
    Route::resource('enrollments', EnrollmentController::class);

    Route::resource('education_staff', EducationStaffController::class);

    // Rute untuk Jenis Prestasi
    Route::resource('achievement-types', AchievementTypeController::class);

    // Rute untuk Prestasi Taruna
    Route::resource('student-achievements', StudentAchievementController::class);

    // Rute untuk Jenis Pelanggaran
    Route::resource('violation-types', ViolationTypeController::class);

    // Rute untuk Pelanggaran Taruna
    Route::resource('student-violations', StudentViolationController::class);

    Route::post('/set-academic-period', function (Request $request) {
        $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'semester_id' => 'required|exists:semesters,id',
        ]);

        session([
            'active_academic_year_id' => $request->academic_year_id,
            'active_semester_id' => $request->semester_id,
        ]);

        return back()->with('success', 'Academic period updated successfully.');
    })->name('set.academic.period'); // THIS IS THE MISSING ROUTE NAME
    
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
