'use client';

import Link from 'next/link';
import { Search, UserRound, Store as StoreIcon, ChevronDown, LogOut, UserCircle2, FolderOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export function StoreLogo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5" aria-label="Appzyna Store home">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#7C3AED] via-[#4F46E5] to-[#F97316] text-sm font-black text-white shadow-lg shadow-violet-500/25">
        A
      </span>
      <span className="text-lg font-black tracking-[-0.04em] text-white">Appzyna</span>
    </Link>
  );
}

export function StoreHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      return;
    }

    const syncSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const user = session?.user;
      const image = (user?.user_metadata?.avatar_url as string | undefined) ?? (user?.user_metadata?.picture as string | undefined) ?? '';
      const name = (user?.user_metadata?.full_name as string | undefined) ?? (user?.email ?? 'Google User');
      setAvatarUrl(image);
      setUserName(name);
    };

    void syncSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      const image = (user?.user_metadata?.avatar_url as string | undefined) ?? (user?.user_metadata?.picture as string | undefined) ?? '';
      const name = (user?.user_metadata?.full_name as string | undefined) ?? (user?.email ?? 'Google User');
      setAvatarUrl(image);
      setUserName(name);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  async function handleGoogleSignIn() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      return;
    }

    setIsSigningIn(true);
    try {
      const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/` : undefined;
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: redirectTo ? { redirectTo } : undefined,
      });
    } catch (_error) {
      setIsSigningIn(false);
    }
  }

  async function handleSignOut() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    setAvatarUrl('');
    setUserName('');
    setIsOpen(false);
  }

  const hasUser = Boolean(avatarUrl || userName);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0F1115]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <StoreLogo />
        </div>

        <div className="hidden min-w-[280px] max-w-[560px] flex-1 items-center justify-center md:flex">
          <label className="flex w-full items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/60 shadow-inner shadow-white/5">
            <Search className="h-4 w-4" />
            <input
              aria-label="Search apps"
              className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
              placeholder="Search apps, games, food, shops..."
              disabled
            />
          </label>
        </div>

        <div className="flex items-center gap-3">
          {!hasUser ? (
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="inline-flex items-center justify-center rounded-full bg-[#1a73e8] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#185abc] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSigningIn ? 'Signing in...' : 'Sign In'}
            </button>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1.5 text-sm text-white transition hover:bg-white/10"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt={userName} className="h-8 w-8 rounded-full border border-white/20 object-cover" />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a73e8] font-bold text-white">
                    {userName.slice(0, 1).toUpperCase()}
                  </span>
                )}
                <ChevronDown className="h-4 w-4 text-white/70" />
              </button>

              {isOpen && (
                <div className="absolute right-0 top-[calc(100%+10px)] w-48 overflow-hidden rounded-xl border border-white/10 bg-[#171a20] shadow-2xl">
                  <button type="button" className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-white/90 hover:bg-white/5">
                    <UserCircle2 className="h-4 w-4" /> My Account
                  </button>
                  <button type="button" className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-white/90 hover:bg-white/5">
                    <FolderOpen className="h-4 w-4" /> My Apps
                  </button>
                  <button type="button" onClick={handleSignOut} className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-300 hover:bg-white/5">
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              )}
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
    { id: 'store', label: 'Store', href: '/#featured', icon: StoreIcon },
    { id: 'search', label: 'Search', href: '/#search', icon: Search },
    { id: 'profile', label: 'Profile', href: '/', icon: UserRound },
  ] as const;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0B0A0F]/95 px-5 pb-[max(0.7rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-between text-xs font-medium text-white/60">
        {items.map(({ id, label, href, icon: Icon }) => (
          <Link key={id} href={href} className={`flex flex-col items-center gap-1 ${active === id ? 'text-white' : ''}`}>
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function StoreFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#09090B] px-5 py-8 pb-24 text-white/45 sm:px-8 md:pb-8 lg:px-10">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-3 text-xs font-medium sm:flex-row sm:items-center sm:justify-between">
        <p>Appzyna Store • empty catalog • Play Store styled</p>
        <p>Google sign in ready</p>
      </div>
    </footer>
  );
}
