'use strict';
/**
 * In-memory mock store — mirrors the Mongoose model API used by all controllers.
 * Used when USE_MOCK_DB=true (or when MongoDB is unreachable).
 */

const bcrypt = require('bcryptjs');

// ━━━ Seed IDs ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const IDS = {
  admin:   'mock-u-admin',
  inst1:   'mock-u-inst1',
  inst2:   'mock-u-inst2',
  stud1:   'mock-u-stud1',
  stud2:   'mock-u-stud2',
  course1: 'mock-c-1',
  course2: 'mock-c-2',
  course3: 'mock-c-3',
  course4: 'mock-c-4',
  course5: 'mock-c-5',
  course6: 'mock-c-6',
  les1:    'mock-l-1',
  les2:    'mock-l-2',
  les3:    'mock-l-3',
  les4:    'mock-l-4',
  les5:    'mock-l-5',
  les6:    'mock-l-6',
  les7:    'mock-l-7',
  les8:    'mock-l-8',
  enroll1: 'mock-e-1',
  enroll2: 'mock-e-2',
  enroll3: 'mock-e-3',
  enroll4: 'mock-e-4',
  rev1:    'mock-r-1',
  rev2:    'mock-r-2',
  rev3:    'mock-r-3',
  rev4:    'mock-r-4',
  rev5:    'mock-r-5',
  rev6:    'mock-r-6',
  rev7:    'mock-r-7',
  rev8:    'mock-r-8',
  rev9:    'mock-r-9',
  rev10:   'mock-r-10',
  rev11:   'mock-r-11',
  rev12:   'mock-r-12',
  inst3:   'mock-u-inst3',
  stud3:   'mock-u-stud3',
  stud4:   'mock-u-stud4',
  course7: 'mock-c-7',
  course8: 'mock-c-8',
  les9:    'mock-l-9',
  les10:   'mock-l-10',
  les11:   'mock-l-11',
  les12:   'mock-l-12',
  les13:   'mock-l-13',
  les14:   'mock-l-14',
  les15:   'mock-l-15',
  les16:   'mock-l-16',
  enroll5: 'mock-e-5',
  enroll6: 'mock-e-6',
  enroll7: 'mock-e-7',
  enroll8: 'mock-e-8',
  enroll9: 'mock-e-9',
};

// Pre-hash password once at load time (bcrypt sync, rounds=10 ≈ 65ms each)
const HASH = (p) => bcrypt.hashSync(p, 10);
const PWD  = HASH('password123');

