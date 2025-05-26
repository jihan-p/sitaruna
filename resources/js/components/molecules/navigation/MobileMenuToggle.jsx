// resources/js/components/molecules/navigation/MobileMenuToggle.jsx
import React from 'react';

export default function MobileMenuToggle({ onClick }) {
    return (
        <a href="#" className="d-inline-block d-lg-none site-menu-toggle js-menu-toggle text-black float-right" onClick={onClick}>
            <span className="icon-menu h3"></span>
        </a>
    );
}