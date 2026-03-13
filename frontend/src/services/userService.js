import api from './api';
import { MOCK_USERS, MOCK_ANALYTICS, MOCK_ENROLLMENTS, isOfflineError } from './mockData';

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
