import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LocationExploration from '@/components/exploration/LocationExploration';
import { useRouter } from 'next/navigation';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn()
}));

vi.mock('@/lib/hooks/useLocationAudio', () => ({
  useLocationAudio: vi.fn()
}));

const mockLocation = {
  id: '1',
  name: 'Loguetown',
  region: 'East Blue',
  description: 'The town of the beginning and the end.',
  history: 'History text',
  culture: 'Culture text',
  quickFacts: ['Fact 1'],
  economy: { industries: ['Weapons'], currency: 'Beli', tradeGoods: ['Swords'] },
  transportation: 'Ships',
  food: { cuisine: ['Fish'], traditions: ['Feast'], quirks: ['Salty'] },
  notablePeople: [],
  subLocations: [{ name: 'Execution Platform', type: 'Landmark', description: 'Where Roger died' }],
  items: [{ name: 'Sandai Kitetsu', category: 'Swords', description: 'Cursed sword' }],
  storyArcs: { mangaChapters: '96-100', animeEpisodes: '48-53', events: ['Luffy execution attempt'] },
  videos: [{ youtubeId: 'abc', featured: true, title: 'Video Title', type: 'lore' }],
  images: [],
  colorScheme: { primary: '#000', secondary: '#fff', accent: '#f00' }
};

describe('LocationExploration', () => {
  it('renders location data and default tab (overview)', () => {
    render(<LocationExploration location={mockLocation as any} />);
    
    expect(screen.getByText('Loguetown')).toBeInTheDocument();
    expect(screen.getByText('The town of the beginning and the end.')).toBeInTheDocument();
    expect(screen.getByText('History text')).toBeInTheDocument();
    expect(screen.getByText('Fact 1')).toBeInTheDocument();
  });

  it('switches to World & Culture tab', async () => {
    render(<LocationExploration location={mockLocation as any} />);
    
    const worldTab = screen.getByRole('button', { name: /World & Culture/i });
    fireEvent.click(worldTab);
    
    expect(await screen.findByText('Culture text')).toBeInTheDocument();
    expect(screen.getByText('Fish')).toBeInTheDocument();
  });

  it('switches to Economy & Trade tab', async () => {
    render(<LocationExploration location={mockLocation as any} />);
    
    const economyTab = screen.getByRole('button', { name: /Economy & Trade/i });
    fireEvent.click(economyTab);
    
    expect(await screen.findByText(/Weapons/)).toBeInTheDocument();
    expect(screen.getByText('Beli')).toBeInTheDocument();
  });

  it('switches to Places tab', async () => {
    render(<LocationExploration location={mockLocation as any} />);
    
    const placesTab = screen.getByRole('button', { name: /Places/i });
    fireEvent.click(placesTab);
    
    expect(await screen.findByText('Execution Platform')).toBeInTheDocument();
  });

  it('switches to Items tab', async () => {
    render(<LocationExploration location={mockLocation as any} />);
    
    const itemsTab = screen.getByRole('button', { name: /Items/i });
    fireEvent.click(itemsTab);
    
    expect(await screen.findByText('Sandai Kitetsu')).toBeInTheDocument();
  });

  it('switches to Story Timeline tab', async () => {
    render(<LocationExploration location={mockLocation as any} />);
    
    const timelineTab = screen.getByRole('button', { name: /Story Timeline/i });
    fireEvent.click(timelineTab);
    
    expect(await screen.findByText('96-100')).toBeInTheDocument();
    expect(screen.getByText('Luffy execution attempt')).toBeInTheDocument();
  });

  it('goes back to map when return button is clicked', () => {
    const pushMock = vi.fn();
    (useRouter as any).mockReturnValue({ push: pushMock });

    render(<LocationExploration location={mockLocation as any} />);
    
    const returnBtn = screen.getByText(/Return/i);
    fireEvent.click(returnBtn);
    
    expect(pushMock).toHaveBeenCalledWith('/');
  });
});
