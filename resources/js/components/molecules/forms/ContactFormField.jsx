// resources/js/components/molecules/forms/ContactFormField.jsx
import InputLabel from '@/components/atoms/InputLabel.jsx';
import InputError from '@/components/atoms/InputError.jsx';
import TextInput from '@/components/atoms/TextInput.jsx';
import Textarea from '@/components/atoms/Textarea.jsx'; // Jangan lupa impor ini

export default function ContactFormField({ id, label, type = 'text', name, value, onChange, error, isTextarea = false, ...props }) {
    return (
        <div className="form-group row">
            <div className={`col-md-12 ${type === 'firstName' || type === 'lastName' ? 'col-md-6 mb-3 mb-lg-0' : ''}`}>
                {/* InputLabel mungkin tidak dibutuhkan jika desain Anda tidak menampilkannya */}
                {/* <InputLabel htmlFor={id} value={label} /> */}

                {isTextarea ? (
                    <Textarea
                        id={id}
                        name={name}
                        value={value} // PASTIKAN value DITERUSKAN
                        onChange={onChange} // PASTIKAN onChange DITERUSKAN
                        className="form-control" // Sesuaikan dengan kelas CSS template
                        {...props}
                    />
                ) : (
                    <TextInput
                        id={id}
                        type={type}
                        name={name}
                        value={value} // PASTIKAN value DITERUSKAN
                        onChange={onChange} // PASTIKAN onChange DITERUSKAN
                        className="form-control" // Sesuaikan dengan kelas CSS template
                        {...props}
                    />
                )}

                {error && <InputError message={error} className="mt-2" />}
            </div>
        </div>
    );
}