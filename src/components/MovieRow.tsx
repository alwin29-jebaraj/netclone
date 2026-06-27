import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Plus, Check, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface MovieRowProps {
  key?: string;
  title: string;
  movies: any[];
  onPlay: (movie: any) => void;
  onOpenDetails: (movie: any) => void;
  currentProfile: any;
  onMyListToggle: (movieId: string, isInList: boolean) => Promise<void>;
}

export default function MovieRow({
  title,
  movies,
  onPlay,
  onOpenDetails,
  currentProfile,
  onMyListToggle
}: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);

  const handleScroll = () => {
    if (rowRef.current) {
      setShowLeftArrow(rowRef.current.scrollLeft > 10);
    }
  };

  const slide = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollOffset = direction === 'left' ? scrollLeft - clientWidth * 0.75 : scrollLeft + clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: scrollOffset,
        behavior: 'smooth'
      });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="space-y-2 md:space-y-4 px-4 md:px-16 select-none relative group/row">
      {/* Row Title */}
      <h2 className="text-xs md:text-sm font-bold uppercase tracking-widest text-neutral-400 group-hover/row:text-white transition-colors font-display">
        {title}
      </h2>

      {/* Row Track Container */}
      <div className="relative">
        {/* Left sliding trigger overlay */}
        {showLeftArrow && (
          <button
            onClick={() => slide('left')}
            className="absolute left-0 top-0 bottom-0 z-10 w-10 md:w-12 bg-black/80 hover:bg-black flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity text-white cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 hover:scale-110 transition-transform" />
          </button>
        )}

        {/* Horizontal Track list */}
        <div
          ref={rowRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto overflow-y-hidden py-4 px-0.5 no-scrollbar scroll-smooth"
        >
          {movies.map((movie) => {
            const isAddedToList = currentProfile.myList.includes(movie.id);

            return (
              <motion.div
                key={movie.id}
                whileHover={{ scale: 1.03, y: -2 }}
                transition={{ duration: 0.15 }}
                className="relative min-w-[200px] w-[200px] md:min-w-[260px] md:w-[260px] h-[115px] md:h-[150px] bg-[#0c0c0c] rounded-lg overflow-hidden shadow-xl group cursor-pointer border border-neutral-900"
              >
                {/* Backdrop poster image */}
                <img
                  src={movie.backdrop}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                  referrerPolicy="no-referrer"
                  onClick={() => onOpenDetails(movie)}
                />

                {/* Information slide-up card details */}
                <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-3.5 flex flex-col justify-between z-10">
                  {/* Top: title */}
                  <h3 
                    onClick={() => onOpenDetails(movie)}
                    className="text-white text-xs md:text-sm font-bold tracking-tight truncate pr-6 hover:underline font-display"
                  >
                    {movie.title}
                  </h3>

                  {/* Bottom: actions and tags */}
                  <div className="space-y-1.5">
                    {/* Action buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* Play quick-action */}
                        <button
                          onClick={() => onPlay(movie)}
                          className="p-1.5 bg-white text-black rounded-full hover:bg-red-600 hover:text-white transition-all active:scale-90 shadow-md cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </button>

                        {/* List quick toggle */}
                        <button
                          onClick={() => onMyListToggle(movie.id, isAddedToList)}
                          className={`p-1.5 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 hover:scale-105 border border-neutral-800 transition-all active:scale-90 shadow-md cursor-pointer ${
                            isAddedToList ? 'border-red-600 bg-red-600/10' : ''
                          }`}
                        >
                          {isAddedToList ? (
                            <Check className="w-3.5 h-3.5 text-red-500 stroke-[3px]" />
                          ) : (
                            <Plus className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Detail modal clicker */}
                      <button
                        onClick={() => onOpenDetails(movie)}
                        className="p-1.5 bg-neutral-900 text-neutral-400 hover:text-white rounded-full border border-neutral-800 hover:border-neutral-600 transition-colors cursor-pointer"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Metadata line */}
                    <div className="flex items-center gap-1.5 text-[10px] text-neutral-300 font-bold">
                      <span className="text-emerald-500 font-black">95% Match</span>
                      <span className="text-neutral-500">{movie.year}</span>
                      <span className="px-1 py-0.2 bg-[#1c1c1c] border border-neutral-800 text-[8px] rounded text-neutral-400 uppercase">
                        {movie.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right sliding trigger overlay */}
        <button
          onClick={() => slide('right')}
          className="absolute right-0 top-0 bottom-0 z-10 w-10 md:w-12 bg-black/80 hover:bg-black flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity text-white cursor-pointer"
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8 hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
}
