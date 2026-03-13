import { Link, useLocation } from "react-router-dom";
import { BookOpen, Menu, X, ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${
        scrolled ? "bg-[#0A051A]/80 backdrop-blur-xl border-white/10 py-4 shadow-2xl shadow-violet-900/10" : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <span className="font-bold text-white text-xl leading-none">L</span>
            </div>
            <span className="font-sans text-xl font-bold tracking-tight text-white group-hover:text-violet-400 transition-colors duration-500">
              LuxAcademy.
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {[
              { label: "Home", path: "/" },
              { label: "Courses", path: "/courses" },
              { label: "Pricing", path: "/pricing" },
              { label: "Dashboard", path: "/dashboard" },
              { label: "Contact Us", path: "/contact" }
            ].map((link, i) => (
              <Link 
                key={i} 
                to={link.path} 
                className={`text-sm font-medium transition-colors hover:text-violet-400 ${location.pathname === link.path ? 'text-violet-400' : 'text-slate-300'}`}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="flex items-center space-x-4 pl-6 md:pl-8 border-l border-white/10">
              <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-300 flex items-center space-x-1"
              >
                <span>Get Started</span>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300 hover:text-white transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-[#0E0725] border-b border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-8 space-y-6 flex flex-col">
              {[
                { label: "Home", path: "/" },
                { label: "Courses", path: "/courses" },
                { label: "Pricing", path: "/pricing" },
                { label: "Dashboard", path: "/dashboard" },
                { label: "Contact Us", path: "/contact" }
              ].map((link, i) => (
                <Link 
                  key={i}
                  to={link.path} 
                  onClick={() => setIsOpen(false)}
                  className="text-base font-semibold text-slate-300 hover:text-violet-400 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="w-full h-px bg-white/10 my-2" />
              <Link 
                to="/login" 
                onClick={() => setIsOpen(false)}
                className="text-base font-semibold text-slate-300 hover:text-violet-400 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="bg-violet-600 text-white text-base font-semibold px-6 py-3 w-full text-center rounded-full"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
