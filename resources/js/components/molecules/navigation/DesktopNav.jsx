import React from 'react';
import { Link } from '@inertiajs/react';
import NavLink from '@/components/atoms/NavLink.jsx';

export default function DesktopNav({ auth, isMobile = false }) {
    let navClasses;
    let ulClasses;

    if (isMobile) {
        // Untuk mobile menu: Langsung kembalikan <ul>
        ulClasses = "site-menu site-nav-wrap"; 
        return (
            <ul className={ulClasses}>
                <li><NavLink href="#home-section">Home</NavLink></li>
                <li><NavLink href="#courses-section">Courses</NavLink></li>
                <li><NavLink href="#programs-section">Programs</NavLink></li>
                <li><NavLink href="#teachers-section">Teachers</NavLink></li>
                <li><NavLink href="#contact-section">Kontak Kami</NavLink></li>
            </ul>
        );
    } else {
        // Untuk desktop menu: Bungkus dalam <nav>
        // KEMBALIKAN KELAS BOOTSTRAP UNTUK MENYEMBUNYIKAN DI MOBILE
        navClasses = "site-navigation position-relative text-right d-none d-lg-block"; 
        ulClasses = "site-menu main-menu js-clone-nav mx-auto m-0 p-0"; 
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
}