// ━━━ In-memory collections ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const store = {
  users: [
    { _id: IDS.admin, name: 'Admin User',     email: 'admin@lms.com',       password: PWD, role: 'admin',      avatar: '', bio: 'Platform administrator', createdAt: new Date('2024-01-01') },
    { _id: IDS.inst1, name: 'John Smith',     email: 'instructor@lms.com',  password: PWD, role: 'instructor', avatar: '', bio: 'Senior web developer',   createdAt: new Date('2024-01-05') },
    { _id: IDS.inst2, name: 'Sarah Johnson',  email: 'sarah@lms.com',       password: PWD, role: 'instructor', avatar: '', bio: 'UI/UX Designer',          createdAt: new Date('2024-01-10') },
    { _id: IDS.stud1, name: 'Alice Student',  email: 'student@lms.com',     password: PWD, role: 'student',    avatar: '', bio: '',                       createdAt: new Date('2024-02-01') },
    { _id: IDS.stud2, name: 'Bob Learner',    email: 'bob@lms.com',         password: PWD, role: 'student',    avatar: '', bio: '',                       createdAt: new Date('2024-02-15') },
    { _id: IDS.inst3, name: 'Marcus Lee',     email: 'marcus@lms.com',      password: PWD, role: 'instructor', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', bio: 'Data scientist and ML engineer. Previously at Google Brain.', createdAt: new Date('2024-01-15') },
    { _id: IDS.stud3, name: 'Emma Wilson',    email: 'emma@lms.com',        password: PWD, role: 'student',    avatar: '', bio: '',                       createdAt: new Date('2024-03-01') },
    { _id: IDS.stud4, name: 'David Chen',     email: 'david@lms.com',       password: PWD, role: 'student',    avatar: '', bio: '',                       createdAt: new Date('2024-03-10') },
  ],

  courses: [
    {
      _id: IDS.course1, instructor: IDS.inst1, isPublished: true,
      title: 'Full-Stack React Development',
      description: 'Build modern full-stack applications with React, Node.js, and MongoDB from scratch.',
      category: 'Web Development', price: 99, level: 'intermediate', duration: '20h',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      createdAt: new Date('2024-02-01'),
    },
    {
      _id: IDS.course2, instructor: IDS.inst2, isPublished: true,
      title: 'Advanced UI/UX Design',
      description: 'Master modern design principles, prototyping, and user research techniques.',
      category: 'UI/UX Design', price: 79, level: 'advanced', duration: '15h',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
      createdAt: new Date('2024-02-10'),
    },
    {
      _id: IDS.course3, instructor: IDS.inst1, isPublished: true,
      title: 'Python for Data Science',
      description: 'Learn Python, Pandas, and machine learning fundamentals with real-world datasets.',
      category: 'Data Science', price: 0, level: 'beginner', duration: '12h',
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800',
      createdAt: new Date('2024-02-15'),
    },
    {
      _id: IDS.course4, instructor: IDS.inst1, isPublished: false,
      title: 'Node.js Microservices',
      description: 'Design, build and deploy scalable microservices with Node.js and Docker.',
      category: 'Web Development', price: 129, level: 'advanced', duration: '25h',
      thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
      createdAt: new Date('2024-03-01'),
    },
    {
      _id: IDS.course5, instructor: IDS.inst2, isPublished: true,
      title: 'Graphic Design Masterclass',
      description: 'From basics to advanced techniques in Illustrator, Photoshop and beyond.',
      category: 'Graphic Design', price: 89, level: 'beginner', duration: '18h',
      thumbnail: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800',
      createdAt: new Date('2024-03-10'),
    },
    {
      _id: IDS.course6, instructor: IDS.inst1, isPublished: true,
      title: 'React Native Mobile Development',
      description: 'Build cross-platform mobile apps for iOS and Android with React Native.',
      category: 'Mobile Development', price: 109, level: 'intermediate', duration: '22h',
      thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
      createdAt: new Date('2024-03-15'),
    },
    {
      _id: IDS.course7, instructor: IDS.inst3, isPublished: true,
      title: 'Machine Learning A–Z',
      description: 'Go deep on supervised and unsupervised learning, neural networks, SVMs, and decision trees with real-world datasets.',
      category: 'Data Science', price: 149, level: 'advanced', duration: '40h',
      thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800',
      createdAt: new Date('2024-04-01'),
    },
    {
      _id: IDS.course8, instructor: IDS.inst1, isPublished: true,
      title: 'TypeScript for React Developers',
      description: 'Add type safety to your React apps with TypeScript. Covers generics, interfaces, utility types, and strict-mode best practices.',
      category: 'Web Development', price: 85, level: 'intermediate', duration: '14h',
      thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
      createdAt: new Date('2024-04-10'),
    },
  ],

  lessons: [
    { _id: IDS.les1, course: IDS.course1, title: 'Introduction to React',      content: 'Overview of the React ecosystem.',            videoUrl: '', order: 1, duration: '45m',  isFree: true  },
    { _id: IDS.les2, course: IDS.course1, title: 'State and Props',            content: 'Core React concepts in depth.',               videoUrl: '', order: 2, duration: '60m',  isFree: false },
    { _id: IDS.les3, course: IDS.course1, title: 'Hooks Deep Dive',            content: 'useState, useEffect, custom hooks.',          videoUrl: '', order: 3, duration: '75m',  isFree: false },
    { _id: IDS.les4, course: IDS.course2, title: 'Design Fundamentals',        content: 'Core design principles.',                     videoUrl: '', order: 1, duration: '50m',  isFree: true  },
    { _id: IDS.les5, course: IDS.course2, title: 'Colour Theory & Typography', content: 'Using colour and type to create hierarchy.',  videoUrl: '', order: 2, duration: '65m',  isFree: false },
    { _id: IDS.les6, course: IDS.course2, title: 'Prototyping in Figma',       content: 'Build interactive prototypes fast.',          videoUrl: '', order: 3, duration: '80m',  isFree: false },
    { _id: IDS.les7, course: IDS.course3, title: 'Python Basics',              content: 'Variables, loops, and functions.',            videoUrl: '', order: 1, duration: '55m',  isFree: true  },
    { _id: IDS.les8, course: IDS.course3, title: 'Pandas & DataFrames',        content: 'Data manipulation with Pandas.',              videoUrl: '', order: 2, duration: '70m',  isFree: false },
    // Course 4 — Node.js Microservices
    { _id: IDS.les9,  course: IDS.course4, title: 'Intro to Microservices',         content: 'What are microservices and why use them? Overview of service boundaries and communication patterns.', videoUrl: '', order: 1, duration: '40m', isFree: true  },
    { _id: IDS.les10, course: IDS.course4, title: 'Docker & Containers',            content: 'Containerise your Node.js services with Docker. Writing Dockerfiles and docker-compose.yml.',         videoUrl: '', order: 2, duration: '55m', isFree: false },
    // Course 5 — Graphic Design
    { _id: IDS.les11, course: IDS.course5, title: 'Intro to Graphic Design',        content: 'Core design principles: balance, contrast, alignment, repetition, and proximity.',                    videoUrl: '', order: 1, duration: '35m', isFree: true  },
    { _id: IDS.les12, course: IDS.course5, title: 'Working with Adobe Illustrator', content: 'Vectors, paths, and shapes. Creating scalable logos and illustrations.',                               videoUrl: '', order: 2, duration: '60m', isFree: false },
    // Course 7 — ML A-Z
    { _id: IDS.les13, course: IDS.course7, title: 'Intro to Machine Learning',      content: 'Supervised vs unsupervised learning. The ML workflow: data → model → evaluate → improve.',           videoUrl: '', order: 1, duration: '35m', isFree: true  },
    { _id: IDS.les14, course: IDS.course7, title: 'Linear & Logistic Regression',   content: 'Core regression algorithms with scikit-learn. Loss functions, gradient descent, and evaluation metrics.', videoUrl: '', order: 2, duration: '60m', isFree: false },
    // Course 8 — TypeScript
    { _id: IDS.les15, course: IDS.course8, title: 'TypeScript Basics',              content: 'Types, interfaces, enums, and the TypeScript compiler. Migrating a JS file to TS step by step.',      videoUrl: '', order: 1, duration: '30m', isFree: true  },
    { _id: IDS.les16, course: IDS.course8, title: 'Generics & Utility Types',       content: 'Mastering TypeScript generics and built-in utility types: Partial, Required, Pick, Omit, Record.',    videoUrl: '', order: 2, duration: '45m', isFree: false },
  ],

  enrollments: [
    { _id: IDS.enroll1, student: IDS.stud1, course: IDS.course1, progress: 100, enrolledAt: new Date('2024-03-01'), completedAt: new Date('2024-03-20'), createdAt: new Date('2024-03-01') },
    { _id: IDS.enroll2, student: IDS.stud1, course: IDS.course2, progress: 80,  enrolledAt: new Date('2024-03-05'), completedAt: null,                  createdAt: new Date('2024-03-05') },
    { _id: IDS.enroll3, student: IDS.stud2, course: IDS.course1, progress: 60,  enrolledAt: new Date('2024-03-10'), completedAt: null,                  createdAt: new Date('2024-03-10') },
    { _id: IDS.enroll4, student: IDS.stud2, course: IDS.course3, progress: 100, enrolledAt: new Date('2024-03-12'), completedAt: new Date('2024-04-01'), createdAt: new Date('2024-03-12') },
    { _id: IDS.enroll5, student: IDS.stud3, course: IDS.course1, progress: 45,  enrolledAt: new Date('2024-05-01'), completedAt: null,                  createdAt: new Date('2024-05-01') },
    { _id: IDS.enroll6, student: IDS.stud3, course: IDS.course7, progress: 20,  enrolledAt: new Date('2024-05-10'), completedAt: null,                  createdAt: new Date('2024-05-10') },
    { _id: IDS.enroll7, student: IDS.stud4, course: IDS.course2, progress: 100, enrolledAt: new Date('2024-05-05'), completedAt: new Date('2024-06-01'), createdAt: new Date('2024-05-05') },
    { _id: IDS.enroll8, student: IDS.stud4, course: IDS.course5, progress: 70,  enrolledAt: new Date('2024-05-20'), completedAt: null,                  createdAt: new Date('2024-05-20') },
    { _id: IDS.enroll9, student: IDS.stud1, course: IDS.course8, progress: 55,  enrolledAt: new Date('2024-06-01'), completedAt: null,                  createdAt: new Date('2024-06-01') },
  ],

  reviews: [
    { _id: IDS.rev1, user: IDS.stud1, course: IDS.course1, instructor: IDS.inst1, rating: 5, comment: 'Absolutely outstanding! This course transformed the way I think about full-stack development. John explains complex concepts with remarkable clarity.', createdAt: new Date('2024-03-21') },
    { _id: IDS.rev2, user: IDS.stud2, course: IDS.course1, instructor: IDS.inst1, rating: 4, comment: 'Very comprehensive and well-structured. The hands-on projects really helped solidify the concepts. Would love even more exercises.', createdAt: new Date('2024-03-25') },
    { _id: IDS.rev3, user: IDS.stud1, course: IDS.course2, instructor: IDS.inst2, rating: 5, comment: 'Sarah is a phenomenal instructor. Her passion for design is infectious and the course content is absolutely world-class.', createdAt: new Date('2024-03-28') },
    { _id: IDS.rev4, user: IDS.stud2, course: IDS.course3, instructor: IDS.inst1, rating: 5, comment: 'The best free Python course I have ever taken. Incredibly detailed and practical. A must for anyone getting into data science.', createdAt: new Date('2024-04-05') },
    { _id: IDS.rev5, user: IDS.stud1, course: IDS.course5, instructor: IDS.inst2, rating: 4, comment: 'Great introduction to graphic design. The Illustrator and Photoshop sections are especially strong. Highly recommended.', createdAt: new Date('2024-04-10') },
    { _id: IDS.rev6, user: IDS.stud2, course: IDS.course6, instructor: IDS.inst1, rating: 5, comment: 'Outstanding mobile development course! Building real cross-platform apps from day one made all the difference.', createdAt: new Date('2024-04-15') },
    { _id: IDS.rev7,  user: IDS.stud3, course: IDS.course1, instructor: IDS.inst1, rating: 4, comment: "Really well structured course. John's teaching style makes complex topics approachable. Looking forward to more courses!",             createdAt: new Date('2024-05-15') },
    { _id: IDS.rev8,  user: IDS.stud4, course: IDS.course2, instructor: IDS.inst2, rating: 5, comment: "Sarah is an incredible instructor. This course completely changed how I approach design problems. Absolutely 10/10!",                 createdAt: new Date('2024-06-02') },
    { _id: IDS.rev9,  user: IDS.stud3, course: IDS.course7, instructor: IDS.inst3, rating: 5, comment: "Marcus explains ML algorithms in a way that finally clicked for me. The hands-on projects with real datasets are excellent.",          createdAt: new Date('2024-05-25') },
    { _id: IDS.rev10, user: IDS.stud4, course: IDS.course5, instructor: IDS.inst2, rating: 4, comment: "Solid graphic design foundations. The Illustrator and Photoshop sections are especially strong. Great value for the price.",           createdAt: new Date('2024-06-10') },
    { _id: IDS.rev11, user: IDS.stud1, course: IDS.course8, instructor: IDS.inst1, rating: 5, comment: "Finally a TypeScript course that respects your time! Concise, practical, and directly applied to real React projects.",                createdAt: new Date('2024-06-15') },
    { _id: IDS.rev12, user: IDS.stud2, course: IDS.course7, instructor: IDS.inst3, rating: 4, comment: "Great depth on neural networks and SVMs. The Kaggle project walkthrough at the end ties everything together beautifully.",             createdAt: new Date('2024-06-20') },
  ],
};

