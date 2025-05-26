// resources/js/components/organisms/sections/IntroSection.jsx
import React from 'react';
import SignupForm from '@/components/molecules/forms/SignupForm.jsx'; // New molecule
import Heading from '@/components/atoms/Heading.jsx'; // New atom
import Paragraph from '@/components/atoms/Paragraph.jsx'; // New atom
import Button from '@/components/atoms/Button.jsx'; // Reusing existing Button

export default function IntroSection({ auth, signupFormData, handleSignupFormChange, signupFormErrors, handleSignupSubmit }) {
    return (
        <div className="intro-section" id="home-section">
            <div className="slide-1" style={{ backgroundImage: "url('/oneschool/images/hero_1.jpg')" }} data-stellar-background-ratio="0.5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-12">
                            <div className="row align-items-center">
                                <div className="col-lg-6 mb-4">
                                    <Heading level={1} data-aos="fade-up" data-aos-delay="100">Learn From The Expert</Heading>
                                    <Paragraph className="mb-4" data-aos="fade-up" data-aos-delay="200">Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime ipsa nulla sed quis rerum amet natus quas necessitatibus.</Paragraph>
                                    <Paragraph data-aos="fade-up" data-aos-delay="300"><Button className="btn btn-primary py-3 px-5 btn-pill">Admission Now</Button></Paragraph>
                                </div>
                                <div className="col-lg-5 ml-auto" data-aos="fade-up" data-aos-delay="500">
                                    <SignupForm
                                        onSubmit={handleSignupSubmit}
                                        data={signupFormData}
                                        handleChange={handleSignupFormChange}
                                        errors={signupFormErrors}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}