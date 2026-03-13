const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');

// @desc    Get all courses (with optional filters)
// @route   GET /api/courses
// @access  Public
const getAllCourses = async (req, res) => {
  try {
    const { category, search, instructor, isPublished } = req.query;
    const filter = {};

    if (category) filter.category = { $regex: category, $options: 'i' };
    if (search) filter.title = { $regex: search, $options: 'i' };
    if (instructor) filter.instructor = instructor;
    if (isPublished !== undefined) filter.isPublished = isPublished === 'true';

    const courses = await Course.find(filter)
      .populate('instructor', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: courses.length, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single course with lessons
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      'instructor',
      'name email avatar bio'
    );

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const lessons = await Lesson.find({ course: req.params.id }).sort({ order: 1 });
    const enrollmentCount = await Enrollment.countDocuments({ course: req.params.id });

    res.json({ success: true, course, lessons, enrollmentCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Instructor, Admin
const createCourse = async (req, res) => {
  try {
    const { title, description, category, price, thumbnail, level, duration } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ success: false, message: 'Title, description, and category are required' });
    }

    const course = await Course.create({
      title,
      description,
      category,
      price: price || 0,
      thumbnail,
      level,
      duration,
      instructor: req.user._id,
    });

    await course.populate('instructor', 'name email');
    res.status(201).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Instructor (own course), Admin
const updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Instructors can only update their own courses
    if (req.user.role === 'instructor' && course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this course' });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('instructor', 'name email');

    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Instructor (own course), Admin
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Instructors can only delete their own courses
    if (req.user.role === 'instructor' && course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this course' });
    }

    // Cascade delete related lessons and enrollments
    await Lesson.deleteMany({ course: req.params.id });
    await Enrollment.deleteMany({ course: req.params.id });
    await course.deleteOne();

    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get courses created by logged-in instructor
// @route   GET /api/courses/my-courses
// @access  Instructor
const getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id }).sort({ createdAt: -1 });

    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        const enrollmentCount = await Enrollment.countDocuments({ course: course._id });
        const lessonCount = await Lesson.countDocuments({ course: course._id });
        return { ...course.toObject(), enrollmentCount, lessonCount };
      })
    );

    res.json({ success: true, count: courses.length, courses: coursesWithStats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse, getMyCourses };
