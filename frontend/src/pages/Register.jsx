import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, ArrowRight, Github, Sparkles, Code, Layout, User } from "lucide-react";
import { motion } from "framer-motion";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("student"); // "student" or "instructor"
  const [error, setError] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await register(name, email, password, role);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#080410] flex flex-col lg:flex-row text-white font-sans overflow-hidden">
      {/* Visual Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0A051A] overflow-hidden items-center justify-center border-r border-[#2A1B4E]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
            alt="Setup" 
            className="w-full h-full object-cover opacity-20 mix-blend-overlay filter grayscale-[30%] blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080410] via-[#0A051A]/80 to-[#0A051A]/90" />
          
          {/* Animated Orbs */}
          <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] bg-violet-600/20 rounded-full blur-[100px] animate-pulse pointer-events-none" />
          <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse pointer-events-none delay-1000" />
        </div>
        
        <div className="relative z-10 max-w-lg px-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-violet-500/30 bg-[#120B24] mb-8">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-[10px] font-bold text-violet-300 tracking-wider uppercase">LuxAcademy Platform</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight tracking-tight drop-shadow-sm">
            Master the skills of tomorrow, <span className="text-violet-500">today</span>.
          </h2>
          <p className="text-lg text-slate-400 font-medium mb-12 leading-relaxed">
            Join thousands of developers, designers, and creators building the future through elite multi-instructor courses.
          </p>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-[#120B24] border border-[#2A1B4E] p-6 rounded-2xl flex flex-col items-start shadow-xl shadow-black/50">
              <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center mb-4 border border-violet-500/30">
                <Code className="h-5 w-5 text-violet-400" />
              </div>
              <h4 className="font-bold text-white text-lg mb-1">Coding</h4>
              <p className="text-slate-400 text-sm">Advanced full-stack courses</p>
            </div>
            <div className="bg-[#120B24] border border-[#2A1B4E] p-6 rounded-2xl flex flex-col items-start shadow-xl shadow-black/50">
              <div className="w-10 h-10 rounded-full bg-fuchsia-500/20 flex items-center justify-center mb-4 border border-fuchsia-500/30">
                <Layout className="h-5 w-5 text-fuchsia-400" />
              </div>
              <h4 className="font-bold text-white text-lg mb-1">Design</h4>
              <p className="text-slate-400 text-sm">UI/UX & Graphic design</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 pt-28 lg:pt-32 pb-12 relative overflow-y-auto">
        <div className="absolute top-[10%] right-[-10%] w-[300px] h-[300px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-10">
            <Link to="/" className="inline-block mb-8 md:hidden">
               <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 drop-shadow-sm">LuxAcademy<span className="text-violet-500">.</span></span>
            </Link>
            <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
              Create an account
            </h1>
            <p className="text-slate-400 font-medium">
              Start your learning journey with world-class instructors.
            </p>
            {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">I am signing up as a...</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setRole("student")}
                    className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all ${
                      role === "student" 
                        ? "bg-violet-600/20 border-violet-500 text-violet-400" 
                        : "bg-[#120B24] border-[#2A1B4E] text-slate-400 hover:border-slate-500"
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("instructor")}
                    className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all ${
                      role === "instructor" 
                        ? "bg-fuchsia-600/20 border-fuchsia-500 text-fuchsia-400" 
                        : "bg-[#120B24] border-[#2A1B4E] text-slate-400 hover:border-slate-500"
                    }`}
                  >
                    Instructor
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe" 
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-[#120B24] border border-[#2A1B4E] rounded-xl focus:border-violet-500 focus:shadow-[0_0_15px_rgba(124,58,237,0.15)] outline-none transition-all font-medium text-white placeholder:text-slate-600 text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" 
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-[#120B24] border border-[#2A1B4E] rounded-xl focus:border-violet-500 focus:shadow-[0_0_15px_rgba(124,58,237,0.15)] outline-none transition-all font-medium text-white placeholder:text-slate-600 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
                  </div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-[#120B24] border border-[#2A1B4E] rounded-xl focus:border-violet-500 focus:shadow-[0_0_15px_rgba(124,58,237,0.15)] outline-none transition-all font-medium text-white placeholder:text-slate-600 text-sm"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full flex items-center justify-center space-x-2 bg-violet-600 hover:bg-violet-500 text-white py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] group mt-6">
                  <span>Create Account</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs font-semibold uppercase tracking-wider">
                  <span className="px-4 bg-[#080410] text-slate-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center space-x-2 bg-[#120B24] border border-[#2A1B4E] py-3.5 rounded-xl hover:bg-[#1A103C] hover:border-violet-500/50 transition-all font-bold text-slate-300 text-sm group">
                  <svg className="h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  <span className="group-hover:text-white transition-colors">Google</span>
                </button>
                <button className="flex items-center justify-center space-x-2 bg-[#120B24] border border-[#2A1B4E] py-3.5 rounded-xl hover:bg-[#1A103C] hover:border-violet-500/50 transition-all font-bold text-slate-300 text-sm group">
                  <Github className="h-5 w-5 text-slate-300 group-hover:text-white transition-colors" />
                  <span className="group-hover:text-white transition-colors">GitHub</span>
                </button>
              </div>
            </div>

            <p className="mt-8 text-center text-sm font-medium text-slate-500">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-violet-400 font-bold hover:text-white transition-colors underline-offset-4 hover:underline"
              >
                Log in here
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}