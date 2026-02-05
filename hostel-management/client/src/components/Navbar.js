import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="glass-card m-4 px-6 py-3 flex justify-between items-center sticky top-4 z-20">
            <h1 className="text-2xl font-bold text-indigo-800 tracking-tight">HostelHub</h1>

            <div className="flex items-center space-x-4">
                <span className="text-gray-600 font-medium hidden md:block">Welcome, Student</span>
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200">
                    <span className="text-indigo-700 font-bold">JD</span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
