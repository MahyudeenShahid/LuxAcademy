const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, deleteUser, getAnalytics } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/analytics', protect, authorize('admin'), getAnalytics);
router.get('/:id', protect, authorize('admin'), getUserById);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
