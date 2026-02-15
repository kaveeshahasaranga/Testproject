import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import NotificationContext from '../context/NotificationContext'; // Import NotificationContext
import Card from '../components/ui/Card';
import axios from 'axios';
import { Calendar, Clock, User, CheckCircle } from 'lucide-react';

const AdminBookings = () => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext); // Use NotificationContext
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                // Using existing endpoint which should return all bookings for admin
                const res = await axios.get('/api/bookings', config);
                setBookings(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                showNotification('error', 'Failed to fetch bookings'); // Show notification
                setLoading(false);
            }
        };

        if (user) {
            fetchBookings();
        }
    }, [user, showNotification]);

    if (loading) return <div className="p-10 text-center">Loading bookings...</div>;

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold text-indigo-900 mb-2">All Bookings</h2>
            <p className="text-gray-600 mb-8">View all resource reservations made by students.</p>

            {bookings.length === 0 ? (
                <Card className="text-center py-10 text-gray-500">
                    <p>No bookings found.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.map((booking) => (
                        <Card key={booking._id} className="border-l-4 border-purple-500">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="font-bold text-indigo-900 text-lg">{booking.resource}</h4>
                                    <div className="flex items-center text-sm text-indigo-600 mt-1 bg-indigo-50 px-2 py-1 rounded-full w-max">
                                        <User size={14} className="mr-1" />
                                        {booking.student ? booking.student.name : 'Unknown Student'}
                                    </div>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full flex items-center ${booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                    }`}>
                                    <CheckCircle size={12} className="mr-1" /> {booking.status}
                                </span>
                            </div>

                            <div className="text-sm text-gray-600 space-y-2 mt-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center">
                                    <Calendar size={16} className="mr-2 text-gray-400" />
                                    <span className="font-medium">{booking.date}</span>
                                </div>
                                <div className="flex items-center">
                                    <Clock size={16} className="mr-2 text-gray-400" />
                                    <span className="font-medium">{booking.startTime} - {booking.endTime}</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminBookings;
