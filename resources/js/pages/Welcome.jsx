import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/components/atoms/ApplicationLogo'; // Impor logo aplikasi Anda
import { IconBook, IconShieldCheck, IconUsersPlus, IconReportAnalytics, IconHeart } from '@tabler/icons-react'; // Impor ikon yang relevan

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Selamat Datang di SITARUNA" />
            <div className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                {/* Background Image - Opsional, bisa diganti atau dihapus */}
                <div
                    className="absolute inset-0 z-0 opacity-20 dark:opacity-10"
                    style={{
                        backgroundImage: `url('/images/bg-homepage-default.jpg')`, // Ganti dengan path gambar background Anda
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                ></div>

                <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-blue-600 selection:text-white">
                    <div className="relative w-full max-w-4xl px-6 py-10 lg:max-w-5xl lg:py-16">
                        <header className="flex flex-col sm:flex-row items-center justify-between gap-6 py-8">
                            <div className="flex items-center gap-4">
                                <ApplicationLogo className="h-16 w-auto sm:h-20" />
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                                        SITARUNA
                                    </h1>
                                    <p className="text-md text-gray-600 dark:text-gray-400">
                                    Sistem Informasi Terpadu Akademik dan Ketarunaan
                                    </p>
                                    <p className="text-2xl text-gray-500 dark:text-gray-300">
                                        SMK Negeri 2 Subang
                                    </p>
                                </div>
                            </div>
                            <nav className="-mx-3 flex flex-1 justify-end">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-transparent transition hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus-visible:ring-blue-400"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-transparent transition hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus-visible:ring-blue-400"
                                        >
                                            Log in
                                        </Link>
                                        {/* Tombol Register bisa di-disable jika tidak diperlukan */}
                                        {/* <Link
                                            href={route('register')}
                                            className="ml-4 rounded-md px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-transparent transition hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus-visible:ring-blue-400"
                                        >
                                            Register
                                        </Link> */}
                                    </>
                                )}
                            </nav>
                        </header>

                        <main className="mt-10">
                            <div className="text-center mb-12">
                                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 sm:text-3xl">
                                    Fitur Unggulan SITARUNA
                                </h2>
                                <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                    SITARUNA dirancang untuk mempermudah pengelolaan data akademik dan ketarunaan secara terintegrasi, efisien, dan transparan.
                                </p>
                            </div>

                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
                                <FeatureCard
                                    icon={<IconBook size={32} className="text-blue-500" />}
                                    title="Manajemen Akademik & Kesiswaan"
                                    description="Kelola data taruna, pendaftaran, kelas, dan informasi akademik lainnya dengan mudah."
                                />
                                <FeatureCard
                                    icon={<IconShieldCheck size={32} className="text-green-500" />}
                                    title="Monitoring Ketarunaan"
                                    description="Catat dan pantau pelanggaran serta prestasi taruna secara real-time untuk pembinaan yang lebih baik."
                                />
                                <FeatureCard
                                    icon={<IconUsersPlus size={32} className="text-purple-500" />}
                                    title="Pengelolaan Staf & Pengguna"
                                    description="Atur data Pendidik dan Tenaga Kependidikan (PTK) serta manajemen hak akses pengguna sistem."
                                />
                                <FeatureCard
                                    icon={<IconReportAnalytics size={32} className="text-yellow-500" />}
                                    title="Laporan & Analisis"
                                    description="Hasilkan laporan komprehensif untuk mendukung pengambilan keputusan dan evaluasi."
                                />
                            </div>
                        </main>

                        <footer className="py-12 mt-10 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
                            Copyright &copy;{new Date().getFullYear()} All rights reserved | made with <IconHeart size={16} strokeWidth={1.5} className="inline-block align-text-bottom" /> by <a href="https://t.me/jhanplv" target="_blank" className="text-blue-600 hover:underline" >jipi</a> @RPL SMKN 2 Subang
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}

// Komponen kecil untuk Feature Card
const FeatureCard = ({ icon, title, description }) => (
    <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex-shrink-0 p-4 bg-gray-200 dark:bg-gray-700 rounded-full mb-4">
            {icon}
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
    </div>
);