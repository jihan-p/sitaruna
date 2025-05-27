import React from 'react'; // Hanya React yang perlu diimpor

export default function SiteMobileMenu({ isOpen, toggleMobileMenu, children }) {
    // TIDAK ADA useEffect() untuk kloning DOM di sini.
    // Konten menu akan dirender langsung melalui `children` prop.

    return (
        <>
            <div className={`site-mobile-menu site-navbar-target ${isOpen ? 'site-mobile-menu-open' : ''}`}>
                <div className="site-mobile-menu-header">
                    <div className="site-mobile-menu-close mt-3">
                        <span className="icon-close2 js-menu-toggle" onClick={toggleMobileMenu}></span>
                    </div>
                </div>
                <div className="site-mobile-menu-body">
                    {/* Render children (DesktopNav dan AuthNav yang sudah diatur isMobile=true) */}
                    {children}
                </div>
            </div>
            {isOpen && (
                <div className="site-mobile-menu-overlay" onClick={toggleMobileMenu}></div>
            )}
        </>
    );
}