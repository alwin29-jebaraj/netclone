import React, { useState, useEffect } from 'react';
import { Search, Bell, LogOut, Users, ChevronDown, User, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SmileyIconSmall = () => (
  <svg viewBox="0 0 100 100" className="w-6 h-6 text-white/90" fill="currentColor">
    <circle cx="30" cy="35" r="7" />
    <circle cx="70" cy="35" r="7" />
    <path d="M25 60 Q50 85 75 60" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none" />
  </svg>
);

export default function Header({
  currentProfile,
  profiles,
  onSelectProfile,
  onLogout,
  onProfileSelection,
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab
}: {
  currentProfile: any;
  profiles: any[];
  onSelectProfile: (profile: any) => void;
  onLogout: () => void;
  onProfileSelection: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 md:px-16 py-4 transition-all duration-300 select-none ${
        isScrolled ? 'bg-black bg-opacity-95 backdrop-blur-md shadow-2xl border-b border-neutral-900' : 'bg-transparent'
      }`}
    >
      {/* Left side */}
      <div className="flex items-center gap-8 md:gap-12">
        <h1 
          onClick={() => {
            setActiveTab('home');
            setSearchQuery('');
          }}
          className="text-2xl md:text-3xl font-black tracking-tighter text-[#E50914] cursor-pointer font-display transition-transform duration-150 active:scale-95"
        >
          NETCLONE
        </h1>

        <div className="hidden md:flex items-center gap-6 text-sm text-neutral-400">
          <button 
            onClick={() => { setActiveTab('home'); setSearchQuery(''); }}
            className={`hover:text-white transition-colors cursor-pointer ${activeTab === 'home' ? 'text-white font-bold' : ''}`}
          >
            Home
          </button>
          <button 
            onClick={() => { setActiveTab('mylist'); setSearchQuery(''); }}
            className={`hover:text-white transition-colors cursor-pointer flex items-center gap-1 ${activeTab === 'mylist' ? 'text-white font-bold' : ''}`}
          >
            My List
          </button>
          <button 
            onClick={() => { setActiveTab('scifi'); setSearchQuery(''); }}
            className={`hover:text-white transition-colors cursor-pointer ${activeTab === 'scifi' ? 'text-white font-bold' : ''}`}
          >
            Sci-Fi & Fantasy
          </button>
          <button 
            onClick={() => { setActiveTab('comedies'); setSearchQuery(''); }}
            className={`hover:text-white transition-colors cursor-pointer ${activeTab === 'comedies' ? 'text-white font-bold' : ''}`}
          >
            Comedies
          </button>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 md:gap-6 text-sm">
        {/* Search Input bar */}
        <div className="flex items-center gap-2 relative">
          <motion.div
            animate={{ width: isSearchOpen || searchQuery ? '200px' : '36px' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex items-center bg-[#1a1a1a] border border-neutral-800 rounded-full py-1.5 px-3 overflow-hidden"
          >
            <Search 
              className="w-4 h-4 text-neutral-400 cursor-pointer shrink-0 hover:text-white transition-colors" 
              onClick={() => setIsSearchOpen(!isSearchOpen)} 
            />
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ml-2 w-full bg-transparent border-none outline-none text-xs text-white placeholder-neutral-500"
            />
          </motion.div>
        </div>

        {/* Kids Safe Indicator */}
        {!currentProfile.isKids && (
          <button
            onClick={() => {
              if (activeTab === 'kids') {
                setActiveTab('home');
              } else {
                setActiveTab('kids');
              }
              setSearchQuery('');
            }}
            className={`hidden sm:block text-[11px] uppercase font-bold tracking-widest px-3 py-1.5 rounded transition-colors cursor-pointer ${
              activeTab === 'kids' 
                ? 'bg-red-600 text-white' 
                : 'border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600'
            }`}
          >
            Kids Mode
          </button>
        )}

        {/* Notifications Mock Icon */}
        <div className="relative group cursor-pointer text-neutral-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full"></span>
        </div>

        {/* User Profile dropdown */}
        <div className="relative">
          <div 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1.5 cursor-pointer group"
          >
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
              style={{ backgroundColor: currentProfile.avatarColor }}
            >
              <SmileyIconSmall />
            </div>
            <ChevronDown className={`w-4 h-4 text-neutral-400 group-hover:text-neutral-200 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
          </div>

          <AnimatePresence>
            {showDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}></div>
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-56 bg-[#0c0c0c] border border-neutral-800 rounded-lg shadow-2xl py-3 z-50 text-xs flex flex-col overflow-hidden"
                >
                  <div className="px-4 py-2 border-b border-neutral-900">
                    <p className="text-neutral-500 font-medium">Signed in as</p>
                    <p className="text-neutral-200 font-bold truncate mt-0.5">{currentProfile.name}</p>
                    {currentProfile.isKids && (
                      <span className="inline-block bg-red-600/10 border border-red-600/30 text-red-500 text-[9px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded mt-1.5">
                        Kids Profile
                      </span>
                    )}
                  </div>

                  {/* Other Profiles list */}
                  <div className="py-2 border-b border-neutral-900 max-h-40 overflow-y-auto no-scrollbar">
                    {profiles
                      .filter(p => p.id !== currentProfile.id)
                      .map(p => (
                        <button
                          key={p.id}
                          onClick={() => {
                            onSelectProfile(p);
                            setShowDropdown(false);
                            setActiveTab('home');
                            setSearchQuery('');
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#161616] transition-colors cursor-pointer text-left text-neutral-400 hover:text-white"
                        >
                          <div 
                            className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                            style={{ backgroundColor: p.avatarColor }}
                          >
                            <SmileyIconSmall />
                          </div>
                          <span className="font-medium truncate">{p.name}</span>
                        </button>
                      ))
                    }
                  </div>

                  {/* Management and log out */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        onProfileSelection();
                        setShowDropdown(false);
                      }}
                      className="w-full px-4 py-2.5 hover:bg-[#161616] transition-colors cursor-pointer text-left text-neutral-400 hover:text-white flex items-center gap-2.5"
                    >
                      <Users className="w-4 h-4 text-neutral-500" />
                      <span>Switch Profiles</span>
                    </button>
                    <button
                      onClick={onLogout}
                      className="w-full px-4 py-2.5 hover:bg-[#161616] transition-colors cursor-pointer text-left text-red-500 font-semibold flex items-center gap-2.5"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign out of NetClone</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
