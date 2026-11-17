import type { Metadata } from 'next';
import { StoreHome } from '@/components/store-home';

export const metadata: Metadata = { title: 'Discover Apps Built In Ghana — Appzyna Store' };

export default function StorePage() {
  return <StoreHome />;
}
