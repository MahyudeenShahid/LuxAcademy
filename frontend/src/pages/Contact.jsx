import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, ArrowRight } from "lucide-react";

export default function Contact() {
  return (
    <div className="bg-[#080410] min-h-screen text-slate-300 font-sans selection:bg-violet-600/30 pb-20 overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute top-[-5%] left-[-10%] w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-5%] w-[400px] h-[400px] bg-fuchsia-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-32 lg:pt-40 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-6">
              <span className="text-[10px] font-bold text-violet-400 tracking-wider uppercase">Support & Queries</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white">
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Touch</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 leading-relaxed">
              Whether you have a question about courses, pricing, or anything else, our team is ready to answer all your questions.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Contact Information */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="bg-[#120B24] border border-[#2A1B4E] rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-bl-full transition-transform duration-700 group-hover:scale-110 pointer-events-none" />
              <h3 className="text-2xl font-bold text-white mb-8">Contact Information</h3>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-5">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0 border border-violet-500/20">
                    <Mail className="h-5 w-5 text-violet-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Email Us</h4>
                    <p className="text-slate-400 hover:text-violet-400 transition-colors cursor-pointer">hello@luxacademy.com</p>
                    <p className="text-slate-400 hover:text-violet-400 transition-colors cursor-pointer">support@luxacademy.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-5">
                  <div className="w-12 h-12 rounded-xl bg-fuchsia-500/10 flex items-center justify-center shrink-0 border border-fuchsia-500/20">
                    <MapPin className="h-5 w-5 text-fuchsia-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Visit Us</h4>
                    <p className="text-slate-400">123 Innovation Drive<br />Tech District, San Francisco<br />CA 94105, USA</p>
                  </div>
                </div>

                <div className="flex items-start space-x-5">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                    <Phone className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Call Us</h4>
                    <p className="text-slate-400">+1 (555) 123-4567</p>
                    <p className="text-slate-500 text-sm mt-1">Mon-Fri from 8am to 5pm</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Social Proof snippet */}
            <div className="bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/20 rounded-3xl p-8">
              <h4 className="font-bold text-white mb-2">Join our Discord Community</h4>
              <p className="text-sm text-slate-400 mb-6">Connect with over 10,000+ students and instructors globally.</p>
              <button className="text-xs font-bold uppercase tracking-wider text-white bg-[#080410] border border-white/10 px-6 py-3 rounded-full hover:bg-violet-600 hover:border-violet-500 transition-all duration-300">
                Join Community
              </button>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-7"
          >
            <div className="bg-[#120B24]/50 backdrop-blur-md border border-[#2A1B4E] rounded-3xl p-8 lg:p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent pointer-events-none" />
              
              <h3 className="text-2xl font-bold text-white mb-8 relative z-10">Send us a message</h3>
              
              <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">First Name</label>
                    <input 
                      type="text" 
                      placeholder="Jane" 
                      className="w-full px-5 py-4 bg-[#080410] border border-[#2A1B4E] rounded-xl focus:border-violet-500 focus:shadow-[0_0_15px_rgba(124,58,237,0.15)] outline-none transition-all font-medium text-white placeholder:text-slate-600 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Last Name</label>
                    <input 
                      type="text" 
                      placeholder="Doe" 
                      className="w-full px-5 py-4 bg-[#080410] border border-[#2A1B4E] rounded-xl focus:border-violet-500 focus:shadow-[0_0_15px_rgba(124,58,237,0.15)] outline-none transition-all font-medium text-white placeholder:text-slate-600 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="jane@example.com" 
                    className="w-full px-5 py-4 bg-[#080410] border border-[#2A1B4E] rounded-xl focus:border-violet-500 focus:shadow-[0_0_15px_rgba(124,58,237,0.15)] outline-none transition-all font-medium text-white placeholder:text-slate-600 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Subject</label>
                  <input 
                    type="text" 
                    placeholder="How can we help?" 
                    className="w-full px-5 py-4 bg-[#080410] border border-[#2A1B4E] rounded-xl focus:border-violet-500 focus:shadow-[0_0_15px_rgba(124,58,237,0.15)] outline-none transition-all font-medium text-white placeholder:text-slate-600 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Message</label>
                  <textarea 
                    rows="5"
                    placeholder="Tell us more about your inquiry..." 
                    className="w-full px-5 py-4 bg-[#080410] border border-[#2A1B4E] rounded-xl focus:border-violet-500 focus:shadow-[0_0_15px_rgba(124,58,237,0.15)] outline-none transition-all font-medium text-white placeholder:text-slate-600 text-sm resize-none"
                  ></textarea>
                </div>

                <button className="w-full md:w-auto flex items-center justify-center space-x-2 bg-violet-600 hover:bg-violet-500 text-white px-8 py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] group">
                  <span>Send Message</span>
                  <Send className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}