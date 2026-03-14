import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Video, Plus, Trash2, Users, ArrowLeft, PlayCircle, Lock, BookOpen, Clock, Pencil, X } from "lucide-react";
import SharedSettings from "./SharedSettings";
import ConfirmModal from "../ConfirmModal";
import { getMyCoursesApi, createCourseApi, updateCourseApi, deleteCourseApi, getLessonsApi, createLessonApi, deleteLessonApi } from "../../services/courseService";
import { getInstructorEnrollmentsApi } from "../../services/enrollmentService";

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const CATEGORIES = ["Web Development", "UI/UX Design", "Data Science", "Graphic Design", "Mobile Development", "Other"];
const BLANK_COURSE = { title: '', description: '', category: 'Web Development', price: '', thumbnail: '', level: 'beginner', duration: '', isPublished: false };
const BLANK_LESSON = { title: '', content: '', videoUrl: '', duration: '', isFree: false, order: 1 };

function buildMonthlyChart(enrollments) {
  const counts = {};
  enrollments.forEach((e) => {
    const d = new Date(e.enrolledAt || e.createdAt);
    if (!isNaN(d)) counts[MONTH_NAMES[d.getMonth()]] = (counts[MONTH_NAMES[d.getMonth()]] || 0) + 1;
  });
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const name = MONTH_NAMES[d.getMonth()];
    return { name, value: counts[name] || 0 };
  });
}

