import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { JourneyControls } from '@/components/map/JourneyControls';

// Mock JourneyPath to simplify testing
vi.mock('@/components/map/JourneyPath', () => ({
  JourneyPath: () => <g data-testid="journey-path"></g>
}));

// Mock AudioControls to simplify testing
vi.mock('@/components/audio/AudioControls', () => ({
  __esModule: true,
  default: () => <div data-testid="audio-controls"></div>
}));

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
    expect(screen.getByText(/Show Journey/i)).toBeInTheDocument();
    expect(screen.queryByText(/Play/i)).not.toBeInTheDocument();
  });

  it('renders full controls when path is shown', () => {
    render(<JourneyControls {...defaultProps} showJourneyPath={true} />);
    expect(screen.getByText(/Hide Journey/i)).toBeInTheDocument();
    expect(screen.getByText(/Play/i)).toBeInTheDocument();
    expect(screen.getByText(/Restart/i)).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('displays correct play/pause state', () => {
    const { rerender } = render(<JourneyControls {...defaultProps} showJourneyPath={true} isPlaying={false} />);
    expect(screen.getByText(/Play/i)).toBeInTheDocument();

    rerender(<JourneyControls {...defaultProps} showJourneyPath={true} isPlaying={true} />);
    expect(screen.getByText(/Pause/i)).toBeInTheDocument();
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
    
    fireEvent.click(screen.getByText(/Hide Journey/i));
    expect(defaultProps.onToggleJourney).toHaveBeenCalled();

    fireEvent.click(screen.getByText(/Play/i));
    expect(defaultProps.onPlay).toHaveBeenCalled();

    fireEvent.click(screen.getByText(/Restart/i));
    expect(defaultProps.onRestart).toHaveBeenCalled();

    fireEvent.click(screen.getByText('🔓'));
    expect(defaultProps.onToggleCameraLock).toHaveBeenCalled();
  });
});
