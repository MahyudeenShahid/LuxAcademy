import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BookOpen, Award, Clock, Activity } from "lucide-react";
import SharedSettings from "./SharedSettings";

const activityData = [
  { name: "Mon", value: 2 },
  { name: "Tue", value: 3.5 },
  { name: "Wed", value: 1.5 },
  { name: "Thu", value: 4 },
  { name: "Fri", value: 2.5 },
  { name: "Sat", value: 0 },
  { name: "Sun", value: 5 },
];

export default function StudentDashboard({ activeTab }) {
  if (activeTab === "settings") {
    return <SharedSettings />;
  }

  return (
    <>
      {activeTab === "overview" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { label: "Active Courses", value: "3", icon: BookOpen, trend: "View details", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
              { label: "Hours Learned", value: "32.5", icon: Clock, trend: "+4.5 this week", color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
              { label: "Certificates", value: "4", icon: Award, trend: "Unlock more", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
              { label: "Completion Average", value: "85%", icon: Activity, trend: "+2% this week", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
            ].map((stat, i) => (
              <div key={i} className={`bg-[#120B24] p-6 rounded-[1.5rem] shadow-xl border ${stat.border}`}>
                <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${stat.bg} border ${stat.border}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <h3 className="text-3xl font-bold text-white tracking-tight">{stat.value}</h3>
                <p className="text-slate-400 font-medium text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[#120B24] p-8 rounded-[1.5rem] shadow-xl shadow-black/50 border border-[#2A1B4E]">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-white">Learning Activity Tracker</h2>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2A1B4E" fillOpacity={0.5} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} />
                    <Tooltip contentStyle={{ backgroundColor: '#120B24', borderRadius: '12px', border: '1px solid #2A1B4E' }} />
                    <Area type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#120B24] p-8 rounded-[1.5rem] shadow-xl border border-[#2A1B4E] flex flex-col">
              <h2 className="text-xl font-bold text-white mb-6">Continue Learning</h2>
              <div className="space-y-6 flex-grow flex flex-col">
                <div className="rounded-xl overflow-hidden relative h-40 border border-[#2A1B4E]">
                  <img src="https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover" alt="Course" />
                </div>
                <div className="mt-auto">
                  <h3 className="font-bold text-white mb-2">UX Design Fundamentals</h3>
                  <div className="w-full bg-[#080410] overflow-hidden rounded-full h-2.5 border border-[#2A1B4E] mb-2">
                    <div className="bg-gradient-to-r from-violet-600 to-fuchsia-500 h-full rounded-full relative" style={{ width: '68%' }} />
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-violet-400">68% Completed</span>
                    <span className="text-slate-500">2h 15m left</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "courses" && (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-[#120B24] p-6 rounded-2xl border border-[#2A1B4E] flex flex-col md:flex-row gap-6 hover:border-violet-500/30 transition-colors">
              <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden shrink-0">
                <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover" alt="Course" />
              </div>
              <div className="flex-grow flex flex-col justify-center">
                <h3 className="text-xl font-bold text-white mb-1">Advanced React Patterns {item}</h3>
                <p className="text-sm text-slate-400 mb-4">Instructor: Sarah Jenkins</p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="flex-grow bg-[#080410] rounded-full h-2 border border-[#2A1B4E]">
                    <div className="bg-violet-600 h-full rounded-full" style={{ width: `${Math.random() * 60 + 20}%` }} />
                  </div>
                  <button className="bg-violet-600 hover:bg-violet-500 text-white text-xs px-4 py-2 rounded-lg font-bold">Continue</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}