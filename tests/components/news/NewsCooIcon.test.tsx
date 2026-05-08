import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import NewsCooIcon from '@/components/news/NewsCooIcon';
import { MOCK_NEWS } from '@/lib/types/news';

describe('NewsCooIcon', () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the news coo image', () => {
    render(<NewsCooIcon onClick={mockOnClick} />);
    const image = screen.getByAltText('News Coo');
    expect(image).toBeInTheDocument();
  });

  it('shows unread badge if there is new news', () => {
    // Set last read to a time before the mock news
    localStorage.setItem('news-last-read', new Date('1999-01-01').toISOString());
    render(<NewsCooIcon onClick={mockOnClick} />);
    
    // The exclamation mark should be present
    expect(screen.getByText('!')).toBeInTheDocument();
  });

  it('hides unread badge if all news is read', () => {
    // Set last read to the future
    localStorage.setItem('news-last-read', new Date('2050-01-01').toISOString());
    render(<NewsCooIcon onClick={mockOnClick} />);
    
    // The exclamation mark should not be present
    expect(screen.queryByText('!')).not.toBeInTheDocument();
  });

  it('calls onClick and updates localStorage when clicked', () => {
    render(<NewsCooIcon onClick={mockOnClick} />);
    const button = screen.getByRole('button', { name: /Open News Panel/i });
    
    fireEvent.click(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem('news-last-read')).toBeTruthy();
  });
});
