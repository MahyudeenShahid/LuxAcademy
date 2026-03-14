import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import {
  BookOpen, Award, Activity, Settings,
  ChevronRight, Users, Video, BarChart3, FileText, Plus, Shield, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import StudentDashboard from "../components/dashboard/StudentDashboard";
import InstructorDashboard from "../components/dashboard/InstructorDashboard";
import AdminDashboard from "../components/dashboard/AdminDashboard";
import DashboardTour from "../components/DashboardTour";

export default function Dashboard() {
  const { user } = useAuth();
  const role = user?.role || "student";
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => searchParams.get("tab") || "overview");

  // First-login tour — keyed per user so each account gets the tour once
  const tourKey = `lms_tour_${user?._id || role}_done`;
  const [showTour, setShowTour] = useState(false);
  useEffect(() => {
    if (localStorage.getItem(tourKey) !== "true") setShowTour(true);
  }, [tourKey]);
  const completeTour = () => { localStorage.setItem(tourKey, "true"); setShowTour(false); };

  // Prevent page-level scroll while dashboard is visible; reset scroll from previous pages
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Sync tab from URL query param (e.g. Navbar links use ?tab=xxx)
  useEffect(() => {
    const t = searchParams.get("tab");
    if (t) { setActiveTab(t); setSearchParams({}, { replace: true }); }
  }, [searchParams, setSearchParams]);

  const menus = {
    student: [
      { id: "overview",      icon: Activity,    label: "Overview" },
      { id: "courses",       icon: BookOpen,    label: "My Learning" },
      { id: "certificates",  icon: Award,       label: "Certificates" },
      { id: "settings",      icon: Settings,    label: "Profile Settings" },
    ],
    instructor: [
      { id: "overview",       icon: Activity,  label: "Overview" },
      { id: "manage_courses", icon: Video,     label: "Manage Courses" },
      { id: "create_course",  icon: Plus,      label: "Create Course" },
      { id: "analytics",      icon: BarChart3, label: "Analytics" },
      { id: "enrollments",    icon: Users,     label: "Students" },
      { id: "settings",       icon: Settings,  label: "Settings" },
    ],
    admin: [
      { id: "overview",            icon: Activity,  label: "Platform Overview" },
      { id: "manage_users",        icon: Users,     label: "Manage Users" },
      { id: "manage_all_courses",  icon: BookOpen,  label: "Manage Courses" },
      { id: "platform_analytics",  icon: BarChart3, label: "Analytics" },
      { id: "reports",             icon: FileText,  label: "Reports" },
      { id: "settings",            icon: Settings,  label: "Settings" },
    ],
  };

  return (
    /* Fix double scroll: h-screen + overflow-hidden, single inner scroll on main */
    <div className="bg-[#080410] h-screen pt-20 flex flex-col md:flex-row text-white font-sans selection:bg-violet-600/30 overflow-hidden relative">
      {/* First-login guided tour */}
      <AnimatePresence>
        {showTour && (
          <DashboardTour role={role} setActiveTab={setActiveTab} onComplete={completeTour} />
        )}
      </AnimatePresence>
      {/* Background orbs */}
      <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Sidebar — scrolls independently */}
      <aside className="w-full md:w-72 bg-[#0A051A]/80 backdrop-blur-2xl border-r border-[#2A1B4E] p-6 hidden md:flex flex-col relative z-10 shrink-0 overflow-y-auto">
        {/* Profile Card */}
        <div className="bg-[#120B24] border border-[#2A1B4E] rounded-2xl p-4 mb-8 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-violet-500/50 shadow-[0_0_15px_rgba(124,58,237,0.3)] shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-violet-600/30 flex items-center justify-center text-violet-300 font-bold text-lg">
                  {user?.name?.[0]?.toUpperCase() || '?'}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-white text-sm truncate">{user?.name || 'User'}</h3>
              <div className="inline-flex items-center space-x-1 mt-1">
                {role === "admin"      ? <Shield   className="w-3 h-3 text-emerald-400" />
                 : role === "instructor" ? <Activity className="w-3 h-3 text-amber-400" />
                 :                        <Sparkles className="w-3 h-3 text-fuchsia-400" />}
                <p className={`text-[10px] font-bold uppercase tracking-wider ${
                  role === 'admin' ? 'text-emerald-400' : role === 'instructor' ? 'text-amber-400' : 'text-fuchsia-400'
                }`}>
                  {role} Account
                </p>
              </div>
            </div>
          </div>
        </div>

        <nav className="space-y-2 flex-grow">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 ml-2">Menu</h4>
          {menus[role].map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              whileTap={{ scale: 0.97 }}
              whileHover={{ x: activeTab === item.id ? 0 : 3 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl font-semibold text-sm transition-colors group ${
                activeTab === item.id
                  ? "bg-violet-600 text-white shadow-[0_0_20px_rgba(124,58,237,0.25)]"
                  : "text-slate-400 hover:bg-[#120B24] hover:text-white"
              }`}
            >
              <item.icon className={`h-5 w-5 transition-colors ${activeTab === item.id ? "text-white" : "text-slate-500 group-hover:text-violet-400"}`} />
              <span>{item.label}</span>
              {activeTab === item.id && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
            </motion.button>
          ))}
        </nav>
      </aside>

      {/* Main Content — single scroll area prevents double scroll */}
      <main className="flex-1 relative z-10 overflow-y-auto">
        <div className="px-6 lg:px-10 xl:px-12 py-10">
          <header className="mb-10">
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
              {menus[role].find((m) => m.id === activeTab)?.label || "Dashboard"}
            </h1>
            <p className="text-slate-400 text-sm font-medium">
              {role === "student"    && "Welcome back! Keep up the great progress."}
              {role === "instructor" && "Manage your courses and interact with students."}
              {role === "admin"      && "Platform is fully operational and secure."}
            </p>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${role}-${activeTab}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {role === "student"    && <StudentDashboard    activeTab={activeTab} />}
              {role === "instructor" && <InstructorDashboard activeTab={activeTab} setActiveTab={setActiveTab} />}
              {role === "admin"      && <AdminDashboard      activeTab={activeTab} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
