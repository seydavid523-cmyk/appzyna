import Link from 'next/link';
import { ArrowUpRight, Download, Sparkles } from 'lucide-react';
import type { AppRecord } from '@/lib/types';

export function AppCard({ app, featured = false }: { app: AppRecord; featured?: boolean }) {
  return (
    <article className={`group relative overflow-hidden rounded-[26px] border border-ink/10 bg-white p-3 shadow-card transition duration-300 hover:-translate-y-1.5 hover:shadow-float ${featured ? 'md:p-4' : ''}`}>
      <div className={`relative overflow-hidden rounded-[20px] bg-gradient-to-br ${app.accent} ${featured ? 'min-h-[248px]' : 'min-h-[180px]'}`}>
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border border-white/25 bg-white/10 blur-2xl transition duration-500 group-hover:scale-125" />
        <div className="absolute inset-x-5 top-5 flex items-center justify-between text-[0.6rem] font-black uppercase tracking-[0.2em] text-white/70">
          <span>{app.category}</span>
          <Sparkles className="h-4 w-4 text-[#F7C948]" />
        </div>
        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-white">
          <div>
            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-xl font-black backdrop-blur-sm">{app.icon}</span>
            <h3 className="font-display text-2xl font-black tracking-[-0.04em]">{app.name}</h3>
          </div>
          <span className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm transition group-hover:bg-white group-hover:text-ink"><ArrowUpRight className="h-5 w-5" /></span>
        </div>
      </div>
      <div className="px-2 pb-1 pt-4 sm:px-3 sm:pt-5">
        <p className="line-clamp-2 text-sm leading-6 text-ink/55">{app.description}</p>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-ink/[0.08] pt-3 text-xs font-bold">
          <Link href={`/creator/${app.creatorUsername}`} className="text-ink transition hover:text-purple">By {app.creatorName}</Link>
          <span className="inline-flex items-center gap-1.5 text-ink/45"><Download className="h-3.5 w-3.5" /> {app.downloads}</span>
        </div>
      </div>
    </article>
  );
}
