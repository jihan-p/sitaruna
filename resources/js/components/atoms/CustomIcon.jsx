// resources/js/components/atoms/CustomIcon.jsx
import React from 'react';

export default function CustomIcon({ iconClass, className = '' }) {
    return <span className={`custom-icon-inner ${className}`}><span className={iconClass}></span></span>;
}