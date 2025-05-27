import React from 'react';
import { Link } from '@inertiajs/react';

export default function AuthNav({ auth, isMobile = false }) {
    let navClasses;
    let ulClasses;

    if (isMobile) {
        // Untuk mobile menu: Langsung kembalikan <ul>
        ulClasses = "site-menu site-nav-wrap"; 
        return (
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
        );
    } else {
        // Untuk desktop menu: Bungkus dalam <nav>
        // KEMBALIKAN KELAS BOOTSTRAP UNTUK MENYEMBUNYIKAN DI MOBILE
        navClasses = "site-navigation position-relative text-right d-none d-lg-block"; 
        ulClasses = "site-menu main-menu site-menu-dark js-clone-nav mr-auto m-0 p-0"; 
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
}