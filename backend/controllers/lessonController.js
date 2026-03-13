const Lesson = require('../models/Lesson');
const Course = require('../models/Course');

// @desc    Get lessons for a course (ordered)
// @route   GET /api/courses/:courseId/lessons
// @access  Private
const getLessons = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const lessons = await Lesson.find({ course: req.params.courseId }).sort({ order: 1 });
    res.json({ success: true, count: lessons.length, lessons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a lesson for a course
// @route   POST /api/courses/:courseId/lessons
// @access  Instructor (own course)
const createLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to add lessons to this course' });
    }

    const { title, content, videoUrl, order, duration, isFree } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Lesson title is required' });
    }

    const lesson = await Lesson.create({
      course: req.params.courseId,
      title,
      content,
      videoUrl,
      order,
      duration,
      isFree,
    });

    res.status(201).json({ success: true, lesson });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a lesson
// @route   PUT /api/courses/:courseId/lessons/:id
// @access  Instructor (own course)
const updateLesson = async (req, res) => {
  try {
    let lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    const course = await Course.findById(lesson.course);
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this lesson' });
    }

    lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, lesson });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a lesson
// @route   DELETE /api/courses/:courseId/lessons/:id
// @access  Instructor (own course)
const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    const course = await Course.findById(lesson.course);
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this lesson' });
    }

    await lesson.deleteOne();
    res.json({ success: true, message: 'Lesson deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getLessons, createLesson, updateLesson, deleteLesson };
