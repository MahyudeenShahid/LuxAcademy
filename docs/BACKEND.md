# Backend Documentation — LuxAcademy LMS

## Overview

The backend is a **Node.js / Express** REST API that powers the LuxAcademy Learning Management System. It runs in two modes:

| Mode | When | DB |
|---|---|---|
| **Mock DB** | `USE_MOCK_DB=true` or MongoDB unreachable | In-memory arrays |
| **Live DB** | `USE_MOCK_DB=false` + valid `MONGO_URI` | MongoDB via Mongoose |

---

## Technology Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (≥18) |
| Framework | Express 4 |
| Database | MongoDB + Mongoose 8 |
| Auth | JWT (`jsonwebtoken`) + bcryptjs |
| Logging | morgan |
| Env Vars | dotenv |

---

## Directory Structure

```
backend/
├── server.js               # Entry point — async bootstrap, route registration
├── config/
│   └── db.js               # MongoDB connect; returns boolean, never exits
├── data/
│   └── mockStore.js        # In-memory MongoDB-compatible store (5 mock models)
├── models/
│   ├── User.js             # Mongoose User schema (conditional mock export)
│   ├── Course.js           # Mongoose Course schema
│   ├── Lesson.js           # Mongoose Lesson schema
│   ├── Enrollment.js       # Mongoose Enrollment schema
│   └── Review.js           # Mongoose Review schema
├── controllers/
│   ├── authController.js
│   ├── courseController.js
│   ├── lessonController.js
│   ├── enrollmentController.js
│   ├── userController.js
│   └── reviewController.js
├── routes/
│   ├── authRoutes.js
│   ├── courseRoutes.js     # Includes nested /lessons and /reviews
│   ├── userRoutes.js       # Includes public instructor + review routes
│   └── enrollmentRoutes.js
├── middleware/
│   ├── authMiddleware.js   # protect — verifies JWT, attaches req.user
│   └── roleMiddleware.js   # authorize(...roles) — RBAC guard
├── seed.js                 # MongoDB seed script (always uses real Mongoose)
└── .env                    # Environment variables
```

---

## Environment Variables (`.env`)

| Variable | Example | Description |
|---|---|---|
| `PORT` | `5000` | HTTP server port |
| `MONGO_URI` | `mongodb://localhost:27017/lms` | MongoDB connection string |
| `JWT_SECRET` | `supersecretkey` | Secret for signing JWTs |
| `JWT_EXPIRES_IN` | `30d` | JWT expiry duration |
| `NODE_ENV` | `development` | Enables morgan HTTP logging |
| `USE_MOCK_DB` | `true` | Skip MongoDB, use in-memory data |

---

## Startup Sequence (`server.js`)

```
1. dotenv.config() — load .env
2. if USE_MOCK_DB=true → skip DB, log warning
3. else → await connectDB()
   • success → use live MongoDB
   • fail    → set USE_MOCK_DB=true (fallback)
4. app.use('/api/...', require('./routes/...'))  ← loaded AFTER DB decision
5. app.listen(PORT)
```

> Routes are required **after** the DB decision so every model file sees the final `USE_MOCK_DB` flag at `require` time.

---

## API Endpoints

### Auth — `/api/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/register` | Public | Register a new user |
| POST | `/login` | Public | Log in, returns JWT |
| GET | `/me` | Protected | Get current user profile |
| PUT | `/profile` | Protected | Update name / bio / avatar / password |

### Courses — `/api/courses`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | Public | List all published courses (search, filter) |
| GET | `/:id` | Public | Get course + lessons + enrollment count |
| POST | `/` | Instructor/Admin | Create a new course |
| PUT | `/:id` | Instructor/Admin | Update course |
| DELETE | `/:id` | Instructor/Admin | Delete course |
| GET | `/my-courses` | Instructor | My courses |

