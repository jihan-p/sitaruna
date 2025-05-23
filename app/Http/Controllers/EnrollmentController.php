<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use App\Models\Student; // Import Model Student
use App\Models\ClassModel; // Import Model ClassModel (Kelas)
use App\Models\AcademicYear; // Import Model AcademicYear (Tahun Ajaran)
use App\Models\Semester; // Import Model Semester
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Session; // Import Session untuk filter

class EnrollmentController extends Controller implements HasMiddleware
{
    // Middleware untuk otorisasi akses ke setiap method
    public static function middleware(): array
    {
        return [
            new Middleware('permission:enrollments index', only: ['index']),
            new Middleware('permission:enrollments create', only: ['create', 'store']),
            new Middleware('permission:enrollments edit', only: ['edit', 'update']),
            new Middleware('permission:enrollments delete', only: ['destroy']),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Enrollment::query();

        // Menggunakan with() untuk eager loading relasi
        $query->with(['student', 'class.major', 'academicYear', 'semester']);

        // Implementasi Pencarian
        if ($search = $request->input('search')) {
            $query->whereHas('student', function ($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                  ->orWhere('nisn', 'like', "%{$search}%");
            })->orWhereHas('class', function ($q) use ($search) {
                $q->where('nama_kelas', 'like', "%{$search}%");
            });
        }

        // Ambil filter tahun ajaran dan semester aktif dari session
        $activeAcademicYearId = Session::get('active_academic_year_id');
        $activeSemesterId = Session::get('active_semester_id');

        // Terapkan filter berdasarkan tahun ajaran dan semester aktif
        if ($activeAcademicYearId) {
            $query->where('academic_year_id', $activeAcademicYearId);
        }
        if ($activeSemesterId) {
            $query->where('semester_id', $activeSemesterId);
        }

        // Handle sorting
        $sortColumn = $request->input('sort_column', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');

        // Pastikan kolom yang disortir valid untuk menghindari SQL injection
        $validSortColumns = ['created_at', 'student_id', 'class_id', 'academic_year_id', 'semester_id', 'no_absen'];
        if (!in_array($sortColumn, $validSortColumns)) {
            $sortColumn = 'created_at';
        }
        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'desc';
        }

        $query->orderBy($sortColumn, $sortDirection);

        $enrollments = $query->paginate(10)->withQueryString();

        return Inertia::render('Enrollments/Index', [
            'enrollments' => $enrollments,
            'filters' => $request->only(['search', 'sort_column', 'sort_direction']),
            'currentAcademicYearId' => $activeAcademicYearId, // Kirim ke frontend
            'currentSemesterId' => $activeSemesterId, // Kirim ke frontend
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Ambil semua data yang dibutuhkan untuk dropdown di form
        $students = Student::all(['id', 'nama_lengkap', 'nisn']);
        $classes = ClassModel::with('major')->get(['id', 'nama_kelas']);
        $academicYears = AcademicYear::with('semesters')->get()->map(function($year) {
            return [
                'id' => $year->id,
                'nama_tahun_ajaran' => $year->nama_tahun_ajaran,
                'semesters' => $year->semesters->map(function($semester) {
                    return [
                        'id' => $semester->id,
                        'nama_semester' => $semester->nama_semester,
                    ];
                }),
            ];
        });

        return Inertia::render('Enrollments/Create', [
            'students' => $students,
            'classes' => $classes,
            'academic_years' => $academicYears, // Menggunakan nama yang konsisten dengan frontend
            // 'semesters' akan diambil melalui relasi di academic_years
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'student_id' => [
                'required',
                'exists:students,id',
                // Pastikan kombinasi student_id, academic_year_id, semester_id unik
                Rule::unique('enrollments')->where(function ($query) use ($request) {
                    return $query->where('academic_year_id', $request->academic_year_id)
                                 ->where('semester_id', $request->semester_id);
                }),
            ],
            'class_id' => 'required|exists:classes,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'semester_id' => 'required|exists:semesters,id',
            'no_absen' => [
                'nullable',
                'integer',
                'min:1',
                // Opsional: unik nomor absen dalam satu kelas, tahun ajaran, dan semester
                Rule::unique('enrollments')->where(function ($query) use ($request) {
                    return $query->where('class_id', $request->class_id)
                                 ->where('academic_year_id', $request->academic_year_id)
                                 ->where('semester_id', $request->semester_id);
                }),
            ],
        ], [
            'student_id.unique' => 'Siswa ini sudah terdaftar di tahun ajaran dan semester yang sama.',
            'no_absen.unique' => 'Nomor absen ini sudah digunakan di kelas, tahun ajaran, dan semester yang sama.',
        ]);

        Enrollment::create($request->all());

        return redirect()->route('enrollments.index')
                         ->with('success', 'Pendaftaran Siswa berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Enrollment $enrollment)
    {
        // Relasi dimuat agar data bisa diakses di frontend
        $enrollment->load(['student', 'class.major', 'academicYear', 'semester']);

        return Inertia::render('Enrollments/Show', [
            'enrollment' => $enrollment,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Enrollment $enrollment)
    {
        // Ambil semua data yang dibutuhkan untuk dropdown di form edit
        $students = Student::all(['id', 'nama_lengkap', 'nisn']);
        // Perbaikan: Memuat relasi 'major' untuk ClassModel
        $classes = ClassModel::with('major')->get(['id', 'nama_kelas']);
        $academicYears = AcademicYear::with('semesters')->get()->map(function($year) {
            return [
                'id' => $year->id,
                'nama_tahun_ajaran' => $year->nama_tahun_ajaran,
                'semesters' => $year->semesters->map(function($semester) {
                    return [
                        'id' => $semester->id,
                        'nama_semester' => $semester->nama_semester,
                    ];
                }),
            ];
        });

        // Perbaikan: Memuat relasi 'class.major' pada enrollment yang akan diedit
        $enrollment->load(['student', 'class.major', 'academicYear', 'semester']);

        return Inertia::render('Enrollments/Edit', [
            'enrollment' => $enrollment,
            'students' => $students,
            'classes' => $classes,
            'academic_years' => $academicYears,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Enrollment $enrollment)
    {
        $request->validate([
            'student_id' => [
                'required',
                'exists:students,id',
                // Pastikan kombinasi student_id, academic_year_id, semester_id unik, abaikan ID enrollment yang sedang diedit
                Rule::unique('enrollments')->where(function ($query) use ($request) {
                    return $query->where('academic_year_id', $request->academic_year_id)
                                 ->where('semester_id', $request->semester_id);
                })->ignore($enrollment->id),
            ],
            'class_id' => 'required|exists:classes,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'semester_id' => 'required|exists:semesters,id',
            'no_absen' => [
                'nullable',
                'integer',
                'min:1',
                // Opsional: unik nomor absen dalam satu kelas, tahun ajaran, dan semester, abaikan ID enrollment yang sedang diedit
                Rule::unique('enrollments')->where(function ($query) use ($request) {
                    return $query->where('class_id', $request->class_id)
                                 ->where('academic_year_id', $request->academic_year_id)
                                 ->where('semester_id', $request->semester_id);
                })->ignore($enrollment->id),
            ],
        ], [
            'student_id.unique' => 'Siswa ini sudah terdaftar di tahun ajaran dan semester yang sama.',
            'no_absen.unique' => 'Nomor absen ini sudah digunakan di kelas, tahun ajaran, dan semester yang sama.',
        ]);

        $enrollment->update($request->all());

        return redirect()->route('enrollments.index')
                         ->with('success', 'Pendaftaran Siswa berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Enrollment $enrollment)
    {
        $enrollment->delete();

        return redirect()->route('enrollments.index')
                         ->with('success', 'Pendaftaran Siswa berhasil dihapus.');
    }
}