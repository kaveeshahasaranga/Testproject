import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Bed, PenTool, Calendar, ShoppingCart, LogOut } from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900';
    };

    const navItems = [
        { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/rooms', name: 'My Room', icon: <Bed size={20} /> },
        { path: '/maintenance', name: 'Maintenance', icon: <PenTool size={20} /> },
        { path: '/booking', name: 'Book Resources', icon: <Calendar size={20} /> },
        { path: '/grocery', name: 'Grocery', icon: <ShoppingCart size={20} /> },
    ];

    return (
        <div className="h-full bg-white/80 backdrop-blur-md border-r border-gray-200 flex flex-col">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-indigo-900">HMS</h2>
            </div>

            <div className="flex-1 flex flex-col space-y-1 mt-4">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center space-x-3 px-6 py-3 transition-colors duration-200 ${isActive(item.path)}`}
                    >
                        {item.icon}
                        <span className="font-medium">{item.name}</span>
                    </Link>
                ))}
            </div>

            <div className="p-4 border-t border-gray-200">
                <button className="flex items-center space-x-3 text-red-500 hover:text-red-700 px-4 py-2 w-full transition-colors">
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
