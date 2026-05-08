import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useMapAudio } from '@/lib/hooks/useMapAudio';
import * as AudioContextModule from '@/lib/context/AudioContext';

describe('useMapAudio', () => {
  const mockPlayTrack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(AudioContextModule, 'useAudio').mockReturnValue({
      isEnabled: true,
      playTrack: mockPlayTrack,
    } as any);
  });

  it('plays map theme when enabled', () => {
    renderHook(() => useMapAudio());
    expect(mockPlayTrack).toHaveBeenCalledWith('/music/world-map-theme.mp3', 'To the Grand Line');
  });

  it('does not play map theme when disabled', () => {
    vi.spyOn(AudioContextModule, 'useAudio').mockReturnValue({
      isEnabled: false,
      playTrack: mockPlayTrack,
    } as any);
    renderHook(() => useMapAudio());
    expect(mockPlayTrack).not.toHaveBeenCalled();
  });
});
