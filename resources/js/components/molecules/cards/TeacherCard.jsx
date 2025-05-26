// resources/js/components/molecules/cards/TeacherCard.jsx
import React from 'react';
import Image from '@/components/atoms/Image.jsx'; // New atom
import Heading from '@/components/atoms/Heading.jsx'; // New atom
import Paragraph from '@/components/atoms/Paragraph.jsx'; // New atom

export default function TeacherCard({ teacher }) {
    return (
        <div className="teacher text-center">
            <Image src={teacher.image} alt="Image" className="w-50 rounded-circle mx-auto mb-4" />
            <div className="py-2">
                <Heading level={3} className="text-black">{teacher.name}</Heading>
                <Paragraph className="position">{teacher.position}</Paragraph>
                <Paragraph>{teacher.bio}</Paragraph>
            </div>
        </div>
    );
}