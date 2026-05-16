import { e as useParams, u as useAuthStore, a as useActor, r as reactExports, b as useQuery, j as jsxRuntimeExports, L as Link, f as ChevronDown, d as createActor } from "./index-BiC3Bukn.js";
import { C as CategoryBadge, S as ShowCard } from "./ShowCard-BsvhYlEI.js";
import { S as SubscriptionTier } from "./types-DyRIBjC_.js";
import { T as Tv } from "./tv-c6wygwpJ.js";
import { m as motion } from "./proxy-9YQ-IZmR.js";
import { S as Star } from "./star-Bz45glpD.js";
import { L as Lock } from "./lock-C6J3FreY.js";
import { P as Play } from "./play-BUJyb-yg.js";
import { C as Check } from "./check-Cliyqnti.js";
import { P as Plus } from "./plus-UP_q622i.js";
import { S as Share2 } from "./share-2-CieRQocq.js";
import "./film-DdtsYYYl.js";
import "./lock-open-IhH0KOXI.js";
function isLinkedVideo(url) {
  if (!url) return false;
  return !url.trimStart().startsWith("[");
}
function SubscriptionBanner() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: -8 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.35 },
      className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl mb-5",
      style: {
        background: "linear-gradient(135deg, oklch(0.55 0.28 300 / 0.12) 0%, oklch(0.55 0.28 300 / 0.06) 100%)",
        border: "1px solid oklch(0.55 0.28 300 / 0.3)"
      },
      "data-ocid": "subscription-banner",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
              style: { background: "oklch(0.55 0.28 300 / 0.15)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-4 h-4 text-primary" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-sm text-foreground", children: "Subscribe to unlock all episodes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Get full access to every season and episode" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/subscribe",
            className: "px-5 py-2.5 rounded-lg font-display font-bold text-sm text-primary-foreground whitespace-nowrap flex-shrink-0 transition-smooth",
            style: {
              background: "oklch(0.55 0.28 300)",
              boxShadow: "0 0 16px oklch(0.55 0.28 300 / 0.4)"
            },
            "data-ocid": "subscribe-now-btn",
            children: "Subscribe Now"
          }
        )
      ]
    }
  );
}
function LockedEpisodeCard({ episode }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/subscribe",
      className: "group flex gap-3 p-3 rounded-lg border border-border/40 bg-card/40 transition-smooth hover:bg-card/80 hover:border-primary/30",
      "data-ocid": "episode-card-locked",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-shrink-0 w-32 aspect-video rounded-md overflow-hidden bg-muted/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-6 h-6 text-muted-foreground/50" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-6 h-6 text-primary" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 flex flex-col justify-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-display text-muted-foreground", children: [
            "E",
            String(episode.episodeNumber)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors", children: episode.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-xs font-display font-semibold self-start px-2 py-0.5 rounded-full",
              style: {
                background: "oklch(0.55 0.28 300 / 0.12)",
                color: "oklch(0.75 0.18 300)",
                border: "1px solid oklch(0.55 0.28 300 / 0.25)"
              },
              children: "Subscribe to watch"
            }
          )
        ] })
      ]
    }
  );
}
function BackendEpisodeCard({
  episode,
  showId
}) {
  const showThumbnail = !!episode.thumbnailUrl && !isLinkedVideo(episode.videoUrl ?? "");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/watch/$showId/$seasonId/$episodeId",
      params: {
        showId,
        seasonId: String(episode.seasonId),
        episodeId: String(episode.id)
      },
      className: "group flex gap-3 p-3 rounded-lg border border-border/40 bg-card/40 transition-smooth hover:bg-card/80 hover:border-primary/30",
      "data-ocid": "episode-card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-shrink-0 w-32 aspect-video rounded-md overflow-hidden bg-muted/40", children: [
          showThumbnail ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: episode.thumbnailUrl,
              alt: episode.title,
              className: "w-full h-full object-cover transition-smooth group-hover:scale-105",
              loading: "lazy",
              onError: (e) => {
                e.currentTarget.style.display = "none";
              }
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Tv, { className: "w-6 h-6 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-6 h-6 text-white fill-white" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 flex flex-col justify-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-display text-muted-foreground", children: [
            "E",
            String(episode.episodeNumber)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors", children: episode.title }),
          episode.durationSeconds > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            Math.floor(Number(episode.durationSeconds) / 60),
            "m"
          ] })
        ] })
      ]
    }
  );
}
function ShowDetailPage() {
  const { showId } = useParams({ from: "/show/$showId" });
  const { isLoggedIn, toggleWatchlist, isInWatchlist } = useAuthStore();
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const [selectedSeasonIndex, setSelectedSeasonIndex] = reactExports.useState(0);
  const [seasonDropdownOpen, setSeasonDropdownOpen] = reactExports.useState(false);
  const { data: callerProfile } = useQuery({
    queryKey: ["callerProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && isLoggedIn
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
  const { data: allEpisodes = [] } = useQuery({
    queryKey: [
      "allEpisodes",
      showId,
      seasons.map((s) => String(s.id)).join(",")
    ],
    queryFn: async () => {
      if (!actor || seasons.length === 0) return [];
      const results = await Promise.all(
        seasons.map((s) => actor.listEpisodes(s.id))
      );
      return results.flat();
    },
    enabled: !!actor && !actorFetching && seasons.length > 0
  });
  const { data: relatedShows = [] } = useQuery({
    queryKey: ["approvedShows"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listApprovedShows();
    },
    enabled: !!actor && !actorFetching
  });
  const isLoading = showLoading || seasonsLoading;
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "min-h-screen bg-background",
        "data-ocid": "show-detail-loading",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full aspect-[21/9] min-h-[280px] max-h-[520px] bg-muted/20 animate-pulse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative -mt-40 px-4 md:px-8 lg:px-16 pb-16 max-w-screen-xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row gap-8 items-start", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 w-44 md:w-52 aspect-[2/3] rounded-xl bg-muted/30 animate-pulse hidden md:block" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 pt-32 md:pt-10 space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-24 bg-muted/30 rounded animate-pulse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-3/4 bg-muted/30 rounded animate-pulse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-full bg-muted/30 rounded animate-pulse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-32 bg-muted/30 rounded-lg animate-pulse" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-24 bg-muted/30 rounded-lg animate-pulse" })
              ] })
            ] })
          ] }) })
        ]
      }
    );
  }
  if (showError || !show) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "min-h-screen bg-background flex flex-col items-center justify-center gap-5 px-4",
        "data-ocid": "show-not-found",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Tv, { className: "w-10 h-10 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground mb-2", children: "Show Not Found" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "This show doesn't exist or has been removed." })
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
  const userTier = callerProfile ? callerProfile.subscriptionTier : SubscriptionTier.Free;
  const isSubscribed = isLoggedIn && userTier !== SubscriptionTier.Free;
  const isPaywalled = !show.isFree && !isSubscribed;
  const seasonsWithEpisodes = seasons.map((s) => ({
    ...s,
    episodes: allEpisodes.filter((ep) => ep.seasonId === s.id).sort((a, b) => Number(a.episodeNumber) - Number(b.episodeNumber))
  })).sort((a, b) => Number(a.seasonNumber) - Number(b.seasonNumber));
  const currentSeason = seasonsWithEpisodes[selectedSeasonIndex] ?? seasonsWithEpisodes[0];
  const firstEpisode = currentSeason == null ? void 0 : currentSeason.episodes[0];
  const inWatchlist = isInWatchlist(String(show.id));
  const related = relatedShows.filter((s) => s.category === show.category && String(s.id) !== showId).slice(0, 4);
  const totalEpisodeCount = seasonsWithEpisodes.reduce(
    (acc, s) => acc + s.episodes.length,
    0
  );
  function handleShare() {
    void navigator.clipboard.writeText(window.location.href);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", "data-ocid": "show-detail-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full aspect-[21/9] min-h-[280px] max-h-[520px] overflow-hidden", children: [
      show.coverImageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: show.coverImageUrl,
          alt: show.title,
          className: "w-full h-full object-cover",
          onError: (e) => {
            e.currentTarget.style.display = "none";
          }
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-gradient-to-br from-primary/20 via-muted/40 to-background" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/55 to-transparent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-background/85 via-transparent to-transparent" }),
      show.category === "Exclusive" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-6 left-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-3 py-1 text-xs font-display font-bold bg-primary text-primary-foreground rounded-full uppercase tracking-widest glow-primary", children: "Exclusive" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative -mt-40 px-4 md:px-8 lg:px-16 pb-16 max-w-screen-xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row gap-8 items-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5 },
            className: "flex-shrink-0 w-44 md:w-52 rounded-xl overflow-hidden neon-border shadow-2xl hidden md:block",
            children: show.coverImageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: show.coverImageUrl,
                alt: show.title,
                className: "w-full aspect-[2/3] h-full object-cover",
                onError: (e) => {
                  e.currentTarget.style.display = "none";
                }
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full aspect-[2/3] bg-muted/40 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Tv, { className: "w-16 h-16 text-muted-foreground" }) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 24 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5, delay: 0.1 },
            className: "flex-1 min-w-0 pt-32 md:pt-10",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryBadge, { category: show.category }),
                show.isFeatured && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 text-xs font-display font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full uppercase tracking-wide", children: "Featured" }),
                show.isFree && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 text-xs font-display font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full uppercase tracking-wide", children: "Free" }),
                isPaywalled && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "px-2 py-0.5 text-xs font-display font-bold rounded-full uppercase tracking-wide",
                    style: {
                      background: "oklch(0.55 0.28 300 / 0.15)",
                      color: "oklch(0.75 0.18 300)",
                      border: "1px solid oklch(0.55 0.28 300 / 0.35)"
                    },
                    children: "Subscribers Only"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-amber-400", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-4 h-4 fill-current" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-display font-semibold", children: "4.5" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl md:text-5xl font-display font-black text-foreground mb-3 leading-tight", children: show.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl mb-4 line-clamp-3", children: show.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center gap-5 text-sm text-muted-foreground mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                seasonsWithEpisodes.length,
                " ",
                seasonsWithEpisodes.length === 1 ? "Season" : "Seasons",
                " ",
                "· ",
                totalEpisodeCount,
                " Episodes"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
                isPaywalled ? (
                  /* Locked — redirect to subscribe */
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Link,
                    {
                      to: "/subscribe",
                      className: "flex items-center gap-2 px-6 py-3 rounded-lg font-display font-bold text-sm text-primary-foreground transition-smooth shadow-lg",
                      style: {
                        background: "oklch(0.55 0.28 300)",
                        boxShadow: "0 0 20px oklch(0.55 0.28 300 / 0.45)"
                      },
                      "data-ocid": "watch-now-locked-btn",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-4 h-4" }),
                        "Subscribe to Watch"
                      ]
                    }
                  )
                ) : firstEpisode && currentSeason && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Link,
                  {
                    to: "/watch/$showId/$seasonId/$episodeId",
                    params: {
                      showId: String(show.id),
                      seasonId: String(currentSeason.id),
                      episodeId: String(firstEpisode.id)
                    },
                    className: "flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-display font-bold text-sm hover:bg-primary/90 transition-smooth glow-primary shadow-lg",
                    "data-ocid": "watch-now-btn",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-4 h-4 fill-current" }),
                      "Watch Now"
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
                    className: "flex items-center gap-2 px-5 py-3 bg-card border border-border/60 text-foreground rounded-lg font-display font-semibold text-sm hover:border-primary/60 hover:text-primary transition-smooth",
                    "data-ocid": "watchlist-btn",
                    children: [
                      inWatchlist ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                      inWatchlist ? "In My List" : "My List"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: handleShare,
                    className: "flex items-center gap-2 px-5 py-3 bg-card border border-border/60 text-foreground rounded-lg font-display font-semibold text-sm hover:border-primary/40 hover:text-primary transition-smooth",
                    "data-ocid": "share-btn",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "w-4 h-4" }),
                      "Share"
                    ]
                  }
                )
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 32 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay: 0.25 },
          className: "mt-12",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-display font-bold text-foreground", children: "Episodes" }),
              seasonsWithEpisodes.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setSeasonDropdownOpen((o) => !o),
                    className: "flex items-center gap-2 px-4 py-2 bg-card border border-border/60 rounded-lg text-sm font-display font-semibold text-foreground hover:border-primary/50 transition-smooth",
                    "data-ocid": "season-selector",
                    children: [
                      (currentSeason == null ? void 0 : currentSeason.title) ?? "Season 1",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        ChevronDown,
                        {
                          className: `w-4 h-4 transition-transform ${seasonDropdownOpen ? "rotate-180" : ""}`
                        }
                      )
                    ]
                  }
                ),
                seasonDropdownOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-0 mt-2 w-44 glass-card rounded-lg shadow-xl z-20 overflow-hidden", children: seasonsWithEpisodes.map((season, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setSelectedSeasonIndex(idx);
                      setSeasonDropdownOpen(false);
                    },
                    className: `w-full text-left px-4 py-2.5 text-sm font-display transition-smooth hover:bg-primary/10 hover:text-primary ${idx === selectedSeasonIndex ? "text-primary bg-primary/5" : "text-foreground"}`,
                    children: season.title
                  },
                  String(season.id)
                )) })
              ] })
            ] }),
            isPaywalled && /* @__PURE__ */ jsxRuntimeExports.jsx(SubscriptionBanner, {}),
            seasonsWithEpisodes.length > 1 && seasonsWithEpisodes.length <= 4 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mb-4 overflow-x-auto scrollbar-none", children: seasonsWithEpisodes.map((season, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setSelectedSeasonIndex(idx),
                className: `px-4 py-2 rounded-lg text-sm font-display font-semibold transition-smooth border whitespace-nowrap flex-shrink-0 ${selectedSeasonIndex === idx ? "bg-primary/15 text-primary border-primary/40" : "bg-muted/30 text-muted-foreground border-border/40 hover:border-primary/30"}`,
                "data-ocid": "season-tab",
                children: season.title
              },
              String(season.id)
            )) }),
            (currentSeason == null ? void 0 : currentSeason.episodes.length) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "py-12 text-center text-muted-foreground",
                "data-ocid": "no-episodes",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Tv, { className: "w-12 h-12 mx-auto mb-3 opacity-30" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "No episodes available for this season yet." })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 md:grid-cols-2", children: ((currentSeason == null ? void 0 : currentSeason.episodes) ?? []).map(
              (ep) => isPaywalled ? /* @__PURE__ */ jsxRuntimeExports.jsx(LockedEpisodeCard, { episode: ep }, String(ep.id)) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                BackendEpisodeCard,
                {
                  episode: ep,
                  showId: String(show.id)
                },
                String(ep.id)
              )
            ) })
          ]
        }
      ),
      related.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 32 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.5 },
          className: "mt-16",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-display font-bold text-foreground mb-6", children: "More Like This" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4", children: related.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0, y: 20 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true },
                transition: { duration: 0.4, delay: i * 0.08 },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShowCard, { show: s })
              },
              String(s.id)
            )) })
          ]
        }
      )
    ] })
  ] });
}
export {
  ShowDetailPage as default
};
