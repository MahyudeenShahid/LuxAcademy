import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Video, Plus } from "lucide-react";
import SharedSettings from "./SharedSettings";

const revenueData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 550 },
  { name: "Apr", value: 450 },
  { name: "May", value: 700 },
  { name: "Jun", value: 800 },
];

export default function InstructorDashboard({ activeTab, setActiveTab }) {
  if (activeTab === "settings") {
    return <SharedSettings />;
  }

  return (
    <>
      {activeTab === "overview" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#120B24] p-6 rounded-2xl border border-[#2A1B4E]">
              <h3 className="text-slate-400 text-xs font-bold uppercase mb-2">Total Students</h3>
              <p className="text-3xl font-black text-white">4,289</p>
            </div>
            <div className="bg-[#120B24] p-6 rounded-2xl border border-violet-500/30">
              <h3 className="text-slate-400 text-xs font-bold uppercase mb-2">Active Courses</h3>
              <p className="text-3xl font-black text-white">8</p>
            </div>
            <div className="bg-[#120B24] p-6 rounded-2xl border border-[#2A1B4E]">
              <h3 className="text-slate-400 text-xs font-bold uppercase mb-2">Avg Rating</h3>
              <p className="text-3xl font-black text-amber-400">4.9/5</p>
            </div>
            <div className="bg-[#120B24] p-6 rounded-2xl border border-fuchsia-500/30">
              <h3 className="text-slate-400 text-xs font-bold uppercase mb-2">Revenue</h3>
              <p className="text-3xl font-black text-emerald-400">$12,450</p>
            </div>
          </div>

          <div className="bg-[#120B24] p-8 rounded-2xl border border-[#2A1B4E]">
            <h2 className="text-xl font-bold text-white mb-6">Course Analytics</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2A1B4E" fillOpacity={0.5} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                  <Tooltip contentStyle={{ backgroundColor: '#120B24', border: '1px solid #2A1B4E', borderRadius: '12px' }} />
                  <Bar dataKey="value" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === "manage_courses" && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button onClick={() => setActiveTab('create_course')} className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-2.5 flex items-center gap-2 rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)]">
              <Plus className="w-4 h-4" /> New Course
            </button>
          </div>
          <div className="bg-[#120B24] rounded-2xl border border-[#2A1B4E] overflow-hidden">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#0A051A] text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Course Title</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Students</th>
                  <th className="px-6 py-4 font-semibold">Rating</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A1B4E]">
                {["Full-Stack React", "Advanced System Design"].map((course, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">{course}</td>
                    <td className="px-6 py-4"><span className="text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded">Published</span></td>
                    <td className="px-6 py-4 text-slate-300">1,20{idx}</td>
                    <td className="px-6 py-4 text-amber-400">4.8</td>
                    <td className="px-6 py-4 text-right text-violet-400 font-medium cursor-pointer">Edit</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "create_course" && (
        <div className="bg-[#120B24] p-8 rounded-2xl border border-[#2A1B4E]">
          <h2 className="text-xl font-bold text-white mb-6">Create New Course</h2>
          <div className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Title</label>
              <input type="text" className="w-full bg-[#0A051A] border border-[#2A1B4E] rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Upload Lessons</label>
              <div className="border-2 border-dashed border-[#2A1B4E] hover:border-violet-500/50 transition-colors rounded-2xl p-10 flex flex-col items-center cursor-pointer">
                <Video className="w-8 h-8 text-slate-500 mb-2" />
                <p className="text-sm font-bold text-slate-300">Drag & drop your videos</p>
              </div>
            </div>
            <button className="bg-violet-600 hover:bg-violet-500 transition-colors text-white px-6 py-3 rounded-xl font-bold uppercase mt-4">Save Course</button>
          </div>
        </div>
      )}
    </>
  );
}