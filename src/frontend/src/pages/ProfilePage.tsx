import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Bookmark,
  Camera,
  Check,
  CreditCard,
  History,
  LogOut,
  PenLine,
  Save,
} from "lucide-react";
import { useState } from "react";
import { createActor } from "../backend";
import type {
  EpisodePublic,
  ShowPublic,
  WatchHistoryEntryPublic,
} from "../backend";
import { ShowCard } from "../components/ui/ShowCard";
import { Button } from "../components/ui/ZyroButton";
import { useAuthStore } from "../lib/auth-store";
import { SUBSCRIPTION_PLANS } from "../lib/mock-data";
import { cn, formatDate, formatDuration } from "../lib/utils";
import { SubscriptionTier } from "../types";

/** Returns true when the video is a link-based source (not a chunked upload) */
function isLinkedVideo(url: string): boolean {
  if (!url) return false;
  return !url.trimStart().startsWith("[");
}

interface HistoryItem {
  entry: WatchHistoryEntryPublic;
  episode: EpisodePublic | undefined;
  show: ShowPublic | undefined;
}

const TIER_COLORS: Record<SubscriptionTier, string> = {
  [SubscriptionTier.Free]: "bg-muted/80 text-muted-foreground",
  [SubscriptionTier.Pro]: "bg-primary/15 text-primary border border-primary/30",
  [SubscriptionTier.Premium]:
    "bg-amber-500/15 text-amber-400 border border-amber-500/30",
};

const SECTION_TABS = ["Watch History", "Watchlist"] as const;
type SectionTab = (typeof SECTION_TABS)[number];

