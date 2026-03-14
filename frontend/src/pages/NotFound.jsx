import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, BookOpen, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-[#080410] min-h-screen text-white font-sans flex items-center justify-center overflow-hidden relative">
      {/* Background orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[20%] right-[15%] w-[300px] h-[300px] bg-fuchsia-600/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* 404 number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative inline-block mb-6"
        >
          <span className="text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-violet-400 via-fuchsia-400 to-violet-900 select-none">
            404
          </span>
          {/* Glowing underline */}
          <div className="absolute bottom-4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold mb-4 tracking-tight"
        >
          Page Not Found
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-slate-400 text-base md:text-lg leading-relaxed mb-10"
        >
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all shadow-[0_0_20px_rgba(124,58,237,0.35)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)]"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Link>

          <Link
            to="/courses"
            className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl border border-[#2A1B4E] bg-[#0A051A]/60 hover:bg-[#120B24] text-slate-300 hover:text-white font-semibold text-sm transition-all"
          >
            <BookOpen className="w-4 h-4" />
            <span>Browse Courses</span>
          </Link>
        </motion.div>

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10"
        >
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center space-x-1.5 text-sm text-slate-500 hover:text-violet-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go back to previous page</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
