import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen, Award, BarChart3, Users, Video, Plus,
  FileText, Shield, GraduationCap, Sparkles, X, ChevronRight, ChevronLeft
} from "lucide-react";

/* ── Per-role tour steps ──────────────────────────────────────────────────── */
const TOUR = {
  student: [
    {
      icon: GraduationCap,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/30",
      title: "Welcome to LuxAcademy! 🎓",
      desc: "You're on your personal learning dashboard. Let's take a quick tour so you can hit the ground running.",
      tab: null,
    },
    {
      icon: BarChart3,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      title: "Your Stats at a Glance",
      desc: "See enrolled courses, completed ones, certificates earned, and your daily study streak — all updated in real time.",
      tab: "overview",
    },
    {
      icon: Sparkles,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      title: "XP & Levels",
      desc: "Earn XP as you learn. Complete courses for big XP bonuses and level up from Novice → Learner → Scholar → Expert!",
      tab: "overview",
    },
    {
      icon: Award,
      color: "text-fuchsia-400",
      bg: "bg-fuchsia-500/10",
      border: "border-fuchsia-500/30",
      title: "Achievement Badges",
      desc: "Unlock achievements by hitting milestones: first course, 7-day streak, completing 3+ courses. Collect them all!",
      tab: "overview",
    },
    {
      icon: BookOpen,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      title: "My Learning Tab",
      desc: "Track progress across all enrolled courses here. Completed courses show a Certificate button for instant access.",
      tab: "courses",
    },
    {
      icon: Award,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/30",
      title: "Certificates",
      desc: "Finish a course 100% and a certificate is auto-generated. View it full-screen or download it as a PNG image!",
      tab: "certificates",
    },
  ],
  instructor: [
    {
      icon: GraduationCap,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      title: "Welcome, Instructor! 🧑‍🏫",
      desc: "This is your teaching control centre. Manage courses, track students, and grow your reach on LuxAcademy.",
      tab: null,
    },
    {
      icon: BarChart3,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/30",
      title: "Overview",
      desc: "See your total students, published courses, and revenue figures at a glance every time you log in.",
      tab: "overview",
    },
    {
      icon: Plus,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      title: "Create a Course",
      desc: "Build a course with rich lessons written as blog posts — headings, bullets, quotes. Students read and interact with the content.",
      tab: "create_course",
    },
    {
      icon: Video,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      title: "Manage Courses",
      desc: "Edit course details, add/remove lessons, and toggle publish status. Click the Draft badge directly to publish instantly!",
      tab: "manage_courses",
    },
    {
      icon: Users,
      color: "text-fuchsia-400",
      bg: "bg-fuchsia-500/10",
      border: "border-fuchsia-500/30",
      title: "Your Students",
      desc: "See every student enrolled in your courses, their progress, and when they joined. Stay connected with your audience.",
      tab: "enrollments",
    },
    {
      icon: BarChart3,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/30",
      title: "Analytics",
      desc: "Review enrollment trends, monthly growth, and total revenue. Use the data to make better courses.",
      tab: "analytics",
    },
  ],
  admin: [
    {
      icon: Shield,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      title: "Welcome, Admin! 🛡️",
      desc: "You have full platform control. Manage users, courses, analytics, and export reports all from this dashboard.",
      tab: null,
    },
    {
      icon: BarChart3,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/30",
      title: "Platform Overview",
      desc: "See total users, courses, enrollments, and revenue across the entire platform — updated on every visit.",
      tab: "overview",
    },
    {
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      title: "Manage Users",
      desc: "View all accounts, change roles via the inline dropdown, or remove users. Last-admin protection prevents accidental lockout.",
      tab: "manage_users",
    },
    {
      icon: BookOpen,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      title: "Manage All Courses",
      desc: "Review and remove any course on the platform. Keep content quality high and remove anything that violates guidelines.",
      tab: "manage_all_courses",
    },
    {
      icon: FileText,
      color: "text-fuchsia-400",
      bg: "bg-fuchsia-500/10",
      border: "border-fuchsia-500/30",
      title: "Reports & Exports",
      desc: "Export users, courses, or enrollment data as CSV files for external analysis, audits, or reporting.",
      tab: "reports",
    },
  ],
};

/* ── Tour component ───────────────────────────────────────────────────────── */
export default function DashboardTour({ role, setActiveTab, onComplete }) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1); // 1=forward, -1=backward
  const steps = TOUR[role] || TOUR.student;
  const current = steps[step];
  const Icon = current.icon;

  const go = (delta) => {
    const next = step + delta;
    if (next < 0 || next >= steps.length) { onComplete(); return; }
    setDir(delta);
    const nextStep = steps[next];
    if (nextStep.tab) setActiveTab(nextStep.tab);
    setStep(next);
  };

  // Dot progress
  const dots = steps.map((_, i) => i);

  return createPortal(
    <div className="fixed inset-0 z-8000 pointer-events-none">
      {/* Subtle dark vignette */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px] pointer-events-auto"
        onClick={onComplete}
      />

      {/* Tour card — bottom right*/}
      <div className="absolute bottom-6 right-6 w-full max-w-sm pointer-events-auto z-8001">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -dir * 30, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className={`bg-[#0d0825] border ${current.border} rounded-2xl shadow-2xl overflow-hidden`}
          >
            {/* Coloured top stripe */}
            <div className={`h-1 w-full ${current.border.replace("border-", "bg-").replace("/30", "/80")}`} />

            <div className="p-5">
              {/* Header row */}
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${current.bg} border ${current.border}`}>
                  <Icon className={`w-5 h-5 ${current.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-black text-base leading-tight">{current.title}</p>
                  <p className="text-slate-400 text-xs font-medium mt-1 leading-relaxed">{current.desc}</p>
                </div>
                <button
                  onClick={onComplete}
                  className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-300 hover:bg-white/5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Step dots */}
              <div className="flex items-center justify-center gap-1.5 mb-4">
                {dots.map((i) => (
                  <div
                    key={i}
                    className={`rounded-full transition-all duration-300 ${
                      i === step
                        ? `w-5 h-2 ${current.bg.replace("/10", "/80")}`
                        : i < step
                        ? `w-2 h-2 ${current.bg.replace("/10", "/40")}`
                        : "w-2 h-2 bg-white/10"
                    }`}
                  />
                ))}
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-2">
                {step > 0 && (
                  <button
                    onClick={() => go(-1)}
                    className="flex items-center gap-1 text-slate-400 hover:text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-white/5 transition-all active:scale-95"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Back
                  </button>
                )}
                <button
                  onClick={onComplete}
                  className="text-slate-500 hover:text-slate-300 text-xs px-3 py-2 rounded-xl hover:bg-white/5 transition-all active:scale-95 mr-auto"
                >
                  Skip tour
                </button>
                <button
                  onClick={() => go(1)}
                  className={`flex items-center gap-1.5 text-white text-xs font-black px-4 py-2 rounded-xl transition-all active:scale-95 ${
                    step === steps.length - 1
                      ? "bg-emerald-600 hover:bg-emerald-500"
                      : `bg-violet-600 hover:bg-violet-500`
                  }`}
                >
                  {step === steps.length - 1 ? "Let's go! 🚀" : "Next"}
                  {step < steps.length - 1 && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>,
    document.body
  );
}
