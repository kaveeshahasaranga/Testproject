import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import NotificationContext from '../context/NotificationContext'; // Import NotificationContext
import axios from 'axios';
import Card from '../components/ui/Card';
import {
    Users,
    Home, // Added for Admin Occupancy Rate
    Wrench, // Added for Admin Maintenance Pending
    ShoppingBag,
    Trash2, // Added for Delete Notice
    Plus, // Added for Add Notice button
    X // Added for Cancel Add Notice button
} from 'lucide-react';
import Button from '../components/ui/Button'; // Import Button
import Input from '../components/ui/Input'; // Import Input

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext); // Use NotificationContext
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        roommates: 0,
        pendingRequests: 0,
        activeBookings: 0,
        totalOrders: 0,
        totalStudents: 0,
        occupancyRate: 0,
        adminPendingMaintenance: 0,
        adminPendingGrocery: 0
    });
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);

    // Notice State
    const [showNoticeForm, setShowNoticeForm] = useState(false);
    const [newNotice, setNewNotice] = useState({ title: '', content: '' });

    const isAdmin = user?.role === 'admin' || user?.role === 'warden';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                // Fetch Notices (Available to all)
                const noticesRes = await axios.get('/api/notices', config);
                setNotices(noticesRes.data);

                if (isAdmin) {
                    // Fetch Admin specific stats
                    const [usersRes, roomsRes, maintRes, groceryRes] = await Promise.all([
                        axios.get('/api/auth/users', config),
                        axios.get('/api/rooms', config),
                        axios.get('/api/maintenance', config),
                        axios.get('/api/grocery', config)
                    ]);

                    const students = usersRes.data.filter(u => u.role === 'student');
                    const totalCapacity = roomsRes.data.reduce((acc, room) => acc + room.capacity, 0);
                    const totalOccupants = roomsRes.data.reduce((acc, room) => acc + room.occupants.length, 0);

                    setStats({
                        totalStudents: students.length,
                        occupancyRate: totalCapacity > 0 ? Math.round((totalOccupants / totalCapacity) * 100) : 0,
                        adminPendingMaintenance: maintRes.data.filter(r => r.status === 'Pending').length,
                        adminPendingGrocery: groceryRes.data.filter(o => o.status === 'Pending').length
                    });

                } else {
                    // Fetch Student specific stats
                    const [roomRes, groceryRes, bookingsRes] = await Promise.all([
                        axios.get('/api/auth/me', config),
                        axios.get('/api/grocery', config),
                        axios.get('/api/bookings?my=true', config)
                    ]);

                    const myRoom = roomRes.data.room;
                    // Count roommates (excluding self)
                    const roommateCount = myRoom && myRoom.occupants ? myRoom.occupants.filter(id => id !== user._id).length : 0;

                    // Count pending grocery/maintenance (assuming grocery logic matches)
                    const myGrocery = groceryRes.data.filter(item => item.status === 'Pending');

                    // Future bookings
                    const futureBookings = bookingsRes.data.filter(b => b.status === 'Booked'); // Simple check, ideally compare dates

                    setStats({
                        roommates: roommateCount,
                        pendingRequests: myGrocery.length,
                        activeBookings: futureBookings.length,
                        totalOrders: groceryRes.data.length
                    });
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user, isAdmin]); // Re-run if user or role changes

    const handleAddNotice = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.post('/api/notices', newNotice, config);

            showNotification('success', 'Notice posted successfully');
            setNewNotice({ title: '', content: '' });
            setShowNoticeForm(false);

            // Refresh notices
            const res = await axios.get('/api/notices', config);
            setNotices(res.data);
        } catch (err) {
            showNotification('error', err.response?.data?.message || 'Failed to post notice');
        }
    };

    const handleDeleteNotice = async (id) => {
        if (!window.confirm('Are you sure you want to delete this notice?')) return;

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.delete(`/api/notices/${id}`, config);
            showNotification('success', 'Notice deleted successfully');

            // Refresh notices
            const res = await axios.get('/api/notices', config);
            setNotices(res.data);
        } catch (err) {
            showNotification('error', err.response?.data?.message || 'Failed to delete notice');
        }
    };

    if (loading) return <div className="p-10 text-center">Loading dashboard...</div>;

    return (
        <div className="p-8">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-indigo-900">Dashboard</h2>
                <p className="text-gray-600">Welcome back, {user?.name}! Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {isAdmin ? (
                    // Admin Stats
                    <>
                        <Card className="flex items-center p-6 bg-blue-50 border-l-4 border-blue-500">
                            <div className="p-3 bg-blue-100 rounded-full text-blue-600 mr-4">
                                <Users size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Students</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.totalStudents}</p>
                            </div>
                        </Card>
                        <Card className="flex items-center p-6 bg-purple-50 border-l-4 border-purple-500">
                            <div className="p-3 bg-purple-100 rounded-full text-purple-600 mr-4">
                                <Home size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Occupancy Rate</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.occupancyRate}%</p>
                            </div>
                        </Card>
                        <Card className="flex items-center p-6 bg-red-50 border-l-4 border-red-500">
                            <div className="p-3 bg-red-100 rounded-full text-red-600 mr-4">
                                <Wrench size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Maintenance Pending</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.adminPendingMaintenance}</p>
                            </div>
                        </Card>
                        <Card className="flex items-center p-6 bg-orange-50 border-l-4 border-orange-500">
                            <div className="p-3 bg-orange-100 rounded-full text-orange-600 mr-4">
                                <ShoppingBag size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Grocery Pending</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.adminPendingGrocery}</p>
                            </div>
                        </Card>
                    </>
                ) : (
                    // Student Stats
                    <>
                        <Card className="flex items-center p-6">
                            <div className="p-3 bg-indigo-100 rounded-full text-indigo-600 mr-4">
                                <Users size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Roommates</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.roommates}</p>
                            </div>
                        </Card>
                        <Card className="flex items-center p-6">
                            <div className="p-3 bg-yellow-100 rounded-full text-yellow-600 mr-4">
                                <ShoppingBag size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Pending Requests</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.pendingRequests}</p>
                            </div>
                        </Card>
                        <Card className="flex items-center p-6">
                            <div className="p-3 bg-green-100 rounded-full text-green-600 mr-4">
                                <Home size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Active Bookings</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.activeBookings}</p>
                            </div>
                        </Card>
                        <Card className="flex items-center p-6">
                            <div className="p-3 bg-purple-100 rounded-full text-purple-600 mr-4">
                                <ShoppingBag size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Orders</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.totalOrders}</p>
                            </div>
                        </Card>
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800">Recent Notices</h3>
                        {isAdmin && (
                            <button
                                onClick={() => setShowNoticeForm(!showNoticeForm)}
                                className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full flex items-center hover:bg-indigo-200"
                            >
                                {showNoticeForm ? <X size={16} className="mr-1" /> : <Plus size={16} className="mr-1" />}
                                {showNoticeForm ? 'Cancel' : 'Add Notice'}
                            </button>
                        )}
                    </div>

                    {showNoticeForm && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <h4 className="font-semibold text-gray-700 mb-2">Post New Notice</h4>
                            <form onSubmit={handleAddNotice}>
                                <Input
                                    placeholder="Title"
                                    value={newNotice.title}
                                    onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                                    required
                                />
                                <div className="mb-4">
                                    <textarea
                                        className="glass-input w-full p-2 h-24"
                                        placeholder="Content..."
                                        value={newNotice.content}
                                        onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                                        required
                                    ></textarea>
                                </div>
                                <Button type="submit" size="sm">Post Notice</Button>
                            </form>
                        </div>
                    )}

                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                        {notices.length === 0 ? (
                            <p className="text-gray-500 italic text-center py-4">No notices available.</p>
                        ) : (
                            notices.map((notice) => (
                                <div key={notice._id} className="p-3 bg-white/50 rounded-lg border border-gray-100 relative group">
                                    <div className="flex justify-between items-start">
                                        <p className="font-semibold text-indigo-800">{notice.title}</p>
                                        {isAdmin && (
                                            <button
                                                onClick={() => handleDeleteNotice(notice._id)}
                                                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Delete Notice"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{notice.content}</p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        {new Date(notice.date).toLocaleDateString()}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                <Card>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {isAdmin ? (
                            <>
                                <button
                                    onClick={() => navigate('/maintenance')}
                                    className="p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-indigo-700 font-medium transition-colors text-center"
                                >
                                    Manage Maintenance
                                </button>
                                <button
                                    onClick={() => navigate('/grocery')}
                                    className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-orange-700 font-medium transition-colors text-center"
                                >
                                    Manage Grocery
                                </button>
                                <button
                                    onClick={() => navigate('/rooms')}
                                    className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-green-700 font-medium transition-colors text-center"
                                >
                                    Manage Rooms
                                </button>
                                <button
                                    onClick={() => navigate('/admin/bookings')}
                                    className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-700 font-medium transition-colors text-center"
                                >
                                    View Bookings
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate('/maintenance')}
                                    className="p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-indigo-700 font-medium transition-colors text-center"
                                >
                                    New Maintenance Request
                                </button>
                                <button
                                    onClick={() => navigate('/booking')}
                                    className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-700 font-medium transition-colors text-center"
                                >
                                    Book Washing Machine
                                </button>
                                <button
                                    onClick={() => navigate('/grocery')}
                                    className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-green-700 font-medium transition-colors text-center"
                                >
                                    Order Groceries
                                </button>
                                <button
                                    onClick={() => navigate('/rooms')}
                                    className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-orange-700 font-medium transition-colors text-center"
                                >
                                    View Room Info
                                </button>
                            </>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
