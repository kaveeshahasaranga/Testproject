const Maintenance = require('../models/Maintenance');
const Joi = require('joi');

// @desc    Create a new maintenance request
// @route   POST /api/maintenance
// @access  Private (Student)
const createRequest = async (req, res) => {
    // Validation
    const schema = Joi.object({
        category: Joi.string().valid('Electricity', 'Water', 'Furniture', 'Wi-Fi', 'Other').required(),
        description: Joi.string().required()
    });

    // req.body might be [Object: null prototype] due to multer, copy it
    const { error } = schema.validate({ category: req.body.category, description: req.body.description });
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const { category, description } = req.body;

        let imagePath = '';
        if (req.file) {
            imagePath = req.file.path;
        }

        const request = await Maintenance.create({
            student: req.user.id,
            category,
            description,
            image: imagePath
        });

        res.status(201).json(request);

    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// @desc    Get all maintenance requests (For Admin) or User specific (For Student)
// @route   GET /api/maintenance
// @access  Private
const getRequests = async (req, res) => {
    try {
        let requests;
        if (req.user.role === 'student') {
            requests = await Maintenance.find({ student: req.user.id }).sort({ createdAt: -1 });
        } else {
            // Admin/Warden sees all, populate student details
            requests = await Maintenance.find().populate('student', 'name room').sort({ createdAt: -1 });
        }
        res.status(200).json(requests);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update request status
// @route   PUT /api/maintenance/:id
// @access  Private (Admin/Warden)
const updateStatus = async (req, res) => {
    const schema = Joi.object({
        status: Joi.string().valid('Pending', 'In Progress', 'Completed', 'Rejected').required(),
        adminRemarks: Joi.string().allow('')
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const { status, adminRemarks } = req.body;
        const request = await Maintenance.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        request.status = status;
        if (adminRemarks) request.adminRemarks = adminRemarks;

        await request.save();
        res.status(200).json(request);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createRequest,
    getRequests,
    updateStatus
};
