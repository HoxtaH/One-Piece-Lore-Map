/**
 * Audio Context - Simple Audio Management
 * Basic implementation that just works
 */

'use client';

import { createContext, useContext, useRef, useState, useCallback, useEffect, ReactNode } from 'react';

interface AudioContextType {
  currentTrack: string | null;
  isPlaying: boolean;
  isEnabled: boolean;
  volume: number;
  playTrack: (url: string, title?: string) => void;
  stopTrack: () => void;
  toggleAudio: () => void;
  setVolume: (vol: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [volume, setVolumeState] = useState(0.3);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const playTrack = useCallback((url: string, title?: string) => {
    if (!isEnabled) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[Audio] Not enabled yet');
      }
      return;
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[Audio] Playing:', url);
    }
    
    // Stop current
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    
    // Play new
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = volume;
    audio.play().then(() => {
      if (process.env.NODE_ENV === 'development') {
        console.log('[Audio] Playback started');
      }
    }).catch(err => {
      console.error('[Audio] Playback failed:', err);
    });
    
    audioRef.current = audio;
    setCurrentTrack(title || url);
    setIsPlaying(true);
  }, [isEnabled, volume]);
  
  const stopTrack = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    setCurrentTrack(null);
    setIsPlaying(false);
  }, []);
  
  const toggleAudio = useCallback(() => {
    setIsEnabled(prev => {
      const newState = !prev;
      if (process.env.NODE_ENV === 'development') {
        console.log('[Audio] Toggled to:', newState);
      }
      if (!newState) {
        stopTrack();
      }
      return newState;
    });
  }, [stopTrack]);
  
  const setVolume = useCallback((vol: number) => {
    const newVol = Math.max(0, Math.min(1, vol));
    setVolumeState(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);
  
  return (
    <AudioContext.Provider value={{
      currentTrack,
      isPlaying,
      isEnabled,
      volume,
      playTrack,
      stopTrack,
      toggleAudio,
      setVolume
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
}

