import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, Maximize, ArrowLeft, Loader2, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function MoviePlayer({ movie, onClose }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Auto-hide controls timer
  useEffect(() => {
    let timer;
    const resetTimer = () => {
      setShowControls(true);
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', resetTimer);
      container.addEventListener('click', resetTimer);
    }
    
    resetTimer();

    return () => {
      clearTimeout(timer);
      if (container) {
        container.removeEventListener('mousemove', resetTimer);
        container.removeEventListener('click', resetTimer);
      }
    };
  }, [isPlaying]);

  // Handle video element play state
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(e => console.log('Playback interrupted:', e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
      
      // Auto-play
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const handleSeek = (e) => {
    if (videoRef.current) {
      const newTime = parseFloat(e.target.value);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const skip = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.currentTime + seconds, duration));
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
    }
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (videoRef.current) {
      videoRef.current.muted = nextMute;
      videoRef.current.volume = nextMute ? 0 : volume;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(err => console.error('Error enabling full-screen:', err));
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Format Time Helper
  const formatTime = (timeInSecs) => {
    if (isNaN(timeInSecs)) return '00:00';
    const mins = Math.floor(timeInSecs / 60);
    const secs = Math.floor(timeInSecs % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center select-none overflow-hidden"
    >
      {/* HTML5 Video element */}
      <video
        ref={videoRef}
        src={movie.videoUrl}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
        loop
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/45 backdrop-blur-xs pointer-events-none">
          <Loader2 className="w-16 h-16 text-[#E50914] animate-spin" />
        </div>
      )}

      {/* Controls HUD */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 flex flex-col justify-between p-6 bg-gradient-to-t from-black/85 via-transparent to-black/75 text-white z-10"
          >
            {/* Top Bar */}
            <div className="flex items-center gap-6">
              <button 
                onClick={onClose}
                className="p-2 hover:bg-neutral-800/60 rounded-full transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-6 h-6 md:w-8 md:h-8" />
              </button>
              <div>
                <span className="text-xs text-[#E50914] uppercase tracking-widest font-bold">Now Playing</span>
                <h3 className="text-lg md:text-2xl font-black tracking-tight">{movie.title}</h3>
              </div>
            </div>

            {/* Middle Splash Indicator (when paused) */}
            {!isPlaying && !isLoading && (
              <div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                onClick={togglePlay}
              >
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-6 bg-black/60 rounded-full border border-neutral-700/50 flex items-center justify-center text-[#E50914] hover:text-white"
                >
                  <PlayCircle className="w-20 h-20" />
                </motion.div>
              </div>
            )}

            {/* Bottom Bar */}
            <div className="space-y-4">
              {/* Progress Bar Row */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-neutral-300">
                  {formatTime(currentTime)}
                </span>
                
                {/* Custom Timeline Range Slider */}
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 rounded-full accent-[#E50914] bg-neutral-700 hover:h-2 cursor-pointer transition-all outline-none"
                  style={{
                    background: `linear-gradient(to right, #E50914 0%, #E50914 ${((currentTime / (duration || 1)) * 100).toFixed(2)}%, #404040 ${((currentTime / (duration || 1)) * 100).toFixed(2)}%, #404040 100%)`
                  }}
                />

                <span className="text-xs font-mono text-neutral-300">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center justify-between">
                {/* Left side actions */}
                <div className="flex items-center gap-6">
                  {/* Play/Pause */}
                  <button 
                    onClick={togglePlay}
                    className="p-1 hover:text-[#E50914] transition-colors cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-6 h-6 md:w-8 md:h-8" /> : <Play className="w-6 h-6 md:w-8 md:h-8 fill-current" />}
                  </button>

                  {/* Skip backward 10s */}
                  <button 
                    onClick={() => skip(-10)}
                    className="p-1 hover:text-[#E50914] transition-colors cursor-pointer"
                    title="Rewind 10s"
                  >
                    <RotateCcw className="w-5 h-5 md:w-6 md:h-6" />
                  </button>

                  {/* Skip forward 10s */}
                  <button 
                    onClick={() => skip(10)}
                    className="p-1 hover:text-[#E50914] transition-colors cursor-pointer"
                    title="Forward 10s"
                  >
                    <RotateCw className="w-5 h-5 md:w-6 md:h-6" />
                  </button>

                  {/* Volume Controller */}
                  <div className="flex items-center gap-2 group/volume">
                    <button 
                      onClick={toggleMute}
                      className="p-1 hover:text-[#E50914] transition-colors cursor-pointer"
                    >
                      {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 md:w-6 md:h-6" /> : <Volume2 className="w-5 h-5 md:w-6 md:h-6" />}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-0 group-hover/volume:w-20 transition-all duration-300 origin-left h-1 accent-[#E50914] bg-neutral-600 outline-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #E50914 0%, #E50914 ${((isMuted ? 0 : volume) * 100).toFixed(0)}%, #404040 ${((isMuted ? 0 : volume) * 100).toFixed(0)}%, #404040 100%)`
                      }}
                    />
                  </div>
                </div>

                {/* Right side actions */}
                <div className="flex items-center gap-6">
                  {/* Fullscreen */}
                  <button 
                    onClick={toggleFullscreen}
                    className="p-1 hover:text-[#E50914] transition-colors cursor-pointer"
                    title="Toggle Fullscreen"
                  >
                    <Maximize className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
