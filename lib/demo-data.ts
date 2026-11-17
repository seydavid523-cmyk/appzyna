import type { AppRecord, CreatorProfile } from './types';

export const categories = [
  { name: 'Shops', icon: '⌁', note: 'Sell more' },
  { name: 'Food', icon: '◒', note: 'Serve fresh' },
  { name: 'Games', icon: '✦', note: 'Play loud' },
  { name: 'Fashion', icon: '◌', note: 'Style up' },
  { name: 'Services', icon: '↗', note: 'Book easy' },
  { name: 'Education', icon: '⌘', note: 'Teach well' },
];

export const demoApps: AppRecord[] = [
  {
    id: 'natis',
    name: 'Natis',
    category: 'Community',
    description: 'A bright, local-first app for finding what is happening around you.',
    accent: 'from-[#6C00FF] via-[#8D4CFF] to-[#FF6B00]',
    icon: 'N',
    downloads: '12.4k',
    creatorName: 'Natis Studio',
    creatorUsername: 'natis',
    isFeatured: true,
  },
  {
    id: 'king-tech',
    name: 'King Tech',
    category: 'Services',
    description: 'The home base for launches, experiments, and digital products by King.',
    accent: 'from-[#14121F] via-[#32204D] to-[#6C00FF]',
    icon: 'K',
    downloads: '8.9k',
    creatorName: 'King',
    creatorUsername: 'king',
  },
  {
    id: 'orange-hour',
    name: 'Orange Hour',
    category: 'Fashion',
    description: 'A drop-driven storefront for limited pieces and vivid everyday essentials.',
    accent: 'from-[#FF6B00] via-[#FF9556] to-[#FFE0CB]',
    icon: 'O',
    downloads: '4.6k',
    creatorName: 'Maya Cole',
    creatorUsername: 'mayacole',
  },
];

export const demoCreators: Record<string, CreatorProfile> = {
  king: {
    id: 'demo-king',
    email: 'king@appzyna.online',
    fullName: 'King',
    businessName: 'King Tech',
    username: 'king',
    avatarTone: 'from-[#6C00FF] via-[#9B5CFF] to-[#FF6B00]',
    bio: 'Founder of King Tech and creator of Appzyna. Building the fastest path from a good idea to an app people can keep.',
    totalApps: 14,
    totalDownloads: '38.7k',
    apps: [demoApps[1], { ...demoApps[0], creatorName: 'King', creatorUsername: 'king' }],
  },
  natis: {
    id: 'demo-natis',
    email: 'hello@natis.app',
    fullName: 'Natis Studio',
    businessName: 'Natis',
    username: 'natis',
    avatarTone: 'from-[#00B7FF] via-[#5FE0B5] to-[#F8E16C]',
    bio: 'A small team turning local moments into a place you can discover, share, and come back to.',
    totalApps: 3,
    totalDownloads: '12.4k',
    apps: [demoApps[0]],
  },
  mayacole: {
    id: 'demo-maya',
    email: 'maya@orangehour.co',
    fullName: 'Maya Cole',
    businessName: 'Orange Hour',
    username: 'mayacole',
    avatarTone: 'from-[#FF6B00] via-[#F39A58] to-[#FFE1A8]',
    bio: 'Designer, maker, and collector of small details that make an online shop feel like a real place.',
    totalApps: 1,
    totalDownloads: '4.6k',
    apps: [demoApps[2]],
  },
};

export const getCreator = (username: string) => demoCreators[username.toLowerCase()] ?? demoCreators.king;
