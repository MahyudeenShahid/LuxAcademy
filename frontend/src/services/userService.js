import api from './api';
import { MOCK_USERS, MOCK_ANALYTICS, MOCK_ENROLLMENTS, MOCK_INSTRUCTORS, MOCK_INSTRUCTOR_PROFILE, isOfflineError } from './mockData';

export const getAllUsersApi = async () => {
  try {
    const { data } = await api.get('/users');
    return { success: true, users: data.users };
  } catch (err) {
    if (isOfflineError(err)) return { success: true, users: MOCK_USERS };
    return { success: false, message: err.response?.data?.message || 'Failed', users: [] };
  }
};

export const deleteUserApi = async (id) => {
  try {
    await api.delete(`/users/${id}`);
    return { success: true };
  } catch (err) {
    if (isOfflineError(err)) return { success: true };
    return { success: false, message: err.response?.data?.message || 'Failed to delete user' };
  }
};

export const getAnalyticsApi = async () => {
  try {
    const { data } = await api.get('/users/analytics');
    return { success: true, analytics: data.analytics };
  } catch (err) {
    if (isOfflineError(err)) return { success: true, analytics: MOCK_ANALYTICS };
    return { success: false, message: err.response?.data?.message || 'Failed' };
  }
};

export const getAllEnrollmentsApi = async () => {
  try {
    const { data } = await api.get('/enrollments');
    return { success: true, enrollments: data.enrollments };
  } catch (err) {
    if (isOfflineError(err)) return { success: true, enrollments: MOCK_ENROLLMENTS };
    return { success: false, enrollments: [] };
  }
};

export const updateUserRoleApi = async (id, role) => {
  try {
    const { data } = await api.put(`/users/${id}`, { role });
    return { success: true, user: data.user };
  } catch (err) {
    if (isOfflineError(err)) return { success: true, user: { _id: id, role } };
    return { success: false, message: err.response?.data?.message || 'Failed to update role' };
  }
};

export const getInstructorsApi = async () => {
  try {
    const { data } = await api.get('/users/instructors');
    return { success: true, instructors: data.instructors };
  } catch (err) {
    if (isOfflineError(err)) return { success: true, instructors: MOCK_INSTRUCTORS };
    return { success: false, instructors: [], message: err.response?.data?.message || 'Failed' };
  }
};

export const getInstructorProfileApi = async (id) => {
  try {
    const { data } = await api.get(`/users/instructors/${id}`);
    return { success: true, instructor: data.instructor, courses: data.courses };
  } catch (err) {
    if (isOfflineError(err)) return { success: true, ...MOCK_INSTRUCTOR_PROFILE };
    return { success: false, instructor: null, courses: [], message: err.response?.data?.message || 'Failed' };
  }
};
