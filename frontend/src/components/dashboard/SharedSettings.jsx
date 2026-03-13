import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function SharedSettings() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile({ name, avatar, bio });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="bg-[#120B24] p-8 rounded-[1.5rem] border border-[#2A1B4E] max-w-3xl">
      <h2 className="text-xl font-bold text-white mb-6 border-b border-white/5 pb-4">Profile Settings</h2>
      <form onSubmit={handleSave} className="space-y-6">
        <div className="flex items-center space-x-6">
          <img
            src={avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
            className="w-20 h-20 rounded-full border-2 border-violet-500 object-cover"
            alt="Profile"
          />
          <div className="flex-grow">
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Avatar URL</label>
            <input
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://your-image-url.com"
              className="w-full bg-[#0A051A] border border-[#2A1B4E] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-[#0A051A] border border-[#2A1B4E] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full bg-[#0A051A] border border-[#2A1B4E] rounded-xl px-4 py-3 text-sm text-slate-500 outline-none cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="Tell a little about yourself..."
            className="w-full bg-[#0A051A] border border-[#2A1B4E] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet-500/50 transition-colors resize-none"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-violet-600 hover:bg-violet-500 disabled:opacity-60 transition-colors text-white px-6 py-3 rounded-xl text-sm font-bold uppercase"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          {saved && <span className="text-emerald-400 text-sm font-semibold">Saved successfully!</span>}
        </div>
      </form>
    </div>
  );
}