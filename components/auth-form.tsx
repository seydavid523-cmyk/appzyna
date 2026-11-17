'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Eye, EyeOff, Loader2, LockKeyhole, Mail, Sparkles, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client';

function slugify(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'creator';
}

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter();
  const signup = mode === 'signup';
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '');
    const password = String(form.get('password') ?? '');
    const fullName = String(form.get('fullName') ?? '');
    const businessName = String(form.get('businessName') ?? '');
    const supabase = getSupabaseBrowserClient();

    try {
      if (!supabase) {
        window.localStorage.setItem('appzyna_demo_user', JSON.stringify({ fullName: fullName || 'Creator', businessName: businessName || 'Your business', email }));
        router.push('/dashboard?mode=demo');
        return;
      }

      if (signup) {
        const username = slugify(fullName || businessName);
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName, business_name: businessName, username } },
        });
        if (error) throw error;
        if (data.user) {
          const { error: profileError } = await supabase.from('users').upsert({
            id: data.user.id,
            email,
            full_name: fullName,
            business_name: businessName,
            username,
            avatar_url: null,
            bio: null,
          });
          if (profileError) throw profileError;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      router.push('/dashboard');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      {signup && (
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="field-label">Full name<input required name="fullName" type="text" placeholder="King" className="field-input" /></label>
          <label className="field-label">Business name<input required name="businessName" type="text" placeholder="King Tech" className="field-input" /></label>
        </div>
      )}
      <label className="field-label">Email address<div className="relative"><Mail className="field-icon" /><input required name="email" type="email" placeholder="you@business.com" className="field-input with-icon" /></div></label>
      <label className="field-label">Password<div className="relative"><LockKeyhole className="field-icon" /><input required minLength={6} name="password" type={showPassword ? 'text' : 'password'} placeholder="At least 6 characters" className="field-input with-icon pr-12" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-ink/35 transition hover:bg-ink/5 hover:text-ink" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></label>
      {errorMessage && <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">{errorMessage}</p>}
      {!isSupabaseConfigured() && <p className="flex gap-2 rounded-2xl border border-purple/15 bg-purple/[0.05] px-4 py-3 text-xs leading-5 text-ink/55"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-purple" /> Preview mode is ready to explore. Add Supabase public env values to activate live account creation.</p>}
      <button disabled={isLoading} type="submit" className="group inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-purple to-orange px-5 py-4 text-sm font-black text-white shadow-[0_12px_28px_rgba(108,0,255,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(108,0,255,0.3)] disabled:cursor-wait disabled:opacity-70">
        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : signup ? 'Create my creator account' : 'Log in to Appzyna'}
        {!isLoading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
      </button>
      <p className="text-center text-sm text-ink/50">{signup ? 'Already building here?' : 'New to Appzyna?'} <Link href={signup ? '/login' : '/signup'} className="font-bold text-purple hover:text-orange">{signup ? 'Log in' : 'Create an account'}</Link></p>
    </form>
  );
}

export function AuthSideNote({ mode }: { mode: 'login' | 'signup' }) {
  return (
    <div className="hidden overflow-hidden rounded-[32px] bg-ink p-8 text-white shadow-float lg:flex lg:flex-col lg:justify-between xl:p-10">
      <div>
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-gold"><UserRound className="h-4 w-4" /> {mode === 'signup' ? 'For the next creator' : 'Welcome back, builder'}</div>
        <h2 className="mt-20 max-w-sm font-display text-4xl font-black leading-[0.98] tracking-[-0.065em] xl:text-5xl">{mode === 'signup' ? 'Your next app can start with one link.' : 'Pick up exactly where your next app begins.'}</h2>
      </div>
      <div className="relative mt-16 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.07] p-5">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-purple/70 blur-3xl" />
        <div className="relative flex items-center justify-between"><span className="text-xs font-black uppercase tracking-[0.18em] text-white/50">Creator signal</span><Sparkles className="h-4 w-4 text-gold" /></div>
        <p className="relative mt-8 max-w-xs text-xl font-bold leading-7">“The best storefront is the one your customers keep on their home screen.”</p>
        <p className="relative mt-5 text-xs font-bold uppercase tracking-[0.16em] text-white/45">King Tech / Appzyna</p>
      </div>
    </div>
  );
}
