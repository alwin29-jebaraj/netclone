import React, { useState, useEffect } from 'react';
import { Play, Info, Heart, List, HelpCircle, Film, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './Header';
import MovieRow from './MovieRow';
import MovieDetailModal from './MovieDetailModal';
import MoviePlayer from './MoviePlayer';
import { apiFetch } from '../apiInterceptor';

export default function BrowseDashboard({
  currentProfile,
  profiles,
  onSelectProfile,
  onLogout,
  onProfileSelection,
  onUpdateProfileMyList
}) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('home'); // home, mylist, scifi, comedies, kids
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [activePlayerMovie, setActivePlayerMovie] = useState(null);

  // Fetch Movie catalog
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await apiFetch('/api/movies');
        const data = await response.json();
        setMovies(data);
      } catch (err) {
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // Sync profile My List changes
  const handleMyListToggle = async (movieId, isInList) => {
    const endpoint = `/api/profiles/${currentProfile.id}/mylist${isInList ? `/${movieId}` : ''}`;
    const method = isInList ? 'DELETE' : 'POST';

    try {
      const response = await apiFetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: isInList ? undefined : JSON.stringify({ movieId })
      });

      const updatedProfile = await response.json();
      if (response.ok && updatedProfile.myList) {
        onUpdateProfileMyList(updatedProfile.myList);
      }
    } catch (err) {
      console.error('Error updating My List:', err);
    }
  };

  // Filtration logic based on currentProfile restrictions and active sections
  const isProfileKids = currentProfile.isKids || activeTab === 'kids';

  // Kids profile filter: restrict TV-MA and R rated content
  const allowedMovies = movies.filter((m) => {
    if (isProfileKids) {
      return m.rating !== 'R' && m.rating !== 'TV-MA';
    }
    return true;
  });

  // Category filtration
  const filteredMovies = allowedMovies.filter((m) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        m.title.toLowerCase().includes(query) ||
        m.synopsis.toLowerCase().includes(query) ||
        m.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    if (activeTab === 'mylist') {
      return currentProfile.myList.includes(m.id);
    }
    if (activeTab === 'scifi') {
      return m.category === 'Sci-Fi & Fantasy';
    }
    if (activeTab === 'comedies') {
      return m.category === 'Comedies';
    }
    return true; // Home or Kids lists
  });

  // Hero movie selections
  const heroMovie = allowedMovies.find(m => m.id === 'stranger-sagas') || allowedMovies[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white select-none relative">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-t from-black via-transparent to-black"></div>
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-700 via-transparent to-black"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <span className="w-12 h-12 border-2 border-neutral-800 border-t-red-600 rounded-full animate-spin"></span>
          <h2 className="mt-6 text-lg font-bold font-display tracking-tight text-neutral-400 uppercase">Loading catalog...</h2>
        </div>
      </div>
    );
  }

  // Categories map for Home tab
  const homeRows = [
    { title: 'Trending Now', list: allowedMovies.filter(m => m.category === 'Trending Now') },
    { title: 'Action & Thrillers', list: allowedMovies.filter(m => m.category === 'Action & Thrillers') },
    { title: 'Sci-Fi & Fantasy', list: allowedMovies.filter(m => m.category === 'Sci-Fi & Fantasy') },
    { title: 'Comedies', list: allowedMovies.filter(m => m.category === 'Comedies') }
  ];

  const myListMovies = allowedMovies.filter(m => currentProfile.myList.includes(m.id));

  return (
    <div className="min-h-screen bg-black text-white select-none relative pb-20 overflow-x-hidden">
      {/* Navigation Header */}
      <Header
        currentProfile={currentProfile}
        profiles={profiles}
        onSelectProfile={onSelectProfile}
        onLogout={onLogout}
        onProfileSelection={onProfileSelection}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Grid search view or Category Tab view */}
      {searchQuery ? (
        <div className="pt-28 px-4 md:px-16 space-y-6">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-400 font-display">
            Search results for: <span className="text-white">"{searchQuery}"</span>
          </h2>
          {filteredMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredMovies.map((movie) => {
                return (
                  <motion.div
                    key={movie.id}
                    whileHover={{ scale: 1.03, y: -2 }}
                    onClick={() => setSelectedMovie(movie)}
                    className="relative bg-[#0c0c0c] rounded-lg overflow-hidden aspect-video shadow-xl group border border-neutral-900 cursor-pointer"
                  >
                    <img
                      src={movie.backdrop}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                      <h3 className="text-white font-bold text-xs md:text-sm truncate font-display tracking-tight">{movie.title}</h3>
                      <p className="text-[10px] text-emerald-500 font-bold mt-0.5">98% Match</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="py-24 text-center max-w-md mx-auto space-y-4">
              <Film className="w-16 h-16 mx-auto text-neutral-600 stroke-[1.5]" />
              <h3 className="text-xl font-bold text-white">No matches found</h3>
              <p className="text-neutral-500 text-sm">We couldn't find any titles matching "{searchQuery}". Try searching for another genre, title, or keywords.</p>
            </div>
          )}
        </div>
      ) : activeTab === 'home' ? (
        // Standard Home Screen: Hero Billboard + Rows
        <div>
          {/* Billboard Banner */}
          {heroMovie && (
            <div 
              className="relative h-[56.25vw] min-h-[350px] max-h-[700px] w-full bg-cover bg-center flex items-center"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(20, 20, 20, 0.9) 0%, rgba(20, 20, 20, 0.2) 60%, rgba(20, 20, 20, 0) 100%), linear-gradient(to top, rgba(20, 20, 20, 1) 0%, rgba(20, 20, 20, 0) 40%), url('${heroMovie.backdrop}')`
              }}
            >
              {/* Left-aligned details panel */}
              <div className="px-4 md:px-12 max-w-[550px] space-y-4 md:space-y-6 z-10">
                {/* Visual Label */}
                <span className="flex items-center gap-1 text-[#E50914] text-[10px] md:text-xs font-black tracking-widest uppercase">
                  <Sparkles className="w-4 h-4 fill-current" />
                  NetClone Original Series
                </span>
                
                {/* Title */}
                <h1 className="text-3xl md:text-6xl font-black tracking-tighter text-white font-display uppercase">
                  {heroMovie.title}
                </h1>

                {/* Synopsis */}
                <p className="text-xs md:text-base text-neutral-300 leading-relaxed font-normal line-clamp-3">
                  {heroMovie.synopsis}
                </p>

                {/* Button actions */}
                <div className="flex items-center gap-4 pt-2">
                  <button 
                    onClick={() => setActivePlayerMovie(heroMovie)}
                    className="bg-white hover:bg-neutral-200 text-black font-bold px-6 md:px-8 py-3 rounded flex items-center gap-2 transition-all active:scale-95 cursor-pointer text-xs md:text-sm shadow-xl"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Play</span>
                  </button>
                  <button 
                    onClick={() => setSelectedMovie(heroMovie)}
                    className="bg-[#111] hover:bg-[#1c1c1c] text-white font-bold px-6 md:px-8 py-3 rounded flex items-center gap-2 transition-all active:scale-95 cursor-pointer text-xs md:text-sm border border-neutral-800/80 shadow-xl"
                  >
                    <Info className="w-4 h-4" />
                    <span>More Info</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Carousel Rows Container */}
          <div className="space-y-8 md:space-y-12 -mt-10 md:-mt-20 relative z-20">
            {/* Dynamic My List Row - Only render if user has items */}
            {myListMovies.length > 0 && (
              <MovieRow
                title="My List"
                movies={myListMovies}
                onPlay={setActivePlayerMovie}
                onOpenDetails={setSelectedMovie}
                currentProfile={currentProfile}
                onMyListToggle={handleMyListToggle}
              />
            )}

            {homeRows.map((row) => (
              <MovieRow
                key={row.title}
                title={row.title}
                movies={row.list}
                onPlay={setActivePlayerMovie}
                onOpenDetails={setSelectedMovie}
                currentProfile={currentProfile}
                onMyListToggle={handleMyListToggle}
              />
            ))}
          </div>
        </div>
      ) : (
        // Category Specific grids (My List, Sci-Fi, Comedies, Kids)
        <div className="pt-28 px-4 md:px-16 space-y-8">
          <div className="border-b border-neutral-900 pb-4">
            <h2 className="text-2xl md:text-4xl font-black capitalize tracking-tight font-display text-white">
              {activeTab === 'mylist' ? 'My List' : activeTab === 'scifi' ? 'Sci-Fi & Fantasy' : activeTab === 'comedies' ? 'Comedies' : 'Kids Curated Catalog'}
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              {activeTab === 'mylist' ? 'Your personal bookmark folder' : `Selected premium collections under ${activeTab}`}
            </p>
          </div>

          {filteredMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredMovies.map((movie) => {
                return (
                  <motion.div
                    key={movie.id}
                    whileHover={{ scale: 1.03, y: -2 }}
                    onClick={() => setSelectedMovie(movie)}
                    className="relative bg-[#0c0c0c] rounded-lg overflow-hidden aspect-video shadow-xl group border border-neutral-900 cursor-pointer"
                  >
                    <img
                      src={movie.backdrop}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                      <h3 className="text-white font-bold text-xs md:text-sm truncate font-display tracking-tight">{movie.title}</h3>
                      <p className="text-[10px] text-emerald-500 font-bold mt-0.5">98% Match</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="py-24 text-center max-w-md mx-auto space-y-4 relative z-10">
              <List className="w-12 h-12 mx-auto text-neutral-600 stroke-[1.5]" />
              <h3 className="text-lg font-bold text-white font-display uppercase tracking-tight">Your list is currently empty</h3>
              <p className="text-neutral-500 text-xs leading-relaxed">Explore NetClone home catalog and click the "+" button on any title to add it to your personal watchlist folder.</p>
              <button
                onClick={() => setActiveTab('home')}
                className="mt-4 border border-neutral-800 hover:border-neutral-500 text-neutral-400 hover:text-white px-6 py-2.5 rounded text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer"
              >
                Browse Home
              </button>
            </div>
          )}
        </div>
      )}

      {/* Dynamic Overlay Panels: More Info Modal */}
      <AnimatePresence>
        {selectedMovie && (
          <MovieDetailModal
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
            onPlay={(movie) => {
              setSelectedMovie(null);
              setActivePlayerMovie(movie);
            }}
            currentProfile={currentProfile}
            onMyListToggle={handleMyListToggle}
          />
        )}
      </AnimatePresence>

      {/* Dynamic Overlay Panels: Interactive Video Player */}
      {activePlayerMovie && (
        <MoviePlayer
          movie={activePlayerMovie}
          onClose={() => setActivePlayerMovie(null)}
        />
      )}
    </div>
  );
}
