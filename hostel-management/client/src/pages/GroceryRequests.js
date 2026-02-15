import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import NotificationContext from '../context/NotificationContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import axios from 'axios';
import { ShoppingBag, Truck, Check } from 'lucide-react';

const GroceryRequests = () => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const [requests, setRequests] = useState([]);
    const [formData, setFormData] = useState({
        itemName: '',
        quantity: 1,
        unit: 'units',
        notes: ''
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editStatus, setEditStatus] = useState('');

    const isAdmin = user?.role === 'admin' || user?.role === 'warden';

    useEffect(() => {
        fetchRequests();
    }, [user]);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get('/api/grocery', config);
            setRequests(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.post('/api/grocery', formData, config);

            showNotification('success', 'Order placed successfully!');
            setFormData({ itemName: '', quantity: 1, unit: 'units', notes: '' });
            fetchRequests();
        } catch (err) {
            showNotification('error', err.response?.data?.message || 'Order failed');
        } finally {
            setSubmitting(false);
        }
    };

    const onEditClick = (req) => {
        setEditingId(req._id);
        setEditStatus(req.status);
    };

    const onUpdateStatus = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`/api/grocery/${id}`, { status: editStatus }, config);
            showNotification('success', 'Order status updated');
            setEditingId(null);
            fetchRequests();
        } catch (err) {
            showNotification('error', 'Update failed');
        }
    };

    if (loading) return <div className="p-10 text-center">Loading grocery data...</div>;

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold text-indigo-900 mb-2">
                {isAdmin ? 'Grocery Management' : 'Grocery Requests'}
            </h2>
            <p className="text-gray-600 mb-8">
                {isAdmin ? 'Manage student grocery orders.' : 'Request essential items directly to your room.'}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Order Form (Student Only) */}
                {!isAdmin && (
                    <div className="lg:col-span-1">
                        <Card>
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <ShoppingBag className="mr-2 text-indigo-600" /> New Order
                            </h3>

                            <form onSubmit={onSubmit}>
                                <Input
                                    label="Item Name"
                                    name="itemName"
                                    value={formData.itemName}
                                    onChange={onChange}
                                    placeholder="E.g., Water Bottle, Soap"
                                    required
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Quantity"
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={onChange}
                                        min="1"
                                        required
                                    />
                                    <Input
                                        label="Unit"
                                        name="unit"
                                        value={formData.unit}
                                        onChange={onChange}
                                        placeholder="units, kg, ltr"
                                    />
                                </div>

                                <Input
                                    label="Notes (Optional)"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={onChange}
                                    placeholder="Any specific brand?"
                                />

                                <Button type="submit" className="w-full" disabled={submitting}>
                                    {submitting ? 'Ordering...' : 'Place Order'}
                                </Button>
                            </form>
                        </Card>
                    </div>
                )}

                {/* Request History */}
                <div className={isAdmin ? "lg:col-span-3" : "lg:col-span-2"}>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                        {isAdmin ? 'All Orders' : 'Order History'}
                    </h3>

                    {requests.length === 0 ? (
                        <Card className="text-center py-10 text-gray-500">
                            <p>No grocery orders found.</p>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {requests.map((req) => (
                                <Card key={req._id} className="flex flex-col md:flex-row justify-between items-center p-4">
                                    <div className="flex items-center space-x-4 w-full md:w-auto mb-4 md:mb-0">
                                        <div className="p-3 bg-gray-100 rounded-full text-gray-600">
                                            {req.status === 'Delivered' ? <Check size={20} className="text-green-600" /> : <Truck size={20} />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800">{req.quantity} {req.unit} - {req.itemName}</h4>
                                            <p className="text-sm text-gray-500">
                                                {new Date(req.createdAt).toLocaleDateString()}
                                                {isAdmin && req.student && (
                                                    <span className="ml-2 bg-indigo-50 text-indigo-700 px-2 rounded-full text-xs">
                                                        {req.student.name}
                                                    </span>
                                                )}
                                            </p>
                                            {req.notes && <p className="text-xs text-gray-400 mt-1">Note: {req.notes}</p>}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        {editingId === req._id ? (
                                            <div className="flex space-x-2">
                                                <select
                                                    value={editStatus}
                                                    onChange={(e) => setEditStatus(e.target.value)}
                                                    className="text-xs p-1 border rounded"
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Approved">Approved</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Rejected">Rejected</option>
                                                </select>
                                                <button
                                                    onClick={() => onUpdateStatus(req._id)}
                                                    className="text-xs bg-green-500 text-white px-2 py-1 rounded"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    req.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                                                        req.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                            'bg-red-100 text-red-800'
                                                    }`}>
                                                    {req.status}
                                                </span>
                                                {isAdmin && (
                                                    <button
                                                        onClick={() => onEditClick(req)}
                                                        className="text-xs text-indigo-600 hover:text-indigo-800 underline ml-2"
                                                    >
                                                        Edit
                                                    </button>
                                                )}
                                            </>
                                        )}
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

export default GroceryRequests;
