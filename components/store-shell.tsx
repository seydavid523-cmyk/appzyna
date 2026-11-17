import Link from 'next/link';
import { Compass, Search, UserRound, Store as StoreIcon } from 'lucide-react';

export function StoreLogo() {
  return <Link href="/store" className="inline-flex items-center gap-2.5" aria-label="Appzyna Store home"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#F97316] text-sm font-black text-white shadow-store">A<span className="text-[#FBBF24]">.</span></span><span><span className="block font-display text-[1.18rem] font-black tracking-[-0.06em] text-white">appzyna<span className="text-[#F97316]">.</span></span><span className="block text-[0.5rem] font-black uppercase tracking-[0.2em] text-white/45">Store · Ghana</span></span></Link>;
}

export function StoreHeader() {
  return <header className="sticky top-0 z-30 border-b border-white/10 bg-[#09090B]/90 backdrop-blur-xl"><div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10"><StoreLogo /><nav className="hidden items-center gap-7 text-sm font-bold text-white/60 md:flex"><Link href="/store" className="text-white transition hover:text-[#F97316]">Discover</Link><Link href="/store?category=Games" className="transition hover:text-white">Categories</Link><Link href="/creator/king" className="transition hover:text-white">Creators</Link></nav><div className="flex items-center gap-2"><Link href="/store?focus=search" className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white/65 transition hover:border-white/25 hover:text-white" aria-label="Search apps"><Search className="h-4 w-4" /></Link><Link href="/login" className="hidden rounded-xl border border-white/10 px-4 py-2.5 text-xs font-black text-white/75 transition hover:border-white/25 hover:text-white sm:inline-flex">Sign in</Link><Link href="/portal" className="rounded-xl bg-white px-4 py-2.5 text-xs font-black text-[#17121F] transition hover:bg-[#F97316] hover:text-white">Build an app</Link></div></div></header>;
}

export function StoreBottomNav({ active = 'home' }: { active?: 'home' | 'store' | 'search' | 'profile' }) {
  const items = [
    { id: 'home', label: 'Home', href: '/store', icon: Compass },
    { id: 'store', label: 'Store', href: '/store#trending', icon: StoreIcon },
    { id: 'search', label: 'Search', href: '/store?focus=search', icon: Search },
    { id: 'profile', label: 'Profile', href: '/login', icon: UserRound },
  ] as const;
  return <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0B0A0F]/95 px-5 pb-[max(0.7rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:hidden"><div className="mx-auto flex max-w-md items-center justify-around">{items.map((item) => { const Icon = item.icon; const isActive = active === item.id; return <Link key={item.id} href={item.href} className={`flex min-w-[60px] flex-col items-center gap-1 text-[0.62rem] font-bold transition ${isActive ? 'text-[#F97316]' : 'text-white/45 hover:text-white'}`}><Icon className="h-5 w-5" />{item.label}</Link>; })}</div></nav>;
}

export function StoreFooter() {
  return <footer className="border-t border-white/10 bg-[#09090B] px-5 py-8 pb-24 text-white/45 sm:px-8 md:pb-8 lg:px-10"><div className="mx-auto flex max-w-[1240px] flex-col gap-3 text-xs font-semibold sm:flex-row sm:items-center sm:justify-between"><p>Appzyna Store • v3 • Made in Ghana • by King Tech</p><p>Built for the next great Ghanaian app.</p></div></footer>;
}
