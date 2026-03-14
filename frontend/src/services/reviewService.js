import api from './api';
import { MOCK_REVIEWS, MOCK_INSTRUCTOR_REVIEWS, isOfflineError } from './mockData';

export const getCourseReviewsApi = async (courseId) => {
  try {
    const { data } = await api.get(`/courses/${courseId}/reviews`);
    return { success: true, reviews: data.reviews, avgRating: data.avgRating, totalReviews: data.totalReviews };
  } catch (err) {
    if (isOfflineError(err)) {
      const reviews = MOCK_REVIEWS[courseId] || [];
      const avg = reviews.length
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : 0;
      return { success: true, reviews, avgRating: Number(avg), totalReviews: reviews.length };
    }
    return { success: false, reviews: [], avgRating: 0, totalReviews: 0, message: err.response?.data?.message || 'Failed' };
  }
};

export const createReviewApi = async (courseId, { rating, comment }) => {
  try {
    const { data } = await api.post(`/courses/${courseId}/reviews`, { rating, comment });
    return { success: true, review: data.review };
  } catch (err) {
    if (isOfflineError(err)) {
      // Simulate a created review for offline mode
      const mockReview = {
        _id: `r_${Date.now()}`,
        user: { _id: 'me', name: 'You', avatar: '' },
        rating,
        comment,
        createdAt: new Date().toISOString(),
      };
      return { success: true, review: mockReview };
    }
    return { success: false, message: err.response?.data?.message || 'Failed to submit review' };
  }
};

export const getInstructorReviewsApi = async (instructorId) => {
  try {
    const { data } = await api.get(`/users/instructors/${instructorId}/reviews`);
    return { success: true, reviews: data.reviews, avgRating: data.avgRating, totalReviews: data.totalReviews };
  } catch (err) {
    if (isOfflineError(err)) {
      const reviews = MOCK_INSTRUCTOR_REVIEWS[instructorId] || [];
      const avg = reviews.length
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : 0;
      return { success: true, reviews, avgRating: Number(avg), totalReviews: reviews.length };
    }
    return { success: false, reviews: [], avgRating: 0, totalReviews: 0, message: err.response?.data?.message || 'Failed' };
  }
};
