// resources/js/components/molecules/AcademicPeriodSelector.jsx

import React, { useState, useEffect, useRef } from 'react';
import { usePage, router } from '@inertiajs/react';
import { IconChevronDown } from '@tabler/icons-react';

export default function AcademicPeriodSelector({ academicYears, className = '' }) { // Tambahkan className sebagai prop
    const { activeAcademicYearId, activeSemesterId } = usePage().props;

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Filter academicYears untuk hanya menampilkan yang memiliki semesters
    const availableAcademicYears = academicYears.filter(year => year.semesters && year.semesters.length > 0);

    const selectedAcademicYear = availableAcademicYears.find(
        (year) => year.id === activeAcademicYearId
    );
    const selectedSemester = selectedAcademicYear?.semesters.find(
        (semester) => semester.id === activeSemesterId
    );

    const handleSelectPeriod = (yearId, semesterId) => {
        router.post(
            route('set.academic.period'), // Ini adalah rute yang akan Anda buat di Laravel
            {
                academic_year_id: yearId,
                semester_id: semesterId,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsOpen(false); // Tutup dropdown setelah memilih
                },
            }
        );
    };

    // Tutup dropdown jika klik di luar
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

    if (!availableAcademicYears || availableAcademicYears.length === 0) {
        return (
            <div className={`text-sm text-gray-500 ${className}`}> {/* Terapkan className di sini */}
                Data Tahun Ajaran tidak tersedia.
            </div>
        );
    }

    return (
        <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}> {/* Terapkan className di sini */}
            <div>
                <button
                    type="button"
                    className="inline-flex justify-center items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 w-full" // Tambahkan w-full di sini
                    id="menu-button"
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {selectedAcademicYear && selectedSemester ? (
                        `${selectedAcademicYear.nama_tahun_ajaran} - ${selectedSemester.nama_semester}`
                    ) : (
                        'Pilih Periode Akademik'
                    )}
                    <IconChevronDown className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                </button>
            </div>

            {isOpen && (
                <div
                    className="absolute left-0 z-10 mt-2 w-full sm:w-72 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-80 overflow-y-auto" // Ubah right-0 ke left-0, dan w-72 ke w-full sm:w-72
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                    tabIndex="-1"
                >
                    <div className="py-1" role="none">
                        {availableAcademicYears.map((year) => (
                            <div key={year.id} className="border-b border-gray-100 last:border-b-0">
                                <div className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50">
                                    {year.nama_tahun_ajaran}
                                </div>
                                {year.semesters.map((semester) => (
                                    <button
                                        key={semester.id}
                                        onClick={() => handleSelectPeriod(year.id, semester.id)}
                                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                                            activeAcademicYearId === year.id &&
                                            activeSemesterId === semester.id
                                                ? 'bg-blue-100 text-blue-700 font-medium'
                                                : 'text-gray-700'
                                        }`}
                                        role="menuitem"
                                        tabIndex="-1"
                                    >
                                        {semester.nama_semester}
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
