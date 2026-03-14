const express = require('express');
const router = express.Router();
const {
  enrollInCourse,
  getMyCourses,
  updateProgress,
  checkEnrollment,
  getAllEnrollments,
  getInstructorEnrollments,
} = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', protect, authorize('admin'), getAllEnrollments);
router.post('/enroll', protect, authorize('student'), enrollInCourse);
router.get('/my-courses', protect, authorize('student'), getMyCourses);
router.get('/my-students', protect, authorize('instructor'), getInstructorEnrollments);
router.get('/check/:courseId', protect, checkEnrollment);
router.put('/:id/progress', protect, authorize('student'), updateProgress);

module.exports = router;
