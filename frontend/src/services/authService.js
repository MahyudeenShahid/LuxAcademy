import api from './api';
import { MOCK_USERS, isOfflineError, mockToken } from './mockData';

// ----- Mock helpers -----
const findMockUser = (email) => MOCK_USERS.find((u) => u.email === email);

const mockLoginFallback = (email) => {
  // Role detection by email keyword for demo convenience
  let role = 'student';
  if (email.includes('admin')) role = 'admin';
  else if (email.includes('instructor')) role = 'instructor';

  const found = MOCK_USERS.find((u) => u.role === role) || MOCK_USERS[0];
  const user = { ...found, email, name: found.name };
  const token = mockToken(user._id);
  return { success: true, token, user };
};

const mockRegisterFallback = (name, email, role) => {
  const newUser = {
    _id: `u_${Date.now()}`,
    name,
    email,
    role: ['student', 'instructor'].includes(role) ? role : 'student',
    avatar: '',
  };
  const token = mockToken(newUser._id);
  return { success: true, token, user: newUser };
};

// ----- Auth Service -----
export const loginApi = async (email, password) => {
  try {
    const { data } = await api.post('/auth/login', { email, password });
    return { success: true, ...data };
  } catch (err) {
    if (isOfflineError(err)) return mockLoginFallback(email);
    return { success: false, message: err.response?.data?.message || 'Login failed' };
  }
};

export const registerApi = async (name, email, password, role) => {
  try {
    const { data } = await api.post('/auth/register', { name, email, password, role });
    return { success: true, ...data };
  } catch (err) {
    if (isOfflineError(err)) return mockRegisterFallback(name, email, role);
    return { success: false, message: err.response?.data?.message || 'Registration failed' };
  }
};

export const getMeApi = async () => {
  try {
    const { data } = await api.get('/auth/me');
    return { success: true, user: data.user };
  } catch (err) {
    if (isOfflineError(err)) {
      // Reconstruct user from localStorage role during offline mode
      const role = localStorage.getItem('role') || 'student';
      const found = MOCK_USERS.find((u) => u.role === role) || MOCK_USERS[0];
      return { success: true, user: found };
    }
    return { success: false };
  }
};

export const updateProfileApi = async (updates) => {
  try {
    const { data } = await api.put('/auth/me', updates);
    return { success: true, user: data.user };
  } catch (err) {
    if (isOfflineError(err)) {
      // Return the updates merged — purely local in offline mode
      return { success: true, user: updates };
    }
    return { success: false, message: err.response?.data?.message || 'Update failed' };
  }
};
