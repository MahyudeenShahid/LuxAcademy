const http = require('http');

const post = (path, body) => new Promise((resolve) => {
  const data = JSON.stringify(body);
  const req = http.request({ hostname: 'localhost', port: 5000, path, method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
  }, (res) => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => resolve(JSON.parse(d)));
  });
  req.write(data);
  req.end();
});

const get = (path, token) => new Promise((resolve) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const req = http.request({ hostname: 'localhost', port: 5000, path, method: 'GET', headers }, (res) => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => resolve(JSON.parse(d)));
  });
  req.end();
});

(async () => {
  console.log('\n=== LMS Backend API Tests (mock DB) ===\n');

  // 1. Login as different roles
  const studentLogin = await post('/api/auth/login', { email: 'student@lms.com', password: 'password123' });
  console.log('student login:', studentLogin.success, '| name:', studentLogin.user?.name, '| role:', studentLogin.user?.role, '| hasToken:', !!studentLogin.token);

  const adminLogin = await post('/api/auth/login', { email: 'admin@lms.com', password: 'password123' });
  console.log('admin login:', adminLogin.success, '| name:', adminLogin.user?.name, '| role:', adminLogin.user?.role);

  const instrLogin = await post('/api/auth/login', { email: 'instructor@lms.com', password: 'password123' });
  console.log('instructor login:', instrLogin.success, '| name:', instrLogin.user?.name, '| role:', instrLogin.user?.role);

  // 2. GET /api/auth/me
  const me = await get('/api/auth/me', studentLogin.token);
  console.log('\nGET /me:', me.success, '| user:', me.user?.name);

  // 3. GET /api/courses
  const courses = await get('/api/courses');
  console.log('\nGET /api/courses:', courses.success, '| count:', courses.count, '| titles:', courses.courses?.map(c => c.title.slice(0,20)).join(', '));

  // 4. GET /api/courses/:id (with lessons + enrollment count)
  const c1id = courses.courses?.[0]?._id;
  const detail = await get(`/api/courses/${c1id}`);
  console.log(`\nGET /api/courses/${c1id}:`, detail.success, '| title:', detail.course?.title?.slice(0,30), '| lessons:', detail.lessons?.length, '| enrollments:', detail.enrollmentCount);

  // 5. Check enrollment
  const check = await get(`/api/enrollments/check/${c1id}`, studentLogin.token);
  console.log('\nCheck enrollment:', check.success, '| isEnrolled:', check.isEnrolled);

  // 6. Enroll
  const enroll = await post('/api/enrollments/enroll', { courseId: c1id });
  // (unauthenticated — should fail 401)
  console.log('Enroll no auth:', enroll.success, '|', enroll.message);

  // 7. GET /api/enrollments/my-courses (student)
  const myCourses = await get('/api/enrollments/my-courses', studentLogin.token);
  console.log('\nMy enrollments:', myCourses.success, '| count:', myCourses.count, '| first course:', myCourses.enrollments?.[0]?.course?.title);

  // 8. Register new user
  const reg = await post('/api/auth/register', { name: 'Test User', email: 'test@example.com', password: 'password123' });
  console.log('\nRegister:', reg.success, '| name:', reg.user?.name, '| role:', reg.user?.role);

  // 9. GET /api/users/analytics (admin)
  const analytics = await get('/api/users/analytics', adminLogin.token);
  console.log('\nAnalytics:', analytics.success, '| users.total:', analytics.analytics?.users?.total, '| courses.total:', analytics.analytics?.courses?.total);

  // 10. GET instructor's courses
  const instrCourses = await get('/api/courses/my-courses', instrLogin.token);
  console.log('\nInstructor courses:', instrCourses.success, '| count:', instrCourses.count);

  console.log('\n=== All tests complete ===\n');
})().catch(console.error);
