import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CreatorBuilderV3 } from '@/components/creator-builder-v3';

export const metadata: Metadata = { title: 'Publish New App — Appzyna' };

export default function CreatorNewPage() {
  return <Suspense fallback={<div className="min-h-screen bg-[#F4F3F8]" />}><CreatorBuilderV3 /></Suspense>;
}
