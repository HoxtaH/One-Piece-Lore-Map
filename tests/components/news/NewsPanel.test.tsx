import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import NewsPanel from '@/components/news/NewsPanel';

// Mock fetch globally
global.fetch = vi.fn();

describe('NewsPanel', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [{
          id: '1',
          title: 'Luffy becomes Yonko!',
          summary: 'The Straw Hat captain has officially been recognized as an Emperor of the Sea.',
          sourceType: 'official',
          source: 'World Economy News Paper',
          link: '#',
          publishedAt: new Date().toISOString(),
          isSpoiler: false,
        }]
      })
    });
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(<NewsPanel isOpen={false} onClose={mockOnClose} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders header when isOpen is true and loads data', async () => {
    render(<NewsPanel isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByText('📰 BIG NEWS!')).toBeInTheDocument();
    
    // Should initially show loading state
    expect(screen.getByText(/Morgans is gathering the latest news.../i)).toBeInTheDocument();
    
    // Wait for the mock news to load
    await waitFor(() => {
      expect(screen.getByText('Luffy becomes Yonko!')).toBeInTheDocument();
    });
    
    expect(screen.getByText(/The Straw Hat captain has officially been recognized/i)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<NewsPanel isOpen={true} onClose={mockOnClose} />);
    const closeBtn = screen.getByLabelText('Close news panel');
    fireEvent.click(closeBtn);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('filters news by search query', async () => {
    render(<NewsPanel isOpen={true} onClose={mockOnClose} />);
    
    await waitFor(() => {
      expect(screen.getByText('Luffy becomes Yonko!')).toBeInTheDocument();
    });
    
    const searchInput = screen.getByPlaceholderText('Search for news...');
    
    // Search for something that doesn't match
    fireEvent.change(searchInput, { target: { value: 'Zoro' } });
    
    await waitFor(() => {
      expect(screen.queryByText('Luffy becomes Yonko!')).not.toBeInTheDocument();
      expect(screen.getByText('No news in this category yet!')).toBeInTheDocument();
    });
  });
});
