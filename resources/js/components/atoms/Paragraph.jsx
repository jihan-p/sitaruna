// resources/js/components/atoms/Paragraph.jsx
import React from 'react';

export default function Paragraph({ children, className = '', ...props }) {
    return <p className={className} {...props}>{children}</p>;
}