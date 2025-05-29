// resources/js/Pages/Roles/Edit.jsx (Setelah penerapan FormGroup dan perbaikan impor Input)

import React from "react";
// Import komponen Atomic Design dari lokasi baru
import AuthenticatedLayout from "@/templates/AuthenticatedLayout"; // Import template (Langkah 10)
import Container from "@/components/atoms/Container"; // Import atom Container
import { Head, useForm, usePage } from "@inertiajs/react";
// import Input from "@/components/atoms/Input"; // <-- HAPUS IMPOR INI - Input.jsx sudah tidak digunakan
import TextInput from "@/components/atoms/TextInput"; // <-- PASTIKAN IMPOR INI ADA (Langkah 2)
import Checkbox from "@/components/atoms/Checkbox"; // Import atom Checkbox
import PrimaryButton from "@/components/molecules/PrimaryButton"; // Import molekul PrimaryButton (Langkah 1)
import CancelButton from "@/components/molecules/CancelButton"; // Import molekul CancelButton (Langkah 1)
import Card from "@/components/organisms/Card"; // Import organisme Card (Langkah 7)
import FormGroup from "@/components/molecules/FormGroup"; // Import molekul FormGroup (Langkah 3)
// Select2 tidak digunakan di sini di form asli Roles Create/Edit untuk permissions

import Swal from "sweetalert2";
// Utilitas tetap di Utils
import hasAnyPermission from '@/utils/Permissions'; // <-- PASTIKAN PATH INI BENAR (huruf kecil)


export default function Edit({ auth }) {
    // destruct permissions and role from usepage props
    const { permissions, role } = usePage().props; // Permissions dikirim terkelompok, role adalah data peran yang diedit

    // define state with helper inertia
    const { data, setData, post, errors, processing } = useForm({
        name: role.name, // Nilai awal nama peran
        selectedPermissions: role.permissions.map(
            (permission) => permission.name // Nilai awal izin yang sudah dimiliki (array of strings)
        ),
        _method: "put", // Untuk method PUT saat submit
    });

    // define method handleSelectedPermissions saat checkbox izin berubah
    const handleSelectedPermissions = (e) => {
        const permissionName = e.target.value;
        const items = [...data.selectedPermissions]; // Buat salinan array state

        if (items.includes(permissionName)) {
            // Jika izin sudah ada di state, hapus (toggle off)
            items.splice(items.indexOf(permissionName), 1);
        } else {
            // Jika izin belum ada di state, tambahkan (toggle on)
            items.push(permissionName);
        }

        setData("selectedPermissions", items); // Update state form dengan array izin yang baru
    };

    // define method handleUpdatedata
    const handleUpdatedata = async (e) => {
        e.preventDefault();

        // Gunakan method post Inertia dengan _method: 'put' untuk update
        post(route("roles.update", role.id), { // Submit ke route update dengan ID peran
             // Menggunakan _method: 'put' dalam useForm akan membuat permintaan PUT
            onSuccess: () => {
                Swal.fire({
                    title: "Success!",
                    text: "Data updated successfully!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                });
            },
            onError: (errors) => {
                 console.error('Validation Errors:', errors);
                 // Handle errors - Inertia akan mengisi errors state, FormGroup akan menampilkannya
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Role
                </h2>
            }
        >
            <Head title={"Edit Roles"} />
            <Container> {/* Menggunakan atom Container */}
                <Card title={"Edit role"}> {/* Menggunakan organisme Card */}
                    <form onSubmit={handleUpdatedata}>
                        {/* Gunakan FormGroup untuk input Nama Role */}
                        <div className="mb-4"> {/* Tambahkan margin bawah */}
                            <FormGroup label={"Role Name"} error={errors.name}>
                                {/* Gunakan TextInput sebagai children dari FormGroup */}
                                <TextInput // <-- Gunakan TextInput BUKAN Input
                                    id="name" // Tambahkan ID
                                    name="name" // Tambahkan name
                                    type={"text"}
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    placeholder="Input role name.."
                                    // props lain
                                />
                            </FormGroup>
                        </div>

                        {/* Bagian pemilihan Permissions */}
                         <div className="mb-4"> {/* Tambahkan margin bawah */}
                             {/* FormGroup membungkus seluruh blok pemilihan izin */}
                             <FormGroup label={"Permissions"} error={errors.selectedPermissions}> {/* Passing error untuk field selectedPermissions */}
                                 {/* Iterate through grouped permissions */}
                                 {/* permissions adalah objek dengan group sebagai key dan array perms sebagai value */}
                                 {Object.entries(permissions).map(([group, perms]) => (
                                     <div key={group} className="mb-4 border p-3 rounded-md"> {/* Styling grup izin */}
                                         <h3 className="text-sm font-semibold mb-2 capitalize">{group}</h3> {/* Judul grup */}
                                         <div className="flex flex-wrap gap-3"> {/* Container checkbox */}
                                             {perms.map(permission => (
                                                 // Menggunakan atom Checkbox
                                                 <Checkbox
                                                     label={permission} // Teks label checkbox
                                                     value={permission} // Nilai checkbox
                                                     onChange={handleSelectedPermissions} // Handler saat checkbox diubah
                                                     checked={data.selectedPermissions.includes(permission)} // Status checked (berdasarkan data state selectedPermissions)
                                                     key={permission} // Key unik
                                                 />
                                             ))}
                                         </div>
                                     </div>
                                 ))}
                             </FormGroup>
                         </div>


                    <div className="flex items-center justify-end gap-2">
                        <CancelButton url={route("roles.index")}> Go Back </CancelButton> {/* Atau "Kembali" */}
                        <PrimaryButton type={"submit"} disabled={processing}> Perbarui </PrimaryButton>
                        </div>
                    </form>
                </Card>
            </Container>
        </AuthenticatedLayout>
    );
}
