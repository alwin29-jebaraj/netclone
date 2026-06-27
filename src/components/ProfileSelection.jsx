import React, { useState } from 'react';
import { Plus, Trash2, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { apiFetch } from '../apiInterceptor';

const SmileyIcon = () => (
  <svg viewBox="0 0 100 100" className="w-16 h-16 text-white/95" fill="currentColor">
    <circle cx="30" cy="35" r="7" />
    <circle cx="70" cy="35" r="7" />
    <path d="M25 60 Q50 85 75 60" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none" />
  </svg>
);

const PRESET_COLORS = ['#E50914', '#1f80e0', '#32cd32', '#f5b800', '#7a28cb'];

export default function ProfileSelection({
  profiles,
  onSelectProfile,
  onProfilesUpdated
}) {
  const [isManageMode, setIsManageMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileIsKids, setNewProfileIsKids] = useState(false);
  const [newProfileColor, setNewProfileColor] = useState('#E50914');
  const [isDeletingId, setIsDeletingId] = useState(null);
  const [modalError, setModalError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddProfile = async (e) => {
    e.preventDefault();
    setModalError('');
    if (!newProfileName.trim()) {
      setModalError('Profile name is required');
      return;
    }

    setLoading(true);
    try {
      const response = await apiFetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProfileName,
          isKids: newProfileIsKids,
          avatarColor: newProfileColor
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create profile');
      }

      await onProfilesUpdated();
      setShowAddModal(false);
      setNewProfileName('');
      setNewProfileIsKids(false);
      setNewProfileColor('#E50914');
    } catch (err) {
      setModalError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this profile? All history and lists will be permanently lost.')) {
      return;
    }

    setIsDeletingId(id);
    try {
      const response = await apiFetch(`/api/profiles/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete profile');
      }
      await onProfilesUpdated();
    } catch (err) {
      alert('Error deleting profile');
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4 py-12 select-none relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-t from-black via-transparent to-black"></div>
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-700 via-transparent to-black"></div>
      </div>

      <div className="relative z-10 max-w-4xl text-center space-y-10">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-100 font-display"
        >
          {isManageMode ? 'Manage Profiles:' : "Who's watching?"}
        </motion.h1>

        {/* Profiles Row */}
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
          <AnimatePresence mode="popLayout">
            {profiles.map((profile) => (
              <motion.div
                key={profile.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => {
                  if (!isManageMode) {
                    onSelectProfile(profile);
                  }
                }}
                className={`group flex flex-col items-center cursor-pointer relative ${
                  isDeletingId === profile.id ? 'opacity-40 pointer-events-none' : ''
                }`}
              >
                {/* Avatar Box */}
                <div 
                  className="w-24 h-24 md:w-32 md:h-32 rounded-lg flex items-center justify-center relative transition-all duration-200 border-2 border-transparent group-hover:border-neutral-100 shadow-lg overflow-hidden"
                  style={{ backgroundColor: profile.avatarColor }}
                >
                  <SmileyIcon />

                  {/* Kids Badge */}
                  {profile.isKids && (
                    <div className="absolute bottom-1.5 right-1.5 bg-red-600 text-[9px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded text-white">
                      Kids
                    </div>
                  )}

                  {/* Manage Overlay */}
                  {isManageMode && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-xs transition-opacity">
                      <button
                        onClick={(e) => handleDeleteProfile(profile.id, e)}
                        className="p-2.5 bg-neutral-900/90 rounded-full text-neutral-300 hover:text-red-500 hover:scale-115 transition-all shadow-md cursor-pointer"
                        title="Delete Profile"
                      >
                        <Trash2 className="w-5 h-5 md:w-6 md:h-6" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Name Label */}
                <span className="mt-4 text-neutral-400 group-hover:text-neutral-100 text-sm md:text-lg font-medium tracking-wide transition-colors">
                  {profile.name}
                </span>
              </motion.div>
            ))}

            {/* Add Profile Block (Only if profiles count is less than 5) */}
            {profiles.length < 5 && (
              <motion.div
                layout
                onClick={() => setShowAddModal(true)}
                className="group flex flex-col items-center cursor-pointer"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg border-2 border-dashed border-neutral-700 group-hover:border-neutral-500 flex items-center justify-center transition-all bg-transparent hover:bg-neutral-900/40">
                  <Plus className="w-10 h-10 text-neutral-600 group-hover:text-neutral-400 transition-all group-hover:scale-110" />
                </div>
                <span className="mt-4 text-neutral-500 group-hover:text-neutral-300 text-sm md:text-lg font-medium tracking-wide transition-colors">
                  Add Profile
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Manage Profiles Toggle Button */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="pt-8"
        >
          <button
            onClick={() => setIsManageMode(!isManageMode)}
            className="border border-neutral-700 text-neutral-400 hover:border-neutral-200 hover:text-neutral-100 px-6 py-2.5 tracking-widest uppercase text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer active:scale-95 rounded"
          >
            {isManageMode ? 'Done' : 'Manage Profiles'}
          </button>
        </motion.div>
      </div>

      {/* Add Profile Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-black p-6 md:p-10 rounded-lg max-w-[500px] w-full border border-neutral-800 shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white font-display">Create Profile</h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {modalError && (
                <div className="bg-[#e87c03] text-white text-xs p-3 rounded flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0 rotate-180" />
                  <span>{modalError}</span>
                </div>
              )}

              <form onSubmit={handleAddProfile} className="space-y-6">
                {/* Profile Name */}
                <div className="space-y-2">
                  <label htmlFor="pname" className="text-xs text-neutral-400 uppercase tracking-widest font-semibold">Profile Name</label>
                  <input
                    type="text"
                    id="pname"
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    placeholder="Enter name"
                    className="w-full bg-[#2a2a2a] text-white px-4 py-3 rounded outline-none border-none focus:ring-2 focus:ring-neutral-500 transition-all text-[15px]"
                    maxLength={15}
                    required
                  />
                </div>

                {/* Kids option */}
                <div className="flex items-center gap-3 bg-[#161616] p-4 rounded border border-neutral-900">
                  <input
                    type="checkbox"
                    id="pkids"
                    checked={newProfileIsKids}
                    onChange={(e) => setNewProfileIsKids(e.target.checked)}
                    className="rounded bg-neutral-700 border-none text-[#E50914] focus:ring-0 w-5 h-5 cursor-pointer"
                  />
                  <div>
                    <label htmlFor="pkids" className="font-semibold text-sm cursor-pointer select-none text-neutral-200">Kids Profile?</label>
                    <p className="text-xs text-neutral-400">Only show curated family and child-friendly content.</p>
                  </div>
                </div>

                {/* Avatar Color Selector */}
                <div className="space-y-3">
                  <label className="text-xs text-neutral-400 uppercase tracking-widest font-semibold">Choose Avatar Theme</label>
                  <div className="flex gap-4">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewProfileColor(color)}
                        className={`w-10 h-10 rounded-md transition-all flex items-center justify-center relative cursor-pointer hover:scale-105 ${
                          newProfileColor === color ? 'ring-2 ring-white scale-110 shadow-lg' : ''
                        }`}
                        style={{ backgroundColor: color }}
                      >
                        {newProfileColor === color && (
                          <Check className="w-5 h-5 text-white stroke-[3px]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      'Save'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-3 rounded transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
