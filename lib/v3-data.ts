export type StoreCategory = 'All' | 'Games' | 'Food' | 'Shop' | 'Education' | 'Business';

export type StoreScreenshot = { label: string; accent: string; detail: string };

export type StoreReview = { name: string; rating: number; comment: string; date: string };

export type StoreApp = {
  id: string;
  slug: string;
  name: string;
  websiteUrl?: string;
  category: Exclude<StoreCategory, 'All'>;
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

export const storeCategories: Array<{ name: Exclude<StoreCategory, 'All'>; emoji: string; tone: string }> = [
  { name: 'Games', emoji: '🎮', tone: 'from-emerald-400 to-cyan-500' },
  { name: 'Food', emoji: '🍲', tone: 'from-orange-400 to-rose-500' },
  { name: 'Shop', emoji: '🛍️', tone: 'from-violet-500 to-fuchsia-500' },
  { name: 'Education', emoji: '🎓', tone: 'from-sky-400 to-indigo-500' },
  { name: 'Business', emoji: '💼', tone: 'from-amber-400 to-orange-500' },
];

export const storeApps: StoreApp[] = [];

export const getStoreApp = (slug: string) => storeApps.find((app) => app.slug === slug);
export const allStoreCategories = storeCategories.map((category) => category.name);
