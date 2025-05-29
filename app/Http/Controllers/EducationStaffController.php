<?php

namespace App\Http\Controllers;

use App\Models\EducationStaff;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class EducationStaffController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:education-staff index', only: ['index']),
            new Middleware('permission:education-staff create', only: ['create', 'store']),
            new Middleware('permission:education-staff edit', only: ['edit', 'update']),
            new Middleware('permission:education-staff delete', only: ['destroy']),
            new Middleware('permission:education-staff show', only: ['show']),
        ];
    }

    public function index(Request $request)
    {
        $search = $request->input('search');
        $educationStaff = EducationStaff::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', '%' . $search . '%')
                      ->orWhere('nip', 'like', '%' . $search . '%')
                      ->orWhere('position', 'like', '%' . $search . '%');
            })
            ->latest()
            ->paginate(10) // Default pagination, bisa disesuaikan
            ->withQueryString(); // Tambahkan ini untuk mempertahankan filter saat paginasi

        return Inertia::render('EducationStaffs/Index', [
            'educationStaff' => $educationStaff,
            'filters' => ['search' => $search],
            'can' => [
                'create' => $request->user()->can('education-staff create'),
                'edit' => $request->user()->can('education-staff edit'),
                'delete' => $request->user()->can('education-staff delete'),
                'show' => $request->user()->can('education-staff show'),
            ],
        ]);
    }

    public function create()
    {
        $roles = Role::all();
        return Inertia::render('EducationStaffs/Create', [
            'roles' => $roles,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nip' => 'nullable|string|max:255|unique:education_staff,nip',
            'name' => 'required|string|max:255',
            'gender' => 'nullable|in:' . implode(',', EducationStaff::ALL_GENDERS),
            'place_of_birth' => 'nullable|string|max:255',
            'date_of_birth' => 'nullable|date',
            'address' => 'nullable|string',
            'phone_number' => 'nullable|string|max:50',
            'email' => 'required|string|email|max:255|unique:education_staff,email',
            'position' => 'nullable|string|max:255',
            'hire_date' => 'nullable|date',
            'last_education' => 'nullable|string|max:255',
            'major_education' => 'nullable|string|max:255',
            'foto_profil' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'create_user_account' => 'boolean',
            'password' => 'nullable|string|min:8|required_if:create_user_account,true',
            'role_id' => ['nullable', 'exists:roles,id', Rule::requiredIf($request->create_user_account)],
        ]);

        $fotoProfilPath = null;
        if ($request->hasFile('foto_profil')) {
            $fotoProfilPath = $request->file('foto_profil')->store('education_staff_photos', 'public');
        }

        $userId = null;
        if (isset($validated['create_user_account']) && $validated['create_user_account']) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);
            $user->assignRole($validated['role_id']);
            $userId = $user->id;
        }

        EducationStaff::create(array_merge($validated, [
            'user_id' => $userId,
            'foto_profil' => $fotoProfilPath,
        ]));

        return redirect()->route('education-staff.index') // Nama rute diubah ke kebab-case
                         ->with('success', 'Data PTK berhasil ditambahkan.');
    }

    public function show(EducationStaff $educationStaff)
    {
        return Inertia::render('EducationStaffs/Show', [
            'educationStaff' => $educationStaff->load('user'),
        ]);
    }

    public function edit(EducationStaff $educationStaff)
    {
        $roles = Role::all();
        return Inertia::render('EducationStaffs/Edit', [
            'educationStaff' => $educationStaff->load('user'),
            'roles' => $roles,
        ]);
    }

    public function update(Request $request, EducationStaff $educationStaff)
    {
        $validated = $request->validate([
            'nip' => ['nullable', 'string', 'max:255', Rule::unique('education_staff')->ignore($educationStaff->id)],
            'name' => 'required|string|max:255',
            'gender' => 'nullable|in:' . implode(',', EducationStaff::ALL_GENDERS),
            'place_of_birth' => 'nullable|string|max:255',
            'date_of_birth' => 'nullable|date',
            'address' => 'nullable|string',
            'phone_number' => 'nullable|string|max:50',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('education_staff')->ignore($educationStaff->id)],
            'position' => 'nullable|string|max:255',
            'hire_date' => 'nullable|date',
            'last_education' => 'nullable|string|max:255',
            'major_education' => 'nullable|string|max:255',
            'foto_profil' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('foto_profil')) {
            if ($educationStaff->foto_profil) {
                Storage::disk('public')->delete($educationStaff->foto_profil);
            }
            $validated['foto_profil'] = $request->file('foto_profil')->store('education_staff_photos', 'public');
        } else if ($request->missing('foto_profil_removed')) {
            unset($validated['foto_profil']);
        } else {
            if ($educationStaff->foto_profil) {
                Storage::disk('public')->delete($educationStaff->foto_profil);
            }
            $validated['foto_profil'] = null;
        }

        $educationStaff->update($validated);

        if ($educationStaff->user) {
            $educationStaff->user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
            ]);
        }

        return redirect()->route('education-staff.index') // Nama rute diubah ke kebab-case
                         ->with('success', 'Data PTK berhasil diperbarui.');
    }

    public function destroy(EducationStaff $educationStaff)
    {
        if ($educationStaff->foto_profil) {
            Storage::disk('public')->delete($educationStaff->foto_profil);
        }

        if ($educationStaff->user) {
            $educationStaff->user->delete();
        }
        $educationStaff->delete();

        return back()->with('success', 'Data PTK berhasil dihapus!');
    }
}