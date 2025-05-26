// resources/js/components/organisms/layout/SiteMobileMenu.jsx
import React, { useEffect } from 'react';

export default function SiteMobileMenu({ isOpen, toggleMobileMenu }) {
    useEffect(() => {
        const desktopNav = document.querySelector('.site-menu.main-menu.js-clone-nav');
        const mobileMenuBody = document.querySelector('.site-mobile-menu-body');

        if (desktopNav && mobileMenuBody) {
            const clonedNav = desktopNav.cloneNode(true);
            mobileMenuBody.innerHTML = '';
            mobileMenuBody.appendChild(clonedNav);

            clonedNav.querySelectorAll('a').forEach(link => {
                link.onclick = () => {
                    toggleMobileMenu();
                };
            });
        }
    }, [isOpen]); // Re-run when menu state changes to update cloned content

    return (
        <>
            <div className={`site-mobile-menu site-navbar-target ${isOpen ? 'site-mobile-menu-open' : ''}`}>
                <div className="site-mobile-menu-header">
                    <div className="site-mobile-menu-close mt-3">
                        <span className="icon-close2 js-menu-toggle" onClick={toggleMobileMenu}></span>
                    </div>
                </div>
                <div className="site-mobile-menu-body"></div>
            </div>
            {isOpen && (
                <div className="site-mobile-menu-overlay" onClick={toggleMobileMenu}></div>
            )}
        </>
    );
}