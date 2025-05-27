// resources/js/components/organisms/layout/SiteHeader.jsx
import React from 'react'; // Hanya React yang perlu diimport jika tidak ada useEffect
import { Link } from '@inertiajs/react';
import DesktopNav from '@/components/molecules/navigation/DesktopNav.jsx';
import AuthNav from '@/components/molecules/navigation/AuthNav.jsx';
import MobileMenuToggle from '@/components/molecules/navigation/MobileMenuToggle.jsx';
import ApplicationLogo from '@/components/atoms/ApplicationLogo.jsx';

export default function SiteHeader({ auth, toggleMobileMenu }) {
    return (
        <header className="site-navbar py-4 js-sticky-header site-navbar-target" role="banner">
            <div className="container-fluid">
                <div className="d-flex align-items-center">
                    <div className="site-logo mr-auto w-25">
                        <Link href="/">
                            <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
                            SMK Negeri 2 Subang
                        </Link>
                    </div>
                    <div className="mx-auto text-center">
                        <DesktopNav auth={auth} />
                    </div>
                    <div className="ml-auto w-25">
                        <AuthNav auth={auth} />
                        <MobileMenuToggle onClick={toggleMobileMenu} />
                    </div>
                </div>
            </div>
        </header>
    );
}