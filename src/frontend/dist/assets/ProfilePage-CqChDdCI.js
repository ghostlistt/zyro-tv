import { c as createLucideIcon, u as useAuthStore, k as useInternetIdentity, a as useActor, b as useQuery, r as reactExports, j as jsxRuntimeExports, L as Link, l as cn, m as formatDate, n as LogOut, o as formatDuration, d as createActor } from "./index-BiC3Bukn.js";
import { S as ShowCard } from "./ShowCard-BsvhYlEI.js";
import { B as Button } from "./ZyroButton-D0sGJGRD.js";
import { S as SubscriptionTier } from "./types-DyRIBjC_.js";
import { S as Save, C as CreditCard } from "./save-C32FUi6T.js";
import { C as Check } from "./check-Cliyqnti.js";
import { H as History } from "./history-DWrTTd8X.js";
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
const __iconNode$2 = [
  ["path", { d: "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z", key: "1fy3hk" }]
];
const Bookmark = createLucideIcon("bookmark", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",
      key: "1tc9qg"
    }
  ],
  ["circle", { cx: "12", cy: "13", r: "3", key: "1vg3eu" }]
];
const Camera = createLucideIcon("camera", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 20h9", key: "t2du7b" }],
  [
    "path",
    {
      d: "M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z",
      key: "1ykcvy"
    }
  ]
];
const PenLine = createLucideIcon("pen-line", __iconNode);
const SUBSCRIPTION_PLANS = [
  {
    tier: SubscriptionTier.Free,
    name: "Free",
    price: 0,
    features: [
      "Access to free content",
      "SD quality (480p)",
      "Ad-supported",
      "1 device at a time",
      "Limited episodes per show"
    ]
  },
  {
    tier: SubscriptionTier.Pro,
    name: "Pro",
    price: 1e3,
    features: [
      "All Free content + Pro exclusives",
      "HD quality (1080p)",
      "Ad-free experience",
      "2 devices simultaneously",
      "Offline downloads (5 episodes)",
      "Early access to new releases"
    ],
    isPopular: true
  },
  {
    tier: SubscriptionTier.Premium,
    name: "Premium",
    price: 2e3,
    features: [
      "All content including exclusives",
      "4K Ultra HD quality",
      "Ad-free experience",
      "4 devices simultaneously",
      "Unlimited offline downloads",
      "Day-1 exclusive access",
      "Priority support"
    ]
  }
];
function isLinkedVideo(url) {
  if (!url) return false;
  return !url.trimStart().startsWith("[");
}
const TIER_COLORS = {
  [SubscriptionTier.Free]: "bg-muted/80 text-muted-foreground",
  [SubscriptionTier.Pro]: "bg-primary/15 text-primary border border-primary/30",
  [SubscriptionTier.Premium]: "bg-amber-500/15 text-amber-400 border border-amber-500/30"
};
const SECTION_TABS = ["Watch History", "Watchlist"];
function LetterAvatar({
  name,
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: cn(
        "rounded-full bg-primary/20 neon-border flex items-center justify-center font-display font-bold text-primary select-none",
        className
      ),
      children: name.charAt(0).toUpperCase()
    }
  );
}
function ProfilePage() {
  var _a, _b, _c, _d;
  const { isLoggedIn, logout } = useAuthStore();
  const ii = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { data: backendProfile, isLoading: profileLoading } = useQuery({
    queryKey: ["callerProfile", (_a = ii.identity) == null ? void 0 : _a.getPrincipal().toText()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && isLoggedIn,
    staleTime: 1e3 * 60 * 5
  });
  const { data: watchHistoryRaw = [] } = useQuery({
    queryKey: ["watchHistory", (_b = ii.identity) == null ? void 0 : _b.getPrincipal().toText()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWatchHistory();
    },
    enabled: !!actor && !actorFetching && isLoggedIn,
    staleTime: 1e3 * 60 * 2
  });
  const { data: watchlistShows = [] } = useQuery({
    queryKey: ["watchlist", (_c = ii.identity) == null ? void 0 : _c.getPrincipal().toText()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWatchlist();
    },
    enabled: !!actor && !actorFetching && isLoggedIn,
    staleTime: 1e3 * 60 * 2
  });
  const episodeIds = watchHistoryRaw.map((e) => e.episodeId);
  const { data: historyEpisodes = [] } = useQuery({
    queryKey: ["historyEpisodes", episodeIds.map(String).join(",")],
    queryFn: async () => {
      if (!actor || episodeIds.length === 0) return [];
      const results = await Promise.all(
        episodeIds.map((id) => actor.getEpisode(id))
      );
      return results.filter((ep) => ep !== null);
    },
    enabled: !!actor && !actorFetching && episodeIds.length > 0,
    staleTime: 1e3 * 60 * 5
  });
  const historyShowIds = [...new Set(watchHistoryRaw.map((e) => e.showId))];
  const { data: historyShows = [] } = useQuery({
    queryKey: ["historyShows", historyShowIds.map(String).join(",")],
    queryFn: async () => {
      if (!actor || historyShowIds.length === 0) return [];
      const results = await Promise.all(
        historyShowIds.map((id) => actor.getShow(id))
      );
      return results.filter((s) => s !== null);
    },
    enabled: !!actor && !actorFetching && historyShowIds.length > 0,
    staleTime: 1e3 * 60 * 5
  });
  const principalText = ((_d = ii.identity) == null ? void 0 : _d.getPrincipal().toText()) ?? "";
  const displayName = (backendProfile == null ? void 0 : backendProfile.username) || `${principalText.slice(0, 12)}…`;
  const tier = (backendProfile == null ? void 0 : backendProfile.subscriptionTier) ?? SubscriptionTier.Free;
  const joinedAt = backendProfile ? Number(backendProfile.createdAt / BigInt(1e6)) : Date.now();
  const [activeTab, setActiveTab] = reactExports.useState("Watch History");
  const [editMode, setEditMode] = reactExports.useState(false);
  const [username, setUsername] = reactExports.useState(displayName);
  const [bio, setBio] = reactExports.useState(
    "Streaming enthusiast. Always on the lookout for the next great story."
  );
  const [saved, setSaved] = reactExports.useState(false);
  if (!isLoggedIn) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4",
        "data-ocid": "profile-page-guest",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LetterAvatar, { name: "?", className: "w-20 h-20 text-3xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl font-semibold text-foreground", children: "Sign in to view your profile" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "primary", children: "Go Home" }) })
        ]
      }
    );
  }
  if (profileLoading || actorFetching) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-[60vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" }) });
  }
  const plan = SUBSCRIPTION_PLANS.find((p) => p.tier === tier);
  const historyItems = watchHistoryRaw.map((entry) => ({
    entry,
    episode: historyEpisodes.find((ep) => ep.id === entry.episodeId),
    show: historyShows.find((s) => s.id === entry.showId)
  }));
  function handleSave() {
    setSaved(true);
    setEditMode(false);
    setTimeout(() => setSaved(false), 3e3);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-5xl mx-auto px-4 py-8 space-y-8",
      "data-ocid": "profile-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-6 md:p-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center gap-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LetterAvatar, { name: displayName, className: "w-20 h-20 text-3xl" }),
              editMode && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: "absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors",
                  "aria-label": "Change avatar",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-3.5 h-3.5 text-primary-foreground" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 space-y-1", children: [
              editMode ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: username,
                  onChange: (e) => setUsername(e.target.value),
                  className: "font-display font-bold text-xl bg-muted/60 border border-input rounded-lg px-3 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring w-full max-w-xs",
                  "data-ocid": "username-input"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground truncate", children: username }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm font-mono text-xs truncate", children: [
                principalText.slice(0, 20),
                "…"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap mt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: cn(
                      "text-xs font-display font-semibold px-2.5 py-0.5 rounded-full",
                      TIER_COLORS[tier]
                    ),
                    children: tier
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                  "Joined ",
                  formatDate(joinedAt)
                ] }),
                backendProfile && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-display font-semibold px-2.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/30 capitalize", children: "viewer" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-shrink-0", children: [
              editMode ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "secondary",
                    size: "sm",
                    onClick: () => setEditMode(false),
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "primary",
                    size: "sm",
                    onClick: handleSave,
                    "data-ocid": "save-profile-btn",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-3.5 h-3.5" }),
                      "Save"
                    ]
                  }
                )
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "secondary",
                  size: "sm",
                  onClick: () => setEditMode(true),
                  "data-ocid": "edit-profile-btn",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { className: "w-3.5 h-3.5" }),
                    "Edit"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: logout,
                  "data-ocid": "logout-btn",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "w-3.5 h-3.5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Logout" })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 pt-5 border-t border-border/40", children: editMode ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              value: bio,
              onChange: (e) => setBio(e.target.value),
              rows: 2,
              className: "w-full px-3 py-2 rounded-lg bg-muted/60 border border-input text-foreground placeholder:text-muted-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring",
              placeholder: "Write a short bio...",
              "data-ocid": "bio-input"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: bio }) }),
          saved && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-2 text-sm text-emerald-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4" }),
            "Profile saved successfully"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-5 h-5 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-bold text-foreground", children: "My Subscription" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: cn(
                      "text-sm font-display font-bold px-3 py-1 rounded-full",
                      TIER_COLORS[tier]
                    ),
                    children: [
                      (plan == null ? void 0 : plan.name) ?? "Free",
                      " Plan"
                    ]
                  }
                ),
                tier !== SubscriptionTier.Free && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Billed monthly" })
              ] }),
              plan && plan.price > 0 && (() => {
                const expiresAtNs = backendProfile == null ? void 0 : backendProfile.subscriptionExpiresAt;
                if (!expiresAtNs) return null;
                const expiresAtMs = Number(expiresAtNs) / 1e6;
                const daysLeft = Math.ceil(
                  (expiresAtMs - Date.now()) / (1e3 * 60 * 60 * 24)
                );
                return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: daysLeft > 0 ? `${daysLeft} day${daysLeft === 1 ? "" : "s"} remaining` : "Expired" });
              })(),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-2 space-y-1", children: ((plan == null ? void 0 : plan.features) ?? []).slice(0, 3).map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "li",
                {
                  className: "flex items-center gap-2 text-xs text-muted-foreground",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3 text-primary flex-shrink-0" }),
                    f
                  ]
                },
                f
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/subscribe", className: "flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: tier === SubscriptionTier.Premium ? "secondary" : "primary",
                size: "md",
                "data-ocid": "upgrade-plan-btn",
                children: tier === SubscriptionTier.Premium ? "Manage Plan" : "Upgrade Plan"
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 mb-6 overflow-x-auto scrollbar-none border-b border-border/40", children: SECTION_TABS.map((tab) => {
            const icons = {
              "Watch History": History,
              Watchlist: Bookmark
            };
            const Icon = icons[tab];
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setActiveTab(tab),
                className: cn(
                  "flex items-center gap-2 px-4 py-2.5 text-sm font-display font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px",
                  activeTab === tab ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-foreground"
                ),
                "data-ocid": `profile-tab-${tab.toLowerCase().replace(/\s+/g, "-")}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4" }),
                  tab
                ]
              },
              tab
            );
          }) }),
          activeTab === "Watch History" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: historyItems.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12 text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "w-12 h-12 mx-auto mb-3 opacity-30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display", children: "No watch history yet" })
          ] }) : historyItems.map(({ entry, show, episode }) => {
            if (!show || !episode) return null;
            const progressPct = episode.durationSeconds > 0 ? Math.min(
              100,
              Math.round(
                Number(entry.progressSeconds) / Number(episode.durationSeconds) * 100
              )
            ) : 0;
            const watchedAtMs = Number(entry.lastWatchedAt) / 1e6;
            const secondsLeft = Math.max(
              0,
              Number(episode.durationSeconds) - Number(entry.progressSeconds)
            );
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: "/watch/$showId/$seasonId/$episodeId",
                params: {
                  showId: String(entry.showId),
                  seasonId: String(episode.seasonId),
                  episodeId: String(entry.episodeId)
                },
                className: "flex gap-4 p-3 rounded-xl glass-card hover:border-primary/30 transition-colors group",
                "data-ocid": "history-item",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-28 aspect-video flex-shrink-0 rounded-lg overflow-hidden", children: [
                    episode.thumbnailUrl && !isLinkedVideo(episode.videoUrl ?? "") ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "img",
                      {
                        src: episode.thumbnailUrl,
                        alt: episode.title,
                        className: "w-full h-full object-cover group-hover:scale-105 transition-smooth"
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-muted/40 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "w-6 h-6 text-muted-foreground/50" }) }),
                    progressPct > 0 && progressPct < 100 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "h-full bg-primary",
                        style: { width: `${progressPct}%` }
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 flex flex-col justify-center gap-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors", children: episode.title }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground truncate", children: [
                      show.title,
                      " · Ep ",
                      String(episode.episodeNumber)
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: formatDate(watchedAtMs) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mt-1", children: progressPct >= 95 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-display font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded", children: "Watched" }) : progressPct > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-display font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded", children: [
                      progressPct,
                      "% · ",
                      formatDuration(secondsLeft),
                      " left"
                    ] }) : null })
                  ] })
                ]
              },
              String(entry.episodeId)
            );
          }) }),
          activeTab === "Watchlist" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: watchlistShows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12 text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { className: "w-12 h-12 mx-auto mb-3 opacity-30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display", children: "Your watchlist is empty" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/browse",
                className: "text-primary text-sm hover:underline mt-1 inline-block",
                children: "Browse shows"
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4", children: watchlistShows.map((show) => /* @__PURE__ */ jsxRuntimeExports.jsx(ShowCard, { show }, show.id)) }) })
        ] })
      ]
    }
  );
}
export {
  ProfilePage as default
};
