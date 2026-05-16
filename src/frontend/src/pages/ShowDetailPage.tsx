import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import {
  Check,
  ChevronDown,
  Lock,
  Play,
  Plus,
  Share2,
  Star,
  Tv,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { createActor } from "../backend";
import type {
  EpisodePublic,
  SeasonPublic,
  ShowPublic,
  UserProfilePublic,
} from "../backend";
import { CategoryBadge } from "../components/ui/CategoryBadge";
import { ShowCard } from "../components/ui/ShowCard";
import { useAuthStore } from "../lib/auth-store";
import { SubscriptionTier } from "../types";

/** Returns true when the video is a link-based source (not a chunked upload) */
function isLinkedVideo(url: string): boolean {
  if (!url) return false;
  return !url.trimStart().startsWith("[");
}

// ─── Subscription Banner ──────────────────────────────────────────────────────

function SubscriptionBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl mb-5"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.55 0.28 300 / 0.12) 0%, oklch(0.55 0.28 300 / 0.06) 100%)",
        border: "1px solid oklch(0.55 0.28 300 / 0.3)",
      }}
      data-ocid="subscription-banner"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "oklch(0.55 0.28 300 / 0.15)" }}
        >
          <Lock className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="font-display font-bold text-sm text-foreground">
            Subscribe to unlock all episodes
          </p>
          <p className="text-xs text-muted-foreground">
            Get full access to every season and episode
          </p>
        </div>
      </div>
      <Link
        to="/subscribe"
        className="px-5 py-2.5 rounded-lg font-display font-bold text-sm text-primary-foreground whitespace-nowrap flex-shrink-0 transition-smooth"
        style={{
          background: "oklch(0.55 0.28 300)",
          boxShadow: "0 0 16px oklch(0.55 0.28 300 / 0.4)",
        }}
        data-ocid="subscribe-now-btn"
      >
        Subscribe Now
      </Link>
    </motion.div>
  );
}

// ─── Episode Cards ────────────────────────────────────────────────────────────

function LockedEpisodeCard({ episode }: { episode: EpisodePublic }) {
  return (
    <Link
      to="/subscribe"
      className="group flex gap-3 p-3 rounded-lg border border-border/40 bg-card/40 transition-smooth hover:bg-card/80 hover:border-primary/30"
      data-ocid="episode-card-locked"
    >
      <div className="relative flex-shrink-0 w-32 aspect-video rounded-md overflow-hidden bg-muted/40">
        <div className="w-full h-full flex items-center justify-center">
          <Lock className="w-6 h-6 text-muted-foreground/50" />
        </div>
        {/* Locked overlay on hover */}
        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth">
          <Lock className="w-6 h-6 text-primary" />
        </div>
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
        <span className="text-xs font-display text-muted-foreground">
          E{String(episode.episodeNumber)}
        </span>
        <h4 className="font-display font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
          {episode.title}
        </h4>
        <span
          className="text-xs font-display font-semibold self-start px-2 py-0.5 rounded-full"
          style={{
            background: "oklch(0.55 0.28 300 / 0.12)",
            color: "oklch(0.75 0.18 300)",
            border: "1px solid oklch(0.55 0.28 300 / 0.25)",
          }}
        >
          Subscribe to watch
        </span>
      </div>
    </Link>
  );
}

