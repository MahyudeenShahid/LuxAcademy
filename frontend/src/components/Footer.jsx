import { Link } from "react-router-dom";
import { BookOpen, Twitter, Linkedin, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#080410] border-t border-[#2A1B4E] relative overflow-hidden text-white">
      {/* Background Glow */}
      <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-violet-600/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-8">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-linear-to-br from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-all duration-300 shadow-[0_0_20px_rgba(124,58,237,0.4)]">
                <BookOpen className="text-white w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
              </div>
              <span className="text-2xl md:text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                LuxAcademy<span className="text-violet-500">.</span>
              </span>
            </Link>
            <p className="text-slate-400 max-w-sm leading-relaxed text-sm">
              We empower learners and organizations globally with cutting-edge skills, taught by the world's leading experts. Join the revolution in digital education.
            </p>
            <div className="flex items-center space-x-5 text-slate-500">
              <a href="#" className="w-10 h-10 rounded-full border border-[#2A1B4E] flex items-center justify-center hover:bg-violet-600/20 hover:text-white hover:border-violet-500/50 transition-all">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-[#2A1B4E] flex items-center justify-center hover:bg-violet-600/20 hover:text-white hover:border-violet-500/50 transition-all">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-[#2A1B4E] flex items-center justify-center hover:bg-violet-600/20 hover:text-white hover:border-violet-500/50 transition-all">
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-6 flex items-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              <span>Platform</span>
            </h4>
            <ul className="space-y-3.5 text-sm font-medium text-slate-500">
              <li><Link to="/courses" className="hover:text-violet-400 transition-colors">Course Catalog</Link></li>
              <li><Link to="/about" className="hover:text-violet-400 transition-colors">About Us</Link></li>
              <li><Link to="/instructors" className="hover:text-violet-400 transition-colors">Instructors</Link></li>
              <li><Link to="/pricing" className="hover:text-violet-400 transition-colors">Pricing & Plans</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-6 flex items-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500" />
              <span>Company</span>
            </h4>
            <ul className="space-y-3.5 text-sm font-medium text-slate-500">
              <li><Link to="/privacy" className="hover:text-violet-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-violet-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/contact" className="hover:text-violet-400 transition-colors">Contact Support</Link></li>
              <li><Link to="/careers" className="hover:text-violet-400 transition-colors">Careers</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs font-medium text-slate-600">
          <p>&copy; {new Date().getFullYear()} LuxAcademy LMS. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <p>Designed with <span className="text-rose-500">♥</span> for continuous learning.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
