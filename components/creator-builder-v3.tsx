'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, FileImage, Globe2, ImagePlus, Loader2, Palette, PartyPopper, Search, Sparkles, Store, UploadCloud } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { AnalyzeResult, GeneratedAppCopy } from '@/lib/analyzer';
import type { StoreCategory } from '@/lib/v3-data';

type BuilderDraft = { websiteUrl: string; analysis: AnalyzeResult | null; appName: string; description: string; category: StoreCategory; iconUrl: string; screenshots: string[] };
const categories: StoreCategory[] = ['Shops', 'Food', 'Fashion', 'Churches', 'Music', 'Games'];
const steps = [{ label: 'Website', icon: Globe2 }, { label: 'AI Fill', icon: Sparkles }, { label: 'Assets', icon: UploadCloud }, { label: 'Publish', icon: PartyPopper }];

export function CreatorBuilderV3() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [published, setPublished] = useState(false);
  const [publishMessage, setPublishMessage] = useState('');
  const [draft, setDraft] = useState<BuilderDraft>({ websiteUrl: searchParams.get('website') || '', analysis: null, appName: '', description: '', category: 'Shops', iconUrl: '', screenshots: [] });

  useEffect(() => {
    const fromQuery = searchParams.get('website');
    if (fromQuery && !draft.analysis) setDraft((current) => ({ ...current, websiteUrl: fromQuery }));
  }, [draft.analysis, searchParams]);

  async function analyze() {
    setError('');
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: draft.websiteUrl }) });
      const payload = await response.json() as AnalyzeResult & { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) throw new Error(payload.error || 'We could not read that website.');
      setDraft((current) => ({ ...current, websiteUrl: payload.scraped.url, analysis: payload, appName: payload.generated.appName, description: payload.generated.fullDesc, category: mapCategory(payload.generated.category, payload.detectedType), iconUrl: payload.scraped.favicon }));
      setStep(2);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'We could not read that website.');
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>, kind: 'icon' | 'screenshots') {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    const readers = files.map((file) => new Promise<string>((resolve) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result || '')); reader.readAsDataURL(file); }));
    Promise.all(readers).then((results) => setDraft((current) => kind === 'icon' ? { ...current, iconUrl: results[0] } : { ...current, screenshots: [...current.screenshots, ...results].slice(0, 4) }));
  }

  async function uploadDataUrl(supabase: SupabaseClient, dataUrl: string, path: string) {
    if (!dataUrl.startsWith('data:')) return dataUrl;
    try {
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const { error } = await supabase.storage.from('app-assets').upload(path, blob, { upsert: true, contentType: blob.type });
      if (error) return dataUrl;
      return supabase.storage.from('app-assets').getPublicUrl(path).data.publicUrl;
    } catch {
      return dataUrl;
    }
  }

  async function publish() {
    const slug = `${draft.appName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now().toString(36)}`;
    const publishedApp = { id: slug, slug, name: draft.appName, description: draft.description.slice(0, 160), category: draft.category, icon: draft.appName.slice(0, 2).toUpperCase(), accent: 'from-[#7C3AED] via-[#8B5CF6] to-[#F97316]', creatorName: 'King', creatorUsername: 'king', rating: 0, ratingCount: 'New app', downloads: '0', websiteUrl: draft.websiteUrl, screenshots: draft.screenshots, status: 'Published', publishedAt: new Date().toISOString() };
    const existing = JSON.parse(localStorage.getItem('appzyna_published_apps') || '[]') as typeof publishedApp[];
    localStorage.setItem('appzyna_published_apps', JSON.stringify([publishedApp, ...existing]));
    const supabase = getSupabaseBrowserClient();
    let saved = false;
    if (supabase) {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const iconUrl = await uploadDataUrl(supabase, draft.iconUrl, `${data.user.id}/${slug}/icon`);
        const screenshots = await Promise.all(draft.screenshots.map((screenshot, index) => uploadDataUrl(supabase, screenshot, `${data.user.id}/${slug}/screenshot-${index}`)));
        const { error: insertError } = await supabase.from('apps').insert({ owner_id: data.user.id, name: draft.appName, app_name: draft.appName, website_url: draft.websiteUrl, description: draft.description, full_desc: draft.description, short_desc: draft.description.slice(0, 80), category: draft.category, icon_url: iconUrl || null, screenshots, downloads: 0, rating: 0, status: 'Published', is_published: true });
        saved = !insertError;
      }
    }
    setPublished(true);
    setPublishMessage(saved ? 'Published to Appzyna Store and saved to your creator account.' : 'Published to your Store preview. Connect Supabase to sync this app for every device.');
    setStep(4);
  }

  const currentCopy = draft.analysis?.generated;
  return <div className="min-h-screen bg-[#F4F3F8] text-[#14121F]"><header className="border-b border-[#14121F]/10 bg-white"><div className="mx-auto flex max-w-[1360px] items-center justify-between px-5 py-4 sm:px-8 lg:px-10"><Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-[#14121F]/55 hover:text-purple"><ArrowLeft className="h-4 w-4" /> Dashboard</Link><span className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-[#14121F]/35">Appzyna builder / v3</span></div></header><main className="mx-auto max-w-[1120px] px-5 py-8 pb-24 sm:px-8 sm:py-12 lg:px-10 lg:pb-14"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-[0.65rem] font-black uppercase tracking-[0.22em] text-orange">Publish New App</p><h1 className="mt-3 font-display text-4xl font-black tracking-[-.07em] sm:text-6xl">Build it for Ghana.</h1><p className="mt-4 max-w-xl text-base leading-7 text-[#14121F]/55">Use your real website, add the assets customers need, and publish to the Appzyna Store.</p></div><span className="rounded-xl bg-white px-4 py-3 text-xs font-black text-[#14121F]/55 shadow-card"><span className="text-orange">Step {step}</span> of 4</span></div><div className="mt-10 grid gap-3 sm:grid-cols-4">{steps.map((item, index) => { const Icon = item.icon; const id = index + 1; return <button key={item.label} type="button" onClick={() => id <= step && setStep(id)} className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-xs font-black transition ${id === step ? 'border-orange bg-orange text-white shadow-card' : id < step ? 'border-purple/20 bg-white text-purple' : 'border-[#14121F]/10 bg-white/60 text-[#14121F]/35'}`}><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/5">{id < step ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}</span>{item.label}</button>; })}</div><div className="mt-8 rounded-[28px] border border-[#14121F]/10 bg-white p-5 shadow-card sm:p-8">{step === 1 && <div className="mx-auto max-w-3xl py-8 sm:py-14"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple/10 text-purple"><Globe2 className="h-8 w-8" /></div><h2 className="mt-7 text-center font-display text-3xl font-black tracking-[-.055em]">Paste your website URL.</h2><p className="mx-auto mt-3 max-w-lg text-center text-sm leading-6 text-[#14121F]/55">Appzyna reads the real title, headings, first paragraph, and favicon before it fills the Store listing.</p><div className="mt-8 flex flex-col gap-3 rounded-2xl border border-[#14121F]/10 bg-[#F4F3F8] p-2 sm:flex-row"><input value={draft.websiteUrl} onChange={(event) => setDraft((current) => ({ ...current, websiteUrl: event.target.value }))} placeholder="https://yourwebsite.com" className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm font-semibold outline-none placeholder:text-[#14121F]/35" /><button type="button" onClick={analyze} disabled={isAnalyzing || !draft.websiteUrl.trim()} className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange px-6 py-3.5 text-sm font-black text-white transition hover:bg-[#EA580C] disabled:opacity-60">{isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} {isAnalyzing ? 'Reading website...' : 'Generate app'}</button></div>{error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}<p className="mt-4 text-center text-xs text-[#14121F]/40">Your website content is analyzed on the server.</p></div>}{step === 2 && draft.analysis && <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr]"><div className="rounded-2xl bg-[#F4F3F8] p-5"><div className="flex items-center gap-3"><img src={draft.iconUrl} alt="" className="h-12 w-12 rounded-xl bg-white object-contain p-2" /><div className="min-w-0"><p className="truncate font-display text-xl font-black">{draft.analysis.scraped.title}</p><p className="mt-1 truncate text-xs font-bold text-orange">{draft.analysis.detectedType} · {draft.analysis.source === 'ai' ? 'AI enriched' : 'Website content fallback'}</p></div></div><div className="mt-6 space-y-4"><div><p className="eyebrow">Real headings</p><div className="mt-2 space-y-2">{draft.analysis.scraped.headings.slice(0, 4).map((heading) => <p key={heading} className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#14121F]/65">{heading}</p>)}</div></div><div><p className="eyebrow">First paragraph</p><p className="mt-2 text-sm leading-6 text-[#14121F]/55">{draft.analysis.scraped.firstParagraph || 'No paragraph tag found; the listing uses the website title and headings.'}</p></div></div></div><div><div className="flex items-center justify-between gap-3"><div><p className="eyebrow">AI auto-fill</p><h2 className="mt-2 font-display text-2xl font-black">Shape the listing.</h2></div><span className="rounded-full bg-emerald-500/10 px-3 py-2 text-[0.62rem] font-black text-emerald-600">Editable</span></div><div className="mt-6 space-y-5"><label className="field-label">App name<input value={draft.appName} onChange={(event) => setDraft((current) => ({ ...current, appName: event.target.value }))} className="field-input" /></label><label className="field-label">Description<textarea value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} rows={8} className="field-input resize-y leading-6" /></label><label className="field-label">Category<select value={draft.category} onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value as StoreCategory }))} className="field-input">{categories.map((category) => <option key={category}>{category}</option>)}</select></label></div><button type="button" onClick={() => setStep(3)} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#14121F] px-5 py-3.5 text-sm font-black text-white transition hover:bg-purple">Continue to assets <ArrowRight className="h-4 w-4" /></button></div></div>}{step === 3 && <div className="mx-auto max-w-4xl"><p className="eyebrow">Assets and category</p><h2 className="mt-2 font-display text-3xl font-black">Give customers the full picture.</h2><div className="mt-7 grid gap-6 lg:grid-cols-2"><label className="rounded-2xl border border-dashed border-[#14121F]/20 bg-[#F4F3F8] p-5"><span className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-purple"><ImagePlus className="h-5 w-5" /></span><span><span className="block text-sm font-black">Upload Icon</span><span className="mt-1 block text-xs text-[#14121F]/45">Square PNG, JPG, or WebP</span></span></span><input type="file" accept="image/*" onChange={(event) => handleFile(event, 'icon')} className="mt-5 w-full text-xs font-bold" /></label><label className="rounded-2xl border border-dashed border-[#14121F]/20 bg-[#F4F3F8] p-5"><span className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-orange"><FileImage className="h-5 w-5" /></span><span><span className="block text-sm font-black">Upload Screenshots</span><span className="mt-1 block text-xs text-[#14121F]/45">Up to 4 phone or product images</span></span></span><input type="file" accept="image/*" multiple onChange={(event) => handleFile(event, 'screenshots')} className="mt-5 w-full text-xs font-bold" /></label></div><div className="mt-6 flex flex-wrap gap-3">{categories.map((category) => <button type="button" key={category} onClick={() => setDraft((current) => ({ ...current, category }))} className={`rounded-xl border px-4 py-3 text-sm font-black transition ${draft.category === category ? 'border-purple bg-purple text-white' : 'border-[#14121F]/10 bg-white text-[#14121F]/55 hover:border-purple/30'}`}>{category}</button>)}</div>{draft.screenshots.length > 0 && <div className="mt-6 flex gap-3 overflow-x-auto">{draft.screenshots.map((screenshot, index) => <img key={`${screenshot.slice(0, 12)}-${index}`} src={screenshot} alt={`Screenshot ${index + 1}`} className="h-24 w-20 rounded-xl object-cover" />)}</div>}<div className="mt-8 flex flex-wrap items-center gap-4"><button type="button" onClick={() => setStep(2)} className="text-sm font-black text-[#14121F]/45 hover:text-[#14121F]">Back to AI fill</button><button type="button" onClick={() => setStep(4)} className="inline-flex items-center gap-2 rounded-xl bg-[#14121F] px-5 py-3.5 text-sm font-black text-white transition hover:bg-purple">Review publish <ArrowRight className="h-4 w-4" /></button></div></div>}{step === 4 && <div className="mx-auto max-w-3xl"><div className="rounded-[24px] bg-gradient-to-br from-[#2E1065] via-[#6D28D9] to-[#F97316] p-7 text-white sm:p-10"><div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white/15 text-sm font-black">{draft.iconUrl ? <img src={draft.iconUrl} alt="" className="h-full w-full object-cover" /> : draft.appName.slice(0, 2).toUpperCase()}</span><div><p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-white/60">Store listing ready</p><h2 className="mt-1 font-display text-3xl font-black">{draft.appName || 'Your new app'}</h2></div></div><p className="mt-8 text-sm leading-7 text-white/75">{draft.description || currentCopy?.fullDesc}</p><div className="mt-7 flex flex-wrap gap-2"><span className="rounded-full bg-white/10 px-3 py-2 text-xs font-black">{draft.category}</span><span className="rounded-full bg-white/10 px-3 py-2 text-xs font-black">{draft.screenshots.length} screenshots</span><span className="rounded-full bg-white/10 px-3 py-2 text-xs font-black">Made in Ghana</span></div></div>{publishMessage && <p className="mt-5 rounded-xl bg-amber-500/15 px-4 py-3 text-sm font-bold text-amber-700">{publishMessage}</p>}{!published ? <button type="button" onClick={publish} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange px-6 py-4 text-sm font-black text-white transition hover:bg-[#EA580C]">Publish to Appzyna Store <Store className="h-4 w-4" /></button> : <Link href="/store" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#14121F] px-6 py-4 text-sm font-black text-white transition hover:bg-purple">Open Appzyna Store <ArrowRight className="h-4 w-4" /></Link>}<button type="button" onClick={() => setStep(3)} className="ml-4 text-sm font-bold text-[#14121F]/45 hover:text-[#14121F]">Edit assets</button></div>}</div></main></div>;
}

function mapCategory(category: GeneratedAppCopy['category'], detectedType: AnalyzeResult['detectedType']): StoreCategory {
  if (detectedType === 'GAME') return 'Games';
  if (detectedType === 'SHOP') return 'Shops';
  if (category === 'Game') return 'Games';
  return 'Shops';
}
