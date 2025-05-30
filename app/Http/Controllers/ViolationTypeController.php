<?php

namespace App\Http\Controllers;

use App\Models\ViolationType; // DIPERBARUI
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Routing\Controllers\HasMiddleware;
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
}