<?php

namespace App\Http\Controllers;

use App\Models\ViolationType; // DIPERBARUI
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Routing\Controllers\HasMiddleware;
use App\Imports\ViolationTypesImport; // Asumsi Anda akan membuat kelas Import ini
use Illuminate\Routing\Controllers\Middleware;

class ViolationTypeController extends Controller implements HasMiddleware // NAMA CLASS DIPERBARUI
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:violation-types index', only: ['index']),
            new Middleware('permission:violation-types create', only: ['create', 'store']),
            new Middleware('permission:violation-types edit', only: ['edit', 'update']),
            new Middleware('permission:violation-types delete', only: ['destroy']),
            new Middleware('permission:violation-types import', only: ['showImportForm', 'processImport']),
        ];
    }

    public function index(Request $request)
    {
        $search = $request->input('search');
        $violationTypes = ViolationType::query() // DIPERBARUI
            ->when($search, function ($query, $search) {
                $query->where('deskripsi', 'like', '%' . $search . '%')
                      ->orWhere('kategori', 'like', '%' . $search . '%');
            })
            ->latest()
            ->paginate(10);

        return Inertia::render('ViolationTypes/Index', [ // DIPERBARUI PATH INERTIA (Plural)
            'violationTypes' => $violationTypes, // DIPERBARUI
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('ViolationTypes/Create'); // DIPERBARUI PATH INERTIA (Plural)
    }

    public function store(Request $request)
    {
        $request->validate([
            'kategori' => 'required|string|max:255',
            'deskripsi' => 'required|string|max:255',
            'poin' => 'required|integer|min:1',
            'aktif' => 'boolean',
            'tanggal_berlaku' => 'nullable|date',
            'tanggal_akhir_berlaku' => 'nullable|date|after_or_equal:tanggal_berlaku',
        ]);

        ViolationType::create($request->all()); // DIPERBARUI

        return redirect()->route('violation-types.index') // DIPERBARUI NAMA RUTE
                         ->with('success', 'Jenis Pelanggaran berhasil ditambahkan.');
    }

    public function edit(ViolationType $violationType) // DIPERBARUI
    {
        return Inertia::render('ViolationTypes/Edit', [ // DIPERBARUI PATH INERTIA (Plural)
            'violationType' => $violationType, // DIPERBARUI
        ]);
    }

    public function update(Request $request, ViolationType $violationType) // DIPERBARUI
    {
        $request->validate([
            'kategori' => 'required|string|max:255',
            'deskripsi' => 'required|string|max:255',
            'poin' => 'required|integer|min:1',
            'aktif' => 'boolean',
            'tanggal_berlaku' => 'nullable|date',
            'tanggal_akhir_berlaku' => 'nullable|date|after_or_equal:tanggal_berlaku',
        ]);

        $violationType->update($request->all()); // DIPERBARUI

        return redirect()->route('violation-types.index') // DIPERBARUI NAMA RUTE
                         ->with('success', 'Jenis Pelanggaran berhasil diperbarui.');
    }

    public function destroy(ViolationType $violationType) // DIPERBARUI
    {
        $violationType->delete(); // DIPERBARUI
        return back()->with('success', 'Jenis Pelanggaran berhasil dihapus.');
    }

    /**
     * Show the form for importing violation types.
     */
    public function showImportForm()
    {
        return Inertia::render('ViolationTypes/ImportForm'); // Anda perlu membuat halaman ini
    }

    /**
     * Process the imported file for violation types.
     */
    public function processImport(Request $request)
    {
        $request->validate([
            'import_file' => 'required|file|mimes:xlsx,xls,csv', // Sesuaikan dengan format yang didukung
        ]);

        try {
            // Logika untuk mengimpor file menggunakan Laravel Excel
            // Excel::import(new ViolationTypesImport, $request->file('import_file'));
            // Untuk sekarang, kita hanya akan menampilkan pesan sukses placeholder
            // Ganti komentar di atas dengan implementasi Excel::import Anda

            // Simulasi impor berhasil
            // Hapus ini jika Anda sudah mengimplementasikan Excel::import
            // $file = $request->file('import_file');
            // Log::info("File '{$file->getClientOriginalName()}' akan diimpor.");

            return redirect()->route('violation-types.index')->with('success', 'Data Jenis Pelanggaran berhasil diimpor.');
        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
             $failures = $e->failures();
             // Anda bisa mengirim $failures ke view atau log, atau format sebagai pesan error
             return back()->withErrors(['import_file' => 'Terjadi kesalahan validasi selama impor. Periksa kembali file Anda.'])->with('import_errors', $failures);
        } catch (\Exception $e) {
            // Tangani error umum lainnya
            return back()->withErrors(['import_file' => 'Terjadi kesalahan saat mengimpor file: ' . $e->getMessage()]);
        }
    }
}