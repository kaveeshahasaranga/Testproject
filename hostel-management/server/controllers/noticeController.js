const Notice = require('../models/Notice');

// @desc    Get all notices
// @route   GET /api/notices
// @access  Public (or Private)
const getNotices = async (req, res) => {
    try {
        const notices = await Notice.find().sort({ date: -1 });
        res.json(notices);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a notice
// @route   POST /api/notices
// @access  Private (Admin)
const createNotice = async (req, res) => {
    try {
        const { title, content } = req.body;

        const notice = await Notice.create({
            title,
            content,
            postedBy: req.user.id
        });

        res.status(201).json(notice);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a notice
// @route   DELETE /api/notices/:id
// @access  Private (Admin)
const deleteNotice = async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id);

        if (!notice) {
            return res.status(404).json({ message: 'Notice not found' });
        }

        await notice.deleteOne();
        res.json({ message: 'Notice removed' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getNotices,
    createNotice,
    deleteNotice
};
