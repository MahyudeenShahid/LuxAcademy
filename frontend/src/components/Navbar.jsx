import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Menu, X, LayoutDashboard, LogOut, ChevronDown, Award, Users, BarChart3, Plus, GraduationCap } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const ROLE_COLORS = {
  admin:      "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  instructor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  student:    "text-violet-400 bg-violet-500/10 border-violet-500/30",
};

const ROLE_LINKS = {
  student: [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/courses",   icon: BookOpen,        label: "Browse Courses" },
    { to: "/dashboard", icon: Award,           label: "My Certificates", tab: "certificates" },
  ],
  instructor: [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/dashboard", icon: BookOpen,        label: "My Courses",     tab: "manage_courses" },
    { to: "/dashboard", icon: Plus,            label: "Create Course",  tab: "create_course" },
    { to: "/dashboard", icon: Users,           label: "My Students",    tab: "enrollments" },
  ],
  admin: [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/dashboard", icon: Users,           label: "Manage Users",   tab: "manage_users" },
    { to: "/dashboard", icon: BookOpen,        label: "Manage Courses", tab: "manage_all_courses" },
    { to: "/dashboard", icon: BarChart3,       label: "Analytics",      tab: "platform_analytics" },
  ],
};

export default function Navbar() {
  const [isOpen, setIsOpen]     = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location  = useLocation();
  const navigate  = useNavigate();
  const { user, logout } = useAuth();
  const dropRef   = useRef(null);

  useEffect(() => {
    const cb = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", cb);
    return () => window.removeEventListener("scroll", cb);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => { setIsOpen(false); setDropOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); setDropOpen(false); navigate("/"); };

  const navLinks = [
    { label: "Home",    path: "/" },
    { label: "Courses", path: "/courses" },
    { label: "Pricing", path: "/pricing" },
    { label: "Contact", path: "/contact" },
  ];

  const roleLinks = user ? (ROLE_LINKS[user.role] || ROLE_LINKS.student) : [];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${
      scrolled
        ? "bg-[#0A051A]/90 backdrop-blur-xl border-white/10 py-3 shadow-2xl shadow-violet-900/10"
        : "bg-transparent border-transparent py-5"
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.4)]">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-sans text-xl font-bold tracking-tight text-white group-hover:text-violet-400 transition-colors duration-300">
              LuxAcademy<span className="text-violet-400">.</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center space-x-7">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}
                className={`text-sm font-medium transition-colors hover:text-violet-400 ${
                  location.pathname === link.path ? "text-violet-400" : "text-slate-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center space-x-4 pl-6 border-l border-white/10">
            {user ? (
              <div className="relative" ref={dropRef}>
                <button
                  onClick={() => setDropOpen((o) => !o)}
                  className="flex items-center space-x-2.5 bg-[#120B24] border border-[#2A1B4E] hover:border-violet-500/40 rounded-full pl-1.5 pr-3 py-1.5 transition-all"
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-violet-500/40 shrink-0">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-violet-600/40 flex items-center justify-center text-violet-200 text-xs font-bold">
                        {user.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-white max-w-[90px] truncate">{user.name}</span>
                  <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${ROLE_COLORS[user.role] || ROLE_COLORS.student}`}>
                    {user.role}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${dropOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {dropOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 bg-[#120B24] border border-[#2A1B4E] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-[#2A1B4E]">
                        <p className="text-white font-bold text-sm truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        {roleLinks.map((item, idx) => (
                          <Link
                            key={idx}
                            to={item.tab ? `${item.to}?tab=${item.tab}` : item.to}
                            className="flex items-center space-x-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                          >
                            <item.icon className="w-4 h-4 text-violet-400" />
                            <span>{item.label}</span>
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-[#2A1B4E] py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/5 hover:text-red-300 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center space-x-3">
            {user && (
              <div className="w-8 h-8 rounded-full overflow-hidden border border-violet-500/40 shrink-0">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-violet-600/40 flex items-center justify-center text-violet-200 text-xs font-bold">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </div>
            )}
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-300 hover:text-white transition-colors">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-[#0E0725] border-b border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-8 space-y-1 flex flex-col">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path}
                  className={`text-base font-semibold py-2.5 transition-colors hover:text-violet-400 ${
                    location.pathname === link.path ? "text-violet-400" : "text-slate-300"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="w-full h-px bg-white/10 my-3" />

              {user ? (
                <>
                  <div className="flex items-center space-x-3 py-2 mb-1">
                    <div className="w-9 h-9 rounded-full overflow-hidden border border-violet-500/40 shrink-0">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-violet-600/40 flex items-center justify-center text-violet-200 text-sm font-bold">
                          {user.name?.[0]?.toUpperCase() || "U"}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{user.name}</p>
                      <p className={`text-[10px] font-bold uppercase ${ROLE_COLORS[user.role]?.split(" ")[0] || "text-violet-400"}`}>
                        {user.role}
                      </p>
                    </div>
                  </div>
                  {roleLinks.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.tab ? `${item.to}?tab=${item.tab}` : item.to}
                      className="flex items-center space-x-3 text-base font-semibold text-slate-300 hover:text-violet-400 py-2 transition-colors"
                    >
                      <item.icon className="w-5 h-5 text-slate-400" /><span>{item.label}</span>
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 text-base font-semibold text-red-400 hover:text-red-300 py-2 transition-colors"
                  >
                    <LogOut className="w-5 h-5" /><span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-base font-semibold text-slate-300 hover:text-violet-400 py-2.5 transition-colors">
                    Sign In
                  </Link>
                  <Link to="/register" className="bg-violet-600 text-white text-base font-semibold px-6 py-3 w-full text-center rounded-full mt-2">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
