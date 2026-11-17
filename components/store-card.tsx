import Link from 'next/link';
import { ArrowUpRight, Download, Star } from 'lucide-react';
import type { StoreApp } from '@/lib/v3-data';
import { StoreGetButton } from './store-get-button';

export function StoreCard({ app, featured = false }: { app: StoreApp; featured?: boolean }) {
  return (
    <article className={`group overflow-hidden rounded-2xl border border-[#e8eaf0] bg-white shadow-[0_4px_18px_rgba(27,31,44,0.04)] transition duration-300 hover:-translate-y-1 hover:border-[#d8d0eb] hover:shadow-[0_12px_30px_rgba(27,31,44,0.1)] ${featured ? 'min-h-[270px]' : ''}`}>
      {featured && <div className={`h-28 bg-gradient-to-r ${app.accent}`} />}
      <div className="p-5">
        <div className="flex items-start gap-4">
          <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${app.accent} text-sm font-black text-white shadow-sm`}>{app.icon}</span>
          <div className="min-w-0 flex-1">
            <Link href={`/app/${app.slug}`} className="flex items-start justify-between gap-2">
              <span className="truncate text-base font-bold text-[#202124] transition group-hover:text-[#6750a4]">{app.name}</span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-[#8b8e95]" />
            </Link>
            <p className="mt-1 truncate text-sm text-[#6f7278]">{app.creatorName}</p>
          </div>
        </div>
        <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#5f6368]">{app.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-[#f0f1f4] pt-3 text-xs text-[#6f7278]">
          <span className="inline-flex items-center gap-1 font-semibold text-[#3c4043]"><Star className="h-3.5 w-3.5 fill-[#f4b400] text-[#f4b400]" />{Number(app.rating).toFixed(1)}</span>
          <span>{app.category}</span>
          <span className="inline-flex items-center gap-1"><Download className="h-3.5 w-3.5" />{app.downloads}</span>
          <span className="ml-auto"><StoreGetButton slug={app.slug} /></span>
        </div>
      </div>
    </article>
  );
}
