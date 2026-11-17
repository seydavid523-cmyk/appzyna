import type { Metadata } from 'next';
import { PortalLanding } from '@/components/portal-landing';

export const metadata: Metadata = { title: 'Creator Portal — Appzyna' };

export default function CreatorPortalPage() {
  return <PortalLanding />;
}