// ━━━ Helpers ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let _idSeq = 300;
const newId  = () => `mock-${(++_idSeq).toString(36)}`;
const cloneDoc = (obj) => JSON.parse(JSON.stringify(obj));
const byId  = (coll, id) => coll.find((item) => item._id === String(id));

/** Return true if item satisfies a Mongoose-style filter object */
function matchesFilter(item, filter) {
  for (const [key, val] of Object.entries(filter)) {
    if (val === null || val === undefined) continue;
    if (typeof val === 'object') {
      if (val.$regex !== undefined) {
        const re = new RegExp(val.$regex, val.$options || '');
        if (!re.test(String(item[key] ?? ''))) return false;
      } else if (val.$in !== undefined) {
        if (!val.$in.map(String).includes(String(item[key]))) return false;
      } else if (val.$gte !== undefined) {
        if (item[key] < val.$gte) return false;
      } else {
        // plain object comparison — use string coercion
        if (String(item[key]) !== String(val)) return false;
      }
    } else {
      // Booleans, strings, numbers — compare as strings to handle ObjectId-like IDs
      if (String(item[key]) !== String(val)) return false;
    }
  }
  return true;
}

function filterItems(coll, filter = {}) {
  if (Object.keys(filter).length === 0) return [...coll];
  return coll.filter((item) => matchesFilter(item, filter));
}

