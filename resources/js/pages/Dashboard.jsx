import React from 'react';
import AuthenticatedLayout from '@/templates/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import {
    // ... (impor ikon lainnya jika masih ada yang digunakan langsung di sini)
    IconUsers,
    IconSchool,
    IconBuildingSkyscraper,
    IconListDetails,
    IconUserShield,
    IconShieldLock,
    IconAlertTriangle,
    IconShieldExclamation,
    IconAward,
    IconTrophy,
} from '@tabler/icons-react'; // Pastikan ikon-ikon ini masih relevan jika StatCard dipindah
import StatCard from '@/components/molecules/DashboardCards/StatCard'; // Impor StatCard
import Container from '@/components/atoms/Container'; // Impor Container

export default function Dashboard() {
    const { auth, stats } = usePage().props;

    const dashboardCards = [
        {
            title: 'Total Taruna',
            value: stats?.totalStudents,
            icon: IconUsers,
            color: 'bg-indigo-500',
            permission: 'students index', // Contoh permission, sesuaikan
        },
        {
            title: 'Total PTK',
            value: stats?.totalEducationStaff,
            icon: IconSchool,
            color: 'bg-blue-500',
            permission: 'education-staff index',
        },
        {
            title: 'Total Jurusan',
            value: stats?.totalMajors,
            icon: IconBuildingSkyscraper,
            color: 'bg-green-500',
            permission: 'majors index',
        },
        {
            title: 'Total Kelas',
            value: stats?.totalClasses,
            icon: IconListDetails,
            color: 'bg-yellow-500',
            permission: 'classes index',
        },
        {
            title: 'Total Pengguna',
            value: stats?.totalUsers,
            icon: IconUserShield,
            color: 'bg-purple-500',
            permission: 'users index',
        },
        {
            title: 'Total Peran',
            value: stats?.totalRoles,
            icon: IconShieldLock,
            color: 'bg-pink-500',
            permission: 'roles index',
        },
        {
            title: 'Jenis Pelanggaran',
            value: stats?.totalViolationTypes,
            icon: IconAlertTriangle,
            color: 'bg-red-500',
            permission: 'violation-types index',
        },
        {
            title: 'Pelanggaran Taruna',
            value: stats?.totalStudentViolations,
            icon: IconShieldExclamation,
            color: 'bg-orange-500',
            permission: 'student-violations index',
        },
        {
            title: 'Jenis Prestasi',
            value: stats?.totalAchievementTypes,
            icon: IconAward,
            color: 'bg-teal-500',
            permission: 'achievement-types index',
        },
        {
            title: 'Prestasi Taruna',
            value: stats?.totalStudentAchievements,
            icon: IconTrophy,
            color: 'bg-cyan-500',
            permission: 'student-achievements index',
        },
    ];

    // Filter kartu berdasarkan hak akses pengguna (opsional, jika diperlukan)
    // const accessibleCards = dashboardCards.filter(card =>
    //     auth.permissions.includes(card.permission) || !card.permission // Tampilkan jika tidak ada permission spesifik
    // );
    // Untuk saat ini, kita tampilkan semua kartu
    const accessibleCards = dashboardCards;


    return (
        <AuthenticatedLayout
            // Prop user tidak lagi diperlukan karena AuthenticatedLayout mengambilnya dari usePage().props
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard Rekapitulasi</h2>}
        >
            <Head title="Dashboard" />

            <Container>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {accessibleCards.map((card, index) => (
                        <StatCard key={index} title={card.title} value={card.value} icon={card.icon} color={card.color} />
                    ))}
                </div>
            </Container>
        </AuthenticatedLayout>
    );
}