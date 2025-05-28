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
            new Middleware('permission:achievement_types index', only: ['index']), // DIPERBARUI
            new Middleware('permission:achievement_types create', only: ['create', 'store']), // DIPERBARUI
            new Middleware('permission:achievement_types edit', only: ['edit', 'update']), // DIPERBARUI
            new Middleware('permission:achievement_types delete', only: ['destroy']), // DIPERBARUI
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

        return Inertia::render('AchievementType/Index', [ // DIPERBARUI PATH INERTIA
            'achievementTypes' => $achievementTypes, // DIPERBARUI
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('AchievementType/Create'); // DIPERBARUI PATH INERTIA
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
        return Inertia::render('AchievementType/Edit', [ // DIPERBARUI PATH INERTIA
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