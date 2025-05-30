import React from 'react';
import { Link } from '@inertiajs/react';
import { IconFileUpload } from '@tabler/icons-react'; // Pastikan Anda sudah menginstal @tabler/icons-react

export default function ImportButton({ url, className = '', children, ...props }) {
    return (
        <Link
            href={url}
            className={`px-4 py-2 text-sm border rounded-lg bg-green-500 text-white flex items-center gap-2 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 ${className}`}
            {...props}
        >
            <IconFileUpload size={18} strokeWidth={1.5} /> {children || <span className='hidden lg:flex'>Impor</span>}
        </Link>
    );
}
