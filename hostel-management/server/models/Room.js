const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ['Single', 'Double', 'Triple', 'Dorm'],
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    occupants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    pricePerSemester: {
        type: Number,
        required: true
    },
    facilities: [String] // e.g., ["AC", "Attached Bathroom"]
}, {
    timestamps: true
});

module.exports = mongoose.model('Room', RoomSchema);
