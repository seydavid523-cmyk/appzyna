import type { Metadata } from 'next';
import Link from 'next/link';
import { BrandMark } from '@/components/brand-mark';
import { AuthForm, AuthSideNote } from '@/components/auth-form';

export const metadata: Metadata = { title: 'Create your creator account — Appzyna' };

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-paper px-5 py-5 sm:px-8 sm:py-8 lg:px-12">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1240px] gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <AuthSideNote mode="signup" />
        <div className="flex flex-col rounded-[32px] border border-ink/10 bg-white px-6 py-7 shadow-card sm:px-10 sm:py-10 lg:px-16 lg:py-12">
          <div className="flex items-center justify-between"><BrandMark compact /><Link href="/" className="text-xs font-bold text-ink/45 transition hover:text-ink">Back home</Link></div>
          <div className="mx-auto w-full max-w-md flex-1 pt-12 sm:pt-16"><p className="eyebrow">Start your profile</p><h1 className="mt-4 font-display text-4xl font-black tracking-[-0.06em] sm:text-5xl">Make your website more keepable.</h1><p className="mt-4 text-base leading-7 text-ink/55">Create your creator identity, then turn your first link into a place people return to.</p><AuthForm mode="signup" /></div>
          <p className="mt-10 text-center text-xs leading-5 text-ink/35">It starts with a name. The app comes next.</p>
        </div>
      </div>
    </main>
  );
}
