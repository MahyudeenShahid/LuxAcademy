# Frontend Documentation — LuxAcademy LMS

## Overview

The frontend is a **React 18 + Vite** single-page application styled with **Tailwind CSS** and animated with **Framer Motion**.

It connects to the backend REST API and falls back to offline mock data when the server is unreachable.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | React 18 (Vite) |
| Routing | React Router v6 |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| HTTP Client | Axios |
| Icons | Lucide React |
| Build Tool | Vite |

---

## Directory Structure

```
frontend/src/
├── main.jsx                    # React entry point
├── App.jsx                     # Root with AuthProvider + Router
├── context/
│   └── AuthContext.jsx         # Global auth state (user, login, logout)
├── routes/
│   └── AppRoutes.jsx           # All <Route> declarations
├── pages/
│   ├── Home.jsx
│   ├── Courses.jsx             # Course catalogue with search/filter
│   ├── CourseDetail.jsx        # Course page with curriculum + reviews
│   ├── Dashboard.jsx           # Role-specific dashboard shell
│   ├── LessonViewer.jsx        # Full-screen lesson player
│   ├── Checkout.jsx            # Enrolment / checkout page
│   ├── InstructorsPage.jsx     # Public instructor listing
│   ├── InstructorProfile.jsx   # Individual instructor profile + reviews
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Pricing.jsx
│   ├── Contact.jsx
│   ├── About.jsx
│   └── NotFound.jsx            # 404 — animated page not found
├── components/
│   ├── Navbar.jsx              # Fixed top nav (role-aware dropdown)
│   ├── Footer.jsx
│   ├── ProtectedRoute.jsx
│   ├── ReviewSection.jsx       # Star-rating form + review list
│   ├── DashboardTour.jsx       # First-login guided tour overlay
│   └── dashboard/
│       ├── StudentDashboard.jsx
│       ├── InstructorDashboard.jsx
│       └── AdminDashboard.jsx
└── services/
    ├── api.js                  # Axios instance + 401 interceptor
    ├── authService.js
    ├── courseService.js
    ├── enrollmentService.js
    ├── userService.js
    ├── reviewService.js        # Course reviews + instructor reviews
    └── mockData.js             # Offline fallback data
```

---

## Environment Variables (`.env`)

```
VITE_API_URL=http://localhost:5000/api
```

---

## Routing (`AppRoutes.jsx`)

| Path | Component | Auth |
|---|---|---|
| `/` | Home | Public |
| `/courses` | Courses | Public |
| `/courses/:id` | CourseDetail | Public |
| `/instructors` | InstructorsPage | Public |
| `/instructors/:id` | InstructorProfile | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/pricing` | Pricing | Public |
| `/contact` | Contact | Public |
| `/about` | About | Public |
| `/dashboard` | Dashboard | Protected |
| `/learn/:courseId/lessons/:lessonId` | LessonViewer | Protected |
| `/checkout/:courseId` | Checkout | Protected |
| `*` | NotFound | Public |

---

## Service Layer

All service functions follow the **real API → offline fallback** pattern:

```js
export const someApi = async (params) => {
  try {
    const { data } = await api.get('/endpoint', { params });
    return { success: true, ...data };
  } catch (err) {
    if (isOfflineError(err)) return { success: true, ...MOCK_DATA };   // server down
    return { success: false, message: err.response?.data?.message };   // real API error
  }
};
```

`isOfflineError(err)` → `!err.response` (no network response = server unreachable)

### `services/api.js`

Axios instance with base URL from `VITE_API_URL`. Attaches `Authorization: Bearer <token>` from `localStorage`. On 401 response → auto-logout.

### `services/authService.js`

| Function | Endpoint |
|---|---|
| `loginApi(email, password)` | POST `/auth/login` |
| `registerApi(name, email, password)` | POST `/auth/register` |
| `getMeApi()` | GET `/auth/me` |
| `updateProfileApi(updates)` | PUT `/auth/profile` |

### `services/courseService.js`

| Function | Endpoint |
|---|---|
| `getAllCoursesApi(params)` | GET `/courses` |
| `getCourseByIdApi(id)` | GET `/courses/:id` |
| `getMyCoursesApi()` | GET `/courses/my-courses` |
| `createCourseApi(data)` | POST `/courses` |
| `updateCourseApi(id, updates)` | PUT `/courses/:id` |
| `deleteCourseApi(id)` | DELETE `/courses/:id` |
| `createLessonApi(courseId, data)` | POST `/courses/:id/lessons` |
| `getLessonsApi(courseId)` | GET `/courses/:id/lessons` |
| `deleteLessonApi(courseId, lessonId)` | DELETE `/courses/:id/lessons/:lid` |

### `services/enrollmentService.js`

| Function | Endpoint |
|---|---|
| `enrollInCourseApi(courseId)` | POST `/enrollments` |
| `getMyEnrollmentsApi()` | GET `/enrollments/my-courses` |
| `updateProgressApi(enrollmentId, progress)` | PUT `/enrollments/:id/progress` |
| `checkEnrollmentApi(courseId)` | GET `/enrollments/check/:courseId` |

### `services/reviewService.js`

| Function | Endpoint |
|---|---|
| `getCourseReviewsApi(courseId)` | GET `/courses/:id/reviews` |
| `createReviewApi(courseId, { rating, comment })` | POST `/courses/:id/reviews` |
| `getInstructorReviewsApi(instructorId)` | GET `/users/instructors/:id/reviews` |

### `services/userService.js`

| Function | Endpoint |
|---|---|
| `getAllUsersApi()` | GET `/users` |
| `getAnalyticsApi()` | GET `/users/analytics` |
| `deleteUserApi(id)` | DELETE `/users/:id` |
| `updateUserRoleApi(id, role)` | PUT `/users/:id` |
| `getInstructorsApi()` | GET `/users/instructors` |
| `getInstructorProfileApi(id)` | GET `/users/instructors/:id` |

---

## Auth Context (`context/AuthContext.jsx`)

```jsx
const { user, login, logout } = useAuth();
```

- `user` — full user object (from JWT decode + `/auth/me` fetch) or `null`
- `login(token)` — stores token in localStorage, fetches and sets user
- `logout()` — clears localStorage, resets user to null

---

## Offline Fallback (`services/mockData.js`)

When `isOfflineError(err)` is `true` (no backend running), all services return data from:

| Export | Used by |
|---|---|
| `MOCK_USERS` | Auth / admin services |
| `MOCK_COURSES` | Course service |
| `MOCK_LESSONS` | Course service |
| `MOCK_ENROLLMENTS` | Enrollment service |
| `MOCK_INSTRUCTOR_ENROLLMENTS` | Instructor dashboard |
| `MOCK_ANALYTICS` | Admin analytics |
| `MOCK_INSTRUCTORS` | User service |
| `MOCK_INSTRUCTOR_PROFILE` | User service |
| `MOCK_REVIEWS` | Review service (per course) |
| `MOCK_INSTRUCTOR_REVIEWS` | Review service (per instructor) |

---

## Running the Frontend

```bash
cd frontend
npm install
npm run dev       # → http://localhost:5173
```

The frontend auto-detects if the backend is offline and falls back to mock data seamlessly.
