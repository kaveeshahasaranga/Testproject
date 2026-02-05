const express = require('express');
const router = express.Router();
const { getRooms, createRoom, allocateRoom } = require('../controllers/roomController');
const { protect } = require('../middleware/authMiddleware');

// Public route to view rooms (or protect if needed)
router.get('/', getRooms);

// Admin only routes - For now I will just use 'protect', later add admin check middleware
router.post('/', protect, createRoom);
router.post('/allocate', protect, allocateRoom);

module.exports = router;
