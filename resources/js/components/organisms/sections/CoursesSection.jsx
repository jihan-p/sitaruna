// resources/js/components/organisms/sections/CoursesSection.jsx
import React, { useEffect } from 'react';
import CourseCard from '@/components/molecules/cards/CourseCard.jsx'; // New molecule
import CarouselNavigationButtons from '@/components/molecules/navigation/CarouselNavigationButtons.jsx'; // New molecule
import Heading from '@/components/atoms/Heading.jsx'; // New atom

export default function CoursesSection({ courses }) {
    useEffect(() => {
        if (typeof window !== 'undefined' && window.$ && window.$.fn && window.$.fn.owlCarousel) {
            const $ = window.$;
            const carousel = $('.owl-carousel.nonloop-block-14');

            if (carousel.length > 0) {
                carousel.owlCarousel({
                    center: false,
                    items: 1,
                    loop: true,
                    stagePadding: 0,
                    margin: 20,
                    smartSpeed: 1000,
                    autoplay: true,
                    nav: false,
                    dots: true,
                    responsive: {
                        600: { margin: 20, nav: false, dots: true, items: 2 },
                        1000: { margin: 20, stagePadding: 0, nav: false, dots: true, items: 3 }
                    }
                });

                $('.customPrevBtn').click(function() {
                    carousel.trigger('prev.owl.carousel');
                });

                $('.customNextBtn').click(function() {
                    carousel.trigger('next.owl.carousel');
                });

                // Cleanup function for Owl Carousel
                return () => {
                    if (carousel.data('owl.carousel')) { // Check if carousel is initialized
                        carousel.owlCarousel('destroy');
                    }
                };
            }
        } else {
            console.warn('jQuery or Owl Carousel not found. Carousel will not initialize.');
        }
    }, []);

    return (
        <div className="site-section courses-title" id="courses-section">
            <div className="container">
                <div className="row mb-5 justify-content-center">
                    <div className="col-lg-7 text-center" data-aos="fade-up" data-aos-delay="">
                        <Heading level={2} className="section-title">Courses</Heading>
                    </div>
                </div>
            </div>
            <div className="site-section courses-entry-wrap" data-aos="fade-up" data-aos-delay="100">
                <div className="container">
                    <div className="row">
                        <div className="owl-carousel col-12 nonloop-block-14">
                            {courses.map((course, index) => (
                                <CourseCard key={index} course={course} />
                            ))}
                        </div>
                    </div>
                    <CarouselNavigationButtons onPrev={() => {}} onNext={() => {}} />
                </div>
            </div>
        </div>
    );
}