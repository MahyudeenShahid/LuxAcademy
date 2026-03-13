import { useState } from "react";
import { 
  BookOpen, Award, Activity, Settings, 
  ChevronRight, Users, Video, BarChart3, FileText, Plus, Shield, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Import the separated dashboard components
import StudentDashboard from "../components/dashboard/StudentDashboard";
import InstructorDashboard from "../components/dashboard/InstructorDashboard";
import AdminDashboard from "../components/dashboard/AdminDashboard";

export default function Dashboard() {
  const [role, setRole] = useState("student"); // "student", "instructor", "admin"
  const [activeTab, setActiveTab] = useState("overview");

  // Navigation Menus structured by role
  const menus = {
    student: [
      { id: "overview", icon: Activity, label: "Overview" },
      { id: "courses", icon: BookOpen, label: "My Learning" },
      { id: "certificates", icon: Award, label: "Certificates" },
      { id: "settings", icon: Settings, label: "Profile Settings" },
    ],
    instructor: [
      { id: "overview", icon: Activity, label: "Overview" },
      { id: "manage_courses", icon: Video, label: "Manage Courses" },
      { id: "create_course", icon: Plus, label: "Create Course" },
      { id: "analytics", icon: BarChart3, label: "Analytics" },
      { id: "enrollments", icon: Users, label: "Students" },
      { id: "settings", icon: Settings, label: "Settings" },
    ],
    admin: [
      { id: "overview", icon: Activity, label: "Platform Overview" },
      { id: "manage_users", icon: Users, label: "Manage Users" },
      { id: "manage_all_courses", icon: BookOpen, label: "Manage Courses" },
      { id: "platform_analytics", icon: BarChart3, label: "Analytics" },
      { id: "reports", icon: FileText, label: "Reports" },
      { id: "settings", icon: Settings, label: "Settings" },
    ]
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setActiveTab("overview");
  };

  return (
    <div className="bg-[#080410] pt-24 min-h-screen flex flex-col md:flex-row text-white font-sans selection:bg-violet-600/30 overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-[#0A051A]/80 backdrop-blur-2xl border-r border-[#2A1B4E] p-6 flex-col hidden md:flex relative z-10 shrink-0 overflow-y-auto max-h-[calc(100vh-6rem)]">
        
        {/* Role Switcher (For Demo Purposes) */}
        <div className="mb-6 bg-[#120B24] p-1.5 rounded-xl border border-[#2A1B4E] flex shadow-lg">
          {["student", "instructor", "admin"].map((r) => (
            <button
              key={r}
              onClick={() => handleRoleChange(r)}
              className={`flex-1 text-[10px] font-bold uppercase tracking-wider py-2 rounded-lg transition-all ${
                role === r 
                  ? "bg-violet-600 text-white shadow-[0_0_10px_rgba(124,58,237,0.3)]" 
                  : "text-slate-500 hover:text-white hover:bg-white/5"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="bg-[#120B24] border border-[#2A1B4E] rounded-2xl p-4 mb-8 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-violet-500/50 shadow-[0_0_15px_rgba(124,58,237,0.3)] shrink-0">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Alex Carter</h3>
              <div className="inline-flex items-center space-x-1 mt-1">
                {role === "admin" ? (
                  <Shield className="w-3 h-3 text-emerald-400" />
                ) : role === "instructor" ? (
                  <Activity className="w-3 h-3 text-amber-400" />
                ) : (
                  <Sparkles className="w-3 h-3 text-fuchsia-400" />
                )}
                <p className={`text-[10px] font-bold uppercase tracking-wider ${
                  role === 'admin' ? 'text-emerald-400' : role === 'instructor' ? 'text-amber-400' : 'text-fuchsia-400'
                }`}>
                  {role} Account
                </p>
              </div>
            </div>
          </div>
        </div>

        <nav className="space-y-2 flex-grow overflow-y-auto pr-2">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 ml-2">Menu</h4>
          {menus[role].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl font-semibold text-sm transition-all group ${
                activeTab === item.id 
                  ? "bg-violet-600 text-white shadow-[0_0_20px_rgba(124,58,237,0.2)]" 
                  : "text-slate-400 hover:bg-[#120B24] hover:text-white"
              }`}
            >
              <item.icon className={`h-5 w-5 ${activeTab === item.id ? "text-white" : "text-slate-500 group-hover:text-violet-400"}`} />
              <span>{item.label}</span>
              {activeTab === item.id && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 lg:p-10 xl:p-12 relative z-10 overflow-y-auto max-h-[calc(100vh-6rem)]">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
              {menus[role].find(m => m.id === activeTab)?.label || "Dashboard"}
            </h1>
            <p className="text-slate-400 text-sm font-medium">
              {role === "student" && "Welcome back! Keep up the great progress."}
              {role === "instructor" && "Manage your courses and interact with students."}
              {role === "admin" && "Platform is fully operational and secure."}
            </p>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${role}-${activeTab}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Conditional Rendering based on Role */}
            {role === "student" && (
              <StudentDashboard activeTab={activeTab} />
            )}
            
            {role === "instructor" && (
              <InstructorDashboard activeTab={activeTab} setActiveTab={setActiveTab} />
            )}
            
            {role === "admin" && (
              <AdminDashboard activeTab={activeTab} />
            )}
            
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}