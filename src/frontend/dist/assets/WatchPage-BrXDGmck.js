import { c as createLucideIcon, e as useParams, g as useNavigate, u as useAuthStore, a as useActor, h as useQueryClient, r as reactExports, b as useQuery, j as jsxRuntimeExports, L as Link, f as ChevronDown, d as createActor } from "./index-BiC3Bukn.js";
import { u as useMutation } from "./useMutation-BlzaivA3.js";
import { C as CategoryBadge, S as ShowCard } from "./ShowCard-BsvhYlEI.js";
import { i as isObjStoreUrl, g as getObjStoreHash, h as hexToBytes } from "./useVideoUpload-CrjDZ9HL.js";
import { S as SubscriptionTier } from "./types-DyRIBjC_.js";
import { m as motion } from "./proxy-9YQ-IZmR.js";
import { S as Share2 } from "./share-2-CieRQocq.js";
import { C as Check } from "./check-Cliyqnti.js";
import { B as BookmarkPlus } from "./bookmark-plus-Csdekhop.js";
import { L as Lock } from "./lock-C6J3FreY.js";
import { T as Tv } from "./tv-c6wygwpJ.js";
import { R as RefreshCw } from "./refresh-cw-C--jaJgU.js";
import "./film-DdtsYYYl.js";
import "./play-BUJyb-yg.js";
import "./lock-open-IhH0KOXI.js";
import "./plus-UP_q622i.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z", key: "vv11sd" }]
];
const MessageCircle = createLucideIcon("message-circle", __iconNode);
function isLegacyChunkedUrl(url) {
  return url.trimStart().startsWith("[");
}
function isLinkedVideo(url) {
  if (!url) return false;
  if (isLegacyChunkedUrl(url)) return false;
  if (isObjStoreUrl(url)) return false;
  return true;
}
function detectVideoMode(url) {
  if (!url) return "direct";
  if (isLegacyChunkedUrl(url)) return "legacy-chunked";
  if (isObjStoreUrl(url)) return "objstore";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("vimeo.com")) return "vimeo";
  if (url.includes("drive.google.com")) return "googledrive";
  return "direct";
}
function toYouTubeEmbed(url) {
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
    if (short == null ? void 0 : short[1])
      return `https://www.youtube.com/embed/${short[1]}?autoplay=1&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&fs=1&color=white&controls=1`;
    const parsed = new URL(url);
    const v = parsed.searchParams.get("v");
    if (v)
      return `https://www.youtube.com/embed/${v}?autoplay=1&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&fs=1&color=white&controls=1`;
  } catch {
  }
  return url;
}
function toVimeoEmbed(url) {
  try {
    if (url.includes("player.vimeo.com/video/")) {
      const sep = url.includes("?") ? "&" : "?";
      return `${url}${sep}autoplay=1&byline=0&portrait=0&title=0&transparent=0&color=9333ea`;
    }
    const match = url.match(
      /vimeo\.com\/(?:video\/|channels\/\S+\/|groups\/\S+\/videos\/)?(\d+)/
    );
    if (match == null ? void 0 : match[1]) {
      return `https://player.vimeo.com/video/${match[1]}?autoplay=1&byline=0&portrait=0&title=0&transparent=0&color=9333ea`;
    }
  } catch {
  }
  return url;
}
function toGoogleDriveEmbed(url) {
  try {
    const match = url.match(/\/file\/d\/([^/]+)/);
    if (match == null ? void 0 : match[1]) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
  } catch {
  }
  return url;
}
function getEmbedUrl(url, mode) {
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
function WatchPageSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background", "data-ocid": "watch-loading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-screen-2xl mx-auto px-4 md:px-6 py-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-48 bg-muted/30 rounded animate-pulse mb-4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-video rounded-xl bg-muted/30 animate-pulse mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-2/3 bg-muted/30 rounded animate-pulse mb-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-1/3 bg-muted/20 rounded animate-pulse" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full lg:w-80 xl:w-96", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-96 rounded-xl bg-muted/20 animate-pulse" }) })
    ] })
  ] }) });
}
function WatchPageError() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen bg-background flex flex-col items-center justify-center gap-5 px-4",
      "data-ocid": "watch-error",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Tv, { className: "w-10 h-10 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground mb-2", children: "Episode Not Found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "This episode doesn't exist or has been removed." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/",
            className: "px-6 py-3 bg-primary text-primary-foreground rounded-lg font-display font-semibold text-sm hover:bg-primary/90 transition-smooth",
            children: "Back to Home"
          }
        )
      ]
    }
  );
}
function PaywallOverlay({ isLoggedIn }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full aspect-video rounded-xl overflow-hidden relative flex flex-col items-center justify-center gap-6 bg-black",
      "data-ocid": "paywall-overlay",
      style: {
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #0a0a0a 100%)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 pointer-events-none",
            style: {
              background: "radial-gradient(ellipse at 50% 40%, oklch(0.55 0.28 300 / 0.15) 0%, transparent 70%)"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.85 },
            animate: { opacity: 1, scale: 1 },
            transition: { duration: 0.4 },
            className: "relative z-10 flex flex-col items-center gap-5 px-6 text-center",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-20 h-20 rounded-full flex items-center justify-center",
                  style: {
                    background: "oklch(0.55 0.28 300 / 0.15)",
                    border: "1px solid oklch(0.55 0.28 300 / 0.4)",
                    boxShadow: "0 0 32px oklch(0.55 0.28 300 / 0.3)"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-9 h-9 text-primary" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-black text-xl md:text-2xl text-foreground mb-2", children: "Subscription Required" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-sm leading-relaxed", children: "This show requires an active subscription to watch. Unlock all episodes and exclusive content." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: "/subscribe",
                    className: "px-7 py-3 rounded-lg font-display font-bold text-sm text-primary-foreground transition-smooth",
                    style: {
                      background: "oklch(0.55 0.28 300)",
                      boxShadow: "0 0 20px oklch(0.55 0.28 300 / 0.5)"
                    },
                    "data-ocid": "paywall-subscribe-btn",
                    children: "Subscribe Now"
                  }
                ),
                !isLoggedIn && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: "/profile",
                    className: "px-7 py-3 rounded-lg border font-display font-semibold text-sm text-foreground hover:border-primary/60 hover:text-primary transition-smooth",
                    style: { borderColor: "oklch(0.55 0.28 300 / 0.3)" },
                    "data-ocid": "paywall-signin-btn",
                    children: "Sign In"
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  );
}
function useObjStoreBlobUrl(videoUrl, enabled) {
  const { actor } = useActor(createActor);
  const [blobUrl, setBlobUrl] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!enabled || !isObjStoreUrl(videoUrl) || !actor) return;
    setLoading(true);
    setError(null);
    const backendWithStorage = actor;
    if (typeof backendWithStorage._downloadFile !== "function") {
      setError("Video playback not available.");
      setLoading(false);
      return;
    }
    const hashHex = getObjStoreHash(videoUrl);
    const hashBytes = hexToBytes(hashHex);
    backendWithStorage._downloadFile(hashBytes).then((blob) => {
      const directUrl = blob.getDirectURL();
      setBlobUrl(directUrl);
      setLoading(false);
    }).catch((err) => {
      const msg = err instanceof Error ? err.message : "Failed to load video.";
      setError(msg);
      setLoading(false);
    });
  }, [videoUrl, enabled, actor]);
  return { blobUrl, loading, error };
}
function VideoPlayer({ videoUrl, title, onEnded }) {
  const mode = detectVideoMode(videoUrl);
  const isObjStore = mode === "objstore";
  const {
    blobUrl,
    loading: objLoading,
    error: objError
  } = useObjStoreBlobUrl(videoUrl, isObjStore);
  if (!videoUrl) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full aspect-video bg-black/80 flex flex-col items-center justify-center gap-3 rounded-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tv, { className: "w-12 h-12 text-muted-foreground/50" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No video URL provided for this episode." })
    ] });
  }
  if (mode === "legacy-chunked") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full aspect-video bg-black/80 flex flex-col items-center justify-center gap-4 rounded-xl px-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tv, { className: "w-12 h-12 text-muted-foreground/40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-display font-semibold text-foreground mb-1", children: "Video needs to be re-uploaded" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "This episode was stored in an old format. Please edit the episode and upload the video file again to enable playback." })
      ] })
    ] });
  }
  if (isObjStore) {
    if (objLoading) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "w-full aspect-video bg-black flex flex-col items-center justify-center gap-4 rounded-xl",
          "data-ocid": "video-loading",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-12 h-12", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-full border-2 border-primary/20" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin",
                  style: { animationDuration: "1.1s" }
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading video…" })
          ]
        }
      );
    }
    if (objError || !blobUrl) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "w-full aspect-video bg-black/80 flex flex-col items-center justify-center gap-4 rounded-xl px-6 text-center",
          "data-ocid": "video-error",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-10 h-10 text-muted-foreground/40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-display font-semibold text-foreground mb-1", children: "Could not load video" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: objError ?? "Please try refreshing the page." })
            ] })
          ]
        }
      );
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "video",
      {
        className: "w-full aspect-video rounded-xl bg-black",
        controls: true,
        playsInline: true,
        preload: "metadata",
        onEnded,
        "data-ocid": "video-player",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("source", { src: blobUrl, type: "video/mp4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("track", { kind: "captions", srcLang: "en", label: "English", default: true }),
          "Your browser does not support the video element."
        ]
      },
      blobUrl
    );
  }
  if (mode === "direct") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "video",
      {
        className: "w-full aspect-video rounded-xl bg-black",
        controls: true,
        playsInline: true,
        preload: "metadata",
        onEnded,
        "data-ocid": "video-player",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("source", { src: videoUrl }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("track", { kind: "captions", srcLang: "en", label: "English", default: true }),
          "Your browser does not support the video element."
        ]
      }
    );
  }
  const embedUrl = getEmbedUrl(videoUrl, mode);
  const iframeAllow = "accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share";
  const sandbox = mode === "youtube" || mode === "vimeo" ? "allow-scripts allow-same-origin allow-presentation allow-popups" : "allow-scripts allow-same-origin allow-presentation allow-forms";
  return (
    // Wrapper with overflow:hidden so nothing bleeds out of the player box
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full aspect-video overflow-hidden bg-black", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "absolute top-0 left-0 right-0 z-20 pointer-events-none",
          style: { height: 52, background: "rgba(0,0,0,0.92)" },
          "aria-hidden": "true"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "iframe",
        {
          src: embedUrl,
          title,
          className: "absolute inset-0 w-full h-full border-0",
          allow: iframeAllow,
          sandbox,
          allowFullScreen: true,
          referrerPolicy: "no-referrer-when-downgrade",
          "data-ocid": "video-player",
          style: { border: "none" }
        }
      )
    ] })
  );
}
function WatchPage() {
  const { showId, seasonId, episodeId } = useParams({
    from: "/watch/$showId/$seasonId/$episodeId"
  });
  const navigate = useNavigate();
  const { isLoggedIn, toggleWatchlist, isInWatchlist } = useAuthStore();
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [selectedSeasonIndex, setSelectedSeasonIndex] = reactExports.useState(0);
  const [seasonDropdownOpen, setSeasonDropdownOpen] = reactExports.useState(false);
  const [autoplay, setAutoplay] = reactExports.useState(true);
  const [commentText, setCommentText] = reactExports.useState("");
  const { data: callerProfile } = useQuery({
    queryKey: ["callerProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && isLoggedIn
  });
  const {
    data: episode,
    isLoading: epLoading,
    isError: epError
  } = useQuery({
    queryKey: ["episode", episodeId],
    queryFn: async () => {
      if (!actor) return null;
      const ep = await actor.getEpisode(BigInt(episodeId));
      return ep;
    },
    enabled: !!actor && !actorFetching
  });
  const {
    data: show,
    isLoading: showLoading,
    isError: showError
  } = useQuery({
    queryKey: ["show", showId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getShow(BigInt(showId));
    },
    enabled: !!actor && !actorFetching
  });
  const { data: seasons = [], isLoading: seasonsLoading } = useQuery({
    queryKey: ["seasons", showId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSeasons(BigInt(showId));
    },
    enabled: !!actor && !actorFetching && !!show
  });
  const currentSeasonData = seasons.find((s) => String(s.id) === seasonId) ?? seasons[selectedSeasonIndex] ?? seasons[0];
  const { data: seasonEpisodes = [] } = useQuery({
    queryKey: ["episodes", String((currentSeasonData == null ? void 0 : currentSeasonData.id) ?? "")],
    queryFn: async () => {
      if (!actor || !currentSeasonData) return [];
      return actor.listEpisodes(currentSeasonData.id);
    },
    enabled: !!actor && !actorFetching && !!currentSeasonData
  });
  const { data: allShows = [] } = useQuery({
    queryKey: ["approvedShows"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listApprovedShows();
    },
    enabled: !!actor && !actorFetching
  });
  const commentMutation = useMutation({
    mutationFn: async (text) => {
      if (!actor) throw new Error("Not connected");
      return actor.addComment(BigInt(episodeId), text);
    },
    onSuccess: () => {
      setCommentText("");
      void queryClient.invalidateQueries({ queryKey: ["comments", episodeId] });
    }
  });
  function handleCommentSubmit() {
    const trimmed = commentText.trim();
    if (!trimmed || commentMutation.isPending) return;
    commentMutation.mutate(trimmed);
  }
  const isLoading = epLoading || showLoading || seasonsLoading;
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(WatchPageSkeleton, {});
  if (epError || showError || !episode || !show) return /* @__PURE__ */ jsxRuntimeExports.jsx(WatchPageError, {});
  const userTier = callerProfile ? callerProfile.subscriptionTier : SubscriptionTier.Free;
  const isSubscribed = isLoggedIn && userTier !== SubscriptionTier.Free;
  const isPaywalled = !show.isFree && !isSubscribed;
  const sortedSeasons = [...seasons].sort(
    (a, b) => Number(a.seasonNumber) - Number(b.seasonNumber)
  );
  const viewingSeasonIndex = sortedSeasons.findIndex(
    (s) => String(s.id) === seasonId
  );
  const effectiveSeasonIndex = viewingSeasonIndex >= 0 ? viewingSeasonIndex : selectedSeasonIndex;
  const viewingSeason = sortedSeasons[effectiveSeasonIndex] ?? sortedSeasons[0];
  const sortedEpisodes = [...seasonEpisodes].sort(
    (a, b) => Number(a.episodeNumber) - Number(b.episodeNumber)
  );
  const inWatchlist = isInWatchlist(String(show.id));
  const relatedShows = allShows.filter((s) => s.category === show.category && String(s.id) !== showId).slice(0, 4);
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
          showId,
          seasonId: String(viewingSeason.id),
          episodeId: String(next.id)
        }
      });
    }
  }
  const videoUrl = episode.videoUrl ?? "";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background", "data-ocid": "watch-page", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-screen-2xl mx-auto px-4 md:px-6 py-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground mb-4 font-body", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/show/$showId",
          params: { showId: String(show.id) },
          className: "hover:text-primary transition-colors",
          children: show.title
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "/" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground truncate", children: episode.title })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.98 },
            animate: { opacity: 1, scale: 1 },
            transition: { duration: 0.4 },
            className: "relative w-full rounded-xl overflow-hidden bg-black neon-border shadow-2xl",
            children: isPaywalled ? /* @__PURE__ */ jsxRuntimeExports.jsx(PaywallOverlay, { isLoggedIn }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/70 to-transparent pointer-events-none", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white/70 text-xs font-body mb-0.5", children: [
                  show.title,
                  " ·",
                  " ",
                  (currentSeasonData == null ? void 0 : currentSeasonData.title) ?? "Season 1"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-white font-display font-bold text-lg leading-tight drop-shadow", children: episode.title })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                VideoPlayer,
                {
                  videoUrl,
                  posterUrl: isLinkedVideo(videoUrl) ? void 0 : episode.thumbnailUrl ?? void 0,
                  title: episode.title,
                  onEnded: handleVideoEnded
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-col sm:flex-row sm:items-start gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center gap-2 mb-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryBadge, { category: show.category }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl md:text-2xl font-display font-black text-foreground mb-1", children: episode.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              "Episode ",
              String(episode.episodeNumber)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-shrink-0 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: handleShare,
                className: "flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border/60 bg-card text-foreground text-sm font-display font-semibold hover:border-primary/40 hover:text-primary transition-smooth",
                "data-ocid": "share-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "w-4 h-4" }),
                  "Share"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => {
                  if (isLoggedIn) toggleWatchlist(String(show.id));
                },
                className: "flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border/60 bg-card text-foreground text-sm font-display font-semibold hover:border-primary/40 hover:text-primary transition-smooth",
                "data-ocid": "watchlist-btn",
                children: [
                  inWatchlist ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(BookmarkPlus, { className: "w-4 h-4" }),
                  inWatchlist ? "Saved" : "Save"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-4", children: episode.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { duration: 0.5 },
            className: "mt-8",
            "data-ocid": "comments-section",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "flex items-center gap-2 text-lg font-display font-bold text-foreground mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-5 h-5 text-primary" }),
                "Comments"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "glass-card rounded-xl p-4 mb-6",
                  "data-ocid": "comment-input-area",
                  children: isLoggedIn ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0 text-primary font-display font-bold text-sm", children: "Y" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "textarea",
                        {
                          value: commentText,
                          onChange: (e) => setCommentText(e.target.value),
                          onKeyDown: (e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleCommentSubmit();
                            }
                          },
                          placeholder: "Add a comment...",
                          rows: 2,
                          className: "w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground border-b border-border/60 focus:border-primary outline-none resize-none pb-2 transition-colors font-body",
                          "data-ocid": "comment-textarea"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end mt-2 gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => setCommentText(""),
                            className: "text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1",
                            children: "Cancel"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: handleCommentSubmit,
                            disabled: !commentText.trim() || commentMutation.isPending,
                            className: "text-xs px-4 py-1.5 bg-primary text-primary-foreground rounded-full font-display font-semibold hover:bg-primary/80 transition-smooth disabled:opacity-40",
                            "data-ocid": "comment-submit",
                            children: commentMutation.isPending ? "Posting…" : "Comment"
                          }
                        )
                      ] })
                    ] })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-3", children: "Sign in to join the conversation" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Link,
                      {
                        to: "/profile",
                        className: "px-5 py-2 bg-primary text-primary-foreground text-sm font-display font-semibold rounded-full hover:bg-primary/80 transition-smooth",
                        "data-ocid": "sign-in-to-comment",
                        children: "Sign In"
                      }
                    )
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "text-center py-8 text-muted-foreground",
                  "data-ocid": "comments.empty_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-8 h-8 mx-auto mb-2 opacity-30" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No comments yet. Be the first to comment!" })
                  ]
                }
              ) })
            ]
          }
        ),
        relatedShows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 24 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { duration: 0.5 },
            className: "mt-10 border-t border-border/40 pt-8",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-display font-bold text-foreground mb-4", children: "More Like This" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: relatedShows.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { opacity: 0, y: 16 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true },
                  transition: { duration: 0.35, delay: i * 0.08 },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShowCard, { show: s })
                },
                String(s.id)
              )) })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "w-full lg:w-80 xl:w-96 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: 20 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.45, delay: 0.15 },
          className: "glass-card rounded-xl overflow-hidden sticky top-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-b border-border/40 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-sm text-foreground", children: "Episodes" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground select-none", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { id: "autoplay-label", children: "Autoplay" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    role: "switch",
                    "aria-checked": autoplay,
                    "aria-labelledby": "autoplay-label",
                    onClick: () => setAutoplay((a) => !a),
                    className: `relative w-9 h-5 rounded-full transition-smooth cursor-pointer ${autoplay ? "bg-primary" : "bg-muted"}`,
                    "data-ocid": "autoplay-toggle",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${autoplay ? "translate-x-4" : "translate-x-0.5"}`
                      }
                    )
                  }
                )
              ] })
            ] }),
            sortedSeasons.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2.5 border-b border-border/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 overflow-x-auto scrollbar-none", children: sortedSeasons.map((s, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setSelectedSeasonIndex(idx),
                  className: `px-3 py-1.5 rounded-lg text-xs font-display font-semibold whitespace-nowrap transition-smooth border flex-shrink-0 ${effectiveSeasonIndex === idx ? "bg-primary/15 text-primary border-primary/40" : "bg-muted/30 text-muted-foreground border-border/40 hover:border-primary/30"}`,
                  "data-ocid": "sidebar-season-tab",
                  children: s.title
                },
                String(s.id)
              )) }),
              sortedSeasons.length > 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setSeasonDropdownOpen((o) => !o),
                    className: "flex items-center gap-2 text-sm font-display font-semibold text-foreground hover:text-primary transition-colors",
                    "data-ocid": "sidebar-season-selector",
                    children: [
                      (viewingSeason == null ? void 0 : viewingSeason.title) ?? "Season 1",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        ChevronDown,
                        {
                          className: `w-3.5 h-3.5 transition-transform ${seasonDropdownOpen ? "rotate-180" : ""}`
                        }
                      )
                    ]
                  }
                ),
                seasonDropdownOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-0 mt-1 w-40 bg-popover border border-border/60 rounded-lg shadow-xl z-20 overflow-hidden", children: sortedSeasons.map((s, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setSelectedSeasonIndex(idx);
                      setSeasonDropdownOpen(false);
                    },
                    className: `w-full text-left px-3 py-2 text-xs font-display transition-smooth hover:bg-primary/10 hover:text-primary ${effectiveSeasonIndex === idx ? "text-primary bg-primary/5" : "text-foreground"}`,
                    children: s.title
                  },
                  String(s.id)
                )) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-y-auto max-h-[65vh] scrollbar-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 space-y-2", children: sortedEpisodes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center py-4", children: "No episodes in this season." }) : sortedEpisodes.map((ep) => {
              const isActive = String(ep.id) === episodeId;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: "/watch/$showId/$seasonId/$episodeId",
                  params: {
                    showId: String(show.id),
                    seasonId: String((viewingSeason == null ? void 0 : viewingSeason.id) ?? ep.seasonId),
                    episodeId: String(ep.id)
                  },
                  className: `flex items-center gap-3 p-2 rounded-lg transition-smooth cursor-pointer group ${isActive ? "bg-primary/10 border border-primary/40" : "hover:bg-card border border-transparent hover:border-border/40"}`,
                  "data-ocid": "sidebar-episode-row",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-shrink-0 w-20 aspect-video rounded-md overflow-hidden bg-muted/40", children: [
                      ep.thumbnailUrl && !isLinkedVideo(ep.videoUrl ?? "") ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "img",
                        {
                          src: ep.thumbnailUrl,
                          alt: ep.title,
                          className: "w-full h-full object-cover",
                          loading: "lazy",
                          onError: (e) => {
                            e.currentTarget.style.display = "none";
                          }
                        }
                      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: isPaywalled ? /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-4 h-4 text-muted-foreground/60" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Tv, { className: "w-4 h-4 text-muted-foreground" }) }),
                      isActive && !isPaywalled && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-primary/30 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-primary animate-pulse" }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground font-display mb-0.5", children: [
                        "E",
                        String(ep.episodeNumber)
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: `text-xs font-display font-semibold truncate leading-tight ${isActive ? "text-primary" : "text-foreground group-hover:text-primary transition-colors"}`,
                          children: ep.title
                        }
                      ),
                      ep.durationSeconds > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: [
                        Math.floor(Number(ep.durationSeconds) / 60),
                        "m"
                      ] })
                    ] })
                  ]
                },
                String(ep.id)
              );
            }) }) })
          ]
        }
      ) })
    ] })
  ] }) });
}
export {
  WatchPage as default
};
