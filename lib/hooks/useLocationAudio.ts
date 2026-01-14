/**
 * useLocationAudio Hook
 * Automatically plays location-specific music when enabled
 */

'use client';

import { useEffect, useRef } from 'react';
import { useAudio } from '@/lib/context/AudioContext';

interface UseLocationAudioOptions {
  musicUrl?: string;
  musicTitle?: string;
  autoPlay?: boolean;
}

export function useLocationAudio(options: UseLocationAudioOptions) {
  const { musicUrl, musicTitle, autoPlay = true } = options;
  const { isEnabled, playTrack } = useAudio();
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    // Only play if audio is enabled, autoPlay is true, and we have a URL
    if (isEnabled && autoPlay && musicUrl) {
      // Play the track
      playTrack(musicUrl, musicTitle);
      hasPlayedRef.current = true;
    }

    // Cleanup: Don't stop audio on unmount - let next location handle transition
    // This prevents audio from stopping between page navigations
    return () => {
      hasPlayedRef.current = false;
    };
  }, [musicUrl, musicTitle, isEnabled, autoPlay, playTrack]);

  return null;
}
