/**
 * Audio Controls Component
 * UI for controlling audio playback, volume, and displaying current track
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Volume2, VolumeX, Settings } from 'lucide-react';
import { useAudio } from '@/lib/context/AudioContext';

export default function AudioControls() {
  const { isEnabled, volume, currentTrack, isPlaying, toggleAudio, setVolume } = useAudio();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="flex items-center gap-2">
          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && isEnabled && (
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                className="flex items-center gap-3 px-4 py-3 bg-slate-900/95 backdrop-blur-md rounded-lg border border-slate-700/50 shadow-xl"
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
                    className="w-24 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
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

          {/* Main Control */}
          <div className="flex items-center gap-2 px-4 py-3 bg-slate-900/95 backdrop-blur-md rounded-lg border border-slate-700/50 shadow-xl">
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
                <span className="text-sm text-slate-300 max-w-[150px] truncate font-medium">
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
      </motion.div>

      {/* First Time Prompt */}
      {!isEnabled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-24 right-6 z-40"
        >
          <div className="bg-slate-900/95 backdrop-blur-md rounded-lg border border-slate-700/50 p-3 shadow-xl max-w-[250px]">
            <p className="text-sm text-slate-300">
              🎵 <strong>Experience the Grand Line with music!</strong>
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Each location has its own theme. Click "Enable Music" to start.
            </p>
          </div>
        </motion.div>
      )}
    </>
  );
}
