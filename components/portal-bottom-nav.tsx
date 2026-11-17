import Link from 'next/link';
import { BarChart3, FilePlus2, LayoutDashboard, Settings, Smartphone } from 'lucide-react';

export function PortalBottomNav({ active = 'dashboard' }: { active?: 'dashboard' | 'apps' | 'analytics' | 'build' | 'settings' }) {
  const items = [
    { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { id: 'apps', label: 'Apps', href: '/dashboard#apps', icon: Smartphone },
    { id: 'analytics', label: 'Analytics', href: '/dashboard#analytics', icon: BarChart3 },
    { id: 'build', label: 'Build', href: '/creator/new', icon: FilePlus2 },
    { id: 'settings', label: 'Settings', href: '/dashboard#settings', icon: Settings },
  ] as const;
  return <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#14121F]/10 bg-white/95 px-3 pb-[max(.6rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:hidden"><div className="mx-auto flex max-w-lg items-center justify-around">{items.map((item) => { const Icon = item.icon; return <Link key={item.id} href={item.href} className={`flex min-w-[52px] flex-col items-center gap-1 text-[0.56rem] font-black transition ${active === item.id ? 'text-purple' : 'text-[#14121F]/40 hover:text-[#14121F]'}`}><Icon className="h-4.5 w-4.5" />{item.label}</Link>; })}</div></nav>;
}
