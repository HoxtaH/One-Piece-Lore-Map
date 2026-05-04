import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useLocationAudio } from '@/lib/hooks/useLocationAudio';
import * as AudioContextModule from '@/lib/context/AudioContext';

describe('useLocationAudio', () => {
  const mockPlayTrack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(AudioContextModule, 'useAudio').mockReturnValue({
      isEnabled: true,
      playTrack: mockPlayTrack,
    } as any);
  });

  it('plays track when enabled and autoPlay is true', () => {
    renderHook(() => useLocationAudio({ musicUrl: '/test.mp3', musicTitle: 'Test Song' }));
    expect(mockPlayTrack).toHaveBeenCalledWith('/test.mp3', 'Test Song');
  });

  it('does not play track when audio is disabled', () => {
    vi.spyOn(AudioContextModule, 'useAudio').mockReturnValue({
      isEnabled: false,
      playTrack: mockPlayTrack,
    } as any);
    renderHook(() => useLocationAudio({ musicUrl: '/test.mp3', musicTitle: 'Test Song' }));
    expect(mockPlayTrack).not.toHaveBeenCalled();
  });

  it('does not play track when autoPlay is false', () => {
    renderHook(() => useLocationAudio({ musicUrl: '/test.mp3', musicTitle: 'Test Song', autoPlay: false }));
    expect(mockPlayTrack).not.toHaveBeenCalled();
  });

  it('does not play track when no url is provided', () => {
    renderHook(() => useLocationAudio({ musicTitle: 'No Song' }));
    expect(mockPlayTrack).not.toHaveBeenCalled();
  });
});
