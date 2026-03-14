import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  BookOpen, Award, Clock, Activity, CheckCircle, Download,
  Eye, Flame, Star, Zap, Trophy, Target, X, GraduationCap, Medal
} from "lucide-react";
import { Link } from "react-router-dom";
import SharedSettings from "./SharedSettings";
import { getMyEnrollmentsApi } from "../../services/enrollmentService";

const activityData = [
  { name: "Mon", value: 2 }, { name: "Tue", value: 3.5 }, { name: "Wed", value: 1.5 },
  { name: "Thu", value: 4 }, { name: "Fri", value: 2.5 }, { name: "Sat", value: 0 }, { name: "Sun", value: 5 },
];

/* ─── Canvas certificate download ─────────────────────────────────────────── */
function downloadCertificatePNG(enrollment, user) {
  const W = 1200, H = 840;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0d0825"); bg.addColorStop(1, "#180a30");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Outer border
  ctx.strokeStyle = "#7c3aed"; ctx.lineWidth = 7;
  ctx.strokeRect(28, 28, W - 56, H - 56);
  // Inner border
  ctx.strokeStyle = "#4c1d95"; ctx.lineWidth = 2;
  ctx.strokeRect(44, 44, W - 88, H - 88);

  // Corner stars
  const drawStar = (x, y, r) => {
    ctx.fillStyle = "#7c3aed";
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const b = ((i * 4 + 2) * Math.PI) / 5 - Math.PI / 2;
      if (i === 0) ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a));
      else ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a));
      ctx.lineTo(x + r * 0.4 * Math.cos(b), y + r * 0.4 * Math.sin(b));
    }
    ctx.closePath(); ctx.fill();
  };
  [[70, 70], [W - 70, 70], [70, H - 70], [W - 70, H - 70]].forEach(([x, y]) => drawStar(x, y, 14));

  // Academy name
  ctx.fillStyle = "#c4b5fd"; ctx.font = "bold 20px Arial";
  ctx.textAlign = "center"; ctx.letterSpacing = "6px";
  ctx.fillText("L U X A C A D E M Y", W / 2, 120);

  // Title
  ctx.fillStyle = "#f1f5f9"; ctx.font = "bold 54px Georgia, serif";
  ctx.letterSpacing = "0px";
  ctx.fillText("Certificate of Completion", W / 2, 210);

  // Divider
  ctx.strokeStyle = "#7c3aed"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(W / 2 - 220, 240); ctx.lineTo(W / 2 + 220, 240); ctx.stroke();

  ctx.fillStyle = "#94a3b8"; ctx.font = "italic 26px Georgia, serif";
  ctx.fillText("This is to certify that", W / 2, 300);

  // Student name
  ctx.fillStyle = "#a78bfa"; ctx.font = "bold 70px Georgia, serif";
  ctx.fillText(user?.name || "Student", W / 2, 400);

  // Name underline
  const nw = ctx.measureText(user?.name || "Student").width;
  ctx.strokeStyle = "#7c3aed55"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(W / 2 - nw / 2, 418); ctx.lineTo(W / 2 + nw / 2, 418); ctx.stroke();

  ctx.fillStyle = "#94a3b8"; ctx.font = "italic 26px Georgia, serif";
  ctx.fillText("has successfully completed", W / 2, 478);

  ctx.fillStyle = "#ffffff"; ctx.font = "bold 40px Arial";
  const title = enrollment.course?.title || "Course";
  ctx.fillText(title, W / 2, 558, W - 200);

  // Footer divider
  ctx.strokeStyle = "#2A1B4E"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(100, 640); ctx.lineTo(W - 100, 640); ctx.stroke();

  const dateStr = new Date(enrollment.completedAt || enrollment.enrolledAt)
    .toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const credId = `LA-${(enrollment._id || "").slice(-8).toUpperCase()}`;

  ctx.font = "bold 14px Arial"; ctx.fillStyle = "#64748b";
  ctx.textAlign = "left";  ctx.fillText("INSTRUCTOR", 120, 680);
  ctx.textAlign = "center"; ctx.fillText("CREDENTIAL ID", W / 2, 680);
  ctx.textAlign = "right";  ctx.fillText("COMPLETED ON", W - 120, 680);

  ctx.font = "bold 22px Arial"; ctx.fillStyle = "#e2e8f0";
  ctx.textAlign = "left";  ctx.fillText(enrollment.course?.instructor?.name || "LuxAcademy", 120, 712);
  ctx.textAlign = "center"; ctx.fillStyle = "#a78bfa"; ctx.fillText(credId, W / 2, 712);
  ctx.textAlign = "right";  ctx.fillStyle = "#e2e8f0"; ctx.fillText(dateStr, W - 120, 712);

  // Seal circle
  ctx.textAlign = "center";
  ctx.beginPath(); ctx.arc(W / 2, 780, 22, 0, Math.PI * 2);
  ctx.fillStyle = "#7c3aed30"; ctx.fill();
  ctx.strokeStyle = "#7c3aed"; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.fillStyle = "#a78bfa"; ctx.font = "bold 22px Arial"; ctx.fillText("★", W / 2, 788);

  const a = document.createElement("a");
  a.download = `${(title).replace(/\s+/g, "_")}_Certificate.png`;
  a.href = canvas.toDataURL("image/png", 1.0); a.click();
}

