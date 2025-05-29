<?php

namespace App\Http\Controllers;

use App\Models\StudentAchievement; // DIPERBARUI
use App\Models\Student;
use App\Models\AchievementType; // DIPERBARUI
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class StudentAchievementController extends Controller implements HasMiddleware // NAMA CLASS DIPERBARUI
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:student-achievements index', only: ['index']),
            new Middleware('permission:student-achievements create', only: ['create', 'store']),
            new Middleware('permission:student-achievements edit', only: ['edit', 'update']),
            new Middleware('permission:student-achievements delete', only: ['destroy']),
            new Middleware('permission:student-achievements show', only: ['show']),
        ];
    }

    public function index(Request $request)
    {
        $search = $request->input('search');
        $studentAchievements = StudentAchievement::with(['student', 'achievementType', 'educationStaff']) // DIPERBARUI
            ->when($search, function ($query, $search) {
                $query->whereHas('student', fn($q) => $q->where('nama_lengkap', 'like', '%' . $search . '%'))
                      ->orWhereHas('achievementType', fn($q) => $q->where('deskripsi', 'like', '%' . $search . '%')) // DIPERBARUI
                      ->orWhere('keterangan_tambahan', 'like', '%' . $search . '%');
            })
            ->latest()
            ->paginate(10);

        return Inertia::render('StudentAchievements/Index', [ // DIPERBARUI PATH INERTIA (Plural)
            'studentAchievements' => $studentAchievements, // DIPERBARUI
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        $students = Student::select('id', 'nama_lengkap', 'nit')->orderBy('nama_lengkap')->get();
        $achievementTypes = AchievementType::where('aktif', true)->select('id', 'deskripsi', 'poin')->orderBy('deskripsi')->get(); // DIPERBARUI

        return Inertia::render('StudentAchievements/Create', [ // DIPERBARUI PATH INERTIA (Plural)
            'students' => $students,
            'achievementTypes' => $achievementTypes, // DIPERBARUI
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'achievement_type_id' => 'required|exists:achievement_types,id', // DIPERBARUI
            'tanggal_prestasi' => 'required|date',
            'keterangan_tambahan' => 'nullable|string|max:255',
            'bukti_prestasi' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:2048',
        ]);

        $achievementType = AchievementType::find($request->achievement_type_id); // DIPERBARUI
        if (!$achievementType) { // DIPERBARUI
            return back()->withErrors(['achievement_type_id' => 'Jenis Prestasi tidak ditemukan.']);
        }

        $data = $request->except('bukti_prestasi');
        $data['education_staff_id'] = Auth::user()->educationStaff?->id;

        if ($request->hasFile('bukti_prestasi')) {
            $path = $request->file('bukti_prestasi')->store('bukti_prestasi', 'public');
            $data['bukti_prestasi'] = $path;
        }

        $studentAchievement = StudentAchievement::create($data); // DIPERBARUI

        $student = Student::find($studentAchievement->student_id); // DIPERBARUI
        if ($student) {
            $student->total_poin_prestasi += $achievementType->poin; // DIPERBARUI
            $student->save();
        }

        return redirect()->route('student-achievements.index') // DIPERBARUI NAMA RUTE
                         ->with('success', 'Prestasi Taruna berhasil ditambahkan.');
    }

    public function show(StudentAchievement $studentAchievement) // DIPERBARUI
    {
        $studentAchievement->load(['student', 'achievementType', 'educationStaff']); // DIPERBARUI
        return Inertia::render('StudentAchievements/Show', [ // DIPERBARUI PATH INERTIA (Plural)
            'studentAchievement' => $studentAchievement, // DIPERBARUI
        ]);
    }

    public function edit(StudentAchievement $studentAchievement) // DIPERBARUI
    {
        $students = Student::select('id', 'nama_lengkap', 'nit')->orderBy('nama_lengkap')->get();
        $achievementTypes = AchievementType::where('aktif', true)->select('id', 'deskripsi', 'poin')->orderBy('deskripsi')->get(); // DIPERBARUI

        $studentAchievement->load(['student', 'achievementType']); // DIPERBARUI

        return Inertia::render('StudentAchievements/Edit', [ // DIPERBARUI PATH INERTIA (Plural)
            'studentAchievement' => $studentAchievement, // DIPERBARUI
            'students' => $students,
            'achievementTypes' => $achievementTypes, // DIPERBARUI
        ]);
    }

    public function update(Request $request, StudentAchievement $studentAchievement) // DIPERBARUI
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'achievement_type_id' => 'required|exists:achievement_types,id', // DIPERBARUI
            'tanggal_prestasi' => 'required|date',
            'keterangan_tambahan' => 'nullable|string|max:255',
            'bukti_prestasi' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:2048',
            'remove_bukti_prestasi' => 'boolean',
        ]);

        $oldAchievementType = $studentAchievement->achievementType; // DIPERBARUI
        $newAchievementType = AchievementType::find($request->achievement_type_id); // DIPERBARUI

        if (!$newAchievementType) {
            return back()->withErrors(['achievement_type_id' => 'Jenis Prestasi baru tidak ditemukan.']);
        }

        $data = $request->except(['bukti_prestasi', 'remove_bukti_prestasi']);

        if ($request->hasFile('bukti_prestasi')) {
            if ($studentAchievement->bukti_prestasi) { // DIPERBARUI
                Storage::disk('public')->delete($studentAchievement->bukti_prestasi); // DIPERBARUI
            }
            $path = $request->file('bukti_prestasi')->store('bukti_prestasi', 'public');
            $data['bukti_prestasi'] = $path;
        } elseif ($request->boolean('remove_bukti_prestasi')) {
            if ($studentAchievement->bukti_prestasi) { // DIPERBARUI
                Storage::disk('public')->delete($studentAchievement->bukti_prestasi); // DIPERBARUI
            }
            $data['bukti_prestasi'] = null;
        } else {
             $data['bukti_prestasi'] = $studentAchievement->bukti_prestasi; // DIPERBARUI
        }

        $studentAchievement->update($data); // DIPERBARUI

        $student = Student::find($studentAchievement->student_id); // DIPERBARUI
        if ($student) {
            $student->total_poin_prestasi -= $oldAchievementType->poin; // DIPERBARUI
            $student->total_poin_prestasi += $newAchievementType->poin; // DIPERBARUI
            $student->save();
        }

        return redirect()->route('student-achievements.index') // DIPERBARUI NAMA RUTE
                         ->with('success', 'Prestasi Taruna berhasil diperbarui.');
    }

    public function destroy(StudentAchievement $studentAchievement) // DIPERBARUI
    {
        $achievementType = $studentAchievement->achievementType; // DIPERBARUI
        $student = $studentAchievement->student; // DIPERBARUI
        if ($student && $achievementType) {
            $student->total_poin_prestasi -= $achievementType->poin; // DIPERBARUI
            $student->save();
        }

        if ($studentAchievement->bukti_prestasi) { // DIPERBARUI
            Storage::disk('public')->delete($studentAchievement->bukti_prestasi); // DIPERBARUI
        }

        $studentAchievement->delete(); // DIPERBARUI

        return back()->with('success', 'Prestasi Taruna berhasil dihapus.');
    }
}