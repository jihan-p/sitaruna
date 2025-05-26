// resources/js/components/molecules/forms/SignupForm.jsx
import React from 'react';
import TextInput from '@/components/atoms/TextInput.jsx'; // Assuming TextInput is already there
import Button from '@/components/atoms/Button.jsx'; // Assuming Button is already there
import InputError from '@/components/atoms/InputError.jsx'; // Assuming InputError is already there

export default function SignupForm({ onSubmit, data, handleChange, errors }) {
    return (
        <form onSubmit={onSubmit} className="form-box">
            <h3 className="h4 text-black mb-4">Sign Up</h3>
            <div className="form-group">
                <TextInput
                    type="text"
                    className="form-control"
                    placeholder="Email Addresss"
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                />
                <InputError message={errors.email} className="mt-2" />
            </div>
            <div className="form-group">
                <TextInput
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                />
                <InputError message={errors.password} className="mt-2" />
            </div>
            <div className="form-group mb-4">
                <TextInput
                    type="password"
                    className="form-control"
                    placeholder="Re-type Password"
                    name="password_confirmation"
                    value={data.password_confirmation}
                    onChange={handleChange}
                />
                <InputError message={errors.password_confirmation} className="mt-2" />
            </div>
            <div className="form-group">
                <Button type="submit" className="btn btn-primary btn-pill">Sign up</Button>
            </div>
        </form>
    );
}