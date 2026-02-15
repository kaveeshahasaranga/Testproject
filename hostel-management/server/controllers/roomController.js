const Room = require('../models/Room');
const User = require('../models/User');
const Joi = require('joi');

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public (or Private based on requirement)
const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find().populate('occupants', 'name email');
        res.status(200).json(rooms);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new room
// @route   POST /api/rooms
// @access  Admin
const createRoom = async (req, res) => {
    // Joi Validation
    const schema = Joi.object({
        roomNumber: Joi.string().required(),
        type: Joi.string().valid('Single', 'Double', 'Triple', 'Dorm').required(),
        capacity: Joi.number().min(1).required(),
        pricePerSemester: Joi.number().required(),
        facilities: Joi.array().items(Joi.string())
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const { roomNumber, type, capacity, pricePerSemester, facilities } = req.body;

        const roomExists = await Room.findOne({ roomNumber });
        if (roomExists) return res.status(400).json({ message: 'Room already exists' });

        const room = await Room.create({
            roomNumber,
            type,
            capacity,
            pricePerSemester,
            facilities
        });

        res.status(201).json(room);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// @desc    Allocate room to student
// @route   POST /api/rooms/allocate
// @access  Admin
const allocateRoom = async (req, res) => {
    const schema = Joi.object({
        studentId: Joi.string().required(),
        roomId: Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const { studentId, roomId } = req.body;

        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ message: 'Room not found' });

        const user = await User.findById(studentId);
        if (!user) return res.status(404).json({ message: 'Student not found' });

        // Check if room is full
        if (room.occupants.length >= room.capacity) {
            return res.status(400).json({ message: 'Room is fully occupied' });
        }

        // Check if user already has a room
        if (user.room) {
            return res.status(400).json({ message: 'Student is already assigned to a room' });
        }

        // Assign room
        room.occupants.push(studentId);
        await room.save();

        user.room = roomId;
        await user.save();

        res.status(200).json({ message: 'Room allocated successfully', room, user });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Admin
const deleteRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // Check if room has occupants
        if (room.occupants.length > 0) {
            return res.status(400).json({ message: 'Cannot delete room with assigned students. Please remove occupants first.' });
        }

        await room.deleteOne();
        res.json({ message: 'Room removed' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

module.exports = {
    getRooms,
    createRoom,
    allocateRoom,
    deleteRoom
};
