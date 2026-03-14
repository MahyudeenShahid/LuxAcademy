import { useState, useEffect } from "react";
import { Trash2, ChevronDown, Download } from "lucide-react";
import SharedSettings from "./SharedSettings";
import ConfirmModal from "../ConfirmModal";
import { getAllUsersApi, deleteUserApi, getAnalyticsApi, updateUserRoleApi } from "../../services/userService";
import { getAllCoursesApi, deleteCourseApi } from "../../services/courseService";

function exportCSV(filename, headers, rows) {
  const lines = [headers.join(','), ...rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminDashboard({ activeTab }) {
  const [users, setUsers]       = useState([]);
  const [courses, setCourses]   = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [roleUpdating, setRoleUpdating] = useState(null);

  const [confirm, setConfirm] = useState({ open: false, title: '', message: '', onConfirm: null, type: 'danger' });
  const askConfirm = (title, message, onConfirm, type = 'danger') =>
    setConfirm({ open: true, title, message, onConfirm, type });
  const closeConfirm = () => setConfirm((c) => ({ ...c, open: false })); // user id being updated

  useEffect(() => {
    if (activeTab === "overview" || activeTab === "platform_analytics" || activeTab === "reports") {
      getAnalyticsApi().then((r) => { if (r.success) setAnalytics(r.analytics); });
    }
    if (activeTab === "manage_users") {
      setLoading(true);
      getAllUsersApi().then((r) => { if (r.success) setUsers(r.users); setLoading(false); });
    }
    if (activeTab === "manage_all_courses") {
      setLoading(true);
      getAllCoursesApi().then((r) => { if (r.success) setCourses(r.courses); setLoading(false); });
    }
  }, [activeTab]);

  const handleDeleteUser = async (id, name) => {
    askConfirm(
      'Delete User',
      `Delete "${name}" and all their data (enrollments, courses)? This cannot be undone.`,
      async () => {
        const r = await deleteUserApi(id);
        if (r.success) setUsers((prev) => prev.filter((u) => u._id !== id));
        closeConfirm();
      }
    );
  };

  const handleRoleChange = async (userId, newRole, currentRole) => {
    askConfirm(
      'Change User Role',
      `Change this user's role from "${currentRole}" to "${newRole}"?`,
      async () => {
        setRoleUpdating(userId);
        const r = await updateUserRoleApi(userId, newRole);
        if (r.success) setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, role: newRole } : u));
        setRoleUpdating(null);
        closeConfirm();
      },
      'info'
    );
  };

  const handleDeleteCourse = async (id, title) => {
    askConfirm(
      'Delete Course',
      `Delete "${title}"? All lessons and enrollments will also be removed.`,
      async () => {
        const r = await deleteCourseApi(id);
        if (r.success) setCourses((prev) => prev.filter((c) => c._id !== id));
        closeConfirm();
      }
    );
  };

  const roleBadge = (role) => {
    const map = { admin: 'bg-emerald-500/10 text-emerald-400', instructor: 'bg-amber-500/10 text-amber-400', student: 'bg-blue-500/10 text-blue-400' };
    return map[role] || 'bg-slate-500/10 text-slate-400';
  };

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
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[#120B24] p-6 rounded-2xl border border-[#2A1B4E]">
            <h3 className="text-slate-400 text-xs font-bold uppercase mb-2">Total Users</h3>
            <p className="text-3xl font-black text-white">{analytics?.users.total.toLocaleString() ?? '—'}</p>
          </div>
          <div className="bg-[#120B24] p-6 rounded-2xl border border-[#2A1B4E]">
            <h3 className="text-slate-400 text-xs font-bold uppercase mb-2">Instructors</h3>
            <p className="text-3xl font-black text-white">{analytics?.users.instructors.toLocaleString() ?? '—'}</p>
          </div>
          <div className="bg-[#120B24] p-6 rounded-2xl border border-[#2A1B4E]">
            <h3 className="text-slate-400 text-xs font-bold uppercase mb-2">Courses</h3>
            <p className="text-3xl font-black text-white">{analytics?.courses.total.toLocaleString() ?? '—'}</p>
          </div>
          <div className="bg-[#120B24] p-6 rounded-2xl border border-[#2A1B4E]">
            <h3 className="text-slate-400 text-xs font-bold uppercase mb-2">Total Enrollments</h3>
            <p className="text-3xl font-black text-emerald-400">{analytics?.enrollments.total.toLocaleString() ?? '—'}</p>
          </div>
        </div>
      )}

      {activeTab === "manage_users" && (
        <div className="bg-[#120B24] rounded-2xl border border-[#2A1B4E] overflow-hidden">
          {loading && <div className="text-center py-8 text-slate-400">Loading users…</div>}
          {!loading && (
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0A051A] text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A1B4E]">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-bold text-white whitespace-nowrap">{user.name}</td>
                    <td className="px-6 py-4 text-slate-400 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4">
                      <div className="relative inline-flex items-center gap-1">
                        <select
                          value={user.role}
                          disabled={roleUpdating === user._id}
                          onChange={(e) => handleRoleChange(user._id, e.target.value, user.role)}
                          className={`appearance-none text-[10px] font-bold uppercase px-2 py-1 pr-5 rounded cursor-pointer outline-none transition-colors ${roleBadge(user.role)} bg-transparent border-0 disabled:opacity-60`}
                        >
                          <option value="student">student</option>
                          <option value="instructor">instructor</option>
                          <option value="admin">admin</option>
                        </select>
                        <ChevronDown className="w-3 h-3 text-slate-500 absolute right-1 pointer-events-none" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDeleteUser(user._id, user.name)} className="text-red-400 hover:text-red-300 transition-colors" title="Delete user">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === "manage_all_courses" && (
        <div className="bg-[#120B24] rounded-2xl border border-[#2A1B4E] overflow-hidden">
          {loading && <div className="text-center py-8 text-slate-400">Loading courses…</div>}
          {!loading && (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#0A051A] text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Course</th>
                  <th className="px-6 py-4 font-semibold">Instructor</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Price</th>
                  <th className="px-6 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A1B4E]">
                {courses.map((course) => (
                  <tr key={course._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-bold text-white max-w-[200px] truncate">{course.title}</td>
                    <td className="px-6 py-4 text-slate-400">{course.instructor?.name}</td>
                    <td className="px-6 py-4 text-slate-400">{course.category}</td>
                    <td className="px-6 py-4 text-slate-300">${course.price}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDeleteCourse(course._id, course.title)} className="text-red-400 hover:text-red-300 transition-colors" title="Delete course">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === "platform_analytics" && (
        <div className="space-y-6">
          <div className="bg-[#120B24] p-6 rounded-2xl border border-[#2A1B4E]">
            <h2 className="text-xl font-bold text-white mb-6">Enrollment Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Total Enrollments</p>
                <p className="text-2xl font-black text-white">{analytics?.enrollments.total.toLocaleString() ?? '—'}</p>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Students</p>
                <p className="text-2xl font-black text-blue-400">{analytics?.users.students.toLocaleString() ?? '—'}</p>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Published Courses</p>
                <p className="text-2xl font-black text-violet-400">{analytics?.courses.published.toLocaleString() ?? '—'}</p>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Instructors</p>
                <p className="text-2xl font-black text-amber-400">{analytics?.users.instructors.toLocaleString() ?? '—'}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Courses by Category</h3>
              <div className="space-y-2">
                {(analytics?.coursesByCategory || []).map((item) => {
                  const max = analytics?.coursesByCategory?.[0]?.count || 1;
                  return (
                    <div key={item._id} className="flex items-center gap-3">
                      <span className="text-sm text-slate-300 w-40 shrink-0">{item._id}</span>
                      <div className="flex-grow bg-slate-800 rounded-full h-2">
                        <div className="bg-violet-500 h-2 rounded-full transition-all" style={{ width: `${Math.round((item.count / max) * 100)}%` }} />
                      </div>
                      <span className="text-xs text-slate-400 w-8 text-right">{item.count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 p-6 rounded-2xl border border-blue-500/20">
              <h3 className="text-white font-bold mb-2">Most Popular Category</h3>
              <p className="text-3xl font-black text-blue-400 mb-1">{analytics?.coursesByCategory?.[0]?._id || '—'}</p>
              <p className="text-slate-400 text-sm">Highest course count on the platform</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 p-6 rounded-2xl border border-emerald-500/20">
              <h3 className="text-white font-bold mb-2">Draft Courses</h3>
              <p className="text-3xl font-black text-emerald-400 mb-1">
                {analytics ? analytics.courses.total - analytics.courses.published : '—'}
              </p>
              <p className="text-slate-400 text-sm">Courses pending publication</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "reports" && (
        <div className="space-y-6">
          <p className="text-slate-400 text-sm">Platform summary reports based on live data. Click Export to download as CSV.</p>
          {!analytics && <div className="text-center py-8 text-slate-400">Loading report data…</div>}
          {analytics && (
            <div className="space-y-4">
              {/* User Summary */}
              <div className="bg-[#120B24] border border-[#2A1B4E] rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-white font-bold text-lg mb-1">User Growth Report</h4>
                    <p className="text-slate-400 text-sm">Total users, broken down by role.</p>
                    <div className="flex flex-wrap gap-4 mt-4">
                      {[
                        { label: 'Total Users', value: analytics.users.total },
                        { label: 'Students', value: analytics.users.students },
                        { label: 'Instructors', value: analytics.users.instructors },
                        { label: 'Admins', value: analytics.users.admins },
                      ].map((s) => (
                        <div key={s.label} className="bg-slate-900/50 border border-slate-800 px-4 py-3 rounded-xl min-w-[110px]">
                          <p className="text-xs text-slate-400 uppercase font-bold mb-1">{s.label}</p>
                          <p className="text-xl font-black text-white">{s.value.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => exportCSV('user-report.csv',
                      ['Role', 'Count'],
                      [['Total', analytics.users.total], ['Students', analytics.users.students], ['Instructors', analytics.users.instructors], ['Admins', analytics.users.admins]]
                    )}
                    className="flex items-center gap-2 text-sm font-semibold text-violet-400 bg-violet-400/10 px-4 py-2 rounded-lg hover:bg-violet-400 hover:text-white transition-all shrink-0"
                  >
                    <Download className="w-4 h-4" /> Export CSV
                  </button>
                </div>
              </div>

              {/* Course Summary */}
              <div className="bg-[#120B24] border border-[#2A1B4E] rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-white font-bold text-lg mb-1">Course Catalogue Report</h4>
                    <p className="text-slate-400 text-sm">Published vs draft courses, breakdown by category.</p>
                    <div className="flex flex-wrap gap-4 mt-4">
                      {[
                        { label: 'Total Courses', value: analytics.courses.total },
                        { label: 'Published', value: analytics.courses.published },
                        { label: 'Drafts', value: analytics.courses.total - analytics.courses.published },
                      ].map((s) => (
                        <div key={s.label} className="bg-slate-900/50 border border-slate-800 px-4 py-3 rounded-xl min-w-[110px]">
                          <p className="text-xs text-slate-400 uppercase font-bold mb-1">{s.label}</p>
                          <p className="text-xl font-black text-white">{s.value.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => exportCSV('course-report.csv',
                      ['Category', 'Count'],
                      (analytics.coursesByCategory || []).map((c) => [c._id, c.count])
                    )}
                    className="flex items-center gap-2 text-sm font-semibold text-violet-400 bg-violet-400/10 px-4 py-2 rounded-lg hover:bg-violet-400 hover:text-white transition-all shrink-0"
                  >
                    <Download className="w-4 h-4" /> Export CSV
                  </button>
                </div>
              </div>

              {/* Enrollment Summary */}
              <div className="bg-[#120B24] border border-[#2A1B4E] rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-white font-bold text-lg mb-1">Enrollment Summary Report</h4>
                    <p className="text-slate-400 text-sm">Total platform enrollments and student engagement.</p>
                    <div className="flex flex-wrap gap-4 mt-4">
                      {[
                        { label: 'Total Enrollments', value: analytics.enrollments.total },
                        { label: 'Students', value: analytics.users.students },
                      ].map((s) => (
                        <div key={s.label} className="bg-slate-900/50 border border-slate-800 px-4 py-3 rounded-xl min-w-[110px]">
                          <p className="text-xs text-slate-400 uppercase font-bold mb-1">{s.label}</p>
                          <p className="text-xl font-black text-white">{s.value.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => exportCSV('enrollment-report.csv',
                      ['Metric', 'Value'],
                      [['Total Enrollments', analytics.enrollments.total], ['Total Students', analytics.users.students]]
                    )}
                    className="flex items-center gap-2 text-sm font-semibold text-violet-400 bg-violet-400/10 px-4 py-2 rounded-lg hover:bg-violet-400 hover:text-white transition-all shrink-0"
                  >
                    <Download className="w-4 h-4" /> Export CSV
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
