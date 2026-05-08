import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LocationSkeleton from '@/components/skeletons/LocationSkeleton';

describe('LocationSkeleton', () => {
  it('renders without crashing', () => {
    const { container } = render(<LocationSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
