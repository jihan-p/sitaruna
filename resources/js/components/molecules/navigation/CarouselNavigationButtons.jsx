// resources/js/components/molecules/navigation/CarouselNavigationButtons.jsx
import React from 'react';
import Button from '@/components/atoms/Button.jsx'; // Assuming Button is already there

export default function CarouselNavigationButtons({ onPrev, onNext }) {
    return (
        <div className="row justify-content-center">
            <div className="col-7 text-center">
                <Button onClick={onPrev} className="customPrevBtn btn btn-primary m-1">Prev</Button>
                <Button onClick={onNext} className="customNextBtn btn btn-primary m-1">Next</Button>
            </div>
        </div>
    );
}