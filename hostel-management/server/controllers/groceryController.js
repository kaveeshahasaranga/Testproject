const GroceryRequest = require('../models/GroceryRequest');
const Joi = require('joi');

// @desc    Create a new grocery request
// @route   POST /api/grocery
// @access  Private (Student)
const createRequest = async (req, res) => {
    const schema = Joi.object({
        itemName: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
        unit: Joi.string().optional(),
        notes: Joi.string().allow('').optional()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const { itemName, quantity, unit, notes } = req.body;

        // Constraint check: Student cannot request same item if it's still Pending
        const existingPending = await GroceryRequest.findOne({
            student: req.user.id,
            itemName,
            status: 'Pending'
        });

        if (existingPending) {
            return res.status(400).json({ message: 'You already have a pending request for this item.' });
        }

        const request = await GroceryRequest.create({
            student: req.user.id,
            itemName,
            quantity,
            unit,
            notes
        });

        res.status(201).json(request);

    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// @desc    Get grocery requests
// @route   GET /api/grocery
// @access  Private
const getRequests = async (req, res) => {
    try {
        let requests;
        if (req.user.role === 'student') {
            requests = await GroceryRequest.find({ student: req.user.id }).sort({ createdAt: -1 });
        } else {
            // Admin sees all
            requests = await GroceryRequest.find()
                .populate('student', 'name room')
                .sort({ createdAt: -1 });
        }
        res.status(200).json(requests);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update delivery status
// @route   PUT /api/grocery/:id
// @access  Private (Admin/Warden)
const updateStatus = async (req, res) => {
    const schema = Joi.object({
        status: Joi.string().valid('Pending', 'Approved', 'Delivered', 'Rejected').required()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const { status } = req.body;
        const request = await GroceryRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Logic constraint: Only Approved requests can be Delivered
        if (status === 'Delivered' && request.status !== 'Approved') {
            return res.status(400).json({ message: 'Request must be Approved before it can be Delivered.' });
        }

        // Logic constraint: Delivered requests are locked
        if (request.status === 'Delivered') {
            return res.status(400).json({ message: 'This request is already delivered and locked.' });
        }

        request.status = status;
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
