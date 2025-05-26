// resources/js/components/molecules/navigation/AuthNav.jsx
import React from 'react';
import { Link } from '@inertiajs/react';

export default function AuthNav({ auth }) {
    return (
        <nav className="site-navigation position-relative text-right" role="navigation">
            <ul className="site-menu main-menu site-menu-dark js-clone-nav mr-auto d-none d-lg-block m-0 p-0">
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