import React from 'react';

export default function SiteMobileMenu({ isOpen, toggleMobileMenu, children }) {
    return (
        <>
            <div className={`site-mobile-menu site-navbar-target ${isOpen ? 'site-mobile-menu-open' : ''}`}>
                <div className="site-mobile-menu-header">
                    <div className="site-mobile-menu-close mt-3">
                        <span className="icon-close2 js-menu-toggle" onClick={toggleMobileMenu}></span>
                    </div>
                </div>
                <div className="site-mobile-menu-body">
                    {children}
                </div>
            </div>
            {isOpen && (
                <div className="site-mobile-menu-overlay" onClick={toggleMobileMenu}></div>
            )}
        </>
    );
}