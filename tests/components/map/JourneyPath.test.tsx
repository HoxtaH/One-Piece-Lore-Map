import { render, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { JourneyPath } from '@/components/map/JourneyPath';

const mockLocations = [
  { id: '1', name: 'Start', journeyOrder: 1, coordinates: { x: 0, y: 0 } },
  { id: '2', name: 'Middle', journeyOrder: 2, coordinates: { x: 100, y: 100 } },
  // Large gap between 2 and 3 to trigger timeskip (> 8000 distance)
  { id: '3', name: 'End', journeyOrder: 3, coordinates: { x: 10000, y: 10000 } } 
];

describe('JourneyPath', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders paths correctly', () => {
    const { container } = render(
      <svg>
        <JourneyPath 
          locations={mockLocations as any} 
          isPlaying={false} 
        />
      </svg>
    );

    const paths = container.querySelectorAll('path');
    // Expect 1 path for segment 1->2 (segment 2->3 is hidden timeskip)
    expect(paths.length).toBeGreaterThan(0);
  });

  it('animates and calls onProgressChange', () => {
    const mockOnProgress = vi.fn();
    const { container } = render(
      <svg>
        <JourneyPath 
          locations={mockLocations as any} 
          isPlaying={true} 
          onProgressChange={mockOnProgress}
        />
      </svg>
    );

    act(() => {
      vi.advanceTimersByTime(120000); // 2 minutes (full journey)
    });
    
    // Progress callback should be called multiple times during the animation tick
    expect(mockOnProgress).toHaveBeenCalled();
    // Should have timeskip label due to distance > 8000 after reaching progress
    expect(container.textContent).toContain('2-Year Timeskip');
  });

  it('returns null if less than 2 valid journey locations', () => {
    const { container } = render(
      <svg>
        <JourneyPath 
          locations={[mockLocations[0]] as any} 
          isPlaying={false} 
        />
      </svg>
    );
    
    expect(container.querySelector('g.journey-path-layer')).toBeNull();
  });
});
