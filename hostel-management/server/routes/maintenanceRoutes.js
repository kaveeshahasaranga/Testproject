const express = require('express');
const router = express.Router();
const { createRequest, getRequests, updateStatus } = require('../controllers/maintenanceController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(protect, getRequests)
    .post(protect, upload.single('image'), createRequest);

router.route('/:id')
    .put(protect, updateStatus);

module.exports = router;
