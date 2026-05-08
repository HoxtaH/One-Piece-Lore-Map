import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CharacterCard from '@/components/characters/CharacterCard';

const mockCharacter = {
  id: '1',
  name: 'Monkey D. Luffy',
  role: 'Captain',
  description: 'The man who will become the Pirate King.',
  type: 'protagonist' as const,
  faction: 'Straw Hat Pirates',
  tags: ['Gum-Gum Fruit', 'Haki', 'Supernova', 'D. Clan']
};

const mockColorScheme = {
  primary: '#ff0000',
  secondary: '#00ff00',
  accent: '#0000ff'
};

describe('CharacterCard', () => {
  it('renders character details correctly', () => {
    const mockOnClick = vi.fn();
    render(
      <CharacterCard 
        character={mockCharacter} 
        colorScheme={mockColorScheme} 
        onClick={mockOnClick} 
      />
    );

    expect(screen.getByText('Monkey D. Luffy')).toBeInTheDocument();
    expect(screen.getByText('Captain')).toBeInTheDocument();
    expect(screen.getByText('The man who will become the Pirate King.')).toBeInTheDocument();
    expect(screen.getByText('Straw Hat Pirates')).toBeInTheDocument();
    expect(screen.getByText('WANTED')).toBeInTheDocument();
    expect(screen.getByText('ALIVE')).toBeInTheDocument();
  });

  it('renders tags correctly and truncates if more than 3', () => {
    render(
      <CharacterCard 
        character={mockCharacter} 
        colorScheme={mockColorScheme} 
        onClick={vi.fn()} 
      />
    );

    expect(screen.getByText('Gum-Gum Fruit')).toBeInTheDocument();
    expect(screen.getByText('Haki')).toBeInTheDocument();
    expect(screen.getByText('Supernova')).toBeInTheDocument();
    // Fourth tag should be replaced by +1
    expect(screen.queryByText('D. Clan')).not.toBeInTheDocument();
    expect(screen.getByText('+1')).toBeInTheDocument();
  });

  it('calls onClick when the card is clicked', () => {
    const mockOnClick = vi.fn();
    const { container } = render(
      <CharacterCard 
        character={mockCharacter} 
        colorScheme={mockColorScheme} 
        onClick={mockOnClick} 
      />
    );

    // Click the main wrapper div
    fireEvent.click(container.firstChild as HTMLElement);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('displays correct wanted status for antagonists', () => {
    const antagonist = { ...mockCharacter, type: 'antagonist' as const };
    render(
      <CharacterCard 
        character={antagonist} 
        colorScheme={mockColorScheme} 
        onClick={vi.fn()} 
      />
    );

    expect(screen.getByText('DEAD OR ALIVE')).toBeInTheDocument();
  });
});
