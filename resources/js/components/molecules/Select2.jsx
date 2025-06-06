// resources/js/components/molecules/Select2.jsx
import React from 'react';
import Select, { components } from 'react-select'; // Impor components
import { IconCheck } from '@tabler/icons-react'; // Impor ikon ceklis

// Molekul Select2 yang membungkus react-select
// Props: options (array { value, label }), onChange, placeholder, defaultValue, isMulti, styles
export default function Select2({ options, onChange, placeholder, value, isMulti = false, styles, className, ...props }) { // Ambil 'value' juga dan teruskan ...props
     // Custom Styles (jika ada dan ingin dipertahankan)
     const customStyles = {
        control: (provided, state) => ({
            ...provided,
            borderColor: state.isFocused ? '#4CAF50' : '#ccc', // Warna border saat fokus
            boxShadow: state.isFocused ? '0 0 5px rgba(76, 175, 80, 0.5)' : 'none',
            outline: 'none', // Menghilangkan garis biru
            '&:hover': {
                borderColor: '#4CAF50', // Warna border saat hover
            },
            minHeight: '38px', 
            height: '38px',
        }),
        valueContainer: (provided) => ({ 
            ...provided,
            height: '38px',
            padding: '0 6px'
        }),
        input: (provided) => ({ 
            ...provided,
            margin: '0px',
        }),
        indicatorSeparator: () => ({ 
            display: 'none',
        }),
        indicatorsContainer: (provided) => ({ 
            ...provided,
            height: '38px',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#4CAF50' : state.isFocused ? '#e9f5e9' : 'white',
            color: state.isSelected ? 'white' : 'black',
            ':active': {
                ...provided[':active'],
                backgroundColor: !state.isDisabled && (state.isSelected ? '#45a049' : '#d0e9d0'),
            },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between', 
        }),
    };

    // Komponen Option kustom untuk menambahkan ikon ceklis jika single select
    const CustomOption = (optionProps) => { // Ubah nama parameter agar tidak konflik
        const { children, isSelected, isMulti: optionIsMulti } = optionProps; // Ambil isMulti dari props Option
        if (optionIsMulti) { 
            return <components.Option {...optionProps}>{children}</components.Option>;
        }
        return (
            <components.Option {...optionProps}>
                {children}
                {isSelected && <IconCheck size={16} className="ml-2" />} 
            </components.Option>
        );
    };

    return (
         // Menggunakan komponen Select dari react-select
        <Select
            options={options} // Data opsi { value, label }
            onChange={onChange} // Handler saat pilihan berubah
            className={`basic-multi-select ${className}`} // Class umum untuk styling, gabungkan dengan className dari props
            value={value} // Prop 'value' harus sesuai dengan format yang diharapkan react-select
            classNamePrefix="select" // Prefix class untuk styling Select2
            placeholder={placeholder || "Pilih opsi..."} // Placeholder
            isMulti={isMulti} // Mode multi-select
            styles={styles || customStyles} // Gunakan customStyles default atau dari props
            components={!isMulti ? { Option: CustomOption } : {}} // Gunakan Option kustom hanya untuk single select
            {...props} // Teruskan props lain seperti isDisabled, isClearable, dll.
        />
    );
}