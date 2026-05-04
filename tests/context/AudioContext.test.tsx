import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AudioProvider, useAudio } from '@/lib/context/AudioContext';

vi.mock('@/lib/utils/assets', () => ({
  getAssetUrl: (url: string) => `mocked-${url}`
}));

describe('AudioContext', () => {
  let mockAudioElement: any;

  beforeEach(() => {
    mockAudioElement = {
      play: vi.fn().mockResolvedValue(undefined),
      pause: vi.fn(),
      volume: 1,
      loop: false,
      src: '',
    };
    vi.stubGlobal('Audio', vi.fn(function(url) { 
      if (url) mockAudioElement.src = url;
      return mockAudioElement; 
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AudioProvider>{children}</AudioProvider>
  );

  it('throws error if useAudio is used outside provider', () => {
    // Suppress console.error for this expected error
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useAudio())).toThrow('useAudio must be used within AudioProvider');
    consoleError.mockRestore();
  });

  it('provides default values', () => {
    const { result } = renderHook(() => useAudio(), { wrapper });
    
    expect(result.current.currentTrack).toBeNull();
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.isEnabled).toBe(false);
    expect(result.current.volume).toBe(0.3);
  });

  it('toggles audio on and off', () => {
    const { result } = renderHook(() => useAudio(), { wrapper });
    
    act(() => {
      result.current.toggleAudio();
    });
    
    expect(result.current.isEnabled).toBe(true);
    
    act(() => {
      result.current.toggleAudio();
    });
    
    expect(result.current.isEnabled).toBe(false);
  });

  it('sets volume', () => {
    const { result } = renderHook(() => useAudio(), { wrapper });
    
    act(() => {
      result.current.setVolume(0.8);
    });
    
    expect(result.current.volume).toBe(0.8);
  });

  it('plays track when enabled', async () => {
    const { result } = renderHook(() => useAudio(), { wrapper });
    
    act(() => {
      result.current.toggleAudio(); // Enable audio
    });
    
    await act(async () => {
      result.current.playTrack('/test.mp3', 'Test Song');
    });
    
    expect(result.current.currentTrack).toBe('Test Song');
    expect(result.current.isPlaying).toBe(true);
    expect(mockAudioElement.play).toHaveBeenCalled();
    expect(mockAudioElement.src).toContain('mocked-/test.mp3');
  });

  it('does not play track when disabled', () => {
    const { result } = renderHook(() => useAudio(), { wrapper });
    
    act(() => {
      result.current.playTrack('/test.mp3', 'Test Song');
    });
    
    expect(result.current.currentTrack).toBeNull();
    expect(mockAudioElement.play).not.toHaveBeenCalled();
  });

  it('stops track', async () => {
    const { result } = renderHook(() => useAudio(), { wrapper });
    
    act(() => {
      result.current.toggleAudio();
    });
    
    await act(async () => {
      result.current.playTrack('/test.mp3', 'Test Song');
    });
    
    act(() => {
      result.current.stopTrack();
    });
    
    expect(result.current.currentTrack).toBeNull();
    expect(result.current.isPlaying).toBe(false);
    expect(mockAudioElement.pause).toHaveBeenCalled();
  });

  it('stops track when toggling off', async () => {
    const { result } = renderHook(() => useAudio(), { wrapper });
    
    act(() => {
      result.current.toggleAudio(); // on
    });
    
    await act(async () => {
      result.current.playTrack('/test.mp3'); // Test without title
    });
    
    expect(result.current.currentTrack).toBe('/test.mp3');
    
    act(() => {
      result.current.toggleAudio(); // off
    });
    
    expect(result.current.currentTrack).toBeNull();
    expect(mockAudioElement.pause).toHaveBeenCalled();
  });

  it('updates volume on playing track', async () => {
    const { result } = renderHook(() => useAudio(), { wrapper });
    
    act(() => {
      result.current.toggleAudio(); // on
    });
    
    await act(async () => {
      result.current.playTrack('/test.mp3', 'Test Song');
    });
    
    act(() => {
      result.current.setVolume(0.5);
    });
    
    expect(mockAudioElement.volume).toBe(0.5);
  });
});
