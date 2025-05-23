<?php

namespace App\Http\Controllers;

use App\Models\Student; // Import Model Student
use Illuminate\Http\Request;
use Illuminate\Validation\Rule; // Untuk validasi unique saat update
use Illuminate\Support\Facades\Storage; // Untuk upload file
use Illuminate\Support\Str; // Jika perlu string helper

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class StudentController extends Controller implements HasMiddleware
{
     // Definisikan middleware permission untuk setiap aksi (sesuaikan dengan nama permission Anda)
     public static function middleware()
    {
        return [
            new Middleware('permission:students index', only: ['index']),
            new Middleware('permission:students create', only: ['create', 'store']),
            new Middleware('permission:students edit', only: ['edit', 'update']),
            new Middleware('permission:students delete', only: ['destroy']),
            new Middleware('permission:students show', only: ['show']), // Memerlukan permission 'students show'
        ];
    }

    /**
     * Menampilkan daftar resource (Peserta Didik).
     */
    public function index(Request $request)
    {
        // Ambil data siswa dengan paginasi dan fitur pencarian
        $students = Student::select(
                'id', // Pilih kolom ID baru
                'nisn',
                'nit',
                'nama_lengkap',
                'jenis_kelamin',
                'status_akun'
                // Pilih kolom lain yang ingin ditampilkan di tabel index
            )
            ->when($request->search, function ($query, $search) {
                // Logika pencarian berdasarkan kolom tertentu
                $query->where('nama_lengkap', 'like', '%'.$search.'%')
                      ->orWhere('nisn', 'like', '%'.$search.'%')
                      ->orWhere('nit', 'like', '%'.$search.'%');
                // Tambahkan orWhere() untuk kolom lain yang searchable
            })
            ->latest() // Urutkan berdasarkan data terbaru
            ->paginate(10) // 10 item per halaman
            ->withQueryString(); // Pertahankan parameter search/filter di link paginasi

        // Render halaman Inertia 'Students/Index' dan kirim data siswa
        return inertia('Students/Index', [
            'students' => $students,
            'filters' => $request->only(['search']), // Kirim kembali filter untuk mempertahankan nilai search di input
        ]);
    }

    /**
     * Menampilkan form untuk membuat resource baru.
     */
    public function create()
    {
        // Anda bisa passing data untuk dropdown (misal: daftar agama, daftar status) ke view di sini
        // $religions = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'];
        // $statuses = ['Aktif', 'Nonaktif', 'Lulus', 'Keluar', 'Mutasi'];
        // return inertia('Students/Create', compact('religions', 'statuses'));

        return inertia('Students/Create');
    }

    /**
     * Menyimpan resource yang baru dibuat ke storage.
     */
    public function store(Request $request)
    {
        // Validasi data yang masuk dari form
        $validatedData = $request->validate([
            'nisn' => 'required|string|max:255|unique:students,nisn', // NISN wajib, string, max 255, unik di tabel students
            'nit' => 'nullable|string|max:255|unique:students,nit', // NIT bisa kosong, string, max 255, unik
            'nama_lengkap' => 'required|string|max:255', // Nama Lengkap wajib, string, max 255
            'jenis_kelamin' => ['nullable', 'string', Rule::in(['L', 'P'])], // Jenis Kelamin bisa kosong, validasi nilai
            'tempat_lahir' => 'nullable|string|max:255',
            'tanggal_lahir' => 'nullable|date', // Tanggal Lahir bisa kosong, format tanggal
            'agama' => 'nullable|string|max:50',
            'no_hp' => 'nullable|string|max:50',
            'email' => 'nullable|string|email|max:255|unique:students,email', // Email bisa kosong, format email, unik
            'alamat' => 'nullable|string', // Alamat bisa kosong, string (untuk TEXT di DB)
            'status_akun' => ['nullable', 'string', Rule::in(['Aktif', 'Nonaktif', 'Lulus', 'Mutasi', 'Keluar'])], // Status bisa kosong, validasi nilai
            'foto_profil' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Foto Profil bisa kosong, format gambar, max 2MB
        ]);

        // Handle upload file foto_profil
        if ($request->hasFile('foto_profil')) {
            $file = $request->file('foto_profil');
            $fileName = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            // Simpan di disk 'public', di dalam folder 'student_photos'
            $filePath = $file->storeAs('student_photos', $fileName, 'public');
            $validatedData['foto_profil'] = $filePath; // Simpan path file di database
        }

        // Buat record siswa baru di database
        Student::create($validatedData);

        // Redirect ke halaman index students dengan pesan sukses
        return to_route('students.index')->with('success', 'Data Peserta Didik berhasil ditambahkan!');
    }

    /**
     * Menampilkan form untuk mengedit resource tertentu.
     */
    public function edit(Student $student) // Menggunakan Route Model Binding untuk otomatis mencari siswa berdasarkan ID di URL
    {
        // Anda bisa passing data untuk dropdown di sini jika perlu, sama seperti create
        // $religions = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'];
        // $statuses = ['Aktif', 'Nonaktif', 'Lulus', 'Keluar', 'Mutasi'];
        // return inertia('Students/Edit', compact('student', 'religions', 'statuses'));

        // Render halaman Inertia 'Students/Edit' dan kirim data siswa yang akan diedit
        return inertia('Students/Edit', [
            'student' => $student,
        ]);
    }

    /**
     * Memperbarui resource tertentu di storage.
     */
    public function update(Request $request, Student $student) // Route Model Binding
    {
        // Validate the request data
        $validatedData = $request->validate([
            'nisn' => ['required', 'string', 'max:255', Rule::unique('students', 'nisn')->ignore($student->id)],
            'nit' => ['nullable', 'string', 'max:255', Rule::unique('students', 'nit')->ignore($student->id)],
            'nama_lengkap' => 'required|string|max:255',
            'jenis_kelamin' => ['nullable', 'string', Rule::in(['L', 'P'])],
            'tempat_lahir' => 'nullable|string|max:255',
            'tanggal_lahir' => 'nullable|date',
            'agama' => 'nullable|string|max:50',
            'no_hp' => 'nullable|string|max:50',
            'email' => ['nullable', 'string', 'email', 'max:255', Rule::unique('students', 'email')->ignore($student->id)],
            'alamat' => 'nullable|string',
            'status_akun' => ['required', 'string', Rule::in(['Aktif', 'Nonaktif', 'Lulus', 'Mutasi', 'Keluar'])],
            // Foto Profil: Aturan validasi sama, nullable image
            'foto_profil' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle foto_profil upload
        if ($request->hasFile('foto_profil')) {
            // KASUS 1: Ada file baru yang diupload.
            // Hapus foto lama jika ada
            if ($student->foto_profil) {
                Storage::disk('public')->delete($student->foto_profil);
            }
            // Simpan file baru
            $file = $request->file('foto_profil');
            $fileName = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            $filePath = $file->storeAs('student_photos', $fileName, 'public');
            $validatedData['foto_profil'] = $filePath; // Update path foto_profil di $validatedData

        } else {
            // KASUS 2: TIDAK ada file baru yang diupload dari form.
            // Jika tidak ada file baru, nilai 'foto_profil' dari front-end (via useForm) biasanya 'null'.
            // Validator akan memasukkan 'foto_profil' => null ke dalam $validatedData.
            // Jika kita membiarkan ini, update() akan SET kolom DB menjadi NULL.

            // === PERBAIKAN DI SINI ===
            // Untuk MEMPERTAHANKAN foto lama saat TIDAK upload foto baru:
            // Hapus key 'foto_profil' dari array $validatedData.
            // Dengan begitu, Eloquent akan MENGABAIKAN kolom ini saat update dan MEMPERTAHANKAN nilai lamanya di database.
            if (array_key_exists('foto_profil', $validatedData)) {
                 // Hapus hanya jika 'foto_profil' ada di $validatedData (harusnya ada jika form mengirim null/kosong)
                 // Ini mencegah Eloquent mengubahnya menjadi NULL.
                 unset($validatedData['foto_profil']);
            }

            // Catatan: Jika Anda ingin fitur untuk MENGHAPUS foto tanpa mengupload yang baru (misal dengan checkbox),
            // Anda perlu menambahkan input checkbox di front-end, lalu di sini tambahkan logika:
            // else if ($request->has('clear_photo')) { $validatedData['foto_profil'] = null; // Set DB ke null }
            // Untuk saat ini, perbaikan ini hanya memastikan foto TIDAK hilang jika tidak ada file baru yang diupload.
        }

        // Update record siswa di database dengan data yang sudah divalidasi (dan mungkin sudah diubah 'foto_profil' atau dihapus dari array).
        $student->update($validatedData);

        // Redirect ke halaman index students dengan pesan sukses
        return to_route('students.index')->with('success', 'Data Peserta Didik berhasil diperbarui!');
    }

    /**
     * Menghapus resource tertentu dari storage.
     */
    public function destroy(Student $student) // Route Model Binding
    {
         // Hapus file foto jika ada
         if ($student->foto_profil) {
             Storage::disk('public')->delete($student->foto_profil);
         }

        // Hapus record siswa dari database (ini juga akan menghapus record terkait di 'enrollments' jika menggunakan cascadeOnDelete)
        $student->delete();

        // Redirect kembali ke halaman sebelumnya (index students) dengan pesan sukses
        return back()->with('success', 'Data Peserta Didik berhasil dihapus!');
    }

    /**
     * Menampilkan resource tertentu (Detail Peserta Didik).
     */
    public function show(Student $student) // Menggunakan Route Model Binding
    {
        // Di sini Anda bisa memuat (load) relasi jika ada data terkait yang ingin ditampilkan di halaman detail
        // Contoh: Memuat data enrollment siswa beserta kelas, tahun ajaran, semester, dan guru
        // $student->load('enrollments.class.major', 'enrollments.academicYear', 'enrollments.semester', 'enrollments.teacher');

        // Render halaman Inertia 'Students/Show' dan kirim data siswa
        return inertia('Students/Show', [
            'student' => $student,
            // Jika Anda memuat relasi di atas, kirim juga relasinya:
            // 'student' => $student->load('enrollments'), // Contoh memuat relasi enrollments
        ]);
    }
}