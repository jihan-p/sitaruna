// resources/js/components/organisms/sections/TestimonySection.jsx
import React from 'react';
import Image from '@/components/atoms/Image.jsx'; // New atom
import Heading from '@/components/atoms/Heading.jsx'; // New atom

export default function TestimonySection({ testimonial }) {
    return (
        <div className="site-section bg-image overlay" style={{ backgroundImage: "url('/oneschool/images/hero_1.jpg')" }}>
            <div className="container">
                <div className="row justify-content-center align-items-center">
                    <div className="col-md-8 text-center testimony">
                        <Image src={testimonial.image} alt="Image" className="w-25 mb-4 rounded-circle" />
                        <Heading level={3} className="mb-4">{testimonial.name}</Heading>
                        <blockquote>
                            <p>&ldquo; {testimonial.quote} &rdquo;</p>
                        </blockquote>
                    </div>
                </div>
            </div>
        </div>
    );
}