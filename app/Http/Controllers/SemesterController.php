<?php

namespace App\Http\Controllers;

use App\Models\Semester; // === Import Model Semester ===
use App\Models\AcademicYear; // === Import Model AcademicYear (untuk dropdown di form) ===
use Illuminate\Http\Request;
use Inertia\Inertia; // === Import Inertia ===
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Spatie\Permission\Models\Permission;


class SemesterController extends Controller implements HasMiddleware
{
    // === Tambahkan Middleware Permission di sini menggunakan static method middleware() ===
    public static function middleware()
    {
        return [
            new Middleware('permission:semesters index', only: ['index']),
            new Middleware('permission:semesters create', only: ['create', 'store']),
            new Middleware('permission:semesters edit', only: ['edit', 'update']),
            new Middleware('permission:semesters delete', only: ['destroy']),
        ];
    }

    /**
     * Display a listing of the resource.
     * Menampilkan daftar resource (Semester).
     */
    public function index(Request $request)
    {
        // Implementasi untuk mengambil data daftar Semester
        // Anda bisa menambahkan logika pencarian, filter, dan pagination di sini

        $query = Semester::query();

        // === Contoh Implementasi Pencarian Sederhana ===
        // Asumsi ada input 'search' dari frontend melalui request
        if ($request->has('search')) {
            $query->where('nama_semester', 'like', '%' . $request->search . '%')
                  // Anda bisa tambahkan pencarian berdasarkan relasi AcademicYear jika perlu
                  // ->orWhereHas('academicYear', function ($q) use ($request) {
                  //     $q->where('nama_tahun_ajaran', 'like', '%' . $request->search . '%');
                  // })
                  ;
        }
        // ==============================================


        // === Implementasi Pagination ===
        // Ambil jumlah item per halaman dari request, default ke 10
        $perPage = $request->input('perPage', 10);

        // Ambil data Semester dengan pagination
        // Eager load relasi AcademicYear jika Anda ingin menampilkan nama tahun ajaran di tabel index
        // Urutkan berdasarkan tahun ajaran dan nama semester (misal: Genap setelah Ganjil)
        $semesters = $query->with('academicYear') // Eager load relasi academicYear
                           ->orderBy('tahun_ajaran_id', 'desc') // Urutkan berdasarkan tahun ajaran terbaru
                           ->orderBy('nama_semester', 'desc') // Urutkan berdasarkan nama semester (misal: Genap, Ganjil)
                           ->paginate($perPage);
        // ===============================

        // Render halaman Index Semesters menggunakan Inertia
        return Inertia::render('Semesters/Index', [
            'semesters' => $semesters, // Kirim data Semester ke komponen React
            'filters' => $request->only(['search']), // Kirim filter yang aktif kembali ke frontend
            'perPage' => (int) $perPage, // Kirim kembali nilai perPage yang aktif
        ]);
    }

    /**
     * Show the form for creating a new resource.
     * Menampilkan form untuk membuat resource baru (Semester).
     */
    public function create()
    {
        // Implementasi untuk menampilkan form tambah Semester
        // Perlu mengirim daftar Tahun Ajaran untuk dropdown di form

        // Ambil daftar Tahun Ajaran untuk dropdown (misal: hanya ID dan nama)
        $academicYears = AcademicYear::orderBy('tahun_mulai', 'desc')
                                     ->get(['id', 'nama_tahun_ajaran']);

        // Render halaman Create Semesters menggunakan Inertia
        return Inertia::render('Semesters/Create', [
            'academicYears' => $academicYears, // Kirim daftar Tahun Ajaran ke frontend
        ]);
    }

    /**
     * Store a newly created resource in storage.
     * Menyimpan resource yang baru dibuat ke database.
     */
    public function store(Request $request)
    {
        // Implementasi untuk validasi dan penyimpanan data Semester baru

        // === Validasi Input ===
        $request->validate([
            'nama_semester' => ['required', 'string', 'max:255'], // Contoh: 'Ganjil', 'Genap'
            'tahun_ajaran_id' => ['required', 'integer', 'exists:academic_years,id'], // Harus ada di tabel academic_years
            'is_active' => ['required', 'boolean'], // Harus boolean
            // Tambahkan validasi lain jika ada kolom lain
            // Opsional: Validasi unik kombinasi nama_semester dan tahun_ajaran_id
            // 'nama_semester' => ['required', 'string', 'max:255', Rule::unique('semesters')->where(fn ($query) => $query->where('tahun_ajaran_id', $request->tahun_ajaran_id))],
        ]);
        // ======================


        // === Buat dan Simpan Data Baru ===
        Semester::create($request->all()); // Gunakan mass assignment (pastikan $fillable di Model sudah benar)
        // ===============================


        // Redirect ke halaman index setelah berhasil menyimpan
        return redirect()->route('semesters.index')
                         ->with('success', 'Data Semester berhasil ditambahkan.'); // Opsional: Kirim flash message
    }

