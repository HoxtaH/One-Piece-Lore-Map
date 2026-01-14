/**
 * Audio Service - Singleton Pattern
 * Manages a single HTMLAudioElement instance to prevent memory leaks and audio stacking
 */

import type { AudioServiceConfig } from '@/lib/types/audio';

class AudioService {
  private static instance: AudioService;
  private audioElement: HTMLAudioElement | null = null;
  private currentTrack: string | null = null;
  private fadeInterval: NodeJS.Timeout | null = null;
  private isInitialized: boolean = false;
  private config: AudioServiceConfig = {
    defaultVolume: 0.3,
    fadeDuration: 800,
    enableLooping: true,
  };

  private constructor() {
    // Private constructor enforces singleton pattern
    // Don't initialize audio on server-side
    if (typeof window !== 'undefined') {
      // Delay initialization to ensure DOM is fully ready
      setTimeout(() => {
        this.initializeAudio();
      }, 0);
    }
  }

  private initializeAudio() {
    try {
      this.audioElement = new Audio();
      this.audioElement.loop = this.config.enableLooping;
      this.audioElement.volume = this.config.defaultVolume;
      this.audioElement.preload = 'auto';

      // Handle audio errors gracefully
      this.audioElement.addEventListener('error', (e) => {
        console.info('Audio file not found - add music files to public/music/');
      });

      // Handle audio end (if not looping)
      this.audioElement.addEventListener('ended', () => {
        this.currentTrack = null;
      });
      
      // Mark as initialized immediately since Audio element is created
      this.isInitialized = true;
    } catch (error) {
      console.warn('Failed to initialize audio system:', error);
      this.isInitialized = false;
    }
  }

  /**
   * Get singleton instance
   */
  static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  /**
   * Play a track with crossfade transition
   */
  async play(src: string, volume: number = this.config.defaultVolume): Promise<void> {
    // Wait briefly if not initialized yet (initialization is async via setTimeout)
    if (!this.isInitialized && typeof window !== 'undefined') {
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Final check - if still not ready, bail out silently
    if (!this.isInitialized || !this.audioElement) {
      return;
    }

    // If same track is already playing, don't restart
    if (this.currentTrack === src && !this.audioElement.paused) {
      return;
    }

    try {
      // Fade out current track
      if (!this.audioElement.paused) {
        await this.fadeOut();
      }

      // Load new track
      this.audioElement.src = src;
      this.audioElement.volume = 0;
      this.currentTrack = src;

      // Start playback
      await this.audioElement.play();

      // Fade in new track
      await this.fadeIn(volume);
    } catch (error) {
      // Silently fail if audio can't play (file doesn't exist, autoplay blocked, etc.)
      console.info(`Waiting for audio file: ${src.split('/').pop()}`);
      this.currentTrack = null;
    }
  }

  /**
   * Stop playback with fade out
   */
  async stop(): Promise<void> {
    if (!this.audioElement || this.audioElement.paused) {
      return;
    }

    await this.fadeOut();
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
    this.currentTrack = null;
  }

  /**
   * Pause playback without fade
   */
  pause(): void {
    if (this.audioElement && !this.audioElement.paused) {
      this.audioElement.pause();
    }
  }

  /**
   * Resume playback
   */
  async resume(): Promise<void> {
    if (this.audioElement && this.audioElement.paused && this.currentTrack) {
      try {
        await this.audioElement.play();
      } catch (error) {
        console.error('Failed to resume audio:', error);
      }
    }
  }

  /**
   * Set volume (0.0 to 1.0)
   */
  setVolume(volume: number): void {
    if (this.audioElement) {
      this.audioElement.volume = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Get current volume
   */
  getVolume(): number {
    return this.audioElement?.volume ?? this.config.defaultVolume;
  }

  /**
   * Check if audio is currently playing
   */
  isPlaying(): boolean {
    return this.audioElement ? !this.audioElement.paused : false;
  }

  /**
   * Get current track URL
   */
  getCurrentTrack(): string | null {
    return this.currentTrack;
  }

  /**
   * Fade out audio
   */
  private fadeOut(duration: number = this.config.fadeDuration): Promise<void> {
    return new Promise((resolve) => {
      if (!this.audioElement) {
        resolve();
        return;
      }

      const startVolume = this.audioElement.volume;
      
      // If already at 0, resolve immediately
      if (startVolume === 0) {
        resolve();
        return;
      }

      const steps = Math.ceil(duration / 50); // 50ms intervals
      const fadeStep = startVolume / steps;

      // Clear any existing fade
      if (this.fadeInterval) {
        clearInterval(this.fadeInterval);
      }

      this.fadeInterval = setInterval(() => {
        if (!this.audioElement) {
          if (this.fadeInterval) clearInterval(this.fadeInterval);
          resolve();
          return;
        }

        const newVolume = this.audioElement.volume - fadeStep;

        if (newVolume <= 0) {
          this.audioElement.volume = 0;
          if (this.fadeInterval) clearInterval(this.fadeInterval);
          this.fadeInterval = null;
          resolve();
        } else {
          this.audioElement.volume = newVolume;
        }
      }, 50);
    });
  }

  /**
   * Fade in audio
   */
  private fadeIn(targetVolume: number, duration: number = this.config.fadeDuration): Promise<void> {
    return new Promise((resolve) => {
      if (!this.audioElement) {
        resolve();
        return;
      }

      const steps = Math.ceil(duration / 50); // 50ms intervals
      const fadeStep = targetVolume / steps;

      // Clear any existing fade
      if (this.fadeInterval) {
        clearInterval(this.fadeInterval);
      }

      this.fadeInterval = setInterval(() => {
        if (!this.audioElement) {
          if (this.fadeInterval) clearInterval(this.fadeInterval);
          resolve();
          return;
        }

        const newVolume = this.audioElement.volume + fadeStep;

        if (newVolume >= targetVolume) {
          this.audioElement.volume = targetVolume;
          if (this.fadeInterval) clearInterval(this.fadeInterval);
          this.fadeInterval = null;
          resolve();
        } else {
          this.audioElement.volume = newVolume;
        }
      }, 50);
    });
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }

    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = '';
      this.audioElement.load(); // Force cleanup
      this.audioElement = null;
    }

    this.currentTrack = null;
    this.isInitialized = false;
  }

  /**
   * Update configuration
   */
  configure(config: Partial<AudioServiceConfig>): void {
    this.config = { ...this.config, ...config };
    
    if (this.audioElement && config.enableLooping !== undefined) {
      this.audioElement.loop = config.enableLooping;
    }
  }
}

// Export singleton instance
export const audioService = AudioService.getInstance();
