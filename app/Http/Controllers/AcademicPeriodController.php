<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\Semester;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session; // Untuk session
use Inertia\Inertia; // Jika nanti digunakan untuk rendering, tapi di sini lebih ke API

class AcademicPeriodController extends Controller
{
    /**
     * Get all academic years and their associated semesters.
     */
    public function getAllAcademicPeriods()
    {
        // Ambil semua tahun ajaran dengan semester-semesternya
        $academicYears = AcademicYear::with('semesters')->get()->map(function ($year) {
            return [
                'id' => $year->id,
                'nama_tahun_ajaran' => $year->nama_tahun_ajaran,
                'semesters' => $year->semesters->map(function ($semester) {
                    return [
                        'id' => $semester->id,
                        'nama_semester' => $semester->nama_semester,
                        'tahun_ajaran_id' => $semester->tahun_ajaran_id,
                        'is_active' => $semester->is_active, // Jika perlu menampilkan status aktif dari DB
                    ];
                })
            ];
        });

        return response()->json([
            'academicYears' => $academicYears,
        ]);
    }

    /**
     * Set the active academic year and semester in the session.
     * This will be used to filter data across the application.
     */
    public function setActiveAcademicPeriod(Request $request)
    {
        $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'semester_id' => 'required|exists:semesters,id',
        ]);

        // Pastikan semester_id yang dipilih memang bagian dari academic_year_id yang dipilih
        $semester = Semester::where('id', $request->semester_id)
                            ->where('tahun_ajaran_id', $request->academic_year_id)
                            ->first();

        if (!$semester) {
            // Redirect back with an error, similar to how form validation errors are handled
            return back()->withErrors(['semester_id' => 'Kombinasi tahun ajaran dan semester tidak valid.'])->withInput();
        }

        // Simpan ke session
        Session::put('active_academic_year_id', $request->academic_year_id);
        Session::put('active_semester_id', $request->semester_id);

        // Redirect back with a success message, consistent with typical Inertia form handling
        return back()->with('success', 'Periode akademik berhasil diperbarui.');
    }
}