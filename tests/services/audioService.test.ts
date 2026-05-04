import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { audioService } from '@/lib/services/audioService';

vi.mock('@/lib/utils/assets', () => ({
  getAssetUrl: (url: string) => `mocked-${url}`
}));

describe('audioService', () => {
  let mockAudioElement: any;

  beforeEach(() => {
    vi.useFakeTimers();

    mockAudioElement = {
      play: vi.fn().mockResolvedValue(undefined),
      pause: vi.fn(),
      load: vi.fn(),
      addEventListener: vi.fn(),
      volume: 1,
      paused: true,
      src: '',
      currentTime: 0,
    };

    // Inject the mock directly into the singleton
    (audioService as any).audioElement = mockAudioElement;
    (audioService as any).isInitialized = true;
    (audioService as any).currentTrack = null;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('initializes and plays track', async () => {
    // Trigger play
    const playPromise = audioService.play('test.mp3');
    
    // Let the microtask queue clear so setInterval starts
    await Promise.resolve();
    await Promise.resolve();
    
    // Fast forward through fade in setIntervals
    vi.runAllTimers();
    await playPromise;

    expect(mockAudioElement.src).toBe('mocked-test.mp3');
    expect(mockAudioElement.play).toHaveBeenCalled();
  });

  it('stops track', async () => {
    // Set to playing so stop() will trigger fadeOut
    mockAudioElement.paused = false;
    
    const stopPromise = audioService.stop();
    
    // Let the microtask queue clear
    await Promise.resolve();
    await Promise.resolve();

    vi.runAllTimers();
    await stopPromise;
    
    expect(mockAudioElement.pause).toHaveBeenCalled();
    expect(audioService.getCurrentTrack()).toBeNull();
  });

  it('pauses track without fade', async () => {
    mockAudioElement.paused = false;
    audioService.pause();
    
    expect(mockAudioElement.pause).toHaveBeenCalled();
  });

  it('resumes track', async () => {
    // Setup a current track but make it paused
    const playPromise = audioService.play('test.mp3');
    await Promise.resolve();
    await Promise.resolve();
    vi.runAllTimers();
    await playPromise;
    
    mockAudioElement.paused = true;
    
    const resumePromise = audioService.resume();
    await Promise.resolve();
    await Promise.resolve();
    vi.runAllTimers();
    await resumePromise;
    
    expect(mockAudioElement.play).toHaveBeenCalledTimes(2); // once from play, once from resume
  });

  it('can set and get volume', async () => {
    audioService.setVolume(0.5);
    expect(mockAudioElement.volume).toBe(0.5);
    expect(audioService.getVolume()).toBe(0.5);
  });

  it('can configure looping', async () => {
    audioService.configure({ enableLooping: false });
    expect(mockAudioElement.loop).toBe(false);
  });

  it('can cleanup', async () => {
    audioService.cleanup();
    expect(mockAudioElement.pause).toHaveBeenCalled();
    expect(mockAudioElement.load).toHaveBeenCalled();
  });
});
