// resources/js/pages/Landing/Welcome.jsx
import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import PublicLayout from '@/templates/PublicLayout.jsx'; // New template
import IntroSection from '@/components/organisms/sections/IntroSection.jsx'; // New organism
import CoursesSection from '@/components/organisms/sections/CoursesSection.jsx'; // New organism
import ProgramsSection from '@/components/organisms/sections/ProgramsSection.jsx'; // New organism
import TeachersSection from '@/components/organisms/sections/TeachersSection.jsx'; // New organism
import TestimonySection from '@/components/organisms/sections/TestimonySection.jsx'; // New organism
import WhyChooseUsSection from '@/components/organisms/sections/WhyChooseUsSection.jsx'; // New organism
import ContactSection from '@/components/organisms/sections/ContactSection.jsx'; // New organism

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    // Dummy Data (replace with actual data fetched from Laravel backend)
    const coursesData = [
        { id: 1, title: 'Study Law of Physics', price: '$20', duration: '4 Lessons / 12 week', students: '2,193', comments: 2, image: '/oneschool/images/img_1.jpg', link: 'course-single.html' },
        { id: 2, title: 'Logo Design Course', price: '$99', duration: '4 Lessons / 12 week', students: '2,193', comments: 2, image: '/oneschool/images/img_2.jpg', link: 'course-single.html' },
        { id: 3, title: 'JS Programming Language', price: '$99', duration: '4 Lessons / 12 week', students: '2,193', comments: 2, image: '/oneschool/images/img_3.jpg', link: 'course-single.html' },
        { id: 4, title: 'Study Law of Physics', price: '$20', duration: '4 Lessons / 12 week', students: '2,193', comments: 2, image: '/oneschool/images/img_4.jpg', link: 'course-single.html' },
        { id: 5, title: 'Logo Design Course', price: '$99', duration: '4 Lessons / 12 week', students: '2,193', comments: 2, image: '/oneschool/images/img_5.jpg', link: 'course-single.html' },
        { id: 6, title: 'JS Programming Language', price: '$99', duration: '4 Lessons / 12 week', students: '2,193', comments: 2, image: '/oneschool/images/img_6.jpg', link: 'course-single.html' },
    ];

    const teachersData = [
        { id: 1, name: 'Benjamin Stone', position: 'Physics Teacher', bio: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Porro eius suscipit delectus enim iusto tempora, adipisci at provident.', image: '/oneschool/images/person_1.jpg' },
        { id: 2, name: 'Katleen Stone', position: 'Physics Teacher', bio: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Porro eius suscipit delectus enim iusto tempora, adipisci at provident.', image: '/oneschool/images/person_2.jpg' },
        { id: 3, name: 'Sadie White', position: 'Physics Teacher', bio: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Porro eius suscipit delectus enim iusto tempora, adipisci at provident.', image: '/oneschool/images/person_3.jpg' },
    ];

    const testimonialData = {
        name: 'Jerome Jensen',
        quote: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum rem soluta sit eius necessitatibus voluptate excepturi beatae ad eveniet sapiente impedit quae modi quo provident odit molestias! Rem reprehenderit assumenda',
        image: '/oneschool/images/person_4.jpg'
    };

    // Form Handling for Signup Form (in IntroSection)
    const { data: signupFormData, setData: setSignupFormData, post: postSignupForm, errors: signupFormErrors, reset: resetSignupForm } = useForm({
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleSignupFormChange = (e) => {
        setSignupFormData(e.target.name, e.target.value);
    };

    const handleSignupSubmit = (e) => {
        e.preventDefault();
        console.log('Signup form submitted:', signupFormData);
        // Replace with actual Inertia post request, e.g.:
        // postSignupForm(route('register'), {
        //     onSuccess: () => resetSignupForm('password', 'password_confirmation'),
        // });
        alert('Signup form submitted (dummy)! Check console.');
    };

    // Form Handling for Contact Form (in ContactSection)
    const { data: contactFormData, setData: setContactFormData, post: postContactForm, errors: contactFormErrors, reset: resetContactForm } = useForm({
        firstName: '',
        lastName: '',
        subject: '',
        email: '',
        message: '',
    });

    const handleContactFormChange = (e) => {
        setContactFormData(e.target.name, e.target.value);
    };

    const handleContactSubmit = (e) => {
        e.preventDefault();
        console.log('Contact form submitted:', contactFormData);
        // Replace with actual Inertia post request, e.g.:
        // postContactForm(route('contact.submit'), {
        //     onSuccess: () => resetContactForm(),
        // });
        alert('Contact form submitted (dummy)! Check console.');
    };

    return (
        <PublicLayout auth={auth}>
            <IntroSection
                auth={auth}
                signupFormData={signupFormData}
                handleSignupFormChange={handleSignupFormChange}
                signupFormErrors={signupFormErrors}
                handleSignupSubmit={handleSignupSubmit}
            />
            <CoursesSection courses={coursesData} />
            <ProgramsSection />
            <TeachersSection teachers={teachersData} />
            <TestimonySection testimonial={testimonialData} />
            <WhyChooseUsSection />
            <ContactSection
                contactFormData={contactFormData}
                handleContactFormChange={handleContactFormChange}
                contactFormErrors={contactFormErrors}
                handleContactSubmit={handleContactSubmit}
            />
        </PublicLayout>
    );
}