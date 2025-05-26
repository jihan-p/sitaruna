// resources/js/components/organisms/sections/TeachersSection.jsx
import React from 'react';
import TeacherCard from '@/components/molecules/cards/TeacherCard.jsx'; // New molecule
import Heading from '@/components/atoms/Heading.jsx'; // New atom
import Paragraph from '@/components/atoms/Paragraph.jsx'; // New atom

export default function TeachersSection({ teachers }) {
    return (
        <div className="site-section" id="teachers-section">
            <div className="container">
                <div className="row mb-5 justify-content-center">
                    <div className="col-lg-7 mb-5 text-center" data-aos="fade-up" data-aos-delay="">
                        <Heading level={2} className="section-title">Our Teachers</Heading>
                        <Paragraph className="mb-5">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magnam repellat aut neque! Doloribus sunt non aut reiciendis, vel recusandae obcaecati hic dicta repudiandae in quas quibusdam ullam, illum sed veniam!</Paragraph>
                    </div>
                </div>
                <div className="row">
                    {teachers.map((teacher, index) => (
                        <div key={index} className="col-md-6 col-lg-4 mb-4" data-aos="fade-up" data-aos-delay={100 + index * 100}>
                            <TeacherCard teacher={teacher} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}