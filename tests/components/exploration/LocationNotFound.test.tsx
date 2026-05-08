import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LocationNotFound from '@/components/exploration/LocationNotFound';

// Mock the useRouter hook
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('LocationNotFound', () => {
  it('renders the 404 message correctly', () => {
    render(<LocationNotFound />);
    expect(screen.getByText('Location Not Found')).toBeInTheDocument();
    expect(screen.getByText(/The location you're looking for doesn't exist/i)).toBeInTheDocument();
  });

  it('navigates to home when return button is clicked', () => {
    render(<LocationNotFound />);
    const button = screen.getByRole('button', { name: /Return to Map/i });
    
    fireEvent.click(button);
    
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
