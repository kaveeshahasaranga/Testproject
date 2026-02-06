import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import Card from '../components/ui/Card';
import axios from 'axios';
import { Bed, Users, Info } from 'lucide-react';

const RoomAllocation = () => {
    const { user } = useContext(AuthContext);
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoomData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setLoading(false);
                    return;
                }
                const config = { headers: { Authorization: `Bearer ${token}` } };
                // Fetch user data which now includes populated room
                const res = await axios.get('http://127.0.0.1:5000/api/auth/me', config);

                if (res.data.room) {
                    setRoom(res.data.room);
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        if (user) {
            fetchRoomData();
        }
    }, [user]);

    if (loading) return <div className="p-10 text-center">Loading room details...</div>;

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
