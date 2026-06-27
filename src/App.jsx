import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import ProfileSelection from './components/ProfileSelection';
import BrowseDashboard from './components/BrowseDashboard';
import { apiFetch } from './apiInterceptor';

export default function App() {
  const [user, setUser] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Recovery Session and Active Profile on Mount
  useEffect(() => {
    const recoverSession = async () => {
      try {
        const response = await apiFetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setProfiles(data.profiles || []);

          // Try recovering active profile from localStorage
          const savedProfileId = localStorage.getItem('netclone_profile_id');
          if (savedProfileId && data.profiles) {
            const matchedProfile = data.profiles.find((p) => p.id === savedProfileId);
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

  const handleAuthSuccess = (authUser, userProfiles) => {
    setUser(authUser);
    setProfiles(userProfiles || []);
  };

  const handleSelectProfile = (profile) => {
    setCurrentProfile(profile);
    localStorage.setItem('netclone_profile_id', profile.id);
  };

  const handleProfileSelection = () => {
    setCurrentProfile(null);
    localStorage.removeItem('netclone_profile_id');
  };

  const handleLogout = async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
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
      const response = await apiFetch('/api/profiles');
      if (response.ok) {
        const data = await response.json();
        setProfiles(data || []);
      }
    } catch (err) {
      console.error('Error updating profiles:', err);
    }
  };

  const handleUpdateProfileMyList = (updatedMyList) => {
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
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white select-none relative">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-t from-black via-transparent to-black"></div>
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-700 via-transparent to-black"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <span className="w-12 h-12 border-2 border-neutral-800 border-t-red-600 rounded-full animate-spin"></span>
          <h2 className="mt-6 text-lg font-bold font-display tracking-tight text-neutral-400 uppercase">Loading NetClone...</h2>
        </div>
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
