import React from 'react';

const Input = ({ label, type = 'text', placeholder, value, onChange, name, error }) => {
    return (
        <div className="flex flex-col space-y-1 mb-4">
            {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`glass-input ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
            />
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
};

export default Input;