/**
 * Apply a Mongoose select string like 'name email avatar' or '-password'
 * to a plain object, returning a new object.
 */
function applySelect(obj, select) {
  if (!select || !obj) return obj;
  const fields = select.trim().split(/\s+/);
  const excl = fields.filter((f) => f.startsWith('-')).map((f) => f.slice(1));
  const incl = fields.filter((f) => f.length > 0 && !f.startsWith('-') && f !== '+password');

  if (excl.length > 0) {
    const r = { ...obj };
    for (const f of excl) delete r[f];
    return r;
  }
  if (incl.length > 0) {
    const r = { _id: obj._id };
    for (const f of incl) if (f in obj) r[f] = obj[f];
    return r;
  }
  return obj;
}

// Ref field → collection name mapping
const refMap = { instructor: 'users', student: 'users', course: 'courses', user: 'users' };

/**
 * Populate one reference field on an item.
 * Always strips the password from the populated ref document.
 */
function populateOne(item, path, select, nestedOp) {
  if (!item || item[path] === undefined || item[path] === null) return item;
  const collName = refMap[path];
  if (!collName) return item;

  const raw = byId(store[collName], item[path]);
  if (!raw) return item;

  let ref = cloneDoc(raw);
  delete ref.password; // never expose password in a populated ref

  if (nestedOp) {
    ref = populateOne(ref, nestedOp.path, nestedOp.select, null);
  }
  if (select) ref = applySelect(ref, select);

  return { ...item, [path]: ref };
}

