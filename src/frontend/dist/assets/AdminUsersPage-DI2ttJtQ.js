import { c as createLucideIcon, s as useAdminStore, r as reactExports, j as jsxRuntimeExports, a as useActor, h as useQueryClient, b as useQuery, S as Search, t as isPrincipalLikeUsername, v as Shield, X, d as createActor } from "./index-BiC3Bukn.js";
import { u as useMutation } from "./useMutation-BlzaivA3.js";
import { S as SubscriptionTier } from "./types-DyRIBjC_.js";
import { A as AdminNav, U as Users } from "./AdminPage-CeISIFGI.js";
import { H as History } from "./history-DWrTTd8X.js";
import { R as RefreshCw } from "./refresh-cw-C--jaJgU.js";
import { C as ChevronLeft } from "./chevron-left-DQolYA18.js";
import { C as ChevronRight } from "./chevron-right-y-grUHwQ.js";
import { C as Clock } from "./button-BnI6w-mQ.js";
import { T as Trash2 } from "./trash-2-BdSAybum.js";
import "./trending-up-JNvejBpN.js";
import "./tv-c6wygwpJ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m4.9 4.9 14.2 14.2", key: "1m5liu" }]
];
const Ban = createLucideIcon("ban", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
];
const ExternalLink = createLucideIcon("external-link", __iconNode);
const TIER_BADGE = {
  [SubscriptionTier.Premium]: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
  [SubscriptionTier.Pro]: "bg-primary/15 text-primary border border-primary/20",
  [SubscriptionTier.Free]: "bg-muted/30 text-muted-foreground border border-border/40"
};
const PAGE_SIZE = 10;
function principalShort(p) {
  if (p.length <= 16) return p;
  return `${p.slice(0, 8)}…${p.slice(-4)}`;
}
function formatTimestamp(ts) {
  const ms = Number(ts / BigInt(1e6));
  const d = new Date(ms);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
}
function formatExpiryDate(ts) {
  const ms = Number(ts / BigInt(1e6));
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function isExpired(ts) {
  const ms = Number(ts / BigInt(1e6));
  return ms < Date.now();
}
function isExpiringSoon(ts) {
  const ms = Number(ts / BigInt(1e6));
  const sevenDays = 7 * 24 * 60 * 60 * 1e3;
  return ms > Date.now() && ms - Date.now() <= sevenDays;
}
const COL_KEYS = ["col-a", "col-b", "col-c", "col-d", "col-e"];
function SkeletonRow({ cols }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border/50", children: COL_KEYS.slice(0, cols).map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-24 bg-muted/40 rounded animate-pulse" }) }, k)) });
}
function TierBadge({ tier }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `text-xs font-medium px-2 py-0.5 rounded-full ${TIER_BADGE[tier] ?? "bg-muted/30 text-muted-foreground border border-border/40"}`,
      children: tier
    }
  );
}
function ExpiryBadge({ expiresAt }) {
  if (!expiresAt)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground/50", children: "—" });
  const expired = isExpired(expiresAt);
  const soon = !expired && isExpiringSoon(expiresAt);
  const dateStr = formatExpiryDate(expiresAt);
  if (expired) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full whitespace-nowrap", children: [
      "Expired ",
      dateStr
    ] });
  }
  if (soon) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full whitespace-nowrap", children: [
      "Expires ",
      dateStr
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground whitespace-nowrap", children: [
    "Expires ",
    dateStr
  ] });
}
function RemoveSubscriptionButton({
  user,
  onRemoved
}) {
  const [confirming, setConfirming] = reactExports.useState(false);
  const { actor } = useActor(createActor);
  const removeMutation = useMutation({
    mutationFn: async (principal) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.adminRemoveSubscription(principal);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      setConfirming(false);
      onRemoved();
    }
  });
  if (confirming) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-1.5 bg-destructive/10 border border-destructive/30 rounded-lg px-2 py-1",
        "data-ocid": `remove-subscription-confirm-${user.principal.toText().slice(0, 8)}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-destructive font-medium whitespace-nowrap", children: "Remove?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => removeMutation.mutate(user.principal),
              disabled: removeMutation.isPending,
              className: "text-xs font-bold text-destructive hover:text-red-300 transition-smooth px-1.5 py-0.5 rounded hover:bg-destructive/20 disabled:opacity-50",
              "aria-label": "Confirm remove subscription",
              "data-ocid": `remove-subscription-confirm-btn-${user.principal.toText().slice(0, 8)}`,
              children: removeMutation.isPending ? "…" : "Yes"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setConfirming(false),
              className: "text-muted-foreground hover:text-foreground transition-smooth p-0.5 rounded",
              "aria-label": "Cancel remove",
              "data-ocid": `remove-subscription-cancel-btn-${user.principal.toText().slice(0, 8)}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" })
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick: () => setConfirming(true),
      className: "flex items-center gap-1 p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-smooth",
      title: "Remove Subscription",
      "aria-label": "Remove Subscription",
      "data-ocid": `remove-subscription-btn-${user.principal.toText().slice(0, 8)}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
    }
  );
}
function UsersTab() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [search, setSearch] = reactExports.useState("");
  const [banned, setBanned] = reactExports.useState(/* @__PURE__ */ new Set());
  const [page, setPage] = reactExports.useState(1);
  const {
    data: users,
    isLoading,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminListUsers();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 1e4
  });
  const allUsers = users ?? [];
  const filtered = reactExports.useMemo(
    () => allUsers.filter(
      (u) => u.username.toLowerCase().includes(search.toLowerCase()) || u.principal.toText().includes(search)
    ),
    [allUsers, search]
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const toggleBan = (id) => {
    setBanned((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const handleSubscriptionRemoved = () => {
    queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    refetch();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl px-4 py-2.5 border border-border/50 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-none", children: "Total Users" }),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 w-8 bg-muted/40 rounded animate-pulse mt-0.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-bold text-foreground leading-none mt-0.5", children: allUsers.length.toLocaleString() })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": "refresh-users-btn",
          onClick: () => refetch(),
          disabled: isFetching,
          className: "flex items-center gap-1.5 px-3 py-2 rounded-lg glass-card text-sm text-muted-foreground hover:text-foreground transition-smooth disabled:opacity-50",
          "aria-label": "Refresh users",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              RefreshCw,
              {
                className: `w-4 h-4 ${isFetching ? "animate-spin" : ""}`
              }
            ),
            "Refresh"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-6 max-w-md", "data-ocid": "user-search", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          className: "w-full bg-muted/30 border border-input rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-smooth",
          placeholder: "Search by username or principal...",
          value: search,
          onChange: (e) => {
            setSearch(e.target.value);
            setPage(1);
          }
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "glass-card rounded-xl overflow-hidden mb-6",
        "data-ocid": "users-table",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider", children: "User" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider hidden sm:table-cell", children: "Principal" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider hidden md:table-cell", children: "Plan" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider hidden lg:table-cell", children: "Expiry" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider hidden xl:table-cell", children: "Registered" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: isLoading ? ["sk0", "sk1", "sk2", "sk3", "sk4"].map((sk) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-muted/40 animate-pulse" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-28 bg-muted/40 rounded animate-pulse" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden sm:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-20 bg-muted/40 rounded animate-pulse" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden md:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-14 bg-muted/40 rounded animate-pulse" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden lg:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-20 bg-muted/40 rounded animate-pulse" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden xl:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-20 bg-muted/40 rounded animate-pulse" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3" })
            ] }, sk)) : paged.map((user, i) => {
              const principalStr = user.principal.toText();
              const isBanned = banned.has(principalStr);
              const tier = user.subscriptionTier;
              const isPending = isPrincipalLikeUsername(user.username);
              const isPaid = tier === SubscriptionTier.Pro || tier === SubscriptionTier.Premium;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "tr",
                {
                  className: `border-b border-border/50 ${i % 2 === 0 ? "" : "bg-muted/5"} ${isBanned ? "opacity-50" : ""}`,
                  "data-ocid": `user-row-${principalStr.slice(0, 8)}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0", children: isPending ? "?" : user.username.charAt(0).toUpperCase() }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground italic", children: "Pending setup" }) : user.username }),
                        isBanned && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-destructive", children: "Banned" })
                      ] })
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground font-mono hidden sm:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { title: principalStr, children: principalShort(principalStr) }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden md:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TierBadge, { tier }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden lg:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExpiryBadge, { expiresAt: user.subscriptionExpiresAt }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-sm text-muted-foreground whitespace-nowrap hidden xl:table-cell", children: formatTimestamp(user.createdAt) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          "data-ocid": `view-user-${i}`,
                          className: "p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-smooth",
                          title: "View Profile",
                          "aria-label": "View Profile",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-4 h-4" })
                        }
                      ),
                      isPaid && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        RemoveSubscriptionButton,
                        {
                          user,
                          onRemoved: handleSubscriptionRemoved
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          "data-ocid": `ban-user-${i}`,
                          onClick: () => toggleBan(principalStr),
                          className: `p-1.5 rounded-lg transition-smooth ${isBanned ? "text-emerald-400 hover:bg-emerald-500/10" : "text-muted-foreground hover:bg-muted/50"}`,
                          title: isBanned ? "Unban User" : "Ban User",
                          "aria-label": isBanned ? "Unban User" : "Ban User",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { className: "w-4 h-4" })
                        }
                      )
                    ] }) })
                  ]
                },
                principalStr
              );
            }) })
          ] }) }),
          !isLoading && paged.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "py-16 text-center text-muted-foreground",
              "data-ocid": "no-users",
              children: search ? "No users match your search." : "No registered users yet."
            }
          )
        ]
      }
    ),
    !isLoading && allUsers.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 flex-wrap text-xs text-muted-foreground mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-3.5 h-3.5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: 'Paid subscribers have a "Remove Subscription" button (trash icon)' })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400 font-medium", children: "Red date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "= expired" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-amber-400 font-medium ml-2", children: "Yellow date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "= expiring within 7 days" })
      ] })
    ] }),
    !isLoading && filtered.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center justify-between",
        "data-ocid": "users-pagination",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Showing ",
            Math.min((page - 1) * PAGE_SIZE + 1, filtered.length),
            "–",
            Math.min(page * PAGE_SIZE, filtered.length),
            " of ",
            filtered.length,
            " ",
            "users"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "pagination-prev",
                onClick: () => setPage((p) => Math.max(1, p - 1)),
                disabled: page === 1,
                className: "p-2 rounded-lg glass-card disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted/50 transition-smooth",
                "aria-label": "Previous page",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" })
              }
            ),
            Array.from(
              { length: Math.min(totalPages, 7) },
              (_, i) => i + 1
            ).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `page-${p}`,
                onClick: () => setPage(p),
                className: `w-9 h-9 rounded-lg text-sm font-medium transition-smooth ${p === page ? "bg-primary text-primary-foreground" : "glass-card text-muted-foreground hover:text-foreground"}`,
                children: p
              },
              p
            )),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "pagination-next",
                onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
                disabled: page === totalPages,
                className: "p-2 rounded-lg glass-card disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted/50 transition-smooth",
                "aria-label": "Next page",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
              }
            )
          ] })
        ]
      }
    )
  ] });
}
function SignupHistoryTab() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const [historyPage, setHistoryPage] = reactExports.useState(1);
  const {
    data: history,
    isLoading,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ["adminSignupHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminGetSignupHistory();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 1e4
  });
  const allEntries = history ?? [];
  const totalPages = Math.max(1, Math.ceil(allEntries.length / PAGE_SIZE));
  const paged = allEntries.slice(
    (historyPage - 1) * PAGE_SIZE,
    historyPage * PAGE_SIZE
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl px-4 py-2.5 border border-border/50 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "w-4 h-4 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-none", children: "Total Registered" }),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 w-8 bg-muted/40 rounded animate-pulse mt-0.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-base font-bold text-foreground leading-none mt-0.5", children: [
            allEntries.length.toLocaleString(),
            " accounts"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": "refresh-history-btn",
          onClick: () => refetch(),
          disabled: isFetching,
          className: "flex items-center gap-1.5 px-3 py-2 rounded-lg glass-card text-sm text-muted-foreground hover:text-foreground transition-smooth disabled:opacity-50",
          "aria-label": "Refresh signup history",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              RefreshCw,
              {
                className: `w-4 h-4 ${isFetching ? "animate-spin" : ""}`
              }
            ),
            "Refresh"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-5 px-4 py-3 rounded-xl bg-primary/5 border border-primary/15 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 text-primary shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Complete account registration history — newest signups first. Read-only." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "glass-card rounded-xl overflow-hidden mb-6",
        "data-ocid": "signup-history-table",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider", children: "Signup Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider", children: "Username" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider hidden md:table-cell", children: "Plan / Tier" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider hidden sm:table-cell", children: "Principal" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: isLoading ? ["h0", "h1", "h2", "h3", "h4"].map((sk) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonRow, { cols: 4 }, sk)) : paged.map((entry, i) => {
              const isPending = isPrincipalLikeUsername(entry.username);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "tr",
                {
                  className: `border-b border-border/50 ${i % 2 === 0 ? "" : "bg-muted/5"}`,
                  "data-ocid": `history-row-${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-sm text-muted-foreground whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5 text-primary/60 shrink-0" }),
                      formatTimestamp(entry.signedUpAt)
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-xs shrink-0", children: isPending ? "?" : entry.username.charAt(0).toUpperCase() }),
                      isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground italic", children: "Pending setup" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: entry.username })
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden md:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TierBadge, { tier: entry.currentTier }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground font-mono hidden sm:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { title: entry.principal, children: principalShort(entry.principal) }) })
                  ]
                },
                `${entry.principal}-${entry.signedUpAt.toString()}`
              );
            }) })
          ] }) }),
          !isLoading && allEntries.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "py-16 text-center text-muted-foreground",
              "data-ocid": "signup-history-empty_state",
              children: "No signup history yet. Users will appear here as they register."
            }
          )
        ]
      }
    ),
    !isLoading && allEntries.length > PAGE_SIZE && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center justify-between",
        "data-ocid": "history-pagination",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Showing",
            " ",
            Math.min((historyPage - 1) * PAGE_SIZE + 1, allEntries.length),
            "–",
            Math.min(historyPage * PAGE_SIZE, allEntries.length),
            " of",
            " ",
            allEntries.length,
            " accounts"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "history-pagination-prev",
                onClick: () => setHistoryPage((p) => Math.max(1, p - 1)),
                disabled: historyPage === 1,
                className: "p-2 rounded-lg glass-card disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted/50 transition-smooth",
                "aria-label": "Previous page",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" })
              }
            ),
            Array.from(
              { length: Math.min(totalPages, 7) },
              (_, i) => i + 1
            ).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `history-page-${p}`,
                onClick: () => setHistoryPage(p),
                className: `w-9 h-9 rounded-lg text-sm font-medium transition-smooth ${p === historyPage ? "bg-primary text-primary-foreground" : "glass-card text-muted-foreground hover:text-foreground"}`,
                children: p
              },
              p
            )),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "history-pagination-next",
                onClick: () => setHistoryPage((p) => Math.min(totalPages, p + 1)),
                disabled: historyPage === totalPages,
                className: "p-2 rounded-lg glass-card disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted/50 transition-smooth",
                "aria-label": "Next page",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
              }
            )
          ] })
        ]
      }
    )
  ] });
}
function AdminUsersPage({
  onTabChange
}) {
  const { isAdminAuthenticated } = useAdminStore();
  const [innerTab, setInnerTab] = reactExports.useState("users");
  if (!isAdminAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center justify-center min-h-[70vh] text-center px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Please authenticate via the Admin button in the header." }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-background px-4 md:px-6 py-6 max-w-7xl mx-auto",
      "data-ocid": "admin-users-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AdminNav, { active: "Users", onTabChange }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground mb-1", children: "User Management" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Live user registry and full signup history — updates every 10 seconds. Remove subscriptions to revert users to the free tier." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-1 p-1 rounded-xl bg-muted/20 border border-border/40 mb-6 w-fit",
            "data-ocid": "users-inner-tabs",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": "users-tab",
                  onClick: () => setInnerTab("users"),
                  className: `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${innerTab === "users" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4" }),
                    "Active Users"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": "signup-history-tab",
                  onClick: () => setInnerTab("history"),
                  className: `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${innerTab === "history" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "w-4 h-4" }),
                    "Signup History"
                  ]
                }
              )
            ]
          }
        ),
        innerTab === "users" ? /* @__PURE__ */ jsxRuntimeExports.jsx(UsersTab, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(SignupHistoryTab, {})
      ]
    }
  );
}
export {
  AdminUsersPage as default
};
