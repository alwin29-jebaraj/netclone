import React, { useState } from 'react';
import { X, Play, Plus, Check, Star } from 'lucide-react';
import { motion } from 'motion/react';

export default function MovieDetailModal({
  movie,
  onClose,
  onPlay,
  currentProfile,
  onMyListToggle
}) {
  const [loading, setLoading] = useState(false);
  const isInMyList = currentProfile.myList.includes(movie.id);

  const handleMyListClick = async () => {
    setLoading(true);
    await onMyListToggle(movie.id, isInMyList);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Dark backdrop blur */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity cursor-pointer"
      ></div>

      {/* Modal dialog wrapper */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative bg-black rounded-xl max-w-3xl w-full overflow-hidden shadow-2xl z-10 border border-neutral-900"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 p-2 bg-black/80 hover:bg-neutral-900 rounded-full text-white transition-colors cursor-pointer border border-neutral-900 shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Billboard Banner */}
        <div className="relative h-[280px] md:h-[400px] w-full bg-cover bg-center">
          <img
            src={movie.backdrop}
            alt={movie.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Black Vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

          {/* Title overlay and primary actions */}
          <div className="absolute bottom-6 left-6 md:left-10 right-6 z-10">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white font-display mb-4 uppercase">
              {movie.title}
            </h2>

            <div className="flex items-center gap-4">
              {/* Play Button */}
              <button
                onClick={() => onPlay(movie)}
                className="bg-white hover:bg-neutral-200 text-black font-bold px-6 md:px-8 py-3 rounded flex items-center gap-2 transition-all active:scale-95 cursor-pointer text-sm md:text-base shadow-xl"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Play</span>
              </button>

              {/* Toggle watch list */}
              <button
                onClick={handleMyListClick}
                disabled={loading}
                className={`p-3 rounded-full border border-neutral-800 text-white hover:border-neutral-600 hover:bg-white/5 transition-all active:scale-90 cursor-pointer ${
                  isInMyList ? 'bg-red-600/10 border-red-600' : ''
                }`}
                title={isInMyList ? 'Remove from My List' : 'Add to My List'}
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin block"></span>
                ) : isInMyList ? (
                  <Check className="w-5 h-5 text-red-500 stroke-[3px]" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Details Panel */}
        <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 text-neutral-300 bg-black">
          {/* Left Block - Metadata and Synopsis */}
          <div className="md:col-span-2 space-y-4">
            {/* Metadata headers */}
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="text-emerald-500 font-bold">98% Match</span>
              <span className="text-neutral-500">{movie.year}</span>
              <span className="border border-neutral-800 bg-[#161616] text-[10px] uppercase font-bold px-1.5 py-0.5 rounded text-neutral-400">
                {movie.rating}
              </span>
              <span className="text-neutral-500">{movie.duration}</span>
              <span className="border border-red-900/40 text-red-500 text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-950/10">
                Ultra 4K
              </span>
            </div>

            {/* Movie Synopsis details */}
            <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-normal">
              {movie.synopsis}
            </p>
          </div>

          {/* Right Block - Genres, Cast, Tags */}
          <div className="space-y-4 text-xs md:text-sm border-t border-neutral-900 md:border-t-0 pt-4 md:pt-0">
            <div>
              <span className="text-neutral-500 font-medium font-display">Genres: </span>
              <span className="text-neutral-200 hover:underline cursor-pointer">
                {movie.category}, Sci-Fi & Adventure
              </span>
            </div>

            <div>
              <span className="text-neutral-500 font-medium font-display">Tags: </span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {movie.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#161616] border border-neutral-900 text-neutral-400 px-2.5 py-0.5 rounded text-[11px] font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center gap-1 text-amber-500">
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <span className="text-neutral-500 text-xs ml-1.5">Top-rated title</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
