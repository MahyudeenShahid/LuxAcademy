# MERN Stack Learning Management System — Project Plan

> **Course:** MERN Stack Web Development
> **Assessment:** Final Project (Full Stack Application)
> **Total Marks:** 100
> **Duration:** 2–3 Weeks

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Folder Structure](#3-folder-structure)
4. [Database Design](#4-database-design)
5. [Backend API Design](#5-backend-api-design)
6. [Frontend Pages & Components](#6-frontend-pages--components)
7. [Role-Based Access Control](#7-role-based-access-control)
8. [Step-by-Step Implementation Plan](#8-step-by-step-implementation-plan)
9. [Marking Scheme Alignment](#9-marking-scheme-alignment)
10. [Submission Checklist](#10-submission-checklist)

---

## 1. Project Overview

A **Full Fledged Learning Management System (LMS)** built using the MERN stack. The platform supports three distinct user roles — **Admin**, **Instructor**, and **Student** — each with their own dashboard and feature set.

**Core Features:**
- User registration and login with JWT authentication
- Role-based dashboards and protected routes
- Course creation, editing, and deletion by instructors
- Student course browsing, enrollment, and progress tracking
- Admin panel for user management and analytics

---

## 2. Tech Stack

### Frontend
| Technology         | Purpose                          |
|--------------------|----------------------------------|
| React JS           | UI framework                     |
| React Router v6    | Client-side routing              |
| Axios              | HTTP requests to backend API     |
| Tailwind CSS       | Utility-first styling            |
| React Bootstrap    | Pre-built UI components          |
| Context API        | Global state (auth, user role)   |

### Backend
| Technology         | Purpose                          |
|--------------------|----------------------------------|
| Node.js            | Runtime environment              |
| Express.js         | REST API framework               |
| MongoDB            | NoSQL database                   |
| Mongoose           | ODM for MongoDB                  |
| JWT                | Token-based authentication       |
| Bcrypt             | Password hashing                 |
| Dotenv             | Environment variable management  |
| CORS               | Cross-origin resource sharing    |
| Morgan             | HTTP request logger              |

---

## 3. Folder Structure

```
project_ecom/
│
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── userController.js
│   │   └── enrollmentController.js
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification
│   │   └── roleMiddleware.js      # Role-based access
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Lesson.js
│   │   └── Enrollment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── userRoutes.js
│   │   └── enrollmentRoutes.js
│   ├── .env
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── CourseCard.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── Loader.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Courses.jsx
│   │   │   ├── CourseDetail.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── student/
│   │   │   │   ├── StudentDashboard.jsx
│   │   │   │   ├── MyCourses.jsx
│   │   │   │   └── Profile.jsx
│   │   │   ├── instructor/
│   │   │   │   ├── InstructorDashboard.jsx
│   │   │   │   ├── CreateCourse.jsx
│   │   │   │   ├── ManageCourses.jsx
│   │   │   │   └── UploadLesson.jsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── ManageUsers.jsx
│   │   │       ├── AdminCourses.jsx
│   │   │       └── Analytics.jsx
│   │   ├── services/
│   │   │   ├── api.js             # Axios instance
│   │   │   ├── authService.js
│   │   │   ├── courseService.js
│   │   │   └── enrollmentService.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Auth state management
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx      # Centralized routing
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── PROJECT_PLAN.md
└── README.md
```

---

## 4. Database Design

### User Model
```js
{
  name:       { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  password:   { type: String, required: true },          // bcrypt hashed
  role:       { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' },
  avatar:     { type: String },
  timestamps: true
}
```

### Course Model
```js
{
  title:       { type: String, required: true },
  description: { type: String, required: true },
  instructor:  { type: ObjectId, ref: 'User', required: true },
  category:    { type: String, required: true },
  price:       { type: Number, default: 0 },
  thumbnail:   { type: String },
  isPublished: { type: Boolean, default: false },
  timestamps:  true
}
```

### Lesson Model
```js
{
  course:    { type: ObjectId, ref: 'Course', required: true },
  title:     { type: String, required: true },
  content:   { type: String },
  videoUrl:  { type: String },
  order:     { type: Number },
  timestamps: true
}
```

### Enrollment Model
```js
{
  student:   { type: ObjectId, ref: 'User', required: true },
  course:    { type: ObjectId, ref: 'Course', required: true },
  progress:  { type: Number, default: 0, min: 0, max: 100 },
  enrolledAt: { type: Date, default: Date.now },
  timestamps: true
}
```

---

## 5. Backend API Design

### Authentication Routes — `/api/auth`
| Method | Endpoint    | Access  | Description         |
|--------|-------------|---------|---------------------|
| POST   | `/register` | Public  | Register new user   |
| POST   | `/login`    | Public  | Login, returns JWT  |
| GET    | `/me`       | Private | Get current user    |

### Course Routes — `/api/courses`
| Method | Endpoint       | Access            | Description            |
|--------|----------------|-------------------|------------------------|
| GET    | `/`            | Public            | Get all courses        |
| GET    | `/:id`         | Public            | Get single course      |
| POST   | `/`            | Instructor, Admin | Create a course        |
| PUT    | `/:id`         | Instructor, Admin | Update a course        |
| DELETE | `/:id`         | Instructor, Admin | Delete a course        |

### Lesson Routes — `/api/courses/:courseId/lessons`
| Method | Endpoint | Access            | Description          |
|--------|----------|-------------------|----------------------|
| GET    | `/`      | Private           | Get lessons of course|
| POST   | `/`      | Instructor        | Upload a lesson      |
| DELETE | `/:id`   | Instructor        | Delete a lesson      |

### User Routes — `/api/users`
| Method | Endpoint  | Access | Description      |
|--------|-----------|--------|------------------|
| GET    | `/`       | Admin  | Get all users    |
| DELETE | `/:id`    | Admin  | Delete a user    |
| GET    | `/:id`    | Admin  | Get single user  |

### Enrollment Routes — `/api/enrollments`
| Method | Endpoint      | Access  | Description              |
|--------|---------------|---------|--------------------------|
| POST   | `/enroll`     | Student | Enroll in a course       |
| GET    | `/my-courses` | Student | Get enrolled courses     |
| PUT    | `/:id/progress` | Student | Update course progress |

---

## 6. Frontend Pages & Components

### Public Pages
| Page            | Route             | Description                           |
|-----------------|-------------------|---------------------------------------|
| Home            | `/`               | Hero section, featured courses, CTA   |
| About           | `/about`          | Platform info, team, mission          |
| Course Listing  | `/courses`        | All courses with filter/search        |
| Course Detail   | `/courses/:id`    | Description, lessons preview, enroll  |
| Login           | `/login`          | JWT login form                        |
| Register        | `/register`       | Role selection + registration form    |

### Student Dashboard — `/dashboard/student`
| Page        | Route                         | Description                |
|-------------|-------------------------------|----------------------------|
| Dashboard   | `/dashboard/student`          | Overview, enrolled courses |
| My Courses  | `/dashboard/student/courses`  | Enrolled course list       |
| Profile     | `/dashboard/student/profile`  | View/edit profile          |

### Instructor Dashboard — `/dashboard/instructor`
| Page           | Route                               | Description             |
|----------------|-------------------------------------|-------------------------|
| Dashboard      | `/dashboard/instructor`             | Overview stats          |
| Create Course  | `/dashboard/instructor/create`      | Course creation form    |
| Manage Courses | `/dashboard/instructor/courses`     | Edit/delete courses     |
| Upload Lesson  | `/dashboard/instructor/lessons/:id` | Add lessons to course   |

### Admin Dashboard — `/dashboard/admin`
| Page           | Route                         | Description               |
|----------------|-------------------------------|---------------------------|
| Dashboard      | `/dashboard/admin`            | System analytics overview |
| Manage Users   | `/dashboard/admin/users`      | View/delete users         |
| Manage Courses | `/dashboard/admin/courses`    | View/delete any course    |
| Analytics      | `/dashboard/admin/analytics`  | Charts, stats, reports    |

---

## 7. Role-Based Access Control

```
Public Routes       → Anyone can access
Protected Routes    → Must be logged in (valid JWT)
Student Routes      → role === 'student'
Instructor Routes   → role === 'instructor'
Admin Routes        → role === 'admin'
```

**Middleware Chain:**
```
Request → authMiddleware (verify JWT) → roleMiddleware (check role) → Controller
```

---

## 8. Step-by-Step Implementation Plan

---

### STEP 1 — Project Setup & Configuration
**Goal:** Initialize both frontend and backend projects with all dependencies.

**Backend:**
- [ ] `mkdir backend && cd backend && npm init -y`
- [ ] Install: `express mongoose dotenv bcryptjs jsonwebtoken cors morgan`
- [ ] Create `server.js` with Express app setup
- [ ] Create `.env` with `MONGO_URI`, `JWT_SECRET`, `PORT`
- [ ] Create `config/db.js` for MongoDB connection via Mongoose
- [ ] Test server starts and DB connects

**Frontend:**
- [ ] `npm create vite@latest frontend -- --template react`
- [ ] Install: `axios react-router-dom react-bootstrap bootstrap tailwindcss`
- [ ] Configure Tailwind CSS (`tailwind.config.js`, `index.css`)
- [ ] Create `.env` with `VITE_API_URL=http://localhost:5000/api`
- [ ] Clean up default Vite template files

---

### STEP 2 — Database Models
**Goal:** Define all Mongoose schemas.

- [ ] `models/User.js` — name, email, password, role, timestamps
- [ ] `models/Course.js` — title, description, instructor ref, category, price, thumbnail, isPublished
- [ ] `models/Lesson.js` — course ref, title, content, videoUrl, order
- [ ] `models/Enrollment.js` — student ref, course ref, progress, enrolledAt
- [ ] Add pre-save hook on User model to hash password with bcrypt
- [ ] Add unique index on User email

---

### STEP 3 — Authentication Backend
**Goal:** Implement register, login, and JWT middleware.

- [ ] `controllers/authController.js`
  - `register`: validate input → check duplicate email → hash password → save user → return JWT
  - `login`: find user → compare password with bcrypt → generate JWT → return token + user info
  - `getMe`: decode token → return current user
- [ ] `middleware/authMiddleware.js` — extract Bearer token, verify JWT, attach `req.user`
- [ ] `middleware/roleMiddleware.js` — check `req.user.role` against allowed roles
- [ ] `routes/authRoutes.js` — wire up routes
- [ ] Test with Postman: register → login → access protected route

---

### STEP 4 — Course & Lesson Backend APIs
**Goal:** Full CRUD for courses and lesson upload.

- [ ] `controllers/courseController.js`
  - `getAllCourses`: populate instructor name, support query filters
  - `getCourseById`: populate instructor + lessons
  - `createCourse`: instructor/admin only → validate → save
  - `updateCourse`: owner or admin only → update fields
  - `deleteCourse`: owner or admin only → delete course + its lessons
- [ ] `controllers/lessonController.js`
  - `getLessons`: get all lessons for a course (ordered)
  - `createLesson`: instructor only → validate → save
  - `deleteLesson`: instructor only → delete
- [ ] `routes/courseRoutes.js` + `routes/lessonRoutes.js`
- [ ] Test all CRUD endpoints with Postman

---

### STEP 5 — User & Enrollment Backend APIs
**Goal:** Admin user management and student enrollment.

- [ ] `controllers/userController.js`
  - `getAllUsers`: admin only → return all users (exclude passwords)
  - `deleteUser`: admin only → delete user + their enrollments
  - `getUserById`: admin only
- [ ] `controllers/enrollmentController.js`
  - `enrollInCourse`: student only → check duplicate → create enrollment
  - `getMyCourses`: student only → populate course details
  - `updateProgress`: student only → update progress %
- [ ] `routes/userRoutes.js` + `routes/enrollmentRoutes.js`
- [ ] Mount all routes in `server.js` under `/api`

---

### STEP 6 — Frontend: Auth Context & Services
**Goal:** Global auth state and Axios service layer.

- [ ] `services/api.js` — Axios instance with `baseURL`, request interceptor to attach JWT from localStorage
- [ ] `services/authService.js` — `register()`, `login()`, `getMe()`
- [ ] `services/courseService.js` — `getCourses()`, `getCourse()`, `createCourse()`, `updateCourse()`, `deleteCourse()`
- [ ] `services/enrollmentService.js` — `enroll()`, `getMyCourses()`, `updateProgress()`
- [ ] `context/AuthContext.jsx` — `user`, `token`, `login()`, `logout()`, `isAuthenticated`, `role`
- [ ] Wrap `App.jsx` with `AuthProvider`

---

### STEP 7 — Frontend: Routing & Protected Routes
**Goal:** Set up all routes with role-based guards.

- [ ] `routes/AppRoutes.jsx` — define all routes using React Router v6
- [ ] `components/ProtectedRoute.jsx` — redirect unauthenticated users to `/login`
- [ ] `components/RoleRoute.jsx` — redirect users without required role to `/unauthorized`
- [ ] Structure routes:
  - Public: `/`, `/about`, `/courses`, `/courses/:id`, `/login`, `/register`
  - Student: `/dashboard/student/*`
  - Instructor: `/dashboard/instructor/*`
  - Admin: `/dashboard/admin/*`

---

### STEP 8 — Frontend: Public Pages
**Goal:** Build all public-facing pages.

- [ ] `Navbar.jsx` — logo, navigation links, login/register or dashboard button based on auth state
- [ ] `Footer.jsx` — links, copyright
- [ ] `Home.jsx` — hero banner, features section, featured courses section
- [ ] `About.jsx` — platform description, team/mission section
- [ ] `Courses.jsx` — fetch all courses, display `CourseCard` grid, search/filter by category
- [ ] `CourseDetail.jsx` — fetch course by ID, show details, lesson list preview, Enroll button
- [ ] `CourseCard.jsx` — reusable card component (thumbnail, title, instructor, price, category)
- [ ] `Login.jsx` — form → call `authService.login()` → save to context → redirect by role
- [ ] `Register.jsx` — form with role select → call `authService.register()` → redirect to login

---

### STEP 9 — Frontend: Student Dashboard
**Goal:** Build student-specific pages.

- [ ] `StudentDashboard.jsx` — welcome message, stats (enrolled courses count), quick links
- [ ] `MyCourses.jsx` — fetch `/my-courses`, display enrolled courses with progress bar
- [ ] `Profile.jsx` — display user info (name, email, role), option to update name/avatar

---

### STEP 10 — Frontend: Instructor Dashboard
**Goal:** Build instructor-specific pages.

- [ ] `InstructorDashboard.jsx` — overview of own courses, total enrollments count
- [ ] `CreateCourse.jsx` — form (title, description, category, price, thumbnail URL) → POST `/courses`
- [ ] `ManageCourses.jsx` — list own courses with Edit and Delete buttons
- [ ] `EditCourse.jsx` — pre-filled form → PUT `/courses/:id`
- [ ] `UploadLesson.jsx` — select course → form (title, content, videoUrl, order) → POST lesson

---

### STEP 11 — Frontend: Admin Dashboard
**Goal:** Build admin-specific pages.

- [ ] `AdminDashboard.jsx` — stats cards: total users, total courses, total enrollments
- [ ] `ManageUsers.jsx` — table of all users with Delete button → DELETE `/users/:id`
- [ ] `AdminCourses.jsx` — table of all courses with Delete button → DELETE `/courses/:id`
- [ ] `Analytics.jsx` — charts using Chart.js or Recharts: users by role, courses by category, enrollments over time

---

### STEP 12 — UI/UX Polish
**Goal:** Consistent, professional design across all pages.

- [ ] Responsive layout (mobile-first with Tailwind breakpoints)
- [ ] Loading spinner (`Loader.jsx`) while API calls are in progress
- [ ] Toast notifications for success/error feedback (React-Toastify)
- [ ] Form validation with user-friendly error messages
- [ ] Empty state UI (no courses found, no enrollments yet)
- [ ] 404 Not Found page
- [ ] Unauthorized access page

---

### STEP 13 — Error Handling & Security
**Goal:** Robust error handling on both frontend and backend.

**Backend:**
- [ ] Global error handler middleware in `server.js`
- [ ] Try/catch in all controllers with meaningful HTTP status codes
- [ ] Input validation (check required fields before DB operations)
- [ ] No passwords returned in any API response

**Frontend:**
- [ ] Axios response interceptor — handle 401 (logout + redirect to login)
- [ ] Display server error messages in forms
- [ ] Handle network errors gracefully

---

### STEP 14 — Testing
**Goal:** Verify all features work end-to-end.

- [ ] Test all backend routes in Postman (create a Postman collection)
- [ ] Test auth flow: register → login → access protected route → logout
- [ ] Test role restrictions: student cannot create course, instructor cannot manage users
- [ ] Test enrollment: enroll in course → see in My Courses → update progress
- [ ] Test admin: delete user → delete course
- [ ] Test responsive design on mobile, tablet, desktop

---

### STEP 15 — README & Submission
**Goal:** Complete documentation and prepare submission.

- [ ] Write `README.md` with:
  - Project overview and features
  - Screenshots of all major pages
  - Installation steps for both frontend and backend
  - Environment variable reference (`.env.example`)
  - Technologies used
  - API endpoint documentation
- [ ] Push final code to GitHub with clean commit history
- [ ] (Optional) Deploy backend to Render/Railway, frontend to Vercel/Netlify
- [ ] Verify live deployment works end-to-end

---

## 9. Marking Scheme Alignment

| Criteria                    | Marks | How to Score Full Marks                                       |
|-----------------------------|-------|---------------------------------------------------------------|
| UI/UX Design                | 15    | Responsive, clean Tailwind/Bootstrap design, consistent theme |
| React Implementation        | 15    | Components, hooks, Context API, React Router, Axios           |
| Backend API Development     | 20    | All required REST endpoints, proper status codes, validation  |
| Database Design             | 15    | All 4 models with correct fields, refs, indexes               |
| Authentication & Security   | 15    | Bcrypt hashing, JWT, protected routes, env variables          |
| Role-Based Functionality    | 10    | All 3 dashboards fully functional with correct access control |
| Code Quality & Structure    | 5     | Proper folder structure, no hardcoded values, clean code      |
| Deployment & Testing        | 5     | Live deployment link, Postman tested, README with screenshots |
| **Total**                   | **100** |                                                             |

---

## 10. Submission Checklist

- [ ] GitHub repository link shared
- [ ] Live deployment link (Render + Vercel or similar)
- [ ] `README.md` with overview, installation, screenshots, technologies
- [ ] `.env.example` files included (no real secrets committed)
- [ ] All 15 implementation steps completed
- [ ] All 3 role dashboards functional (Admin, Instructor, Student)
- [ ] All required API endpoints implemented
- [ ] Responsive design verified
- [ ] No hardcoded credentials anywhere in the codebase

---

## Development Timeline (3 Weeks)

| Week   | Steps     | Focus                                           |
|--------|-----------|-------------------------------------------------|
| Week 1 | 1 – 5     | Project setup, models, all backend APIs         |
| Week 2 | 6 – 11    | Frontend setup, routing, all pages & dashboards |
| Week 3 | 12 – 15   | UI polish, error handling, testing, README      |

---

*Plan created: March 2026 | MERN Stack Final Project*
