// resources/js/utils/Permissions.jsx

// Hapus import usePage karena fungsi ini tidak lagi memanggil Hook
// import { usePage } from "@inertiajs/react";

// Fungsi ini sekarang menerima dua argumen:
// 1. allPermissions: Objek yang berisi semua izin pengguna (misalnya, { 'roles index': true, ... })
// 2. permissionsToCheck: Array string izin yang ingin diperiksa (misalnya, ['roles index', 'users create'])
export default function hasAnyPermission(allPermissions, permissionsToCheck){
    // Pastikan allPermissions adalah objek dan permissionsToCheck adalah array
    if (!allPermissions || typeof allPermissions !== 'object' || !Array.isArray(permissionsToCheck)) {
        return false;
    }

    let hasPermission = false;

    // Iterasi melalui izin yang ingin diperiksa
    for (const item of permissionsToCheck) {
        // Jika izin ditemukan di allPermissions, set hasPermission menjadi true dan keluar dari loop
        if (allPermissions[item]) {
            hasPermission = true;
            break; // Keluar dari loop setelah menemukan satu izin yang cocok
        }
    }

    return hasPermission;
}
