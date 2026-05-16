import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  BookmarkPlus,
  Check,
  ChevronDown,
  Lock,
  MessageCircle,
  RefreshCw,
  Share2,
  Tv,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { createActor } from "../backend";
import type { ExternalBlob } from "../backend";
import type {
  EpisodePublic,
  SeasonPublic,
  ShowPublic,
  UserProfilePublic,
} from "../backend";
import { CategoryBadge } from "../components/ui/CategoryBadge";
import { ShowCard } from "../components/ui/ShowCard";
import {
  getObjStoreHash,
  hexToBytes,
  isObjStoreUrl,
} from "../hooks/useVideoUpload";
import { useAuthStore } from "../lib/auth-store";
import { SubscriptionTier } from "../types";

// ─── Video URL detection + conversion ─────────────────────────────────────────

type VideoMode =
  | "youtube"
  | "vimeo"
  | "googledrive"
  | "direct"
  | "iframe"
  | "objstore"
  | "legacy-chunked";

/** Detect if the URL is a legacy JSON array of CDN chunk URLs (old chunked uploads) */
function isLegacyChunkedUrl(url: string): boolean {
  return url.trimStart().startsWith("[");
}

/**
 * Returns true if the episode video is any kind of URL rather than a legacy
 * chunked JSON array. Used to decide whether to show thumbnails.
 */
function isLinkedVideo(url: string): boolean {
  if (!url) return false;
  if (isLegacyChunkedUrl(url)) return false;
  if (isObjStoreUrl(url)) return false; // uploaded file — not a linked video
  return true;
}

function detectVideoMode(url: string): VideoMode {
  if (!url) return "direct";
  // Legacy chunked upload — no longer playable, show re-upload message
  if (isLegacyChunkedUrl(url)) return "legacy-chunked";
  // Object-storage hash reference — must be fetched fresh
  if (isObjStoreUrl(url)) return "objstore";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("vimeo.com")) return "vimeo";
  if (url.includes("drive.google.com")) return "googledrive";
  // Everything else (direct .mp4/.webm, etc.) → native video
  return "direct";
}

function toYouTubeEmbed(url: string): string {
  try {
    if (url.includes("youtube.com/embed")) {
      const u = new URL(url);
      u.searchParams.set("autoplay", "1");
      u.searchParams.set("rel", "0");
      u.searchParams.set("modestbranding", "1");
      u.searchParams.set("showinfo", "0");
      u.searchParams.set("iv_load_policy", "3");
      u.searchParams.set("fs", "1");
      u.searchParams.set("color", "white");
      u.searchParams.set("controls", "1");
      return u.toString();
    }
    const short = url.match(/youtu\.be\/([^?&]+)/);
    if (short?.[1])
      return `https://www.youtube.com/embed/${short[1]}?autoplay=1&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&fs=1&color=white&controls=1`;
    const parsed = new URL(url);
    const v = parsed.searchParams.get("v");
    if (v)
      return `https://www.youtube.com/embed/${v}?autoplay=1&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&fs=1&color=white&controls=1`;
  } catch {
    // fallback
  }
  return url;
}

function toVimeoEmbed(url: string): string {
  try {
    if (url.includes("player.vimeo.com/video/")) {
      const sep = url.includes("?") ? "&" : "?";
      return `${url}${sep}autoplay=1&byline=0&portrait=0&title=0&transparent=0&color=9333ea`;
    }
    const match = url.match(
      /vimeo\.com\/(?:video\/|channels\/\S+\/|groups\/\S+\/videos\/)?(\d+)/,
    );
    if (match?.[1]) {
      return `https://player.vimeo.com/video/${match[1]}?autoplay=1&byline=0&portrait=0&title=0&transparent=0&color=9333ea`;
    }
  } catch {
    // fallback
  }
  return url;
}

function toGoogleDriveEmbed(url: string): string {
  try {
    const match = url.match(/\/file\/d\/([^/]+)/);
    if (match?.[1]) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
  } catch {
    // fallback
  }
  return url;
}

