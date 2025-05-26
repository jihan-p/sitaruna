// resources/js/components/molecules/stats/CourseStat.jsx
import React from 'react';

export default function CourseStat({ iconClass, text, className = '' }) {
    return (
        <div className={`py-3 px-4 ${className}`}>
            <span className={iconClass}></span> {text}
        </div>
    );
}