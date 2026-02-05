const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    resource: {
        type: String,
        enum: ['Washing Machine', 'Study Room', 'TV Room', 'Ironing', 'Other'],
        required: true
    },
    date: {
        type: String, // YYYY-MM-DD format for simplicity in querying
        required: true
    },
    startTime: {
        type: String, // HH:mm format (24 hour)
        required: true
    },
    endTime: {
        type: String, // HH:mm format
        required: true
    },
    status: {
        type: String,
        enum: ['Booked', 'Cancelled', 'Completed'],
        default: 'Booked'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Booking', BookingSchema);
