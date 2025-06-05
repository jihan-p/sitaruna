import React, { useState, useEffect, useRef } from 'react';
import { IconChevronDown } from '@tabler/icons-react';
import { usePage, router } from '@inertiajs/react'; // Import router

const NavDropdown = ({
    title,
    icon: IconComponent,
    children,
    isSidebarExpanded,
    isMobile,
    activeRoutePatterns = [], // Array of route name patterns, e.g., ['majors.*', 'classes.index']
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Determine if the dropdown itself should be considered active
    const isDropdownActive = activeRoutePatterns.some(pattern => {
        const currentRouteName = route().current();
        if (!currentRouteName) return false;

        if (pattern.endsWith('.*')) {
            // Handle wildcard pattern like 'majors.*' -> checks if current route starts with 'majors'
            return currentRouteName.startsWith(pattern.slice(0, -2));
        }
        return currentRouteName === pattern; // Exact match
    });

    // Automatically open dropdown if it's active on page load
    useEffect(() => {
        if (isDropdownActive) {
            setIsOpen(true);
        }
    }, [isDropdownActive]);

    const toggleDropdown = (e) => {
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const baseClasses = `
        flex items-center w-full py-2 px-3 text-sm font-medium rounded-md
        transition duration-150 ease-in-out focus:outline-none cursor-pointer
    `;

    const colorClasses = isDropdownActive && !isOpen // Highlight if active AND closed (to show parent is active)
        ? `bg-gray-200 text-gray-900 font-semibold`
        : `text-gray-700 hover:bg-gray-200 hover:text-gray-900 focus:bg-gray-200 focus:text-gray-900`;

    // Text visible if sidebar is expanded (mobile or desktop)
    const isTextVisible = isSidebarExpanded;

    // Flyout menu styling when sidebar is collapsed on desktop
    const flyoutMenuClasses = !isTextVisible && !isMobile && isOpen
        ? 'absolute left-full top-0 w-56 bg-gray-50 shadow-lg rounded-md ml-1 py-1 z-50 border border-gray-200'
        : '';

    const dropdownItemsContainerClasses = `
        ${isTextVisible ? 'pl-4 pr-2 py-1 mt-1 space-y-0.5' : ''}
        ${flyoutMenuClasses}
    `;

    return (
        <div ref={dropdownRef} className="relative">
            <a
                href="#"
                onClick={toggleDropdown}
                className={`${baseClasses} ${colorClasses}`}
                aria-expanded={isOpen}
                role="button"
            >
                {IconComponent && (
                    <IconComponent size={20} strokeWidth={1.5} className={isTextVisible ? 'mr-3' : (!isMobile ? 'sm:mx-auto' : 'mr-3')} />
                )}
                {isTextVisible && (
                    <span className="flex-1 text-left">{title}</span>
                )}
                {isTextVisible && (
                    <IconChevronDown
                        size={16}
                        strokeWidth={1.5}
                        className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                )}
                {!isTextVisible && !isMobile && (
                    <span className="sr-only">{title}</span>
                )}
            </a>

            {isOpen && (
                <div className={dropdownItemsContainerClasses}>
                    {React.Children.map(children, child =>
                        React.isValidElement(child) ? React.cloneElement(child, { isSidebarExpanded: (!isTextVisible && !isMobile) ? true : isSidebarExpanded }) : child
                    )}
                </div>
            )}
        </div>
    );
};

export default NavDropdown;