export default function InstructorDashboard({ activeTab, setActiveTab }) {
  const [courses, setCourses]           = useState([]);
  const [loading, setLoading]           = useState(false);
  const [form, setForm]                 = useState(BLANK_COURSE);
  const [submitting, setSubmitting]     = useState(false);
  const [formMsg, setFormMsg]           = useState('');

  // Lesson management
  const [managingCourse, setManagingCourse]   = useState(null);
  const [lessons, setLessons]                 = useState([]);
  const [loadingLessons, setLoadingLessons]   = useState(false);
  const [lessonForm, setLessonForm]           = useState(BLANK_LESSON);
  const [lessonSubmitting, setLessonSubmitting] = useState(false);
  const [lessonMsg, setLessonMsg]             = useState('');

  // Edit course
  const [editingCourse, setEditingCourse]   = useState(null);
  const [editForm, setEditForm]             = useState(BLANK_COURSE);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editMsg, setEditMsg]               = useState('');

  // Instructor enrollments (used by Enrollments + Analytics tabs)
  const [instructorEnrollments, setInstructorEnrollments] = useState([]);
  const [loadingEnrollments, setLoadingEnrollments]       = useState(false);

  // Confirm modal
  const [confirm, setConfirm] = useState({ open: false, title: '', message: '', onConfirm: null, type: 'danger' });
  const askConfirm = (title, message, onConfirm, type = 'danger') =>
    setConfirm({ open: true, title, message, onConfirm, type });
  const closeConfirm = () => setConfirm((c) => ({ ...c, open: false }));

  useEffect(() => {
    setLoading(true);
    getMyCoursesApi().then((result) => {
      if (result.success) setCourses(result.courses);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (activeTab === 'enrollments' || activeTab === 'analytics') {
      if (instructorEnrollments.length === 0) {
        setLoadingEnrollments(true);
        getInstructorEnrollmentsApi().then((r) => {
          if (r.success) setInstructorEnrollments(r.enrollments);
          setLoadingEnrollments(false);
        });
      }
    }
  }, [activeTab]);

  useEffect(() => {
    if (!managingCourse) return;
    setLoadingLessons(true);
    getLessonsApi(managingCourse._id).then((result) => {
      if (result.success) {
        setLessons(result.lessons);
        setLessonForm((f) => ({ ...f, order: (result.lessons.length || 0) + 1 }));
      }
      setLoadingLessons(false);
    });
  }, [managingCourse]);

  useEffect(() => {
    if (activeTab !== 'manage_courses') setManagingCourse(null);
  }, [activeTab]);

  /* ── Course CRUD ──────────────────────────────────────── */
  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormMsg('');
    const result = await createCourseApi({ ...form, price: Number(form.price) || 0 });
    if (result.success) {
      setCourses((prev) => [result.course, ...prev]);
      setForm(BLANK_COURSE);
      setFormMsg('Course created successfully!');
      setTimeout(() => setActiveTab('manage_courses'), 1200);
    } else {
      setFormMsg(result.message || 'Failed to create course.');
    }
    setSubmitting(false);
  };

  const handleDeleteCourse = async (courseId) => {
    askConfirm(
      'Delete Course',
      'This will permanently delete the course and all its lessons. This action cannot be undone.',
      async () => {
        const result = await deleteCourseApi(courseId);
        if (result.success) setCourses((prev) => prev.filter((c) => c._id !== courseId));
        closeConfirm();
      }
    );
  };

  const openEdit = (course) => {
    setEditingCourse(course);
    setEditForm({
      title: course.title || '',
      description: course.description || '',
      category: course.category || 'Web Development',
      price: course.price ?? '',
      thumbnail: course.thumbnail || '',
      level: course.level || 'beginner',
      duration: course.duration || '',
      isPublished: course.isPublished || false,
    });
    setEditMsg('');
  };

  const handleTogglePublish = async (course) => {
    const newVal = !course.isPublished;
    const result = await updateCourseApi(course._id, { isPublished: newVal });
    if (result.success) {
      setCourses((prev) => prev.map((c) => c._id === course._id ? { ...c, isPublished: newVal } : c));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setEditSubmitting(true);
    setEditMsg('');
    const result = await updateCourseApi(editingCourse._id, { ...editForm, price: Number(editForm.price) || 0 });
    if (result.success) {
      setCourses((prev) => prev.map((c) => c._id === editingCourse._id ? { ...c, ...editForm, price: Number(editForm.price) || 0 } : c));
      setEditMsg('Course updated!');
      setTimeout(() => setEditingCourse(null), 1000);
    } else {
      setEditMsg(result.message || 'Update failed.');
    }
    setEditSubmitting(false);
  };

  /* ── Lesson CRUD ──────────────────────────────────────── */
  const handleAddLesson = async (e) => {
    e.preventDefault();
    if (!managingCourse) return;
    setLessonSubmitting(true);
    setLessonMsg('');
    const result = await createLessonApi(managingCourse._id, lessonForm);
    if (result.success) {
      setLessons((prev) => [...prev, result.lesson]);
      setLessonForm({ ...BLANK_LESSON, order: lessons.length + 2 });
      setLessonMsg('Lesson added!');
      setTimeout(() => setLessonMsg(''), 2000);
    } else {
      setLessonMsg(result.message || 'Failed to add lesson.');
    }
    setLessonSubmitting(false);
  };

  const handleDeleteLesson = async (lessonId) => {
    askConfirm(
      'Delete Lesson',
      'Are you sure you want to delete this lesson?',
      async () => {
        const result = await deleteLessonApi(managingCourse._id, lessonId);
        if (result.success) setLessons((prev) => prev.filter((l) => l._id !== lessonId));
        closeConfirm();
      }
    );
  };

  const totalStudents = courses.reduce((sum, c) => sum + (c.enrollmentCount || 0), 0);
  const monthlyChart  = buildMonthlyChart(instructorEnrollments);

  const completedEnrollments = instructorEnrollments.filter((e) => e.progress === 100).length;
  const completionRate = instructorEnrollments.length
    ? Math.round((completedEnrollments / instructorEnrollments.length) * 100)
    : 0;
  const avgProgress = instructorEnrollments.length
    ? Math.round(instructorEnrollments.reduce((s, e) => s + (e.progress || 0), 0) / instructorEnrollments.length)
    : 0;

  if (activeTab === "settings") return <SharedSettings />;

  return (
    <>
      <ConfirmModal
        isOpen={confirm.open}
        title={confirm.title}
        message={confirm.message}
        type={confirm.type}
        onConfirm={confirm.onConfirm}
        onCancel={closeConfirm}
      />
      {/* ── Edit Course Modal ──────────────────────────────── */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-[#0A051A] border border-[#2A1B4E] rounded-2xl p-8 w-full max-w-2xl relative shadow-2xl">
            <button
              onClick={() => setEditingCourse(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-white mb-6">Edit Course</h2>
            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Title *</label>
                <input required value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full bg-[#120B24] border border-[#2A1B4E] rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500/50 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Description *</label>
                <textarea required rows={3} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full bg-[#120B24] border border-[#2A1B4E] rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500/50 resize-none transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Category</label>
                  <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full bg-[#120B24] border border-[#2A1B4E] rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500/50 transition-colors">
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Level</label>
                  <select value={editForm.level} onChange={(e) => setEditForm({ ...editForm, level: e.target.value })}
                    className="w-full bg-[#120B24] border border-[#2A1B4E] rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500/50 transition-colors">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Price ($)</label>
                  <input type="number" min="0" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    className="w-full bg-[#120B24] border border-[#2A1B4E] rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500/50 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Duration</label>
                  <input value={editForm.duration} onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })} placeholder="e.g. 20h"
                    className="w-full bg-[#120B24] border border-[#2A1B4E] rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500/50 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Thumbnail URL</label>
                  <input type="url" value={editForm.thumbnail} onChange={(e) => setEditForm({ ...editForm, thumbnail: e.target.value })} placeholder="https://..."
                    className="w-full bg-[#120B24] border border-[#2A1B4E] rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500/50 transition-colors" />
                </div>
              </div>
              {editMsg && (
                <p className={`text-sm font-semibold ${editMsg.includes('updated') ? 'text-emerald-400' : 'text-red-400'}`}>{editMsg}</p>
              )}
              <div className="flex items-center gap-4 pt-2 flex-wrap">
                <button type="submit" disabled={editSubmitting}
                  className="bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white px-6 py-3 rounded-xl font-bold uppercase transition-colors">
                  {editSubmitting ? 'Saving…' : 'Save Changes'}
                </button>
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <div
                    onClick={() => setEditForm((f) => ({ ...f, isPublished: !f.isPublished }))}
                    className={`w-12 h-6 rounded-full border transition-all cursor-pointer flex items-center px-0.5 ${
                      editForm.isPublished ? 'bg-emerald-500 border-emerald-400' : 'bg-[#120B24] border-[#2A1B4E]'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${editForm.isPublished ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
                  <span className={`text-sm font-bold ${editForm.isPublished ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {editForm.isPublished ? 'Published' : 'Save as Draft'}
                  </span>
                </label>
                <button type="button" onClick={() => setEditingCourse(null)}
                  className="text-slate-400 hover:text-white px-4 py-3 rounded-xl font-semibold text-sm transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Overview ──────────────────────────────────────── */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#120B24] p-6 rounded-2xl border border-[#2A1B4E]">
              <h3 className="text-slate-400 text-xs font-bold uppercase mb-2">Total Students</h3>
              <p className="text-3xl font-black text-white">{totalStudents.toLocaleString()}</p>
            </div>
            <div className="bg-[#120B24] p-6 rounded-2xl border border-violet-500/30">
              <h3 className="text-slate-400 text-xs font-bold uppercase mb-2">Active Courses</h3>
              <p className="text-3xl font-black text-white">{courses.length}</p>
            </div>
            <div className="bg-[#120B24] p-6 rounded-2xl border border-[#2A1B4E]">
              <h3 className="text-slate-400 text-xs font-bold uppercase mb-2">Completed</h3>
              <p className="text-3xl font-black text-amber-400">{completedEnrollments}</p>
            </div>
            <div className="bg-[#120B24] p-6 rounded-2xl border border-fuchsia-500/30">
              <h3 className="text-slate-400 text-xs font-bold uppercase mb-2">Completion Rate</h3>
              <p className="text-3xl font-black text-emerald-400">{completionRate}%</p>
            </div>
          </div>
          <div className="bg-[#120B24] p-8 rounded-2xl border border-[#2A1B4E]">
            <h2 className="text-xl font-bold text-white mb-6">Monthly Enrollments</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyChart}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2A1B4E" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#120B24', border: '1px solid #2A1B4E', borderRadius: '12px' }} />
                  <Bar dataKey="value" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ── Manage Courses ────────────────────────────────── */}
      {activeTab === "manage_courses" && !managingCourse && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => setActiveTab('create_course')}
              className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-2.5 flex items-center gap-2 rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)]"
            >
              <Plus className="w-4 h-4" /> New Course
            </button>
          </div>
          {loading && <div className="text-center py-8 text-slate-400">Loading courses…</div>}
          {!loading && courses.length === 0 && (
            <div className="text-center py-16 bg-[#120B24] rounded-2xl border border-[#2A1B4E]">
              <Video className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">No courses yet.</p>
              <button onClick={() => setActiveTab('create_course')} className="text-violet-400 font-bold hover:text-white">
                Create your first course →
              </button>
            </div>
          )}
          {courses.length > 0 && (
            <div className="bg-[#120B24] rounded-2xl border border-[#2A1B4E] overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#0A051A] text-slate-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Course Title</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Students</th>
                    <th className="px-6 py-4 font-semibold">Price</th>
                    <th className="px-6 py-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A1B4E]">
                  {courses.map((course) => (
                    <tr key={course._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-bold text-white max-w-[200px] truncate">{course.title}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleTogglePublish(course)}
                          title="Click to toggle publish status"
                          className={`text-[10px] font-bold uppercase px-2 py-1 rounded cursor-pointer transition-all hover:opacity-80 ${course.isPublished ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'}`}>
                          {course.isPublished ? '✓ Published' : '⦿ Draft'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-violet-400" />{(course.enrollmentCount || 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-300">${course.price}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => { setManagingCourse(course); setLessons([]); }}
                            className="text-xs font-bold text-violet-400 hover:text-white bg-violet-600/10 hover:bg-violet-600 px-3 py-1.5 rounded-lg transition-all"
                          >
                            Lessons
                          </button>
                          <button
                            onClick={() => openEdit(course)}
                            className="text-slate-400 hover:text-violet-400 transition-colors"
                            title="Edit course"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course._id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title="Delete course"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Lesson Manager ────────────────────────────────── */}
      {activeTab === "manage_courses" && managingCourse && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setManagingCourse(null)}
              className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Courses
            </button>
            <div className="h-4 w-px bg-white/10" />
            <div>
              <h2 className="text-white font-bold">{managingCourse.title}</h2>
              <p className="text-slate-400 text-xs">{lessons.length} lesson{lessons.length !== 1 ? 's' : ''}</p>
            </div>
          </div>

          <div className="bg-[#120B24] rounded-2xl border border-[#2A1B4E] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#2A1B4E] flex items-center justify-between">
              <h3 className="text-white font-bold flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-violet-400" /> Course Lessons
              </h3>
            </div>
            {loadingLessons && <div className="text-center py-8 text-slate-400 text-sm">Loading lessons…</div>}
            {!loadingLessons && lessons.length === 0 && (
              <div className="text-center py-10 text-slate-500 text-sm">No lessons yet — add your first lesson below.</div>
            )}
            {!loadingLessons && lessons.length > 0 && (
              <div className="divide-y divide-[#2A1B4E]">
                {lessons.map((lesson, idx) => (
                  <div key={lesson._id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors group">
                    <span className="w-6 h-6 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-xs font-bold text-violet-400 shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-grow min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{lesson.title}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        {lesson.duration && (
                          <span className="text-slate-500 text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" />{lesson.duration}
                          </span>
                        )}
                        {lesson.videoUrl && (
                          <span className="text-violet-400 text-xs flex items-center gap-1">
                            <PlayCircle className="w-3 h-3" /> Video
                          </span>
                        )}
                        {lesson.isFree ? (
                          <span className="text-emerald-400 text-[10px] font-bold uppercase bg-emerald-500/10 px-1.5 py-0.5 rounded">Free</span>
                        ) : (
                          <span className="text-slate-500 text-[10px] flex items-center gap-0.5"><Lock className="w-3 h-3" /> Paid</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteLesson(lesson._id)}
                      className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#120B24] rounded-2xl border border-[#2A1B4E] p-6">
            <h3 className="text-white font-bold mb-5 flex items-center gap-2">
              <Plus className="w-4 h-4 text-violet-400" /> Add New Lesson
            </h3>
            <form onSubmit={handleAddLesson} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Lesson Title *</label>
                  <input
                    required
                    value={lessonForm.title}
                    onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                    placeholder="e.g. Introduction to React Hooks"
                    className="w-full bg-[#0A051A] border border-[#2A1B4E] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-violet-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Video URL</label>
                  <input
                    type="url"
                    value={lessonForm.videoUrl}
                    onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                    placeholder="https://youtube.com/watch?v=... or direct video link"
                    className="w-full bg-[#0A051A] border border-[#2A1B4E] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-violet-500/50 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">
                  Lesson Content <span className="text-slate-600 normal-case font-normal">(Blog / Article — supports # headings, ## subheadings, - bullet lists, &gt; quotes)</span>
                </label>
                <textarea
                  rows={6}
                  value={lessonForm.content}
                  onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                  placeholder={"# Introduction\n\nWrite your lesson content here. Use:\n- Bullet points for lists\n> Quotes for highlights\n## Subheadings for sections"}
                  className="w-full bg-[#0A051A] border border-[#2A1B4E] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-violet-500/50 transition-colors resize-y font-mono leading-relaxed"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Duration</label>
                  <input
                    value={lessonForm.duration}
                    onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                    placeholder="e.g. 45m or 1h 20m"
                    className="w-full bg-[#0A051A] border border-[#2A1B4E] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-violet-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Order #</label>
                  <input
                    type="number"
                    min="1"
                    value={lessonForm.order}
                    onChange={(e) => setLessonForm({ ...lessonForm, order: Number(e.target.value) })}
                    className="w-full bg-[#0A051A] border border-[#2A1B4E] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-violet-500/50 transition-colors"
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <div
                      onClick={() => setLessonForm({ ...lessonForm, isFree: !lessonForm.isFree })}
                      className={`w-10 h-5 rounded-full border transition-all cursor-pointer ${
                        lessonForm.isFree ? 'bg-emerald-500 border-emerald-400' : 'bg-[#0A051A] border-[#2A1B4E]'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full mt-0.5 transition-transform ${lessonForm.isFree ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </div>
                    <span className="text-sm font-bold text-slate-300">Free Preview</span>
                  </label>
                </div>
              </div>
              {lessonMsg && (
                <p className={`text-sm font-semibold ${lessonMsg.includes('added') ? 'text-emerald-400' : 'text-red-400'}`}>{lessonMsg}</p>
              )}
              <button
                type="submit"
                disabled={lessonSubmitting}
                className="bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all"
              >
                {lessonSubmitting ? 'Adding…' : 'Add Lesson'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Create Course ─────────────────────────────────── */}
      {activeTab === "create_course" && (
        <div className="bg-[#120B24] p-8 rounded-2xl border border-[#2A1B4E] max-w-2xl">
          <h2 className="text-xl font-bold text-white mb-6">Create New Course</h2>
          <form onSubmit={handleCreate} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Title *</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} type="text" placeholder="e.g. Advanced React Patterns"
                className="w-full bg-[#0A051A] border border-[#2A1B4E] rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Description *</label>
              <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What will students learn?"
                className="w-full bg-[#0A051A] border border-[#2A1B4E] rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500/50 resize-none transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-[#0A051A] border border-[#2A1B4E] rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500/50 transition-colors">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Level</label>
                <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}
                  className="w-full bg-[#0A051A] border border-[#2A1B4E] rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500/50 transition-colors">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Price ($)</label>
                <input type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0 = free"
                  className="w-full bg-[#0A051A] border border-[#2A1B4E] rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500/50 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Duration</label>
                <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 20h"
                  className="w-full bg-[#0A051A] border border-[#2A1B4E] rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500/50 transition-colors" />
              </div>
              <div className="col-span-1">
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Thumbnail URL</label>
                <input type="url" value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} placeholder="https://..."
                  className="w-full bg-[#0A051A] border border-[#2A1B4E] rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500/50 transition-colors" />
              </div>
            </div>
            {formMsg && <p className={`text-sm font-semibold ${formMsg.includes('success') ? 'text-emerald-400' : 'text-red-400'}`}>{formMsg}</p>}
            <div className="flex items-center gap-4 pt-2 flex-wrap">
              <button type="submit" disabled={submitting} className="bg-violet-600 hover:bg-violet-500 disabled:opacity-60 transition-colors text-white px-6 py-3 rounded-xl font-bold uppercase">
                {submitting ? 'Creating…' : 'Create Course'}
              </button>
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div
                  onClick={() => setForm((f) => ({ ...f, isPublished: !f.isPublished }))}
                  className={`w-12 h-6 rounded-full border transition-all cursor-pointer flex items-center px-0.5 ${
                    form.isPublished ? 'bg-emerald-500 border-emerald-400' : 'bg-[#0A051A] border-[#2A1B4E]'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isPublished ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
                <span className={`text-sm font-bold ${form.isPublished ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {form.isPublished ? 'Publish immediately' : 'Save as Draft'}
                </span>
              </label>
              <button type="button" onClick={() => setActiveTab('manage_courses')} className="text-slate-400 hover:text-white px-4 py-3 rounded-xl font-semibold text-sm transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Analytics ─────────────────────────────────────── */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#120B24] p-6 rounded-2xl border border-[#2A1B4E]">
              <p className="text-xs text-slate-400 font-bold uppercase mb-2">Total Enrollments</p>
              <h4 className="text-2xl font-black text-white">{instructorEnrollments.length}</h4>
            </div>
            <div className="bg-[#120B24] p-6 rounded-2xl border border-[#2A1B4E]">
              <p className="text-xs text-slate-400 font-bold uppercase mb-2">Completed</p>
              <h4 className="text-2xl font-black text-emerald-400">{completedEnrollments}</h4>
            </div>
            <div className="bg-[#120B24] p-6 rounded-2xl border border-[#2A1B4E]">
              <p className="text-xs text-slate-400 font-bold uppercase mb-2">Completion Rate</p>
              <h4 className="text-2xl font-black text-violet-400">{completionRate}%</h4>
            </div>
            <div className="bg-[#120B24] p-6 rounded-2xl border border-[#2A1B4E]">
              <p className="text-xs text-slate-400 font-bold uppercase mb-2">Avg Progress</p>
              <h4 className="text-2xl font-black text-amber-400">{avgProgress}%</h4>
            </div>
          </div>
          <div className="bg-[#120B24] p-8 rounded-2xl border border-[#2A1B4E]">
            <h2 className="text-xl font-bold text-white mb-6">Monthly Enrollment Trend</h2>
            {loadingEnrollments ? (
              <div className="text-center py-12 text-slate-400 text-sm">Loading analytics…</div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyChart}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2A1B4E" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} allowDecimals={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#120B24', border: '1px solid #2A1B4E', borderRadius: '12px' }} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Students / Enrollments ─────────────────────────── */}
      {activeTab === "enrollments" && (
        <div className="bg-[#120B24] rounded-2xl border border-[#2A1B4E] overflow-hidden">
          {loadingEnrollments && <div className="text-center py-8 text-slate-400">Loading students…</div>}
          {!loadingEnrollments && instructorEnrollments.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No students enrolled in your courses yet.</p>
            </div>
          )}
          {!loadingEnrollments && instructorEnrollments.length > 0 && (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#0A051A] text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Student</th>
                  <th className="px-6 py-4 font-semibold">Enrolled Course</th>
                  <th className="px-6 py-4 font-semibold">Progress</th>
                  <th className="px-6 py-4 font-semibold text-right">Join Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A1B4E]">
                {instructorEnrollments.map((e) => (
                  <tr key={e._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">{e.student?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 text-slate-300 max-w-[200px] truncate">{e.course?.title || '—'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-800 rounded-full h-2 max-w-[100px]">
                          <div className="bg-violet-500 h-2 rounded-full" style={{ width: `${e.progress || 0}%` }} />
                        </div>
                        <span className="text-xs text-slate-400">{e.progress || 0}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-400">
                      {e.enrolledAt ? new Date(e.enrolledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </>
  );
}
