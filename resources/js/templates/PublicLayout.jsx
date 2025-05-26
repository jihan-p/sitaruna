// resources/js/templates/PublicLayout.jsx

import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import SiteHeader from '@/components/organisms/layout/SiteHeader.jsx';
import SiteMobileMenu from '@/components/organisms/layout/SiteMobileMenu.jsx';
import SiteFooter from '@/components/organisms/layout/SiteFooter.jsx';

// Assuming 'aos' npm package is installed:
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles

// Import jQuery and Owl Carousel after installing via npm/yarn
import $ from 'jquery'; // Import jQuery
import 'owl.carousel'; // Import Owl Carousel JS
// Note: Owl Carousel CSS is already linked in the <head> section above.

export default function PublicLayout({ auth, children, title = 'SMK Negeri 2 Subang' }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(prevState => !prevState);
    };

    // ==========================================================
    // PERBAIKAN UTAMA: Tambahkan useEffect ini untuk mengelola class 'offcanvas-menu' di body
    // ==========================================================
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.classList.add('offcanvas-menu');
        } else {
            document.body.classList.remove('offcanvas-menu');
        }

        // Cleanup function: Pastikan class dihapus saat komponen unmount atau sebelum efek dijalankan ulang
        return () => {
            document.body.classList.remove('offcanvas-menu');
        };
    }, [isMobileMenuOpen]); // Jalankan efek ini setiap kali isMobileMenuOpen berubah
    // ==========================================================


    useEffect(() => {
        AOS.init({
            easing: 'ease',
            once: true,
        });

        // Smooth Scrolling for Anchor Links
        const anchorLinks = document.querySelectorAll('.site-navbar a[href^="#"], .site-mobile-menu-body a[href^="#"]');
        const handleAnchorClick = function(e) {
            const targetId = this.getAttribute('href').substring(1);

            if (targetId) { // Hanya panggil getElementById jika targetId tidak kosong
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    e.preventDefault(); // Hanya mencegah default jika target ID valid dan ditemukan
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            } else if (this.getAttribute('href') === '#') {
                e.preventDefault(); // Mencegah perilaku default (reload halaman) untuk link yang hanya '#'
            }
        };

        anchorLinks.forEach(link => {
            link.addEventListener('click', handleAnchorClick);
        });

        return () => {
            anchorLinks.forEach(link => {
                link.removeEventListener('click', handleAnchorClick);
            });
        };
    }, []); // Dependensi kosong agar hanya berjalan sekali saat mount

    // --- Implement Sticky Header Logic ---
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

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // --- Implement Owl Carousel Initialization ---
    useEffect(() => {
        if (typeof window !== 'undefined' && window.$ && window.$.fn && window.$.fn.owlCarousel) {
            const $ = window.$;
            const carousel = $('.owl-carousel.nonloop-block-14');

            if (carousel.length > 0) {
                carousel.owlCarousel({
                    center: false,
                    items: 1,
                    loop: true,
                    stagePadding: 0,
                    margin: 20,
                    smartSpeed: 1000,
                    autoplay: true,
                    nav: false,
                    dots: true,
                    responsive: {
                        600: { margin: 20, nav: false, dots: true, items: 2 },
                        1000: { margin: 20, stagePadding: 0, nav: false, dots: true, items: 3 }
                    }
                });

                $('.customPrevBtn').click(function() { carousel.trigger('prev.owl.carousel'); });
                $('.customNextBtn').click(function() { carousel.trigger('next.owl.carousel'); });
            }
        } else {
            console.warn('jQuery or Owl Carousel not found. Carousel will not initialize.');
        }
    }, []);


    return (
        <>
            <Head title={title}>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

                {/* External CSS links from index.html (consider bundling with Vite) */}
                <link href="https://fonts.googleapis.com/css?family=Muli:300,400,700,900" rel="stylesheet" />
                <link rel="stylesheet" href="/oneschool/fonts/icomoon/style.css" />
                <link rel="stylesheet" href="/oneschool/css/bootstrap.min.css" />
                <link rel="stylesheet" href="/oneschool/css/jquery-ui.css" />
                <link rel="stylesheet" href="/oneschool/css/owl.carousel.min.css" />
                <link rel="stylesheet" href="/oneschool/css/owl.theme.default.min.css" />
                <link rel="stylesheet" href="/oneschool/css/jquery.fancybox.min.css" />
                <link rel="stylesheet" href="/oneschool/css/bootstrap-datepicker.css" />
                <link rel="stylesheet" href="/oneschool/fonts/flaticon/font/flaticon.css" />
                <link rel="stylesheet" href="/oneschool/css/aos.css" />
                <link rel="stylesheet" href="/oneschool/css/style.css" />
            </Head>

            <div className="site-wrap">
                {/* Note: SiteMobileMenu dan SiteHeader akan mengambil state isMobileMenuOpen dan toggleMobileMenu dari PublicLayout */}
                <SiteMobileMenu isOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />
                <SiteHeader auth={auth} toggleMobileMenu={toggleMobileMenu} />
                <main>{children}</main>
                <SiteFooter />
            </div>

            {/* Overlay ini sekarang dikelola oleh CSS .site-wrap:before yang aktif saat offcanvas-menu di body */}
            {/* Anda bisa menghapus div ini, atau jika ingin tetap punya overlay yang dikelola React,
                pastikan CSS Anda untuk .site-mobile-menu-overlay merespons class 'offcanvas-menu' di body juga. */}
            {/* Untuk menjaga kesederhanaan dan mengikuti template, kita biarkan CSS template yang mengelola overlaynya. */}
            {/* Anda bisa mengomentari atau menghapus bagian ini jika tidak lagi diperlukan: */}
            {/* {isMobileMenuOpen && (
                <div
                    className="site-mobile-menu-overlay" // Use class from original CSS
                    onClick={toggleMobileMenu} // Close menu when overlay is clicked
                ></div>
            )} */}
        </>
    );
}