import React from 'react';
import { Link } from '@inertiajs/react';

export default function AuthNav({ auth, isMobile = false }) {
    // Navigasi HARUS SELALU dibungkus oleh <nav>
    const navClasses = "site-navigation position-relative text-right";

    let ulClasses;
    if (isMobile) {
        // Untuk mobile menu: gunakan kelas yang sesuai untuk styling vertikal di sidebar
        // JANGAN gunakan kelas d-none d-lg-block di sini
        ulClasses = "site-menu site-nav-wrap site-menu-dark"; // Tambahkan site-menu-dark jika perlu
    } else {
        // Untuk desktop menu: kelas standar main menu
        // JANGAN gunakan kelas d-none d-lg-block di sini, karena itu di SiteHeader
        ulClasses = "site-menu main-menu site-menu-dark js-clone-nav mr-auto m-0 p-0"; 
    }

    return (
        <nav className={navClasses} role="navigation">
            <ul className={ulClasses}>
                {auth.user ? (
                    <li>
                        <Link
                            href={route('dashboard')}
                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                        >
                            Dashboard
                        </Link>
                    </li>
                ) : (
                    <>
                        <li className="cta">
                            <Link
                                href={route('login')}
                                className="nav-link"
                            >
                                <span>Log in</span>
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}