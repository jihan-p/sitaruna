// resources/js/components/atoms/Heading.jsx
import React from 'react';

export default function Heading({ level = 2, className = '', children, ...props }) {
    let tagName; 

    
    if (typeof level === 'string' && ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(level.toLowerCase())) {
        tagName = level.toLowerCase();
    }
    
    else if (typeof level === 'number' && level >= 1 && level <= 6) {
        tagName = `h${level}`; 
    }
    
    else {
        console.warn(`Invalid heading level prop: "${level}". Defaulting to h2.`);
        tagName = 'h2';
    }

   
    const Tag = tagName;

    return (
        <Tag className={className} {...props}>
            {children}
        </Tag>
    );
}