function runPopulate(data, ops) {
  if (!ops || ops.length === 0) return data;
  const applyAll = (item) => {
    if (!item) return item;
    let r = { ...item };
    for (const op of ops) {
      if (typeof op === 'string') {
        r = populateOne(r, op, null, null);
      } else {
        r = populateOne(r, op.path, op.select || null, op.populate || null);
      }
    }
    return r;
  };
  return Array.isArray(data) ? data.map(applyAll) : applyAll(data);
}

function runSort(arr, sortOp) {
  if (!sortOp || !Array.isArray(arr)) return arr;
  const entries = Object.entries(sortOp);
  if (entries.length === 0) return arr;
  const result = [...arr];
  const [key, dir] = entries[0];
  return result.sort((a, b) => {
    const av = a[key], bv = b[key];
    if (av < bv) return dir === -1 ? 1 : -1;
    if (av > bv) return dir === -1 ? -1 : 1;
    return 0;
  });
}

// ━━━ MockQuery (thenable, chainable like Mongoose query) ━━━━━━━━━━━━━━━━━━━━
class MockQuery {
  constructor(dataPromise, collName) {
    this._dp        = dataPromise;
    this._collName  = collName;
    this._populateOps = [];
    this._sortOp    = null;
    this._selectOp  = null;
    this._includePwd = false;
  }

  populate(pathOrArray, select) {
    if (typeof pathOrArray === 'string') {
      this._populateOps.push({ path: pathOrArray, select: select || null });
    } else if (Array.isArray(pathOrArray)) {
      this._populateOps.push(...pathOrArray);
    } else if (pathOrArray && typeof pathOrArray === 'object') {
      this._populateOps.push(pathOrArray);
    }
    return this;
  }

