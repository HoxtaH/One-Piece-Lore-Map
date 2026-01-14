/**
 * Audio System Types
 * TypeScript interfaces for the audio management system
 */

export interface MusicTrack {
  url: string;
  title: string;
  volume?: number;
}

export interface AudioState {
  isEnabled: boolean;
  volume: number;
  currentTrack: string | null;
  isPlaying: boolean;
  isLoading: boolean;
}

export interface AudioContextType {
  isEnabled: boolean;
  volume: number;
  currentTrack: string | null;
  isPlaying: boolean;
  isLoading: boolean;
  toggleAudio: () => void;
  setVolume: (volume: number) => void;
  playTrack: (src: string, title?: string) => Promise<void>;
  stopTrack: () => Promise<void>;
}

export interface AudioServiceConfig {
  defaultVolume: number;
  fadeDuration: number;
  enableLooping: boolean;
}
