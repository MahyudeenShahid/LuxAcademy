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
    </>
  );
}