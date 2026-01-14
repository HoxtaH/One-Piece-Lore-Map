'use client';

import { Location } from '@/lib/types/location';

interface JourneyControlsProps {
  showJourneyPath: boolean;
  isPlaying: boolean;
  isCameraLocked: boolean;
  progress: number; // 0-100
  currentLocation: Location | null;
  onToggleJourney: () => void;
  onPlay: () => void;
  onRestart: () => void;
  onToggleCameraLock: () => void;
}

export function JourneyControls({
  showJourneyPath,
  isPlaying,
  isCameraLocked,
  progress,
  currentLocation,
  onToggleJourney,
  onPlay,
  onRestart,
  onToggleCameraLock,
}: JourneyControlsProps) {
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40">
      <div className="bg-[#D4C4A8] border-4 border-[#654321] rounded-lg shadow-2xl">
        <div className="flex items-center gap-4 px-6 py-4">
          {/* Toggle Journey Path Button */}
          <button
            onClick={onToggleJourney}
            className={`px-5 py-2.5 rounded-lg font-bold transition-all transform hover:scale-105 pirate-font text-lg ${
              showJourneyPath
                ? 'bg-[#8B4513] text-white shadow-lg border-2 border-[#654321]'
                : 'bg-[#E8DCC4] hover:bg-[#D4C4A8] text-[#2D1810] border-2 border-[#8B4513]'
            }`}
          >
            {showJourneyPath ? '🗺️ Hide Journey' : '🗺️ Show Journey'}
          </button>

          {/* Journey Controls - Only show when path is visible */}
          {showJourneyPath && (
            <>
              {/* Play/Pause Button */}
              <button
                onClick={onPlay}
                className="px-5 py-2.5 bg-[#654321] hover:bg-[#5C4033] text-white rounded-lg transition-colors ornate-font font-bold text-lg border-2 border-[#8B4513]"
                title={isPlaying ? 'Pause Journey' : 'Play Journey'}
              >
                {isPlaying ? '⏸️ Pause' : '▶️ Play'}
              </button>

              {/* Restart Button */}
              <button
                onClick={onRestart}
                className="px-5 py-2.5 bg-[#8B4513] hover:bg-[#A0522D] text-white rounded-lg transition-colors ornate-font font-bold text-lg border-2 border-[#654321]"
                title="Restart Journey"
              >
                ⏮️ Restart
              </button>

              {/* Camera Lock Button */}
              <button
                onClick={onToggleCameraLock}
                className={`px-3 py-2.5 rounded-lg transition-colors border-2 border-[#654321] ${
                  isCameraLocked 
                    ? 'bg-[#D4AF37] text-black hover:bg-[#C5A028]' 
                    : 'bg-[#E8DCC4] text-[#654321] hover:bg-[#D4C4A8]'
                }`}
                title={isCameraLocked ? "Unlock Camera" : "Lock Camera to Ship"}
              >
                {isCameraLocked ? '🔒' : '🔓'}
              </button>

              {/* Progress Bar */}
              <div className="flex-1 bg-[#E8DCC4] rounded-full h-4 overflow-hidden border-3 border-[#654321] min-w-[250px] shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-[#8B4513] to-[#D4AF37] transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Progress Percentage */}
              <span className="text-[#2D1810] font-bold typewriter-font text-lg min-w-[60px] text-center">
                {Math.round(progress)}%
              </span>

              {/* Current Location Display */}
              {currentLocation && (
                <>
                  {/* Divider */}
                  <div className="w-1 h-10 bg-[#654321] rounded" />

                  <div className="flex items-center gap-2 px-4 py-2 bg-[#E8DCC4] rounded-lg border-2 border-[#8B4513]">
                    <div className="w-3 h-3 bg-[#D4AF37] rounded-full animate-pulse border border-[#654321]" />
                    <div className="text-sm">
                      <span className="text-[#5C4033] old-book-font">Now at:</span>
                      <span className="text-[#2D1810] font-bold pirate-font ml-2 text-base">
                        {currentLocation.name}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
