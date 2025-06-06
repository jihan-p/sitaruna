<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Hash; // Import Hash facade untuk hashing password

class UserController extends Controller implements HasMiddleware
{

    public static function middleware()
    {
        return [
            new Middleware('permission:users index', only : ['index']),
            new Middleware('permission:users create', only : ['create', 'store']),
            new Middleware('permission:users edit', only : ['edit', 'update']), // Pastikan 'update' ada di sini
            new Middleware('permission:users delete', only : ['destroy']),
        ];
    }
    
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // get all users
        $users = User::with('roles')
            ->when(request('search'), fn($query) => $query->where('name', 'like', '%'.request('search').'%'))
            ->latest()
            ->paginate(6);

        // render view
        return inertia('Users/Index', ['users' => $users,'filters' => $request->only(['search'])]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
         // get roles
         $roles = Role::latest()->get();
         // render view
         return inertia('Users/Create', ['roles' => $roles]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
         // validate request
         $request->validate([
            'name' => 'required|min:3|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|confirmed|min:4',
            'selectedRoles' => 'required|array|min:1',
        ]);

        // create user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), // Gunakan Hash::make() untuk password
        ]);

        // attach roles
        $user->assignRole($request->selectedRoles);

        // render view
        return to_route('users.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        // Tambahkan pengecekan di sini
        if ($user->hasRole('admin') || $user->hasRole('super-admin')) { // Sesuaikan dengan nama peran super-admin Anda
            return redirect()->route('users.index')->with('error', 'Pengguna dengan peran default sistem tidak dapat diedit.');
        }

        // get roles
        $roles = Role::where('name', '!=', 'super-admin')->get();

        // load roles
        $user->load('roles');

        // render view
        return inertia('Users/Edit', ['user' => $user, 'roles' => $roles]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        // Tambahkan pengecekan di sini
        if ($user->hasRole('admin') || $user->hasRole('super-admin')) { // Sesuaikan dengan nama peran super-admin Anda
            return redirect()->route('users.index')->with('error', 'Pengguna dengan peran default sistem tidak dapat diperbarui.');
        }

        // Definisikan aturan validasi dasar
        $rules = [
            'name' => 'required|min:3|max:255',
            'email' => 'required|email|unique:users,email,'.$user->id,
            'selectedRoles' => 'nullable|array|min:1', // Ubah menjadi nullable karena mungkin ada kasus tanpa peran
            'selectedRoles.*' => 'exists:roles,name', // Validasi setiap nama peran di array
        ];

        // Tambahkan aturan validasi password hanya jika password diisi di form
        if ($request->filled('password')) {
            $rules['password'] = 'required|string|min:8|confirmed'; // 'confirmed' akan memeriksa password_confirmation
        }

        // Jalankan validasi
        $request->validate($rules);

        // Perbarui data pengguna yang tidak terkait password
        $user->name = $request->name;
        $user->email = $request->email;

        // Perbarui password hanya jika password diisi di form
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password); // Hash password baru
        }

        // Simpan perubahan pada pengguna
        $user->save();

        // Sinkronkan peran pengguna
        $user->syncRoles($request->selectedRoles);

        // Redirect kembali ke halaman index dengan pesan sukses
        return to_route('users.index')->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        // Tambahkan pengecekan di sini
        if ($user->hasRole('admin') || $user->hasRole('super-admin')) { // Sesuaikan dengan nama peran super-admin Anda
            return back()->with('error', 'Pengguna dengan peran default sistem tidak dapat dihapus.');
        }

        // delete user data
        $user->delete();

        // render view
        return back();
    }
}
