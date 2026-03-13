import { Sparkles, Users, Award, Shield, Target, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="bg-[#080410] min-h-screen text-white font-sans overflow-hidden">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden border-b border-[#2A1B4E]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-violet-500/30 bg-[#120B24] mb-8"
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-bold text-violet-300 tracking-wider uppercase">Our Mission</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-8 tracking-tight"
          >
            Redefining <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500">Education</span> for<br className="hidden md:block" /> the Digital Age
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed"
          >
            LuxAcademy is a premium multi-instructor learning platform designed to bridge the gap between traditional education and industry demands.
          </motion.p>
        </div>
      </div>

      {/* Stats/Values Section */}
      <div className="py-20 lg:py-32 relative z-10 bg-[#0A051A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "250K+", subtitle: "Active Learners", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
              { title: "1.2K+", subtitle: "Expert Instructors", icon: Award, color: "text-violet-400", bg: "bg-violet-500/10" },
              { title: "8.5K+", subtitle: "Premium Courses", icon: Target, color: "text-fuchsia-400", bg: "bg-fuchsia-500/10" },
              { title: "99.9%", subtitle: "Satisfaction Rate", icon: Shield, color: "text-emerald-400", bg: "bg-emerald-500/10" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#120B24] border border-[#2A1B4E] rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group"
              >
                <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center mb-6`}>
                  <stat.icon className={`h-7 w-7 ${stat.color}`} />
                </div>
                <h3 className="text-4xl font-bold text-white mb-2">{stat.title}</h3>
                <p className="text-slate-400 font-medium">{stat.subtitle}</p>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-violet-500/10 transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-24 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-[#2A1B4E]"
            >
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Team working" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080410] via-transparent to-transparent" />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-3xl lg:text-5xl font-bold text-white leading-tight">
                Built by creators, <br/>
                <span className="text-violet-500">for creators.</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Founded in 2024, LuxAcademy started with a simple belief: high-quality education shouldn't be locked behind prestige university gates. We partnered with industry leaders to bring their practical, battlefield-tested knowledge directly to you.
              </p>
              <p className="text-slate-400 text-lg leading-relaxed">
                Today, we host thousands of courses taught by professionals actively working at the world's most innovative companies.
              </p>
              
              <Link to="/courses" className="inline-flex items-center space-x-2 bg-white text-black px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-violet-500 hover:text-white transition-all group">
                <span>Start Learning</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}