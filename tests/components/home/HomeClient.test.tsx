import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HomeClient from '@/components/home/HomeClient';

// Mock child components
vi.mock('@/components/map/WorldMap', () => ({
  default: ({ locations }: any) => <div data-testid="world-map">Map Locations: {locations.length}</div>
}));

vi.mock('@/components/news/NewsCooIcon', () => ({
  default: ({ onClick }: any) => <button data-testid="news-coo-icon" onClick={onClick}>News Coo</button>
}));

vi.mock('@/components/news/NewsPanel', () => ({
  default: ({ isOpen, onClose }: any) => isOpen ? (
    <div data-testid="news-panel">
      News Panel
      <button onClick={onClose}>Close</button>
    </div>
  ) : null
}));

describe('HomeClient', () => {
  const mockLocations = [
    { id: '1', slug: 'l1', name: 'Location 1', region: 'East Blue', coordinates: { x: 0, y: 0 } },
  ];

  it('renders child components', () => {
    render(<HomeClient locations={mockLocations as any} />);
    
    expect(screen.getByTestId('world-map')).toHaveTextContent('Map Locations: 1');
    expect(screen.getByTestId('news-coo-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('news-panel')).not.toBeInTheDocument();
  });

  it('handles null locations gracefully', () => {
    render(<HomeClient locations={null as any} />);
    
    expect(screen.getByTestId('world-map')).toHaveTextContent('Map Locations: 0');
  });

  it('opens and closes news panel', () => {
    render(<HomeClient locations={mockLocations as any} />);
    
    // Open panel
    fireEvent.click(screen.getByTestId('news-coo-icon'));
    expect(screen.getByTestId('news-panel')).toBeInTheDocument();
    
    // Close panel
    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByTestId('news-panel')).not.toBeInTheDocument();
  });
});
