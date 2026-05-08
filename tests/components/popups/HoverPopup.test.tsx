import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HoverPopup from '@/components/popups/HoverPopup';

const mockLocation = {
  id: '1',
  name: 'Water 7',
  slug: 'water-7',
  region: 'Paradise',
  colorScheme: { primary: '#00aaff', secondary: '#ffffff', accent: '#0055aa' },
  coordinates: [{ x: 500, y: 500 }],
  quickFacts: [
    'The City of Water',
    'Famous for shipbuilding',
    'Home of the Galley-La Company'
  ],
  isVisited: false
};

describe('HoverPopup', () => {
  it('renders location name and region', () => {
    render(
      <HoverPopup
        location={mockLocation as any}
        position={{ x: 100, y: 100 }}
      />
    );
    
    expect(screen.getByText('Water 7')).toBeInTheDocument();
    expect(screen.getByText('Paradise')).toBeInTheDocument();
  });

  it('renders quick facts', () => {
    render(
      <HoverPopup
        location={mockLocation as any}
        position={{ x: 100, y: 100 }}
      />
    );
    
    // Facts are shuffled and sliced to 3, but since we only provided 3, they should all be there
    expect(screen.getByText('The City of Water')).toBeInTheDocument();
    expect(screen.getByText('Famous for shipbuilding')).toBeInTheDocument();
    expect(screen.getByText('Home of the Galley-La Company')).toBeInTheDocument();
  });

  it('renders call to action text', () => {
    render(
      <HoverPopup
        location={mockLocation as any}
        position={{ x: 100, y: 100 }}
      />
    );
    
    expect(screen.getByText('⚓ Click to explore Water 7 ⚓')).toBeInTheDocument();
  });
});
