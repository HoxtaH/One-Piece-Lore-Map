import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import WorldMap from '@/components/map/WorldMap';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() })
}));

// Mock the audio hook
vi.mock('@/lib/hooks/useMapAudio', () => ({
  useMapAudio: vi.fn(),
}));

// Mock JourneyPath to simplify testing
vi.mock('@/components/map/JourneyPath', () => ({
  JourneyPath: () => <g data-testid="journey-path"></g>
}));

// Mock AudioControls to simplify testing
vi.mock('@/components/audio/AudioControls', () => ({
  __esModule: true,
  default: () => <div data-testid="audio-controls"></div>
}));

const mockLocations = [
  {
    id: '1',
    name: 'Loguetown',
    slug: 'loguetown',
    region: 'East Blue',
    colorScheme: { primary: '#000', secondary: '#fff', accent: '#f00' },
    coordinates: [{ x: 100, y: 100 }],
    quickFacts: ['Fact 1']
  }
];

describe('WorldMap', () => {
  it('renders map image and locations', () => {
    render(<WorldMap locations={mockLocations as any} />);
    
    expect(screen.getByAltText(/One Piece World Map - Pixel Art/i)).toBeInTheDocument();
    expect(screen.getByText('One Piece World Map')).toBeInTheDocument();
  });

  it('handles zooming in and out via buttons', () => {
    render(<WorldMap locations={mockLocations as any} />);
    
    const zoomInBtn = screen.getByTitle('Zoom In');
    const zoomOutBtn = screen.getByTitle('Zoom Out');
    
    // Default is 100%
    expect(screen.getByText('100%')).toBeInTheDocument();
    
    fireEvent.click(zoomInBtn);
    expect(screen.getByText('121%')).toBeInTheDocument(); // 1 + 0.21
    
    fireEvent.click(zoomOutBtn);
    expect(screen.getByText('100%')).toBeInTheDocument(); // back to 1
  });

  it('resets view', () => {
    render(<WorldMap locations={mockLocations as any} />);
    
    const zoomInBtn = screen.getByTitle('Zoom In');
    const resetBtn = screen.getByTitle('Reset View');
    
    fireEvent.click(zoomInBtn);
    fireEvent.click(zoomInBtn);
    expect(screen.getByText('142%')).toBeInTheDocument();
    
    fireEvent.click(resetBtn);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('toggles journey controls', () => {
    render(<WorldMap locations={mockLocations as any} />);
    
    const showJourneyBtn = screen.getAllByRole('button', { name: /Show Journey/i })[0];
    fireEvent.click(showJourneyBtn);
    
    expect(screen.getByTestId('journey-path')).toBeInTheDocument();
  });

  it('handles dragging map', () => {
    const { container } = render(<WorldMap locations={mockLocations as any} />);
    const mapContainer = container.firstChild as HTMLElement;
    
    // Mouse down to start dragging
    fireEvent.mouseDown(mapContainer, { clientX: 100, clientY: 100, button: 0 });
    // Mouse move to drag
    fireEvent.mouseMove(mapContainer, { clientX: 150, clientY: 150 });
    // Mouse up to stop
    fireEvent.mouseUp(mapContainer);
    // Mouse leave
    fireEvent.mouseLeave(mapContainer);
  });

  it('handles double click zoom', () => {
    const { container } = render(<WorldMap locations={mockLocations as any} />);
    const mapContainer = container.firstChild as HTMLElement;
    
    // Double click to max zoom
    fireEvent.doubleClick(mapContainer, { clientX: 100, clientY: 100 });
    expect(screen.getByText('1000%')).toBeInTheDocument(); // MAX_SCALE is 10
    
    // Double click again to reset
    fireEvent.doubleClick(mapContainer, { clientX: 100, clientY: 100 });
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('handles coordinate finder mode via keyboard shortcut', () => {
    const { container } = render(<WorldMap locations={mockLocations as any} />);
    
    // Press Ctrl+Shift+C
    fireEvent.keyDown(window, { key: 'C', ctrlKey: true, shiftKey: true });
    expect(screen.getByText(/COORDINATE FINDER MODE/)).toBeInTheDocument();
    
    // Click SVG
    const svg = container.querySelector('svg');
    if (svg) {
      fireEvent.click(svg, { clientX: 100, clientY: 100 });
    }
    
    // Press Ctrl+Shift+C to exit
    fireEvent.keyDown(window, { key: 'C', ctrlKey: true, shiftKey: true });
    expect(screen.queryByText(/COORDINATE FINDER MODE/)).not.toBeInTheDocument();
  });

  it('handles hotspot toggle via keyboard shortcut', () => {
    render(<WorldMap locations={mockLocations as any} />);
    
    // Press Ctrl+Shift+H
    fireEvent.keyDown(window, { key: 'H', ctrlKey: true, shiftKey: true });
    expect(screen.getByText(/HOTSPOTS VISIBLE/)).toBeInTheDocument();
    
    // Press Ctrl+Shift+H again
    fireEvent.keyDown(window, { key: 'H', ctrlKey: true, shiftKey: true });
    expect(screen.queryByText(/HOTSPOTS VISIBLE/)).not.toBeInTheDocument();
  });

  it('handles hover over location', () => {
    const { container } = render(<WorldMap locations={mockLocations as any} />);
    
    // The hotspot is the second circle element in the g tag (or the only one if showHotspot is false)
    const circles = container.querySelectorAll('circle');
    const mainHotspot = circles[0]; // The transparent interaction circle
    
    fireEvent.mouseEnter(mainHotspot, { clientX: 100, clientY: 100 });
    // Should show HoverPopup with Loguetown name
    expect(screen.getByText('Loguetown')).toBeInTheDocument();
    
    fireEvent.mouseLeave(mainHotspot);
    expect(screen.queryByText('Loguetown')).not.toBeInTheDocument();
  });
});
