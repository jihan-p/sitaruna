<?php

namespace App\Http\Controllers;

use App\Models\StudentViolation; // DIPERBARUI
use App\Models\Student;
use App\Models\ViolationType; // DIPERBARUI
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class StudentViolationController extends Controller implements HasMiddleware // NAMA CLASS DIPERBARUI
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:student_violations index', only: ['index']), // DIPERBARUI
            new Middleware('permission:student_violations create', only: ['create', 'store']), // DIPERBARUI
            new Middleware('permission:student_violations edit', only: ['edit', 'update']), // DIPERBARUI
            new Middleware('permission:student_violations delete', only: ['destroy']), // DIPERBARUI
            new Middleware('permission:student_violations show', only: ['show']), // DIPERBARUI
        ];
    }

    public function index(Request $request)
    {
        $search = $request->input('search');
        $studentViolations = StudentViolation::with(['student', 'violationType', 'educationStaff']) // DIPERBARUI
            ->when($search, function ($query, $search) {
                $query->whereHas('student', fn($q) => $q->where('nama_lengkap', 'like', '%' . $search . '%'))
                      ->orWhereHas('violationType', fn($q) => $q->where('deskripsi', 'like', '%' . $search . '%')) // DIPERBARUI
                      ->orWhere('keterangan_kejadian', 'like', '%' . $search . '%');
            })
            ->latest()
            ->paginate(10);

        return Inertia::render('StudentViolation/Index', [ // DIPERBARUI PATH INERTIA
            'studentViolations' => $studentViolations, // DIPERBARUI
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        $students = Student::select('id', 'nama_lengkap', 'nit')->orderBy('nama_lengkap')->get();
        $violationTypes = ViolationType::where('aktif', true)->select('id', 'deskripsi', 'poin', 'kategori')->orderBy('deskripsi')->get(); // DIPERBARUI

        return Inertia::render('StudentViolation/Create', [ // DIPERBARUI PATH INERTIA
            'students' => $students,
            'violationTypes' => $violationTypes, // DIPERBARUI
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'violation_type_id' => 'required|exists:violation_types,id', // DIPERBARUI
            'tanggal_pelanggaran' => 'required|date',
            'jam_pelanggaran' => 'nullable|date_format:H:i',
            'keterangan_kejadian' => 'nullable|string|max:255',
            'bukti_pelanggaran' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:2048',
        ]);

        $violationType = ViolationType::find($request->violation_type_id); // DIPERBARUI
        if (!$violationType) { // DIPERBARUI
            return back()->withErrors(['violation_type_id' => 'Jenis Pelanggaran tidak ditemukan.']);
        }

        $data = $request->except('bukti_pelanggaran');
        $data['education_staff_id'] = Auth::user()->educationStaff?->id;

        if ($request->hasFile('bukti_pelanggaran')) {
            $path = $request->file('bukti_pelanggaran')->store('bukti_pelanggaran', 'public');
            $data['bukti_pelanggaran'] = $path;
        }

        $studentViolation = StudentViolation::create($data); // DIPERBARUI

        $student = Student::find($studentViolation->student_id); // DIPERBARUI
        if ($student) {
            $student->total_poin_pelanggaran += $violationType->poin; // DIPERBARUI
            $student->save();
        }

        return redirect()->route('student-violations.index') // DIPERBARUI NAMA RUTE
                         ->with('success', 'Pelanggaran Taruna berhasil ditambahkan.');
    }

    public function show(StudentViolation $studentViolation) // DIPERBARUI
    {
        $studentViolation->load(['student', 'violationType', 'educationStaff']); // DIPERBARUI
        return Inertia::render('StudentViolation/Show', [ // DIPERBARUI PATH INERTIA
            'studentViolation' => $studentViolation, // DIPERBARUI
        ]);
    }

    public function edit(StudentViolation $studentViolation) // DIPERBARUI
    {
        $students = Student::select('id', 'nama_lengkap', 'nit')->orderBy('nama_lengkap')->get();
        $violationTypes = ViolationType::where('aktif', true)->select('id', 'deskripsi', 'poin', 'kategori')->orderBy('deskripsi')->get(); // DIPERBARUI

        $studentViolation->load(['student', 'violationType']); // DIPERBARUI

        return Inertia::render('StudentViolation/Edit', [ // DIPERBARUI PATH INERTIA
            'studentViolation' => $studentViolation, // DIPERBARUI
            'students' => $students,
            'violationTypes' => $violationTypes, // DIPERBARUI
        ]);
    }

    public function update(Request $request, StudentViolation $studentViolation) // DIPERBARUI
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'violation_type_id' => 'required|exists:violation_types,id', // DIPERBARUI
            'tanggal_pelanggaran' => 'required|date',
            'jam_pelanggaran' => 'nullable|date_format:H:i',
            'keterangan_kejadian' => 'nullable|string|max:255',
            'bukti_pelanggaran' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:2048',
            'remove_bukti_pelanggaran' => 'boolean',
        ]);

        $oldViolationType = $studentViolation->violationType; // DIPERBARUI
        $newViolationType = ViolationType::find($request->violation_type_id); // DIPERBARUI

        if (!$newViolationType) {
            return back()->withErrors(['violation_type_id' => 'Jenis Pelanggaran baru tidak ditemukan.']);
        }

        $data = $request->except(['bukti_pelanggaran', 'remove_bukti_pelanggaran']);

        if ($request->hasFile('bukti_pelanggaran')) {
            if ($studentViolation->bukti_pelanggaran) { // DIPERBARUI
                Storage::disk('public')->delete($studentViolation->bukti_pelanggaran); // DIPERBARUI
            }
            $path = $request->file('bukti_pelanggaran')->store('bukti_pelanggaran', 'public');
            $data['bukti_pelanggaran'] = $path;
        } elseif ($request->boolean('remove_bukti_pelanggaran')) {
            if ($studentViolation->bukti_pelanggaran) { // DIPERBARUI
                Storage::disk('public')->delete($studentViolation->bukti_pelanggaran); // DIPERBARUI
            }
            $data['bukti_pelanggaran'] = null;
        } else {
             $data['bukti_pelanggaran'] = $studentViolation->bukti_pelanggaran; // DIPERBARUI
        }

        $studentViolation->update($data); // DIPERBARUI

        $student = Student::find($studentViolation->student_id); // DIPERBARUI
        if ($student) {
            $student->total_poin_pelanggaran -= $oldViolationType->poin; // DIPERBARUI
            $student->total_poin_pelanggaran += $newViolationType->poin; // DIPERBARUI
            $student->save();
        }

        return redirect()->route('student-violations.index') // DIPERBARUI NAMA RUTE
                         ->with('success', 'Pelanggaran Taruna berhasil diperbarui.');
    }

    public function destroy(StudentViolation $studentViolation) // DIPERBARUI
    {
        $violationType = $studentViolation->violationType; // DIPERBARUI
        $student = $studentViolation->student; // DIPERBARUI
        if ($student && $violationType) {
            $student->total_poin_pelanggaran -= $violationType->poin; // DIPERBARUI
            $student->save();
        }

        if ($studentViolation->bukti_pelanggaran) { // DIPERBARUI
            Storage::disk('public')->delete($studentViolation->bukti_pelanggaran); // DIPERBARUI
        }

        $studentViolation->delete(); // DIPERBARUI

        return back()->with('success', 'Pelanggaran Taruna berhasil dihapus.');
    }
}