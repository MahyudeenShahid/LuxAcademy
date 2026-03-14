# Database Documentation — LuxAcademy LMS

## Overview

LuxAcademy uses **MongoDB** with **Mongoose** as its ODM. The database name is `lms` (configurable via `MONGO_URI`).

An in-memory **mock store** (`data/mockStore.js`) mirrors the same Mongoose API and is used for development or when MongoDB is unreachable.

---

## Collections

### 1. `users`

Stores all platform users (students, instructors, admins).

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto-generated |
| `name` | String | required, max 50 chars |
| `email` | String | required, unique, lowercase |
| `password` | String | bcrypt hash, min 6 chars |
| `role` | String | enum: `student`, `instructor`, `admin` — default: `student` |
| `avatar` | String | URL |
| `bio` | String | max 500 chars |
| `createdAt` | Date | Mongoose timestamps |
| `updatedAt` | Date | Mongoose timestamps |

**Indexes:** `email` (unique)

**Virtual / Methods:**
- `matchPassword(plain)` — compares bcrypt hash

---

### 2. `courses`

Published and draft courses created by instructors.

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | |
| `instructor` | ObjectId | ref: `User`, required |
| `title` | String | required, max 150 chars |
| `description` | String | max 3000 chars |
| `category` | String | e.g. `Web Development`, `Data Science` |
| `price` | Number | 0 = free, default: 0 |
| `level` | String | enum: `beginner`, `intermediate`, `advanced` |
| `thumbnail` | String | URL |
| `duration` | String | e.g. `12h`, `4 Weeks` |
| `isPublished` | Boolean | default: `false` |
| `createdAt` | Date | |
| `updatedAt` | Date | |

**Populated fields:** `instructor` (name, avatar)

---

### 3. `lessons`

Individual lessons belonging to a course.

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | |
| `course` | ObjectId | ref: `Course`, required |
| `title` | String | required |
| `content` | String | Text content / transcript |
| `videoUrl` | String | YouTube or direct URL |
| `order` | Number | Sort order within course |
| `duration` | String | e.g. `45m`, `1h 20m` |
| `isFree` | Boolean | Free preview — default: `false` |
| `createdAt` | Date | |
| `updatedAt` | Date | |

**Populated fields:** `course`

---

### 4. `enrollments`

Tracks which student is enrolled in which course, and their progress.

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | |
| `student` | ObjectId | ref: `User`, required |
| `course` | ObjectId | ref: `Course`, required |
| `progress` | Number | 0–100, default: 0 |
| `enrolledAt` | Date | default: now |
| `completedAt` | Date | null until 100% progress |
| `createdAt` | Date | |
| `updatedAt` | Date | |

**Indexes:** `{ student, course }` — unique (prevents duplicate enrollments)

**Populated fields:** `student` (name, email, avatar), `course` (title, thumbnail, instructor)

---

### 5. `reviews`

One review per student per course, linked to the instructor for easy querying.

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | |
| `user` | ObjectId | ref: `User`, required — the reviewer |
| `course` | ObjectId | ref: `Course`, required |
| `instructor` | ObjectId | ref: `User`, required — denormalised for fast instructor queries |
| `rating` | Number | 1–5, required |
| `comment` | String | required, max 1000 chars |
| `createdAt` | Date | |
| `updatedAt` | Date | |

**Indexes:** `{ user, course }` — unique (one review per enrollment)

**Populated fields:** `user` (name, avatar), `course` (title, thumbnail)

---

## Entity Relationships

```
User (instructor) ──< Course ──< Lesson
                           │
User (student) ───< Enrollment ──> Course
                           │
User (student) ───< Review ──> Course
                         └──> User (instructor)
```

---

## Aggregations Used

### Platform Analytics (`GET /api/users/analytics`)

```js
// Monthly new users (last 6 months)
User.aggregate([
  { $match:  { createdAt: { $gte: sixMonthsAgo } } },
  { $group:  { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
  { $sort:   { '_id.year': 1, '_id.month': 1 } },
]);

// Courses by category
Course.aggregate([
  { $group: { _id: '$category', count: { $sum: 1 } } },
  { $sort:  { count: -1 } },
]);
```

### Average Rating (computed in controller)

```js
const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
```

---

## Seeding the Database

```bash
cd backend
# Prerequisites: .env with MONGO_URI pointing to your MongoDB
node seed.js
```

The seed script creates:

| Collection | Records |
|---|---|
| users | 6 (1 admin, 3 instructors, 2 students) |
| courses | 6 (mix of categories and difficulty) |
| lessons | 9 (across multiple courses) |
| enrollments | 6 |
| reviews | — (submit via UI after enrolling) |

### Seed Credentials

| Email | Password | Role |
|---|---|---|
| admin@lms.com | password123 | admin |
| instructor@lms.com | password123 | instructor |
| sarah@lms.com | password123 | instructor |
| student@lms.com | password123 | student |
| bob@lms.com | password123 | student |

---

## Mock Store Collections (Dev Mode)

When `USE_MOCK_DB=true`, the same 5 collections are held in memory:

```
store.users       → 5 documents
store.courses     → 6 documents
store.lessons     → 8 documents
store.enrollments → 4 documents
store.reviews     → 6 documents
```

All data resets on server restart.

---

## Indexes Summary

| Collection | Index | Type |
|---|---|---|
| users | `email` | Unique |
| enrollments | `{ student, course }` | Unique compound |
| reviews | `{ user, course }` | Unique compound |

---

## Connection Config (`config/db.js`)

```js
await mongoose.connect(process.env.MONGO_URI);
// Returns true on success, false on failure (never calls process.exit)
```

The server boot sequence handles the boolean return and falls back to the mock store if `false`.
