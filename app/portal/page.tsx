import type { Metadata } from 'next';
import { PortalLanding } from '@/components/portal-landing';

export const metadata: Metadata = { title: 'Turn Your Website Into An App In 60 Seconds — Appzyna' };

export default function PortalPage() {
  return <PortalLanding />;
}