function LetterAvatar({
  name,
  className,
}: { name: string; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-full bg-primary/20 neon-border flex items-center justify-center font-display font-bold text-primary select-none",
        className,
      )}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export default function ProfilePage() {
  const { isLoggedIn, logout } = useAuthStore();
  const ii = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor(createActor);

  const { data: backendProfile, isLoading: profileLoading } = useQuery({
    queryKey: ["callerProfile", ii.identity?.getPrincipal().toText()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && isLoggedIn,
    staleTime: 1000 * 60 * 5,
  });

  const { data: watchHistoryRaw = [] } = useQuery({
    queryKey: ["watchHistory", ii.identity?.getPrincipal().toText()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWatchHistory();
    },
    enabled: !!actor && !actorFetching && isLoggedIn,
    staleTime: 1000 * 60 * 2,
  });

  const { data: watchlistShows = [] } = useQuery<ShowPublic[]>({
    queryKey: ["watchlist", ii.identity?.getPrincipal().toText()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWatchlist();
    },
    enabled: !!actor && !actorFetching && isLoggedIn,
    staleTime: 1000 * 60 * 2,
  });

  // Fetch episode details for history entries
  const episodeIds = watchHistoryRaw.map((e) => e.episodeId);
  const { data: historyEpisodes = [] } = useQuery<EpisodePublic[]>({
    queryKey: ["historyEpisodes", episodeIds.map(String).join(",")],
    queryFn: async () => {
      if (!actor || episodeIds.length === 0) return [];
      const results = await Promise.all(
        episodeIds.map((id) => actor.getEpisode(id)),
      );
      return results.filter((ep): ep is EpisodePublic => ep !== null);
    },
    enabled: !!actor && !actorFetching && episodeIds.length > 0,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch show details for history entries
  const historyShowIds = [...new Set(watchHistoryRaw.map((e) => e.showId))];
  const { data: historyShows = [] } = useQuery<ShowPublic[]>({
    queryKey: ["historyShows", historyShowIds.map(String).join(",")],
    queryFn: async () => {
      if (!actor || historyShowIds.length === 0) return [];
      const results = await Promise.all(
        historyShowIds.map((id) => actor.getShow(id)),
      );
      return results.filter((s): s is ShowPublic => s !== null);
    },
    enabled: !!actor && !actorFetching && historyShowIds.length > 0,
    staleTime: 1000 * 60 * 5,
  });

  const principalText = ii.identity?.getPrincipal().toText() ?? "";
  const displayName =
    backendProfile?.username || `${principalText.slice(0, 12)}…`;
  const tier =
    (backendProfile?.subscriptionTier as unknown as SubscriptionTier) ??
    SubscriptionTier.Free;
  const joinedAt = backendProfile
    ? Number(backendProfile.createdAt / BigInt(1_000_000))
    : Date.now();

  const [activeTab, setActiveTab] = useState<SectionTab>("Watch History");
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState(displayName);
  const [bio, setBio] = useState(
    "Streaming enthusiast. Always on the lookout for the next great story.",
  );
  const [saved, setSaved] = useState(false);

  if (!isLoggedIn) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4"
        data-ocid="profile-page-guest"
      >
        <LetterAvatar name="?" className="w-20 h-20 text-3xl" />
        <p className="font-display text-xl font-semibold text-foreground">
          Sign in to view your profile
        </p>
        <Link to="/">
          <Button variant="primary">Go Home</Button>
        </Link>
      </div>
    );
  }

  if (profileLoading || actorFetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const plan = SUBSCRIPTION_PLANS.find((p) => p.tier === tier);

  // Build history items from real backend data
  const historyItems: HistoryItem[] = watchHistoryRaw.map((entry) => ({
    entry,
    episode: historyEpisodes.find((ep) => ep.id === entry.episodeId),
    show: historyShows.find((s) => s.id === entry.showId),
  }));

  function handleSave() {
    setSaved(true);
    setEditMode(false);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div
      className="max-w-5xl mx-auto px-4 py-8 space-y-8"
      data-ocid="profile-page"
    >
      {/* Profile Header */}
      <div className="glass-card rounded-2xl p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative flex-shrink-0">
            <LetterAvatar name={displayName} className="w-20 h-20 text-3xl" />
            {editMode && (
              <button
                type="button"
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors"
                aria-label="Change avatar"
              >
                <Camera className="w-3.5 h-3.5 text-primary-foreground" />
              </button>
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            {editMode ? (
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="font-display font-bold text-xl bg-muted/60 border border-input rounded-lg px-3 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring w-full max-w-xs"
                data-ocid="username-input"
              />
            ) : (
              <h1 className="font-display text-2xl font-bold text-foreground truncate">
                {username}
              </h1>
            )}
            <p className="text-muted-foreground text-sm font-mono text-xs truncate">
              {principalText.slice(0, 20)}…
            </p>
            <div className="flex items-center gap-2 flex-wrap mt-1">
              <span
                className={cn(
                  "text-xs font-display font-semibold px-2.5 py-0.5 rounded-full",
                  TIER_COLORS[tier],
                )}
              >
                {tier}
              </span>
              <span className="text-xs text-muted-foreground">
                Joined {formatDate(joinedAt)}
              </span>
              {backendProfile && (
                <span className="text-xs font-display font-semibold px-2.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/30 capitalize">
                  viewer
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2 flex-shrink-0">
            {editMode ? (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSave}
                  data-ocid="save-profile-btn"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save
                </Button>
              </>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setEditMode(true)}
                data-ocid="edit-profile-btn"
              >
                <PenLine className="w-3.5 h-3.5" />
                Edit
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              data-ocid="logout-btn"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-border/40">
          {editMode ? (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-lg bg-muted/60 border border-input text-foreground placeholder:text-muted-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Write a short bio..."
              data-ocid="bio-input"
            />
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {bio}
            </p>
          )}
        </div>

        {saved && (
          <div className="mt-3 flex items-center gap-2 text-sm text-emerald-400">
            <Check className="w-4 h-4" />
            Profile saved successfully
          </div>
        )}
      </div>

      {/* Subscription Card */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="w-5 h-5 text-primary" />
          <h2 className="font-display text-lg font-bold text-foreground">
            My Subscription
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-sm font-display font-bold px-3 py-1 rounded-full",
                  TIER_COLORS[tier],
                )}
              >
                {plan?.name ?? "Free"} Plan
              </span>
              {tier !== SubscriptionTier.Free && (
                <span className="text-xs text-muted-foreground">
                  Billed monthly
                </span>
              )}
            </div>
            {plan &&
              plan.price > 0 &&
              (() => {
                const expiresAtNs = backendProfile?.subscriptionExpiresAt;
                if (!expiresAtNs) return null;
                const expiresAtMs = Number(expiresAtNs) / 1_000_000;
                const daysLeft = Math.ceil(
                  (expiresAtMs - Date.now()) / (1000 * 60 * 60 * 24),
                );
                return (
                  <p className="text-sm text-muted-foreground">
                    {daysLeft > 0
                      ? `${daysLeft} day${daysLeft === 1 ? "" : "s"} remaining`
                      : "Expired"}
                  </p>
                );
              })()}
            <ul className="mt-2 space-y-1">
              {(plan?.features ?? []).slice(0, 3).map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <Check className="w-3 h-3 text-primary flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <Link to="/subscribe" className="flex-shrink-0">
            <Button
              variant={
                tier === SubscriptionTier.Premium ? "secondary" : "primary"
              }
              size="md"
              data-ocid="upgrade-plan-btn"
            >
              {tier === SubscriptionTier.Premium
                ? "Manage Plan"
                : "Upgrade Plan"}
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div>
        <div className="flex gap-1 mb-6 overflow-x-auto scrollbar-none border-b border-border/40">
          {SECTION_TABS.map((tab) => {
            const icons: Record<SectionTab, React.ElementType> = {
              "Watch History": History,
              Watchlist: Bookmark,
            };
            const Icon = icons[tab];
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 text-sm font-display font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px",
                  activeTab === tab
                    ? "text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground",
                )}
                data-ocid={`profile-tab-${tab.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <Icon className="w-4 h-4" />
                {tab}
              </button>
            );
          })}
        </div>

        {/* Watch History */}
        {activeTab === "Watch History" && (
          <div className="space-y-3">
            {historyItems.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-display">No watch history yet</p>
              </div>
            ) : (
              historyItems.map(({ entry, show, episode }) => {
                if (!show || !episode) return null;
                const progressPct =
                  episode.durationSeconds > 0
                    ? Math.min(
                        100,
                        Math.round(
                          (Number(entry.progressSeconds) /
                            Number(episode.durationSeconds)) *
                            100,
                        ),
                      )
                    : 0;
                const watchedAtMs = Number(entry.lastWatchedAt) / 1_000_000;
                const secondsLeft = Math.max(
                  0,
                  Number(episode.durationSeconds) -
                    Number(entry.progressSeconds),
                );
                return (
                  <Link
                    key={String(entry.episodeId)}
                    to="/watch/$showId/$seasonId/$episodeId"
                    params={{
                      showId: String(entry.showId),
                      seasonId: String(episode.seasonId),
                      episodeId: String(entry.episodeId),
                    }}
                    className="flex gap-4 p-3 rounded-xl glass-card hover:border-primary/30 transition-colors group"
                    data-ocid="history-item"
                  >
                    <div className="relative w-28 aspect-video flex-shrink-0 rounded-lg overflow-hidden">
                      {episode.thumbnailUrl &&
                      !isLinkedVideo(episode.videoUrl ?? "") ? (
                        <img
                          src={episode.thumbnailUrl}
                          alt={episode.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted/40 flex items-center justify-center">
                          <History className="w-6 h-6 text-muted-foreground/50" />
                        </div>
                      )}
                      {progressPct > 0 && progressPct < 100 && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-border/60">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                      <p className="font-display font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                        {episode.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {show.title} · Ep {String(episode.episodeNumber)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(watchedAtMs)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {progressPct >= 95 ? (
                          <span className="text-[10px] font-display font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                            Watched
                          </span>
                        ) : progressPct > 0 ? (
                          <span className="text-[10px] font-display font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                            {progressPct}% · {formatDuration(secondsLeft)} left
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        )}

        {/* Watchlist */}
        {activeTab === "Watchlist" && (
          <div>
            {watchlistShows.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-display">Your watchlist is empty</p>
                <Link
                  to="/browse"
                  className="text-primary text-sm hover:underline mt-1 inline-block"
                >
                  Browse shows
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {watchlistShows.map((show) => (
                  <ShowCard key={show.id} show={show} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
