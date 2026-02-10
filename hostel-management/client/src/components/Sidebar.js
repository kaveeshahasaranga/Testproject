import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { LayoutDashboard, Bed, PenTool, Calendar, ShoppingCart, LogOut } from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => {
        return location.pathname === path ? 'bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900';
    };

    const studentNavItems = [
        { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/rooms', name: 'My Room', icon: <Bed size={20} /> },
        { path: '/maintenance', name: 'Maintenance', icon: <PenTool size={20} /> },
        { path: '/booking', name: 'Book Resources', icon: <Calendar size={20} /> },
        { path: '/grocery', name: 'Grocery', icon: <ShoppingCart size={20} /> },
    ];

    const adminNavItems = [
        { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/rooms', name: 'Manage Rooms', icon: <Bed size={20} /> },
        { path: '/maintenance', name: 'Maintenance', icon: <PenTool size={20} /> },
        { path: '/grocery', name: 'Grocery Orders', icon: <ShoppingCart size={20} /> },
    ];

    const navItems = (user?.role === 'admin' || user?.role === 'warden') ? adminNavItems : studentNavItems;

    const onLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="h-full bg-white/80 backdrop-blur-md border-r border-gray-200 flex flex-col">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-indigo-900">HMS</h2>
                <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">
                    {user?.role === 'admin' ? 'Administrator' : user?.role === 'warden' ? 'Warden' : 'Student Panel'}
                </div>
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
                <button
                    onClick={onLogout}
                    className="flex items-center space-x-3 text-red-500 hover:text-red-700 px-4 py-2 w-full transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