  sort(op) { this._sortOp = op; return this; }

  select(fields) {
    this._selectOp = fields;
    if (typeof fields === 'string' && fields.includes('+password')) {
      this._includePwd = true;
    }
    return this;
  }

  async _resolve() {
    let data = await this._dp;

    // Sort raw data first (before populate, mirrors Mongoose behaviour)
    if (Array.isArray(data) && this._sortOp) {
      data = runSort(data, this._sortOp);
    }

    // Populate
    if (this._populateOps.length > 0) {
      data = runPopulate(data, this._populateOps);
    }

    // Strip/keep password
    const strip = (item) => {
      if (!item || typeof item !== 'object') return item;
      if (!this._includePwd && item.password !== undefined) {
        const r = { ...item };
        delete r.password;
        return r;
      }
      return item;
    };
    data = Array.isArray(data) ? data.map(strip) : strip(data);

    // Apply select ('+password' already handled above; remove it from the string)
    if (this._selectOp && typeof this._selectOp === 'string') {
      const sel = this._selectOp.replace('+password', '').trim();
      if (sel) {
        const applyS = (item) => applySelect(item, sel);
        data = Array.isArray(data) ? data.map(applyS) : applyS(data);
      }
    }

    // Wrap in mock documents
    if (Array.isArray(data)) {
      return data.map((item) => (item ? makeDoc(item, this._collName, this._includePwd) : null));
    }
    return data ? makeDoc(data, this._collName, this._includePwd) : null;
  }

  then(resolve, reject) { return this._resolve().then(resolve, reject); }
  catch(reject)          { return this._resolve().catch(reject); }
}

// ━━━ MockDocument (returned by queries; has Mongoose instance methods) ━━━━━━
function makeDoc(data, collName, hasPwd = false) {
  const doc = { ...data };

  doc.toObject = () => ({ ...data });

  // matchPassword — only available when password is present
  if (hasPwd && data.password) {
    doc.matchPassword = (plain) => bcrypt.compare(plain, data.password);
  }

  // save — mutates the store entry
  doc.save = async () => {
    const idx = store[collName].findIndex((item) => item._id === data._id);
    if (idx !== -1) {
      Object.keys(doc).forEach((k) => {
        if (typeof doc[k] !== 'function') {
          store[collName][idx][k] = doc[k];
          data[k] = doc[k]; // keep data in sync so toObject() is current
        }
      });
    }
    return doc;
  };

  // deleteOne — removes from the store
  doc.deleteOne = async () => {
    store[collName] = store[collName].filter((item) => item._id !== data._id);
    return { deletedCount: 1 };
  };

  // populate instance method (used after create(), etc.)
  doc.populate = async (pathOrArr, selectStr) => {
    let ops;
    if (typeof pathOrArr === 'string') {
      ops = [{ path: pathOrArr, select: selectStr || null }];
    } else if (Array.isArray(pathOrArr)) {
      ops = pathOrArr;
    } else if (pathOrArr && typeof pathOrArr === 'object') {
      ops = [pathOrArr];
    } else {
      return doc;
    }
    const populated = runPopulate({ ...doc }, ops);
    // Merge populated fields back onto doc
    Object.assign(doc, populated);
    return doc;
  };

  return doc;
}

