<?php

namespace App\Http\Controllers;

use App\Models\StudentViolation; // DIPERBARUI
use App\Models\Student;
use App\Models\ViolationType; // DIPERBARUI
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class StudentViolationController extends Controller
{
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

        return Inertia::render('StudentViolations/Index', [ // DIPERBARUI PATH INERTIA (Plural)
            'studentViolations' => $studentViolations, // DIPERBARUI
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        $students = Student::select('id', 'nama_lengkap', 'nit')->orderBy('nama_lengkap')->get();
        $violationTypes = ViolationType::where('aktif', true)->select('id', 'deskripsi', 'poin', 'kategori')->orderBy('deskripsi')->get(); // DIPERBARUI

        return Inertia::render('StudentViolations/Create', [ // DIPERBARUI PATH INERTIA (Plural)
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
            'jam_pelanggaran' => 'nullable|date_format:H:i', // Validasi format 24 jam (HH:MM)
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

        DB::transaction(function () use ($data, $violationType) {
            $studentViolation = StudentViolation::create($data);

            $student = Student::find($studentViolation->student_id);
            if ($student) {
                $student->total_poin_pelanggaran += $violationType->poin;
                $student->save();
            }
        });

        return redirect()->route('student-violations.index') // DIPERBARUI NAMA RUTE
                         ->with('success', 'Pelanggaran Taruna berhasil ditambahkan.');
    }

    public function show(StudentViolation $studentViolation)
    {
        $studentViolation->load(['student', 'violationType', 'educationStaff']);
        return Inertia::render('StudentViolations/Show', [
            'studentViolation' => $studentViolation,
        ]);
    }

    public function edit(StudentViolation $studentViolation) // DIPERBARUI
    {
        $students = Student::select('id', 'nama_lengkap', 'nit')->orderBy('nama_lengkap')->get();
        $violationTypes = ViolationType::where('aktif', true)->select('id', 'deskripsi', 'poin', 'kategori')->orderBy('deskripsi')->get(); // DIPERBARUI
        $studentViolation->load(['student', 'violationType']);

        // Format jam_pelanggaran for the time input field
        // The database stores TIME as HH:MM:SS. The 'datetime' cast makes it a Carbon instance.
        // We need to extract HH:MM for the <input type="time">.
        $studentViolation->formatted_jam_pelanggaran = $studentViolation->jam_pelanggaran
            ? \Carbon\Carbon::parse($studentViolation->jam_pelanggaran)->format('H:i')
            : '';


        return Inertia::render('StudentViolations/Edit', [
            'studentViolation' => $studentViolation,
            'students' => $students,
            'violationTypes' => $violationTypes,
        ]);
    }

    public function update(Request $request, StudentViolation $studentViolation)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'violation_type_id' => 'required|exists:violation_types,id', // DIPERBARUI
            'tanggal_pelanggaran' => 'required|date',
            'jam_pelanggaran' => 'nullable|date_format:H:i', // Validasi format 24 jam (HH:MM)
            'keterangan_kejadian' => 'nullable|string|max:255',
            'bukti_pelanggaran' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:2048',
            'remove_bukti_pelanggaran' => 'boolean',
        ]);

        DB::transaction(function () use ($request, $studentViolation) {
            $oldViolationType = $studentViolation->violationType;
            $newViolationType = ViolationType::find($request->violation_type_id);

            if (!$newViolationType) {
                // This will be caught by the transaction and rolled back.
                // Consider throwing a more specific exception or handling it before the transaction.
                return back()->withErrors(['violation_type_id' => 'Jenis Pelanggaran baru tidak ditemukan.'])->withInput(); // Added withInput() for better UX
            }

            $data = $request->except(['bukti_pelanggaran', 'remove_bukti_pelanggaran']);

            if ($request->hasFile('bukti_pelanggaran')) {
                if ($studentViolation->bukti_pelanggaran) {
                    Storage::disk('public')->delete($studentViolation->bukti_pelanggaran);
                }
                $path = $request->file('bukti_pelanggaran')->store('bukti_pelanggaran', 'public');
                $data['bukti_pelanggaran'] = $path;
            } elseif ($request->boolean('remove_bukti_pelanggaran')) {
                if ($studentViolation->bukti_pelanggaran) {
                    Storage::disk('public')->delete($studentViolation->bukti_pelanggaran);
                }
                $data['bukti_pelanggaran'] = null;
            }
            // No 'else' needed here: if neither of the above, $data won't have 'bukti_pelanggaran',
            // so the existing value in DB remains untouched by $studentViolation->update($data).

            $studentViolation->update($data);

            $student = Student::find($studentViolation->student_id);
            if ($student) {
                $student->total_poin_pelanggaran -= $oldViolationType->poin;
                $student->total_poin_pelanggaran += $newViolationType->poin;
                $student->save();
            }
        });

        return redirect()->route('student-violations.index') // DIPERBARUI NAMA RUTE
                         ->with('success', 'Pelanggaran Taruna berhasil diperbarui.');
    }

    public function destroy(StudentViolation $studentViolation)
    {
        DB::transaction(function () use ($studentViolation) {
            $violationType = $studentViolation->violationType;
            $student = $studentViolation->student;
            if ($student && $violationType) {
                $student->total_poin_pelanggaran -= $violationType->poin;
                $student->save();
            }

            if ($studentViolation->bukti_pelanggaran) {
                Storage::disk('public')->delete($studentViolation->bukti_pelanggaran);
            }

            $studentViolation->delete();
        });

        return back()->with('success', 'Pelanggaran Taruna berhasil dihapus.');
    }
}