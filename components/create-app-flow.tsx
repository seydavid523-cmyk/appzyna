'use client';

import { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Edit3, ExternalLink, FileText, Globe2, ImagePlus, Loader2, Palette, PartyPopper, Search, Sparkles, Store, Wand2 } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { AnalyzeResult } from '@/lib/analyzer';
import type { CreateDraft } from '@/lib/create-types';

type PhonePreviewProps = {
  appName: string;
  logoUrl: string;
  color: string;
  websiteUrl: string;
  shortDesc: string;
};

function PhonePreview({ appName, logoUrl, color, websiteUrl, shortDesc }: PhonePreviewProps) {
  return (
    <div className="mx-auto w-[260px] rounded-[36px] border-[7px] border-[#282061] bg-[#282061] p-2 shadow-[0_25px_50px_rgba(40,32,97,0.25)] sm:w-[290px]">
      <div className="overflow-hidden rounded-[27px] bg-[#F4F4F7]">
        <div className="flex items-center justify-between px-4 pb-3 pt-4 text-[0.58rem] font-black text-[#282061]/55"><span>9:41</span><span>● ● ●</span></div>
        <div className="px-4 pb-4"><div className="flex items-center justify-between rounded-xl px-3 py-3 text-white" style={{ background: `linear-gradient(135deg, ${color}, #F06B3D)` }}><div className="flex min-w-0 items-center gap-2"><span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/20 text-xs font-black">{logoUrl ? <img src={logoUrl} alt="" className="h-full w-full object-cover" /> : appName.slice(0, 1)}</span><span className="truncate text-xs font-black">{appName || 'Your app'}</span></div><span className="text-xs">•••</span></div><div className="mt-4 rounded-xl bg-white p-3 shadow-sm"><p className="text-[0.54rem] font-black uppercase tracking-[0.16em] text-[#F06B3D]">Featured</p><h3 className="mt-2 font-display text-base font-black text-[#282061]">{appName || 'Your app'}</h3><p className="mt-1 line-clamp-3 text-[0.62rem] leading-4 text-[#282061]/60">{shortDesc || 'Your app description will appear here.'}</p><div className="mt-3 flex items-center justify-between text-[0.55rem] font-bold text-[#282061]/45"><span>{new URL(websiteUrl || 'https://appzyna.online').hostname}</span><span className="rounded-full bg-[#F06B3D]/10 px-2 py-1 text-[#F06B3D]">Open</span></div></div><div className="mt-3 grid grid-cols-2 gap-2"><div className="h-16 rounded-xl bg-white" /><div className="h-16 rounded-xl bg-white" /></div></div>
      </div>
    </div>
  );
}

const steps = [
  { id: 1, label: 'Website', icon: Globe2 },
  { id: 2, label: 'Analyze', icon: Search },
  { id: 3, label: 'Customize', icon: Palette },
  { id: 4, label: 'Preview', icon: FileText },
  { id: 5, label: 'Publish', icon: PartyPopper },
];

export function CreateAppFlow() {
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState('');
  const [publishMessage, setPublishMessage] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [draft, setDraft] = useState<CreateDraft>({ websiteUrl: '', analysis: null, copy: null, appName: '', logoUrl: '', color: '#6D48D8', category: 'Website' });

  const currentCopy = draft.copy;
  const isReady = Boolean(draft.analysis && currentCopy && draft.appName.trim());
  const sourceLabel = draft.analysis?.source === 'ai' ? 'AI enriched' : 'Website content fallback';
  const updateCopy = (key: 'shortDesc' | 'fullDesc' | 'howItWorks', value: string) => setDraft((current) => current.copy ? { ...current, copy: { ...current.copy, [key]: value } } : current);

  async function handleAnalyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAnalysisError('');
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: draft.websiteUrl }) });
      const payload = await response.json() as AnalyzeResult & { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) throw new Error(payload.error || 'We could not read that website.');
      setDraft((current) => ({ ...current, websiteUrl: payload.scraped.url, analysis: payload, copy: payload.generated, appName: payload.generated.appName, category: payload.generated.category }));
      setStep(2);
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : 'We could not read that website.');
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleLogo(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setDraft((current) => ({ ...current, logoUrl: String(reader.result ?? '') }));
    reader.readAsDataURL(file);
  }

  async function handlePublish() {
    if (!isReady || !currentCopy) return;
    setPublishMessage('');
    const slug = `${draft.appName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now().toString(36)}`;
    const supabase = getSupabaseBrowserClient();
    let savedRemotely = false;
    if (supabase) {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const { error } = await supabase.from('apps').insert({ owner_id: data.user.id, app_name: draft.appName, website_url: draft.websiteUrl, description: currentCopy.fullDesc, short_desc: currentCopy.shortDesc, full_desc: currentCopy.fullDesc, features: currentCopy.features, logo_url: draft.logoUrl || null, category: draft.category, slug, rating: 0, downloads: 0, is_published: true });
        savedRemotely = !error;
      }
    }
    localStorage.setItem('appzyna_last_published_app', JSON.stringify({ ...draft, slug, publishedAt: new Date().toISOString() }));
    setIsPublished(true);
    setPublishMessage(savedRemotely ? 'Your app is published to Appzyna.' : 'Your app is ready in this workspace. Connect your Supabase session to sync it to the store.');
    setStep(5);
  }

  const stepTitle = useMemo(() => ({ 1: 'Start with a real website.', 2: 'We found the source signal.', 3: 'Make it yours.', 4: 'See the app before you publish.', 5: isPublished ? 'Your app is ready for the store.' : 'Review and publish.' }[step]), [isPublished, step]);

  return (
    <div className="mx-auto max-w-[1320px] px-5 py-8 sm:px-8 sm:py-12 lg:px-12">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><Link href="/dashboard" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#282061]/55 hover:text-[#F06B3D]"><ArrowLeft className="h-4 w-4" /> Back to dashboard</Link><p className="text-[0.66rem] font-black uppercase tracking-[0.22em] text-[#F06B3D]">Create a new app</p><h1 className="mt-3 font-display text-4xl font-black tracking-[-0.06em] text-[#17152B] sm:text-6xl">{stepTitle}</h1></div><div className="rounded-xl bg-white px-4 py-3 text-xs font-bold text-[#282061]/55 shadow-sm"><span className="text-[#F06B3D]">Step {step}</span> of 5</div></div>
      <div className="mt-10 grid gap-3 sm:grid-cols-5">{steps.map((item) => { const Icon = item.icon; const active = item.id === step; const complete = item.id < step; return <button type="button" key={item.id} onClick={() => item.id <= step && setStep(item.id)} className={`flex items-center gap-3 rounded-xl border px-3 py-3 text-left transition ${active ? 'border-[#F06B3D] bg-[#F06B3D] text-white shadow-lg' : complete ? 'border-[#6D48D8]/20 bg-white text-[#282061]' : 'border-[#282061]/10 bg-white/60 text-[#282061]/45'}`}><span className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black ${active ? 'bg-white/20' : complete ? 'bg-[#6D48D8]/10 text-[#6D48D8]' : 'bg-[#282061]/5'}`}>{complete ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}</span><span className="hidden text-xs font-black sm:block">{item.label}</span></button>; })}</div>

      <div className="mt-8 rounded-[26px] border border-[#282061]/10 bg-white p-5 shadow-[0_18px_40px_rgba(40,32,97,0.08)] sm:p-8">
        {step === 1 && <form onSubmit={handleAnalyze} className="mx-auto max-w-3xl py-8 sm:py-16"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#6D48D8]/10 text-[#6D48D8]"><Globe2 className="h-8 w-8" /></div><h2 className="mt-7 text-center font-display text-3xl font-black tracking-[-0.05em]">What website are we turning into an app?</h2><p className="mx-auto mt-3 max-w-lg text-center text-sm leading-6 text-[#282061]/55">Paste the real URL. Appzyna will read its title, favicon, headings, and first paragraph before creating the listing.</p><div className="mt-8 flex flex-col gap-3 rounded-2xl border border-[#282061]/10 bg-[#F4F4F7] p-2 sm:flex-row"><input required value={draft.websiteUrl} onChange={(event) => setDraft((current) => ({ ...current, websiteUrl: event.target.value }))} placeholder="natis.com or tictactoe.com" className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm font-semibold outline-none placeholder:text-[#282061]/35" /><button disabled={isAnalyzing} type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F06B3D] px-6 py-3.5 text-sm font-black text-white transition hover:bg-[#D9572C] disabled:opacity-60">{isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} {isAnalyzing ? 'Reading website...' : 'Analyze website'}</button></div>{analysisError && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{analysisError}</p>}<p className="mt-4 text-center text-xs text-[#282061]/40">Analysis happens on the server. AI keys never reach your browser.</p></form>}

        {step === 2 && draft.analysis && currentCopy && <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]"><div className="rounded-2xl bg-[#F4F4F7] p-5"><div className="flex items-center gap-3"><img src={draft.analysis.scraped.favicon} alt="" className="h-12 w-12 rounded-xl bg-white object-contain p-2" /><div className="min-w-0"><p className="truncate font-display text-xl font-black text-[#282061]">{draft.analysis.scraped.title}</p><a href={draft.analysis.scraped.url} target="_blank" rel="noreferrer" className="mt-1 inline-flex max-w-full items-center gap-1 truncate text-xs font-bold text-[#F06B3D]">{draft.analysis.scraped.url}<ExternalLink className="h-3 w-3 shrink-0" /></a></div></div><div className="mt-6 space-y-4"><div><p className="eyebrow">Detected type</p><p className="mt-2 inline-flex rounded-full bg-[#6D48D8]/10 px-3 py-1.5 text-sm font-black text-[#6D48D8]">{draft.analysis.detectedType}</p></div><div><p className="eyebrow">Real headings</p><div className="mt-2 space-y-2">{draft.analysis.scraped.headings.slice(0, 5).map((heading) => <p key={heading} className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#282061]/70">{heading}</p>)}</div></div><div><p className="eyebrow">First paragraph</p><p className="mt-2 text-sm leading-6 text-[#282061]/60">{draft.analysis.scraped.firstParagraph || 'No paragraph tag was found; the generated copy uses the real title and headings.'}</p></div></div></div><div><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="eyebrow">Listing draft</p><h2 className="mt-2 font-display text-2xl font-black">{sourceLabel}</h2></div>{draft.analysis.notice && <span className="inline-flex items-center gap-2 rounded-full bg-[#F7B15B]/20 px-3 py-2 text-xs font-bold text-[#9D5D11]"><Sparkles className="h-3.5 w-3.5" /> {draft.analysis.notice}</span>}</div><div className="mt-6 space-y-5"><label className="field-label">App name<input value={draft.appName} onChange={(event) => setDraft((current) => ({ ...current, appName: event.target.value }))} className="field-input" /></label><label className="field-label">Short description <span className="float-right normal-case tracking-normal text-[#282061]/35">{currentCopy.shortDesc.length}/80</span><input value={currentCopy.shortDesc} onChange={(event) => updateCopy('shortDesc', event.target.value.slice(0, 80))} className="field-input" /></label><label className="field-label">Full description — editable<textarea value={currentCopy.fullDesc} onChange={(event) => updateCopy('fullDesc', event.target.value)} rows={8} className="field-input resize-y leading-6" /></label><label className="field-label">How it works<textarea value={currentCopy.howItWorks} onChange={(event) => updateCopy('howItWorks', event.target.value)} rows={3} className="field-input resize-y leading-6" /></label></div><button type="button" onClick={() => setStep(3)} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#282061] px-5 py-3.5 text-sm font-black text-white transition hover:bg-[#F06B3D]">Continue to customize <ArrowRight className="h-4 w-4" /></button></div></div>}

        {step === 3 && currentCopy && <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-[1fr_0.8fr]"><div><p className="eyebrow">Make the listing yours</p><h2 className="mt-2 font-display text-3xl font-black">Customize your app.</h2><div className="mt-7 space-y-5"><label className="field-label">App name<input value={draft.appName} onChange={(event) => setDraft((current) => ({ ...current, appName: event.target.value }))} className="field-input" /></label><div className="grid gap-5 sm:grid-cols-2"><label className="field-label">Category<select value={draft.category} onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value as CreateDraft['category'], copy: current.copy ? { ...current.copy, category: event.target.value as CreateDraft['category'] } : current.copy }))} className="field-input"><option>Website</option><option>Shop</option><option>Game</option></select></label><label className="field-label">Brand color<div className="mt-2.5 flex items-center gap-3 rounded-2xl border border-[#282061]/10 bg-white px-4 py-2.5"><input type="color" value={draft.color} onChange={(event) => setDraft((current) => ({ ...current, color: event.target.value }))} className="h-9 w-12 cursor-pointer rounded-lg border-0 bg-transparent" /><span className="text-sm font-bold text-[#282061]/60">{draft.color}</span></div></label></div><label className="field-label">Logo upload<div className="mt-2.5 flex items-center gap-4 rounded-2xl border border-dashed border-[#282061]/20 bg-[#F4F4F7] p-4"><span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white text-[#6D48D8]">{draft.logoUrl ? <img src={draft.logoUrl} alt="Uploaded app logo" className="h-full w-full object-cover" /> : <ImagePlus className="h-5 w-5" />}</span><span className="flex-1 text-xs leading-5 text-[#282061]/55">Upload a square logo for the app store card.</span><input type="file" accept="image/*" onChange={handleLogo} className="max-w-[140px] text-xs font-bold text-[#282061]" /></div></label></div><button type="button" onClick={() => setStep(4)} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#282061] px-5 py-3.5 text-sm font-black text-white transition hover:bg-[#F06B3D]">Preview app <ArrowRight className="h-4 w-4" /></button></div><div className="rounded-2xl bg-[#F4F4F7] p-6"><p className="eyebrow">Store identity</p><div className="mt-6 rounded-2xl p-5 text-white" style={{ background: `linear-gradient(135deg, ${draft.color}, #F06B3D)` }}><p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-white/70">{draft.category}</p><p className="mt-12 font-display text-3xl font-black tracking-[-0.05em]">{draft.appName || 'Your app'}</p><p className="mt-2 text-sm text-white/75">{currentCopy.shortDesc}</p></div></div></div>}

        {step === 4 && currentCopy && <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1fr]"><div className="rounded-2xl bg-[#F4F4F7] p-8"><p className="eyebrow">Phone preview</p><h2 className="mt-3 font-display text-3xl font-black">A quick look before launch.</h2><p className="mt-4 text-sm leading-6 text-[#282061]/55">Your app card uses the real source title and editable listing content. Go back to change anything before publishing.</p><div className="mt-7 flex flex-wrap items-center gap-4"><button type="button" onClick={() => setStep(3)} className="inline-flex items-center gap-2 text-sm font-black text-[#282061] hover:text-[#F06B3D]"><Edit3 className="h-4 w-4" /> Edit customization</button><button type="button" onClick={() => setStep(5)} className="inline-flex items-center gap-2 rounded-xl bg-[#F06B3D] px-5 py-3.5 text-sm font-black text-white transition hover:bg-[#D9572C]">Continue to publish <ArrowRight className="h-4 w-4" /></button></div></div><PhonePreview appName={draft.appName} logoUrl={draft.logoUrl} color={draft.color} websiteUrl={draft.websiteUrl} shortDesc={currentCopy.shortDesc} /></div>}

        {step === 5 && currentCopy && <div className="mx-auto max-w-3xl"><div className="rounded-2xl bg-gradient-to-br from-[#321477] via-[#6733A7] to-[#F06B3D] p-7 text-white sm:p-10"><div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15"><Wand2 className="h-6 w-6 text-[#F7B15B]" /></span><div><p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-white/60">Ready to publish</p><h2 className="mt-1 font-display text-3xl font-black">{draft.appName}</h2></div></div><div className="mt-8 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-white/10 p-4"><p className="text-[0.62rem] font-black uppercase tracking-[0.16em] text-white/55">Category</p><p className="mt-2 font-bold">{draft.category}</p></div><div className="rounded-xl bg-white/10 p-4"><p className="text-[0.62rem] font-black uppercase tracking-[0.16em] text-white/55">Source</p><p className="mt-2 truncate font-bold">{draft.websiteUrl}</p></div></div><p className="mt-7 text-sm leading-7 text-white/78">{currentCopy.fullDesc}</p></div>{publishMessage && <p className="mt-5 rounded-xl bg-[#F7B15B]/20 px-4 py-3 text-sm font-bold text-[#8A520C]">{publishMessage}</p>}{!isPublished && <button type="button" onClick={handlePublish} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#F06B3D] px-6 py-4 text-sm font-black text-white transition hover:bg-[#D9572C]">Publish to Appzyna <ArrowRight className="h-4 w-4" /></button>}{isPublished && <Link href="/dashboard" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#282061] px-6 py-4 text-sm font-black text-white transition hover:bg-[#F06B3D]">Back to dashboard <ArrowRight className="h-4 w-4" /></Link>}<button type="button" onClick={() => setStep(4)} className="ml-4 text-sm font-bold text-[#282061]/55 hover:text-[#F06B3D]">Back to preview</button></div>}
      </div>
    </div>
  );
}
