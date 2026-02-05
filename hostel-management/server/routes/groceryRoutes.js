const express = require('express');
const router = express.Router();
const { createRequest, getRequests, updateStatus } = require('../controllers/groceryController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getRequests)
    .post(protect, createRequest);

router.route('/:id')
    .put(protect, updateStatus);

module.exports = router;