// ━━━ Mock Model Factory ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function createMockModel(collName) {
  return {
    /** GET many — returns MockQuery (supports .populate().sort()) */
    find(filter = {}) {
      const items = filterItems(store[collName], filter).map(cloneDoc);
      return new MockQuery(Promise.resolve(items), collName);
    },

    /** GET one — returns MockQuery (supports .select(..).populate(..)) */
    findOne(filter = {}) {
      const found = filterItems(store[collName], filter)[0];
      return new MockQuery(Promise.resolve(found ? cloneDoc(found) : null), collName);
    },

    /** GET by ID — returns MockQuery */
    findById(id) {
      const found = byId(store[collName], id);
      return new MockQuery(Promise.resolve(found ? cloneDoc(found) : null), collName);
    },

    /** CREATE — hashes password for users, returns a mock document */
    async create(data) {
      const _id = newId();
      const now = new Date();
      let stored = { _id, ...data, createdAt: now, updatedAt: now };

      // Hash password if this is the users collection and plain password given
      if (collName === 'users' && stored.password && !stored.password.startsWith('$2')) {
        stored.password = await bcrypt.hash(stored.password, 10);
      }
      // Enrollments: set enrolledAt
      if (collName === 'enrollments') stored.enrolledAt = stored.enrolledAt || now;

      store[collName].push(stored);
      return makeDoc(cloneDoc(stored), collName, !!(stored.password));
    },

    /** UPDATE — returns MockQuery (supports .populate()) */
    findByIdAndUpdate(id, updates, opts = {}) {
      const strId = String(id);
      const idx   = store[collName].findIndex((item) => item._id === strId);
      if (idx === -1) return new MockQuery(Promise.resolve(null), collName);

      // Support { $set: {...} } or plain { key: val }
      const flat = updates && updates.$set ? updates.$set : updates;
      const clean = Object.fromEntries(
        Object.entries(flat || {}).filter(([k, v]) => !k.startsWith('$') && v !== undefined)
      );
      Object.assign(store[collName][idx], clean, { updatedAt: new Date() });

      const result = opts.new !== false
        ? cloneDoc(store[collName][idx])
        : cloneDoc(store[collName][idx]); // both branches return the updated doc for simplicity
      return new MockQuery(Promise.resolve(result), collName);
    },

    /** DELETE many matching a filter */
    async deleteMany(filter = {}) {
      const before = store[collName].length;
      store[collName] = store[collName].filter((item) => !matchesFilter(item, filter));
      return { deletedCount: before - store[collName].length };
    },

    /** COUNT — returns a plain number */
    async countDocuments(filter = {}) {
      return filterItems(store[collName], filter).length;
    },

    /**
     * Simplified aggregate — handles the two patterns used in getAnalytics:
     *   1. Course.aggregate([{ $group: { _id: '$category', count: {$sum:1} } }, { $sort: {count:-1} }])
     *   2. User.aggregate([{ $match }, { $group: { _id:{year:…,month:…}, count } }, { $sort }])
     */
    async aggregate(pipeline) {
      let data   = store[collName].map(cloneDoc);
      let result = [];

      for (const stage of pipeline) {
        if (stage.$match) {
          data = data.filter((item) => matchesFilter(item, stage.$match));

        } else if (stage.$group) {
          const spec  = stage.$group;
          const idDef = spec._id;
          const groups = new Map();

          for (const item of data) {
            let groupKey;

            if (typeof idDef === 'string' && idDef.startsWith('$')) {
              groupKey = String(item[idDef.slice(1)] ?? '__null__');
            } else if (idDef && typeof idDef === 'object') {
              const keyObj = {};
              for (const [k, expr] of Object.entries(idDef)) {
                if (expr && expr.$year)  keyObj[k] = new Date(item[expr.$year.replace('$', '')]).getFullYear();
                if (expr && expr.$month) keyObj[k] = new Date(item[expr.$month.replace('$', '')]).getMonth() + 1;
              }
              groupKey = JSON.stringify(keyObj);
            } else {
              groupKey = '__all__';
            }

            const entry = groups.get(groupKey) || { _id: groupKey, count: 0 };
            if (spec.count && spec.count.$sum === 1) entry.count += 1;
            groups.set(groupKey, entry);
          }

          result = Array.from(groups.values()).map((g) => {
            let _id = g._id;
            // Try to parse object keys back from JSON
            if (typeof _id === 'string' && _id.startsWith('{')) {
              try { _id = JSON.parse(_id); } catch { /* leave as string */ }
            }
            return { _id, count: g.count };
          });
          data = result;

        } else if (stage.$sort) {
          data   = runSort(data, stage.$sort);
          result = data;
        }
      }

      return result;
    },
  };
}

// ━━━ Export five mock models ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
module.exports = {
  MockUser:       createMockModel('users'),
  MockCourse:     createMockModel('courses'),
  MockLesson:     createMockModel('lessons'),
  MockEnrollment: createMockModel('enrollments'),
  MockReview:     createMockModel('reviews'),
};
