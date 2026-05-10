/**
 * Audio Controls Component
 * UI for controlling audio playback, volume, and displaying current track
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Volume2, VolumeX, Settings } from 'lucide-react';
import { useAudio } from '@/lib/context/AudioContext';

interface AudioControlsProps {
  /** When true, renders without fixed positioning for use inside a parent HUD container */
  mobileInline?: boolean;
}

export default function AudioControls({ mobileInline = false }: AudioControlsProps) {
  const { isEnabled, volume, currentTrack, isPlaying, toggleAudio, setVolume } = useAudio();
  const [showSettings, setShowSettings] = useState(false);

  // The core controls UI — shared between inline and fixed modes
  const controlsContent = (
    <div className="flex flex-col items-center gap-2 w-auto">
      {/* First Time Prompt — shown above the button when not yet enabled */}
      <AnimatePresence>
        {!isEnabled && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="w-auto max-w-[80vw]"
          >
            <div className="bg-slate-900/80 backdrop-blur-md rounded-lg border border-slate-700/50 p-1.5 md:p-3 shadow-2xl text-center">
              <p className="text-xs md:text-sm text-slate-300">
                🎵 <strong className="hidden sm:inline [@media(max-height:600px)]:!hidden">Experience the Grand Line with music!</strong><strong className="sm:hidden [@media(max-height:600px)]:!inline">Music!</strong>
              </p>
              <p className="text-[10px] md:text-xs text-slate-400 mt-1">
                <span className="hidden sm:inline [@media(max-height:600px)]:!hidden">Each location has its own theme.</span> Click &quot;Music&quot; to start.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls Row */}
      <div className="flex items-center gap-2">
        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && isEnabled && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-slate-900/80 backdrop-blur-md rounded-lg border border-slate-700/50 p-1.5 flex items-center gap-2 shadow-2xl"
            >
              {/* Volume Icon */}
              <button
                onClick={() => setVolume(volume > 0 ? 0 : 0.3)}
                className="p-1 hover:bg-slate-800 rounded transition-colors"
                title={volume > 0 ? 'Mute' : 'Unmute'}
              >
                {volume > 0 ? (
                  <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-slate-300" />
                ) : (
                  <VolumeX className="w-4 h-4 md:w-5 md:h-5 text-slate-500" />
                )}
              </button>

              {/* Volume Slider */}
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume * 100}
                  onChange={(e) => setVolume(parseInt(e.target.value) / 100)}
                  className="w-20 md:w-24 h-3 md:h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  style={{
                    background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(59, 130, 246) ${
                      volume * 100
                    }%, rgb(51, 65, 85) ${volume * 100}%, rgb(51, 65, 85) 100%)`,
                  }}
                />
                <div className="text-[10px] text-slate-400 mt-0.5 text-center">
                  {Math.round(volume * 100)}%
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Controls */}
        <div className="bg-slate-900/80 backdrop-blur-md rounded-lg border border-slate-700/50 p-1 flex items-center gap-1 shadow-2xl">
          {/* Current Track Display */}
          {currentTrack && isEnabled && isPlaying && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="flex items-center gap-1.5 px-2 md:px-3 py-1 bg-slate-800/50 rounded mr-1"
            >
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <Music className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs text-slate-300 max-w-[80px] md:max-w-[150px] truncate font-medium hidden sm:inline">
                {currentTrack}
              </span>
            </motion.div>
          )}

          {/* Settings Button */}
          {isEnabled && (
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-1.5 rounded transition-colors ${
                showSettings
                  ? 'bg-slate-700 text-white'
                  : 'hover:bg-slate-800 text-slate-400'
              }`}
              title="Audio Settings"
            >
              <Settings className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          )}

          {/* Toggle Audio Button */}
          <button
            onClick={toggleAudio}
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium transition-all transform hover:scale-105 text-xs md:text-sm ${
              isEnabled
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/20'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
            }`}
          >
            {isEnabled ? (
              <div className="flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5" />
                <span>On</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5" />
                <span>Music</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // In mobileInline mode, render as a plain block (no fixed wrapper)
  // The parent HUD container handles positioning
  if (mobileInline) {
    return <div className="w-auto flex flex-col items-center">{controlsContent}</div>;
  }

  // Desktop / default: render with its own fixed positioning (bottom-right)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 [@media(max-height:600px)]:!bottom-2 right-6 [@media(max-height:600px)]:!right-2 z-50 hidden md:block w-auto"
    >
      {controlsContent}
    </motion.div>
  );
}
