const mongoose = require('mongoose');

const GroceryRequestSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    unit: {
        type: String,
        default: 'units' // e.g., kg, liters, packets
    },
    notes: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Delivered', 'Rejected'],
        default: 'Pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('GroceryRequest', GroceryRequestSchema);
