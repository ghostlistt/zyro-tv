import { create } from "zustand";
import { Category, SubscriptionTier } from "../types";
import type { Episode, Season, Show } from "../types";

const ADMIN_PASSWORD = "20418";
const SESSION_KEY = "zyro-admin-auth";

function getPersistedAuth(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "true";
  } catch {
    return false;
  }
}

function setPersistedAuth(value: boolean) {
  try {
    if (value) sessionStorage.setItem(SESSION_KEY, "true");
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}

export interface NewShowForm {
  title: string;
  description: string;
  category: Category;
  coverUrl: string;
  bannerUrl: string;
  tags: string;
  requiresSubscription: SubscriptionTier;
  isExclusive: boolean;
}

export interface NewEpisodeForm {
  showId: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  requiresSubscription: SubscriptionTier;
}

export interface AdminState {
  isAdminAuthenticated: boolean;
  verifyPassword: (pw: string) => boolean;
  logoutAdmin: () => void;

  shows: Show[];
  addShow: (form: NewShowForm) => Show;
  addEpisode: (form: NewEpisodeForm) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  isAdminAuthenticated: getPersistedAuth(),

  verifyPassword: (pw: string) => {
    const ok = pw === ADMIN_PASSWORD;
    if (ok) {
      setPersistedAuth(true);
      set({ isAdminAuthenticated: true });
    }
    return ok;
  },

  logoutAdmin: () => {
    setPersistedAuth(false);
    set({ isAdminAuthenticated: false });
  },

  // Fix 5: Start with empty array — no placeholder data flashing on screen
  shows: [],

  addShow: (form: NewShowForm) => {
    const id = `show-custom-${Date.now()}`;
    const newShow: Show = {
      id,
      title: form.title,
      description: form.description,
      coverImageUrl:
        form.coverUrl || `https://picsum.photos/seed/${id}/400/600`,
      bannerUrl: form.bannerUrl || `https://picsum.photos/seed/${id}b/1600/600`,
      category: form.category,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      seasons: [],
      totalViews: 0,
      likes: 0,
      rating: 0,
      isFeatured: false,
      isTrending: false,
      isExclusive: form.isExclusive,
      publishedAt: Date.now(),
      requiresSubscription: form.requiresSubscription,
    };
    set((s) => ({ shows: [newShow, ...s.shows] }));
    return newShow;
  },

  addEpisode: (form: NewEpisodeForm) => {
    set((s) => {
      const shows = s.shows.map((show) => {
        if (show.id !== form.showId) return show;
        let seasons = [...show.seasons];
        const seasonId = `${show.id}-s${form.seasonNumber}`;
        const existing = seasons.find(
          (se) => se.seasonNumber === form.seasonNumber,
        );
        const ep: Episode = {
          id: `${seasonId}-ep${form.episodeNumber}-${Date.now()}`,
          showId: form.showId,
          seasonId,
          episodeNumber: form.episodeNumber,
          title: form.title,
          description: form.description,
          videoUrl: form.videoUrl,
          thumbnailUrl:
            form.thumbnailUrl ||
            `https://picsum.photos/seed/ep${Date.now()}/640/360`,
          duration: 2400,
          views: 0,
          likes: 0,
          publishedAt: Date.now(),
          requiresSubscription: form.requiresSubscription,
        };
        if (existing) {
          seasons = seasons.map((se) =>
            se.seasonNumber === form.seasonNumber
              ? { ...se, episodes: [...se.episodes, ep] }
              : se,
          );
        } else {
          const newSeason: Season = {
            id: seasonId,
            showId: form.showId,
            seasonNumber: form.seasonNumber,
            title: `Season ${form.seasonNumber}`,
            episodes: [ep],
          };
          seasons = [...seasons, newSeason].sort(
            (a, b) => a.seasonNumber - b.seasonNumber,
          );
        }
        return { ...show, seasons };
      });
      return { shows };
    });
  },
}));

// Re-export enums so they're accessible from admin components via this module
export { Category, SubscriptionTier };
