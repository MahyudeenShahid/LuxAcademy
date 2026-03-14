const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getMyCourses,
} = require('../controllers/courseController');
const {
  getLessons,
  createLesson,
  updateLesson,
  deleteLesson,
} = require('../controllers/lessonController');
const { createReview, getCourseReviews, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Course routes
router.get('/', getAllCourses);
router.get('/my-courses', protect, authorize('instructor'), getMyCourses);
router.get('/:id', getCourseById);
router.post('/', protect, authorize('instructor', 'admin'), createCourse);
router.put('/:id', protect, authorize('instructor', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteCourse);

// Nested lesson routes  /api/courses/:courseId/lessons
router.get('/:courseId/lessons', protect, getLessons);
router.post('/:courseId/lessons', protect, authorize('instructor', 'admin'), createLesson);
router.put('/:courseId/lessons/:id', protect, authorize('instructor', 'admin'), updateLesson);
router.delete('/:courseId/lessons/:id', protect, authorize('instructor', 'admin'), deleteLesson);

// Nested review routes  /api/courses/:courseId/reviews
router.get('/:courseId/reviews', getCourseReviews);
router.post('/:courseId/reviews', protect, authorize('student'), createReview);
router.delete('/:courseId/reviews/:id', protect, deleteReview);

module.exports = router;
