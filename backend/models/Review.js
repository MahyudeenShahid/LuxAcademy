if (process.env.USE_MOCK_DB === 'true') {
  module.exports = require('../data/mockStore').MockReview;
  return;
}

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

// One review per student per course
reviewSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
