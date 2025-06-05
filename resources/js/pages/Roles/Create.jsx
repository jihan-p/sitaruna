// resources/js/Pages/Roles/Create.jsx (Setelah penerapan FormGroup dan perbaikan impor Input)

import React from "react";
// Import komponen Atomic Design dari lokasi baru
import AuthenticatedLayout from "@/templates/AuthenticatedLayout"; // Import template
import Container from '@/components/atoms/Container'; // Import atom Container (Perbaikan dari error sebelumnya)
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


export default function Create({ auth }) {
    // destruct permissions from usepage props
    const { permissions } = usePage().props; // Permissions dikirim terkelompok

    // define state with helper inertia
    const { data, setData, post, errors, processing } = useForm({
        name: "",
        selectedPermissions: [], // Array nama izin yang dipilih
    });

    // define method handleSelectedPermissions
    const handleSelectedPermissions = (e) => {
        const permissionName = e.target.value;
        const items = [...data.selectedPermissions]; // Buat salinan array

        if (items.includes(permissionName)) {
            // Hapus jika sudah ada (untuk toggle)
            items.splice(items.indexOf(permissionName), 1);
        } else {
            // Tambahkan jika belum ada
            items.push(permissionName);
        }

        setData("selectedPermissions", items);
    };

    // define method handleStoreData
    const handleStoreData = async (e) => {
        e.preventDefault();

        post(route("roles.store"), {
            onSuccess: () => {
                Swal.fire({
                    title: "Success!",
                    text: "Data created successfully!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                });
            },
            onError: (errors) => {
                 console.error('Validation Errors:', errors);
                 // Handle errors - FormGroup akan menampilkan error untuk field yang sesuai
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Create Role
                </h2>
            }
        >
            <Head title={"Create Roles"} />
            <Container> {/* Menggunakan atom Container */}
                <Card title={"Create new role"}> {/* Menggunakan organisme Card */}
                    <form onSubmit={handleStoreData}>
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
                                                     checked={data.selectedPermissions.includes(permission)} // Status checked
                                                     key={permission}
                                                 />
                                             ))}
                                         </div>
                                     </div>
                                 ))}
                             </FormGroup>
                         </div>


                    <div className="flex items-center justify-end gap-2">
                        <CancelButton url={route("roles.index")}> Go Back </CancelButton> {/* Atau "Kembali" */}
                        <PrimaryButton type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </PrimaryButton>
                        </div>
                    </form>
                </Card>
            </Container>
        </AuthenticatedLayout>
    );
}
