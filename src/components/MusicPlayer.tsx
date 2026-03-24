import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Activity } from 'lucide-react';
import { motion } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: "SIGNAL_LOST",
    artist: "VOID_WALKER",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: 2,
    title: "STATIC_DREAM",
    artist: "NULL_POINTER",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: 3,
    title: "CORE_DUMP",
    artist: "ROOT_ACCESS",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  return (
    <div className="w-full max-w-md p-4 bg-black border-2 border-[#0ff] shadow-[4px_4px_0px_#f0f]">
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onTimeUpdate={onTimeUpdate}
        onEnded={handleNext}
      />
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-20 h-20 bg-[#111] border border-[#f0f] flex items-center justify-center overflow-hidden relative">
            <Activity size={32} className={isPlaying ? 'text-[#f0f] animate-pulse' : 'text-slate-800'} />
            {isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-[1px] bg-[#f0f]/30 animate-glitch"></div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0 font-sans">
          <h3 className="text-sm font-bold text-[#0ff] truncate glitch-text" data-text={currentTrack.title}>{currentTrack.title}</h3>
          <p className="text-[#f0f] text-[8px] uppercase tracking-widest mt-1">{currentTrack.artist}</p>
          
          <div className="mt-4 flex items-center gap-4">
            <button onClick={handlePrev} className="text-[#0ff] hover:text-[#f0f] transition-colors">
              <SkipBack size={16} fill="currentColor" />
            </button>
            <button 
              onClick={togglePlay}
              className="w-8 h-8 flex items-center justify-center bg-[#f0f] text-black border-b-2 border-r-2 border-black active:border-0 active:translate-x-0.5 active:translate-y-0.5"
            >
              {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
            </button>
            <button onClick={handleNext} className="text-[#0ff] hover:text-[#f0f] transition-colors">
              <SkipForward size={16} fill="currentColor" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="h-1 w-full bg-[#111] border border-[#0ff]/30 overflow-hidden">
          <div 
            className="h-full bg-[#f0f]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between items-center font-sans text-[8px]">
          <div className="flex items-center gap-2 text-[#0ff]/40">
            <Volume2 size={10} />
            <div className="w-12 h-1 bg-[#111]">
              <div className="w-2/3 h-full bg-[#0ff]/40"></div>
            </div>
          </div>
          <span className="text-[#f0f]/40 uppercase">STREAM_ID: {currentTrackIndex + 1}</span>
        </div>
      </div>
    </div>
  );
}
