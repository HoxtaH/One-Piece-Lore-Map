import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CharacterModal from '@/components/characters/CharacterModal';

const mockCharacter = {
  id: '1',
  name: 'Monkey D. Luffy',
  role: 'Captain',
  description: 'The man who will become the Pirate King.',
  type: 'protagonist' as const,
  faction: 'Straw Hat Pirates',
  tags: ['Gum-Gum Fruit', 'Haki']
};

const mockColorScheme = {
  primary: '#ff0000',
  secondary: '#00ff00',
  accent: '#0000ff'
};

describe('CharacterModal', () => {
  it('does not render when character is null', () => {
    const { container } = render(
      <CharacterModal 
        character={null} 
        colorScheme={mockColorScheme} 
        onClose={vi.fn()} 
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders character details when character is provided', () => {
    render(
      <CharacterModal 
        character={mockCharacter} 
        colorScheme={mockColorScheme} 
        onClose={vi.fn()} 
      />
    );

    expect(screen.getByText('Monkey D. Luffy')).toBeInTheDocument();
    expect(screen.getByText('Captain')).toBeInTheDocument();
    expect(screen.getByText('The man who will become the Pirate King.')).toBeInTheDocument();
    expect(screen.getAllByText('Straw Hat Pirates').length).toBeGreaterThan(0);
    expect(screen.getByText('Gum-Gum Fruit')).toBeInTheDocument();
  });

  it('calls onClose when close buttons are clicked', () => {
    const mockOnClose = vi.fn();
    render(
      <CharacterModal 
        character={mockCharacter} 
        colorScheme={mockColorScheme} 
        onClose={mockOnClose} 
      />
    );

    // There are two close buttons (top right X and bottom button)
    const closeButtons = screen.getAllByRole('button');
    // Top right X is index 0, Bottom button is index 1
    fireEvent.click(closeButtons[1]); 
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
