import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Play, ArrowUpRight, Search, CheckCircle, Star,
  MonitorPlay, Smartphone, PenTool, Database,
  TrendingUp, Shield, ArrowRight, Layout
} from "lucide-react";

const COURSES = [
  {
    id: 1,
    title: "User Experience Design Fundamentals",
    category: "UI/UX DESIGN",
    author: "Sarah Mitchell",
    sessions: "16 Sessions",
    price: "$19.00",
    oldPrice: "$25.00",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Introduction to Graphic Design",
    category: "GRAPHIC DESIGN",
    author: "Liam Garcia",
    sessions: "12 Sessions",
    price: "$30.00",
    oldPrice: "$35.00",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Frontend Web Development Bootcamp",
    category: "WEB DEVELOPMENT",
    author: "Emma Wilson",
    sessions: "28 Sessions",
    price: "$30.00",
    oldPrice: "$85.00",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    title: "Beginner's Guide to Data Analysis",
    category: "DATA SCIENCE",
    author: "Noah Robinson",
    sessions: "20 Sessions",
    price: "$50.00",
    oldPrice: "$85.00",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    title: "Apple App Development Basics",
    category: "MOBILE DEVELOPMENT",
    author: "Olivia Martinez",
    sessions: "20 Sessions",
    price: "$40.00",
    oldPrice: "$65.00",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    title: "Graphic Design Essentials",
    category: "GRAPHIC DESIGN",
    author: "Daniel Rivera",
    sessions: "28 Sessions",
    price: "$20.00",
    oldPrice: "$45.00",
    image: "https://images.unsplash.com/photo-1563240619-44ec0047592c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

const CATEGORIES = [
  { icon: PenTool, title: "UI/UX Design", desc: "Master the principles of user-centered design.", id: "1." },
  { icon: MonitorPlay, title: "Web Development", desc: "Build responsive websites and modern web apps.", id: "2." },
  { icon: Smartphone, title: "Mobile Development", desc: "Learn how to create stunning mobile applications.", id: "3." },
  { icon: TrendingUp, title: "Digital Marketing", desc: "Grow businesses with effective marketing strategies.", id: "4." },
  { icon: Database, title: "Data & Artificial Intelligencies", desc: "Understand data analytics and machine learning.", id: "5." },
  { icon: Shield, title: "Creative & Multimedia", desc: "Unleash your creativity with graphic design.", id: "6." }
];

export default function Home() {
  return (
    <div className="bg-[#080410] min-h-screen text-white font-sans overflow-hidden selection:bg-violet-600/30">
      
      {/* GLOW OVERLAYS */}
      <div className="absolute top-[5%] left-1/4 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute top-[35%] right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-40 lg:pt-18 pb-24 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <div className="mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-[#120B24] mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-[9px] font-semibold text-slate-300 tracking-widest uppercase">E-Learning Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-6 tracking-tight drop-shadow-sm">
            Build Your <span className="text-violet-500">Skills</span>,<br />
            Anytime, Anywhere
          </h1>
          
          <p className="text-slate-400 text-lg mb-10 max-w-[420px] leading-relaxed">
            Anytime access to skills that take you further. Unlock your full potential.
          </p>
          
          <div className="flex flex-wrap items-center gap-6">
            <button className="bg-violet-600 hover:bg-violet-500 text-white px-8 py-3.5 rounded-full font-semibold flex items-center space-x-2 transition-all">
              <span>Start Learning</span>
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </button>
            <button className="flex items-center space-x-4 text-white group">
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-violet-500 transition-colors">
                <Play className="w-4 h-4 text-violet-400 ml-1 group-hover:text-violet-300" />
              </div>
              <span className="font-medium text-sm border-b border-transparent group-hover:border-white transition-all">How it Work</span>
            </button>
          </div>
        </div>
        
        {/* Right side Image Layout */}
        <div className="relative h-[650px] w-full flex items-center justify-center">
          {/* Floating UI Elements matching the LuxAcademy design */}
          <motion.div animate={{ y: [-15, 15, -15] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="absolute left-0 top-20 w-16 h-16 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-violet-500/20 z-20">
             <Star className="w-6 h-6 text-white fill-white" />
          </motion.div>
          <motion.div animate={{ y: [15, -15, 15] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} className="absolute right-4 top-40 w-20 h-20 bg-gradient-to-tr from-fuchsia-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-fuchsia-500/20 z-20">
             <MonitorPlay className="w-8 h-8 text-white" />
          </motion.div>
          <motion.div animate={{ y: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }} className="absolute left-10 bottom-32 w-14 h-14 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20 z-20">
             <PenTool className="w-6 h-6 text-white" />
          </motion.div>

          {/* Student Portrait Image simulating the purple cutout style */}
          <div className="relative w-[85%] h-full rounded-[40px] overflow-hidden bg-violet-600/10 border border-violet-500/20 backdrop-blur-sm z-10 flex items-end justify-center pt-10">
             <img 
               src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
               alt="Student Portrait" 
               className="w-full h-full object-cover rounded-[40px] mix-blend-luminosity opacity-80" 
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#080410] via-violet-900/40 to-transparent" />
          </div>
        </div>
      </section>

      {/* TRUSTED BY MARQUEE */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-32">
        <h4 className="text-center text-slate-400 text-sm font-semibold mb-10 tracking-wide">We are trusted by</h4>
        <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-10 opacity-60">
          {['Logoipsum', 'OpenAI', 'Microsoft', 'Notion', 'Google'].map((logo, i) => (
            <div key={i} className="flex items-center space-x-2 text-xl font-bold tracking-tight">
              <div className="w-6 h-6 rounded-full border border-white flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full"/></div>
              <span>{logo}</span>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-gradient-to-b from-[#0C061E] to-[#0E0725] border-y border-white/5 py-32 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid md:grid-cols-2 gap-16 items-center">
          
          {/* Left Image with rating badge */}
          <div className="relative rounded-[2rem] overflow-hidden aspect-[4/5] bg-violet-900/20 border border-violet-500/20">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" className="w-full h-full object-cover mix-blend-luminosity opacity-80" alt="Students Learning" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E0725] via-transparent to-transparent" />
            
            <div className="absolute left-6 bottom-6 bg-[#160D35]/90 backdrop-blur-lg border border-white/10 p-3.5 rounded-2xl flex items-center space-x-4 shadow-xl">
              <div className="bg-orange-500 w-11 h-11 flex items-center justify-center rounded-xl shadow-lg shadow-orange-500/30">
                <Star className="text-white w-5 h-5 fill-white" />
              </div>
              <div className="pr-4">
                <p className="text-white font-bold text-lg leading-tight">4.9</p>
                <p className="text-[10px] text-slate-300 uppercase tracking-widest font-medium">770k+ Reviews</p>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-8">
              <span className="text-[9px] font-semibold text-slate-300 tracking-wider uppercase">Why Choose Us</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-14 leading-[1.2] tracking-tight">
              Why LuxAcademy Work <br />for You <span className="text-violet-500">Effectively</span>
            </h2>
            
            <div className="space-y-10">
              {[
                { title: "Learn at Your Own Pace", desc: "Access a wide range of courses anytime, anywhere. Whether you're an early bird or night owl, your learning fits your schedule." },
                { title: "Curated Courses by Experts", desc: "Every course is created or reviewed by professionals, so you only get relevant, high-quality learning materials." },
                { title: "Seamless Across All Devices", desc: "From desktop to mobile, enjoy a smooth learning experience with a beautifully crafted interface optimized for focus." }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="flex-shrink-0 w-14 h-14 bg-violet-600/10 rounded-2xl flex items-center justify-center mt-1 border border-violet-500/20 group-hover:bg-violet-600 transition-colors duration-500">
                    <CheckCircle className="w-5 h-5 text-violet-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-3 tracking-wide">{item.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* OUR COURSES */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-32 relative">
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-16 gap-8">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-6">
              <span className="text-[9px] font-semibold text-slate-300 tracking-wider uppercase">Our Courses</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Explore our Best <span className="text-violet-500">Courses</span></h2>
          </div>
          
          <div className="relative w-full md:w-auto">
            <input 
              type="text" 
              placeholder="Search course..." 
              className="bg-[#120B24] border border-[#2A1B4E] rounded-full pl-6 pr-32 py-3.5 w-full md:w-[320px] focus:outline-none focus:border-violet-500 transition-all text-sm font-medium text-white placeholder-slate-500"
            />
            <button className="absolute right-1 top-1 bottom-1 bg-violet-600 hover:bg-violet-500 rounded-full px-6 flex items-center space-x-2 text-sm font-medium transition-colors">
              <span>Search</span>
              <Search className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {COURSES.map(course => (
            <div key={course.id} className="bg-[#120B24] border border-[#2A1B4E] rounded-[1.5rem] p-4 hover:border-violet-500/50 transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-600/10">
              <div className="relative h-[220px] rounded-[1.3rem] overflow-hidden mb-6">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
                <div className="absolute top-4 left-4 bg-[#0A051A]/70 backdrop-blur-md text-[9px] font-bold px-3 py-1.5 rounded-lg tracking-widest uppercase border border-white/10 text-slate-200">
                  {course.category}
                </div>
              </div>
              
              <div className="px-3 pb-2">
                <h3 className="text-xl font-bold mb-6 line-clamp-2 leading-snug group-hover:text-violet-300 transition-colors">{course.title}</h3>
                
                <div className="flex items-center justify-between mt-auto pb-6 border-b border-white/5 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?u=${course.id}`} alt="User" />
                    </div>
                    <span className="text-sm font-medium text-slate-300">{course.author}</span>
                  </div>
                  <span className="text-xs font-semibold text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full">{course.sessions}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-white">{course.price}</span>
                    <span className="text-sm text-slate-500 line-through font-medium">{course.oldPrice}</span>
                  </div>
                  <Link to={`/courses/${course.id}`} className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors inline-block cursor-pointer">
                    Join Course
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Link to="/courses" className="flex items-center space-x-3 px-8 py-3.5 rounded-full border border-white/20 hover:border-violet-400 hover:text-violet-300 transition-colors font-medium text-sm cursor-pointer">
            <span>Browse All Courses</span>
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS / STEPS */}
      <section className="py-32 border-t border-[#120B24] bg-[#0A051A] relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
           <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-white/10 bg-[#120B24] mb-8">
              <span className="text-[9px] font-semibold text-slate-300 tracking-wider uppercase">How It Work</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-28 tracking-tight">
            Easy <span className="text-violet-500">Courses</span> to Smarter Learning
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-px border-t-2 border-dashed border-[#2A1B4E] z-0" />
            
            {[
              { step: "01", icon: PenTool, title: "Sign Up for Free", desc: "Create your account in seconds no hidden fees or setup required." },
              { step: "02", icon: Layout, title: "Pick Your Course", desc: "Browse top-quality courses in various categories tailored to your goals." },
              { step: "03", icon: Play, title: "Learn at Your Own Pace", desc: "Access lessons anytime, anywhere. Enjoy flexible learning with videos, quizzes." },
              { step: "04", icon: Shield, title: "Earn Your Certificate", desc: "Complete the course and receive an official digital certificate to boost your resume." }
            ].map((item, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-[#0A051A] border-2 border-violet-600 rounded-full flex flex-col items-center justify-center text-violet-400 mb-8 shadow-[0_0_30px_rgba(124,58,237,0.15)] group hover:bg-violet-600 hover:text-white transition-colors duration-500">
                  <span className="text-sm font-bold opacity-50 mb-0.5">{item.step}</span>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed max-w-[220px]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-32 border-t border-white/5 bg-[#0C061E]">
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-20 gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-8">
              <span className="text-[9px] font-semibold text-slate-300 tracking-wider uppercase">Categories</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-[1.2] tracking-tight">
              Choose Your Favourite<br/> Course from Top <br/>
              <span className="text-violet-500">Categories</span>
            </h2>
          </div>
          <div className="max-w-md text-left md:text-right flex flex-col items-start md:items-end justify-end">
            <p className="text-slate-400 font-medium leading-relaxed mb-8 text-sm max-w-sm">
              Discover a variety of in-demand learning categories designed to elevate your skills and boost your career.
            </p>
            <button className="bg-violet-600 hover:bg-violet-500 px-7 py-3.5 rounded-full text-sm font-semibold transition-colors flex items-center space-x-2">
              <span>Browse All Categories</span>
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, i) => (
            <div key={i} className="bg-[#120B24] border border-[#2A1B4E] rounded-[2rem] p-10 relative overflow-hidden group hover:border-violet-500 transition-colors">
              <div className="absolute -bottom-8 -right-4 text-[150px] leading-none font-black text-white/[0.03] group-hover:text-violet-500/[0.05] pointer-events-none transition-colors duration-500">
                {cat.id}
              </div>
              <div className="w-14 h-14 rounded-2xl bg-[#080410] border border-[#2A1B4E] flex items-center justify-center mb-16 group-hover:border-violet-500/50 transition-colors">
                <cat.icon className="w-6 h-6 text-violet-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 relative z-10">{cat.title}</h3>
              <p className="text-slate-400 text-sm mb-10 relative z-10 leading-relaxed pr-6">{cat.desc}</p>
              
              <button className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-white transition-colors border border-white/10 px-5 py-2.5 rounded-full hover:border-white/30 relative z-10 w-fit">
                <span>Show More</span>
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* INSTRUCTOR HIGHLIGHTS */}
      <section className="bg-gradient-to-b from-[#0E0725] to-[#0A051A] border-y border-white/5 py-32 relative overflow-hidden">
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col md:flex-row justify-between mb-20 gap-8 items-end">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-6">
                <span className="text-[9px] font-semibold text-slate-300 tracking-wider uppercase">Expert Faculty</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Learn from Industry <span className="text-violet-500">Leaders</span></h2>
            </div>
            <button className="flex items-center space-x-3 px-8 py-3.5 rounded-full border border-white/20 hover:border-violet-400 hover:text-violet-300 transition-colors font-medium text-sm cursor-pointer whitespace-nowrap">
              <span>View All Instructors</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Sarah Mitchell", role: "Sr. UX Designer at Google", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
              { name: "David Kim", role: "Principal Engineer", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
              { name: "Elena Rodriguez", role: "CMO at TechCorp", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
              { name: "Marcus Johnson", role: "Data Science Lead", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
            ].map((instructor, i) => (
              <div key={i} className="group relative rounded-3xl overflow-hidden aspect-[3/4] bg-[#120B24] border border-white/10 hover:border-violet-500/50 transition-all duration-500">
                <img src={instructor.img} alt={instructor.name} className="w-full h-full object-cover grayscale-[30%] opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A051A] via-[#0A051A]/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-violet-300 transition-colors">{instructor.name}</h3>
                  <p className="text-sm text-violet-400 font-medium mb-4">{instructor.role}</p>
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                    <span className="text-xs text-slate-300 font-medium">4.9 Instructor Rating</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BIG TYPOGRAPHY STATEMENT */}
      <section className="py-40 bg-[#0A051A] flex items-center justify-center">
        <div className="max-w-6xl mx-auto px-6 text-center shrink">
          <h2 className="text-4xl md:text-6xl lg:text-[5rem] font-bold leading-[1.3] tracking-tighter">
            Choose What You Love. <br/>
            Learn How You Want. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-500">Master What You Need.</span> <br/>
            Makes It Possible.
          </h2>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="bg-[#0C061E] border-y border-white/5 py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-white/10 bg-[#120B24] mb-8">
             <span className="text-[9px] font-semibold text-slate-300 tracking-wider uppercase">Choose Package</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-24 tracking-tight leading-[1.2]">
            Boost Your Skills,<br/>Expand <span className="text-violet-500">Your Mind</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-5xl items-center">
            
            {/* STARTER */}
            <div className="bg-[#120B24] border border-[#2A1B4E] rounded-[2.5rem] p-10 relative overflow-hidden">
              <div className="absolute top-6 right-6 bg-violet-600/20 text-violet-300 text-[9px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">Save 15%</div>
              <h3 className="text-2xl font-bold tracking-wide text-white mb-2">STARTER</h3>
              <p className="text-sm text-slate-500 mb-10 pb-8 border-b border-white/5">Perfect for Casual Learners</p>
              
              <div className="flex items-end space-x-1 mb-8">
                <span className="text-5xl font-bold text-white">$29</span>
                <span className="text-sm text-slate-500 mb-1 font-medium">/Month</span>
              </div>
              
              <div className="space-y-5 mb-12">
                {['Access to selected beginner', 'Standard digital certificates', 'Community support', 'Up to 2 active courses', 'Custom Automations'].map((feature, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
              <button className="w-full py-4 rounded-full font-bold bg-[#1A0F35] text-violet-400 hover:bg-violet-600 hover:text-white border border-violet-500/20 transition-all">
                Choose Package
              </button>
            </div>

            {/* EXPERT (Middle Featured) */}
            <div className="bg-violet-600 rounded-[2.5rem] p-10 relative overflow-hidden lg:scale-110 shadow-2xl shadow-violet-600/30 z-10 border border-violet-400">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[40px] pointer-events-none" />
              <div className="absolute top-6 right-6 bg-[#080410]/50 backdrop-blur-md text-white text-[9px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">Save 45%</div>
              
              <h3 className="text-2xl font-bold tracking-wide text-white mb-2">EXPERT</h3>
              <p className="text-sm text-violet-200 mb-10 pb-8 border-b border-white/20">For Career-Driven Professionals</p>
              
              <div className="flex items-end space-x-1 mb-8">
                <span className="text-6xl font-bold text-white">$69</span>
                <span className="text-sm text-violet-200 mb-2 font-medium">/Month</span>
              </div>
              
              <div className="space-y-5 mb-12 relative z-10">
                {['Access to selected beginner', 'Standard digital certificates', 'Community support', 'Up to 5 active courses', 'Personalized learning paths', 'Access to exclusive webinars'].map((feature, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-white shrink-0 mt-0.5" />
                    <span className="text-sm text-white font-semibold">{feature}</span>
                  </div>
                ))}
              </div>
              <button className="w-full py-4 rounded-full font-bold bg-white text-violet-700 hover:bg-slate-100 transition-all relative z-10">
                Choose Package
              </button>
            </div>

            {/* PRO */}
            <div className="bg-[#120B24] border border-[#2A1B4E] rounded-[2.5rem] p-10 relative overflow-hidden">
              <div className="absolute top-6 right-6 bg-violet-600/20 text-violet-300 text-[9px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">Save 35%</div>
              <h3 className="text-2xl font-bold tracking-wide text-white mb-2">PRO</h3>
              <p className="text-sm text-slate-500 mb-10 pb-8 border-b border-white/5">For Consistent Learners</p>
              
              <div className="flex items-end space-x-1 mb-8">
                <span className="text-5xl font-bold text-white">$49</span>
                <span className="text-sm text-slate-500 mb-1 font-medium">/Month</span>
              </div>
              
              <div className="space-y-5 mb-12">
                {['Access to selected beginner', 'Standard digital certificates', 'Community support', 'Up to 3 active courses', 'Monthly progress reports', 'Voice Assistant Integration'].map((feature, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
              <button className="w-full py-4 rounded-full font-bold bg-[#1A0F35] text-violet-400 hover:bg-violet-600 hover:text-white border border-violet-500/20 transition-all">
                Choose Package
              </button>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
