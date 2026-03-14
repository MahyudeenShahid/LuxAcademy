const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, deleteUser, getAnalytics, updateUserRole, getInstructors, getInstructorProfile } = require('../controllers/userController');
const { getInstructorReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// ── Public (no auth required) ─────────────────────────────────────────────
router.get('/instructors',              getInstructors);
router.get('/instructors/:id/reviews',  getInstructorReviews);
router.get('/instructors/:id',          getInstructorProfile);

// ── Admin only ────────────────────────────────────────────────────────────
router.get('/',          protect, authorize('admin'), getAllUsers);
router.get('/analytics', protect, authorize('admin'), getAnalytics);
router.get('/:id',       protect, authorize('admin'), getUserById);
router.put('/:id',       protect, authorize('admin'), updateUserRole);
router.delete('/:id',    protect, authorize('admin'), deleteUser);

module.exports = router;
