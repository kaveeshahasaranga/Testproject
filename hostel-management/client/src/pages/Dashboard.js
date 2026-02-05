import React from 'react';
import Card from '../components/ui/Card';
import { Users, AlertCircle, Calendar, ShoppingBag } from 'lucide-react';

const Dashboard = () => {
    // Mock Data
    const stats = [
        { label: 'Roommates', value: '2', icon: <Users size={24} />, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Pending Requests', value: '1', icon: <AlertCircle size={24} />, color: 'text-orange-600', bg: 'bg-orange-100' },
        { label: 'Active Bookings', value: '3', icon: <Calendar size={24} />, color: 'text-purple-600', bg: 'bg-purple-100' },
        { label: 'Grocery Orders', value: '0', icon: <ShoppingBag size={24} />, color: 'text-green-600', bg: 'bg-green-100' },
    ];

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-indigo-900">Dashboard</h2>
                <p className="text-gray-600">Welcome back, here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <Card key={index} className="flex items-center space-x-4">
                        <div className={`p-4 rounded-full ${stat.bg} ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Notices</h3>
                    <div className="space-y-4">
                        <div className="p-3 bg-white/50 rounded-lg border border-gray-100">
                            <p className="font-semibold text-indigo-800">Water Cut Notice</p>
                            <p className="text-sm text-gray-600">Water supply will be interrupted tomorrow from 10 AM to 2 PM.</p>
                            <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                        </div>
                        <div className="p-3 bg-white/50 rounded-lg border border-gray-100">
                            <p className="font-semibold text-indigo-800">Exam Week Silence</p>
                            <p className="text-sm text-gray-600">Please maintain silence in corridors during exam week.</p>
                            <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-indigo-700 font-medium transition-colors text-center">
                            New Maintenance Request
                        </button>
                        <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-700 font-medium transition-colors text-center">
                            Book Washing Machine
                        </button>
                        <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-green-700 font-medium transition-colors text-center">
                            Order Groceries
                        </button>
                        <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-orange-700 font-medium transition-colors text-center">
                            View Room Info
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
