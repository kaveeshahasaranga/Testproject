const mongoose = require('mongoose');

const MaintenanceSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        enum: ['Electricity', 'Water', 'Furniture', 'Wi-Fi', 'Other'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String // Path to the uploaded image
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed', 'Rejected'],
        default: 'Pending'
    },
    adminRemarks: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Maintenance', MaintenanceSchema);
