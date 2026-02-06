import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import axios from 'axios';
import { PenTool, Clock, CheckCircle, XCircle, Loader, Upload } from 'lucide-react';

const Maintenance = () => {
    const { user } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);
    const [formData, setFormData] = useState({
        category: 'Electricity',
        description: '',
        image: null
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null);

    const categories = ['Electricity', 'Water', 'Furniture', 'Wi-Fi', 'Other'];

    useEffect(() => {
        fetchRequests();
    }, [user]);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const res = await axios.get('http://127.0.0.1:5000/api/maintenance', config);
            setRequests(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching requests:", err);
            setLoading(false);
        }
    };

    const onChange = (e) => {
        if (e.target.name === 'image') {
            setFormData({ ...formData, image: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);

        const data = new FormData();
        data.append('category', formData.category);
        data.append('description', formData.description);
        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            };

            await axios.post('http://127.0.0.1:5000/api/maintenance', data, config);

            setMessage({ type: 'success', text: 'Request submitted successfully!' });
            setFormData({ category: 'Electricity', description: '', image: null });
            fetchRequests(); // Refresh list
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Submission failed' });
        } finally {
            setSubmitting(false);
        }
    };

    // Helper to render status badge
    const renderStatus = (status) => {
        const styles = {
            'Pending': 'bg-yellow-100 text-yellow-800',
            'In Progress': 'bg-blue-100 text-blue-800',
            'Completed': 'bg-green-100 text-green-800',
            'Rejected': 'bg-red-100 text-red-800'
        };
        const icons = {
            'Pending': <Clock size={16} className="mr-1" />,
            'In Progress': <Loader size={16} className="mr-1 animate-spin" />,
            'Completed': <CheckCircle size={16} className="mr-1" />,
            'Rejected': <XCircle size={16} className="mr-1" />
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles['Pending']}`}>
                {icons[status] || icons['Pending']}
                {status}
            </span>
        );
    };

    if (loading) return <div className="p-10 text-center">Loading requests...</div>;

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold text-indigo-900 mb-2">Maintenance</h2>
            <p className="text-gray-600 mb-8">Report and track hostel maintenance issues.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Request Form */}
                <div className="lg:col-span-1">
                    <Card>
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <PenTool className="mr-2 text-indigo-600" /> New Request
                        </h3>

                        {message && (
                            <div className={`p-3 rounded mb-4 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={onSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={onChange}
                                    className="glass-input w-full"
                                >
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={onChange}
                                    rows="4"
                                    className="glass-input w-full"
                                    placeholder="Describe the issue..."
                                    required
                                ></textarea>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image (Optional)</label>
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400">
                                            <Upload className="w-8 h-8 mb-2" />
                                            <p className="text-xs">Click to upload image</p>
                                        </div>
                                        <input type="file" name="image" className="hidden" onChange={onChange} accept="image/*" />
                                    </label>
                                </div>
                                {formData.image && <p className="text-xs text-green-600 mt-2">Selected: {formData.image.name}</p>}
                            </div>

                            <Button type="submit" className="w-full" disabled={submitting}>
                                {submitting ? 'Submitting...' : 'Submit Request'}
                            </Button>
                        </form>
                    </Card>
                </div>

                {/* Request List */}
                <div className="lg:col-span-2">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">My Requests</h3>

                    {requests.length === 0 ? (
                        <Card className="text-center py-10 text-gray-500">
                            <p>No maintenance requests found.</p>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {requests.map((req) => (
                                <Card key={req._id} className="transition-transform hover:scale-[1.01]">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-xs font-bold uppercase text-indigo-500 tracking-wide">{req.category}</span>
                                            <p className="mt-1 font-medium text-gray-800">{req.description}</p>
                                            <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                                                <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                                                {/* Only show student name if admin/warden view, but for now user sees own */}
                                            </div>
                                            {req.adminRemarks && (
                                                <div className="mt-3 bg-gray-50 p-2 rounded border-l-4 border-indigo-200 text-sm text-gray-600">
                                                    <strong>Admin Remark:</strong> {req.adminRemarks}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-end space-y-2">
                                            {renderStatus(req.status)}
                                            {req.image && (
                                                <a
                                                    href={`http://127.0.0.1:5000/${req.image}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center"
                                                >
                                                    View Image
                                                </a>
                                            )}
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

export default Maintenance;
