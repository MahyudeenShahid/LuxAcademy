import api from './api';
import { MOCK_COURSES, MOCK_LESSONS, isOfflineError } from './mockData';

export const getAllCoursesApi = async (params = {}) => {
  try {
    const { data } = await api.get('/courses', { params });
    return { success: true, courses: data.courses };
  } catch (err) {
    if (isOfflineError(err)) {
      let courses = [...MOCK_COURSES];
      if (params.category) courses = courses.filter((c) => c.category.toLowerCase().includes(params.category.toLowerCase()));
      if (params.search) courses = courses.filter((c) => c.title.toLowerCase().includes(params.search.toLowerCase()));
      return { success: true, courses };
    }
    return { success: false, message: err.response?.data?.message || 'Failed to fetch courses', courses: [] };
  }
};

export const getCourseByIdApi = async (id) => {
  try {
    const { data } = await api.get(`/courses/${id}`);
    return { success: true, course: data.course, lessons: data.lessons, enrollmentCount: data.enrollmentCount };
  } catch (err) {
    if (isOfflineError(err)) {
      const course = MOCK_COURSES.find((c) => c._id === id) || MOCK_COURSES[0];
      const lessons = MOCK_LESSONS[course._id] || [];
      return { success: true, course, lessons, enrollmentCount: course.enrollmentCount };
    }
    return { success: false, message: err.response?.data?.message || 'Course not found' };
  }
};

export const getMyCoursesApi = async () => {
  try {
    const { data } = await api.get('/courses/my-courses');
    return { success: true, courses: data.courses };
  } catch (err) {
    if (isOfflineError(err)) {
      return { success: true, courses: MOCK_COURSES.slice(0, 2).map((c) => ({ ...c, enrollmentCount: Math.floor(Math.random() * 2000 + 500), lessonCount: 8 })) };
    }
    return { success: false, message: err.response?.data?.message || 'Failed', courses: [] };
  }
};

export const createCourseApi = async (courseData) => {
  try {
    const { data } = await api.post('/courses', courseData);
    return { success: true, course: data.course };
  } catch (err) {
    if (isOfflineError(err)) {
      const newCourse = { _id: `c_${Date.now()}`, ...courseData, isPublished: false, enrollmentCount: 0, createdAt: new Date().toISOString() };
      return { success: true, course: newCourse };
    }
    return { success: false, message: err.response?.data?.message || 'Failed to create course' };
  }
};

export const updateCourseApi = async (id, updates) => {
  try {
    const { data } = await api.put(`/courses/${id}`, updates);
    return { success: true, course: data.course };
  } catch (err) {
    if (isOfflineError(err)) {
      return { success: true, course: { _id: id, ...updates } };
    }
    return { success: false, message: err.response?.data?.message || 'Failed to update' };
  }
};

export const deleteCourseApi = async (id) => {
  try {
    await api.delete(`/courses/${id}`);
    return { success: true };
  } catch (err) {
    if (isOfflineError(err)) return { success: true };
    return { success: false, message: err.response?.data?.message || 'Failed to delete' };
  }
};

export const createLessonApi = async (courseId, lessonData) => {
  try {
    const { data } = await api.post(`/courses/${courseId}/lessons`, lessonData);
    return { success: true, lesson: data.lesson };
  } catch (err) {
    if (isOfflineError(err)) {
      return { success: true, lesson: { _id: `l_${Date.now()}`, ...lessonData, course: courseId } };
    }
    return { success: false, message: err.response?.data?.message || 'Failed to create lesson' };
  }
};
