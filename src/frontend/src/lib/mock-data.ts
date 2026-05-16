import { SubscriptionTier } from "../types";
import type {
  AdminAnalytics,
  Comment,
  Show,
  SubscriptionPlan,
  WatchHistoryEntry,
} from "../types";

export const SAMPLE_SHOWS: Show[] = [];

export const SAMPLE_COMMENTS: Comment[] = [];

export const SAMPLE_WATCH_HISTORY: WatchHistoryEntry[] = [
  {
    showId: "show-1",
    episodeId: "show-1-s2-ep3",
    seasonId: "show-1-s2",
    watchedAt: Date.now() - 1000 * 60 * 60 * 2,
    progressSeconds: 1820,
    totalSeconds: 2640,
  },
  {
    showId: "show-4",
    episodeId: "show-4-s1-ep5",
    seasonId: "show-4-s1",
    watchedAt: Date.now() - 1000 * 60 * 60 * 24,
    progressSeconds: 2400,
    totalSeconds: 2400,
  },
  {
    showId: "show-8",
    episodeId: "show-8-s2-ep1",
    seasonId: "show-8-s2",
    watchedAt: Date.now() - 1000 * 60 * 60 * 48,
    progressSeconds: 900,
    totalSeconds: 2700,
  },
  {
    showId: "show-5",
    episodeId: "show-5-s1-ep2",
    seasonId: "show-5-s1",
    watchedAt: Date.now() - 1000 * 60 * 60 * 72,
    progressSeconds: 2200,
    totalSeconds: 2200,
  },
];

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    tier: SubscriptionTier.Free,
    name: "Free",
    price: 0,
    features: [
      "Access to free content",
      "SD quality (480p)",
      "Ad-supported",
      "1 device at a time",
      "Limited episodes per show",
    ],
  },
  {
    tier: SubscriptionTier.Pro,
    name: "Pro",
    price: 1000,
    features: [
      "All Free content + Pro exclusives",
      "HD quality (1080p)",
      "Ad-free experience",
      "2 devices simultaneously",
      "Offline downloads (5 episodes)",
      "Early access to new releases",
    ],
    isPopular: true,
  },
  {
    tier: SubscriptionTier.Premium,
    name: "Premium",
    price: 2000,
    features: [
      "All content including exclusives",
      "4K Ultra HD quality",
      "Ad-free experience",
      "4 devices simultaneously",
      "Unlimited offline downloads",
      "Day-1 exclusive access",
      "Priority support",
    ],
  },
];

export const MOCK_ANALYTICS: AdminAnalytics = {
  totalUsers: 142600,
  totalShows: 2340,
  totalViews: 38500000,
  totalRevenue: 284500,
  activeSubscriptions: 48900,
  dailyActiveUsers: 22400,
  topShows: [
    { title: "The Jor's War", views: 5600000 },
    { title: "Dark Protocol", views: 4800000 },
    { title: "Neural Drift", views: 4200000 },
    { title: "Echoes of Silence", views: 3400000 },
    { title: "Synthwave Noir", views: 3100000 },
  ],
  revenueByMonth: [
    { month: "Oct", revenue: 220000 },
    { month: "Nov", revenue: 245000 },
    { month: "Dec", revenue: 278000 },
    { month: "Jan", revenue: 262000 },
    { month: "Feb", revenue: 271000 },
    { month: "Mar", revenue: 284500 },
  ],
  userGrowth: [
    { month: "Oct", users: 98000 },
    { month: "Nov", users: 108000 },
    { month: "Dec", users: 121000 },
    { month: "Jan", users: 129000 },
    { month: "Feb", users: 136000 },
    { month: "Mar", users: 142600 },
  ],
};
