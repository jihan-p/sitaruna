// resources/js/Layouts/PublicLayout.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Head } from '@inertiajs/react';
import SiteHeader from '@/components/organisms/layout/SiteHeader.jsx';
import SiteMobileMenu from '@/components/organisms/layout/SiteMobileMenu.jsx';
import SiteFooter from '@/components/organisms/layout/SiteFooter.jsx';
import DesktopNav from '@/components/molecules/navigation/DesktopNav.jsx';
import AuthNav from '@/components/molecules/navigation/AuthNav.jsx';

import AOS from 'aos';
import 'aos/dist/aos.css';

import $ from 'jquery';
import 'owl.carousel';
// Tidak perlu lagi import 'jquery.sticky' di sini karena kita sudah punya handleScroll manual

export default function PublicLayout({ auth, children, title = 'SMK Negeri 2 Subang' }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const stickyWrapperRef = useRef(null);
    const siteNavbarRef = useRef(null);

    const toggleMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(prevState => !prevState);
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.classList.add('offcanvas-menu');
        } else {
            document.body.classList.remove('offcanvas-menu');
        }
        return () => {
            document.body.classList.remove('offcanvas-menu');
        };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        AOS.init({
            easing: 'ease',
            once: true,
        });

        const anchorLinks = document.querySelectorAll('.site-navbar a[href^="#"], .site-mobile-menu-body a[href^="#"]');
        const handleAnchorClick = function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);

            if (!targetId) {
                return;
            }

            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 50, // Sesuaikan offset jika header sticky menutupi
                    behavior: 'smooth'
                });
                // Tutup menu mobile setelah klik anchor
                if (isMobileMenuOpen) {
                    toggleMobileMenu();
                }
            }
        };

        anchorLinks.forEach(link => {
            link.addEventListener('click', handleAnchorClick);
        });

        // --- Perbaikan untuk Sticky Header Initial State ---
        const handleScroll = () => {
            const stickyWrapper = stickyWrapperRef.current;
            const siteNavbar = siteNavbarRef.current;

            if (stickyWrapper && siteNavbar) {
                // Periksa apakah elemen sudah ter-render dan bukan null
                const scrollTop = $(window).scrollTop();
                if (scrollTop > 0) {
                    stickyWrapper.classList.add('is-sticky');
                    siteNavbar.classList.add('shrink');
                } else {
                    stickyWrapper.classList.remove('is-sticky');
                    siteNavbar.classList.remove('shrink');
                }
            }
        };

        // Panggil handleScroll segera setelah komponen dimuat
        handleScroll(); // <-- TAMBAHKAN BARIS INI

        $(window).on('scroll', handleScroll);
        // Tambahkan event listener untuk resize juga, karena bisa mempengaruhi sticky state
        $(window).on('resize', handleScroll); // <-- TAMBAHKAN BARIS INI

        return () => {
            anchorLinks.forEach(link => {
                link.removeEventListener('click', handleAnchorClick);
            });
            $(window).off('scroll', handleScroll);
            $(window).off('resize', handleScroll); // <-- PASTIKAN INI ADA
            if ($('.owl-carousel').data('owl.carousel')) {
                $('.owl-carousel').owlCarousel('destroy');
            }
        };
    }, [isMobileMenuOpen, toggleMobileMenu]); // isMobileMenuOpen dan toggleMobileMenu adalah dependency karena digunakan di handleAnchorClick. handleScroll tidak menggunakan ini langsung.

    // ... sisa dari komponen PublicLayout
    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                <title>{title}</title>
                <link href="https://fonts.googleapis.com/css?family=Muli:300,400,700,900" rel="stylesheet" />
            </Head>

            <div className="site-wrap">
                <div ref={stickyWrapperRef} className="sticky-wrapper js-sticky-header">
                    <SiteHeader auth={auth} toggleMobileMenu={toggleMobileMenu} ref={siteNavbarRef} />
                </div>

                <SiteMobileMenu isOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu}>
                    <DesktopNav auth={auth} isMobile={true} />
                    <AuthNav auth={auth} isMobile={true} />
                </SiteMobileMenu>
                <main>{children}</main>
                <SiteFooter />
            </div>

            {isMobileMenuOpen && (
                <div
                    className="site-mobile-menu-overlay"
                    onClick={toggleMobileMenu}
                ></div>
            )}
        </>
    );
}