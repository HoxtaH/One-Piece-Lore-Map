import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MapHotspot from '@/components/map/MapHotspot';

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockLocation = {
  id: '1',
  name: 'Loguetown',
  slug: 'loguetown',
  region: 'East Blue',
  colorScheme: { primary: '#000000', secondary: '#ffffff', accent: '#ff0000' },
  coordinates: [{ x: 100, y: 100 }],
  quickFacts: ['Known as the town of the beginning and the end'],
  isVisited: false
};

describe('MapHotspot', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders without crashing inside an svg wrapper', () => {
    const onMouseEnter = vi.fn();
    const onMouseLeave = vi.fn();

    const { container } = render(
      <svg>
        <MapHotspot
          location={mockLocation as any}
          coordinates={{ x: 100, y: 200 }}
          showHotspot={true}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
      </svg>
    );

    const mainCircle = container.querySelector('circle.cursor-pointer');
    expect(mainCircle).toBeInTheDocument();
  });

  it('calls router.push when clicked', () => {
    const { container } = render(
      <svg>
        <MapHotspot
          location={mockLocation as any}
          coordinates={{ x: 100, y: 200 }}
          showHotspot={true}
          onMouseEnter={vi.fn()}
          onMouseLeave={vi.fn()}
        />
      </svg>
    );

    const mainCircle = container.querySelector('circle.cursor-pointer');
    if (mainCircle) {
      fireEvent.click(mainCircle);
    }
    
    expect(mockPush).toHaveBeenCalledWith('/locations/loguetown');
  });

  it('calls onMouseEnter and onMouseLeave events', () => {
    const onMouseEnter = vi.fn();
    const onMouseLeave = vi.fn();

    const { container } = render(
      <svg>
        <MapHotspot
          location={mockLocation as any}
          coordinates={{ x: 100, y: 200 }}
          showHotspot={true}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
      </svg>
    );

    const mainCircle = container.querySelector('circle.cursor-pointer');
    if (mainCircle) {
      fireEvent.mouseEnter(mainCircle);
      expect(onMouseEnter).toHaveBeenCalled();
      
      fireEvent.mouseLeave(mainCircle);
      expect(onMouseLeave).toHaveBeenCalled();
    }
  });
});
