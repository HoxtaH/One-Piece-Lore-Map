import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CharacterCardSkeleton from '@/components/skeletons/CharacterCardSkeleton';

describe('CharacterCardSkeleton', () => {
  it('renders without crashing', () => {
    const { container } = render(<CharacterCardSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
