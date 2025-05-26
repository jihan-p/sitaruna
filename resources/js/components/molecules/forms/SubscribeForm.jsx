// resources/js/components/molecules/forms/SubscribeForm.jsx
import React from 'react';
import TextInput from '@/components/atoms/TextInput.jsx'; // Assuming TextInput is already there
import Button from '@/components/atoms/Button.jsx'; // Assuming Button is already there

export default function SubscribeForm({ onSubmit, value, onChange }) {
    return (
        <form onSubmit={onSubmit} className="footer-subscribe">
            <div className="d-flex mb-5">
                <TextInput
                    type="text"
                    className="form-control rounded-0"
                    placeholder="Email"
                    value={value}
                    onChange={onChange}
                />
                <Button type="submit" className="btn btn-primary rounded-0">Subscribe</Button>
            </div>
        </form>
    );
}