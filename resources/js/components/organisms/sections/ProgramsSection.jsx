// resources/js/components/organisms/sections/ProgramsSection.jsx
import React from 'react';
import Heading from '@/components/atoms/Heading.jsx'; // New atom
import Paragraph from '@/components/atoms/Paragraph.jsx'; // New atom
import Image from '@/components/atoms/Image.jsx'; // New atom
import ProgramFeature from '@/components/molecules/stats/ProgramFeature.jsx'; // New molecule

export default function ProgramsSection() {
    return (
        <div className="site-section" id="programs-section">
            <div className="container">
                <div className="row mb-5 justify-content-center">
                    <div className="col-lg-7 text-center" data-aos="fade-up" data-aos-delay="">
                        <Heading level={2} className="section-title">Our Programs</Heading>
                        <Paragraph>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magnam repellat aut neque! Doloribus sunt non aut reiciendis, vel recusandae obcaecati hic dicta repudiandae in quas quibusdam ullam, illum sed veniam!</Paragraph>
                    </div>
                </div>

                {/* Program Row 1 */}
                <div className="row mb-5 align-items-center">
                    <div className="col-lg-7 mb-5" data-aos="fade-up" data-aos-delay="100">
                        <Image src="/oneschool/images/undraw_youtube_tutorial.svg" alt="Image" />
                    </div>
                    <div className="col-lg-4 ml-auto" data-aos="fade-up" data-aos-delay="200">
                        <Heading level={2} className="text-black mb-4">We Are Excellent In Education</Heading>
                        <Paragraph className="mb-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem maxime nam porro possimus fugiat quo molestiae illo.</Paragraph>
                        <ProgramFeature iconClass="icon icon-graduation-cap" title="22,931 Yearly Graduates" />
                        <ProgramFeature iconClass="icon icon-university" title="150 Universities Worldwide" />
                    </div>
                </div>

                {/* Program Row 2 */}
                <div className="row mb-5 align-items-center">
                    <div className="col-lg-7 mb-5 order-1 order-lg-2" data-aos="fade-up" data-aos-delay="100">
                        <Image src="/oneschool/images/undraw_teaching.svg" alt="Image" />
                    </div>
                    <div className="col-lg-4 mr-auto order-2 order-lg-1" data-aos="fade-up" data-aos-delay="200">
                        <Heading level={2} className="text-black mb-4">Strive for Excellent</Heading>
                        <Paragraph className="mb-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem maxime nam porro possimus fugiat quo molestiae illo.</Paragraph>
                        <ProgramFeature iconClass="icon icon-graduation-cap" title="22,931 Yearly Graduates" />
                        <ProgramFeature iconClass="icon icon-university" title="150 Universities Worldwide" />
                    </div>
                </div>

                {/* Program Row 3 */}
                <div className="row mb-5 align-items-center">
                    <div className="col-lg-7 mb-5" data-aos="fade-up" data-aos-delay="100">
                        <Image src="/oneschool/images/undraw_teacher.svg" alt="Image" />
                    </div>
                    <div className="col-lg-4 ml-auto" data-aos="fade-up" data-aos-delay="200">
                        <Heading level={2} className="text-black mb-4">Education is life</Heading>
                        <Paragraph className="mb-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem maxime nam porro possimus fugiat quo molestiae illo.</Paragraph>
                        <ProgramFeature iconClass="icon icon-graduation-cap" title="22,931 Yearly Graduates" />
                        <ProgramFeature iconClass="icon icon-university" title="150 Universities Worldwide" />
                    </div>
                </div>
            </div>
        </div>
    );
}