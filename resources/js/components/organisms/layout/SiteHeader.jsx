// resources/js/components/organisms/layout/SiteHeader.jsx
import React, { useEffect } from 'react';
import { Link } from '@inertiajs/react';
import DesktopNav from '@/components/molecules/navigation/DesktopNav.jsx'; // New molecule
import AuthNav from '@/components/molecules/navigation/AuthNav.jsx'; // New molecule
import MobileMenuToggle from '@/components/molecules/navigation/MobileMenuToggle.jsx'; // New molecule
import ApplicationLogo from '@/components/atoms/ApplicationLogo.jsx'; // Reusing your ApplicationLogo

export default function SiteHeader({ auth, toggleMobileMenu }) {
    useEffect(() => {
        const stickyWrapper = document.querySelector('.sticky-wrapper');
        if (!stickyWrapper) return;

        const handleScroll = () => {
            const header = document.querySelector('.site-navbar');
            if (!header || !stickyWrapper) return;
            const headerHeight = header.offsetHeight;

            if (window.scrollY > headerHeight) {
                stickyWrapper.classList.add('is-sticky');
            } else {
                stickyWrapper.classList.remove('is-sticky');
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="sticky-wrapper">
            <header className="site-navbar py-4 js-sticky-header site-navbar-target" role="banner">
                <div className="container-fluid">
                    <div className="d-flex align-items-center">
                        <div className="site-logo mr-auto w-25">
                            <Link href="/">
                                <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
                                {/* You might want to display "SMK Negeri 2 Subang" text or have it in the logo itself */}
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
        </div>
    );
}