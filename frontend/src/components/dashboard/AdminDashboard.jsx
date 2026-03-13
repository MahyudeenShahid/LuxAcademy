import SharedSettings from "./SharedSettings";

export default function AdminDashboard({ activeTab }) {
  if (activeTab === "settings") {
    return <SharedSettings />;
  }

  return (
    <>
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[#120B24] p-6 rounded-2xl border border-[#2A1B4E]">
            <h3 className="text-slate-400 text-xs font-bold uppercase mb-2">Total Users</h3>
            <p className="text-3xl font-black text-white">45,210</p>
          </div>
          <div className="bg-[#120B24] p-6 rounded-2xl border border-[#2A1B4E]">
            <h3 className="text-slate-400 text-xs font-bold uppercase mb-2">Instructors</h3>
            <p className="text-3xl font-black text-white">342</p>
          </div>
          <div className="bg-[#120B24] p-6 rounded-2xl border border-[#2A1B4E]">
            <h3 className="text-slate-400 text-xs font-bold uppercase mb-2">Courses</h3>
            <p className="text-3xl font-black text-white">1,250</p>
          </div>
          <div className="bg-[#120B24] p-6 rounded-2xl border border-[#2A1B4E]">
            <h3 className="text-slate-400 text-xs font-bold uppercase mb-2">System Status</h3>
            <p className="text-3xl font-black text-emerald-400">99.9%</p>
          </div>
        </div>
      )}

      {activeTab === "manage_users" && (
        <div className="bg-[#120B24] rounded-2xl border border-[#2A1B4E] overflow-hidden">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#0A051A] text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A1B4E]">
              {["John Doe", "Sarah Smith"].map((user, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">{user}</td>
                  <td className="px-6 py-4 text-slate-400">{idx === 0 ? 'Student' : 'Instructor'}</td>
                  <td className="px-6 py-4 text-right text-red-400 font-medium cursor-pointer hover:text-red-300">Ban User</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "manage_all_courses" && (
        <div className="bg-[#120B24] rounded-2xl border border-[#2A1B4E] overflow-hidden">
            <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#0A051A] text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Course</th>
                <th className="px-6 py-4 font-semibold">Instructor</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A1B4E]">
              {["UI/UX Masterclass", "Backend Engineering"].map((course, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">{course}</td>
                  <td className="px-6 py-4 text-slate-400">Jane Doe</td>
                  <td className="px-6 py-4 text-right text-red-400 font-medium cursor-pointer hover:text-red-300">Delete</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "platform_analytics" && (
        <div className="space-y-6">
          <div className="bg-[#120B24] p-6 rounded-2xl border border-[#2A1B4E]">
            <h2 className="text-xl font-bold text-white mb-6">Revenue Overview</h2>
            <div className="flex h-64 items-end gap-2 text-xs text-slate-400 mt-4 relative">
              {/* Dummy Chart Bar */}
              {[40, 70, 45, 90, 65, 100, 80].map((h, i) => (
                <div key={i} className="flex-1 bg-violet-600/20 hover:bg-violet-600/40 border border-violet-500/30 rounded-t-xl transition-all group relative cursor-pointer" style={{ height: `${h}%` }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black px-2 py-1 rounded font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    ${h}k
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 p-6 rounded-2xl border border-blue-500/20">
              <h3 className="text-white font-bold mb-2">Most Popular Category</h3>
              <p className="text-3xl font-black text-blue-400 mb-1">Web Development</p>
              <p className="text-slate-400 text-sm">Makes up 45% of total platform sales</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 p-6 rounded-2xl border border-emerald-500/20">
              <h3 className="text-white font-bold mb-2">Completion Rate</h3>
              <p className="text-3xl font-black text-emerald-400 mb-1">68.2%</p>
              <p className="text-slate-400 text-sm">Average across all active courses</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "reports" && (
        <div className="bg-[#120B24] rounded-2xl border border-[#2A1B4E] p-6">
          <h2 className="text-xl font-bold text-white mb-6">System Reports</h2>
          <div className="space-y-4">
            {[
              { title: "Monthly Financial Summary", date: "Oct 1, 2023", type: "PDF" },
              { title: "User Growth Metrics", date: "Sep 28, 2023", type: "CSV" },
              { title: "Instructor Payouts", date: "Sep 25, 2023", type: "XLSX" }
            ].map((report, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-[#2A1B4E] bg-[#0A051A]/50 hover:bg-[#1A103D] transition-colors group cursor-pointer">
                <div>
                  <h4 className="text-white font-bold group-hover:text-violet-400 transition-colors">{report.title}</h4>
                  <p className="text-sm text-slate-500 mt-1">Generated: {report.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-black px-2 py-1 rounded bg-slate-800 text-slate-300">{report.type}</span>
                  <button className="text-sm font-semibold text-violet-400 bg-violet-400/10 px-4 py-2 rounded-lg hover:bg-violet-400 hover:text-white transition-all">Download</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}