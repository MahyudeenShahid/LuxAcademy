/**
 * MongoDB Seed Script — populates the database with sample data.
 *
 * Usage:
 *   1. Make sure MongoDB is running (local or Atlas)
 *   2. Set MONGO_URI in backend/.env
 *   3. From the backend/ folder:  node seed.js
 *
 * This script overrides USE_MOCK_DB so it always uses real Mongoose.
 * ⚠️  WARNING: This clears ALL existing data in the database first.
 */

require("dotenv").config();
process.env.USE_MOCK_DB = "false"; // Must be before model requires

const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

// Real Mongoose models (USE_MOCK_DB is now false)
const User       = require("./models/User");
const Course     = require("./models/Course");
const Lesson     = require("./models/Lesson");
const Enrollment = require("./models/Enrollment");
const Review     = require("./models/Review");

/* ── helpers ── */
const hash = (p) => bcrypt.hashSync(p, 10);
const PWD  = hash("password123");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB:", process.env.MONGO_URI);

    /* ── clear ── */
    await Promise.all([
      User.deleteMany({}),
      Course.deleteMany({}),
      Lesson.deleteMany({}),
      Enrollment.deleteMany({}),
      Review.deleteMany({}),
    ]);
    console.log("🗑️  Cleared existing data");

    /* ── users ── */
    const [admin, inst1, inst2, inst3, stud1, stud2] = await User.insertMany([
      {
        name: "Admin User", email: "admin@lms.com", password: PWD, role: "admin",
        bio: "Platform administrator keeping LuxAcademy running smoothly.",
        avatar: "",
      },
      {
        name: "John Smith", email: "instructor@lms.com", password: PWD, role: "instructor",
        bio: "Senior full-stack developer with 10+ years building React, Node.js and MongoDB applications. Passionate about teaching modern web development.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      },
      {
        name: "Sarah Johnson", email: "sarah@lms.com", password: PWD, role: "instructor",
        bio: "UI/UX Designer and design systems expert with experience at top tech companies. Lover of clean interfaces and great user experiences.",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
      },
      {
        name: "Marcus Lee", email: "marcus@lms.com", password: PWD, role: "instructor",
        bio: "Data scientist and ML engineer. Author of two bestselling Python courses, previously at Google Brain.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      },
      {
        name: "Alice Student", email: "student@lms.com", password: PWD, role: "student",
        bio: "", avatar: "",
      },
      {
        name: "Bob Learner", email: "bob@lms.com", password: PWD, role: "student",
        bio: "", avatar: "",
      },
    ]);
    console.log("👥 Created 6 users");

    /* ── courses ── */
    const [c1, c2, c3, c4, c5, c6] = await Course.insertMany([
      {
        title: "Full-Stack React Development",
        description: "Build modern full-stack applications with React, Node.js, and MongoDB from scratch. Covers hooks, context, REST APIs, authentication, and deployment.",
        instructor: inst1._id, category: "Web Development", price: 99,
        level: "intermediate", duration: "20h", isPublished: true,
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
      },
      {
        title: "Node.js & Express API Masterclass",
        description: "Learn to build robust, production-ready REST APIs with Node.js, Express, and MongoDB. Covers JWT auth, file uploads, rate limiting, and testing.",
        instructor: inst1._id, category: "Backend Development", price: 89,
        level: "intermediate", duration: "18h", isPublished: true,
        thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
      },
      {
        title: "UI/UX Design Fundamentals",
        description: "Master the art of creating beautiful, user-centred digital products. Covers user research, wireframing, prototyping, and Figma from zero to hero.",
        instructor: inst2._id, category: "UI/UX Design", price: 79,
        level: "beginner", duration: "15h", isPublished: true,
        thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
      },
      {
        title: "Advanced Figma for Product Designers",
        description: "Take your Figma skills to the next level with components, auto-layout, design tokens, and developer hand-off workflows.",
        instructor: inst2._id, category: "UI/UX Design", price: 69,
        level: "advanced", duration: "12h", isPublished: true,
        thumbnail: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800",
      },
      {
        title: "Python for Data Science & Machine Learning",
        description: "Complete Python data science bootcamp: NumPy, Pandas, Matplotlib, Scikit-Learn, and intro to deep learning with TensorFlow.",
        instructor: inst3._id, category: "Data Science", price: 129,
        level: "beginner", duration: "30h", isPublished: true,
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
      },
      {
        title: "Machine Learning A–Z",
        description: "Go deep on supervised and unsupervised learning, neural networks, SVMs, decision trees, and more. Real datasets, real projects.",
        instructor: inst3._id, category: "Data Science", price: 149,
        level: "advanced", duration: "40h", isPublished: true,
        thumbnail: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800",
      },
    ]);
    console.log("📚 Created 6 courses");

    /* ── lessons ── */
    await Lesson.insertMany([
      // Course 1 — React
      { course: c1._id, title: "Introduction & Setup", order: 1, isFree: true, duration: "12m",
        content: "# Welcome to Full-Stack React!\n\nIn this course you will build a complete LMS app from scratch.\n\n## What You'll Need\n- Node.js 18+\n- VS Code\n- Basic JavaScript knowledge\n\n> This first lesson is free — no enrollment needed." },
      { course: c1._id, title: "React Fundamentals & JSX", order: 2, duration: "28m",
        content: "# React Fundamentals\n\nReact is a JavaScript library for building user interfaces.\n\n## Key Concepts\n- Components\n- Props\n- JSX syntax\n\n## Your First Component\n```jsx\nfunction Hello({ name }) {\n  return <h1>Hello, {name}!</h1>;\n}\n```" },
      { course: c1._id, title: "State, Hooks & Effects", order: 3, duration: "35m",
        content: "# Hooks Deep Dive\n\n`useState` and `useEffect` are the most important hooks.\n\n## useState Example\n```js\nconst [count, setCount] = useState(0);\n```\n\n## useEffect for Data Fetching\n```js\nuseEffect(() => { fetchData(); }, []);\n```" },
      { course: c1._id, title: "Building the REST API with Express", order: 4, duration: "40m",
        content: "# Express API\n\nWe'll build our backend API with Express and MongoDB.\n\n## Key Routes\n- GET /api/courses\n- POST /api/courses\n- PUT /api/courses/:id\n- DELETE /api/courses/:id" },
      // Course 3 — UX
      { course: c3._id, title: "What is UX Design?", order: 1, isFree: true, duration: "15m",
        content: "# Introduction to UX Design\n\nUX (User Experience) Design is about creating products that provide meaningful experiences.\n\n## The Design Process\n- Empathise\n- Define\n- Ideate\n- Prototype\n- Test" },
      { course: c3._id, title: "User Research Methods", order: 2, duration: "30m",
        content: "# User Research\n\nUnderstanding your users is the foundation of good UX.\n\n## Research Methods\n- Interviews\n- Surveys\n- Usability Testing\n- Analytics\n\n> Always start with research before designing." },
      { course: c3._id, title: "Wireframing & Prototyping", order: 3, duration: "45m",
        content: "# Wireframing\n\nWireframes are low-fidelity blueprints of your interface.\n\n## Tools\n- Figma (recommended)\n- Balsamiq\n- Whimsical\n\n## Tips\n- Focus on layout, not visual design\n- Use lorem ipsum text\n- Test early, test often" },
      // Course 5 — Python
      { course: c5._id, title: "Python Basics & Setup", order: 1, isFree: true, duration: "20m",
        content: "# Python for Data Science\n\nPython is the most popular language for data science and ML.\n\n## Setup\n1. Install Anaconda\n2. Launch Jupyter Notebook\n3. Create your first notebook\n\n## Why Python?\n- Simple syntax\n- Massive ecosystem\n- Industry standard" },
      { course: c5._id, title: "NumPy & Pandas", order: 2, duration: "50m",
        content: "# NumPy & Pandas\n\nThese two libraries are the backbone of data science in Python.\n\n## NumPy\n```python\nimport numpy as np\narr = np.array([1, 2, 3, 4, 5])\nprint(arr.mean())  # 3.0\n```\n\n## Pandas\n```python\nimport pandas as pd\ndf = pd.read_csv('data.csv')\ndf.describe()\n```" },
    ]);
    console.log("📖 Created lessons");

    /* ── enrollments ── */
    await Enrollment.insertMany([
      { student: stud1._id, course: c1._id, progress: 67 },
      { student: stud1._id, course: c3._id, progress: 100, completedAt: new Date("2025-01-10") },
      { student: stud1._id, course: c5._id, progress: 25 },
      { student: stud2._id, course: c1._id, progress: 33 },
      { student: stud2._id, course: c2._id, progress: 50 },
      { student: stud2._id, course: c4._id, progress: 0 },
    ]);
    console.log("🎓 Created enrollments");

    console.log("\n🌱 Database seeded successfully!\n");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Login credentials  (password: password123)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("  Admin      →  admin@lms.com");
    console.log("  Instructor →  instructor@lms.com  (John Smith)");
    console.log("  Instructor →  sarah@lms.com       (Sarah Johnson)");
    console.log("  Instructor →  marcus@lms.com      (Marcus Lee)");
    console.log("  Student    →  student@lms.com     (Alice)");
    console.log("  Student    →  bob@lms.com         (Bob)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    process.exit(0);
  } catch (err) {
    console.error("\n❌ Seed failed:", err.message);
    process.exit(1);
  }
};

seed();
