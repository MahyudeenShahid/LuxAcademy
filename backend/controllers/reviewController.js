const Review     = require('../models/Review');
const Course     = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// POST /api/courses/:courseId/reviews  (protected — enrolled student)
const createReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Rating and comment are required' });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    const enrolled = await Enrollment.findOne({ student: req.user._id, course: courseId });
    if (!enrolled) {
      return res.status(403).json({ success: false, message: 'You must be enrolled to leave a review' });
    }

    const existing = await Review.findOne({ user: req.user._id, course: courseId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this course' });
    }

    const review = await Review.create({
      user:       req.user._id,
      course:     courseId,
      instructor: course.instructor,
      rating:     Number(rating),
      comment,
    });

    await review.populate('user', 'name avatar');
    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/courses/:courseId/reviews  (public)
const getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.params;
    const reviews = await Review.find({ course: courseId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    const avgRating = reviews.length
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    res.json({ success: true, reviews, avgRating: Number(avgRating), totalReviews: reviews.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/users/instructors/:id/reviews  (public)
const getInstructorReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await Review.find({ instructor: id })
      .populate('user', 'name avatar')
      .populate('course', 'title thumbnail')
      .sort({ createdAt: -1 });

    const avgRating = reviews.length
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    res.json({ success: true, reviews, avgRating: Number(avgRating), totalReviews: reviews.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/courses/:courseId/reviews/:id  (admin or review owner)
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    const isOwner = String(review.user) === String(req.user._id);
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await review.deleteOne();
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createReview, getCourseReviews, getInstructorReviews, deleteReview };
