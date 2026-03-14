import api from './api';
import { MOCK_ENROLLMENTS, MOCK_INSTRUCTOR_ENROLLMENTS, MOCK_COURSES, isOfflineError } from './mockData';

export const enrollInCourseApi = async (courseId) => {
  try {
    const { data } = await api.post('/enrollments/enroll', { courseId });
    return { success: true, enrollment: data.enrollment };
  } catch (err) {
    if (isOfflineError(err)) {
      const course = MOCK_COURSES.find((c) => c._id === courseId) || MOCK_COURSES[0];
      return { success: true, enrollment: { _id: `e_${Date.now()}`, course, progress: 0, enrolledAt: new Date().toISOString() } };
    }
    return { success: false, message: err.response?.data?.message || 'Enrollment failed' };
  }
};

export const getMyEnrollmentsApi = async () => {
  try {
    const { data } = await api.get('/enrollments/my-courses');
    return { success: true, enrollments: data.enrollments };
  } catch (err) {
    if (isOfflineError(err)) {
      return { success: true, enrollments: MOCK_ENROLLMENTS };
    }
    return { success: false, message: err.response?.data?.message || 'Failed', enrollments: [] };
  }
};

export const updateProgressApi = async (enrollmentId, progress) => {
  try {
    const { data } = await api.put(`/enrollments/${enrollmentId}/progress`, { progress });
    return { success: true, enrollment: data.enrollment };
  } catch (err) {
    if (isOfflineError(err)) return { success: true };
    return { success: false, message: err.response?.data?.message || 'Failed' };
  }
};

export const checkEnrollmentApi = async (courseId) => {
  try {
    const { data } = await api.get(`/enrollments/check/${courseId}`);
    return { success: true, isEnrolled: data.isEnrolled, enrollment: data.enrollment };
  } catch (err) {
    if (isOfflineError(err)) {
      const found = MOCK_ENROLLMENTS.find((e) => e.course._id === courseId);
      return { success: true, isEnrolled: !!found, enrollment: found || null };
    }
    return { success: false, isEnrolled: false };
  }
};

export const getInstructorEnrollmentsApi = async () => {
  try {
    const { data } = await api.get('/enrollments/my-students');
    return { success: true, enrollments: data.enrollments };
  } catch (err) {
    if (isOfflineError(err)) return { success: true, enrollments: MOCK_INSTRUCTOR_ENROLLMENTS };
    return { success: false, enrollments: [], message: err.response?.data?.message || 'Failed' };
  }
};
