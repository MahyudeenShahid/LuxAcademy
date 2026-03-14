// Centralized mock data — used as fallback when backend is offline

export const MOCK_USERS = [
  { _id: 'u1', name: 'Alex Carter', email: 'student@lms.com', role: 'student', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', createdAt: '2024-09-01' },
  { _id: 'u2', name: 'Sarah Jenkins', email: 'instructor@lms.com', role: 'instructor', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', createdAt: '2024-08-15' },
  { _id: 'u3', name: 'Platform Admin', email: 'admin@lms.com', role: 'admin', avatar: '', createdAt: '2024-01-01' },
  { _id: 'u4', name: 'John Smith', email: 'john@student.com', role: 'student', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150', createdAt: '2024-10-05' },
  { _id: 'u5', name: 'Emma Wilson', email: 'emma@instructor.com', role: 'instructor', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', createdAt: '2024-07-20' },
  { _id: 'u6', name: 'Liam Garcia', email: 'liam@student.com', role: 'student', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', createdAt: '2024-11-01' },
];

export const MOCK_COURSES = [
  {
    _id: 'c1',
    title: 'User Experience Design Fundamentals',
    description: 'Master the art of creating intuitive and engaging digital experiences from scratch. Learn user research, wireframing, and interactive prototyping.',
    instructor: { _id: 'u2', name: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' },
    category: 'UI/UX Design',
    price: 19,
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    isPublished: true,
    level: 'beginner',
    duration: '4 Weeks',
    enrollmentCount: 24500,
    createdAt: '2024-09-10',
  },
  {
    _id: 'c2',
    title: 'Frontend Web Development Bootcamp',
    description: 'A comprehensive bootcamp covering HTML, CSS, JavaScript, and React. Build real-world projects and land your first dev job.',
    instructor: { _id: 'u5', name: 'Emma Wilson', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150' },
    category: 'Web Development',
    price: 30,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    isPublished: true,
    level: 'intermediate',
    duration: '12 Weeks',
    enrollmentCount: 18200,
    createdAt: '2024-08-20',
  },
  {
    _id: 'c3',
    title: 'Introduction to Graphic Design',
    description: 'Learn the core principles of graphic design — typography, color theory, layout, and brand identity using industry tools.',
    instructor: { _id: 'u2', name: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' },
    category: 'Graphic Design',
    price: 25,
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80',
    isPublished: true,
    level: 'beginner',
    duration: '3 Weeks',
    enrollmentCount: 12400,
    createdAt: '2024-10-01',
  },
  {
    _id: 'c4',
    title: "Beginner's Guide to Data Analysis",
    description: 'Get started with data analysis using Python, Pandas, and Matplotlib. Understand data cleaning, visualization, and storytelling.',
    instructor: { _id: 'u5', name: 'Emma Wilson', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150' },
    category: 'Data Science',
    price: 50,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    isPublished: true,
    level: 'beginner',
    duration: '8 Weeks',
    enrollmentCount: 9800,
    createdAt: '2024-11-05',
  },
  {
    _id: 'c5',
    title: 'Apple App Development Basics',
    description: 'Dive into iOS development with Swift and Xcode. Build your first app and understand the App Store submission process.',
    instructor: { _id: 'u2', name: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' },
    category: 'Mobile Development',
    price: 40,
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
    isPublished: true,
    level: 'beginner',
    duration: '6 Weeks',
    enrollmentCount: 7600,
    createdAt: '2024-09-25',
  },
  {
    _id: 'c6',
    title: 'Advanced System Design',
    description: 'Master system design interviews and real-world architecture patterns — load balancing, caching, databases, and microservices.',
    instructor: { _id: 'u5', name: 'Emma Wilson', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150' },
    category: 'Web Development',
    price: 60,
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    isPublished: true,
    level: 'advanced',
    duration: '10 Weeks',
    enrollmentCount: 5400,
    createdAt: '2024-10-15',
  },
];

export const MOCK_LESSONS = {
  c1: [
    { _id: 'l1', title: 'Introduction to UX Thinking', order: 1, duration: '45m', isFree: true },
    { _id: 'l2', title: 'User Research Methods', order: 2, duration: '1h 10m', isFree: false },
    { _id: 'l3', title: 'Creating User Personas', order: 3, duration: '55m', isFree: false },
    { _id: 'l4', title: 'Wireframing Basics', order: 4, duration: '1h 20m', isFree: false },
    { _id: 'l5', title: 'Prototyping with Figma', order: 5, duration: '1h 30m', isFree: false },
  ],
  c2: [
    { _id: 'l6', title: 'HTML Foundations', order: 1, duration: '1h', isFree: true },
    { _id: 'l7', title: 'CSS Flexbox & Grid', order: 2, duration: '1h 20m', isFree: false },
    { _id: 'l8', title: 'JavaScript Essentials', order: 3, duration: '2h', isFree: false },
    { _id: 'l9', title: 'React Fundamentals', order: 4, duration: '2h 30m', isFree: false },
  ],
};

export const MOCK_ENROLLMENTS = [
  { _id: 'e1', student: MOCK_USERS[0], course: MOCK_COURSES[0], progress: 68, enrolledAt: '2024-10-12' },
  { _id: 'e2', student: MOCK_USERS[0], course: MOCK_COURSES[1], progress: 35, enrolledAt: '2024-11-01' },
  { _id: 'e3', student: MOCK_USERS[0], course: MOCK_COURSES[2], progress: 100, enrolledAt: '2024-09-20' },
];

export const MOCK_INSTRUCTOR_ENROLLMENTS = [
  { _id: 'e1', student: MOCK_USERS[0], course: MOCK_COURSES[0], progress: 68, enrolledAt: '2024-10-12' },
  { _id: 'e4', student: MOCK_USERS[3], course: MOCK_COURSES[0], progress: 35, enrolledAt: '2024-11-01' },
  { _id: 'e5', student: MOCK_USERS[5], course: MOCK_COURSES[0], progress: 100, enrolledAt: '2024-09-20' },
  { _id: 'e6', student: MOCK_USERS[0], course: MOCK_COURSES[2], progress: 50, enrolledAt: '2024-10-05' },
];

export const MOCK_ANALYTICS = {
  users: { total: 45210, students: 44520, instructors: 342, admins: 5 },
  courses: { total: 1250, published: 980 },
  enrollments: { total: 82400 },
  recentUsers: [
    { _id: { year: 2024, month: 7 }, count: 320 },
    { _id: { year: 2024, month: 8 }, count: 480 },
    { _id: { year: 2024, month: 9 }, count: 610 },
    { _id: { year: 2024, month: 10 }, count: 740 },
    { _id: { year: 2024, month: 11 }, count: 890 },
    { _id: { year: 2024, month: 12 }, count: 1020 },
  ],
  coursesByCategory: [
    { _id: 'Web Development', count: 380 },
    { _id: 'Data Science', count: 210 },
    { _id: 'UI/UX Design', count: 175 },
    { _id: 'Mobile Development', count: 140 },
    { _id: 'Graphic Design', count: 95 },
  ],
};

// Determine if an error is a network/server-unavailable error
export const isOfflineError = (err) => !err.response;

// Generate a fake JWT-like token for mock sessions
export const mockToken = (userId) => `mock.${userId}.token`;
