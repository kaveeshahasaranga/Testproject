import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import NotificationContext from '../context/NotificationContext'; // Import NotificationContext
import Card from '../components/ui/Card';
import Button from '../components/ui/Button'; // Import Button
import Input from '../components/ui/Input'; // Import Input
import { User, Mail, Hash, Bed, Shield, Lock, Key } from 'lucide-react';
import axios from 'axios'; // Import axios

const Profile = () => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext); // Use NotificationContext

    // Password Change State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [changingPassword, setChangingPassword] = useState(false);

    if (!user) return <div className="p-10 text-center">Loading profile...</div>;

    const onPasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showNotification('error', 'New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            showNotification('error', 'Password must be at least 6 characters');
            return;
        }

        setChangingPassword(true);

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.put('/api/auth/password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            }, config);

            showNotification('success', 'Password updated successfully');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            showNotification('error', err.response?.data?.message || 'Failed to update password');
        } finally {
            setChangingPassword(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">My Profile</h2>

            <div className="space-y-8">
                {/* User Details Card */}
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

                {/* Change Password Card */}
                <Card className="p-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                        <Lock className="mr-2 text-indigo-600" /> Change Password
                    </h3>

                    <form onSubmit={handleChangePassword} className="max-w-md">
                        <Input
                            label="Current Password"
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={onPasswordChange}
                            required
                            icon={<Key size={18} />}
                        />

                        <Input
                            label="New Password"
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={onPasswordChange}
                            required
                            placeholder="Min 6 characters"
                            icon={<Lock size={18} />}
                        />

                        <Input
                            label="Confirm New Password"
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={onPasswordChange}
                            required
                            icon={<Lock size={18} />}
                        />

                        <div className="mt-6">
                            <Button type="submit" disabled={changingPassword}>
                                {changingPassword ? 'Updating...' : 'Update Password'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
