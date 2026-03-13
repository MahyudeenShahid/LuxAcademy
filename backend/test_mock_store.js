'use strict';
/**
 * Direct unit test for mockStore.js — no HTTP, no Express needed.
 * Tests the Mongoose-like API that controllers rely on.
 */

process.env.USE_MOCK_DB = 'true';
process.env.JWT_SECRET  = 'test_secret';

const store = require('./data/mockStore');
const { MockUser, MockCourse, MockLesson, MockEnrollment } = store;

let passed = 0;
let failed = 0;

const ok = (label, val) => {
  if (val) { console.log(`  ✔  ${label}`); passed++; }
  else      { console.error(`  ✖  ${label}`); failed++; }
};

(async () => {
  console.log('\n=== mockStore unit tests ===\n');

  // ── User: findOne, password, matchPassword ────────────────────────────────
  const userWithPwd = await MockUser.findOne({ email: 'student@lms.com' }).select('+password');
  ok('findOne by email (with password)', userWithPwd !== null);
  ok('matchPassword correct', userWithPwd && await userWithPwd.matchPassword('password123'));
  ok('matchPassword wrong',   userWithPwd && !(await userWithPwd.matchPassword('wrongpwd')));

  const userNoPwd = await MockUser.findOne({ email: 'student@lms.com' });
  ok('findOne without select hides password', userNoPwd && userNoPwd.password === undefined);

  const byId = await MockUser.findById('mock-u-stud1').select('-password');
  ok('findById returns correct user', byId && byId.name === 'Alice Student');
  ok('findById strips password via select', byId && byId.password === undefined);

  // ── User: find, countDocuments ──────────────────────────────────────────
  const allUsers = await MockUser.find();
  ok('find() all users returns 5', allUsers.length === 5);

  const students = await MockUser.find({ role: 'student' });
  ok('find(role:student) returns 2', students.length === 2);

  const total = await MockUser.countDocuments();
  ok('countDocuments() total = 5', total === 5);

  const studentCount = await MockUser.countDocuments({ role: 'student' });
  ok('countDocuments(student) = 2', studentCount === 2);

  // ── User: create ──────────────────────────────────────────────────────────
  const newUser = await MockUser.create({ name: 'Test User', email: 'test@x.com', password: 'password123', role: 'student' });
  ok('create returns user', newUser && newUser.name === 'Test User');
  ok('create hashes password', newUser.password && newUser.password.startsWith('$2'));

  const afterCreate = await MockUser.countDocuments();
  ok('user count increased after create', afterCreate === 6);

  // ── User: findByIdAndUpdate ───────────────────────────────────────────────
  const updated = await MockUser.findByIdAndUpdate('mock-u-stud1', { bio: 'Updated bio' }, { new: true });
  ok('findByIdAndUpdate returns updated doc', updated && updated.bio === 'Updated bio');

  // ── Course: find, populate ────────────────────────────────────────────────
  const courses = await MockCourse.find().populate('instructor', 'name email').sort({ createdAt: -1 });
  ok('find courses returns 6', courses.length === 6);
  ok('populate instructor name', courses[0] && typeof courses[0].instructor?.name === 'string');
  ok('populate strips password from instructor', courses[0] && courses[0].instructor?.password === undefined);

  // ── Course: getCourseById pattern ─────────────────────────────────────────
  const course1 = await MockCourse.findById('mock-c-1').populate('instructor', 'name email avatar bio');
  ok('findById course exists', course1 !== null);
  ok('course has instructor object', typeof course1?.instructor === 'object');

  const lessons = await MockLesson.find({ course: 'mock-c-1' }).sort({ order: 1 });
  ok('lessons for course1 = 3', lessons.length === 3);
  ok('lessons sorted by order', lessons[0].order === 1 && lessons[1].order === 2);

  const enrollCount = await MockEnrollment.countDocuments({ course: 'mock-c-1' });
  ok('enrollment count for course1', enrollCount >= 1);

  // ── Enrollment: find with nested populate ─────────────────────────────────
  const enrollments = await MockEnrollment.find({ student: 'mock-u-stud1' })
    .populate({ path: 'course', populate: { path: 'instructor', select: 'name avatar' } })
    .sort({ enrolledAt: -1 });
  ok('find enrollments for student = 2', enrollments.length === 2);
  ok('enrollment.course is object', typeof enrollments[0].course === 'object');
  ok('enrollment.course.instructor populated', typeof enrollments[0].course?.instructor === 'object');
  ok('instructor password not in nested populate', enrollments[0].course?.instructor?.password === undefined);

  // ── Enrollment: create, checkEnrollment ───────────────────────────────────
  const newEnroll = await MockEnrollment.create({ student: 'mock-u-stud2', course: 'mock-c-1', progress: 0 });
  ok('create enrollment', newEnroll && newEnroll.student === 'mock-u-stud2');

  const check = await MockEnrollment.findOne({ student: 'mock-u-stud2', course: 'mock-c-1' });
  ok('findOne enrollment exists after create', check !== null);

  // ── Enrollment: updateProgress pattern ───────────────────────────────────
  const enrollment = await MockEnrollment.findById(newEnroll._id);
  ok('findById enrollment', enrollment !== null);
  enrollment.progress = 50;
  await enrollment.save();
  const reloaded = await MockEnrollment.findById(newEnroll._id);
  ok('progress saved via .save()', reloaded?.progress === 50);

  // ── deleteOne / deleteMany ────────────────────────────────────────────────
  const tempCourse = await MockCourse.create({ title: 'Temp', description: 'desc', category: 'Other', instructor: 'mock-u-inst1' });
  await tempCourse.deleteOne();
  const gone = await MockCourse.findById(tempCourse._id);
  ok('deleteOne removes document', gone === null);

  await MockEnrollment.deleteMany({ student: 'mock-u-stud2' });
  const afterDel = await MockEnrollment.countDocuments({ student: 'mock-u-stud2' });
  ok('deleteMany removes matching records', afterDel === 0);

  // ── aggregate: coursesByCategory ─────────────────────────────────────────
  const byCategory = await MockCourse.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  ok('aggregate coursesByCategory returns array', Array.isArray(byCategory));
  ok('aggregate has _id and count fields', byCategory[0] && '_id' in byCategory[0] && 'count' in byCategory[0]);

  // ── aggregate: recentUsers ────────────────────────────────────────────────
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 100); // far back to catch seed data
  const recentUsers = await MockUser.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);
  ok('aggregate recentUsers returns array', Array.isArray(recentUsers));
  ok('recentUsers has object _id', recentUsers[0] && typeof recentUsers[0]._id === 'object');

  // ── toObject ──────────────────────────────────────────────────────────────
  const course = await MockCourse.findById('mock-c-1');
  const plain  = course.toObject();
  ok('toObject() returns plain object', plain && plain.title === course.title);

  // ── getMyCourses pattern (course controller) ──────────────────────────────
  const myCourses = await MockCourse.find({ instructor: 'mock-u-inst1' }).sort({ createdAt: -1 });
  const withStats = await Promise.all(
    myCourses.map(async (c) => {
      const ec = await MockEnrollment.countDocuments({ course: c._id });
      const lc = await MockLesson.countDocuments({ course: c._id });
      return { ...c.toObject(), enrollmentCount: ec, lessonCount: lc };
    })
  );
  ok('getMyCourses pattern returns courses', withStats.length >= 2);
  ok('getMyCourses has enrollmentCount', typeof withStats[0].enrollmentCount === 'number');

  // ── find with regex filter ────────────────────────────────────────────────
  const webCourses = await MockCourse.find({ category: { $regex: 'web', $options: 'i' } });
  ok('find with $regex filter works', webCourses.length >= 1);

  console.log(`\n  Results: ${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
  else console.log('  All tests passed!\n');
})().catch((e) => {
  console.error('Unexpected error:', e);
  process.exit(1);
});
