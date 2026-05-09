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
    <div className="flex flex-col items-center gap-2 w-full">
      {/* First Time Prompt — shown above the button when not yet enabled */}
      <AnimatePresence>
        {!isEnabled && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="w-full"
          >
            <div className="bg-slate-900/80 backdrop-blur-md rounded-lg border border-slate-700/50 p-3 shadow-2xl text-center">
              <p className="text-sm text-slate-300">
                🎵 <strong>Experience the Grand Line with music!</strong>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Each location has its own theme. Click &quot;Enable Music&quot; to start.
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
              className="bg-slate-900/80 backdrop-blur-md rounded-lg border border-slate-700/50 p-2 flex items-center gap-3 shadow-2xl"
            >
              {/* Volume Icon */}
              <button
                onClick={() => setVolume(volume > 0 ? 0 : 0.3)}
                className="p-1 hover:bg-slate-800 rounded transition-colors"
                title={volume > 0 ? 'Mute' : 'Unmute'}
              >
                {volume > 0 ? (
                  <Volume2 className="w-5 h-5 text-slate-300" />
                ) : (
                  <VolumeX className="w-5 h-5 text-slate-500" />
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
                  className="w-24 h-4 md:h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  style={{
                    background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(59, 130, 246) ${
                      volume * 100
                    }%, rgb(51, 65, 85) ${volume * 100}%, rgb(51, 65, 85) 100%)`,
                  }}
                />
                <div className="text-xs text-slate-400 mt-1 text-center">
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
              className="flex items-center gap-2 px-3 py-1 bg-slate-800/50 rounded mr-2"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <Music className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-slate-300 max-w-[100px] md:max-w-[150px] truncate font-medium hidden sm:inline">
                {currentTrack}
              </span>
            </motion.div>
          )}

          {/* Settings Button */}
          {isEnabled && (
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded transition-colors ${
                showSettings
                  ? 'bg-slate-700 text-white'
                  : 'hover:bg-slate-800 text-slate-400'
              }`}
              title="Audio Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}

          {/* Toggle Audio Button */}
          <button
            onClick={toggleAudio}
            className={`px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
              isEnabled
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/20'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
            }`}
          >
            {isEnabled ? (
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4" />
                <span>Music On</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4" />
                <span>Enable Music</span>
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
    return <div className="w-full flex flex-col items-center">{controlsContent}</div>;
  }

  // Desktop / default: render with its own fixed positioning (bottom-right)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 z-50 hidden md:block"
    >
      {controlsContent}
    </motion.div>
  );
}
