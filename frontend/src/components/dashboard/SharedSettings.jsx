export default function SharedSettings() {
  return (
    <div className="bg-[#120B24] p-8 rounded-[1.5rem] border border-[#2A1B4E] max-w-3xl">
      <h2 className="text-xl font-bold text-white mb-6 border-b border-white/5 pb-4">Profile Settings</h2>
      <div className="space-y-6">
        <div className="flex items-center space-x-6">
          <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=150" className="w-20 h-20 rounded-full border-2 border-violet-500 object-cover" alt="Profile" />
          <button className="bg-white/5 hover:bg-white/10 transition-colors text-white px-4 py-2 rounded-lg text-sm font-semibold">Change Avatar</button>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Full Name</label>
            <input type="text" defaultValue="Alex Carter" className="w-full bg-[#0A051A] border border-[#2A1B4E] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet-500/50 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Email</label>
            <input type="email" defaultValue="alex@example.com" className="w-full bg-[#0A051A] border border-[#2A1B4E] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet-500/50 transition-colors" />
          </div>
        </div>
        <button className="bg-violet-600 hover:bg-violet-500 transition-colors text-white px-6 py-3 rounded-xl text-sm font-bold uppercase mt-4">Save Changes</button>
      </div>
    </div>
  );
}