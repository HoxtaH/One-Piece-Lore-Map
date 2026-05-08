import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CharacterGrid from '@/components/characters/CharacterGrid';

const mockCharacters = [
  {
    id: '1',
    name: 'Monkey D. Luffy',
    role: 'Captain',
    description: 'The man who will become the Pirate King.',
    type: 'protagonist' as const,
    faction: 'Straw Hat Pirates',
    tags: ['Gum-Gum Fruit', 'Haki']
  },
  {
    id: '2',
    name: 'Kaido',
    role: 'Emperor',
    description: 'Strongest creature.',
    type: 'antagonist' as const,
    faction: 'Beasts Pirates',
    tags: ['Mythical Zoan']
  }
];

const mockColorScheme = {
  primary: '#ff0000',
  secondary: '#00ff00',
  accent: '#0000ff'
};

describe('CharacterGrid', () => {
  it('renders all characters initially', () => {
    render(
      <CharacterGrid 
        characters={mockCharacters} 
        colorScheme={mockColorScheme} 
        onCharacterClick={vi.fn()} 
      />
    );
    expect(screen.getByText('Monkey D. Luffy')).toBeInTheDocument();
    expect(screen.getByText('Kaido')).toBeInTheDocument();
    expect(screen.getByText('Showing 2 of 2 characters')).toBeInTheDocument();
  });

  it('filters characters by search query', async () => {
    render(
      <CharacterGrid 
        characters={mockCharacters} 
        colorScheme={mockColorScheme} 
        onCharacterClick={vi.fn()} 
      />
    );
    
    const searchInput = screen.getByPlaceholderText(/Search characters/i);
    fireEvent.change(searchInput, { target: { value: 'Kaido' } });

    await waitFor(() => {
      expect(screen.queryByText('Monkey D. Luffy')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Kaido')).toBeInTheDocument();
    expect(screen.getByText('Showing 1 of 2 characters')).toBeInTheDocument();
  });

  it('filters characters by type', async () => {
    render(
      <CharacterGrid 
        characters={mockCharacters} 
        colorScheme={mockColorScheme} 
        onCharacterClick={vi.fn()} 
      />
    );
    
    // Instead of getByRole with exact name, find the visible text and click its closest button
    const protagonistFilter = screen.getByText('Protagonists');
    fireEvent.click(protagonistFilter);

    await waitFor(() => {
      expect(screen.queryByText('Kaido')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Monkey D. Luffy')).toBeInTheDocument();
  });

  it('filters characters by faction', async () => {
    render(
      <CharacterGrid 
        characters={mockCharacters} 
        colorScheme={mockColorScheme} 
        onCharacterClick={vi.fn()} 
      />
    );
    
    const beastsPiratesFilter = screen.getByRole('button', { name: /Beasts Pirates/i });
    fireEvent.click(beastsPiratesFilter);

    await waitFor(() => {
      expect(screen.queryByText('Monkey D. Luffy')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Kaido')).toBeInTheDocument();
  });

  it('shows no results message when no characters match', async () => {
    render(
      <CharacterGrid 
        characters={mockCharacters} 
        colorScheme={mockColorScheme} 
        onCharacterClick={vi.fn()} 
      />
    );
    
    const searchInput = screen.getByPlaceholderText(/Search characters/i);
    fireEvent.change(searchInput, { target: { value: 'Zoro' } });

    await waitFor(() => {
      expect(screen.getByText('No characters found')).toBeInTheDocument();
    });
    expect(screen.getByText('Try adjusting your search or filters')).toBeInTheDocument();
  });
});
