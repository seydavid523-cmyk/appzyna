# Appzyna V3 TODO

## 1. Customer Store — complete

- The main domain `/` opens the Appzyna Store without requiring a purchased domain; `/store` remains an explicit Store alias.
- Store home hero says “Discover Apps Built In Ghana” and includes the search placeholder “Search apps, fashion, food, shoes...”.
- Trending uses large cards with image, name, category, rating, and Get button.
- Ghanaian example apps include King Shoes (Footwear • Fashion • 4.9 • 1.2k ratings), Accra Food (Food • Local Delivery • 4.8), Ghana Fashion (Fashion • Apparel • 4.7), plus church, music, and games examples.
- Categories include Shops, Food, Fashion, Churches, Music, and Games.
- `/app/[slug]` includes screenshots, description, download button, reviews, rating, and download count.
- Store supports search and category filtering.
- Store has mobile bottom navigation for Home, Store, Search, and Profile.
- Store styling is dark-mode premium, Apple App Store-inspired, clean, and rounded.
- Store Get actions download a ZIP package from `/api/apps/[slug]/download`.

## 2. Creator Portal — complete

- `/creator` opens the Creator Portal on the same main domain; `/portal` remains a compatibility alias.
- Portal landing says “Turn Your Website Into An App In 60 Seconds”.
- Email sign up and login remain available.
- `/dashboard` shows Total Downloads `12,480` with `+842 this month +12%`, Revenue `$3,240` with `+$520 +18%`, a `+ Publish New App` action, the AI Builder card with “Paste Website Link to Create App in 60 seconds”, an input for `https://yourwebsite.com`, and a Generate action.
- My Apps shows name, category, status (`Published` or `Draft`), and downloads.
- Analytics includes a Mon–Sun line chart, peak `2,104 downloads on Sat`, and `+23% vs last week`.
- `/creator/new` uses four steps: paste website URL; AI fills App Name, Description, Category, and generated favicon/icon; upload Icon/Screenshots and choose Category; publish so it appears in the Store.
- Portal has mobile bottom navigation for Dashboard, Apps, Analytics, Build, and Settings.

## 3. Platform behavior — complete

- Supabase provides Auth, Database, and Storage integration points.
- Search and category filters work from the Store UI.
- Clicking Get increments the demo download state, requests a ZIP download, and remains compatible with Supabase persistence when configured.
- App uploads use the `app-assets` Supabase Storage bucket with creator-scoped policies, plus local previews when Storage is not configured.
- The product is mobile-first and responsive.
- Footer reads `Appzyna Store • v3 • Made in Ghana • by King Tech`.
- No lorem ipsum or generic filler is used; visible catalog and analytics content is Ghanaian and concrete.

## 4. Database and delivery — complete

- `users` includes `id`, `email`, `name`, `avatar`, and profile compatibility fields.
- `apps` includes `id`, `owner_id`, `name`, `slug`, `description`, `category`, `icon_url`, `website_url`, `screenshots[]`, `downloads`, `rating`, `status`, and `created_at`.
- `reviews` includes `id`, `app_id`, `user_id`, `rating`, and `comment`.
- Public published app/detail/review reads and creator-owned writes are protected with RLS policies.
- `public/manus-routes.json` includes Store, Creator Portal, Portal compatibility, app detail, dashboard, and creator builder routes.
- Host middleware continues to support optional future domains while path routing works on one domain.
- `pnpm typecheck` and `pnpm build` remain the final validation gates.
