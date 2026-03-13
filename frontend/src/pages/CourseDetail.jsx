import { useParams, Link } from "react-router-dom";
import { Star, Clock, Award, PlayCircle, FileText, CheckCircle, ChevronRight, User, Share2, Heart, MonitorPlay } from "lucide-react";
import { motion } from "framer-motion";

export default function CourseDetail() {
  const { id } = useParams();

  return (
    <div className="bg-[#080410] min-h-screen text-white font-sans selection:bg-violet-600/30 overflow-hidden relative pb-24">
      {/* Background Orbs */}
      <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[-5%] w-[400px] h-[400px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Hero Section */}
      <div className="pt-32 lg:pt-40 pb-32 relative z-10 border-b border-white/5 bg-[#0A051A]/50 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mb-8 overflow-x-auto whitespace-nowrap">
            <Link to="/courses" className="hover:text-violet-400 transition-colors">Courses</Link>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            <Link to="/courses" className="hover:text-violet-400 transition-colors">UI/UX Design</Link>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-violet-300">UX Fundamentals</span>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-8">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-violet-500/30 bg-[#120B24]">
                <span className="text-[9px] font-semibold text-violet-300 tracking-wider w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                <span className="text-[9px] font-bold text-violet-300 tracking-wider uppercase">Bestseller</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight drop-shadow-sm">
                User Experience Design Fundamentals
              </h1>
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl">
                Master the art of creating intuitive and engaging digital experiences from scratch. Learn user research, wireframing, and interactive prototyping.
              </p>
              
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4 text-sm font-medium text-slate-300">
                <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-xl">
                  <div className="flex text-amber-400 flex-shrink-0">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400" />)}
                  </div>
                  <span className="text-white font-bold">4.9</span>
                  <span className="text-slate-400">(4,280 ratings)</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-xl">
                  <User className="h-4 w-4 text-violet-400" />
                  <span>24.5k enrolled</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-xl">
                  <Award className="h-4 w-4 text-fuchsia-400" />
                  <span>Beginner Level</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <div className="flex items-center space-x-4">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
                    alt="Instructor" 
                    className="w-14 h-14 rounded-full border-2 border-[#2A1B4E] object-cover ring-2 ring-violet-500/20"
                  />
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Lead Instructor</p>
                    <p className="text-white font-bold text-lg hover:text-violet-400 transition-colors cursor-pointer">Sarah Mitchell</p>
                  </div>
                </div>
                <div className="hidden sm:flex space-x-3">
                  <button className="w-10 h-10 rounded-full bg-[#120B24] border border-[#2A1B4E] flex items-center justify-center text-slate-300 hover:text-pink-500 hover:border-pink-500/50 transition-all group">
                    <Heart className="w-5 h-5 group-hover:fill-pink-500/20" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-[#120B24] border border-[#2A1B4E] flex items-center justify-center text-slate-300 hover:text-white hover:border-white transition-all">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 -mt-20 relative z-20">
        <div className="grid lg:grid-cols-3 gap-12 static">
          
          <div className="lg:col-span-2 space-y-10">
            {/* What you'll learn */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#120B24] rounded-3xl p-8 border border-[#2A1B4E] shadow-xl shadow-black/50"
            >
              <h2 className="text-2xl font-bold text-white mb-6">What you'll learn</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "Conduct practical user research and analysis.",
                  "Create wireframes and interactive prototypes.",
                  "Understand cognitive psychology in design.",
                  "Design accessible and inclusive interfaces.",
                  "Build out a professional UX portfolio.",
                  "Collaborate effectively with development teams."
                ].map((item, i) => (
                  <div key={i} className="flex space-x-3">
                    <CheckCircle className="h-6 w-6 text-violet-500 shrink-0" />
                    <span className="text-slate-300 font-medium text-sm leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Curriculum */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#120B24] rounded-3xl p-8 border border-[#2A1B4E] shadow-xl shadow-black/50"
            >
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Course Curriculum</h2>
                  <p className="text-slate-400 text-sm font-medium">16 Sessions • 4 Weeks • 24 Total Hours</p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { title: "Module 1: Introduction to UX Processes", duration: "2h 45m", lessons: 8 },
                  { title: "Module 2: Empathy and User Research", duration: "3h 15m", lessons: 10 },
                  { title: "Module 3: Information Architecture", duration: "2h 30m", lessons: 7 },
                  { title: "Module 4: Wireframing and Prototyping", duration: "4h 00m", lessons: 12 },
                  { title: "Module 5: Usability Testing Methods", duration: "3h 45m", lessons: 9 },
                ].map((mod, i) => (
                  <div key={i} className="border border-[#2A1B4E] bg-[#0A051A]/50 rounded-2xl p-5 hover:border-violet-500/50 hover:bg-[#1A103C]/50 transition-all cursor-pointer group">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-white group-hover:text-violet-300 transition-colors text-base">{mod.title}</h3>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-violet-600/20 transition-colors">
                        <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-violet-400" />
                      </div>
                    </div>
                    <div className="flex space-x-4 text-xs font-semibold text-slate-400 tracking-wide uppercase">
                      <span className="flex items-center space-x-1.5"><MonitorPlay className="h-4 w-4 text-violet-500" /><span>{mod.lessons} Lessons</span></span>
                      <span className="flex items-center space-x-1.5"><Clock className="h-4 w-4 text-violet-500" /><span>{mod.duration}</span></span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Floating Action Card */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#120B24] rounded-3xl shadow-2xl border border-[#2A1B4E] overflow-hidden sticky top-32 z-50 transform-gpu"
            >
              <div className="relative h-56 bg-[#080410] flex items-center justify-center group cursor-pointer overflow-hidden p-2">
                <div className="w-full h-full rounded-[1.25rem] overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Course Video"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-violet-600/90 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-violet-500 transition-all shadow-[0_0_30px_rgba(124,58,237,0.5)]">
                      <PlayCircle className="h-8 w-8 text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 text-center z-10">
                    <span className="text-white font-bold text-xs tracking-widest uppercase bg-black/50 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-md">Preview Course</span>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex items-end space-x-3 mb-6">
                  <div className="text-4xl font-bold text-white">$19.00</div>
                  <div className="text-lg text-slate-500 font-medium line-through mb-1">$25.00</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-green-400 mb-2 bg-green-400/10 px-2 py-1 rounded-md">24% Off</div>
                </div>
                
                <button className="w-full bg-violet-600 hover:bg-violet-500 text-white py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] mb-4">
                  Enroll Now
                </button>
                <button className="w-full bg-transparent hover:bg-[#1A103C] text-white border border-[#2A1B4E] py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-colors">
                  Add to Wishlist
                </button>

                <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                  <h4 className="font-bold text-white text-sm uppercase tracking-wider">This course includes:</h4>
                  <ul className="space-y-4 text-sm font-medium text-slate-400">
                    <li className="flex items-center space-x-4"><MonitorPlay className="h-5 w-5 text-violet-400" /><span>24 hours of on-demand video</span></li>
                    <li className="flex items-center space-x-4"><FileText className="h-5 w-5 text-violet-400" /><span>14 downloadable resources</span></li>
                    <li className="flex items-center space-x-4"><Award className="h-5 w-5 text-violet-400" /><span>Certificate of completion</span></li>
                    <li className="flex items-center space-x-4"><Clock className="h-5 w-5 text-violet-400" /><span>Full lifetime access</span></li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}