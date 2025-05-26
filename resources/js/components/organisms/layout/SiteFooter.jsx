// resources/js/components/organisms/layout/SiteFooter.jsx
import React from 'react';
import { Link } from '@inertiajs/react';
import SubscribeForm from '@/components/molecules/forms/SubscribeForm.jsx'; // New molecule
import Heading from '@/components/atoms/Heading.jsx'; // New atom
import Paragraph from '@/components/atoms/Paragraph.jsx'; // New atom

export default function SiteFooter() {
    const [subscribeEmail, setSubscribeEmail] = React.useState('');

    const handleSubscribeChange = (e) => {
        setSubscribeEmail(e.target.value);
    };

    const handleSubscribeSubmit = (e) => {
        e.preventDefault();
        console.log('Subscribe with:', subscribeEmail);
        // Implement actual subscription logic here
    };

    return (
        <footer className="footer-section bg-white">
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <Heading level={3}>About OneSchool</Heading>
                        <Paragraph>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Porro consectetur ut hic ipsum et veritatis corrupti. Itaque eius soluta optio dolorum temporibus in, atque, quos fugit sunt sit quaerat dicta.</Paragraph>
                    </div>
                    <div className="col-md-3 ml-auto">
                        <Heading level={3}>Links</Heading>
                        <ul className="list-unstyled footer-links">
                            <li><Link href="/">Home</Link></li>
                            <li><Link href="#courses-section">Courses</Link></li>
                            <li><Link href="#programs-section">Programs</Link></li>
                            <li><Link href="#teachers-section">Teachers</Link></li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <Heading level={3}>Subscribe</Heading>
                        <Paragraph>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt incidunt iure iusto architecto? Numquam, natus?</Paragraph>
                        <SubscribeForm
                            onSubmit={handleSubscribeSubmit}
                            value={subscribeEmail}
                            onChange={handleSubscribeChange}
                        />
                    </div>
                </div>
                <div className="row pt-5 mt-5 text-center">
                    <div className="col-md-12">
                        <div className="border-top pt-5">
                            <Paragraph>
                                Copyright &copy;{new Date().getFullYear()} All rights reserved | This template is made with <i className="icon-heart" aria-hidden="true"></i> by <a href="https://colorlib.com" target="_blank" >Colorlib</a>
                                <br/>
                                Adapted and developed by <a href="https://t.me/jhanplv" target="_blank" >jipi</a> @RPL SMKN 2 Subang
                            </Paragraph>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}