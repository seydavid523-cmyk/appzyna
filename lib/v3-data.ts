export type StoreCategory = 'Shops' | 'Food' | 'Fashion' | 'Churches' | 'Music' | 'Games';

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
];

export const storeApps: StoreApp[] = [
  {
    id: 'king-shoes', slug: 'king-shoes', name: 'King Shoes', category: 'Fashion', subcategory: 'Footwear',
    description: 'Fresh kicks and everyday pairs, delivered across Accra.',
    longDescription: 'King Shoes brings Ghana’s sneaker culture to your phone. Browse new drops, compare everyday trainers, save the pairs you want, and message the shop for sizing or delivery around Accra and Kumasi.',
    accent: 'from-[#4C1D95] via-[#7C3AED] to-[#F97316]', icon: 'KS', creatorName: 'King Shoes GH', creatorUsername: 'kingshoes', rating: 4.9, ratingCount: '1.2k ratings', downloads: '18.6k',
    tags: ['Sneakers', 'Accra delivery', 'Footwear'],
    screenshots: [{ label: 'New drops', accent: 'from-[#7C3AED] to-[#F97316]', detail: 'Limited pairs, fresh every Friday.' }, { label: 'Shop by style', accent: 'from-[#0F172A] to-[#475569]', detail: 'Run, court, street, and everyday.' }, { label: 'Easy delivery', accent: 'from-[#EA580C] to-[#FBBF24]', detail: 'Track your pair from checkout to doorstep.' }],
    reviews: [{ name: 'Ama K.', rating: 5, comment: 'The Accra delivery updates are so helpful. My pair arrived exactly when they said.', date: '2 days ago' }, { name: 'Kojo M.', rating: 5, comment: 'Great selection and the new-drop alerts are on point.', date: '1 week ago' }], isFeatured: true, status: 'Published',
  },
  {
    id: 'accra-food', slug: 'accra-food', name: 'Accra Food', category: 'Food', subcategory: 'Local Delivery',
    description: 'Waakye, jollof, banku, and your next local favourite.',
    longDescription: 'Accra Food helps you find trusted local meals without the group-chat back and forth. Discover restaurants and home cooks, check today’s menu, and follow delivery from kitchen to your gate.',
    accent: 'from-[#9A3412] via-[#F97316] to-[#FACC15]', icon: 'AF', creatorName: 'Accra Food Co.', creatorUsername: 'accrafood', rating: 4.8, ratingCount: '860 ratings', downloads: '14.2k',
    tags: ['Jollof', 'Delivery', 'Local food'],
    screenshots: [{ label: 'What are you craving?', accent: 'from-[#EA580C] to-[#FACC15]', detail: 'Search dishes from kitchens near you.' }, { label: 'Today’s menu', accent: 'from-[#7C2D12] to-[#FB923C]', detail: 'Fresh plates from local favourites.' }, { label: 'Track your order', accent: 'from-[#166534] to-[#84CC16]', detail: 'Know when your food is on the way.' }],
    reviews: [{ name: 'Yaw T.', rating: 5, comment: 'Finally a simple way to find good food around Osu.', date: '3 days ago' }, { name: 'Efua A.', rating: 4, comment: 'The menu photos make choosing lunch much easier.', date: '2 weeks ago' }], status: 'Published',
  },
  {
    id: 'ghana-fashion', slug: 'ghana-fashion', name: 'Ghana Fashion', category: 'Fashion', subcategory: 'Apparel',
    description: 'Contemporary Ghanaian designers, fabrics, and statement pieces.',
    longDescription: 'Ghana Fashion is a curated home for independent designers from Accra, Kumasi, and Tamale. Explore ready-to-wear looks, discover fabric stories, and connect directly with the makers behind each collection.',
    accent: 'from-[#BE185D] via-[#EC4899] to-[#F97316]', icon: 'GF', creatorName: 'Ghana Fashion House', creatorUsername: 'ghanafashion', rating: 4.7, ratingCount: '640 ratings', downloads: '9.8k',
    tags: ['Designers', 'Kente', 'Apparel'],
    screenshots: [{ label: 'New collection', accent: 'from-[#9D174D] to-[#F9A8D4]', detail: 'Looks made in Ghana, styled your way.' }, { label: 'Meet the makers', accent: 'from-[#312E81] to-[#C084FC]', detail: 'Every piece has a person behind it.' }, { label: 'Save your edit', accent: 'from-[#F97316] to-[#FDE68A]', detail: 'Keep the pieces you cannot stop thinking about.' }],
    reviews: [{ name: 'Naa S.', rating: 5, comment: 'Beautiful brands I would never have found in one place.', date: '5 days ago' }, { name: 'Mawuli D.', rating: 4, comment: 'Love the mix of established and emerging designers.', date: '3 weeks ago' }], status: 'Published',
  },
  {
    id: 'house-of-grace', slug: 'house-of-grace', name: 'House of Grace', category: 'Churches', subcategory: 'Community',
    description: 'Sermons, service times, prayer, and a church family in one place.',
    longDescription: 'House of Grace keeps your church community close through weekly sermons, service reminders, prayer requests, and messages from the ministry team. Stay connected wherever the week takes you.',
    accent: 'from-[#0F766E] via-[#14B8A6] to-[#38BDF8]', icon: 'HG', creatorName: 'House of Grace', creatorUsername: 'houseofgrace', rating: 4.9, ratingCount: '312 ratings', downloads: '5.3k',
    tags: ['Sermons', 'Prayer', 'Community'],
    screenshots: [{ label: 'This week at Grace', accent: 'from-[#0F766E] to-[#38BDF8]', detail: 'Service times and community notes.' }, { label: 'Listen anywhere', accent: 'from-[#164E63] to-[#67E8F9]', detail: 'Catch the message on the move.' }, { label: 'Pray together', accent: 'from-[#4338CA] to-[#A78BFA]', detail: 'Share a request with your church family.' }],
    reviews: [{ name: 'Adwoa P.', rating: 5, comment: 'The sermon reminders help our whole family stay connected.', date: '1 week ago' }], status: 'Published',
  },
  {
    id: 'aseda-music', slug: 'aseda-music', name: 'Aseda Music', category: 'Music', subcategory: 'Gospel & Afrobeats',
    description: 'New Ghanaian sounds, live sessions, and independent artists.',
    longDescription: 'Aseda Music is a listening room for Ghanaian artists. Find new gospel, highlife, afrobeats, and alté releases, follow artists you love, and share the sounds that should travel further.',
    accent: 'from-[#701A75] via-[#C026D3] to-[#FB7185]', icon: 'AM', creatorName: 'Aseda Music', creatorUsername: 'asedamusic', rating: 4.8, ratingCount: '488 ratings', downloads: '7.6k',
    tags: ['Gospel', 'Highlife', 'Afrobeats'],
    screenshots: [{ label: 'Made in Ghana', accent: 'from-[#701A75] to-[#FB7185]', detail: 'A new sound for every mood.' }, { label: 'Live sessions', accent: 'from-[#1E1B4B] to-[#7C3AED]', detail: 'Hear the story behind the song.' }, { label: 'Your rotation', accent: 'from-[#BE123C] to-[#FBBF24]', detail: 'Save artists and tracks for later.' }],
    reviews: [{ name: 'Kweku B.', rating: 5, comment: 'The live sessions are my favourite part of the app.', date: '4 days ago' }], status: 'Published',
  },
  {
    id: 'oware-arena', slug: 'oware-arena', name: 'Oware Arena', category: 'Games', subcategory: 'Board Games',
    description: 'Play the classic Ghanaian strategy game with friends or AI.',
    longDescription: 'Oware Arena brings a classic West African strategy game to a friendly digital table. Play a quick match, challenge a friend, or practice against the AI while you sharpen your counting and capture strategy.',
    accent: 'from-[#065F46] via-[#10B981] to-[#22D3EE]', icon: 'OA', creatorName: 'Oware Arena', creatorUsername: 'owarearena', rating: 4.9, ratingCount: '1.1k ratings', downloads: '22.4k',
    tags: ['Oware', 'Play with friends', 'Strategy'],
    screenshots: [{ label: 'Choose your table', accent: 'from-[#065F46] to-[#34D399]', detail: 'A classic game with a fresh home.' }, { label: 'Play a friend', accent: 'from-[#155E75] to-[#22D3EE]', detail: 'Invite someone to the next round.' }, { label: 'Beat the AI', accent: 'from-[#1E3A8A] to-[#818CF8]', detail: 'Practice your strategy at every level.' }],
    reviews: [{ name: 'Sena Y.', rating: 5, comment: 'A beautiful way to introduce Oware to younger players.', date: '2 days ago' }, { name: 'Kwame A.', rating: 5, comment: 'The quick matches are perfect for a trotro ride.', date: '2 weeks ago' }], status: 'Published',
  },
];

export const getStoreApp = (slug: string) => storeApps.find((app) => app.slug === slug);
export const allStoreCategories = storeCategories.map((category) => category.name);
