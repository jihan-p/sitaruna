<?php

namespace App\Http\Controllers;

use App\Models\AchievementType; // DIPERBARUI
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Routing\Controllers\HasMiddleware;
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
}