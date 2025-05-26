// resources/js/templates/PublicLayout.jsx
import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import SiteHeader from '@/components/organisms/layout/SiteHeader.jsx'; // New organism
import SiteMobileMenu from '@/components/organisms/layout/SiteMobileMenu.jsx'; // New organism
import SiteFooter from '@/components/organisms/layout/SiteFooter.jsx'; // New organism

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

    useEffect(() => {
        AOS.init({
            easing: 'ease',
            once: true,
        });

        // Smooth Scrolling for Anchor Links
        const anchorLinks = document.querySelectorAll('.site-navbar a[href^="#"], .site-mobile-menu-body a[href^="#"]');
        const handleAnchorClick = function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
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
    }, []);

    return (
        <>
            <Head>
                <title>{title}</title>
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
                <SiteMobileMenu isOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />
                <SiteHeader auth={auth} toggleMobileMenu={toggleMobileMenu} />
                <main>{children}</main> {/* This is where the page content will be rendered */}
                <SiteFooter />
            </div>
        </>
    );
}