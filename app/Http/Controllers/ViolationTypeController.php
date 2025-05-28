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
            new Middleware('permission:violation_types index', only: ['index']), // DIPERBARUI
            new Middleware('permission:violation_types create', only: ['create', 'store']), // DIPERBARUI
            new Middleware('permission:violation_types edit', only: ['edit', 'update']), // DIPERBARUI
            new Middleware('permission:violation_types delete', only: ['destroy']), // DIPERBARUI
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

        return Inertia::render('ViolationType/Index', [ // DIPERBARUI PATH INERTIA
            'violationTypes' => $violationTypes, // DIPERBARUI
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('ViolationType/Create'); // DIPERBARUI PATH INERTIA
    }

    public function store(Request $request)
    {
        $request->validate([
            'kategori' => 'required|string|max:255',
            'deskripsi' => 'required|string|max:255',
            'poin' => 'required|integer|min:1',
            'aktif' => 'boolean',
        ]);

        ViolationType::create($request->all()); // DIPERBARUI

        return redirect()->route('violation-types.index') // DIPERBARUI NAMA RUTE
                         ->with('success', 'Jenis Pelanggaran berhasil ditambahkan.');
    }

    public function edit(ViolationType $violationType) // DIPERBARUI
    {
        return Inertia::render('ViolationType/Edit', [ // DIPERBARUI PATH INERTIA
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