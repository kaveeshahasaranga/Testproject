import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import NotificationContext from '../context/NotificationContext'; // Import NotificationContext
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import axios from 'axios';
import { Bed, Users, Info, Plus, X, Trash2 } from 'lucide-react'; // Import Trash2

const RoomAllocation = () => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext); // Use NotificationContext
    const [room, setRoom] = useState(null); // For Student
    const [rooms, setRooms] = useState([]); // For Admin
    const [loading, setLoading] = useState(true);
    const [showAddRoom, setShowAddRoom] = useState(false);
    const [newRoom, setNewRoom] = useState({
        roomNumber: '',
        type: 'Double',
        capacity: 2,
        pricePerSemester: '',
        facilities: ''
    });

    const isAdmin = user?.role === 'admin' || user?.role === 'warden';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                if (isAdmin) {
                    const res = await axios.get('/api/rooms', config);
                    setRooms(res.data);
                } else {
                    const res = await axios.get('/api/auth/me', config);
                    if (res.data.room) {
                        setRoom(res.data.room);
                    }
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
    }, [user, isAdmin]);

    const handleAddRoom = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // Convert facilities string to array
            const roomData = {
                ...newRoom,
                facilities: newRoom.facilities.split(',').map(f => f.trim()).filter(f => f !== '')
            };

            await axios.post('/api/rooms', roomData, config);
            showNotification('success', 'Room added successfully');
            setShowAddRoom(false);
            setNewRoom({ roomNumber: '', type: 'Double', capacity: 2, pricePerSemester: '', facilities: '' });

            // Refresh
            const res = await axios.get('/api/rooms', config);
            setRooms(res.data);
        } catch (err) {
            showNotification('error', err.response?.data?.message || 'Failed to add room');
        }
    };

    const handleDeleteRoom = async (id) => {
        if (!window.confirm('Are you sure you want to delete this room?')) return;

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.delete(`/api/rooms/${id}`, config);
            showNotification('success', 'Room deleted successfully');

            // Refresh
            const res = await axios.get('/api/rooms', config);
            setRooms(res.data);
        } catch (err) {
            showNotification('error', err.response?.data?.message || 'Failed to delete room');
        }
    };

    if (loading) return <div className="p-10 text-center">Loading room details...</div>;

    // --- ADMIN VIEW ---
    if (isAdmin) {
        return (
            <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-indigo-900">Manage Rooms</h2>
                        <p className="text-gray-600">Overview of all hostel rooms and occupancy.</p>
                    </div>
                    <Button onClick={() => setShowAddRoom(!showAddRoom)} className="flex items-center">
                        {showAddRoom ? <X size={20} className="mr-2" /> : <Plus size={20} className="mr-2" />}
                        {showAddRoom ? 'Cancel' : 'Add Room'}
                    </Button>
                </div>

                {showAddRoom && (
                    <Card className="mb-8 border-2 border-indigo-100">
                        <h3 className="text-lg font-bold text-indigo-800 mb-4">Add New Room</h3>
                        <form onSubmit={handleAddRoom}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Room Number"
                                    value={newRoom.roomNumber}
                                    onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
                                    required
                                />
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        className="glass-input w-full"
                                        value={newRoom.type}
                                        onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
                                    >
                                        <option value="Single">Single</option>
                                        <option value="Double">Double</option>
                                        <option value="Triple">Triple</option>
                                        <option value="Dorm">Dorm</option>
                                    </select>
                                </div>
                                <Input
                                    label="Capacity"
                                    type="number"
                                    value={newRoom.capacity}
                                    onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Price Per Semester"
                                    type="number"
                                    value={newRoom.pricePerSemester}
                                    onChange={(e) => setNewRoom({ ...newRoom, pricePerSemester: e.target.value })}
                                    required
                                />
                                <div className="md:col-span-2">
                                    <Input
                                        label="Facilities (comma separated)"
                                        value={newRoom.facilities}
                                        onChange={(e) => setNewRoom({ ...newRoom, facilities: e.target.value })}
                                        placeholder="AC, Attached Bathroom, Balcony"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end mt-4">
                                <Button type="submit">Create Room</Button>
                            </div>
                        </form>
                    </Card>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map((r) => (
                        <Card key={r._id} className="relative overflow-hidden group">
                            <div className={`absolute top-0 right-0 p-2 text-xs font-bold uppercase rounded-bl-lg ${r.occupants.length >= r.capacity ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                }`}>
                                {r.occupants.length >= r.capacity ? 'Full' : 'Available'}
                            </div>

                            {/* Delete Button */}
                            <button
                                onClick={() => handleDeleteRoom(r._id)}
                                className="absolute bottom-2 right-2 p-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Delete Room"
                            >
                                <Trash2 size={18} />
                            </button>

                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                    <Bed size={24} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-gray-800">{r.roomNumber}</h4>
                                    <p className="text-xs text-gray-500">{r.type}</p>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                <div className="flex justify-between">
                                    <span>Capacity:</span>
                                    <span className="font-medium">{r.capacity}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Occupancy:</span>
                                    <span className="font-medium">{r.occupants.length} / {r.capacity}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Price:</span>
                                    <span className="font-medium">LKR {r.pricePerSemester}</span>
                                </div>
                            </div>

                            <div className="border-t pt-3">
                                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Occupants</p>
                                {r.occupants.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {r.occupants.map((occ) => (
                                            <span key={occ._id} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                                {occ.name || 'Student'}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-400 italic">No occupants yet</p>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    // --- STUDENT VIEW (Original Logic) ---
    if (!room) {
        return (
            <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">My Room</h2>
                <Card className="flex flex-col items-center justify-center p-12 text-center text-gray-500">
                    <Bed size={64} className="mb-4 text-indigo-300" />
                    <h3 className="text-xl font-medium mb-2">No Room Assigned Yet</h3>
                    <p>Please contact the warden or administration to get your room allocation.</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Room Allocation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
                            <Bed size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Room Number</p>
                            <p className="text-xl font-bold text-gray-800">{room.roomNumber}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500">Type</p>
                            <p className="font-medium">{room.type}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Capacity</p>
                            <p className="font-medium">{room.capacity} Person(s)</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="p-3 bg-green-100 rounded-full text-green-600">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Occupants</p>
                            <p className="text-xl font-bold text-gray-800">{room.occupants ? room.occupants.length : 0} / {room.capacity}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500">Semester Price</p>
                            <p className="font-medium">LKR {room.pricePerSemester}</p>
                        </div>
                    </div>
                </Card>

                <Card className="col-span-1 md:col-span-2">
                    <div className="flex items-start space-x-3">
                        <Info size={20} className="text-indigo-500 mt-1" />
                        <div>
                            <h4 className="font-bold text-gray-800">Room Facilities</h4>
                            {room.facilities && room.facilities.length > 0 ? (
                                <ul className="list-disc list-inside mt-2 text-gray-600 text-sm">
                                    {room.facilities.map((fac, index) => (
                                        <li key={index}>{fac}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500 mt-2">No specific facilities listed.</p>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default RoomAllocation;
