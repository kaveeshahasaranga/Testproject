import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import NotificationContext from '../context/NotificationContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import axios from 'axios';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/auth/login', formData);
            login(res.data);
            showNotification('success', 'Login successful!');
            navigate('/');
        } catch (err) {
            showNotification('error', err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-indigo-900">Welcome Back</h1>
                    <p className="text-gray-600">Sign in to manage your hostel stay</p>
                </div>



                <form onSubmit={onSubmit}>
                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        placeholder="Enter your email"
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        placeholder="Enter your password"
                        required
                    />

                    <div className="mt-6">
                        <Button type="submit" className="w-full" variant="primary">
                            Sign In
                        </Button>
                    </div>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-medium">
                        Register
                    </Link>
                </p>
            </Card>
        </div>
    );
};

export default Login;
