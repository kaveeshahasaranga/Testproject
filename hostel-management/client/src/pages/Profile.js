import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import Card from '../components/ui/Card';
import { User, Mail, Hash, Bed, Shield } from 'lucide-react';

const Profile = () => {
    const { user } = useContext(AuthContext);

    if (!user) return <div className="p-10 text-center">Loading profile...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">My Profile</h2>

            <Card className="p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    <div className="flex-shrink-0">
                        <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-5xl font-bold border-4 border-white shadow-lg">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    </div>

                    <div className="flex-1 w-full space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                                    <User size={14} /> Full Name
                                </label>
                                <p className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-1">{user.name}</p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                                    <Mail size={14} /> Email Address
                                </label>
                                <p className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-1">{user.email}</p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                                    <Shield size={14} /> Role
                                </label>
                                <p className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-1 capitalize">{user.role}</p>
                            </div>

                            {user.itNumber && (
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                                        <Hash size={14} /> IT Number
                                    </label>
                                    <p className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-1">{user.itNumber}</p>
                                </div>
                            )}

                            {user.room && (
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                                        <Bed size={14} /> Room Assigned
                                    </label>
                                    <p className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-1">
                                        {user.room.roomNumber} <span className="text-sm text-gray-500">({user.room.type})</span>
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                            <p className="text-sm text-gray-500 text-center italic">
                                To update your profile details, please contact the system administrator.
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Profile;
