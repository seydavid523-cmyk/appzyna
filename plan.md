# Appzyna by King Tech — V3 platform plan

## Product scope

Appzyna V3 is a Ghana-built, two-sided app store platform. Customers discover and open apps on `appzyna.shop`; creators and business owners build and publish apps on `appzyna.online`. The existing Phase 1/2 Supabase-ready auth, website analyzer, and creator profile foundation is retained while the public experience becomes a premium store and the portal becomes a focused creator workspace.

## Serving model

Use one Next.js 14 App Router deployment that works without purchased domains: the main domain `/` renders the Store, `/creator` renders the Creator Portal, and `/creator/new` starts the builder. Optional future domains remain supported by middleware (`appzyna.shop` → Store and `appzyna.online` → Portal). Preview exposes `/store` and `/portal` as explicit aliases. Store Get actions request a generated ZIP package from `/api/apps/[slug]/download`.

## Design direction

Chosen direction: **Ghanaian night-market premium**. The Store uses a dark premium shell inspired by Apple App Store browsing: near-black navy surfaces, high-contrast white typography, rounded glassy cards, and vivid violet/orange gradients used sparingly for active states and app art. The Portal uses a brighter workspace surface but shares the same purple `#7C3AED` and orange `#F97316` brand gradient.

Core principles are discovery-first hierarchy, mobile-native thumb reach, real local examples instead of filler, clear download intent, and a credible creator workflow. The layout paradigm is a layered app-store canvas: a full-bleed hero/search zone, horizontal rails for trending and categories, and detail pages with a strong app identity header. Signature elements are Ghana flag accents, rounded app art tiles with gradient depth, and compact metadata chips for category/rating/downloads. Motion is limited to quick card lift, gradient shimmer on primary actions, and smooth horizontal rails; never block reading or form completion.

Typography uses a heavy geometric display face for app and section names paired with a neutral system sans for metadata and forms. Brand voice is direct, proud, and local: “Discover apps built in Ghana.” and “Publish the next app your customers keep coming back to.” The logo remains the connected-node Appzyna mark with the `by King Tech` lockup.

## Store implementation

- Render the Store at the main `/` route, with `/store` as a stable explicit alias and optional host middleware for future domains.
- Add `/app/[slug]` with app screenshots, description, features, reviews, website link, rating, downloads, and a Get button.
- Add query-driven search and category filtering without requiring a new backend table for the demo catalog.
- Add responsive bottom navigation for Home, Store, Search, and Profile.
- Seed real Ghanaian examples: King Shoes, Accra Food, Ghana Fashion, House of Grace, Aseda Music, and Oware Arena. No lorem ipsum or generic filler.

## Portal implementation

- Add `/creator` as the single-domain Creator Portal entry point, with `/portal` retained as a compatibility alias.
- Update `/dashboard` with the required stats, AI Builder card, app list, analytics line chart, and portal bottom navigation.
- Add `/creator/new` as the V3 four-step builder: website URL, AI auto-fill with generated icon, uploads/category, and publish.
- Reuse the existing `/api/analyze` server endpoint and Supabase browser client. Publish writes to Supabase when an authenticated session is available and remains demo-safe otherwise.
- Preserve `/login`, `/signup`, `/creator/[username]`, and `/create` as compatibility routes while directing new creator work to `/creator/new`.

## Data and deployment

- Extend `supabase/schema.sql` with `users`, `apps`, and `reviews`, including screenshots, status, ratings, downloads, and creator ownership policies.
- Use Supabase Storage-compatible URL fields for icons and screenshots, with local previews when Storage is unavailable.
- Generate a downloadable ZIP package for each Store app containing its listing manifest, README, and source website handoff metadata.
- Keep `public/manus-routes.json` synchronized with `/`, `/creator`, `/store`, `/portal`, `/app/:slug`, and `/api` excluded from page declarations.
- Deploy remains Vercel-compatible through the existing Next.js build; domain DNS and production environment variables are external deployment configuration.

## Project structure

- `app/` — host-aware Store/Portal pages, app details, dashboard, creator builder, and API routes.
- `components/` — Store navigation/cards, app detail surfaces, portal analytics, creator builder, brand, and auth UI.
- `lib/` — Ghanaian catalog data, shared app/review types, host helpers, Supabase browser client, and analyzer.
- `supabase/schema.sql` — V3 users, apps, reviews, and RLS policies.
- `public/` — route manifest and project icon.
