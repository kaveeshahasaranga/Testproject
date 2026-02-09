const Booking = require('../models/Booking');
const Joi = require('joi');

// Helper to convert time string to minutes for comparison
const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Student)
const createBooking = async (req, res) => {
    const schema = Joi.object({
        resource: Joi.string().valid('Washing Machine', 'Study Room', 'TV Room', 'Ironing', 'Other').required(),
        date: Joi.string().required(), // YYYY-MM-DD
        startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(), // HH:mm
        endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const { resource, date, startTime, endTime } = req.body;

        const startMin = timeToMinutes(startTime);
        const endMin = timeToMinutes(endTime);

        if (startMin >= endMin) {
            return res.status(400).json({ message: 'End time must be after start time' });
        }

        // Check for overlaps
        // Find bookings for the same resource on the same date
        const existingBookings = await Booking.find({
            resource,
            date,
            status: 'Booked'
        });

        // Check overlap logic
        const isOverlap = existingBookings.some(booking => {
            const existingStart = timeToMinutes(booking.startTime);
            const existingEnd = timeToMinutes(booking.endTime);

            // Logic: Intended interval [start, end) overlaps with [estart, eend) if start < eend AND end > estart
            return startMin < existingEnd && endMin > existingStart;
        });

        if (isOverlap) {
            return res.status(409).json({ message: 'Resource is already booked for this time slot.' });
        }

        const booking = await Booking.create({
            student: req.user.id,
            resource,
            date,
            startTime,
            endTime
        });

        res.status(201).json(booking);

    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// @desc    Get bookings
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res) => {
    try {
        // If query param ?my=true, return only user's bookings
        if (req.query.my === 'true') {
            const bookings = await Booking.find({ student: req.user.id }).sort({ date: -1, startTime: -1 });
            return res.json(bookings);
        }

        // Return all bookings for calendar view (maybe filter by date if needed later)
        const bookings = await Booking.find().populate('student', 'name').sort({ date: -1, startTime: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Cancel a booking
// @route   DELETE /api/bookings/:id
// @access  Private
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if user owns the booking
        if (booking.student.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Optional: Check if already cancelled
        if (booking.status === 'Cancelled') {
            return res.status(400).json({ message: 'Booking already cancelled' });
        }

        // Update status instead of deleting to keep record
        booking.status = 'Cancelled';
        await booking.save();

        res.json({ message: 'Booking cancelled successfully', booking });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createBooking,
    getBookings,
    cancelBooking
};
