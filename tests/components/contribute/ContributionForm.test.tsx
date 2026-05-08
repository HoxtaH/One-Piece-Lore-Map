import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ContributionForm from '@/components/contribute/ContributionForm';

global.fetch = vi.fn();

describe('ContributionForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders initial step correctly', () => {
    render(<ContributionForm />);
    expect(screen.getByText('What would you like to contribute?')).toBeInTheDocument();
    expect(screen.getByText('New Location')).toBeInTheDocument();
  });

  it('validates fields and moves to next step', async () => {
    render(<ContributionForm />);
    
    // Step 0 -> Step 1 (no validation on step 0, just select type)
    const nextBtn = screen.getByText('Next');
    fireEvent.click(nextBtn);
    
    // Step 1: Basics
    expect(await screen.findByText(/Location Name/i)).toBeInTheDocument();
    
    // Try to go next without filling required fields
    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByText('Location name is required')).toBeInTheDocument();
    expect(screen.getByText('Description is required')).toBeInTheDocument();
    
    // Fill fields
    fireEvent.change(screen.getByPlaceholderText(/e.g., Elbaf/i), { target: { value: 'Test Island' } });
    fireEvent.change(screen.getByPlaceholderText(/Describe this location/i), { 
      target: { value: 'This is a test description that needs to be at least 50 characters long so that it passes validation.' } 
    });
    
    // Now it should let us proceed
    fireEvent.click(screen.getByText('Next'));
    expect(await screen.findByText('Lore & Details')).toBeInTheDocument();
  });

  it('can submit form completely', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => ({ success: true, message: 'Success' })
    });

    render(<ContributionForm />);
    
    // Navigate through steps quickly
    // Step 0 -> 1
    fireEvent.click(screen.getByText('Next'));
    
    // Step 1
    await screen.findByPlaceholderText(/e.g., Elbaf/i);
    fireEvent.change(screen.getByPlaceholderText(/e.g., Elbaf/i), { target: { value: 'Test Island' } });
    fireEvent.change(screen.getByPlaceholderText(/Describe this location/i), { 
      target: { value: 'This is a test description that needs to be at least 50 characters long so that it passes validation.' } 
    });
    fireEvent.click(screen.getByText('Next')); // to Step 2
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/history, major events/i)).toBeInTheDocument();
    });

    // Fill Step 2
    fireEvent.change(screen.getByPlaceholderText(/history, major events/i), {
      target: { value: 'A very rich history' }
    });
    fireEvent.change(screen.getByPlaceholderText(/culture, customs/i), {
      target: { value: 'A very rich culture' }
    });
    fireEvent.change(screen.getByPlaceholderText(/How do people travel/i), {
      target: { value: 'By ship' }
    });

    // Go to Step 3
    fireEvent.click(screen.getByText('Next'));
    
    // Wait for Step 3 (People)
    await waitFor(() => {
      expect(screen.getByText('+ Add Character')).toBeInTheDocument();
    });

    // Add a person
    fireEvent.click(screen.getByText('+ Add Character'));
    fireEvent.change(screen.getByPlaceholderText('Character name'), {
      target: { value: 'Luffy' }
    });
    fireEvent.change(screen.getByPlaceholderText('Role or title'), {
      target: { value: 'Captain' }
    });
    fireEvent.change(screen.getByPlaceholderText('Brief description'), {
      target: { value: 'Pirate King to be' }
    });
    // Remove person (to test remove function) then add again
    fireEvent.click(screen.getByText('Remove'));
    fireEvent.click(screen.getByText('+ Add Character'));
    fireEvent.change(screen.getByPlaceholderText('Character name'), {
      target: { value: 'Zoro' }
    });

    // Go to Step 4
    fireEvent.click(screen.getByText('Next'));
    
    // Wait for Step 4 (Media)
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Add a fun fact...')).toBeInTheDocument();
    });

    // Add a fact
    const factInput = screen.getByPlaceholderText('Add a fun fact...');
    fireEvent.change(factInput, { target: { value: 'Fact 1' } });
    fireEvent.click(screen.getByText('Add'));
    
    // Test enter key for fact
    fireEvent.change(factInput, { target: { value: 'Fact 2' } });
    fireEvent.keyDown(factInput, { key: 'Enter', code: 'Enter' });
    
    // Remove fact
    const removeFactBtns = screen.getAllByText('×');
    fireEvent.click(removeFactBtns[0]);

    // Go to Step 5 (Submit)
    fireEvent.click(screen.getByText('Next'));
    
    // Step 5: Contributor info
    expect(await screen.findByText('Your Name')).toBeInTheDocument();
    
    // Validate email
    fireEvent.click(screen.getByText('Submit Contribution'));
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    
    fireEvent.change(screen.getByPlaceholderText(/How should we credit you?/i), { target: { value: 'Tester' } });
    fireEvent.change(screen.getByPlaceholderText(/your@email.com/i), { target: { value: 'bademail' } });
    
    fireEvent.click(screen.getByText('Submit Contribution'));
    expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    
    fireEvent.change(screen.getByPlaceholderText(/your@email.com/i), { target: { value: 'test@example.com' } });
    
    fireEvent.click(screen.getByText('Submit Contribution'));
    
    await waitFor(() => {
      expect(screen.getByText('Check Your Email! 📧')).toBeInTheDocument();
    });
    
    expect(global.fetch).toHaveBeenCalled();
  });
});
