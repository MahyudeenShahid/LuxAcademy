import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, BookOpen, Search, Star, ChevronRight, GraduationCap } from "lucide-react";
import { getInstructorsApi } from "../services/userService";

const AVATARS = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
];

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getInstructorsApi().then((res) => {
      if (res.success) setInstructors(res.instructors);
      setLoading(false);
    });
  }, []);

  const filtered = instructors.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    (i.bio || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#080410] text-white font-sans">
      {/* Background orbs */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-600/8 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* Hero */}
      <section className="relative z-10 pt-32 pb-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
            <GraduationCap className="w-4 h-4" /> Our Instructors
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight leading-tight">
            Learn from the{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              best
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10 font-medium">
            All our instructors are industry professionals with real-world experience,
            hand-picked to deliver the highest quality courses.
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search instructors…"
              className="w-full bg-[#120B24] border border-[#2A1B4E] rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/60 transition-colors text-sm"
            />
          </div>
        </motion.div>
      </section>

      {/* Stats bar */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 mb-16">
        <div className="grid grid-cols-3 gap-4 bg-[#0A051A]/60 border border-[#2A1B4E] rounded-2xl p-6">
          {[
            { label: "Expert Instructors", value: instructors.length || "—", icon: Users },
            { label: "Courses Available", value: instructors.reduce((s, i) => s + (i.courseCount || 0), 0) || "—", icon: BookOpen },
            { label: "Students Taught", value: instructors.reduce((s, i) => s + (i.totalStudents || 0), 0).toLocaleString() || "—", icon: Star },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <s.icon className="w-5 h-5 text-violet-400 mx-auto mb-2" />
              <p className="text-2xl font-black text-white">{s.value}</p>
              <p className="text-slate-500 text-xs font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Instructor grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((k) => (
              <div key={k} className="bg-[#120B24] border border-[#2A1B4E] rounded-2xl p-6 animate-pulse">
                <div className="w-20 h-20 rounded-full bg-[#2A1B4E] mx-auto mb-4" />
                <div className="h-4 bg-[#2A1B4E] rounded w-1/2 mx-auto mb-3" />
                <div className="h-3 bg-[#2A1B4E] rounded w-3/4 mx-auto mb-2" />
                <div className="h-3 bg-[#2A1B4E] rounded w-2/3 mx-auto" />
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400 text-lg font-medium">No instructors found.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((inst, i) => {
            const avatar = inst.avatar || AVATARS[i % AVATARS.length];
            const initials = inst.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
            return (
              <motion.div
                key={inst._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, type: "spring", stiffness: 260, damping: 22 }}
                whileHover={{ y: -6, scale: 1.01 }}
                onClick={() => navigate(`/instructors/${inst._id}`)}
                className="group bg-[#120B24] border border-[#2A1B4E] hover:border-violet-500/40 rounded-2xl p-6 cursor-pointer transition-all hover:shadow-[0_8px_40px_rgba(124,58,237,0.18)] flex flex-col"
              >
                {/* Featured course thumbnail strip */}
                {inst.featuredCourse?.thumbnail && (
                  <div className="h-28 rounded-xl overflow-hidden mb-5 -mx-0 relative">
                    <img
                      src={inst.featuredCourse.thumbnail}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#120B24] via-transparent to-transparent" />
                  </div>
                )}

                {/* Avatar */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-violet-500/40 shadow-[0_0_15px_rgba(124,58,237,0.25)] shrink-0">
                    {avatar ? (
                      <img src={avatar} alt={inst.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-violet-600/30 flex items-center justify-center text-violet-300 font-black text-lg">
                        {initials}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-black text-white text-lg leading-tight group-hover:text-violet-300 transition-colors">
                      {inst.name}
                    </h3>
                    <p className="text-violet-400 text-xs font-bold uppercase tracking-wider mt-0.5">Instructor</p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-5 flex-1">
                  {inst.bio || "Expert instructor on LuxAcademy."}
                </p>

                {/* Stats row */}
                <div className="flex items-center gap-4 mb-4 py-3 border-t border-[#2A1B4E]">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                    <BookOpen className="w-3.5 h-3.5 text-violet-400" />
                    {inst.courseCount} course{inst.courseCount !== 1 ? "s" : ""}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                    <Users className="w-3.5 h-3.5 text-fuchsia-400" />
                    {(inst.totalStudents || 0).toLocaleString()} students
                  </div>
                </div>

                {/* CTA */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    Joined {new Date(inst.createdAt).getFullYear()}
                  </span>
                  <div className="flex items-center gap-1 text-violet-400 text-xs font-black group-hover:text-white transition-colors">
                    View Profile <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
