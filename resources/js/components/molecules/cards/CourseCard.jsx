// resources/js/components/molecules/cards/CourseCard.jsx
import React from 'react';
import Image from '@/components/atoms/Image.jsx'; // New atom
import PriceTag from '@/components/atoms/PriceTag.jsx'; // New atom
import Heading from '@/components/atoms/Heading.jsx'; // New atom
import Paragraph from '@/components/atoms/Paragraph.jsx'; // New atom

export default function CourseCard({ course }) {
    return (
        <div className="course bg-white h-100 align-self-stretch">
            <figure className="m-0">
                <a href={course.link}><Image src={course.image} alt="Image" className="img-fluid" /></a>
            </figure>
            <div className="course-inner-text py-4 px-4">
                <PriceTag price={course.price} />
                <div className="meta"><span className="icon-clock-o"></span>{course.duration}</div>
                <Heading level={3}><a href={course.link}>{course.title}</a></Heading>
                <Paragraph>{course.description}</Paragraph>
            </div>
            <div className="d-flex border-top stats">
                <div className="py-3 px-4"><span className="icon-users"></span> {course.students} students</div>
                <div className="py-3 px-4 w-25 ml-auto border-left"><span className="icon-chat"></span> {course.comments}</div>
            </div>
        </div>
    );
}