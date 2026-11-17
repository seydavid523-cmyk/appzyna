export type StoreCategory = 'Shops' | 'Food' | 'Fashion' | 'Churches' | 'Music' | 'Games' | 'Education' | 'Business' | 'Services' | 'Other';

export type StoreScreenshot = { label: string; accent: string; detail: string };

export type StoreReview = { name: string; rating: number; comment: string; date: string };

export type StoreApp = {
  id: string;
  slug: string;
  name: string;
  websiteUrl?: string;
  category: StoreCategory;
  subcategory: string;
  description: string;
  longDescription: string;
  accent: string;
  icon: string;
  creatorName: string;
  creatorUsername: string;
  rating: number;
  ratingCount: string;
  downloads: string;
  tags: string[];
  screenshots: StoreScreenshot[];
  reviews: StoreReview[];
  isFeatured?: boolean;
  status: 'Published' | 'Draft';
};

export const storeCategories: Array<{ name: StoreCategory; emoji: string; tone: string }> = [
  { name: 'Shops', emoji: '🛍️', tone: 'from-violet-500 to-fuchsia-500' },
  { name: 'Food', emoji: '🍲', tone: 'from-orange-400 to-rose-500' },
  { name: 'Fashion', emoji: '👟', tone: 'from-amber-300 to-orange-500' },
  { name: 'Churches', emoji: '✦', tone: 'from-sky-400 to-indigo-500' },
  { name: 'Music', emoji: '🎧', tone: 'from-pink-400 to-purple-600' },
  { name: 'Games', emoji: '🎮', tone: 'from-emerald-400 to-cyan-500' },
  { name: 'Education', emoji: '🎓', tone: 'from-sky-400 to-indigo-500' },
  { name: 'Business', emoji: '💼', tone: 'from-amber-400 to-orange-500' },
  { name: 'Services', emoji: '🧰', tone: 'from-teal-400 to-cyan-500' },
];

// The catalog is populated from published Supabase records in the store UI.
// Keep this fallback empty so sample/demo listings cannot reappear in production.
export const storeApps: StoreApp[] = [];

export const getStoreApp = (slug: string) => storeApps.find((app) => app.slug === slug);
export const allStoreCategories = storeCategories.map((category) => category.name);
