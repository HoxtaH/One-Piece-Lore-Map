import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { JourneyControls } from '@/components/map/JourneyControls';

describe('JourneyControls', () => {
  const defaultProps = {
    showJourneyPath: false,
    isPlaying: false,
    isCameraLocked: false,
    progress: 0,
    currentLocation: null,
    onToggleJourney: vi.fn(),
    onPlay: vi.fn(),
    onRestart: vi.fn(),
    onToggleCameraLock: vi.fn(),
  };

  it('renders only the show journey button when path is hidden', () => {
    render(<JourneyControls {...defaultProps} />);
    expect(screen.getByText('🗺️ Show Journey')).toBeInTheDocument();
    expect(screen.queryByText('▶️ Play')).not.toBeInTheDocument();
  });

  it('renders full controls when path is shown', () => {
    render(<JourneyControls {...defaultProps} showJourneyPath={true} />);
    expect(screen.getByText('🗺️ Hide Journey')).toBeInTheDocument();
    expect(screen.getByText('▶️ Play')).toBeInTheDocument();
    expect(screen.getByText('⏮️ Restart')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('displays correct play/pause state', () => {
    const { rerender } = render(<JourneyControls {...defaultProps} showJourneyPath={true} isPlaying={false} />);
    expect(screen.getByText('▶️ Play')).toBeInTheDocument();

    rerender(<JourneyControls {...defaultProps} showJourneyPath={true} isPlaying={true} />);
    expect(screen.getByText('⏸️ Pause')).toBeInTheDocument();
  });

  it('displays current location name when provided', () => {
    const mockLocation = { id: '1', name: 'Alabasta', slug: 'alabasta', description: '' };
    render(
      <JourneyControls 
        {...defaultProps} 
        showJourneyPath={true} 
        currentLocation={mockLocation as any} 
      />
    );
    expect(screen.getByText('Now at:')).toBeInTheDocument();
    expect(screen.getByText('Alabasta')).toBeInTheDocument();
  });

  it('calls correct callback functions on button clicks', () => {
    render(<JourneyControls {...defaultProps} showJourneyPath={true} />);
    
    fireEvent.click(screen.getByText('🗺️ Hide Journey'));
    expect(defaultProps.onToggleJourney).toHaveBeenCalled();

    fireEvent.click(screen.getByText('▶️ Play'));
    expect(defaultProps.onPlay).toHaveBeenCalled();

    fireEvent.click(screen.getByText('⏮️ Restart'));
    expect(defaultProps.onRestart).toHaveBeenCalled();

    fireEvent.click(screen.getByText('🔓'));
    expect(defaultProps.onToggleCameraLock).toHaveBeenCalled();
  });
});
