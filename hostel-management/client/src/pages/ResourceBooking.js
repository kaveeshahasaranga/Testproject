import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import axios from 'axios';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

const ResourceBooking = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [formData, setFormData] = useState({
        resource: 'Washing Machine',
        date: '',
        startTime: '',
        endTime: ''
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null);

    const resources = ['Washing Machine', 'Study Room', 'TV Room', 'Ironing', 'Other'];

    useEffect(() => {
        fetchBookings();
    }, [user]);

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            // Fetch user's bookings
            const res = await axios.get('http://localhost:5000/api/bookings?my=true', config);
            setBookings(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching bookings:", err);
            setLoading(false);
        }
    };

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.post('http://localhost:5000/api/bookings', formData, config);

            setMessage({ type: 'success', text: 'Booking created successfully!' });
            fetchBookings();
            // Reset form optionally, or keep date for next booking
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Booking failed' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading bookings...</div>;

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold text-indigo-900 mb-2">Resource Booking</h2>
            <p className="text-gray-600 mb-8">Reserve shared facilities easily.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Booking Form */}
                <div className="lg:col-span-1">
                    <Card>
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <Calendar className="mr-2 text-indigo-600" /> New Booking
                        </h3>

                        {message && (
                            <div className={`p-3 rounded mb-4 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={onSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Resource</label>
                                <select
                                    name="resource"
                                    value={formData.resource}
                                    onChange={onChange}
                                    className="glass-input w-full"
                                >
                                    {resources.map(res => <option key={res} value={res}>{res}</option>)}
                                </select>
                            </div>

                            <Input
                                label="Date"
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={onChange}
                                required
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Start Time"
                                    type="time"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={onChange}
                                    required
                                />
                                <Input
                                    label="End Time"
                                    type="time"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={onChange}
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={submitting}>
                                {submitting ? 'Booking...' : 'Book Now'}
                            </Button>
                        </form>
                    </Card>
                </div>

                {/* My Bookings List */}
                <div className="lg:col-span-2">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">My Bookings</h3>

                    {bookings.length === 0 ? (
                        <Card className="text-center py-10 text-gray-500">
                            <p>No active bookings found.</p>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {bookings.map((booking) => (
                                <Card key={booking._id} className="border-l-4 border-indigo-500">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-indigo-900">{booking.resource}</h4>
                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                                            <CheckCircle size={12} className="mr-1" /> {booking.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <div className="flex items-center">
                                            <Calendar size={14} className="mr-2 text-indigo-400" />
                                            {booking.date}
                                        </div>
                                        <div className="flex items-center">
                                            <Clock size={14} className="mr-2 text-indigo-400" />
                                            {booking.startTime} - {booking.endTime}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResourceBooking;