    /**
     * Display the specified resource.
     * Menampilkan resource spesifik (Semester).
     *
     * @param  \App\Models\Semester  $semester
     * @return \Illuminate\Http\Response
     */
    public function show(Semester $semester)
    {
        // Implementasi untuk menampilkan detail Semester spesifik (jika ada halaman show)
        // Mungkin tidak diperlukan untuk modul sederhana ini, bisa dilewati.

        // Contoh jika Anda ingin membuat halaman Show:
        // $semester->load('academicYear'); // Eager load relasi jika perlu
        // return Inertia::render('Semesters/Show', [
        //     'semester' => $semester, // Kirim objek Semester ke komponen React
        // ]);

        // Jika tidak ada halaman Show, method ini bisa dihapus atau dibiarkan kosong.
    }

    /**
     * Show the form for editing the specified resource.
     * Menampilkan form untuk mengedit resource spesifik (Semester).
     *
     * @param  \App\Models\Semester  $semester
     * @return \Illuminate\Http\Response
     */
    public function edit(Semester $semester)
    {
        // Implementasi untuk menampilkan form edit Semester
        // Ambil data Semester yang akan diedit dan kirim ke frontend
        // Perlu juga mengirim daftar Tahun Ajaran untuk dropdown

        // Eager load relasi AcademicYear jika perlu ditampilkan di form edit
        // $semester->load('academicYear');

        // Ambil daftar Tahun Ajaran untuk dropdown
        $academicYears = AcademicYear::orderBy('tahun_mulai', 'desc')
                                     ->get(['id', 'nama_tahun_ajaran']);

        // Render halaman Edit Semesters menggunakan Inertia
        return Inertia::render('Semesters/Edit', [
            'semester' => $semester, // Kirim objek Semester ke komponen React
            'academicYears' => $academicYears, // Kirim daftar Tahun Ajaran ke frontend
        ]);
    }

    /**
     * Update the specified resource in storage.
     * Memperbarui resource spesifik di database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Semester  $semester
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Semester $semester)
    {
        // Implementasi untuk validasi dan pembaruan data Semester

        // === Validasi Input ===
        $request->validate([
            'nama_semester' => ['required', 'string', 'max:255'],
            'tahun_ajaran_id' => ['required', 'integer', 'exists:academic_years,id'],
            'is_active' => ['required', 'boolean'],
            // Tambahkan validasi lain jika ada kolom lain
            // Opsional: Validasi unik kombinasi nama_semester dan tahun_ajaran_id, abaikan record saat ini
            // 'nama_semester' => ['required', 'string', 'max:255', Rule::unique('semesters')->where(fn ($query) => $query->where('tahun_ajaran_id', $request->tahun_ajaran_id))->ignore($semester->id)],
        ]);
        // ======================


        // === Update Data ===
        $semester->update($request->all()); // Gunakan mass assignment
        // ===================


        // Redirect ke halaman index setelah berhasil mengupdate
         return redirect()->route('semesters.index')
                          ->with('success', 'Data Semester berhasil diperbarui.'); // Opsional: Kirim flash message
    }

    /**
     * Remove the specified resource from storage.
     * Menghapus resource spesifik dari database.
     *
     * @param  \App\Models\Semester  $semester
     * @return \Illuminate\Http\Response
     */
    public function destroy(Semester $semester)
    {
        // Implementasi untuk penghapusan data Semester

        // === Hapus Data ===
        $semester->delete();
        // ==================

        // Redirect kembali ke halaman index setelah berhasil menghapus
        return redirect()->route('semesters.index')
                         ->with('success', 'Data Semester berhasil dihapus.'); // Opsional: Kirim flash message
    }
}