export enum SubscriptionTier {
  Free = "Free",
  Pro = "Pro",
  Premium = "Premium",
}

export enum Category {
  RealityTV = "Reality TV",
  Drama = "Drama",
  Comedy = "Comedy",
  Exclusive = "Exclusive",
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  role: "viewer" | "admin";
  subscriptionTier: SubscriptionTier;
  joinedAt: number;
  watchHistory: WatchHistoryEntry[];
  watchlist: string[];
}

export interface Episode {
  id: string;
  showId: string;
  seasonId: string;
  episodeNumber: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
  views: number;
  likes: number;
  publishedAt: number;
  requiresSubscription: SubscriptionTier;
}

export interface Season {
  id: string;
  showId: string;
  seasonNumber: number;
  title: string;
  episodes: Episode[];
}

export interface Show {
  id: string;
  title: string;
  description: string;
  coverImageUrl: string;
  bannerUrl: string;
  category: Category;
  tags: string[];
  seasons: Season[];
  totalViews: number;
  likes: number;
  rating: number;
  isFeatured: boolean;
  isTrending: boolean;
  isExclusive: boolean;
  isFree?: boolean;
  publishedAt: number;
  requiresSubscription: SubscriptionTier;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string;
  episodeId: string;
  content: string;
  likes: number;
  createdAt: number;
  replies?: Comment[];
}

export interface WatchHistoryEntry {
  showId: string;
  episodeId: string;
  seasonId: string;
  watchedAt: number;
  progressSeconds: number;
  totalSeconds: number;
}

export interface SubscriptionPlan {
  tier: SubscriptionTier;
  name: string;
  price: number;
  features: string[];
  isPopular?: boolean;
}

export interface AdminAnalytics {
  totalUsers: number;
  totalShows: number;
  totalViews: number;
  totalRevenue: number;
  activeSubscriptions: number;
  dailyActiveUsers: number;
  topShows: { title: string; views: number }[];
  revenueByMonth: { month: string; revenue: number }[];
  userGrowth: { month: string; users: number }[];
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export interface SearchResult {
  shows: Show[];
  query: string;
}
