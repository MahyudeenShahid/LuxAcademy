import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BookOpen, Award, Clock, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import SharedSettings from "./SharedSettings";
import { getMyEnrollmentsApi } from "../../services/enrollmentService";

const activityData = [
  { name: "Mon", value: 2 }, { name: "Tue", value: 3.5 }, { name: "Wed", value: 1.5 },
  { name: "Thu", value: 4 }, { name: "Fri", value: 2.5 }, { name: "Sat", value: 0 }, { name: "Sun", value: 5 },
];

export default function StudentDashboard({ activeTab }) {
  const [enrollments, setEnrollments] = useState([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);

  useEffect(() => {
    setLoadingEnrollments(true);
    getMyEnrollmentsApi().then((result) => {
      if (result.success) setEnrollments(result.enrollments);
      setLoadingEnrollments(false);
    });
  }, []);

  if (activeTab === "settings") return <SharedSettings />;

  const completedCount = enrollments.filter((e) => e.progress === 100).length;
  const avgCompletion = enrollments.length
    ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length) : 0;

  return (
    <>
      {activeTab === "overview" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { label: "Active Courses", value: enrollments.length.toString(), icon: BookOpen, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
              { label: "Hours Learned", value: "32.5", icon: Clock, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
              { label: "Certificates", value: completedCount.toString(), icon: Award, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
              { label: "Completion Average", value: `${avgCompletion}%`, icon: Activity, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
            ].map((stat, i) => (
              <div key={i} className={`bg-[#120B24] p-6 rounded-[1.5rem] shadow-xl border ${stat.border}`}>
                <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${stat.bg} border ${stat.border}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <h3 className="text-3xl font-bold text-white tracking-tight">{stat.value}</h3>
                <p className="text-slate-400 font-medium text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[#120B24] p-8 rounded-[1.5rem] shadow-xl border border-[#2A1B4E]">
              <h2 className="text-xl font-bold text-white mb-8">Learning Activity Tracker</h2>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2A1B4E" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dx={-10} />
                    <Tooltip contentStyle={{ backgroundColor: '#120B24', borderRadius: '12px', border: '1px solid #2A1B4E' }} />
                    <Area type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#120B24] p-8 rounded-[1.5rem] shadow-xl border border-[#2A1B4E] flex flex-col">
              <h2 className="text-xl font-bold text-white mb-6">Continue Learning</h2>
              {enrollments.length > 0 ? (
                <div className="space-y-4 flex-grow flex flex-col">
                  <div className="rounded-xl overflow-hidden h-40 border border-[#2A1B4E]">
                    <img src={enrollments[0].course?.thumbnail || 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400'} className="w-full h-full object-cover" alt="Course" />
                  </div>
                  <div className="mt-auto">
                    <h3 className="font-bold text-white mb-2 line-clamp-1">{enrollments[0].course?.title}</h3>
                    <div className="w-full bg-[#080410] rounded-full h-2.5 border border-[#2A1B4E] mb-2">
                      <div className="bg-gradient-to-r from-violet-600 to-fuchsia-500 h-full rounded-full" style={{ width: `${enrollments[0].progress}%` }} />
                    </div>
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-violet-400">{enrollments[0].progress}% Completed</span>
                      <Link to={`/courses/${enrollments[0].course?._id}`} className="text-slate-400 hover:text-white">View →</Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-grow flex items-center justify-center text-center">
                  <div>
                    <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm font-medium">No enrollments yet.</p>
                    <Link to="/courses" className="text-violet-400 text-sm font-bold hover:text-white mt-2 inline-block">Browse Courses →</Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === "courses" && (
        <div className="space-y-4">
          {loadingEnrollments && <div className="text-center py-10 text-slate-400">Loading your courses…</div>}
          {!loadingEnrollments && enrollments.length === 0 && (
            <div className="text-center py-16 bg-[#120B24] rounded-2xl border border-[#2A1B4E]">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg font-medium mb-2">No courses enrolled yet.</p>
              <Link to="/courses" className="text-violet-400 font-bold hover:text-white">Browse Courses →</Link>
            </div>
          )}
          {enrollments.map((enrollment) => (
            <div key={enrollment._id} className="bg-[#120B24] p-6 rounded-2xl border border-[#2A1B4E] flex flex-col md:flex-row gap-6 hover:border-violet-500/30 transition-colors">
              <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden shrink-0">
                <img src={enrollment.course?.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600'} className="w-full h-full object-cover" alt={enrollment.course?.title} />
              </div>
              <div className="flex-grow flex flex-col justify-center">
                <h3 className="text-xl font-bold text-white mb-1">{enrollment.course?.title}</h3>
                <p className="text-sm text-slate-400 mb-4">Instructor: {enrollment.course?.instructor?.name}</p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="flex-grow bg-[#080410] rounded-full h-2 border border-[#2A1B4E]">
                    <div className="bg-violet-600 h-full rounded-full" style={{ width: `${enrollment.progress}%` }} />
                  </div>
                  <span className="text-xs font-bold text-violet-300 shrink-0">{enrollment.progress}%</span>
                  <Link to={`/courses/${enrollment.course?._id}`} className="bg-violet-600 hover:bg-violet-500 text-white text-xs px-4 py-2 rounded-lg font-bold shrink-0">
                    Continue
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
