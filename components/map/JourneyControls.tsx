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
    <div className={`bg-[#D4C4A8]/90 backdrop-blur-sm border border-[#654321] rounded-lg shadow-2xl overflow-hidden w-auto max-w-[95vw] mx-auto ${!mobileInline ? 'md:border-4' : ''}`}>
      <div className={`flex flex-col [@media(max-height:600px)]:flex-row items-stretch [@media(max-height:600px)]:items-center gap-1.5 p-1.5 ${!mobileInline ? 'md:flex-row md:items-center md:gap-4 md:px-6 md:py-4' : ''}`}>
        
        {/* Main Controls Row */}
        <div className={`flex items-center justify-center gap-1.5 ${!mobileInline ? 'md:justify-start md:gap-4' : ''}`}>
          {/* Toggle Journey Path Button */}
          <button
            onClick={onToggleJourney}
            className={`px-2 py-1.5 rounded-lg font-bold transition-all transform hover:scale-105 pirate-font text-xs whitespace-nowrap ${!mobileInline ? 'md:px-5 md:py-2.5 md:text-lg' : ''} ${
              showJourneyPath
                ? 'bg-[#8B4513] text-white shadow-lg border border-[#654321]'
                : 'bg-[#E8DCC4] hover:bg-[#D4C4A8] text-[#2D1810] border border-[#8B4513]'
            }`}
          >
            🗺️ <span className={`hidden [@media(max-height:600px)]:!hidden ${!mobileInline ? 'md:inline' : ''}`}>{showJourneyPath ? 'Hide Journey' : 'Show Journey'}</span>
            <span className={`[@media(max-height:600px)]:!inline ${!mobileInline ? 'md:hidden' : ''}`}>Journey</span>
          </button>

          {/* Journey Controls - Only show when path is visible */}
          {showJourneyPath && (
            <div className="flex items-center gap-1.5">
              {/* Play/Pause Button */}
              <button
                onClick={onPlay}
                className={`px-2 py-1.5 bg-[#654321] hover:bg-[#5C4033] text-white rounded-lg transition-colors ornate-font font-bold text-xs border border-[#8B4513] ${!mobileInline ? 'md:px-5 md:py-2.5 md:text-lg' : ''}`}
                title={isPlaying ? 'Pause Journey' : 'Play Journey'}
              >
                {isPlaying ? '⏸️' : '▶️'} <span className={`hidden [@media(max-height:600px)]:!hidden ${!mobileInline ? 'md:inline' : ''}`}>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>

              {/* Restart Button */}
              <button
                onClick={onRestart}
                className={`px-2 py-1.5 bg-[#8B4513] hover:bg-[#A0522D] text-white rounded-lg transition-colors ornate-font font-bold text-xs border border-[#654321] ${!mobileInline ? 'md:px-5 md:py-2.5 md:text-lg' : ''}`}
                title="Restart Journey"
              >
                ⏮️ <span className={`hidden [@media(max-height:600px)]:!hidden ${!mobileInline ? 'md:inline' : ''}`}>Restart</span>
              </button>

              {/* Camera Lock Button */}
              <button
                onClick={onToggleCameraLock}
                className={`px-1.5 py-1.5 rounded-lg transition-colors border border-[#654321] ${!mobileInline ? 'md:px-3 md:py-2.5' : ''} ${
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
          <div className={`flex items-center gap-1.5 flex-1 ${!mobileInline ? 'md:gap-4' : ''}`}>
            {/* Progress Bar Container */}
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <div className={`flex-1 bg-[#E8DCC4] rounded-full h-2 overflow-hidden border border-[#654321] shadow-inner ${!mobileInline ? 'md:h-4 md:border-3' : ''}`}>
                <div
                  className="h-full bg-gradient-to-r from-[#8B4513] to-[#D4AF37] transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Progress Percentage */}
              <span className={`text-[#2D1810] font-bold typewriter-font text-[10px] min-w-[30px] text-center ${!mobileInline ? 'md:text-lg md:min-w-[60px]' : ''}`}>
                {Math.round(progress)}%
              </span>
            </div>

            {/* Current Location Display */}
            {currentLocation && (
              <div className={`flex items-center gap-1 px-1.5 py-1 bg-[#E8DCC4] rounded-lg border border-[#8B4513] max-w-[100px] ${!mobileInline ? 'md:gap-2 md:px-4 md:py-2 md:max-w-none' : ''}`}>
                <div className={`w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse border border-[#654321] flex-shrink-0 ${!mobileInline ? 'md:w-3 md:h-3' : ''}`} />
                <div className={`text-[9px] truncate ${!mobileInline ? 'md:text-sm' : ''}`}>
                  <span className={`text-[#5C4033] old-book-font hidden ${!mobileInline ? 'lg:inline' : ''}`}>Now at:</span>
                  <span className={`text-[#2D1810] font-bold pirate-font ml-1 text-[10px] ${!mobileInline ? 'md:ml-2 md:text-base' : ''}`}>
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
    return <div className="w-auto inline-block">{inner}</div>;
  }

  // Desktop / default: render with its own fixed centering
  return (
    <div className="fixed bottom-2 md:bottom-24 [@media(max-height:600px)]:!hidden left-1/2 -translate-x-1/2 z-40 w-auto max-w-[95vw] md:w-auto hidden md:block">
      {inner}
    </div>
  );
}
