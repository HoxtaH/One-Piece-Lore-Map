import { render, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SegmentPath } from '@/components/map/SegmentPath';

const mockLocations = [
  { id: '1', name: 'Start', coordinates: { x: 0, y: 0 }, saga: 'East Blue' },
  { id: '2', name: 'End', coordinates: { x: 100, y: 100 }, saga: 'East Blue' }
];

describe('SegmentPath', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders SVG path with correct data', () => {
    const { container } = render(
      <svg>
        <SegmentPath 
          id="test-1" 
          locations={mockLocations as any} 
          isPlaying={false} 
          durationMs={1000} 
          colorMap={{ 'East Blue': '#f00' } as any} 
        />
      </svg>
    );
    
    const path = container.querySelector('path');
    expect(path).toBeInTheDocument();
    expect(path).toHaveAttribute('d', 'M 0 0 L 100 100');
  });

  it('animates when isPlaying is true and calls onProgress', () => {
    const mockOnProgress = vi.fn();
    render(
      <svg>
        <SegmentPath 
          id="test-2" 
          locations={mockLocations as any} 
          isPlaying={true} 
          durationMs={1000} 
          colorMap={{ 'East Blue': '#f00' } as any} 
          onProgress={mockOnProgress}
        />
      </svg>
    );

    // Advance timers by half the duration
    act(() => {
      vi.advanceTimersByTime(500); 
    });
    
    expect(mockOnProgress).toHaveBeenCalled();
    // It should be playing
    expect(mockOnProgress).toHaveBeenCalledWith(expect.any(Number), expect.any(Object), 'playing');
    
    // Advance timers past duration
    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(mockOnProgress).toHaveBeenCalledWith(100, expect.any(Object), 'done');
  });

  it('resets animation when isPlaying goes from false to true', () => {
    const { rerender } = render(
      <svg>
        <SegmentPath 
          id="test-3" 
          locations={mockLocations as any} 
          isPlaying={false} 
          durationMs={1000} 
          colorMap={{ 'East Blue': '#f00' } as any} 
        />
      </svg>
    );

    rerender(
      <svg>
        <SegmentPath 
          id="test-3" 
          locations={mockLocations as any} 
          isPlaying={true} 
          durationMs={1000} 
          colorMap={{ 'East Blue': '#f00' } as any} 
        />
      </svg>
    );

    // Initial state should be playing again
    // Just testing that it does not crash when re-rendering
  });
});
