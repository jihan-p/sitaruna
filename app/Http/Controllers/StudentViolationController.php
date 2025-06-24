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
        $studentViolations = StudentViolation::with(['student', 'violationType', 'reporter']) // Gunakan relasi 'reporter'
            ->when($search, function ($query, $search) { // Grupkan logika pencarian
                $query->where(function ($q) use ($search) {
                    $q->whereHas('student', fn($sq) => $sq->where('nama_lengkap', 'like', '%' . $search . '%'))
                      ->orWhereHas('violationType', fn($sq) => $sq->where('deskripsi', 'like', '%' . $search . '%'))
                      ->orWhereHas('reporter', fn($sq) => $sq->where('name', 'like', '%' . $search . '%')) // Tambahkan pencarian berdasarkan nama pelapor
                      ->orWhere('keterangan_kejadian', 'like', '%' . $search . '%');
                });
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
            'tanggal_pelanggaran' => 'required|date',
            'jam_pelanggaran' => 'nullable|date_format:H:i', // Validasi format 24 jam (HH:MM)
            'violations' => 'required|array|min:1',
            'violations.*.violation_type_id' => 'required|exists:violation_types,id',
            'violations.*.keterangan_kejadian' => 'nullable|string|max:1000', // Tingkatkan jika perlu
            'violations.*.bukti_pelanggaran' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:2048', // Validasi untuk setiap file
        ]);

        DB::transaction(function () use ($request) {
            $student = Student::findOrFail($request->input('student_id'));
            $totalPointsForSubmission = 0;

            foreach ($request->input('violations') as $index => $violationData) {
                $currentViolationType = ViolationType::find($violationData['violation_type_id']);
                
                $newViolation = new StudentViolation([
                    'student_id' => $student->id,
                    'violation_type_id' => $currentViolationType->id,
                    'tanggal_pelanggaran' => $request->input('tanggal_pelanggaran'),
                    'jam_pelanggaran' => $request->input('jam_pelanggaran'),
                    'keterangan_kejadian' => $violationData['keterangan_kejadian'] ?? null,
                    'bukti_pelanggaran' => null,
                ]);

                if ($request->hasFile("violations.{$index}.bukti_pelanggaran")) {
                    $file = $request->file("violations.{$index}.bukti_pelanggaran");
                    $path = $file->store('bukti_pelanggaran', 'public');
                    $newViolation->bukti_pelanggaran = $path;
                }

                // Kaitkan dengan pelapor (User yang sedang login) menggunakan relasi polimorfik
                $newViolation->reporter()->associate(Auth::user());
                $newViolation->save();

                $totalPointsForSubmission += $currentViolationType->poin;
            }

            $student->total_poin_pelanggaran += $totalPointsForSubmission;
            $student->save();
        });

        return redirect()->route('student-violations.index') // DIPERBARUI NAMA RUTE
                         ->with('success', 'Pelanggaran Taruna berhasil ditambahkan.');
    }

    public function show(StudentViolation $studentViolation)
    {
        $studentViolation->load(['student', 'violationType', 'reporter']); // Gunakan relasi 'reporter'
        return Inertia::render('StudentViolations/Show', [
            'studentViolation' => $studentViolation,
        ]);
    }

    public function edit(StudentViolation $studentViolation)
    {
        // Ambil semua pelanggaran yang merupakan bagian dari insiden yang sama
        // (taruna, tanggal, dan jam yang sama)
        $incidentViolations = StudentViolation::where('student_id', $studentViolation->student_id)
            ->where('tanggal_pelanggaran', $studentViolation->tanggal_pelanggaran->format('Y-m-d'))
            ->where('jam_pelanggaran', $studentViolation->jam_pelanggaran ? $studentViolation->jam_pelanggaran->format('H:i:s') : null)
            ->with(['violationType']) // Eager load untuk setiap item
            ->get();

        $students = Student::select('id', 'nama_lengkap', 'nit')->orderBy('nama_lengkap')->get();
        $violationTypes = ViolationType::where('aktif', true)->select('id', 'deskripsi', 'poin', 'kategori')->orderBy('deskripsi')->get();
        $studentViolation->load(['student', 'reporter']); // Muat relasi untuk data utama

        return Inertia::render('StudentViolations/Edit', [
            'studentViolation' => $studentViolation, // Data utama untuk form
            'incidentViolations' => $incidentViolations, // Daftar lengkap pelanggaran dalam insiden ini
            'students' => $students,
            'violationTypes' => $violationTypes,
        ]);
    }

    public function update(Request $request, StudentViolation $studentViolation)
    {
        // Validasi untuk menangani array pelanggaran
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'tanggal_pelanggaran' => 'required|date',
            'jam_pelanggaran' => 'nullable|date_format:H:i',
            'violations' => 'required|array|min:1',
            'violations.*.id' => 'nullable|exists:student_violations,id', // ID untuk item yang sudah ada
            'violations.*.violation_type_id' => 'required|exists:violation_types,id',
            'violations.*.keterangan_kejadian' => 'nullable|string|max:1000',
            'violations.*.bukti_pelanggaran' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:2048',
            'violations.*.remove_bukti_pelanggaran' => 'sometimes|boolean',
        ]);

        DB::transaction(function () use ($request, $studentViolation) {
            // 1. Dapatkan ID pelanggaran asli dari insiden ini
            $originalViolationIds = StudentViolation::where('student_id', $studentViolation->student_id)
                ->where('tanggal_pelanggaran', $studentViolation->tanggal_pelanggaran->format('Y-m-d'))
                ->where('jam_pelanggaran', $studentViolation->jam_pelanggaran ? $studentViolation->jam_pelanggaran->format('H:i:s') : null)
                ->pluck('id')->toArray();

            $incomingViolationIds = collect($request->input('violations'))->pluck('id')->filter()->toArray();

            // 2. Hapus pelanggaran yang tidak ada lagi di form
            $violationsToDeleteIds = array_diff($originalViolationIds, $incomingViolationIds);
            if (!empty($violationsToDeleteIds)) {
                $violationsToDelete = StudentViolation::whereIn('id', $violationsToDeleteIds)->get();
                foreach ($violationsToDelete as $v) {
                    if ($v->bukti_pelanggaran) {
                        Storage::disk('public')->delete($v->bukti_pelanggaran);
                    }
                    $v->delete();
                }
            }

            // 3. Perbarui atau buat entri pelanggaran
            foreach ($request->input('violations') as $index => $violationData) {
                $dataToUpsert = [
                    'student_id' => $request->input('student_id'),
                    'violation_type_id' => $violationData['violation_type_id'],
                    'tanggal_pelanggaran' => $request->input('tanggal_pelanggaran'),
                    'jam_pelanggaran' => $request->input('jam_pelanggaran'),
                    'keterangan_kejadian' => $violationData['keterangan_kejadian'] ?? null,
                ];

                $violationRecord = isset($violationData['id']) ? StudentViolation::find($violationData['id']) : new StudentViolation();

                // Penanganan file bukti
                $buktiPath = $violationRecord->bukti_pelanggaran;
                if ($request->hasFile("violations.{$index}.bukti_pelanggaran")) {
                    if ($violationRecord->bukti_pelanggaran) {
                        Storage::disk('public')->delete($violationRecord->bukti_pelanggaran);
                    }
                    $buktiPath = $request->file("violations.{$index}.bukti_pelanggaran")->store('bukti_pelanggaran', 'public');
                } elseif (isset($violationData['remove_bukti_pelanggaran']) && $violationData['remove_bukti_pelanggaran']) {
                    if ($violationRecord->bukti_pelanggaran) {
                        Storage::disk('public')->delete($violationRecord->bukti_pelanggaran);
                    }
                    $buktiPath = null;
                }
                $dataToUpsert['bukti_pelanggaran'] = $buktiPath;

                $violationRecord->fill($dataToUpsert);
                $violationRecord->reporter()->associate(Auth::user());
                $violationRecord->save();
            }

            // 4. Hitung ulang total poin pelanggaran untuk taruna yang bersangkutan
            $student = Student::findOrFail($request->input('student_id'));
            if ($student) {
                $allViolationsForStudent = StudentViolation::where('student_id', $student->id)->with('violationType')->get();
                $student->total_poin_pelanggaran = $allViolationsForStudent->sum(fn($v) => $v->violationType->poin ?? 0);
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