// resources/js/components/organisms/sections/ContactSection.jsx
import React from 'react';
import ContactFormField from '@/components/molecules/forms/ContactFormField.jsx';
import Button from '@/components/atoms/Button.jsx';
import Heading from '@/components/atoms/Heading.jsx';
import Paragraph from '@/components/atoms/Paragraph.jsx';

export default function ContactSection({ contactFormData, handleContactFormChange, contactFormErrors, handleContactSubmit }) {
    return (
        <div className="site-section bg-light" id="contact-section">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-7">
                        <Heading level={2} className="section-title mb-3">Message Us</Heading>
                        <Paragraph className="mb-5">Natus totam voluptatibus animi aspernatur ducimus quas obcaecati mollitia quibusdam temporibus culpa dolore molestias blanditiis consequuntur sunt nisi.</Paragraph>

                        <form onSubmit={handleContactSubmit} data-aos="fade">
                            <div className="form-group row">
                                <div className="col-md-6 mb-3 mb-lg-0">
                                    <ContactFormField
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        placeholder="First name"
                                        value={contactFormData.firstName}
                                        onChange={handleContactFormChange}
                                        error={contactFormErrors.firstName}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <ContactFormField
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        placeholder="Last name"
                                        value={contactFormData.lastName}
                                        onChange={handleContactFormChange}
                                        error={contactFormErrors.lastName}
                                    />
                                </div>
                            </div>

                            <ContactFormField
                                id="subject"
                                name="subject"
                                type="text"
                                placeholder="Subject"
                                value={contactFormData.subject}
                                onChange={handleContactFormChange}
                                error={contactFormErrors.subject}
                            />

                            <ContactFormField
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Email"
                                value={contactFormData.email}
                                onChange={handleContactFormChange}
                                error={contactFormErrors.email}
                            />

                            <ContactFormField
                                id="message"
                                name="message"
                                placeholder="Write your message here."
                                value={contactFormData.message}
                                onChange={handleContactFormChange}
                                error={contactFormErrors.message}
                                isTextarea={true} // Memberi tahu komponen untuk merender Textarea
                                rows="10"
                                cols="30"
                            />

                            <div className="form-group row">
                                <div className="col-md-6">
                                    <Button type="submit" className="btn btn-primary py-3 px-5 btn-block btn-pill">Send Message</Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}