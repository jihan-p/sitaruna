import React from 'react';
import { Link } from '@inertiajs/react';
import NavLink from '@/components/atoms/NavLink.jsx';

export default function DesktopNav({ auth, isMobile = false }) {
    // Navigasi HARUS SELALU dibungkus oleh <nav>
    const navClasses = "site-navigation position-relative text-right";
    
    let ulClasses;
    if (isMobile) {
        // Untuk mobile menu: gunakan kelas yang sesuai untuk styling vertikal di sidebar
        // JANGAN gunakan kelas d-none d-lg-block di sini
        ulClasses = "site-menu site-nav-wrap"; 
    } else {
        // Untuk desktop menu: kelas standar main menu
        // JANGAN gunakan kelas d-none d-lg-block di sini, karena itu di SiteHeader
        ulClasses = "site-menu main-menu js-clone-nav mx-auto m-0 p-0"; 
    }

    return (
        <nav className={navClasses} role="navigation">
            <ul className={ulClasses}>
                <li><NavLink href="#home-section">Home</NavLink></li>
                <li><NavLink href="#courses-section">Courses</NavLink></li>
                <li><NavLink href="#programs-section">Programs</NavLink></li>
                <li><NavLink href="#teachers-section">Teachers</NavLink></li>
                <li><NavLink href="#contact-section">Kontak Kami</NavLink></li>
            </ul>
        </nav>
    );
}