### Lessons (nested) — `/api/courses/:courseId/lessons`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | Protected | Get all lessons for a course |
| POST | `/` | Instructor/Admin | Add a lesson |
| PUT | `/:id` | Instructor/Admin | Update a lesson |
| DELETE | `/:id` | Instructor/Admin | Delete a lesson |

### Reviews (nested) — `/api/courses/:courseId/reviews`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | Public | Get all reviews + avg rating |
| POST | `/` | Student (enrolled only) | Submit a review |
| DELETE | `/:id` | Owner or Admin | Delete a review |

### Users — `/api/users`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/instructors` | Public | List all instructors |
| GET | `/instructors/:id` | Public | Instructor profile + courses |
| GET | `/instructors/:id/reviews` | Public | All reviews for an instructor |
| GET | `/` | Admin | All users |
| GET | `/analytics` | Admin | Platform analytics |
| GET | `/:id` | Admin | Get user by ID |
| PUT | `/:id` | Admin | Update user role |
| DELETE | `/:id` | Admin | Delete user (cascading) |

### Enrollments — `/api/enrollments`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | Student | Enroll in a course |
| GET | `/my-courses` | Student | My enrolled courses + progress |
| PUT | `/:id/progress` | Student | Update progress % |
| GET | `/check/:courseId` | Protected | Check enrollment status |

---

## Mock Store (`data/mockStore.js`)

The mock store mirrors the Mongoose model API so controllers can be **model-agnostic**.

### Supported Methods

| Method | Behaviour |
|---|---|
| `find(filter)` | Returns `MockQuery` (chainable) |
| `findOne(filter)` | Returns `MockQuery` |
| `findById(id)` | Returns `MockQuery` |
| `create(data)` | Persists to in-memory array, returns `makeDoc` |
| `findByIdAndUpdate(id, updates, opts)` | In-place update, returns `MockQuery` |
| `deleteMany(filter)` | Removes matching items |
| `countDocuments(filter)` | Returns count |
| `aggregate(pipeline)` | Handles `$match`, `$group`, `$sort` |

### MockQuery Chains

```js
Model.find(filter).populate('instructor').sort({ createdAt: -1 }).select('name email');
```

### Seeded Collections

| Collection | Count | Notes |
|---|---|---|
| users | 8 | 1 admin, 3 instructors, 4 students |
| courses | 8 | Mix of published/draft, multiple categories |
| lessons | 16 | Spread across courses |
| enrollments | 9 | Four students enrolled across multiple courses |
| reviews | 12 | Cross-course reviews with ratings 3–5 |

### Seed Credentials

| Email | Password | Role |
|---|---|---|
| admin@lms.com | password123 | admin |
| instructor@lms.com | password123 | instructor |
| sarah@lms.com | password123 | instructor |
| marcus@lms.com | password123 | instructor |
| student@lms.com | password123 | student |
| bob@lms.com | password123 | student |
| emma@lms.com | password123 | student |
| david@lms.com | password123 | student |

---

## Authentication

- JWT issued on `/api/auth/login` — payload: `{ id }`
- `protect` middleware verifies token, attaches full `req.user` (without password)
- `authorize(...roles)` guard applied per route: `authorize('admin')`, `authorize('instructor', 'admin')`

---

## Running the Backend

```bash
# Mock DB (no MongoDB required)
cd backend
node server.js        # → http://localhost:5000

# Live MongoDB
# 1. Set USE_MOCK_DB=false and MONGO_URI in .env
# 2. Seed the database:
node seed.js
# 3. Start the server:
node server.js
```

---

## Seeding MongoDB (`seed.js`)

```bash
cd backend
# Ensure .env has: MONGO_URI=mongodb://... and USE_MOCK_DB=false
node seed.js
```

The seed script:
1. Forces `USE_MOCK_DB=false` (overrides .env) so it always uses real Mongoose
2. Clears all collections
3. Creates 8 users, 7 courses, 18+ lessons, 11 enrollments, 9 reviews
4. Prints login credentials table on success