/* ─── Full-screen certificate modal ───────────────────────────────────────── */
function CertificateModal({ enrollment, user, onClose }) {
  const dateStr = new Date(enrollment.completedAt || enrollment.enrolledAt)
    .toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const credId = `LA-${(enrollment._id || "").slice(-8).toUpperCase()}`;

  return (
    <div
      className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        {/* Action buttons */}
        <div className="flex items-center justify-between mb-4 px-1">
          <p className="text-slate-400 text-sm font-medium">Certificate Preview</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => downloadCertificatePNG(enrollment, user)}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
            >
              <Download className="w-4 h-4" /> Download PNG
            </button>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate */}
        <div className="relative bg-gradient-to-br from-[#0d0825] to-[#180a30] border-4 border-violet-600 rounded-2xl p-10 overflow-hidden shadow-[0_0_80px_rgba(124,58,237,0.35)]">
          {/* Inner border ring */}
          <div className="absolute inset-4 border border-violet-800/40 rounded-xl pointer-events-none" />

          {/* Corner ornaments */}
          {["top-6 left-6", "top-6 right-6", "bottom-6 left-6", "bottom-6 right-6"].map((pos, i) => (
            <div key={i} className={`absolute ${pos} text-violet-500 text-lg opacity-60`}>✦</div>
          ))}

          {/* Background glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <GraduationCap className="w-96 h-96 text-violet-400" />
          </div>

          {/* Header */}
          <div className="relative text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px flex-1 bg-violet-500/30 max-w-[80px]" />
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-violet-400" />
                <span className="text-violet-300 font-black text-xs tracking-[0.35em] uppercase">LuxAcademy</span>
              </div>
              <div className="h-px flex-1 bg-violet-500/30 max-w-[80px]" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
              Certificate of Completion
            </h1>
            <div className="flex items-center gap-3 justify-center mt-4">
              <div className="h-px flex-1 bg-violet-500/40" />
              <Star className="w-4 h-4 text-amber-400" />
              <div className="h-px flex-1 bg-violet-500/40" />
            </div>
          </div>

          {/* Body */}
          <div className="relative text-center py-6">
            <p className="text-slate-400 text-lg italic mb-4">This is to certify that</p>
            <p className="text-4xl sm:text-5xl font-black text-violet-300 mb-2 leading-tight" style={{ fontFamily: "Georgia, serif" }}>
              {user?.name || "Student"}
            </p>
            <div className="w-56 h-0.5 bg-violet-500/40 mx-auto mb-6" />
            <p className="text-slate-400 text-lg italic mb-4">has successfully completed</p>
            <p className="text-2xl sm:text-3xl font-black text-white mb-2 px-4">
              {enrollment.course?.title}
            </p>
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-1.5 rounded-full mt-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 font-bold text-sm">100% Complete</span>
            </div>
          </div>

          {/* Footer */}
          <div className="relative border-t border-violet-900/50 mt-4 pt-6 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1 font-bold">Instructor</p>
              <p className="text-white font-bold text-sm">{enrollment.course?.instructor?.name || "LuxAcademy"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1 font-bold">Credential ID</p>
              <p className="text-violet-400 font-bold font-mono text-sm">{credId}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1 font-bold">Completed On</p>
              <p className="text-white font-bold text-sm">{dateStr}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main component ───────────────────────────────────────────────────────── */
export default function StudentDashboard({ activeTab }) {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [streak, setStreak] = useState(0);

  // Study-streak tracker (localStorage)
  useEffect(() => {
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem("lms_last_visit");
    const stored = parseInt(localStorage.getItem("lms_streak") || "0");
    if (!lastVisit) {
      setStreak(1);
      localStorage.setItem("lms_streak", "1");
      localStorage.setItem("lms_last_visit", today);
    } else if (lastVisit === today) {
      setStreak(stored);
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const next = lastVisit === yesterday.toDateString() ? stored + 1 : 1;
      setStreak(next);
      localStorage.setItem("lms_streak", String(next));
      localStorage.setItem("lms_last_visit", today);
    }
  }, []);

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
    ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
    : 0;
  const inProgress = enrollments.filter((e) => e.progress > 0 && e.progress < 100).length;

  // XP & Level
  const xp = enrollments.length * 10 + completedCount * 100 + avgCompletion + streak * 5;
  const LEVELS = [
    { name: "Novice",  min: 0,   max: 100,  icon: BookOpen, color: "text-slate-400",   bg: "bg-slate-500/10",   border: "border-slate-500/30" },
    { name: "Learner", min: 100, max: 300,  icon: Zap,      color: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/30"  },
    { name: "Scholar", min: 300, max: 600,  icon: Star,     color: "text-violet-400",  bg: "bg-violet-500/10",  border: "border-violet-500/30"},
    { name: "Expert",  min: 600, max: 9999, icon: Trophy,   color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/30" },
  ];
  const level = LEVELS.slice().reverse().find((l) => xp >= l.min) || LEVELS[0];
  const levelPct = level.max === 9999 ? 100
    : Math.min(100, Math.round(((xp - level.min) / (level.max - level.min)) * 100));

  // Achievements
  const achievements = [
    { icon: BookOpen, label: "First Step",   desc: "Enrolled in first course", earned: enrollments.length >= 1, color: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/30"    },
    { icon: BookOpen, label: "Bookworm",     desc: "Enrolled in 3+ courses",   earned: enrollments.length >= 3, color: "text-indigo-400",  bg: "bg-indigo-500/10",  border: "border-indigo-500/30"  },
    { icon: Award,    label: "Graduate",     desc: "Completed first course",   earned: completedCount >= 1,     color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/30"   },
    { icon: Trophy,   label: "Master",       desc: "Completed 3+ courses",     earned: completedCount >= 3,     color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
    { icon: Flame,    label: "On Fire!",     desc: "Maintained 7-day streak",  earned: streak >= 7,             color: "text-orange-400",  bg: "bg-orange-500/10",  border: "border-orange-500/30"  },
    { icon: Target,   label: "Perfectionist",desc: "Any course 100% complete", earned: completedCount > 0,      color: "text-rose-400",    bg: "bg-rose-500/10",    border: "border-rose-500/30"    },
    { icon: Zap,      label: "Speed Learner",desc: "3+ courses in progress",   earned: inProgress >= 3,         color: "text-yellow-400",  bg: "bg-yellow-500/10",  border: "border-yellow-500/30"  },
    { icon: Medal,    label: "Dedicated",    desc: "5+ courses enrolled",       earned: enrollments.length >= 5, color: "text-fuchsia-400", bg: "bg-fuchsia-500/10", border: "border-fuchsia-500/30" },
  ];

  return (
    <>
      {selectedCert && (
        <CertificateModal
          enrollment={selectedCert}
          user={user}
          onClose={() => setSelectedCert(null)}
        />
      )}

      {/* ── Overview ─────────────────────────────────────────────────────── */}
      {activeTab === "overview" && (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {[
              { label: "Enrolled",     value: enrollments.length.toString(), icon: BookOpen, color: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/20"    },
              { label: "In Progress",  value: inProgress.toString(),         icon: Activity, color: "text-violet-400",  bg: "bg-violet-500/10",  border: "border-violet-500/20"  },
              { label: "Completed",    value: completedCount.toString(),     icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20"},
              { label: "Certificates", value: completedCount.toString(),     icon: Award,    color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/20"   },
              { label: "Day Streak",   value: streak.toString(),             icon: Flame,    color: "text-orange-400",  bg: "bg-orange-500/10",  border: "border-orange-500/20"  },
            ].map((stat, i) => (
              <div key={i} className={`bg-[#120B24] p-5 rounded-2xl border ${stat.border} hover:border-opacity-60 transition-colors`}>
                <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center ${stat.bg} border ${stat.border}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                <p className="text-slate-500 font-medium text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Level / XP bar */}
          <div className={`bg-[#120B24] border ${level.border} rounded-2xl p-5 mb-8`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${level.bg} border ${level.border}`}>
                  <level.icon className={`w-5 h-5 ${level.color}`} />
                </div>
                <div>
                  <p className={`font-black text-lg ${level.color}`}>{level.name}</p>
                  <p className="text-slate-500 text-xs font-medium">{xp} XP earned</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-sm">{levelPct}%</p>
                {level.max !== 9999 && (
                  <p className="text-slate-500 text-xs">{level.max - xp > 0 ? `${level.max - xp} XP to next` : "Max level!"}</p>
                )}
              </div>
            </div>
            <div className="w-full bg-[#080410] rounded-full h-3 border border-[#2A1B4E]">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  level.name === "Expert" ? "bg-gradient-to-r from-amber-500 to-orange-400"
                  : level.name === "Scholar" ? "bg-gradient-to-r from-violet-600 to-fuchsia-500"
                  : level.name === "Learner" ? "bg-gradient-to-r from-blue-600 to-cyan-400"
                  : "bg-slate-500"
                }`}
                style={{ width: `${levelPct}%` }}
              />
            </div>
          </div>

          {/* Charts + Continue Learning */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-[#120B24] p-6 rounded-2xl border border-[#2A1B4E]">
              <h2 className="text-lg font-bold text-white mb-6">Learning Activity</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2A1B4E" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} dx={-10} />
                    <Tooltip contentStyle={{ backgroundColor: "#120B24", borderRadius: "12px", border: "1px solid #2A1B4E" }} />
                    <Area type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={3} fillOpacity={1} fill="url(#areaGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#120B24] p-6 rounded-2xl border border-[#2A1B4E] flex flex-col">
              <h2 className="text-lg font-bold text-white mb-4">Continue Learning</h2>
              {enrollments.length > 0 ? (
                <div className="space-y-3 flex-1">
                  {enrollments.slice(0, 3).map((e) => (
                    <div key={e._id} className="flex items-center gap-3 p-3 bg-[#080410] rounded-xl border border-[#2A1B4E] hover:border-violet-500/30 transition-colors">
                      <img
                        src={e.course?.thumbnail || "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=80"}
                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                        alt=""
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-xs truncate">{e.course?.title}</p>
                        <div className="w-full bg-[#2A1B4E] rounded-full h-1.5 mt-1.5">
                          <div className="bg-violet-600 h-full rounded-full" style={{ width: `${e.progress}%` }} />
                        </div>
                        <p className="text-violet-300 text-xs font-bold mt-1">{e.progress}%</p>
                      </div>
                      <Link to={`/courses/${e.course?._id}`} className="text-slate-500 hover:text-violet-400 transition-colors text-xs shrink-0">→</Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-center">
                  <div>
                    <BookOpen className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">No courses yet.</p>
                    <Link to="/courses" className="text-violet-400 text-sm font-bold mt-2 inline-block hover:text-white">Browse Courses →</Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-[#120B24] rounded-2xl border border-[#2A1B4E] p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">Achievements</h2>
              <span className="text-xs font-bold text-slate-400 bg-[#080410] border border-[#2A1B4E] px-3 py-1 rounded-full">
                {achievements.filter((a) => a.earned).length}/{achievements.length} earned
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {achievements.map((a, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center text-center p-4 rounded-xl border transition-all ${
                    a.earned
                      ? `${a.bg} ${a.border} opacity-100`
                      : "bg-[#080410] border-[#2A1B4E] opacity-40 grayscale"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${a.earned ? a.bg : "bg-slate-800"}`}>
                    <a.icon className={`w-5 h-5 ${a.earned ? a.color : "text-slate-600"}`} />
                  </div>
                  <p className={`text-xs font-black ${a.earned ? "text-white" : "text-slate-600"}`}>{a.label}</p>
                  <p className={`text-[10px] mt-0.5 ${a.earned ? "text-slate-400" : "text-slate-700"}`}>{a.desc}</p>
                  {a.earned && <CheckCircle className="w-3 h-3 text-emerald-400 mt-1.5" />}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── My Courses ───────────────────────────────────────────────────── */}
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
            <div key={enrollment._id} className="bg-[#120B24] p-5 rounded-2xl border border-[#2A1B4E] flex flex-col md:flex-row gap-5 hover:border-violet-500/30 transition-colors">
              <div className="w-full md:w-44 h-28 rounded-xl overflow-hidden shrink-0">
                <img src={enrollment.course?.thumbnail || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600"} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <h3 className="text-lg font-bold text-white leading-tight">{enrollment.course?.title}</h3>
                  {enrollment.progress === 100 && (
                    <span className="shrink-0 text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      ✓ Done
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mb-4">Instructor: {enrollment.course?.instructor?.name}</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-[#080410] rounded-full h-2 border border-[#2A1B4E]">
                    <div className="bg-gradient-to-r from-violet-600 to-fuchsia-500 h-full rounded-full transition-all" style={{ width: `${enrollment.progress}%` }} />
                  </div>
                  <span className="text-xs font-bold text-violet-300 shrink-0 w-10 text-right">{enrollment.progress}%</span>
                  {enrollment.progress === 100 ? (
                    <button onClick={() => setSelectedCert(enrollment)} className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs px-3 py-1.5 rounded-lg font-bold hover:bg-amber-500/20 transition-colors shrink-0">
                      <Award className="w-3.5 h-3.5" /> Certificate
                    </button>
                  ) : (
                    <Link to={`/courses/${enrollment.course?._id}`} className="bg-violet-600 hover:bg-violet-500 text-white text-xs px-4 py-1.5 rounded-lg font-bold shrink-0 transition-colors">
                      Continue
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Certificates ─────────────────────────────────────────────────── */}
      {activeTab === "certificates" && (
        <div className="space-y-6">
          {loadingEnrollments && <div className="text-center py-10 text-slate-400">Loading…</div>}
          {!loadingEnrollments && enrollments.filter((e) => e.progress === 100).length === 0 && (
            <div className="text-center py-16 bg-[#120B24] rounded-2xl border border-[#2A1B4E]">
              <Award className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg font-medium mb-2">No certificates yet.</p>
              <p className="text-slate-500 text-sm">Complete 100% of a course to earn a certificate.</p>
              <Link to="/courses" className="text-violet-400 font-bold hover:text-white mt-4 inline-block">Browse Courses →</Link>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {enrollments.filter((e) => e.progress === 100).map((enrollment) => {
              const dateStr = new Date(enrollment.completedAt || enrollment.enrolledAt)
                .toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
              const credId = `LA-${(enrollment._id || "").slice(-8).toUpperCase()}`;
              return (
                <div key={enrollment._id}
                  className="relative bg-gradient-to-br from-violet-900/30 to-fuchsia-900/20 border border-violet-500/30 rounded-2xl p-7 overflow-hidden hover:border-violet-400/50 transition-all hover:shadow-[0_0_30px_rgba(124,58,237,0.2)] group"
                >
                  {/* Bg watermark */}
                  <div className="absolute top-3 right-3 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Award className="w-28 h-28 text-violet-400" />
                  </div>

                  {/* Corner ornaments */}
                  <div className="absolute top-4 left-4 text-violet-600/40 text-base">✦</div>
                  <div className="absolute bottom-4 right-4 text-violet-600/40 text-base">✦</div>

                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 text-xs font-black uppercase tracking-widest">Certificate of Completion</span>
                    </div>

                    <div className="flex items-start gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0">
                        <GraduationCap className="w-5 h-5 text-violet-400" />
                      </div>
                      <div>
                        <p className="text-white font-black text-lg leading-tight">{enrollment.course?.title}</p>
                        <p className="text-slate-500 text-xs mt-0.5">by {enrollment.course?.instructor?.name || "N/A"}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Completed On</p>
                        <p className="text-white font-bold text-sm">{dateStr}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Credential ID</p>
                        <p className="text-violet-400 font-bold font-mono text-xs">{credId}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedCert(enrollment)}
                        className="flex-1 flex items-center justify-center gap-2 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/40 text-violet-300 hover:text-white py-2.5 rounded-xl text-xs font-bold transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Full Screen
                      </button>
                      <button
                        onClick={() => downloadCertificatePNG(enrollment, user)}
                        className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white py-2.5 rounded-xl text-xs font-bold transition-all"
                      >
                        <Download className="w-3.5 h-3.5" /> Download PNG
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
