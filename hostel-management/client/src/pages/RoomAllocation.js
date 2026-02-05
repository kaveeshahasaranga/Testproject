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
            // Mock data for now as we don't have a direct "getMyRoom" endpoint fully wired with detailed user data yet
            // In real scenario, user object might container room ID, then we fetch room details
            // Or we fetch /api/auth/me which populates room
            try {
                // This is a placeholder as backend might need adjustment to return full room details for the logged-in user effortlessly
                // For demonstration, we assume user might have room data or we fetch it. 
                // Let's implement a safe check or mock if undefined for UI dev
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchRoomData();
    }, [user]);

    if (loading) return <div className="p-10 text-center">Loading room details...</div>;

    // Placeholder if no room assigned (which is true for new users)
    if (!room && !user?.room) {
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
            {/* If we had room data, render it here */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
                            <Bed size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Room Number</p>
                            <p className="text-xl font-bold text-gray-800">101-A</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500">Type</p>
                            <p className="font-medium">Double Sharing</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Floor</p>
                            <p className="font-medium">1st Floor</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="p-3 bg-green-100 rounded-full text-green-600">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Roommate</p>
                            <p className="text-xl font-bold text-gray-800">Jane Smith</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500">IT Number</p>
                            <p className="font-medium">IT98765432</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Contact</p>
                            <p className="font-medium">077-1234567</p>
                        </div>
                    </div>
                </Card>

                <Card className="col-span-1 md:col-span-2">
                    <div className="flex items-start space-x-3">
                        <Info size={20} className="text-indigo-500 mt-1" />
                        <div>
                            <h4 className="font-bold text-gray-800">Room Facilities</h4>
                            <ul className="list-disc list-inside mt-2 text-gray-600 text-sm">
                                <li>Attached Bathroom</li>
                                <li>Study Table & Chair</li>
                                <li>Ceiling Fan</li>
                                <li>Balcony Access</li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default RoomAllocation;
