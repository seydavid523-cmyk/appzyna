import type { Metadata } from 'next';
import Link from 'next/link';
import { BrandMark } from '@/components/brand-mark';
import { AuthForm, AuthSideNote } from '@/components/auth-form';

export const metadata: Metadata = { title: 'Log in — Appzyna' };

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-paper px-5 py-5 sm:px-8 sm:py-8 lg:px-12">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1240px] gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <AuthSideNote mode="login" />
        <div className="flex flex-col rounded-[32px] border border-ink/10 bg-white px-6 py-7 shadow-card sm:px-10 sm:py-10 lg:px-16 lg:py-12">
          <div className="flex items-center justify-between"><BrandMark compact /><Link href="/" className="text-xs font-bold text-ink/45 transition hover:text-ink">Back home</Link></div>
          <div className="mx-auto w-full max-w-md flex-1 pt-16 sm:pt-24"><p className="eyebrow">Creator access</p><h1 className="mt-4 font-display text-4xl font-black tracking-[-0.06em] sm:text-5xl">Log in and keep building.</h1><p className="mt-4 text-base leading-7 text-ink/55">Your next launch is closer than it looks.</p><AuthForm mode="login" /></div>
          <p className="mt-12 text-center text-xs leading-5 text-ink/35">By continuing, you agree to build something worth keeping.</p>
        </div>
      </div>
    </main>
  );
}
