// resources/js/components/molecules/DashboardCards/StatCard.jsx
import React from 'react';

const StatCard = ({ title, value, icon, color = 'bg-blue-500' }) => {
    const IconComponent = icon; // Asumsi icon adalah komponen React (misal dari Tabler Icons)
    return (
        <div className={`shadow-lg rounded-lg p-6 text-white ${color}`}>
            <div className="flex items-center">
                <div className="p-3 bg-black bg-opacity-20 rounded-full">
                    {IconComponent && <IconComponent size={32} strokeWidth={1.5} />}
                </div>
                <div className="ml-4">
                    <p className="text-lg font-semibold">{title}</p>
                    <p className="text-3xl font-bold">{value !== null && typeof value !== 'undefined' ? value : '-'}</p>
                </div>
            </div>
        </div>
    );
};

export default StatCard;
