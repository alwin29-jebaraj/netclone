import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import ProfileSelection from './components/ProfileSelection';
import BrowseDashboard from './components/BrowseDashboard';

export default function App() {
  const [user, setUser] = useState<any | null>(null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [currentProfile, setCurrentProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Recovery Session and Active Profile on Mount
  useEffect(() => {
    const recoverSession = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setProfiles(data.profiles || []);

          // Try recovering active profile from localStorage
          const savedProfileId = localStorage.getItem('netclone_profile_id');
          if (savedProfileId && data.profiles) {
            const matchedProfile = data.profiles.find((p: any) => p.id === savedProfileId);
            if (matchedProfile) {
              setCurrentProfile(matchedProfile);
            }
          }
        }
      } catch (err) {
        console.error('Error recovering session:', err);
      } finally {
        setLoading(false);
      }
    };
    recoverSession();
  }, []);

  const handleAuthSuccess = (authUser: any, userProfiles: any[]) => {
    setUser(authUser);
    setProfiles(userProfiles || []);
  };

  const handleSelectProfile = (profile: any) => {
    setCurrentProfile(profile);
    localStorage.setItem('netclone_profile_id', profile.id);
  };

  const handleProfileSelection = () => {
    setCurrentProfile(null);
    localStorage.removeItem('netclone_profile_id');
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Error logging out:', err);
    }
    setUser(null);
    setProfiles([]);
    setCurrentProfile(null);
    localStorage.removeItem('netclone_profile_id');
  };

  const handleProfilesUpdated = async () => {
    try {
      const response = await fetch('/api/profiles');
      if (response.ok) {
        const data = await response.json();
        setProfiles(data || []);
      }
    } catch (err) {
      console.error('Error updating profiles:', err);
    }
  };

  const handleUpdateProfileMyList = (updatedMyList: string[]) => {
    if (!currentProfile) return;
    
    // Update local states
    const nextProfile = { ...currentProfile, myList: updatedMyList };
    setCurrentProfile(nextProfile);
    
    setProfiles(prevProfiles => 
      prevProfiles.map(p => p.id === currentProfile.id ? nextProfile : p)
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center text-white select-none">
        {/* Loader spinner */}
        <span className="w-16 h-16 border-4 border-neutral-800 border-t-[#E50914] rounded-full animate-spin"></span>
        <h2 className="mt-6 text-xl font-bold font-display tracking-tight text-neutral-400">Loading NetClone...</h2>
      </div>
    );
  }

  // Routing Tree based on State
  if (!user) {
    return <LoginScreen onAuthSuccess={handleAuthSuccess} />;
  }

  if (!currentProfile) {
    return (
      <ProfileSelection
        profiles={profiles}
        onSelectProfile={handleSelectProfile}
        onProfilesUpdated={handleProfilesUpdated}
      />
    );
  }

  return (
    <BrowseDashboard
      currentProfile={currentProfile}
      profiles={profiles}
      onSelectProfile={handleSelectProfile}
      onLogout={handleLogout}
      onProfileSelection={handleProfileSelection}
      onUpdateProfileMyList={handleUpdateProfileMyList}
    />
  );
}
