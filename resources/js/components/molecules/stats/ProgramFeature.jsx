// resources/js/components/molecules/stats/ProgramFeature.jsx
import React from 'react';
import CustomIcon from '@/components/atoms/CustomIcon.jsx'; // New atom
import Heading from '@/components/atoms/Heading.jsx'; // New atom

export default function ProgramFeature({ iconClass, title }) {
    return (
        <div className="d-flex align-items-center custom-icon-wrap mb-3">
            <span className="custom-icon-inner mr-3"><span className={iconClass}></span></span>
            <div><Heading level={3} className="m-0">{title}</Heading></div>
        </div>
    );
}