function getEmbedUrl(url: string, mode: VideoMode): string {
  switch (mode) {
    case "youtube":
      return toYouTubeEmbed(url);
    case "vimeo":
      return toVimeoEmbed(url);
    case "googledrive":
      return toGoogleDriveEmbed(url);
    default:
      return url;
  }
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function WatchPageSkeleton() {
  return (
    <div className="min-h-screen bg-background" data-ocid="watch-loading">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-6">
        <div className="h-4 w-48 bg-muted/30 rounded animate-pulse mb-4" />
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0">
            <div className="aspect-video rounded-xl bg-muted/30 animate-pulse mb-4" />
            <div className="h-6 w-2/3 bg-muted/30 rounded animate-pulse mb-2" />
            <div className="h-4 w-1/3 bg-muted/20 rounded animate-pulse" />
          </div>
          <div className="w-full lg:w-80 xl:w-96">
            <div className="h-96 rounded-xl bg-muted/20 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

function WatchPageError() {
  return (
    <div
      className="min-h-screen bg-background flex flex-col items-center justify-center gap-5 px-4"
      data-ocid="watch-error"
    >
      <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center">
        <Tv className="w-10 h-10 text-muted-foreground" />
      </div>
      <div className="text-center">
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">
          Episode Not Found
        </h1>
        <p className="text-muted-foreground">
          This episode doesn't exist or has been removed.
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

// ─── Paywall Overlay ──────────────────────────────────────────────────────────

function PaywallOverlay({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div
      className="w-full aspect-video rounded-xl overflow-hidden relative flex flex-col items-center justify-center gap-6 bg-black"
      data-ocid="paywall-overlay"
      style={{
        background:
          "linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #0a0a0a 100%)",
      }}
    >
      {/* Neon glow decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, oklch(0.55 0.28 300 / 0.15) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 flex flex-col items-center gap-5 px-6 text-center"
      >
        {/* Lock icon with glow */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: "oklch(0.55 0.28 300 / 0.15)",
            border: "1px solid oklch(0.55 0.28 300 / 0.4)",
            boxShadow: "0 0 32px oklch(0.55 0.28 300 / 0.3)",
          }}
        >
          <Lock className="w-9 h-9 text-primary" />
        </div>

        <div>
          <h3 className="font-display font-black text-xl md:text-2xl text-foreground mb-2">
            Subscription Required
          </h3>
          <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
            This show requires an active subscription to watch. Unlock all
            episodes and exclusive content.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            to="/subscribe"
            className="px-7 py-3 rounded-lg font-display font-bold text-sm text-primary-foreground transition-smooth"
            style={{
              background: "oklch(0.55 0.28 300)",
              boxShadow: "0 0 20px oklch(0.55 0.28 300 / 0.5)",
            }}
            data-ocid="paywall-subscribe-btn"
          >
            Subscribe Now
          </Link>
          {!isLoggedIn && (
            <Link
              to="/profile"
              className="px-7 py-3 rounded-lg border font-display font-semibold text-sm text-foreground hover:border-primary/60 hover:text-primary transition-smooth"
              style={{ borderColor: "oklch(0.55 0.28 300 / 0.3)" }}
              data-ocid="paywall-signin-btn"
            >
              Sign In
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─── VideoPlayer ──────────────────────────────────────────────────────────────

interface VideoPlayerProps {
  videoUrl: string;
  posterUrl?: string;
  title: string;
  onEnded?: () => void;
}

/** Fetch an objstore video and return a direct streamable URL for playback.
 *
 * Uses ExternalBlob.getDirectURL() instead of getBytes() so the browser can
 * stream large videos natively without loading the whole file into memory.
 * This also fixes black-screen / 00:00 duration issues caused by the browser
 * receiving a Blob with no MIME type it could decode.
 */
function useObjStoreBlobUrl(
  videoUrl: string,
  enabled: boolean,
): { blobUrl: string | null; loading: boolean; error: string | null } {
  const { actor } = useActor(createActor);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !isObjStoreUrl(videoUrl) || !actor) return;

    setLoading(true);
    setError(null);

    const backendWithStorage = actor as unknown as {
      _downloadFile: (bytes: Uint8Array) => Promise<ExternalBlob>;
    };

    if (typeof backendWithStorage._downloadFile !== "function") {
      setError("Video playback not available.");
      setLoading(false);
      return;
    }

    const hashHex = getObjStoreHash(videoUrl);
    const hashBytes = hexToBytes(hashHex) as unknown as Uint8Array<ArrayBuffer>;

    backendWithStorage
      ._downloadFile(hashBytes)
      .then((blob) => {
        // getDirectURL() returns a real HTTP URL the browser can stream —
        // no need to pull the entire file into memory as a Uint8Array.
        // This fixes: black screen, 00:00 duration, and OOM on large files.
        const directUrl = blob.getDirectURL();
        setBlobUrl(directUrl);
        setLoading(false);
      })
      .catch((err: unknown) => {
        const msg =
          err instanceof Error ? err.message : "Failed to load video.";
        setError(msg);
        setLoading(false);
      });
  }, [videoUrl, enabled, actor]);

  return { blobUrl, loading, error };
}

function VideoPlayer({ videoUrl, title, onEnded }: VideoPlayerProps) {
  const mode = detectVideoMode(videoUrl);
  const isObjStore = mode === "objstore";
  const {
    blobUrl,
    loading: objLoading,
    error: objError,
  } = useObjStoreBlobUrl(videoUrl, isObjStore);

  if (!videoUrl) {
    return (
      <div className="w-full aspect-video bg-black/80 flex flex-col items-center justify-center gap-3 rounded-xl">
        <Tv className="w-12 h-12 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">
          No video URL provided for this episode.
        </p>
      </div>
    );
  }

  // Legacy chunked upload — these can no longer be played; prompt re-upload
  if (mode === "legacy-chunked") {
    return (
      <div className="w-full aspect-video bg-black/80 flex flex-col items-center justify-center gap-4 rounded-xl px-6 text-center">
        <Tv className="w-12 h-12 text-muted-foreground/40" />
        <div>
          <p className="text-sm font-display font-semibold text-foreground mb-1">
            Video needs to be re-uploaded
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This episode was stored in an old format. Please edit the episode
            and upload the video file again to enable playback.
          </p>
        </div>
      </div>
    );
  }

  // Object-storage uploaded video — fetch bytes fresh then render
  if (isObjStore) {
    if (objLoading) {
      return (
        <div
          className="w-full aspect-video bg-black flex flex-col items-center justify-center gap-4 rounded-xl"
          data-ocid="video-loading"
        >
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
            <div
              className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin"
              style={{ animationDuration: "1.1s" }}
            />
          </div>
          <p className="text-sm text-muted-foreground">Loading video…</p>
        </div>
      );
    }
    if (objError || !blobUrl) {
      return (
        <div
          className="w-full aspect-video bg-black/80 flex flex-col items-center justify-center gap-4 rounded-xl px-6 text-center"
          data-ocid="video-error"
        >
          <RefreshCw className="w-10 h-10 text-muted-foreground/40" />
          <div>
            <p className="text-sm font-display font-semibold text-foreground mb-1">
              Could not load video
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {objError ?? "Please try refreshing the page."}
            </p>
          </div>
        </div>
      );
    }
    return (
      <video
        key={blobUrl}
        className="w-full aspect-video rounded-xl bg-black"
        controls
        playsInline
        preload="metadata"
        onEnded={onEnded}
        data-ocid="video-player"
      >
        <source src={blobUrl} type="video/mp4" />
        <track kind="captions" srcLang="en" label="English" default />
        Your browser does not support the video element.
      </video>
    );
  }

  // Direct upload or plain CDN URL → native <video> tag
  if (mode === "direct") {
    return (
      <video
        className="w-full aspect-video rounded-xl bg-black"
        controls
        playsInline
        preload="metadata"
        onEnded={onEnded}
        data-ocid="video-player"
      >
        <source src={videoUrl} />
        <track kind="captions" srcLang="en" label="English" default />
        Your browser does not support the video element.
      </video>
    );
  }

  // All iframe-based modes: youtube, vimeo, googledrive
  const embedUrl = getEmbedUrl(videoUrl, mode);
  const iframeAllow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share";

  const sandbox =
    mode === "youtube" || mode === "vimeo"
      ? "allow-scripts allow-same-origin allow-presentation allow-popups"
      : "allow-scripts allow-same-origin allow-presentation allow-forms";

  return (
    // Wrapper with overflow:hidden so nothing bleeds out of the player box
    <div className="relative w-full aspect-video overflow-hidden bg-black">
      {/* Top overlay — covers ~50px of any platform header/watermark area.
          pointer-events: none so it doesn't block volume/seek controls. */}
      <div
        className="absolute top-0 left-0 right-0 z-20 pointer-events-none"
        style={{ height: 52, background: "rgba(0,0,0,0.92)" }}
        aria-hidden="true"
      />

      <iframe
        src={embedUrl}
        title={title}
        className="absolute inset-0 w-full h-full border-0"
        allow={iframeAllow}
        sandbox={sandbox}
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        data-ocid="video-player"
        style={{ border: "none" }}
      />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function WatchPage() {
  const { showId, seasonId, episodeId } = useParams({
    from: "/watch/$showId/$seasonId/$episodeId",
  });
  const navigate = useNavigate();
  const { isLoggedIn, toggleWatchlist, isInWatchlist } = useAuthStore();
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(0);
  const [seasonDropdownOpen, setSeasonDropdownOpen] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [commentText, setCommentText] = useState("");

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
    data: episode,
    isLoading: epLoading,
    isError: epError,
  } = useQuery<EpisodePublic | null>({
    queryKey: ["episode", episodeId],
    queryFn: async () => {
      if (!actor) return null;
      const ep = await actor.getEpisode(BigInt(episodeId));
      return ep;
    },
    enabled: !!actor && !actorFetching,
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

  const currentSeasonData =
    seasons.find((s) => String(s.id) === seasonId) ??
    seasons[selectedSeasonIndex] ??
    seasons[0];

  const { data: seasonEpisodes = [] } = useQuery<EpisodePublic[]>({
    queryKey: ["episodes", String(currentSeasonData?.id ?? "")],
    queryFn: async () => {
      if (!actor || !currentSeasonData) return [];
      return actor.listEpisodes(currentSeasonData.id);
    },
    enabled: !!actor && !actorFetching && !!currentSeasonData,
  });

  const { data: allShows = [] } = useQuery<ShowPublic[]>({
    queryKey: ["approvedShows"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listApprovedShows();
    },
    enabled: !!actor && !actorFetching,
  });

  const commentMutation = useMutation({
    mutationFn: async (text: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.addComment(BigInt(episodeId), text);
    },
    onSuccess: () => {
      setCommentText("");
      void queryClient.invalidateQueries({ queryKey: ["comments", episodeId] });
    },
  });

  function handleCommentSubmit() {
    const trimmed = commentText.trim();
    if (!trimmed || commentMutation.isPending) return;
    commentMutation.mutate(trimmed);
  }

  const isLoading = epLoading || showLoading || seasonsLoading;

  if (isLoading) return <WatchPageSkeleton />;
  if (epError || showError || !episode || !show) return <WatchPageError />;

  // ── Subscription gating ───────────────────────────────────────────────────
  const userTier = callerProfile
    ? (callerProfile.subscriptionTier as unknown as SubscriptionTier)
    : SubscriptionTier.Free;
  const isSubscribed = isLoggedIn && userTier !== SubscriptionTier.Free;
  const isPaywalled = !show.isFree && !isSubscribed;

  const sortedSeasons = [...seasons].sort(
    (a, b) => Number(a.seasonNumber) - Number(b.seasonNumber),
  );
  const viewingSeasonIndex = sortedSeasons.findIndex(
    (s) => String(s.id) === seasonId,
  );
  const effectiveSeasonIndex =
    viewingSeasonIndex >= 0 ? viewingSeasonIndex : selectedSeasonIndex;
  const viewingSeason = sortedSeasons[effectiveSeasonIndex] ?? sortedSeasons[0];

  const sortedEpisodes = [...seasonEpisodes].sort(
    (a, b) => Number(a.episodeNumber) - Number(b.episodeNumber),
  );

  const inWatchlist = isInWatchlist(String(show.id));
  const relatedShows = allShows
    .filter((s) => s.category === show.category && String(s.id) !== showId)
    .slice(0, 4);

  function handleShare() {
    void navigator.clipboard.writeText(window.location.href);
  }

  function handleVideoEnded() {
    if (!autoplay) return;
    const idx = sortedEpisodes.findIndex((e) => String(e.id) === episodeId);
    const next = sortedEpisodes[idx + 1];
    if (next && viewingSeason) {
      void navigate({
        to: "/watch/$showId/$seasonId/$episodeId",
        params: {
          showId: showId,
          seasonId: String(viewingSeason.id),
          episodeId: String(next.id),
        },
      });
    }
  }

  const videoUrl = episode.videoUrl ?? "";

  return (
    <div className="min-h-screen bg-background" data-ocid="watch-page">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 font-body">
          <Link
            to="/show/$showId"
            params={{ showId: String(show.id) }}
            className="hover:text-primary transition-colors"
          >
            {show.title}
          </Link>
          <span>/</span>
          <span className="text-foreground truncate">{episode.title}</span>
        </div>

        {/* Main layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT: Video + meta + comments */}
          <div className="flex-1 min-w-0">
            {/* Video Player or Paywall */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative w-full rounded-xl overflow-hidden bg-black neon-border shadow-2xl"
            >
              {isPaywalled ? (
                <PaywallOverlay isLoggedIn={isLoggedIn} />
              ) : (
                <>
                  {/* Title overlay — only on non-paywalled content */}
                  <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
                    <p className="text-white/70 text-xs font-body mb-0.5">
                      {show.title} &middot;{" "}
                      {currentSeasonData?.title ?? "Season 1"}
                    </p>
                    <h2 className="text-white font-display font-bold text-lg leading-tight drop-shadow">
                      {episode.title}
                    </h2>
                  </div>

                  <VideoPlayer
                    videoUrl={videoUrl}
                    posterUrl={
                      isLinkedVideo(videoUrl)
                        ? undefined
                        : (episode.thumbnailUrl ?? undefined)
                    }
                    title={episode.title}
                    onEnded={handleVideoEnded}
                  />
                </>
              )}
            </motion.div>

            {/* Episode meta + actions */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <CategoryBadge category={show.category} />
                </div>
                <h1 className="text-xl md:text-2xl font-display font-black text-foreground mb-1">
                  {episode.title}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Episode {String(episode.episodeNumber)}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border/60 bg-card text-foreground text-sm font-display font-semibold hover:border-primary/40 hover:text-primary transition-smooth"
                  data-ocid="share-btn"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (isLoggedIn) toggleWatchlist(String(show.id));
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border/60 bg-card text-foreground text-sm font-display font-semibold hover:border-primary/40 hover:text-primary transition-smooth"
                  data-ocid="watchlist-btn"
                >
                  {inWatchlist ? (
                    <Check className="w-4 h-4 text-primary" />
                  ) : (
                    <BookmarkPlus className="w-4 h-4" />
                  )}
                  {inWatchlist ? "Saved" : "Save"}
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-4">
              {episode.description}
            </p>

            {/* Comments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-8"
              data-ocid="comments-section"
            >
              <h3 className="flex items-center gap-2 text-lg font-display font-bold text-foreground mb-4">
                <MessageCircle className="w-5 h-5 text-primary" />
                Comments
              </h3>

              <div
                className="glass-card rounded-xl p-4 mb-6"
                data-ocid="comment-input-area"
              >
                {isLoggedIn ? (
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0 text-primary font-display font-bold text-sm">
                      Y
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleCommentSubmit();
                          }
                        }}
                        placeholder="Add a comment..."
                        rows={2}
                        className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground border-b border-border/60 focus:border-primary outline-none resize-none pb-2 transition-colors font-body"
                        data-ocid="comment-textarea"
                      />
                      <div className="flex justify-end mt-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setCommentText("")}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleCommentSubmit}
                          disabled={
                            !commentText.trim() || commentMutation.isPending
                          }
                          className="text-xs px-4 py-1.5 bg-primary text-primary-foreground rounded-full font-display font-semibold hover:bg-primary/80 transition-smooth disabled:opacity-40"
                          data-ocid="comment-submit"
                        >
                          {commentMutation.isPending ? "Posting…" : "Comment"}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-3">
                    <p className="text-sm text-muted-foreground mb-3">
                      Sign in to join the conversation
                    </p>
                    <Link
                      to="/profile"
                      className="px-5 py-2 bg-primary text-primary-foreground text-sm font-display font-semibold rounded-full hover:bg-primary/80 transition-smooth"
                      data-ocid="sign-in-to-comment"
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </div>

              <div className="space-y-5">
                <div
                  className="text-center py-8 text-muted-foreground"
                  data-ocid="comments.empty_state"
                >
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">
                    No comments yet. Be the first to comment!
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Related shows */}
            {relatedShows.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mt-10 border-t border-border/40 pt-8"
              >
                <h3 className="text-lg font-display font-bold text-foreground mb-4">
                  More Like This
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {relatedShows.map((s, i) => (
                    <motion.div
                      key={String(s.id)}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: i * 0.08 }}
                    >
                      <ShowCard show={s} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* RIGHT: Episode sidebar */}
          <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="glass-card rounded-xl overflow-hidden sticky top-4"
            >
              {/* Sidebar header */}
              <div className="px-4 py-3 border-b border-border/40 flex items-center justify-between">
                <h3 className="font-display font-bold text-sm text-foreground">
                  Episodes
                </h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground select-none">
                  <span id="autoplay-label">Autoplay</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={autoplay}
                    aria-labelledby="autoplay-label"
                    onClick={() => setAutoplay((a) => !a)}
                    className={`relative w-9 h-5 rounded-full transition-smooth cursor-pointer ${
                      autoplay ? "bg-primary" : "bg-muted"
                    }`}
                    data-ocid="autoplay-toggle"
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                        autoplay ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Season selector */}
              {sortedSeasons.length > 1 && (
                <div className="px-4 py-2.5 border-b border-border/40">
                  <div className="flex gap-2 overflow-x-auto scrollbar-none">
                    {sortedSeasons.map((s, idx) => (
                      <button
                        key={String(s.id)}
                        type="button"
                        onClick={() => setSelectedSeasonIndex(idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-display font-semibold whitespace-nowrap transition-smooth border flex-shrink-0 ${
                          effectiveSeasonIndex === idx
                            ? "bg-primary/15 text-primary border-primary/40"
                            : "bg-muted/30 text-muted-foreground border-border/40 hover:border-primary/30"
                        }`}
                        data-ocid="sidebar-season-tab"
                      >
                        {s.title}
                      </button>
                    ))}
                  </div>

                  {sortedSeasons.length > 3 && (
                    <div className="mt-2 relative">
                      <button
                        type="button"
                        onClick={() => setSeasonDropdownOpen((o) => !o)}
                        className="flex items-center gap-2 text-sm font-display font-semibold text-foreground hover:text-primary transition-colors"
                        data-ocid="sidebar-season-selector"
                      >
                        {viewingSeason?.title ?? "Season 1"}
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform ${seasonDropdownOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      {seasonDropdownOpen && (
                        <div className="absolute left-0 mt-1 w-40 bg-popover border border-border/60 rounded-lg shadow-xl z-20 overflow-hidden">
                          {sortedSeasons.map((s, idx) => (
                            <button
                              key={String(s.id)}
                              type="button"
                              onClick={() => {
                                setSelectedSeasonIndex(idx);
                                setSeasonDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 text-xs font-display transition-smooth hover:bg-primary/10 hover:text-primary ${
                                effectiveSeasonIndex === idx
                                  ? "text-primary bg-primary/5"
                                  : "text-foreground"
                              }`}
                            >
                              {s.title}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Episode list */}
              <div className="overflow-y-auto max-h-[65vh] scrollbar-none">
                <div className="p-3 space-y-2">
                  {sortedEpisodes.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      No episodes in this season.
                    </p>
                  ) : (
                    sortedEpisodes.map((ep) => {
                      const isActive = String(ep.id) === episodeId;
                      return (
                        <Link
                          key={String(ep.id)}
                          to="/watch/$showId/$seasonId/$episodeId"
                          params={{
                            showId: String(show.id),
                            seasonId: String(viewingSeason?.id ?? ep.seasonId),
                            episodeId: String(ep.id),
                          }}
                          className={`flex items-center gap-3 p-2 rounded-lg transition-smooth cursor-pointer group ${
                            isActive
                              ? "bg-primary/10 border border-primary/40"
                              : "hover:bg-card border border-transparent hover:border-border/40"
                          }`}
                          data-ocid="sidebar-episode-row"
                        >
                          {/* Thumbnail — only for chunked/uploaded videos */}
                          <div className="relative flex-shrink-0 w-20 aspect-video rounded-md overflow-hidden bg-muted/40">
                            {ep.thumbnailUrl &&
                            !isLinkedVideo(ep.videoUrl ?? "") ? (
                              <img
                                src={ep.thumbnailUrl}
                                alt={ep.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                onError={(e) => {
                                  (
                                    e.currentTarget as HTMLImageElement
                                  ).style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                {isPaywalled ? (
                                  <Lock className="w-4 h-4 text-muted-foreground/60" />
                                ) : (
                                  <Tv className="w-4 h-4 text-muted-foreground" />
                                )}
                              </div>
                            )}
                            {isActive && !isPaywalled && (
                              <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-muted-foreground font-display mb-0.5">
                              E{String(ep.episodeNumber)}
                            </p>
                            <p
                              className={`text-xs font-display font-semibold truncate leading-tight ${
                                isActive
                                  ? "text-primary"
                                  : "text-foreground group-hover:text-primary transition-colors"
                              }`}
                            >
                              {ep.title}
                            </p>
                            {ep.durationSeconds > 0 && (
                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                {Math.floor(Number(ep.durationSeconds) / 60)}m
                              </p>
                            )}
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
}
