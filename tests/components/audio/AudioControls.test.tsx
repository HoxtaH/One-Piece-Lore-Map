import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AudioControls from '@/components/audio/AudioControls';
import * as AudioContextModule from '@/lib/context/AudioContext';

vi.mock('@/lib/context/AudioContext', () => ({
  useAudio: vi.fn(),
}));

describe('AudioControls', () => {
  const mockToggleAudio = vi.fn();
  const mockSetVolume = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(AudioContextModule.useAudio).mockReturnValue({
      isEnabled: true,
      volume: 0.5,
      currentTrack: 'Test Track',
      isPlaying: true,
      toggleAudio: mockToggleAudio,
      setVolume: mockSetVolume,
      playTrack: vi.fn(),
      stopTrack: vi.fn(),
    });
  });

  it('renders correctly when enabled', () => {
    render(<AudioControls />);
    expect(screen.getByText('Music On')).toBeInTheDocument();
    expect(screen.getByText('Test Track')).toBeInTheDocument();
  });

  it('renders correctly when disabled', () => {
    vi.mocked(AudioContextModule.useAudio).mockReturnValue({
      isEnabled: false,
      volume: 0.5,
      currentTrack: '',
      isPlaying: false,
      toggleAudio: mockToggleAudio,
      setVolume: mockSetVolume,
      playTrack: vi.fn(),
      stopTrack: vi.fn(),
    });

    render(<AudioControls />);
    expect(screen.getByText('Enable Music')).toBeInTheDocument();
    expect(screen.getByText(/Experience the Grand Line with music!/i)).toBeInTheDocument();
  });

  it('calls toggleAudio when main button is clicked', () => {
    render(<AudioControls />);
    fireEvent.click(screen.getByText('Music On'));
    expect(mockToggleAudio).toHaveBeenCalled();
  });

  it('opens settings panel and changes volume', () => {
    render(<AudioControls />);
    
    // Open settings
    const settingsButton = screen.getByTitle('Audio Settings');
    fireEvent.click(settingsButton);
    
    // Check volume slider exists
    const slider = screen.getByRole('slider');
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveValue('50'); // 0.5 * 100
    
    // Change volume
    fireEvent.change(slider, { target: { value: '75' } });
    expect(mockSetVolume).toHaveBeenCalledWith(0.75);
  });

  it('mutes audio when volume icon is clicked', () => {
    render(<AudioControls />);
    
    // Open settings
    fireEvent.click(screen.getByTitle('Audio Settings'));
    
    // Click mute
    const muteButton = screen.getByTitle('Mute');
    fireEvent.click(muteButton);
    expect(mockSetVolume).toHaveBeenCalledWith(0);
  });
});
