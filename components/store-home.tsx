'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Star, Sparkles, LayoutGrid, Gamepad2, Utensils, ShoppingBag, GraduationCap, BriefcaseBusiness, Store } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { StoreBottomNav, StoreFooter, StoreHeader } from './store-shell';

type StoreAppRecord = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  icon_url: string | null;
  logo_url: string | null;
  rating: number | string | null;
  downloads: number | null;
  owner_id: string;
  developerName: string;
};

const baseCategories = [
  { name: 'All', icon: LayoutGrid },
  { name: 'Games', icon: Gamepad2 },
  { name: 'Food', icon: Utensils },
  { name: 'Shop', icon: ShoppingBag },
  { name: 'Education', icon: GraduationCap },
  { name: 'Business', icon: BriefcaseBusiness },
];

function getCategoryIcon(category: string) {
  const normalized = category.toLowerCase();
  if (normalized.includes('game')) return Gamepad2;
  if (normalized.includes('food')) return Utensils;
  if (normalized.includes('shop') || normalized.includes('fashion')) return ShoppingBag;
  if (normalized.includes('education')) return GraduationCap;
  if (normalized.includes('business')) return BriefcaseBusiness;
  return Store;
}

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0] ?? '').join('').toUpperCase() || 'A';
}

export function StoreHome() {
  const [apps, setApps] = useState<StoreAppRecord[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadPublishedApps() {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        if (mounted) setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('apps')
        .select('id, slug, name, app_name, category, description, short_desc, icon_url, logo_url, rating, downloads, owner_id')
        .or('status.eq.Published,is_published.eq.true')
        .order('created_at', { ascending: false });

      if (!mounted) return;
      if (error) {
        setLoadError(true);
        setIsLoading(false);
        return;
      }

      const rows = data ?? [];
      const ownerIds = Array.from(new Set(rows.map((row) => row.owner_id).filter(Boolean)));
      let namesByOwner: Record<string, string> = {};
      if (ownerIds.length) {
        const { data: profiles } = await supabase.from('users').select('id, name, full_name, business_name').in('id', ownerIds);
        namesByOwner = Object.fromEntries((profiles ?? []).map((profile) => [
          profile.id,
          profile.business_name || profile.name || profile.full_name || 'App developer',
        ]));
      }

      if (!mounted) return;
      setApps(rows.map((row) => ({
        id: row.id,
        slug: row.slug,
        name: row.name || row.app_name || 'Untitled app',
        category: row.category || 'Other',
        description: row.description || row.short_desc || '',
        icon_url: row.icon_url,
        logo_url: row.logo_url,
        rating: row.rating,
        downloads: row.downloads,
        owner_id: row.owner_id,
        developerName: namesByOwner[row.owner_id] || 'App developer',
      })));
      setIsLoading(false);
    }

    void loadPublishedApps();
    return () => { mounted = false; };
  }, []);

  const availableCategories = useMemo(() => {
    const dynamic = Array.from(new Set(apps.map((app) => app.category))).filter(
      (name) => !baseCategories.some((item) => item.name.toLowerCase() === name.toLowerCase()),
    );
    return [...baseCategories.map((item) => item.name), ...dynamic];
  }, [apps]);

  const filteredApps = useMemo(() => apps.filter((app) => {
    const matchesCategory = category === 'All' || app.category.toLowerCase() === category.toLowerCase();
    const searchText = `${app.name} ${app.description} ${app.category} ${app.developerName}`.toLowerCase();
    return matchesCategory && searchText.includes(query.trim().toLowerCase());
  }), [apps, category, query]);

  const groupedApps = useMemo(() => {
    const groups = new Map<string, StoreAppRecord[]>();
    filteredApps.forEach((app) => groups.set(app.category, [...(groups.get(app.category) ?? []), app]));
    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredApps]);

  const selectedCategory = baseCategories.find((item) => item.name === category);
  const SelectedIcon = selectedCategory?.icon ?? getCategoryIcon(category);

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-[#202124]">
      <StoreHeader />
      <main>
        <section className="border-b border-[#e8eaf0] bg-gradient-to-br from-white via-[#f8faff] to-[#f2f5ff]">
          <div className="mx-auto max-w-[1240px] px-5 pb-8 pt-10 sm:px-8 sm:pb-10 sm:pt-14 lg:px-10">
            <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#e5e9f4] bg-white px-3 py-1.5 text-xs font-semibold text-[#5f6368] shadow-sm">
                  <Sparkles className="h-3.5 w-3.5 text-[#6750a4]" /> Discover on Appzyna
                </div>
                <h1 className="mt-5 text-4xl font-bold leading-tight tracking-[-0.045em] text-[#202124] sm:text-5xl">
                  Find your next<br className="hidden sm:block" /> favourite app.
                </h1>
                <p className="mt-3 max-w-xl text-base leading-7 text-[#5f6368]">
                  Explore apps from local creators, all in one place.
                </p>
              </div>
              <div id="search" className="flex w-full max-w-[460px] items-center gap-3 rounded-2xl border border-[#e1e4eb] bg-white px-4 py-3.5 shadow-sm transition focus-within:border-[#6750a4] focus-within:shadow-md">
                <Search className="h-5 w-5 shrink-0 text-[#6f7278]" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search apps and games"
                  aria-label="Search apps and games"
                  className="w-full bg-transparent text-sm text-[#202124] outline-none placeholder:text-[#858991]"
                />
                {query && <button type="button" onClick={() => setQuery('')} className="text-xs font-semibold text-[#6750a4]">Clear</button>}
              </div>
            </div>

            <div className="store-scrollbar mt-8 flex gap-2 overflow-x-auto pb-1" aria-label="App categories">
              {availableCategories.map((item) => {
                const Icon = baseCategories.find((candidate) => candidate.name.toLowerCase() === item.toLowerCase())?.icon ?? getCategoryIcon(item);
                const active = category.toLowerCase() === item.toLowerCase();
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${active ? 'border-[#6750a4] bg-[#6750a4] text-white shadow-sm' : 'border-[#e1e4eb] bg-white text-[#4c5056] hover:border-[#c5badf] hover:bg-[#f8f6fc]'}`}
                  >
                    <Icon className="h-4 w-4" /> {item}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1240px] px-5 py-9 sm:px-8 sm:py-11 lg:px-10">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6750a4]">App library</p>
              <h2 className="mt-1.5 text-2xl font-bold tracking-[-0.035em] text-[#202124] sm:text-3xl">
                {category === 'All' ? 'Browse apps by category' : `${category} apps`}
              </h2>
            </div>
            <span className="text-sm text-[#6f7278]">{filteredApps.length} {filteredApps.length === 1 ? 'app' : 'apps'}</span>
          </div>

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((item) => <div key={item} className="h-36 animate-pulse rounded-2xl border border-[#eceef3] bg-white" />)}
            </div>
          ) : loadError ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-8 text-center">
              <p className="font-semibold text-[#5f4b00]">Apps could not be loaded right now.</p>
              <p className="mt-2 text-sm text-[#766629]">Please refresh the page in a moment.</p>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="rounded-3xl border border-[#e8eaf0] bg-white px-5 py-12 text-center shadow-[0_8px_28px_rgba(27,31,44,0.04)] sm:px-10 sm:py-16">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f2effa] text-[#6750a4]"><SelectedIcon className="h-7 w-7" /></div>
              <h3 className="mt-5 text-xl font-bold tracking-[-0.03em] text-[#202124]">
                {apps.length === 0 ? 'No apps yet - Be the first to publish your app' : 'No apps found'}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6f7278]">
                {apps.length === 0 ? 'New apps will appear here as soon as creators publish them.' : 'Try another category or search term.'}
              </p>
              {(query || category !== 'All') && <button type="button" onClick={() => { setQuery(''); setCategory('All'); }} className="mt-5 rounded-full bg-[#6750a4] px-4 py-2 text-sm font-semibold text-white hover:bg-[#56418b]">Show all apps</button>}
            </div>
          ) : (
            <div className="space-y-10">
              {groupedApps.map(([groupName, group]) => {
                const Icon = getCategoryIcon(groupName);
                return (
                  <section key={groupName} aria-labelledby={`category-${groupName}`}>
                    <div className="mb-4 flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#6750a4] shadow-sm ring-1 ring-[#e8eaf0]"><Icon className="h-4 w-4" /></div>
                      <h3 id={`category-${groupName}`} className="text-lg font-bold text-[#202124]">{groupName}</h3>
                      <span className="rounded-full bg-[#eef0f5] px-2.5 py-1 text-xs font-semibold text-[#6f7278]">{group.length}</span>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {group.map((app) => (
                        <a key={app.id} href={`/app/${encodeURIComponent(app.slug)}`} className="group flex min-w-0 items-center gap-4 rounded-2xl border border-[#e8eaf0] bg-white p-4 shadow-[0_4px_18px_rgba(27,31,44,0.035)] transition hover:-translate-y-0.5 hover:border-[#d8d0eb] hover:shadow-[0_10px_28px_rgba(27,31,44,0.08)]">
                          {app.icon_url || app.logo_url ? (
                            <img src={app.icon_url || app.logo_url || ''} alt="" className="h-14 w-14 shrink-0 rounded-2xl object-cover ring-1 ring-black/5" />
                          ) : (
                            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ede7f6] to-[#dce7ff] text-lg font-bold text-[#6750a4]">{initials(app.name)}</span>
                          )}
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[15px] font-bold text-[#202124] group-hover:text-[#6750a4]">{app.name}</span>
                            <span className="mt-1 block truncate text-sm text-[#6f7278]">{app.developerName}</span>
                            <span className="mt-2 flex items-center gap-1.5 text-xs text-[#6f7278]">
                              <Star className="h-3.5 w-3.5 fill-[#f4b400] text-[#f4b400]" />
                              {Number(app.rating || 0).toFixed(1)} <span className="text-[#c2c5ca]">·</span> {app.category}
                            </span>
                          </span>
                        </a>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </section>
      </main>
      <StoreFooter />
      <StoreBottomNav active="home" />
    </div>
  );
}
