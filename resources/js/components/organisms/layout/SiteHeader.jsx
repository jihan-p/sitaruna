import React, { forwardRef } from 'react'; // Penting: Impor forwardRef
import { Link } from '@inertiajs/react';
import DesktopNav from '@/components/molecules/navigation/DesktopNav.jsx';
import AuthNav from '@/components/molecules/navigation/AuthNav.jsx';
import MobileMenuToggle from '@/components/molecules/navigation/MobileMenuToggle.jsx';
import ApplicationLogo from '@/components/atoms/ApplicationLogo.jsx';

// Gunakan forwardRef agar komponen ini bisa menerima ref dari parent (PublicLayout)
const SiteHeader = forwardRef(function SiteHeader({ auth, toggleMobileMenu }, ref) {
    return (
        <header ref={ref} className="site-navbar py-4 js-sticky-header site-navbar-target" role="banner">
            <div className="container-fluid">
                <div className="d-flex align-items-center">
                    <div className="site-logo mr-auto w-25">
                        <Link href="/">
                            <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
                            SMK Negeri 2 Subang
                        </Link>
                    </div>
                    {/* Pembungkus untuk DesktopNav: d-none untuk mobile, d-lg-block untuk desktop */}
                    <div className="mx-auto text-center d-none d-lg-block"> 
                        <DesktopNav auth={auth} isMobile={false} /> 
                    </div>
                    {/* Pembungkus untuk AuthNav: d-none untuk mobile, d-lg-block untuk desktop */}
                    <div className="ml-auto w-25 d-none d-lg-block"> 
                        <AuthNav auth={auth} isMobile={false} />
                    </div>
                    {/* Tombol menu mobile (hamburger) hanya terlihat di mobile. Kelas d-block d-lg-none */}
                    {/* Pastikan MobileMenuToggle memiliki kelas d-block d-lg-none jika Anda ingin menyembunyikannya di desktop */}
                    <MobileMenuToggle onClick={toggleMobileMenu} /> 
                </div>
            </div>
        </header>
    );
});

export default SiteHeader;