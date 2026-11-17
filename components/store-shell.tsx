'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ChevronDown, FolderOpen, LogOut, Search, Store as StoreIcon, UserCircle2, UserRound } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export function StoreLogo() {
  return <Link href="/" className="inline-flex items-center gap-2.5" aria-label="Appzyna Store home"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6750a4] to-[#8a70c8] text-sm font-black text-white shadow-sm">A</span><span className="text-lg font-bold tracking-[-0.04em] text-[#202124]">Appzyna<span className="ml-1 font-medium text-[#6f7278]">Store</span></span></Link>;
}

export function StoreHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    const syncUser = (user: { email?: string; user_metadata?: Record<string, unknown> } | null) => {
      setAvatarUrl(String(user?.user_metadata?.avatar_url ?? user?.user_metadata?.picture ?? ''));
      setUserName(String(user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email ?? ''));
    };
    void supabase.auth.getSession().then(({ data }) => syncUser(data.session?.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => syncUser(session?.user ?? null));
    return () => listener.subscription.unsubscribe();
  }, []);

  async function signInWithGoogle() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    setIsSigningIn(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) setIsSigningIn(false);
  }

  async function signOut() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    setIsOpen(false);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-[#e8eaf0] bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-10">
        <StoreLogo />
        <div className="hidden max-w-[520px] flex-1 items-center md:flex">
          <label className="flex w-full items-center gap-3 rounded-full border border-[#e1e4eb] bg-[#f5f6f8] px-4 py-2.5 text-sm text-[#6f7278] focus-within:border-[#6750a4] focus-within:bg-white">
            <Search className="h-4 w-4 shrink-0" />
            <span className="truncate">Search apps and games</span>
          </label>
        </div>
        <div className="flex items-center gap-3">
          {!userName ? (
            <button type="button" onClick={signInWithGoogle} disabled={isSigningIn} className="rounded-full bg-[#6750a4] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#56418b] disabled:opacity-60">
              {isSigningIn ? 'Signing in…' : 'Sign in'}
            </button>
          ) : (
            <div className="relative">
              <button type="button" onClick={() => setIsOpen((open) => !open)} aria-label="Open account menu" className="flex items-center gap-2 rounded-full p-1 transition hover:bg-[#f2f3f5]">
                {avatarUrl ? <img src={avatarUrl} alt="" className="h-9 w-9 rounded-full object-cover" /> : <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6750a4] font-semibold text-white">{userName.slice(0, 1).toUpperCase()}</span>}
                <ChevronDown className="mr-1 h-4 w-4 text-[#5f6368]" />
              </button>
              {isOpen && <div className="absolute right-0 top-[calc(100%+8px)] w-48 overflow-hidden rounded-xl border border-[#e8eaf0] bg-white py-1 shadow-xl">
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-[#3c4043] hover:bg-[#f6f7f9]"><UserCircle2 className="h-4 w-4" /> My Account</Link>
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-[#3c4043] hover:bg-[#f6f7f9]"><FolderOpen className="h-4 w-4" /> My Apps</Link>
                <button type="button" onClick={signOut} className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-[#b3261e] hover:bg-[#f6f7f9]"><LogOut className="h-4 w-4" /> Sign out</button>
              </div>}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export function StoreBottomNav({ active = 'home' }: { active?: 'home' | 'store' | 'search' | 'profile' }) {
  const items = [
    { id: 'home', label: 'Home', href: '/', icon: StoreIcon },
    { id: 'store', label: 'Categories', href: '/#categories', icon: StoreIcon },
    { id: 'search', label: 'Search', href: '/#search', icon: Search },
    { id: 'profile', label: 'Account', href: '/dashboard', icon: UserRound },
  ] as const;
  return <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e8eaf0] bg-white/95 px-5 pb-[max(0.7rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:hidden"><div className="mx-auto flex max-w-md items-center justify-between text-xs font-medium text-[#6f7278]">{items.map(({ id, label, href, icon: Icon }) => <Link key={id} href={href} className={`flex flex-col items-center gap-1 ${active === id ? 'text-[#6750a4]' : ''}`}><Icon className="h-5 w-5" />{label}</Link>)}</div></nav>;
}

export function StoreFooter() {
  return <footer className="border-t border-[#e8eaf0] bg-white px-5 py-7 pb-24 text-[#73777f] sm:px-8 md:pb-7 lg:px-10"><div className="mx-auto flex max-w-[1240px] flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between"><p className="font-semibold text-[#5f6368]">Appzyna Store</p><p>Discover apps made by creators.</p></div></footer>;
}
