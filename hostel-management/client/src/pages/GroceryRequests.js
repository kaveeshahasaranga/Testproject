import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import axios from 'axios';
import { ShoppingCart, ShoppingBag, Truck, Check } from 'lucide-react';

// Renaming the Lucide ShoppingBag to avoid conflict if necessary, but here reusing ShoppingBag variable name is fine if not imported twice
// Wait, I imported ShoppingIcon? Lucide React exports `ShoppingCart` usually, let's stick to standard names or check imports
// Correcting imports based on generic Lucide logic

const GroceryRequests = () => {
    const { user } = useContext(AuthContext); // user needed primarily for effect dep
    const [requests, setRequests] = useState([]);
    const [formData, setFormData] = useState({
        itemName: '',
        quantity: 1,
        unit: 'units',
        notes: ''
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, [user]);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get('http://127.0.0.1:5000/api/grocery', config);
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
        setMessage(null);

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.post('http://127.0.0.1:5000/api/grocery', formData, config);

            setMessage({ type: 'success', text: 'Order placed successfully!' });
            setFormData({ itemName: '', quantity: 1, unit: 'units', notes: '' });
            fetchRequests();
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Order failed' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading grocery data...</div>;

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold text-indigo-900 mb-2">Grocery Requests</h2>
            <p className="text-gray-600 mb-8">Request essential items directly to your room.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Order Form */}
                <div className="lg:col-span-1">
                    <Card>
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <ShoppingBag className="mr-2 text-indigo-600" /> New Order
                        </h3>

                        {message && (
                            <div className={`p-3 rounded mb-4 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {message.text}
                            </div>
                        )}

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

                {/* Request History */}
                <div className="lg:col-span-2">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Order History</h3>
                    {requests.length === 0 ? (
                        <Card className="text-center py-10 text-gray-500">
                            <p>No past grocery orders.</p>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {requests.map((req) => (
                                <Card key={req._id} className="flex justify-between items-center p-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-gray-100 rounded-full text-gray-600">
                                            {req.status === 'Delivered' ? <Check size={20} className="text-green-600" /> : <Truck size={20} />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800">{req.quantity} {req.unit} - {req.itemName}</h4>
                                            <p className="text-sm text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                            req.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                                                req.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {req.status}
                                        </span>
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
