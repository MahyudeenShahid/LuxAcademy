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
    const [admin, inst1, inst2, inst3, stud1, stud2, stud3, stud4] = await User.insertMany([
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
      {
        name: "Emma Wilson", email: "emma@lms.com", password: PWD, role: "student",
        bio: "", avatar: "",
      },
      {
        name: "David Chen", email: "david@lms.com", password: PWD, role: "student",
        bio: "", avatar: "",
      },
    ]);
    console.log("👥 Created 8 users");

    /* ── courses ── */
    const [c1, c2, c3, c4, c5, c6, c7] = await Course.insertMany([
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
      {
        title: "Machine Learning A–Z",
        description: "Go deep on supervised and unsupervised learning, neural networks, SVMs, decision trees, and more. Real datasets, real projects.",
        instructor: inst3._id, category: "Data Science", price: 149,
        level: "advanced", duration: "40h", isPublished: true,
        thumbnail: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800",
      },
      {
        title: "TypeScript for React Developers",
        description: "Add type safety to your React apps with TypeScript. Covers generics, interfaces, utility types, and strict-mode best practices.",
        instructor: inst1._id, category: "Web Development", price: 85,
        level: "intermediate", duration: "14h", isPublished: true,
        thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800",
      },
    ]);
    console.log("📚 Created 7 courses");

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
      // Course 2 — Node.js API
      { course: c2._id, title: "Node.js & Express Basics", order: 1, isFree: true, duration: "25m",
        content: "# Node.js & Express\n\nBuild your first REST API with Express in minutes.\n\n```js\nconst express = require('express');\nconst app = express();\napp.get('/api', (req, res) => res.json({ ok: true }));\napp.listen(5000);\n```" },
      { course: c2._id, title: "JWT Authentication", order: 2, duration: "40m",
        content: "# JWT Auth\n\nSecure your API with JSON Web Tokens.\n\n## Flow\n1. User logs in → server signs a JWT\n2. Client stores JWT in localStorage\n3. Client sends JWT in `Authorization: Bearer <token>` header\n4. Server verifies the JWT on every protected route" },
      { course: c2._id, title: "Testing with Jest & Supertest", order: 3, duration: "35m",
        content: "# API Testing\n\n```js\nconst request = require('supertest');\nconst app = require('../app');\n\ntest('GET /api/courses returns 200', async () => {\n  const res = await request(app).get('/api/courses');\n  expect(res.status).toBe(200);\n});\n```" },
      // Course 4 — Figma
      { course: c4._id, title: "Figma Component Basics", order: 1, isFree: true, duration: "20m",
        content: "# Figma Components\n\nComponents are reusable design elements that keep your design system consistent.\n\n## Creating a Component\n1. Design your element\n2. Select it\n3. Press `Ctrl+Alt+K` (⌥⌘K on Mac)\n\n> Changes to the master component propagate to all instances automatically." },
      { course: c4._id, title: "Auto-Layout Deep Dive", order: 2, duration: "45m",
        content: "# Auto-Layout\n\nAuto-layout lets frames resize automatically based on their content.\n\n## Key Properties\n- Direction: horizontal or vertical\n- Spacing: fixed or auto\n- Padding: uniform or per-side\n- Resizing: fixed, hug contents, fill container" },
      // Course 6 — React Native
      { course: c6._id, title: "React Native Setup & First App", order: 1, isFree: true, duration: "30m",
        content: "# Getting Started with React Native\n\n## Setup Options\n- **Expo** — recommended for beginners (zero config)\n- **React Native CLI** — full control\n\n```jsx\nimport { View, Text } from 'react-native';\nexport default function App() {\n  return <View><Text>Hello, World!</Text></View>;\n}\n```" },
      { course: c6._id, title: "Navigation with React Navigation", order: 2, duration: "50m",
        content: "# React Navigation\n\nThe most popular navigation library for React Native.\n\n## Stack Navigator\n```jsx\n<NavigationContainer>\n  <Stack.Navigator>\n    <Stack.Screen name=\"Home\" component={HomeScreen} />\n    <Stack.Screen name=\"Details\" component={DetailsScreen} />\n  </Stack.Navigator>\n</NavigationContainer>\n```" },
      // Course 7 — ML A-Z
      { course: c7._id, title: "Intro to Machine Learning", order: 1, isFree: true, duration: "35m",
        content: "# Machine Learning Overview\n\n## Types of ML\n- **Supervised** — labelled training data (regression, classification)\n- **Unsupervised** — unlabelled data (clustering, dimensionality reduction)\n- **Reinforcement** — learning from rewards\n\n## The ML Workflow\n1. Collect & clean data\n2. Choose & train a model\n3. Evaluate performance\n4. Tune & improve" },
      { course: c7._id, title: "Linear & Logistic Regression", order: 2, duration: "60m",
        content: "# Regression Models\n\n## Linear Regression\n```python\nfrom sklearn.linear_model import LinearRegression\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\nprint(model.score(X_test, y_test))\n```\n\n## Logistic Regression (Classification)\n```python\nfrom sklearn.linear_model import LogisticRegression\nmodel = LogisticRegression()\nmodel.fit(X_train, y_train)\n```" },
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
      { student: stud3._id, course: c1._id, progress: 45 },
      { student: stud3._id, course: c7._id, progress: 20 },
      { student: stud4._id, course: c3._id, progress: 100, completedAt: new Date("2025-02-20") },
      { student: stud4._id, course: c5._id, progress: 70 },
      { student: stud1._id, course: c6._id, progress: 55 },
    ]);
    console.log("🎓 Created enrollments");

    /* ── reviews ── */
    await Review.insertMany([
      { user: stud1._id, course: c1._id, instructor: inst1._id, rating: 5, comment: "Absolutely outstanding! This course transformed the way I think about full-stack development. John explains complex concepts with remarkable clarity." },
      { user: stud2._id, course: c1._id, instructor: inst1._id, rating: 4, comment: "Very comprehensive and well-structured. The hands-on projects really helped solidify the concepts. Would love even more exercises." },
      { user: stud1._id, course: c3._id, instructor: inst2._id, rating: 5, comment: "Sarah is a phenomenal instructor. Her passion for design is infectious and the course content is absolutely world-class." },
      { user: stud2._id, course: c2._id, instructor: inst1._id, rating: 4, comment: "Excellent API course. The JWT auth section was especially well done. Great pacing throughout." },
      { user: stud3._id, course: c1._id, instructor: inst1._id, rating: 4, comment: "Really well structured course. John's teaching style makes complex topics approachable. Looking forward to more courses!" },
      { user: stud3._id, course: c7._id, instructor: inst3._id, rating: 5, comment: "Marcus explains ML algorithms in a way that finally clicked for me. The hands-on Kaggle projects are excellent." },
      { user: stud4._id, course: c3._id, instructor: inst2._id, rating: 5, comment: "Sarah is an incredible instructor. This course completely changed how I approach design problems. Absolutely 10/10!" },
      { user: stud4._id, course: c5._id, instructor: inst3._id, rating: 4, comment: "The best Python data science course I have taken. Incredibly detailed and practical. A must for anyone getting into data science." },
      { user: stud1._id, course: c6._id, instructor: inst1._id, rating: 5, comment: "Finally a TypeScript course that respects your time! Concise, practical, and directly applied to real React projects." },
    ]);
    console.log("⭐ Created reviews");

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
    console.log("  Student    →  emma@lms.com        (Emma Wilson)");
    console.log("  Student    →  david@lms.com       (David Chen)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    process.exit(0);
  } catch (err) {
    console.error("\n❌ Seed failed:", err.message);
    process.exit(1);
  }
};

seed();
