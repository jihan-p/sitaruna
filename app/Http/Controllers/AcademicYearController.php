<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class AcademicYearController extends Controller implements HasMiddleware
{
    // === Middleware Permission ===
    public static function middleware()
    {
        return [
            new Middleware('permission:academic-years index', only: ['index']),
            new Middleware('permission:academic-years create', only: ['create', 'store']),
            new Middleware('permission:academic-years edit', only: ['edit', 'update']),
            new Middleware('permission:academic-years delete', only: ['destroy']),
            // Jika butuh detail/show:
            // new Middleware('permission:academic-years show', only: ['show']),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = AcademicYear::query();

        // === Pencarian ===
        if ($request->has('search')) {
            $query->where('nama_tahun_ajaran', 'like', '%' . $request->search . '%')
                  ->orWhere('tahun_mulai', 'like', '%' . $request->search . '%')
                  ->orWhere('tahun_selesai', 'like', '%' . $request->search . '%');
        }

        // === Pagination ===
        $perPage = $request->input('perPage', 10);

        $academicYears = $query
            ->orderBy('tahun_mulai', 'desc')
            ->paginate($perPage)
            ->withQueryString(); // Sertakan semua query string (search, perPage, page)

        return Inertia::render('AcademicYears/Index', [
            'academicYearsPaginated' => $academicYears,
            // Kirim semua filter, termasuk page
            'filters'       => $request->only(['search', 'perPage', 'page']),
            'perPage'       => (int) $perPage,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('AcademicYears/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_tahun_ajaran' => ['required','string','max:255','unique:academic_years'],
            'tahun_mulai'       => ['required','integer','digits:4'],
            'tahun_selesai'     => ['required','integer','digits:4','gt:tahun_mulai'],
        ]);

        AcademicYear::create($request->only([
            'nama_tahun_ajaran',
            'tahun_mulai',
            'tahun_selesai',
        ]));

        return redirect()
            ->route('academic-years.index')
            ->with('success','Data Tahun Ajaran berhasil ditambahkan.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AcademicYear $academicYear)
    {
        return Inertia::render('AcademicYears/Edit', [
            'academicYear' => $academicYear,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AcademicYear $academicYear)
    {
        $request->validate([
            'nama_tahun_ajaran' => ['required','string','max:255',"unique:academic_years,nama_tahun_ajaran,{$academicYear->id}"],
            'tahun_mulai'       => ['required','integer','digits:4'],
            'tahun_selesai'     => ['required','integer','digits:4','gt:tahun_mulai'],
        ]);

        $academicYear->update($request->only([
            'nama_tahun_ajaran',
            'tahun_mulai',
            'tahun_selesai',
        ]));

        return redirect()
            ->route('academic-years.index')
            ->with('success','Data Tahun Ajaran berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AcademicYear $academicYear)
    {
        if ($academicYear->semesters()->exists()) {
            return back()->with('error','Tidak dapat menghapus karena masih memiliki data Semester.');
        }

        $academicYear->delete();

        return redirect()
            ->route('academic-years.index')
            ->with('success','Data Tahun Ajaran berhasil dihapus.');
    }
}