function BackendEpisodeCard({
  episode,
  showId,
}: {
  episode: EpisodePublic;
  showId: string;
}) {
  const showThumbnail =
    !!episode.thumbnailUrl && !isLinkedVideo(episode.videoUrl ?? "");
  return (
    <Link
      to="/watch/$showId/$seasonId/$episodeId"
      params={{
        showId,
        seasonId: String(episode.seasonId),
        episodeId: String(episode.id),
      }}
      className="group flex gap-3 p-3 rounded-lg border border-border/40 bg-card/40 transition-smooth hover:bg-card/80 hover:border-primary/30"
      data-ocid="episode-card"
    >
      <div className="relative flex-shrink-0 w-32 aspect-video rounded-md overflow-hidden bg-muted/40">
        {showThumbnail ? (
          <img
            src={episode.thumbnailUrl}
            alt={episode.title}
            className="w-full h-full object-cover transition-smooth group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Tv className="w-6 h-6 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth">
          <Play className="w-6 h-6 text-white fill-white" />
        </div>
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
        <span className="text-xs font-display text-muted-foreground">
          E{String(episode.episodeNumber)}
        </span>
        <h4 className="font-display font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
          {episode.title}
        </h4>
        {episode.durationSeconds > 0 && (
          <p className="text-xs text-muted-foreground">
            {Math.floor(Number(episode.durationSeconds) / 60)}m
          </p>
        )}
      </div>
    </Link>
  );
}

interface SeasonWithEpisodes extends SeasonPublic {
  episodes: EpisodePublic[];
}

export default function ShowDetailPage() {
  const { showId } = useParams({ from: "/show/$showId" });
  const { isLoggedIn, toggleWatchlist, isInWatchlist } = useAuthStore();
  const { actor, isFetching: actorFetching } = useActor(createActor);

  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(0);
  const [seasonDropdownOpen, setSeasonDropdownOpen] = useState(false);

  // ── Fetch caller profile to check subscription tier ──────────────────────
  const { data: callerProfile } = useQuery<UserProfilePublic | null>({
    queryKey: ["callerProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && isLoggedIn,
  });

  const {
    data: show,
    isLoading: showLoading,
    isError: showError,
  } = useQuery<ShowPublic | null>({
    queryKey: ["show", showId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getShow(BigInt(showId));
    },
    enabled: !!actor && !actorFetching,
  });

  const { data: seasons = [], isLoading: seasonsLoading } = useQuery<
    SeasonPublic[]
  >({
    queryKey: ["seasons", showId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSeasons(BigInt(showId));
    },
    enabled: !!actor && !actorFetching && !!show,
  });

  const { data: allEpisodes = [] } = useQuery<EpisodePublic[]>({
    queryKey: [
      "allEpisodes",
      showId,
      seasons.map((s) => String(s.id)).join(","),
    ],
    queryFn: async () => {
      if (!actor || seasons.length === 0) return [];
      const results = await Promise.all(
        seasons.map((s) => actor.listEpisodes(s.id)),
      );
      return results.flat();
    },
    enabled: !!actor && !actorFetching && seasons.length > 0,
  });

  const { data: relatedShows = [] } = useQuery<ShowPublic[]>({
    queryKey: ["approvedShows"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listApprovedShows();
    },
    enabled: !!actor && !actorFetching,
  });

  const isLoading = showLoading || seasonsLoading;

  if (isLoading) {
    return (
      <div
        className="min-h-screen bg-background"
        data-ocid="show-detail-loading"
      >
        <div className="w-full aspect-[21/9] min-h-[280px] max-h-[520px] bg-muted/20 animate-pulse" />
        <div className="relative -mt-40 px-4 md:px-8 lg:px-16 pb-16 max-w-screen-xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0 w-44 md:w-52 aspect-[2/3] rounded-xl bg-muted/30 animate-pulse hidden md:block" />
            <div className="flex-1 pt-32 md:pt-10 space-y-4">
              <div className="h-4 w-24 bg-muted/30 rounded animate-pulse" />
              <div className="h-10 w-3/4 bg-muted/30 rounded animate-pulse" />
              <div className="h-4 w-full bg-muted/30 rounded animate-pulse" />
              <div className="flex gap-3 mt-6">
                <div className="h-11 w-32 bg-muted/30 rounded-lg animate-pulse" />
                <div className="h-11 w-24 bg-muted/30 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showError || !show) {
    return (
      <div
        className="min-h-screen bg-background flex flex-col items-center justify-center gap-5 px-4"
        data-ocid="show-not-found"
      >
        <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center">
          <Tv className="w-10 h-10 text-muted-foreground" />
        </div>
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            Show Not Found
          </h1>
          <p className="text-muted-foreground">
            This show doesn't exist or has been removed.
          </p>
        </div>
        <Link
          to="/"
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-display font-semibold text-sm hover:bg-primary/90 transition-smooth"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  // ── Subscription gating ───────────────────────────────────────────────────
  const userTier = callerProfile
    ? (callerProfile.subscriptionTier as unknown as SubscriptionTier)
    : SubscriptionTier.Free;
  const isSubscribed = isLoggedIn && userTier !== SubscriptionTier.Free;
  const isPaywalled = !show.isFree && !isSubscribed;

  const seasonsWithEpisodes: SeasonWithEpisodes[] = seasons
    .map((s) => ({
      ...s,
      episodes: allEpisodes
        .filter((ep) => ep.seasonId === s.id)
        .sort((a, b) => Number(a.episodeNumber) - Number(b.episodeNumber)),
    }))
    .sort((a, b) => Number(a.seasonNumber) - Number(b.seasonNumber));

  const currentSeason =
    seasonsWithEpisodes[selectedSeasonIndex] ?? seasonsWithEpisodes[0];
  const firstEpisode = currentSeason?.episodes[0];
  const inWatchlist = isInWatchlist(String(show.id));

  const related = relatedShows
    .filter((s) => s.category === show.category && String(s.id) !== showId)
    .slice(0, 4);

  const totalEpisodeCount = seasonsWithEpisodes.reduce(
    (acc, s) => acc + s.episodes.length,
    0,
  );

  function handleShare() {
    void navigator.clipboard.writeText(window.location.href);
  }

  return (
    <div className="min-h-screen bg-background" data-ocid="show-detail-page">
      {/* Hero Banner */}
      <div className="relative w-full aspect-[21/9] min-h-[280px] max-h-[520px] overflow-hidden">
        {show.coverImageUrl ? (
          <img
            src={show.coverImageUrl}
            alt={show.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-muted/40 to-background" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-transparent to-transparent" />
        {show.category === "Exclusive" && (
          <div className="absolute top-6 left-6">
            <span className="px-3 py-1 text-xs font-display font-bold bg-primary text-primary-foreground rounded-full uppercase tracking-widest glow-primary">
              Exclusive
            </span>
          </div>
        )}
      </div>

      {/* Content — overlaps hero bottom */}
      <div className="relative -mt-40 px-4 md:px-8 lg:px-16 pb-16 max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0 w-44 md:w-52 rounded-xl overflow-hidden neon-border shadow-2xl hidden md:block"
          >
            {show.coverImageUrl ? (
              <img
                src={show.coverImageUrl}
                alt={show.title}
                className="w-full aspect-[2/3] h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-muted/40 flex items-center justify-center">
                <Tv className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
          </motion.div>

          {/* Info panel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-1 min-w-0 pt-32 md:pt-10"
          >
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <CategoryBadge category={show.category} />
              {show.isFeatured && (
                <span className="px-2 py-0.5 text-xs font-display font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full uppercase tracking-wide">
                  Featured
                </span>
              )}
              {show.isFree && (
                <span className="px-2 py-0.5 text-xs font-display font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full uppercase tracking-wide">
                  Free
                </span>
              )}
              {isPaywalled && (
                <span
                  className="px-2 py-0.5 text-xs font-display font-bold rounded-full uppercase tracking-wide"
                  style={{
                    background: "oklch(0.55 0.28 300 / 0.15)",
                    color: "oklch(0.75 0.18 300)",
                    border: "1px solid oklch(0.55 0.28 300 / 0.35)",
                  }}
                >
                  Subscribers Only
                </span>
              )}
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-display font-semibold">4.5</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-display font-black text-foreground mb-3 leading-tight">
              {show.title}
            </h1>

            <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl mb-4 line-clamp-3">
              {show.description}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground mb-6">
              <span>
                {seasonsWithEpisodes.length}{" "}
                {seasonsWithEpisodes.length === 1 ? "Season" : "Seasons"}{" "}
                &middot; {totalEpisodeCount} Episodes
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {isPaywalled ? (
                /* Locked — redirect to subscribe */
                <Link
                  to="/subscribe"
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-display font-bold text-sm text-primary-foreground transition-smooth shadow-lg"
                  style={{
                    background: "oklch(0.55 0.28 300)",
                    boxShadow: "0 0 20px oklch(0.55 0.28 300 / 0.45)",
                  }}
                  data-ocid="watch-now-locked-btn"
                >
                  <Lock className="w-4 h-4" />
                  Subscribe to Watch
                </Link>
              ) : (
                firstEpisode &&
                currentSeason && (
                  <Link
                    to="/watch/$showId/$seasonId/$episodeId"
                    params={{
                      showId: String(show.id),
                      seasonId: String(currentSeason.id),
                      episodeId: String(firstEpisode.id),
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-display font-bold text-sm hover:bg-primary/90 transition-smooth glow-primary shadow-lg"
                    data-ocid="watch-now-btn"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Watch Now
                  </Link>
                )
              )}
              <button
                type="button"
                onClick={() => {
                  if (isLoggedIn) toggleWatchlist(String(show.id));
                }}
                className="flex items-center gap-2 px-5 py-3 bg-card border border-border/60 text-foreground rounded-lg font-display font-semibold text-sm hover:border-primary/60 hover:text-primary transition-smooth"
                data-ocid="watchlist-btn"
              >
                {inWatchlist ? (
                  <Check className="w-4 h-4 text-primary" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {inWatchlist ? "In My List" : "My List"}
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-2 px-5 py-3 bg-card border border-border/60 text-foreground rounded-lg font-display font-semibold text-sm hover:border-primary/40 hover:text-primary transition-smooth"
                data-ocid="share-btn"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </motion.div>
        </div>

        {/* Season selector + episode list */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-foreground">
              Episodes
            </h2>

            {seasonsWithEpisodes.length > 1 && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSeasonDropdownOpen((o) => !o)}
                  className="flex items-center gap-2 px-4 py-2 bg-card border border-border/60 rounded-lg text-sm font-display font-semibold text-foreground hover:border-primary/50 transition-smooth"
                  data-ocid="season-selector"
                >
                  {currentSeason?.title ?? "Season 1"}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${seasonDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {seasonDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 glass-card rounded-lg shadow-xl z-20 overflow-hidden">
                    {seasonsWithEpisodes.map((season, idx) => (
                      <button
                        key={String(season.id)}
                        type="button"
                        onClick={() => {
                          setSelectedSeasonIndex(idx);
                          setSeasonDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm font-display transition-smooth hover:bg-primary/10 hover:text-primary ${
                          idx === selectedSeasonIndex
                            ? "text-primary bg-primary/5"
                            : "text-foreground"
                        }`}
                      >
                        {season.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Subscription banner — shown when content is paywalled */}
          {isPaywalled && <SubscriptionBanner />}

          {/* Season tabs (if few seasons) */}
          {seasonsWithEpisodes.length > 1 &&
            seasonsWithEpisodes.length <= 4 && (
              <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-none">
                {seasonsWithEpisodes.map((season, idx) => (
                  <button
                    key={String(season.id)}
                    type="button"
                    onClick={() => setSelectedSeasonIndex(idx)}
                    className={`px-4 py-2 rounded-lg text-sm font-display font-semibold transition-smooth border whitespace-nowrap flex-shrink-0 ${
                      selectedSeasonIndex === idx
                        ? "bg-primary/15 text-primary border-primary/40"
                        : "bg-muted/30 text-muted-foreground border-border/40 hover:border-primary/30"
                    }`}
                    data-ocid="season-tab"
                  >
                    {season.title}
                  </button>
                ))}
              </div>
            )}

          {currentSeason?.episodes.length === 0 ? (
            <div
              className="py-12 text-center text-muted-foreground"
              data-ocid="no-episodes"
            >
              <Tv className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No episodes available for this season yet.</p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {(currentSeason?.episodes ?? []).map((ep) =>
                isPaywalled ? (
                  <LockedEpisodeCard key={String(ep.id)} episode={ep} />
                ) : (
                  <BackendEpisodeCard
                    key={String(ep.id)}
                    episode={ep}
                    showId={String(show.id)}
                  />
                ),
              )}
            </div>
          )}
        </motion.div>

        {/* Related shows */}
        {related.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16"
          >
            <h2 className="text-xl font-display font-bold text-foreground mb-6">
              More Like This
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {related.map((s, i) => (
                <motion.div
                  key={String(s.id)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <ShowCard show={s} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
