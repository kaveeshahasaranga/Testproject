import React from 'react';

const Button = ({ children, onClick, type = 'button', className = '', variant = 'primary' }) => {
    const variants = {
        primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
        secondary: 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200',
        danger: 'bg-red-500 hover:bg-red-600 text-white',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            className={`px-4 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 active:scale-95 ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;
