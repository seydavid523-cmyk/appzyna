'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, Search, Star } from 'lucide-react';
import { StoreBottomNav, StoreFooter, StoreHeader } from './store-shell';
import { storeApps, type StoreCategory } from '@/lib/v3-data';

const categories: Array<'All' | Exclude<StoreCategory, 'All'>> = ['All', 'Games', 'Food', 'Shop', 'Education', 'Business'];

export function StoreHome() {
  const [category, setCategory] = useState<'All' | Exclude<StoreCategory, 'All'>>('All');
  const [query, setQuery] = useState('');

  const filteredApps = useMemo(() => {
    if (!storeApps.length) return [];
    return storeApps.filter((app) => {
      const matchesCategory = category === 'All' || app.category === category;
      const haystack = `${app.name} ${app.description} ${app.category} ${app.subcategory}`.toLowerCase();
      return matchesCategory && haystack.includes(query.toLowerCase());
    });
  }, [category, query]);

  const emptyMessage = 'No apps yet - Be the first to publish your app';

  return (
    <div className="min-h-screen bg-[#0a0a0d] text-white">
      <StoreHeader />

      <main className="mx-auto max-w-[1280px] px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="hidden md:block text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Discover</div>
          <div className="flex w-full max-w-xl items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/60 md:ml-auto">
            <Search className="h-4 w-4" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search apps, games, food, shops..."
              className="w-full bg-transparent text-white placeholder:text-white/40 focus:outline-none"
            />
          </div>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-1">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={[
                'whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition',
                category === item ? 'bg-white text-[#0a0a0d]' : 'bg-white/5 text-white/70 hover:bg-white/10',
              ].join(' ')}
            >
              {item}
            </button>
          ))}
        </div>

        {filteredApps.length === 0 ? (
          <section className="space-y-8">
            <div className="rounded-[28px] border border-white/10 bg-[#15181d] p-8 text-center shadow-2xl shadow-black/20">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#1a73e8]/10 text-3xl text-[#8ab4ff]">📱</div>
              <h1 className="text-3xl font-bold tracking-[-0.04em] text-white">{emptyMessage}</h1>
              <p className="mt-3 text-sm text-white/60">The App Store is empty until a business publishes their first app through the Portal.</p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {['Featured Apps', 'Top Charts', 'New Apps'].map((section) => (
                <div key={section} className="rounded-[24px] border border-white/10 bg-[#15181d] p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold tracking-[-0.03em] text-white">{section}</h2>
                    <button type="button" className="text-sm text-[#8ab4ff]">See all</button>
                  </div>
                  <div className="space-y-3">
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-white/50">
                      No apps yet
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="space-y-8">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredApps.map((app) => (
                <article key={app.id} className="overflow-hidden rounded-[22px] border border-white/10 bg-[#15181d] shadow-xl shadow-black/10">
                  <div className={`h-28 bg-gradient-to-r ${app.accent}`} />
                  <div className="p-4">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-sm font-black text-white">{app.icon}</div>
                        <div>
                          <h3 className="text-base font-bold text-white">{app.name}</h3>
                          <p className="text-xs text-white/60">{app.creatorName}</p>
                        </div>
                      </div>
                      <button type="button" className="rounded-full bg-[#1a73e8] px-3 py-1.5 text-xs font-semibold text-white">Install</button>
                    </div>
                    <div className="mb-3 flex items-center gap-2 text-xs text-white/70">
                      <Star className="h-3.5 w-3.5 fill-[#facc15] text-[#facc15]" />
                      <span>{app.rating}</span>
                      <span className="text-white/40">•</span>
                      <span>{app.category}</span>
                    </div>
                    <p className="line-clamp-2 text-sm text-white/70">{app.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <StoreFooter />
      <StoreBottomNav />
    </div>
  );
}
