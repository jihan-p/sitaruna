import React, { useState, useEffect, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import SiteHeader from '@/components/organisms/layout/SiteHeader.jsx';
import SiteMobileMenu from '@/components/organisms/layout/SiteMobileMenu.jsx';
import SiteFooter from '@/components/organisms/layout/SiteFooter.jsx';

import AOS from 'aos';
import 'aos/dist/aos.css';

import $ from 'jquery';
import 'owl.carousel';

export default function PublicLayout({ auth, children, title = 'SMK Negeri 2 Subang' }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(prevState => !prevState);
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.classList.add('offcanvas-menu');
        } else {
            document.body.classList.remove('offcanvas-menu');
        }
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

            // Tambahkan pemeriksaan ini: Jika targetId kosong, hentikan eksekusi
            if (!targetId) {
                return;
            }

            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const headerOffset = $('.site-navbar').outerHeight() || 0;
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

        const handleScroll = () => {
            const $stickyWrapper = $('.js-sticky-header');
            const $siteNavbar = $('.site-navbar');
            if ($stickyWrapper.length && $siteNavbar.length) {
                const scrollTop = $(window).scrollTop();
                if (scrollTop > 0) {
                    $stickyWrapper.addClass('is-sticky');
                    $siteNavbar.addClass('shrink');
                } else {
                    $stickyWrapper.removeClass('is-sticky');
                    $siteNavbar.removeClass('shrink');
                }
            }
        };

        $(window).on('scroll', handleScroll);
        $(window).on('resize', () => {
            if ($(window).width() > 991.98 && isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
            }
        });

        $('.owl-carousel').owlCarousel({
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

        return () => {
            anchorLinks.forEach(link => {
                link.removeEventListener('click', handleAnchorClick);
            });
            $(window).off('scroll', handleScroll);
            $(window).off('resize');
            if ($('.owl-carousel').data('owl.carousel')) {
                $('.owl-carousel').owlCarousel('destroy');
            }
        };
    }, [isMobileMenuOpen, toggleMobileMenu]);

    useEffect(() => {
        // Initialize other jQuery plugins here if needed
    }, []);

    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                <title>{title}</title>
                <link href="https://fonts.googleapis.com/css?family=Muli:300,400,700,900" rel="stylesheet" />
            </Head>

            <div className="site-wrap">
                <div className="sticky-wrapper js-sticky-header">
                    <SiteHeader auth={auth} toggleMobileMenu={toggleMobileMenu} />
                </div>

                <SiteMobileMenu isOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />
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