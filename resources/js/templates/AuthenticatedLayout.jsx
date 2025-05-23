import React, { useState, useEffect, useRef } from 'react';
import ApplicationLogo from '@/components/atoms/ApplicationLogo';
import Dropdown from '@/components/molecules/Dropdown';
import NavLink from '@/components/atoms/NavLink';
import ResponsiveNavLink from '@/components/atoms/ResponsiveNavLink';
import AcademicPeriodSelector from '@/components/molecules/AcademicPeriodSelector';

import { Link, usePage } from '@inertiajs/react';

import {
    IconMenu2,
    IconX,
    IconLock,
    IconLockOpen,
    IconDashboard,
    IconUsers,
    IconShield,
    IconList,
    IconUsersGroup,
    IconBuildingSkyscraper,
    IconHeart,
    IconCalendar,
    IconCalendarStats,
    IconListDetails,
    IconSchool,
} from '@tabler/icons-react';

import hasAnyPermission from '@/utils/Permissions';


export default function AuthenticatedLayout({ user: authUser, header, children }) {

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const { academicYears, activeAcademicYearId, activeSemesterId, auth } = usePage().props;
    const user = auth.user;
    const allPermissions = auth.permissions;

    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const [isSidebarLocked, setIsSidebarLocked] = useState(() => {
        try {
            const storedValue = localStorage.getItem('sidebarLocked');
            if (storedValue !== null) {
                return storedValue === 'true';
            } else {
                const initialIsMobile = typeof window !== 'undefined' ? window.innerWidth < 640 : false;
                return !initialIsMobile;
            }
        } catch (e) {
            console.error("Failed to read from localStorage:", e);
            const initialIsMobile = typeof window !== 'undefined' ? window.innerWidth < 640 : false;
            return !initialIsMobile;
        }
    });

    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 640 : false);
    const sidebarRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 640;
            setIsMobile(mobile);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (!isMobile) {
            if (isSidebarLocked) {
                if (!isSidebarExpanded) {
                    setIsSidebarExpanded(true);
                }
            } else {
                if (isSidebarExpanded) {
                    setIsSidebarExpanded(false);
                }
            }
        } else {
            if (isSidebarExpanded) {
                setIsSidebarExpanded(false);
            }
        }
    }, [isMobile, isSidebarLocked]);

    useEffect(() => {
        const sidebarElement = sidebarRef.current;
        if (!sidebarElement) return;

        const handleMouseEnter = () => {
            if (!isMobile && !isSidebarLocked) {
                setIsSidebarExpanded(true);
            }
        };

        const handleMouseLeave = () => {
            if (!isMobile && !isSidebarLocked) {
                 setTimeout(() => {
                    if (!isSidebarLocked && isSidebarExpanded) {
                       setIsSidebarExpanded(false);
                    }
                }, 50);
            }
        };

        if (!isMobile && !isSidebarLocked) {
             sidebarElement.removeEventListener('mouseenter', handleMouseEnter);
             sidebarElement.removeEventListener('mouseleave', handleMouseLeave);
             sidebarElement.addEventListener('mouseenter', handleMouseEnter);
             sidebarElement.addEventListener('mouseleave', handleMouseLeave);
        } else {
             sidebarElement.removeEventListener('mouseenter', handleMouseEnter);
             sidebarElement.removeEventListener('mouseleave', handleMouseLeave);
        }

        return () => {
            if (sidebarElement) {
                 sidebarElement.removeEventListener('mouseenter', handleMouseEnter);
                 sidebarElement.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, [isMobile, isSidebarLocked, isSidebarExpanded]);


    const toggleMobileSidebar = () => {
        setIsMobileSidebarOpen((prevState) => !prevState);
    };

    const toggleSidebarLock = () => {
        const nextLockedState = !isSidebarLocked;
        setIsSidebarLocked(nextLockedState);
        try {
             localStorage.setItem('sidebarLocked', nextLockedState.toString());
        } catch (e) {
             console.error("Failed to write to localStorage:", e);
        }
        setIsSidebarExpanded(nextLockedState);
    };


    const sidebarClasses = `
        fixed inset-y-0 left-0 z-50 border-r border-gray-200 flex flex-col h-screen overflow-y-auto transition-transform ease-in-out duration-300
        bg-gray-100
        text-gray-800
        ${isMobile ? 'w-64' : 'sm:w-auto'}
        ${isMobile ? (isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'sm:translate-x-0 sm:relative'}
        ${isMobile ? '' : (isSidebarExpanded ? 'sm:w-64' : 'sm:w-20')}
        ${isMobile ? '' : (isSidebarExpanded ? '' : 'sm:overflow-hidden')}
    `;

    const mainContentClasses = `
         flex-1 flex flex-col overflow-y-auto
         ${isMobile ? 'ml-0' : (isSidebarExpanded ? 'sm:ml-0' : 'sm:ml-0')}
     `;

    const isNavExpanded = isMobile ? isMobileSidebarOpen : isSidebarExpanded;


    return (
        <div className="flex min-h-screen bg-gray-100">

            <div ref={sidebarRef} className={sidebarClasses}>

                <div className="flex shrink-0 items-center px-4 py-6 border-b border-gray-200 justify-between">
                    <div className="flex items-center">
                        <ApplicationLogo className={`block h-9 w-auto fill-current text-gray-800 ${isNavExpanded ? 'mr-3' : 'sm:mr-3'}`} />
                         {isNavExpanded && (
                             <span className="text-xl font-semibold text-gray-800 mr-3">SITARUNA</span>
                         )}
                    </div>

                    {!isMobile && (
                         <div className={`flex items-center ml-auto ${!isSidebarExpanded ? 'sm:-mr-4' : ''}`}>
                             <input
                                 type="checkbox"
                                 id="sidebar-lock-toggle"
                                 checked={isSidebarLocked}
                                 onChange={toggleSidebarLock}
                                 className="sr-only"
                             />
                             <label
                                 htmlFor="sidebar-lock-toggle"
                                 className="flex items-center cursor-pointer text-gray-600 hover:text-gray-800 shrink-0 px-2 py-1 rounded-md hover:bg-gray-200 transition-colors duration-200 mr-3"
                             >
                                 {isSidebarLocked ? <IconLock size={20} strokeWidth={1.5} /> : <IconLockOpen size={20} strokeWidth={1.5} />}
                             </label>
                         </div>
                    )}

                    {isMobile && isMobileSidebarOpen && (
                         <button
                             onClick={toggleMobileSidebar}
                             className="p-1 rounded-md text-gray-600 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 ml-auto"
                         >
                              <IconX size={24} strokeWidth={1.5} />
                         </button>
                    )}
                </div>

                <nav className="flex flex-col flex-1 px-2 py-4 space-y-1">
                    <NavLink
                        href={route('dashboard')}
                        active={route().current('dashboard')}
                        isSidebarExpanded={isNavExpanded}
                        isMobile={isMobile}
                        icon={IconDashboard}
                    >
                        Dashboard
                    </NavLink>

                    {user && hasAnyPermission(allPermissions, ['roles index']) && (
                         <NavLink
                            href={route('roles.index')}
                            active={route().current('roles.index')}
                            isSidebarExpanded={isNavExpanded}
                            isMobile={isMobile}
                            icon={IconUsers}
                        >
                            Roles
                        </NavLink>
                    )}
                     {user && hasAnyPermission(allPermissions, ['permissions index']) && (
                         <NavLink
                            href={route('permissions.index')}
                            active={route().current('permissions.index')}
                            isSidebarExpanded={isNavExpanded}
                            isMobile={isMobile}
                            icon={IconShield}
                         >
                            Permissions
                         </NavLink>
                     )}
                     {user && hasAnyPermission(allPermissions, ['users index']) && (
                         <NavLink
                            href={route('users.index')}
                            active={route().current('users.index')}
                            isSidebarExpanded={isNavExpanded}
                            isMobile={isMobile}
                            icon={IconList}
                         >
                            Users
                         </NavLink>
                     )}

                     {user && hasAnyPermission(allPermissions, ['students index']) && (
                         <NavLink
                            href={route('students.index')}
                            active={route().current('students.index')}
                            isSidebarExpanded={isNavExpanded}
                            isMobile={isMobile}
                            icon={IconUsersGroup}
                        >
                            Peserta Didik
                        </NavLink>
                     )}

                     {user && hasAnyPermission(allPermissions, ['majors index']) && (
                         <NavLink
                            href={route('majors.index')}
                            active={route().current('majors.index')}
                            isSidebarExpanded={isNavExpanded}
                            isMobile={isMobile}
                            icon={IconBuildingSkyscraper}
                        >
                            Jurusan
                        </NavLink>
                     )}

                    {user && hasAnyPermission(allPermissions, ['academic-years index']) && (
                         <NavLink href={route('academic-years.index')} active={route().current('academic-years.index')} isSidebarExpanded={isNavExpanded} isMobile={isMobile} icon={IconCalendar}>Tahun Ajaran</NavLink>
                     )}

                    {user && hasAnyPermission(allPermissions, ['semesters index']) && (
                         <NavLink href={route('semesters.index')} active={route().current('semesters.index')} isSidebarExpanded={isNavExpanded} isMobile={isMobile} icon={IconCalendarStats}>Semester</NavLink>
                     )}

                     {user && hasAnyPermission(allPermissions, ['classes index']) && (
                         <NavLink
                            href={route('classes.index')}
                            active={route().current('classes.index')}
                            isSidebarExpanded={isNavExpanded}
                            isMobile={isMobile}
                            icon={IconListDetails}
                         >
                            Kelas
                         </NavLink>
                     )}

                     {user && hasAnyPermission(allPermissions, ['enrollments index']) && (
                         <NavLink
                            href={route('enrollments.index')}
                            active={route().current('enrollments.index')}
                            isSidebarExpanded={isNavExpanded}
                            isMobile={isMobile}
                            icon={IconSchool}
                         >
                            Pendaftaran
                         </NavLink>
                     )}


                </nav>

            </div>

            {isMobile && isMobileSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-25"
                    onClick={toggleMobileSidebar}
                ></div>
            )}

            {isMobile && isMobileSidebarOpen && (
            <div className="border-t border-gray-200 p-4">
                <div className="relative">
                <Dropdown align="right" width="48">
                    <Dropdown.Trigger>
                    <span className="inline-flex w-full">
                        <button
                        type="button"
                        className="inline-flex justify-between items-center w-full px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                        >
                        {user ? user.name : 'Guest'}
                        <svg
                            className="ml-2 h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                            />
                        </svg>
                        </button>
                    </span>
                    </Dropdown.Trigger>
                    <Dropdown.Content>
                    <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                    <Dropdown.Link href={route('logout')} method="post" as="button">
                        Log Out
                    </Dropdown.Link>
                    </Dropdown.Content>
                </Dropdown>
                </div>
            </div>
            )}


            <div className={mainContentClasses}>

                <header className="w-full bg-white shadow">
                     <div className="flex items-center px-4 py-6 sm:px-6 lg:px-8">

                         {isMobile && (
                            <button
                                onClick={toggleMobileSidebar}
                                className="-ms-2 mr-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                 <IconMenu2 size={24} strokeWidth={1.5} />
                            </button>
                         )}

                         <div className="flex-1 px-2 sm:px-0">
                             {header}
                         </div>

                         <div className="hidden sm:flex sm:items-center sm:ms-6">
                            <AcademicPeriodSelector
                                academicYears={academicYears}
                                activeAcademicYearId={activeAcademicYearId}
                                activeSemesterId={activeSemesterId} />
                            <div className="ms-3 relative">
                                <Dropdown align="right" width="48">
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                    >
                                        {user ? user.name : 'Guest'}

                                        <svg
                                        className="ms-2 -me-0.5 h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                        </svg>
                                    </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                    Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                    </div>
                </header>

                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>

                <footer className="bg-white py-4 text-center mt-8">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <p className="text-gray-600 text-sm">
                                Copyright &copy;{new Date().getFullYear()} All rights reserved | made with <IconHeart size={16} strokeWidth={1.5} className="inline-block align-text-bottom" /> by <a href="https://t.me/jhanplv" target="_blank" className="text-blue-600 hover:underline" >jipi</a> @RPL SMKN 2 Subang
                        </p>

                    </div>
                </footer>

            </div>
        </div>

    );
}