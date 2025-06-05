<?php

namespace App\Http\Controllers;

use App\Models\AchievementType; // DIPERBARUI
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Routing\Controllers\HasMiddleware;
use App\Imports\AchievementTypesImport; // Impor kelas import
use Illuminate\Support\Facades\File; // Untuk memeriksa keberadaan file
use Maatwebsite\Excel\Facades\Excel; // Import facade Excel
use Illuminate\Routing\Controllers\Middleware;

class AchievementTypeController extends Controller implements HasMiddleware // NAMA CLASS DIPERBARUI
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:achievement-types index', only: ['index']),
            new Middleware('permission:achievement-types create', only: ['create', 'store']),
            new Middleware('permission:achievement-types edit', only: ['edit', 'update']),
            new Middleware('permission:achievement-types delete', only: ['destroy']),
            new Middleware('permission:achievement-types import', only: ['showImportForm', 'processImport']),
        ];
    }

    public function index(Request $request)
    {
        $search = $request->input('search');
        $achievementTypes = AchievementType::query() // DIPERBARUI
            ->when($search, function ($query, $search) {
                $query->where('deskripsi', 'like', '%' . $search . '%');
            })
            ->latest()
            ->paginate(10);

        return Inertia::render('AchievementTypes/Index', [ // DIPERBARUI PATH INERTIA (Plural)
            'achievementTypes' => $achievementTypes, // DIPERBARUI
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('AchievementTypes/Create'); // DIPERBARUI PATH INERTIA (Plural)
    }

    public function store(Request $request)
    {
        $request->validate([
            'deskripsi' => 'required|string|max:255',
            'poin' => 'required|integer|min:1',
            'aktif' => 'boolean',
            'tanggal_berlaku' => 'nullable|date',
            'tanggal_akhir_berlaku' => 'nullable|date|after_or_equal:tanggal_berlaku',
        ]);

        AchievementType::create($request->all()); // DIPERBARUI

        return redirect()->route('achievement-types.index') // DIPERBARUI NAMA RUTE
                         ->with('success', 'Jenis Prestasi berhasil ditambahkan.');
    }

    public function edit(AchievementType $achievementType) // DIPERBARUI
    {
        return Inertia::render('AchievementTypes/Edit', [ // DIPERBARUI PATH INERTIA (Plural)
            'achievementType' => $achievementType, // DIPERBARUI
        ]);
    }

    public function update(Request $request, AchievementType $achievementType) // DIPERBARUI
    {
        $request->validate([
            'deskripsi' => 'required|string|max:255',
            'poin' => 'required|integer|min:1',
            'aktif' => 'boolean',
            'tanggal_berlaku' => 'nullable|date',
            'tanggal_akhir_berlaku' => 'nullable|date|after_or_equal:tanggal_berlaku',
        ]);

        $achievementType->update($request->all()); // DIPERBARUI

        return redirect()->route('achievement-types.index') // DIPERBARUI NAMA RUTE
                         ->with('success', 'Jenis Prestasi berhasil diperbarui.');
    }

    public function destroy(AchievementType $achievementType) // DIPERBARUI
    {
        $achievementType->delete(); // DIPERBARUI
        return back()->with('success', 'Jenis Prestasi berhasil dihapus.');
    }

    /**
     * Show the form for importing achievement types.
     */
    public function showImportForm()
    {
        return Inertia::render('AchievementTypes/ImportForm');
    }

    /**
     * Process the imported file for achievement types.
     */
    public function processImport(Request $request)
    {
        $request->validate([
            'import_file' => 'required|file|mimes:xlsx,xls,csv',
        ]);

        try {
            Excel::import(new AchievementTypesImport, $request->file('import_file'));
            return redirect()->route('achievement-types.index')->with('success', 'Data Jenis Prestasi berhasil diimpor.');
        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            $failures = $e->failures();
             return back()->withErrors(['import_file' => 'Terjadi kesalahan validasi selama impor. Periksa kembali file Anda.'])->with('import_errors', $failures);
        } catch (\Exception $e) {
            return back()->withErrors(['import_file' => 'Terjadi kesalahan saat mengimpor file: ' . $e->getMessage()]);
        }
    }

    /**
     * Download the example import file for achievement types.
     */
    public function downloadImportExample()
    {
        // Buat file contoh jika belum ada atau sediakan secara manual
        $filePath = public_path('examples/contoh_impor_jenis_prestasi.xlsx');

        if (!File::exists($filePath)) {
            return back()->with('error', 'File contoh tidak ditemukan. Harap buat file contoh_import_jenis_prestasi.xlsx di public/examples/.');
        }
        return response()->download($filePath);
    }
}