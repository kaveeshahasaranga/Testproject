import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import NotificationToast from './components/ui/NotificationToast';
import ProtectedRoute from './components/ProtectedRoute';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RoomAllocation from './pages/RoomAllocation';
import Maintenance from './pages/Maintenance';
import ResourceBooking from './pages/ResourceBooking';
import GroceryRequests from './pages/GroceryRequests';
import AdminBookings from './pages/AdminBookings';
import UserList from './pages/UserList';
import Profile from './pages/Profile';

function App() {
    return (
        <AuthProvider>
            <NotificationProvider>
                <Router>
                    <NotificationToast />
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Protected Routes Layout */}
                        <Route path="/*" element={
                            <ProtectedRoute>
                                <div className="flex h-screen overflow-hidden">
                                    <div className="hidden md:block w-64 fixed h-full z-10">
                                        <Sidebar />
                                    </div>
                                    <div className="flex-1 flex flex-col md:ml-64 w-full">
                                        <Navbar />
                                        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-6">
                                            <Routes>
                                                <Route path="/" element={<Dashboard />} />
                                                <Route path="/rooms" element={<RoomAllocation />} />
                                                <Route path="/maintenance" element={<Maintenance />} />
                                                <Route path="/booking" element={<ResourceBooking />} />
                                                <Route path="/grocery" element={<GroceryRequests />} />
                                                <Route path="/admin/bookings" element={<AdminBookings />} />
                                                <Route path="/admin/users" element={<UserList />} />
                                                <Route path="/profile" element={<Profile />} />
                                            </Routes>
                                        </main>
                                    </div>
                                </div>
                            </ProtectedRoute>
                        } />
                    </Routes>
                </Router>
            </NotificationProvider>
        </AuthProvider>
    );
}

export default App;
