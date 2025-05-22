<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\AcademicYear; // Import AcademicYear
use App\Models\Semester;     // Import Semester
use Illuminate\Support\Facades\Session; // Import Session

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // Ambil daftar semua tahun ajaran dan semester untuk dropdown
        $allAcademicYears = AcademicYear::with('semesters')->get()->map(function ($year) {
            return [
                'id' => $year->id,
                'nama_tahun_ajaran' => $year->nama_tahun_ajaran,
                'semesters' => $year->semesters->map(function ($semester) {
                    return [
                        'id' => $semester->id,
                        'nama_semester' => $semester->nama_semester,
                        // Tidak perlu tahun_ajaran_id lagi di sini karena sudah terkelompok
                    ];
                }),
            ];
        });

        // Ambil nilai aktif dari session
        $activeAcademicYearId = Session::get('active_academic_year_id');
        $activeSemesterId = Session::get('active_semester_id');

        // Set default jika belum ada di session (misal: ambil yang pertama atau yang is_active=true)
        if (!$activeAcademicYearId && !$activeSemesterId) {
            $defaultSemester = Semester::where('is_active', true)->first();
            if ($defaultSemester) {
                $activeAcademicYearId = $defaultSemester->tahun_ajaran_id;
                $activeSemesterId = $defaultSemester->id;
                Session::put('active_academic_year_id', $activeAcademicYearId);
                Session::put('active_semester_id', $activeSemesterId);
            } elseif ($allAcademicYears->isNotEmpty() && $allAcademicYears->first()['semesters']->isNotEmpty()) {
                // Jika tidak ada yang aktif, ambil yang pertama sebagai default
                $activeAcademicYearId = $allAcademicYears->first()['id'];
                $activeSemesterId = $allAcademicYears->first()['semesters']->first()['id'];
                Session::put('active_academic_year_id', $activeAcademicYearId);
                Session::put('active_semester_id', $activeSemesterId);
            }
        }


        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'permissions' => $request->user() ? $request->user()->getUserPermissions() : [],
            ],
            'academicYears' => $allAcademicYears,
            'activeAcademicYearId' => $activeAcademicYearId,
            'activeSemesterId' => $activeSemesterId,
        ];
    }
}
