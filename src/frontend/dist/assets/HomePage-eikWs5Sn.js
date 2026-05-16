import { c as createLucideIcon, u as useAuthStore, a as useActor, b as useQuery, j as jsxRuntimeExports, L as Link, r as reactExports, Z as Zap, d as createActor } from "./index-BiC3Bukn.js";
import { B as Button } from "./ZyroButton-D0sGJGRD.js";
import { S as Sparkles } from "./sparkles-DnqwujiC.js";
import { S as Star } from "./star-Bz45glpD.js";
import { P as Play } from "./play-BUJyb-yg.js";
import { C as CircleCheckBig } from "./circle-check-big-BD4jnPKH.js";
import { B as BookmarkPlus } from "./bookmark-plus-Csdekhop.js";
import { C as ChevronLeft } from "./chevron-left-DQolYA18.js";
import { C as ChevronRight } from "./chevron-right-y-grUHwQ.js";
import { F as Film } from "./film-DdtsYYYl.js";
import { T as Tv } from "./tv-c6wygwpJ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
      key: "96xj49"
    }
  ]
];
const Flame = createLucideIcon("flame", __iconNode);
const cache = /* @__PURE__ */ new Map();
function hexToImageSrc(value) {
  if (!value || value.trim().length === 0) return void 0;
  const trimmed = value.trim();
  if (trimmed.startsWith("http") || trimmed.startsWith("blob:") || trimmed.startsWith("data:")) {
    return trimmed;
  }
  const cached = cache.get(trimmed);
  if (cached) return cached;
  if (!/^[0-9a-fA-F]+$/.test(trimmed)) {
    return void 0;
  }
  const normalized = trimmed.length % 2 !== 0 ? `0${trimmed}` : trimmed;
  const len = normalized.length / 2;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = Number.parseInt(normalized.slice(i * 2, i * 2 + 2), 16);
  }
  if (len < 4) return void 0;
  let mimeType = "image/jpeg";
  if (bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71) {
    mimeType = "image/png";
  } else if (bytes[0] === 255 && bytes[1] === 216) {
    mimeType = "image/jpeg";
  } else if (bytes[0] === 71 && bytes[1] === 73 && bytes[2] === 70) {
    mimeType = "image/gif";
  } else if (bytes[0] === 82 && bytes[1] === 73 && bytes[2] === 70 && bytes[3] === 70) {
    mimeType = "image/webp";
  }
  try {
    const blob = new Blob([bytes], { type: mimeType });
    const url = URL.createObjectURL(blob);
    cache.set(trimmed, url);
    return url;
  } catch {
    return void 0;
  }
}
function LandscapeCard({
  show,
  index
}) {
  const coverSrc = hexToImageSrc(show.coverImageUrl);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Link,
    {
      to: "/show/$showId",
      params: { showId: String(show.id) },
      className: "group shrink-0 w-[280px] sm:w-[320px]",
      "data-ocid": `show-card.item.${(index ?? 0) + 1}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-xl overflow-hidden bg-card border border-border/40 transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-[0_0_24px_rgba(168,85,247,0.22)] group-hover:scale-[1.03]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-video overflow-hidden bg-muted/20", children: [
          coverSrc ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: coverSrc,
              alt: show.title,
              className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
              loading: "lazy"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-gradient-to-br from-primary/10 via-muted/20 to-background flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "w-10 h-10 text-muted-foreground/30" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.5)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-5 h-5 text-white fill-white ml-0.5" }) }) }),
          show.isFree && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold uppercase tracking-wide", children: "Free" }),
          !show.isFree && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-2 right-2 px-2 py-0.5 rounded-full bg-primary/80 text-white text-[10px] font-bold uppercase tracking-wide", children: "Premium" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors duration-200", children: show.title }),
          show.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs line-clamp-1 mt-0.5", children: show.description })
        ] })
      ] })
    }
  );
}
function HorizontalRow({
  title,
  icon,
  href,
  children,
  initialVisible = false
}) {
  const ref = reactExports.useRef(null);
  const [visible, setVisible] = reactExports.useState(initialVisible);
  const scrollRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (initialVisible) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [initialVisible]);
  function scrollBy(dir) {
    var _a;
    (_a = scrollRef.current) == null ? void 0 : _a.scrollBy({
      left: dir === "left" ? -640 : 640,
      behavior: "smooth"
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      ref,
      className: `transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4 px-6 md:px-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "flex items-center gap-2.5 font-display font-bold text-lg md:text-xl text-foreground", children: [
            icon,
            title
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            href && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: href,
                className: "text-sm text-primary hover:text-primary/80 font-display transition-colors duration-200 mr-2",
                "data-ocid": "see-all-link",
                children: "See All"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => scrollBy("left"),
                className: "w-7 h-7 rounded-full bg-muted/60 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth",
                "aria-label": "Scroll left",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => scrollBy("right"),
                className: "w-7 h-7 rounded-full bg-muted/60 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth",
                "aria-label": "Scroll right",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            ref: scrollRef,
            className: "flex gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory pl-6 md:pl-10 pr-6",
            children
          }
        )
      ]
    }
  );
}
function LandscapeSkeletons({ count = 5 }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: Array.from({ length: count }, (_, i) => `sk-${i}`).map((key) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 w-[280px] sm:w-[320px] snap-start", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl overflow-hidden bg-card border border-border/40 animate-pulse", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-video bg-muted/20" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-2.5 space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3.5 w-3/4 bg-muted/30 rounded" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-1/2 bg-muted/20 rounded" })
    ] })
  ] }) }, key)) });
}
function RowEmpty({ label }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "shrink-0 w-full min-w-[300px] flex flex-col items-center justify-center py-12 text-center rounded-xl border border-border/30 bg-card/20",
      "data-ocid": "shows-empty-state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tv, { className: "w-8 h-8 text-muted-foreground/40 mb-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-sm text-foreground", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mt-1", children: "Check back soon!" })
      ]
    }
  );
}
function HeroBrandingPlaceholder() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "relative w-full flex items-end overflow-hidden",
      style: { minHeight: "88vh" },
      "data-ocid": "hero-section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 bg-[#0a0a0a]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_-10%,rgba(168,85,247,0.28),transparent)]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 opacity-[0.04]",
              style: {
                backgroundImage: "linear-gradient(rgba(168,85,247,1) 1px,transparent 1px),linear-gradient(90deg,rgba(168,85,247,1) 1px,transparent 1px)",
                backgroundSize: "60px 60px"
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 w-full px-6 md:px-14 pb-16 pt-32 flex flex-col items-start max-w-2xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(168,85,247,0.3)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-8 h-8 text-primary fill-primary/20" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-display font-bold uppercase tracking-widest mb-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-primary animate-pulse" }),
            "Premium Streaming"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-black text-5xl sm:text-6xl md:text-7xl text-foreground mb-4 leading-[0.9] tracking-tighter", children: [
            "Zyro",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary drop-shadow-[0_0_30px_rgba(168,85,247,0.8)]", children: "TV" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg mb-8 max-w-lg leading-relaxed", children: "Premium original content is on its way. Subscribe now and be the first to watch exclusive shows the moment they drop." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/subscribe", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "primary",
                size: "lg",
                className: "gap-2 shadow-[0_0_30px_rgba(168,85,247,0.45)] text-base px-8",
                "data-ocid": "hero-subscribe-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-5 h-5 fill-current" }),
                  "Get Started"
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/browse", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "secondary",
                size: "lg",
                className: "text-base",
                "data-ocid": "hero-browse-btn",
                children: "Browse Library"
              }
            ) })
          ] })
        ] })
      ]
    }
  );
}
function HeroSection({ featuredShows }) {
  const [current, setCurrent] = reactExports.useState(0);
  const [fading, setFading] = reactExports.useState(false);
  const { isLoggedIn, toggleWatchlist, isInWatchlist } = useAuthStore();
  const intervalRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (featuredShows.length < 2) return;
    intervalRef.current = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % featuredShows.length);
        setFading(false);
      }, 350);
    }, 6e3);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [featuredShows.length]);
  if (featuredShows.length === 0) return /* @__PURE__ */ jsxRuntimeExports.jsx(HeroBrandingPlaceholder, {});
  const show = featuredShows[current];
  const coverSrc = hexToImageSrc(show.coverImageUrl);
  const inWatchlist = isInWatchlist(String(show.id));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "relative w-full flex items-end overflow-hidden",
      style: { minHeight: "88vh" },
      "data-ocid": "hero-section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `absolute inset-0 transition-opacity duration-700 ${fading ? "opacity-0" : "opacity-100"}`,
            children: [
              coverSrc ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: coverSrc,
                  alt: show.title,
                  className: "w-full h-full object-cover object-center scale-105"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-gradient-to-br from-primary/20 via-muted/20 to-background" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/95 via-[#0a0a0a]/50 to-transparent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-[#0a0a0a]/50" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative z-10 w-full px-6 md:px-14 pb-14 pt-32", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `max-w-2xl transition-all duration-500 ${fading ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4 flex-wrap", children: [
                show.isFree && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-display font-bold border border-emerald-500/30 uppercase tracking-wide", children: "Free" }),
                !show.isFree && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-display font-bold border border-primary/30 uppercase tracking-wide", children: "Premium" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-amber-400", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-3.5 h-3.5 fill-amber-400" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "4.5" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground mb-4 leading-[0.9] tracking-tighter drop-shadow-2xl", children: show.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-base md:text-lg mb-7 line-clamp-2 max-w-xl leading-relaxed", children: show.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: "/show/$showId",
                    params: { showId: String(show.id) },
                    "data-ocid": "hero-play-btn",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        variant: "primary",
                        size: "lg",
                        className: "gap-2.5 shadow-[0_0_30px_rgba(168,85,247,0.4)] text-base px-8",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-5 h-5 fill-current" }),
                          "Watch Now"
                        ]
                      }
                    )
                  }
                ),
                isLoggedIn && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "secondary",
                    size: "lg",
                    className: "gap-2 text-base",
                    onClick: () => toggleWatchlist(String(show.id)),
                    "data-ocid": "hero-watchlist-btn",
                    children: inWatchlist ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-5 h-5" }),
                      " In Watchlist"
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(BookmarkPlus, { className: "w-5 h-5" }),
                      " Add to Watchlist"
                    ] })
                  }
                )
              ] })
            ]
          }
        ) }),
        featuredShows.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-5 right-8 flex items-center gap-2 z-20", children: featuredShows.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              if (i === current) return;
              setFading(true);
              setTimeout(() => {
                setCurrent(i);
                setFading(false);
              }, 350);
            },
            "aria-label": `Show ${s.title}`,
            className: `rounded-full transition-all duration-300 ${i === current ? "w-6 h-2 bg-primary shadow-[0_0_8px_rgba(168,85,247,0.8)]" : "w-2 h-2 bg-border/60 hover:bg-primary/60"}`
          },
          String(s.id)
        )) })
      ]
    }
  );
}
function HomePage() {
  const { currentUser, isLoggedIn } = useAuthStore();
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { data: allShows = [], isLoading } = useQuery({
    queryKey: ["approvedShows"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listApprovedShows();
    },
    enabled: !!actor && !actorFetching
  });
  const featuredShows = allShows.filter((s) => s.isFeatured).slice(0, 5);
  const heroShows = featuredShows.length > 0 ? featuredShows : allShows.slice(0, 5);
  const trendingShows = [...allShows].sort((a, b) => Number(b.totalViews - a.totalViews)).slice(0, 10);
  const newShows = [...allShows].sort((a, b) => Number(b.createdAt - a.createdAt)).slice(0, 10);
  const recommendedShows = isLoggedIn ? [...allShows].sort(() => Math.random() - 0.5).slice(0, 10) : allShows.slice(0, 10);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-full", "data-ocid": "home-page", children: [
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: "relative w-full flex items-center justify-center overflow-hidden bg-[#0a0a0a]",
        style: { minHeight: "88vh" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(168,85,247,0.15),transparent)]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4 z-10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full border-2 border-primary/30 border-t-primary animate-spin" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm font-display", children: "Loading..." })
          ] })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(HeroSection, { featuredShows: heroShows }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-8 space-y-10", children: [
      isLoggedIn && currentUser,
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        HorizontalRow,
        {
          title: "Trending Now",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-5 h-5 text-rose-400" }),
          href: "/browse",
          initialVisible: true,
          children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LandscapeSkeletons, { count: 5 }) : trendingShows.length > 0 ? trendingShows.map((show, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "snap-start",
              style: { transitionDelay: `${i * 50}ms` },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(LandscapeCard, { show, index: i })
            },
            String(show.id)
          )) : /* @__PURE__ */ jsxRuntimeExports.jsx(RowEmpty, { label: "No trending shows yet" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        HorizontalRow,
        {
          title: "New This Week",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-5 h-5 text-amber-400" }),
          href: "/browse",
          children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LandscapeSkeletons, { count: 5 }) : newShows.length > 0 ? newShows.map((show, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "snap-start", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LandscapeCard, { show, index: i }) }, String(show.id))) : /* @__PURE__ */ jsxRuntimeExports.jsx(RowEmpty, { label: "No new shows yet" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        HorizontalRow,
        {
          title: isLoggedIn ? "Recommended for You" : "Popular on Zyro TV",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-5 h-5 text-amber-400 fill-amber-400/60" }),
          href: "/browse",
          children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LandscapeSkeletons, { count: 5 }) : recommendedShows.length > 0 ? recommendedShows.map((show, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "snap-start", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LandscapeCard, { show, index: i }) }, String(show.id))) : /* @__PURE__ */ jsxRuntimeExports.jsx(RowEmpty, { label: "No shows yet" })
        }
      ),
      !isLoggedIn && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "section",
        {
          className: "relative mx-6 md:mx-10 rounded-2xl overflow-hidden border border-primary/20 p-8 md:p-12 text-center",
          "data-ocid": "cta-banner",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.1)_0%,transparent_70%)]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-display font-semibold uppercase tracking-wider mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-primary animate-pulse" }),
                "Free to Start"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-3xl md:text-4xl text-foreground mb-3", children: "Start Streaming Today" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg mb-8 max-w-lg mx-auto leading-relaxed", children: "Watch exclusive original content on Zyro TV. No credit card required." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-4 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/subscribe", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "primary",
                    size: "lg",
                    className: "shadow-[0_0_30px_rgba(168,85,247,0.4)] text-base px-8",
                    "data-ocid": "cta-subscribe-btn",
                    children: "Get Started Free"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/browse", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "secondary", size: "lg", className: "text-base", children: "Browse Content" }) })
              ] })
            ] })
          ]
        }
      )
    ] })
  ] });
}
export {
  HomePage as default
};
