import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import SharedSettings from "./SharedSettings";
import { getAllUsersApi, deleteUserApi, getAnalyticsApi } from "../../services/userService";
import { getAllCoursesApi, deleteCourseApi } from "../../services/courseService";

export default function AdminDashboard({ activeTab }) {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "overview" || activeTab === "platform_analytics") {
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

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user and all their data?')) return;
    const r = await deleteUserApi(id);
    if (r.success) setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    const r = await deleteCourseApi(id);
    if (r.success) setCourses((prev) => prev.filter((c) => c._id !== id));
  };

  const roleBadge = (role) => {
    const map = { admin: 'bg-emerald-500/10 text-emerald-400', instructor: 'bg-amber-500/10 text-amber-400', student: 'bg-blue-500/10 text-blue-400' };
    return map[role] || 'bg-slate-500/10 text-slate-400';
  };

  if (activeTab === "settings") return <SharedSettings />;

  return (
    <>
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
            <h3 className="text-slate-400 text-xs font-bold uppercase mb-2">System Status</h3>
            <p className="text-3xl font-black text-emerald-400">99.9%</p>
          </div>
        </div>
      )}

      {activeTab === "manage_users" && (
        <div className="bg-[#120B24] rounded-2xl border border-[#2A1B4E] overflow-hidden">
          {loading && <div className="text-center py-8 text-slate-400">Loading users…</div>}
          {!loading && (
            <table className="w-full text-left text-sm whitespace-nowrap">
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
                    <td className="px-6 py-4 font-bold text-white">{user.name}</td>
                    <td className="px-6 py-4 text-slate-400">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${roleBadge(user.role)}`}>{user.role}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDeleteUser(user._id)} className="text-red-400 hover:text-red-300 transition-colors" title="Delete user">
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
                      <button onClick={() => handleDeleteCourse(course._id)} className="text-red-400 hover:text-red-300 transition-colors" title="Delete course">
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
                {(analytics?.coursesByCategory || []).map((item) => (
                  <div key={item._id} className="flex items-center gap-3">
                    <span className="text-sm text-slate-300 w-40 shrink-0">{item._id}</span>
                    <div className="flex-grow bg-slate-800 rounded-full h-2">
                      <div className="bg-violet-500 h-2 rounded-full" style={{ width: `${Math.min((item.count / 400) * 100, 100)}%` }} />
                    </div>
                    <span className="text-xs text-slate-400 w-8 text-right">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 p-6 rounded-2xl border border-blue-500/20">
              <h3 className="text-white font-bold mb-2">Most Popular Category</h3>
              <p className="text-3xl font-black text-blue-400 mb-1">{analytics?.coursesByCategory?.[0]?._id || 'Web Development'}</p>
              <p className="text-slate-400 text-sm">Highest course count on the platform</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 p-6 rounded-2xl border border-emerald-500/20">
              <h3 className="text-white font-bold mb-2">Completion Rate</h3>
              <p className="text-3xl font-black text-emerald-400 mb-1">68.2%</p>
              <p className="text-slate-400 text-sm">Average across all active courses</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "reports" && (
        <div className="bg-[#120B24] rounded-2xl border border-[#2A1B4E] p-6">
          <h2 className="text-xl font-bold text-white mb-6">System Reports</h2>
          <div className="space-y-4">
            {[
              { title: "Monthly Financial Summary", date: "Oct 1, 2024", type: "PDF" },
              { title: "User Growth Metrics", date: "Sep 28, 2024", type: "CSV" },
              { title: "Instructor Payouts", date: "Sep 25, 2024", type: "XLSX" }
            ].map((report, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-[#2A1B4E] bg-[#0A051A]/50 hover:bg-[#1A103D] transition-colors group cursor-pointer">
                <div>
                  <h4 className="text-white font-bold group-hover:text-violet-400 transition-colors">{report.title}</h4>
                  <p className="text-sm text-slate-500 mt-1">Generated: {report.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-black px-2 py-1 rounded bg-slate-800 text-slate-300">{report.type}</span>
                  <button className="text-sm font-semibold text-violet-400 bg-violet-400/10 px-4 py-2 rounded-lg hover:bg-violet-400 hover:text-white transition-all">Download</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
