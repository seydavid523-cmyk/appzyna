export type AppRecord = {
  id: string;
  name: string;
  category: string;
  description: string;
  accent: string;
  icon: string;
  downloads: string;
  creatorName: string;
  creatorUsername: string;
  isFeatured?: boolean;
};

export type CreatorProfile = {
  id: string;
  email: string;
  fullName: string;
  businessName: string;
  username: string;
  avatarUrl?: string;
  avatarTone: string;
  bio: string;
  totalApps: number;
  totalDownloads: string;
  apps: AppRecord[];
};
