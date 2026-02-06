import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        itNumber: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState(null);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const { name, itNumber, email, password, confirmPassword } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            // Remove confirmPassword before sending
            const { confirmPassword, ...registerData } = formData;
            const res = await axios.post('http://127.0.0.1:5000/api/auth/register', registerData);
            login(res.data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-indigo-900">Create Account</h1>
                    <p className="text-gray-600">Join our hostel community</p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={onSubmit}>
                    <Input
                        label="Full Name"
                        name="name"
                        value={name}
                        onChange={onChange}
                        placeholder="John Doe"
                        required
                    />
                    <Input
                        label="IT Number"
                        name="itNumber"
                        value={itNumber}
                        onChange={onChange}
                        placeholder="IT12345678"
                        required
                    />
                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        placeholder="it12345678@my.sliit.lk"
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        placeholder="••••••••"
                        required
                    />
                    <Input
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={onChange}
                        placeholder="••••••••"
                        required
                    />

                    <div className="mt-6">
                        <Button type="submit" className="w-full" variant="primary">
                            Register
                        </Button>
                    </div>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
                        Login
                    </Link>
                </p>
            </Card>
        </div>
    );
};

export default Register;
