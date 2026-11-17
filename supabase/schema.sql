create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null default '',
  full_name text,
  business_name text,
  username text unique,
  avatar text,
  avatar_url text,
  bio text,
  created_at timestamptz not null default now()
);

create table if not exists public.apps (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.users(id) on delete cascade,
  name text not null default '',
  app_name text not null default '',
  slug text not null unique,
  description text not null default '',
  short_desc text not null default '',
  full_desc text not null default '',
  category text not null default 'Shops',
  icon_url text,
  logo_url text,
  website_url text not null default '',
  screenshots text[] not null default '{}',
  features jsonb not null default '[]'::jsonb,
  downloads integer not null default 0,
  rating numeric(3,2) not null default 0,
  status text not null default 'Draft' check (status in ('Published', 'Draft')),
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  app_id uuid not null references public.apps(id) on delete cascade,
  user_id uuid references public.users(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  comment text not null default '',
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;
alter table public.apps enable row level security;
alter table public.reviews enable row level security;

create policy "Public profiles are viewable by everyone" on public.users for select using (true);
create policy "Users can create their own profile" on public.users for insert with check (auth.uid() = id);
create policy "Users can update their own profile" on public.users for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "Published apps are viewable by everyone" on public.apps for select using (status = 'Published' or is_published = true or auth.uid() = owner_id);
create policy "Creators can create their own apps" on public.apps for insert with check (auth.uid() = owner_id);
create policy "Creators can update their own apps" on public.apps for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "Public reviews are viewable by everyone" on public.reviews for select using (true);
create policy "Signed-in users can write reviews" on public.reviews for insert with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('app-assets', 'app-assets', true)
on conflict (id) do update set public = excluded.public;

create policy "Public app assets are viewable by everyone" on storage.objects
for select using (bucket_id = 'app-assets');
create policy "Creators can upload their app assets" on storage.objects
for insert to authenticated
with check (bucket_id = 'app-assets' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Creators can update their app assets" on storage.objects
for update to authenticated
using (bucket_id = 'app-assets' and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id = 'app-assets' and (storage.foldername(name))[1] = auth.uid()::text);

create or replace function public.increment_app_downloads(app_slug text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.apps set downloads = downloads + 1 where slug = app_slug;
$$;
