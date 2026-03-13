import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Sparkles, Zap, Crown } from "lucide-react";

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "Basic",
      description: "Perfect for beginners starting their journey.",
      price: isAnnual ? "0" : "0",
      duration: "forever",
      icon: Zap,
      features: [
        { name: "Access to 10+ free courses", included: true },
        { name: "Basic community support", included: true },
        { name: "Course completion certificates", included: false },
        { name: "1-on-1 mentorship", included: false },
        { name: "Downloadable resources", included: false },
      ],
      cta: "Get Started Free",
      popular: false,
    },
    {
      name: "Pro",
      description: "Everything you need to accelerate your career.",
      price: isAnnual ? "29" : "39",
      duration: "per month",
      icon: Sparkles,
      features: [
        { name: "Access to all 500+ courses", included: true },
        { name: "Priority community support", included: true },
        { name: "Course completion certificates", included: true },
        { name: "Downloadable resources", included: true },
        { name: "1-on-1 mentorship", included: false },
      ],
      cta: "Start Pro Trial",
      popular: true,
    },
    {
      name: "Elite",
      description: "For serious professionals and teams.",
      price: isAnnual ? "79" : "99",
      duration: "per month",
      icon: Crown,
      features: [
        { name: "Access to all 500+ courses", included: true },
        { name: "Priority 24/7 support", included: true },
        { name: "Course completion certificates", included: true },
        { name: "Downloadable resources", included: true },
        { name: "Weekly 1-on-1 mentorship", included: true },
      ],
      cta: "Go Elite",
      popular: false,
    }
  ];

  return (
    <div className="bg-[#080410] min-h-screen text-slate-300 font-sans selection:bg-violet-600/30 pb-24 overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute top-0 center w-[800px] h-[400px] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none -translate-x-1/2 left-1/2" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-32 lg:pt-40 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/10 mb-6">
              <Sparkles className="h-4 w-4 text-violet-400" />
              <span className="text-[10px] font-bold text-violet-400 tracking-wider uppercase">Simple Pricing</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white">
              Invest in your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Future</span>
            </h1>
            <p className="text-lg text-slate-400">
              Choose the perfect plan for your learning journey. Upgrade, downgrade, or cancel anytime.
            </p>
          </motion.div>

          {/* Toggle */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center justify-center mt-10 space-x-4"
          >
            <span className={`text-sm font-semibold ${!isAnnual ? "text-white" : "text-slate-400"}`}>Monthly</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-16 h-8 rounded-full bg-[#120B24] border border-[#2A1B4E] transition-colors focus:outline-none"
            >
              <motion.div 
                animate={{ x: isAnnual ? 32 : 4 }} 
                className="absolute top-1 max-h-full w-6 h-6 bg-violet-500 rounded-full shadow-[0_0_10px_rgba(124,58,237,0.5)] flex items-center justify-center"
              />
            </button>
            <span className={`text-sm font-semibold flex items-center ${isAnnual ? "text-white" : "text-slate-400"}`}>
              Annually <span className="ml-2 px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[10px] uppercase tracking-wider">Save 20%</span>
            </span>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className={`relative bg-[#120B24]/80 backdrop-blur-sm border rounded-3xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                  plan.popular 
                    ? "border-violet-500 shadow-[0_0_30px_rgba(124,58,237,0.15)]" 
                    : "border-[#2A1B4E] hover:border-violet-500/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-[10px] font-bold uppercase tracking-widest py-1.5 px-4 rounded-full shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="mb-8">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                    plan.popular ? "bg-violet-500/20 text-violet-400" : "bg-white/5 text-slate-300"
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-sm text-slate-400 h-10">{plan.description}</p>
                </div>
                
                <div className="mb-8">
                  <div className="flex items-baseline text-white">
                    <span className="text-3xl font-bold">$</span>
                    <span className="text-5xl font-black tracking-tight">{plan.price}</span>
                  </div>
                  <div className="text-sm text-slate-400 mt-1 capitalize font-medium">{plan.duration}</div>
                </div>
                
                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start space-x-3 text-sm">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-violet-400 shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-slate-600 shrink-0" />
                      )}
                      <span className={feature.included ? "text-slate-300" : "text-slate-600"}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-300 ${
                  plan.popular
                    ? "bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)]"
                    : "bg-[#1A103C] hover:bg-[#2A1B4E] text-white border border-[#2A1B4E] hover:border-violet-500/50"
                }`}>
                  {plan.cta}
                </button>
              </motion.div>
            );
          })}
        </div>
        
        {/* FAQ Teaser */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-20 text-center"
        >
          <p className="text-slate-400">
            Have questions? Check out our <a href="#" className="text-violet-400 font-medium hover:text-violet-300 transition-colors underline underline-offset-4">FAQ</a> or contact support.
          </p>
        </motion.div>

      </div>
    </div>
  );
}