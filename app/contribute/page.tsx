import { Metadata } from 'next';
import ContributeClient from './ContributeClient';

export const metadata: Metadata = {
  title: 'Contribute | One Piece Lore Map',
  description: 'Help build the ultimate One Piece location database. Share your knowledge of islands, lore, and characters with the community!',
};

export default function ContributePage() {
  return <ContributeClient />;
}
