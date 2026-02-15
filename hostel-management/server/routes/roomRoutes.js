const express = require('express');
const router = express.Router();
const { getRooms, createRoom, allocateRoom, deleteRoom } = require('../controllers/roomController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public route to view rooms (or protect if needed)
router.get('/', getRooms);

// Admin only routes
router.post('/', protect, admin, createRoom);
router.post('/allocate', protect, admin, allocateRoom);
router.delete('/:id', protect, admin, deleteRoom);

module.exports = router;
