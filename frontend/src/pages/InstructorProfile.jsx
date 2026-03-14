import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users, BookOpen, ChevronLeft, Clock, Star,
  GraduationCap, Award, ExternalLink, DollarSign, BarChart3
} from "lucide-react";
import { getInstructorProfileApi } from "../services/userService";

const LEVEL_COLOR = {
  beginner:     "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  intermediate: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  advanced:     "text-red-400 bg-red-500/10 border-red-500/30",
};

export default function InstructorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [instructor, setInstructor] = useState(null);
  const [courses, setCourses]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");

  useEffect(() => {
    setLoading(true);
    getInstructorProfileApi(id).then((res) => {
      if (res.success && res.instructor) {
        setInstructor(res.instructor);
        setCourses(res.courses || []);
      } else {
        setError(res.message || "Instructor not found.");
      }
      setLoading(false);
    });
  }, [id]);

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#080410] text-white font-sans pt-24 px-6">
        <div className="max-w-5xl mx-auto animate-pulse space-y-6">
          <div className="h-5 w-24 bg-[#2A1B4E] rounded" />
          <div className="bg-[#120B24] rounded-2xl p-8 flex gap-8">
            <div className="w-28 h-28 rounded-full bg-[#2A1B4E] shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-[#2A1B4E] rounded w-1/3" />
              <div className="h-4 bg-[#2A1B4E] rounded w-2/3" />
              <div className="h-4 bg-[#2A1B4E] rounded w-1/2" />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map((k) => <div key={k} className="h-48 bg-[#120B24] rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error || !instructor) {
    return (
      <div className="min-h-screen bg-[#080410] text-white font-sans flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="w-14 h-14 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-400 text-lg font-medium mb-4">{error || "Instructor not found."}</p>
          <button onClick={() => navigate("/instructors")} className="text-violet-400 font-bold hover:text-white transition-colors">
            ← Back to Instructors
          </button>
        </div>
      </div>
    );
  }

  const initials = instructor.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const joinYear  = new Date(instructor.createdAt).getFullYear();

  return (
    <div className="min-h-screen bg-[#080410] text-white font-sans">
      {/* BG orb */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[400px] bg-violet-600/8 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-28 pb-24">

        {/* Breadcrumb */}
        <motion.button
          initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/instructors")}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm font-bold mb-8 transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          All Instructors
        </motion.button>

        {/* Profile header card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="bg-[#0d0825] border border-[#2A1B4E] rounded-2xl p-8 mb-8 overflow-hidden relative"
        >
          {/* Decorative glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-violet-600/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-violet-500/40 shadow-[0_0_30px_rgba(124,58,237,0.25)]">
                {instructor.avatar ? (
                  <img src={instructor.avatar} alt={instructor.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-violet-600/30 flex items-center justify-center text-violet-300 font-black text-3xl">
                    {initials}
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between flex-wrap gap-3 mb-2">
                <div>
                  <h1 className="text-3xl font-black text-white leading-tight">{instructor.name}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <p className="text-violet-300 text-xs font-bold uppercase tracking-widest">Instructor · Joined {joinYear}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 px-3 py-1.5 rounded-full">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-amber-400 font-black text-sm">Featured</span>
                </div>
              </div>

              <p className="text-slate-400 text-sm leading-relaxed mb-5 max-w-2xl">
                {instructor.bio || "Expert instructor on LuxAcademy, passionate about teaching."}
              </p>

              {/* Stat chips */}
              <div className="flex flex-wrap items-center gap-3">
                {[
                  { icon: BookOpen, value: `${instructor.courseCount} Courses`, color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/30" },
                  { icon: Users,    value: `${(instructor.totalStudents || 0).toLocaleString()} Students`, color: "text-fuchsia-400", bg: "bg-fuchsia-500/10 border-fuchsia-500/30" },
                  { icon: Award,    value: "Verified Instructor", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" },
                ].map((s, i) => (
                  <div key={i} className={`flex items-center gap-2 ${s.bg} border rounded-full px-3 py-1.5`}>
                    <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
                    <span className={`text-xs font-bold ${s.color}`}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { icon: BookOpen,   label: "Total Courses",   value: instructor.courseCount,                     color: "text-violet-400",  bg: "bg-violet-500/10",  border: "border-violet-500/20" },
            { icon: Users,      label: "Total Students",  value: (instructor.totalStudents || 0).toLocaleString(), color: "text-fuchsia-400", bg: "bg-fuchsia-500/10", border: "border-fuchsia-500/20" },
            { icon: BarChart3,  label: "Avg. Price",      value: courses.length ? `$${Math.round(courses.reduce((s,c)=>s+(c.price||0),0)/courses.length)}` : "—", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
            { icon: GraduationCap, label: "Years Active", value: new Date().getFullYear() - joinYear || "< 1", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, type: "spring", stiffness: 300 }}
              className={`bg-[#120B24] border ${s.border} rounded-2xl p-4`}
            >
              <div className={`w-9 h-9 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center mb-3`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-slate-500 text-xs font-medium mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Courses section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-white">
              Published Courses
              <span className="ml-2 text-sm font-bold text-slate-500">({courses.length})</span>
            </h2>
            <Link to="/courses" className="text-violet-400 hover:text-white text-sm font-bold transition-colors flex items-center gap-1">
              Browse All <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          {courses.length === 0 && (
            <div className="text-center py-16 bg-[#120B24] rounded-2xl border border-[#2A1B4E]">
              <BookOpen className="w-10 h-10 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-400 font-medium">No published courses yet.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course, i) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08, type: "spring", stiffness: 260, damping: 22 }}
                whileHover={{ y: -4, scale: 1.01 }}
                onClick={() => navigate(`/courses/${course._id}`)}
                className="group bg-[#120B24] border border-[#2A1B4E] hover:border-violet-500/40 rounded-2xl overflow-hidden cursor-pointer transition-all hover:shadow-[0_8px_32px_rgba(124,58,237,0.18)]"
              >
                {/* Thumbnail */}
                <div className="h-36 overflow-hidden relative">
                  <img
                    src={course.thumbnail || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600"}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#120B24]/80 to-transparent" />
                  {/* Level badge */}
                  <div className={`absolute top-3 left-3 text-[10px] font-black uppercase px-2 py-1 rounded-full border ${LEVEL_COLOR[course.level] || LEVEL_COLOR.beginner}`}>
                    {course.level}
                  </div>
                  {/* Price badge */}
                  <div className="absolute top-3 right-3 bg-[#080410]/80 border border-violet-500/30 text-violet-300 font-black text-sm px-2.5 py-1 rounded-lg">
                    {course.price === 0 ? "Free" : `$${course.price}`}
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-violet-400 mb-1">{course.category}</p>
                  <h3 className="text-white font-bold text-sm leading-snug mb-3 line-clamp-2 group-hover:text-violet-200 transition-colors">
                    {course.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
                      <Clock className="w-3 h-3" /> {course.duration || "—"}
                    </div>
                    <div className="flex items-center gap-1 text-violet-400 text-xs font-black group-hover:text-white transition-colors">
                      View Course <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
