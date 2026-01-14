/**
 * useMapAudio Hook - SIMPLIFIED
 * Just plays map theme when enabled
 */

'use client';

import { useEffect } from 'react';
import { useAudio } from '@/lib/context/AudioContext';

export function useMapAudio() {
  const { playTrack, isEnabled } = useAudio();

  useEffect(() => {
    if (isEnabled) {
      console.log('[MapAudio] Playing map theme');
      playTrack('/music/world-map-theme.mp3', 'To the Grand Line');
    }
  }, [isEnabled, playTrack]);

  return {};
}
