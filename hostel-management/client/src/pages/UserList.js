import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Trash2, User, Search, Bed, Plus, X } from 'lucide-react';
import NotificationContext from '../context/NotificationContext';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedRoomId, setSelectedRoomId] = useState('');

    const { showNotification } = useContext(NotificationContext);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const [usersRes, roomsRes] = await Promise.all([
                axios.get('/api/auth/users', config),
                axios.get('/api/rooms', config)
            ]);

            setUsers(usersRes.data);
            setRooms(roomsRes.data);
            setLoading(false);
        } catch (err) {
            showNotification('error', 'Failed to fetch data');
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`/api/auth/users/${id}`, config);

            showNotification('success', 'User deleted successfully');
            fetchData(); // Refresh list
        } catch (err) {
            showNotification('error', err.response?.data?.message || 'Failed to delete user');
        }
    };

    const handleAssignClick = (user) => {
        setSelectedStudent(user);
        setSelectedRoomId('');
        setShowAssignModal(true);
    };

    const handleConfirmAssign = async (e) => {
        e.preventDefault();
        if (!selectedRoomId) {
            showNotification('error', 'Please select a room');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.post('/api/rooms/allocate', {
                studentId: selectedStudent._id,
                roomId: selectedRoomId
            }, config);

            showNotification('success', `Room assigned to ${selectedStudent.name}`);
            setShowAssignModal(false);
            fetchData(); // Refresh users and rooms (to update occupancy)
        } catch (err) {
            showNotification('error', err.response?.data?.message || 'Failed to assign room');
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.itNumber && user.itNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Filter available rooms
    const availableRooms = rooms.filter(r => r.occupants.length < r.capacity);

    if (loading) return <div className="p-10 text-center">Loading users...</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-indigo-900">User Management</h2>
                    <p className="text-gray-600">Manage students, wardens, and admins.</p>
                </div>
            </div>

            <Card className="mb-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={20} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="glass-input w-full pl-10"
                        placeholder="Search users by name, email, or IT number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                    <Card key={user._id} className="relative hover:shadow-lg transition-shadow">
                        <div className="absolute top-4 right-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                    user.role === 'warden' ? 'bg-blue-100 text-blue-700' :
                                        'bg-green-100 text-green-700'
                                }`}>
                                {user.role}
                            </span>
                        </div>

                        <div className="flex items-center space-x-4 mb-4">
                            <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
                                <User size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">{user.name}</h3>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                            {user.itNumber && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">IT Number:</span>
                                    <span className="font-medium">{user.itNumber}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">Room:</span>
                                {user.room ? (
                                    <span className="font-medium bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs">
                                        {user.room.roomNumber}
                                    </span>
                                ) : (
                                    <span className="text-gray-400 italic text-xs">Not Assigned</span>
                                )}
                            </div>
                        </div>

                        {user.role === 'student' && !user.room && (
                            <div className="mb-4">
                                <button
                                    onClick={() => handleAssignClick(user)}
                                    className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-md text-sm font-medium hover:bg-indigo-100 flex items-center justify-center transition-colors"
                                >
                                    <Plus size={16} className="mr-1" /> Assign Room
                                </button>
                            </div>
                        )}

                        {user.role !== 'admin' && (
                            <div className="border-t pt-4 flex justify-end">
                                <button
                                    onClick={() => handleDeleteUser(user._id)}
                                    className="text-red-500 hover:text-red-700 flex items-center text-sm font-medium transition-colors"
                                >
                                    <Trash2 size={16} className="mr-1" />
                                    Delete User
                                </button>
                            </div>
                        )}
                    </Card>
                ))}

                {filteredUsers.length === 0 && (
                    <div className="col-span-full text-center py-10 text-gray-500">
                        No users found matching your search.
                    </div>
                )}
            </div>

            {/* Assign Room Modal */}
            {showAssignModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-indigo-900">Assign Room</h3>
                            <button onClick={() => setShowAssignModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mb-4 bg-gray-50 p-3 rounded">
                            <p className="text-sm text-gray-600">Assigning room for:</p>
                            <p className="font-bold text-gray-800">{selectedStudent?.name}</p>
                        </div>

                        <form onSubmit={handleConfirmAssign}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Room</label>
                                <select
                                    className="glass-input w-full"
                                    value={selectedRoomId}
                                    onChange={(e) => setSelectedRoomId(e.target.value)}
                                    required
                                >
                                    <option value="">-- Select Available Room --</option>
                                    {availableRooms.map(room => (
                                        <option key={room._id} value={room._id}>
                                            {room.roomNumber} ({room.type}) - {room.capacity - room.occupants.length} slots left
                                        </option>
                                    ))}
                                </select>
                                {availableRooms.length === 0 && (
                                    <p className="text-xs text-red-500 mt-1">No rooms available.</p>
                                )}
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAssignModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                                >
                                    Cancel
                                </button>
                                <Button type="submit" disabled={!selectedRoomId}>
                                    Confirm Assignment
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default UserList;
