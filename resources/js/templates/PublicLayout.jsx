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
    }, []);

    useEffect(() => {
        const anchorLinks = document.querySelectorAll('.site-navbar a[href^="#"], .site-mobile-menu-body a[href^="#"]');
        
        const handleAnchorClick = function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);

            if (!targetId) {
                return;
            }

            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const headerOffset = siteNavbarRef.current ? siteNavbarRef.current.offsetHeight : ($('.site-navbar').outerHeight() || 0);
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });

                if (isMobileMenuOpen) {
                    toggleMobileMenu();
                }
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
    }, [isMobileMenuOpen, toggleMobileMenu]);

    useEffect(() => {
        const handleScroll = () => {
            const stickyWrapper = stickyWrapperRef.current;
            const siteNavbar = siteNavbarRef.current;

            if (stickyWrapper && siteNavbar) {
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

        $(window).on('scroll', handleScroll);

        return () => {
            $(window).off('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const $owlCarousel = $('.owl-carousel');
        if ($owlCarousel.length) {
            $owlCarousel.owlCarousel({
                loop:true,
                margin:10,
                nav:true,
                items:1,
                dots: true,
                stagePadding: 0,
                autoplay:true,
                autoplayHoverPause: true,
                autoplayTimeout: 3000,
                navText: ["<span class='icon-keyboard_arrow_left'>", "<span class='icon-keyboard_arrow_right'>"]
            });
        }

        return () => {
            if ($owlCarousel.data('owl.carousel')) {
                $owlCarousel.owlCarousel('destroy');
            }
        };
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 991.98 && isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isMobileMenuOpen]);

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
                    {/* HANYA LAKUKAN INI jika DesktopNav dan AuthNav di bawah ini juga diubah untuk mengembalikan <ul> langsung */}
                    {/* Ini mengikuti asumsi struktur asli tema mobile yang mengharapkan UL langsung di site-mobile-menu-body */}
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