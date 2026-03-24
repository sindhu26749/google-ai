import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#0ff] font-sans selection:bg-[#f0f]/30 overflow-hidden relative">
      {/* Glitch Overlays */}
      <div className="scanline"></div>
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

      <main className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center gap-8">
        <header className="text-center space-y-4">
          <div className="relative inline-block">
            <motion.h1 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl md:text-6xl font-bold tracking-tighter uppercase glitch-text"
              data-text="VOID_PROTOCOL_v2.4"
            >
              VOID_PROTOCOL_v2.4
            </motion.h1>
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-1"
          >
            <p className="text-[#f0f] text-[10px] uppercase tracking-[0.4em] animate-pulse">
              STATUS: UNSTABLE // AUTH: GRANTED
            </p>
            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#0ff] to-transparent"></div>
          </motion.div>
        </header>

        <div className="flex flex-col lg:flex-row items-start justify-center gap-8 w-full max-w-6xl">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full lg:w-auto flex flex-col gap-4"
          >
            <div className="flex items-center gap-2 text-[8px] text-[#f0f] uppercase tracking-widest mb-[-10px] ml-2">
              <span className="w-2 h-2 bg-[#f0f] animate-ping"></span>
              LIVE_FEED: GRID_01
            </div>
            <SnakeGame />
          </motion.div>

          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="w-full lg:max-w-sm flex flex-col gap-6"
          >
            <div className="space-y-2">
              <h2 className="text-[10px] text-[#0ff] uppercase tracking-[0.3em] flex justify-between">
                <span>AUDIO_SUBSYSTEM</span>
                <span className="text-[#f0f]">DECRYPTING...</span>
              </h2>
              <MusicPlayer />
            </div>

            <div className="p-4 bg-[#111] border-2 border-[#0ff]/20 space-y-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-[#0ff] animate-glitch opacity-50"></div>
              <h3 className="text-[8px] text-white/40 uppercase tracking-widest">KERNEL_LOGS</h3>
              <div className="space-y-2 font-mono text-[8px]">
                <p className="text-[#0ff] animate-pulse">&gt; INITIALIZING_SNAKE_CORE...</p>
                <p className="text-[#f0f]">&gt; WARNING: MEMORY_LEAK_DETECTED</p>
                <p className="text-[#0ff]">&gt; SYNCING_RHYTHM_CLOCK_0x4F2</p>
                <p className="text-white/20">&gt; IDLE_PROCESS_0001</p>
              </div>
            </div>
          </motion.div>
        </div>

        <footer className="mt-auto pt-8 flex flex-col items-center gap-2">
          <div className="text-[8px] font-mono text-white/20 uppercase tracking-[0.8em]">
            TERMINAL_END_OF_LINE
          </div>
          <div className="flex gap-4">
            <div className="w-1 h-1 bg-[#0ff] animate-glitch"></div>
            <div className="w-1 h-1 bg-[#f0f] animate-glitch" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1 h-1 bg-white animate-glitch" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </footer>
      </main>
    </div>
  );
}
