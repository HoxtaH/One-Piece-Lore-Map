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
  /** When true, renders without fixed positioning for use inside a parent HUD container */
  mobileInline?: boolean;
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
  mobileInline = false,
}: JourneyControlsProps) {
  const inner = (
    <div className="bg-[#D4C4A8]/90 backdrop-blur-sm border-2 md:border-4 border-[#654321] rounded-lg shadow-2xl overflow-hidden w-full">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-4 p-2 md:px-6 md:py-4">
        
        {/* Main Controls Row */}
        <div className="flex items-center justify-between md:justify-start gap-2 md:gap-4">
          {/* Toggle Journey Path Button */}
          <button
            onClick={onToggleJourney}
            className={`flex-1 md:flex-none px-3 md:px-5 py-2 md:py-2.5 rounded-lg font-bold transition-all transform hover:scale-105 pirate-font text-sm md:text-lg whitespace-nowrap ${
              showJourneyPath
                ? 'bg-[#8B4513] text-white shadow-lg border-2 border-[#654321]'
                : 'bg-[#E8DCC4] hover:bg-[#D4C4A8] text-[#2D1810] border-2 border-[#8B4513]'
            }`}
          >
            🗺️ <span className="hidden md:inline">{showJourneyPath ? 'Hide Journey' : 'Show Journey'}</span>
            <span className="md:hidden">{showJourneyPath ? 'Hide' : 'Show'}</span>
          </button>

          {/* Journey Controls - Only show when path is visible */}
          {showJourneyPath && (
            <div className="flex items-center gap-2">
              {/* Play/Pause Button */}
              <button
                onClick={onPlay}
                className="px-3 md:px-5 py-2 md:py-2.5 bg-[#654321] hover:bg-[#5C4033] text-white rounded-lg transition-colors ornate-font font-bold text-sm md:text-lg border-2 border-[#8B4513]"
                title={isPlaying ? 'Pause Journey' : 'Play Journey'}
              >
                {isPlaying ? '⏸️' : '▶️'} <span className="hidden md:inline">{isPlaying ? 'Pause' : 'Play'}</span>
              </button>

              {/* Restart Button */}
              <button
                onClick={onRestart}
                className="px-3 md:px-5 py-2 md:py-2.5 bg-[#8B4513] hover:bg-[#A0522D] text-white rounded-lg transition-colors ornate-font font-bold text-sm md:text-lg border-2 border-[#654321]"
                title="Restart Journey"
              >
                ⏮️ <span className="hidden md:inline">Restart</span>
              </button>

              {/* Camera Lock Button */}
              <button
                onClick={onToggleCameraLock}
                className={`px-2.5 md:px-3 py-2 md:py-2.5 rounded-lg transition-colors border-2 border-[#654321] ${
                  isCameraLocked 
                    ? 'bg-[#D4AF37] text-black hover:bg-[#C5A028]' 
                    : 'bg-[#E8DCC4] text-[#654321] hover:bg-[#D4C4A8]'
                }`}
                title={isCameraLocked ? "Unlock Camera" : "Lock Camera to Ship"}
              >
                {isCameraLocked ? '🔒' : '🔓'}
              </button>
            </div>
          )}
        </div>

        {/* Progress & Info Row */}
        {showJourneyPath && (
          <div className="flex items-center gap-2 md:gap-4 flex-1">
            {/* Progress Bar Container */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="flex-1 bg-[#E8DCC4] rounded-full h-3 md:h-4 overflow-hidden border-2 md:border-3 border-[#654321] shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-[#8B4513] to-[#D4AF37] transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Progress Percentage */}
              <span className="text-[#2D1810] font-bold typewriter-font text-xs md:text-lg min-w-[35px] md:min-w-[60px] text-center">
                {Math.round(progress)}%
              </span>
            </div>

            {/* Current Location Display */}
            {currentLocation && (
              <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-4 py-1 md:py-2 bg-[#E8DCC4] rounded-lg border-2 border-[#8B4513] max-w-[120px] md:max-w-none">
                <div className="w-2 md:w-3 h-2 md:h-3 bg-[#D4AF37] rounded-full animate-pulse border border-[#654321] flex-shrink-0" />
                <div className="text-[10px] md:text-sm truncate">
                  <span className="text-[#5C4033] old-book-font hidden lg:inline">Now at:</span>
                  <span className="text-[#2D1810] font-bold pirate-font ml-1 md:ml-2 text-xs md:text-base">
                    {currentLocation.name}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // In mobileInline mode, render as a plain block — parent handles positioning
  if (mobileInline) {
    return <div className="w-full">{inner}</div>;
  }

  // Desktop / default: render with its own fixed centering
  return (
    <div className="fixed bottom-2 md:bottom-24 left-1/2 -translate-x-1/2 z-40 w-[95vw] md:w-auto max-w-4xl hidden md:block">
      {inner}
    </div>
  );
}
