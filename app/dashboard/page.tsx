import type { Metadata } from 'next';
import { PortalDashboard } from '@/components/portal-dashboard';

export const metadata: Metadata = { title: 'Creator Dashboard — Appzyna' };

export default function DashboardPage() {
  return <PortalDashboard />;
}
