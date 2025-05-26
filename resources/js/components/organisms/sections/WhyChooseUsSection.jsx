// resources/js/components/organisms/sections/WhyChooseUsSection.jsx
import React from 'react';
import Heading from '@/components/atoms/Heading.jsx'; // New atom
import Image from '@/components/atoms/Image.jsx'; // New atom
import ProgramFeature from '@/components/molecules/stats/ProgramFeature.jsx'; // Reusing molecule

export default function WhyChooseUsSection() {
    return (
        <div className="site-section pb-0">
            <div className="future-blobs">
                <div className="blob_2"><Image src="/oneschool/images/blob_2.svg" alt="Blob Image" /></div>
                <div className="blob_1"><Image src="/oneschool/images/blob_1.svg" alt="Blob Image" /></div>
            </div>
            <div className="container">
                <div className="row mb-5 justify-content-center" data-aos="fade-up" data-aos-delay="">
                    <div className="col-lg-7 text-center">
                        <Heading level={2} className="section-title">Why Choose Us</Heading>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4 ml-auto align-self-start" data-aos="fade-up" data-aos-delay="100">
                        <div className="p-4 rounded bg-white why-choose-us-box">
                            <ProgramFeature iconClass="icon icon-graduation-cap" title="22,931 Yearly Graduates" />
                            <ProgramFeature iconClass="icon icon-university" title="150 Universities Worldwide" />
                            <ProgramFeature iconClass="icon icon-graduation-cap" title="Top Professionals in The World" />
                            <ProgramFeature iconClass="icon icon-university" title="Expand Your Knowledge" />
                            <ProgramFeature iconClass="icon icon-graduation-cap" title="Best Online Teaching Assistant Courses" />
                            <ProgramFeature iconClass="icon icon-university" title="Best Teachers" />
                        </div>
                    </div>
                    <div className="col-lg-7 align-self-end" data-aos="fade-left" data-aos-delay="200">
                        <Image src="/oneschool/images/person_transparent.png" alt="Image" className="img-fluid" />
                    </div>
                </div>
            </div>
        </div>
    );
}