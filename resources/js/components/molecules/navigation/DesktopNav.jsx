// resources/js/components/molecules/navigation/DesktopNav.jsx
import React from 'react';
import { Link } from '@inertiajs/react';
import NavLink from '@/components/atoms/NavLink.jsx'; // Reusing your existing NavLink

export default function DesktopNav({ auth }) {
    return (
        <nav className="site-navigation position-relative text-right" role="navigation">
            <ul className="site-menu main-menu js-clone-nav mx-auto d-none d-lg-block m-0 p-0">
                <li><NavLink href="#home-section">Home</NavLink></li>
                <li><NavLink href="#courses-section">Courses</NavLink></li>
                <li><NavLink href="#programs-section">Programs</NavLink></li>
                <li><NavLink href="#teachers-section">Teachers</NavLink></li>
                <li><NavLink href="#contact-section">Kontak Kami</NavLink></li>
            </ul>
        </nav>
    );
}