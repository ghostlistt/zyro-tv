import { c as createLucideIcon, s as useAdminStore, a as useActor, h as useQueryClient, r as reactExports, b as useQuery, j as jsxRuntimeExports, X, d as createActor } from "./index-BiC3Bukn.js";
import { u as useMutation } from "./useMutation-BlzaivA3.js";
import { A as AdminNav, T as TriangleAlert, U as Users, R as RotateCcw } from "./AdminPage-CeISIFGI.js";
import { C as Check } from "./check-Cliyqnti.js";
import { C as Clock } from "./button-BnI6w-mQ.js";
import { C as CreditCard, S as Save } from "./save-C32FUi6T.js";
import { R as RefreshCw } from "./refresh-cw-C--jaJgU.js";
import { S as Send } from "./send-CHALuWUW.js";
import { S as Star } from "./star-Bz45glpD.js";
import { P as Plus } from "./plus-UP_q622i.js";
import "./trending-up-JNvejBpN.js";
import "./tv-c6wygwpJ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["path", { d: "M5 12h14", key: "1ays0h" }]];
const Minus = createLucideIcon("minus", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["line", { x1: "19", x2: "5", y1: "5", y2: "19", key: "1x9vlm" }],
  ["circle", { cx: "6.5", cy: "6.5", r: "2.5", key: "4mh3h7" }],
  ["circle", { cx: "17.5", cy: "17.5", r: "2.5", key: "1mdrzq" }]
];
const Percent = createLucideIcon("percent", __iconNode);
const TIER_COLORS = {
  Free: {
    badge: "bg-muted/40 text-muted-foreground",
    glow: "",
    border: "border-border/60"
  },
  Pro: {
    badge: "bg-primary/15 text-primary",
    glow: "shadow-[0_0_20px_rgba(168,85,247,0.1)]",
    border: "border-primary/30"
  },
  Premium: {
    badge: "bg-amber-500/15 text-amber-400",
    glow: "shadow-[0_0_20px_rgba(251,191,36,0.1)]",
    border: "border-amber-500/30"
  }
};
const DEFAULT_PLANS = [
  {
    planId: "Free",
    name: "Free",
    priceCredits: BigInt(0),
    features: [
      "Access all free episodes",
      "1 device at a time",
      "Limited episodes per show"
    ],
    discountPercent: BigInt(0),
    discountActive: false
  },
  {
    planId: "Pro",
    name: "Pro",
    priceCredits: BigInt(1e3),
    features: [
      "All Free content + Pro exclusives",
      "HD quality (1080p)",
      "Ad-free experience",
      "2 devices simultaneously",
      "Offline downloads (5 episodes)",
      "Early access to new releases"
    ],
    discountPercent: BigInt(0),
    discountActive: false
  },
  {
    planId: "Premium",
    name: "Premium",
    priceCredits: BigInt(2e3),
    features: [
      "All content including exclusives",
      "4K Ultra HD quality",
      "Ad-free experience",
      "4 devices simultaneously",
      "Unlimited offline downloads",
      "Day-1 exclusive access",
      "Priority support"
    ],
    discountPercent: BigInt(0),
    discountActive: false
  }
];
function principalShort(p) {
  if (p.length <= 14) return p;
  return `${p.slice(0, 8)}…${p.slice(-4)}`;
}
function PlanCard({
  plan,
  onUpdateName,
  onUpdatePrice,
  onUpdateFeature,
  onAddFeature,
  onRemoveFeature,
  onTogglePopular,
  onUpdateDiscountPercent,
  onToggleDiscountActive,
  changed,
  imvuRecipient
}) {
  const colors = TIER_COLORS[plan.planId] ?? TIER_COLORS.Free;
  const price = Number(plan.priceCredits);
  const discountPercent = Number(plan.discountPercent);
  const discountActive = plan.discountActive;
  const isPaid = plan.planId !== "Free";
  const discountedPrice = isPaid && discountActive && discountPercent > 0 ? Math.round(price * (100 - discountPercent) / 100) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `glass-card rounded-2xl p-6 border ${colors.border} ${colors.glow} relative`,
      "data-ocid": `plan-card-${plan.planId.toLowerCase()}`,
      children: [
        plan.isPopular && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-[0_0_12px_rgba(168,85,247,0.4)]", children: "Most Popular" }),
        changed && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute top-4 right-4 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]",
            title: "Unsaved changes"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `text-xs font-bold px-2.5 py-1 rounded-full ${colors.badge}`,
              children: plan.planId
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onTogglePopular,
              title: plan.isPopular ? "Remove popular badge" : "Mark as popular",
              "aria-label": plan.isPopular ? "Remove popular badge" : "Mark as popular",
              className: `ml-auto p-1.5 rounded-lg transition-smooth ${plan.isPopular ? "text-amber-400 hover:bg-amber-400/10" : "text-muted-foreground hover:text-amber-400 hover:bg-muted/40"}`,
              "data-ocid": `toggle-popular-${plan.planId.toLowerCase()}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Star,
                {
                  className: `w-4 h-4 ${plan.isPopular ? "fill-amber-400" : ""}`
                }
              )
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              className: "block text-xs font-medium text-muted-foreground mb-1.5",
              htmlFor: `plan-name-${plan.planId}`,
              children: "Plan Name"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: `plan-name-${plan.planId}`,
              type: "text",
              value: plan.name,
              onChange: (e) => onUpdateName(e.target.value),
              className: "w-full px-3 py-2 rounded-lg bg-muted/20 border border-border/50 text-sm font-display font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth",
              "data-ocid": `plan-name-input-${plan.planId.toLowerCase()}`
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              className: "block text-xs font-medium text-muted-foreground mb-1.5",
              htmlFor: `plan-price-${plan.planId}`,
              children: "Price (IMVU Credits / month)"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: `plan-price-${plan.planId}`,
                type: "number",
                min: 0,
                step: 1,
                value: price,
                onChange: (e) => onUpdatePrice(
                  Math.max(0, Number.parseInt(e.target.value, 10) || 0)
                ),
                className: "w-full pl-9 pr-3 py-2 rounded-lg bg-muted/20 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth",
                "data-ocid": `plan-price-input-${plan.planId.toLowerCase()}`
              }
            )
          ] }),
          price > 0 && !discountedPrice && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1.5 text-xs text-muted-foreground", children: [
            "Send ",
            price.toLocaleString(),
            " credits to",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-medium", children: [
              "@",
              imvuRecipient
            ] }),
            " ",
            "on IMVU"
          ] }),
          discountedPrice !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1.5 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "line-through", children: price.toLocaleString() }),
            " → ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-semibold", children: [
              discountedPrice.toLocaleString(),
              " credits"
            ] }),
            " ",
            "to",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-medium", children: [
              "@",
              imvuRecipient
            ] })
          ] })
        ] }),
        isPaid && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "mb-5 rounded-xl border border-primary/20 bg-primary/5 p-3.5",
            "data-ocid": `discount-section-${plan.planId.toLowerCase()}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Percent, { className: "w-3.5 h-3.5 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-primary", children: "Discount" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "label",
                    {
                      className: "block text-xs font-medium text-muted-foreground mb-1.5",
                      htmlFor: `discount-pct-${plan.planId}`,
                      children: "Discount %"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        id: `discount-pct-${plan.planId}`,
                        type: "number",
                        min: 0,
                        max: 100,
                        step: 1,
                        value: discountPercent,
                        onChange: (e) => onUpdateDiscountPercent(
                          Math.min(
                            100,
                            Math.max(0, Number.parseInt(e.target.value, 10) || 0)
                          )
                        ),
                        className: "w-full pr-8 pl-3 py-2 rounded-lg bg-muted/20 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth",
                        "data-ocid": `discount-percent-input-${plan.planId.toLowerCase()}`
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none", children: "%" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1.5 shrink-0 pb-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground", children: "Active" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      role: "switch",
                      "aria-checked": discountActive,
                      onClick: onToggleDiscountActive,
                      "data-ocid": `discount-toggle-${plan.planId.toLowerCase()}`,
                      className: `relative w-11 h-6 rounded-full border transition-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${discountActive ? "bg-primary border-primary shadow-[0_0_10px_rgba(168,85,247,0.35)]" : "bg-muted/30 border-border/50"}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: `absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-background shadow transition-transform duration-200 ${discountActive ? "translate-x-5" : "translate-x-0"}`
                        }
                      )
                    }
                  )
                ] })
              ] }),
              discountPercent > 0 && discountActive && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2.5 text-xs font-medium text-primary/80", children: [
                "Subscribers pay",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-primary", children: [
                  Math.round(
                    price * (100 - discountPercent) / 100
                  ).toLocaleString(),
                  " ",
                  "credits"
                ] }),
                " ",
                "instead of ",
                price.toLocaleString()
              ] }),
              discountPercent > 0 && !discountActive && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2.5 text-xs text-muted-foreground/60", children: "Discount configured but not active" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground", children: "Features" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: onAddFeature,
                "aria-label": "Add feature",
                className: "flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-smooth",
                "data-ocid": `add-feature-${plan.planId.toLowerCase()}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                  " Add"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: plan.features.map((feat, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5 text-primary shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    value: feat,
                    onChange: (e) => onUpdateFeature(i, e.target.value),
                    className: "flex-1 min-w-0 px-2 py-1.5 rounded-lg bg-muted/20 border border-border/40 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth",
                    "data-ocid": `feature-input-${plan.planId.toLowerCase()}-${i}`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => onRemoveFeature(i),
                    "aria-label": "Remove feature",
                    className: "p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth shrink-0",
                    "data-ocid": `remove-feature-${plan.planId.toLowerCase()}-${i}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-3.5 h-3.5" })
                  }
                )
              ]
            },
            `${plan.planId}-feat-${i}`
          )) })
        ] })
      ]
    }
  );
}
function formatDate(ts) {
  const ms = Number(ts / BigInt(1e6));
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function PendingApprovalRow({
  approval,
  onApprove,
  onReject,
  isProcessing
}) {
  const principalText = approval.userPrincipal.toText();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-muted/10 border border-border/40 hover:bg-muted/20 transition-smooth",
      "data-ocid": `pending-row-${principalText.slice(0, 8)}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-5 h-5 text-amber-400" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: approval.username || principalShort(principalText) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs font-mono text-muted-foreground truncate",
                title: principalText,
                children: principalShort(principalText)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full", children: approval.planName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-amber-400 font-medium", children: "Pending approval" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground/70 mt-0.5", children: [
              "Requested ",
              formatDate(approval.requestedAt)
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 shrink-0", children: isProcessing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground px-4 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 animate-spin" }),
          "Processing..."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: onApprove,
              "aria-label": "Approve subscription",
              "data-ocid": `approve-btn-${principalText.slice(0, 8)}`,
              className: "flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/25 transition-smooth",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" }),
                "Approve"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: onReject,
              "aria-label": "Reject subscription",
              "data-ocid": `reject-btn-${principalText.slice(0, 8)}`,
              className: "flex items-center gap-1.5 px-4 py-2 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm font-semibold hover:bg-destructive/20 transition-smooth",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4" }),
                "Reject"
              ]
            }
          )
        ] }) })
      ]
    }
  );
}
function toLocalPlan(cfg) {
  return {
    ...cfg,
    isPopular: cfg.planId.toLowerCase() === "pro"
  };
}
function AdminSubscriptionsPage({
  onTabChange
}) {
  const { isAdminAuthenticated } = useAdminStore();
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [subTab, setSubTab] = reactExports.useState("pending");
  const [localPlans, setLocalPlans] = reactExports.useState([]);
  const [recipientInput, setRecipientInput] = reactExports.useState("ZyroTV");
  const [changedPlanIds, setChangedPlanIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const [recipientChanged, setRecipientChanged] = reactExports.useState(false);
  const [saveToast, setSaveToast] = reactExports.useState({ type: "idle" });
  const [processingPrincipals, setProcessingPrincipals] = reactExports.useState(
    /* @__PURE__ */ new Set()
  );
  const { data: backendPlans, isLoading: plansLoading } = useQuery({
    queryKey: ["subscriptionPlans"],
    queryFn: async () => {
      if (!actor) return DEFAULT_PLANS;
      return actor.getSubscriptionPlans();
    },
    enabled: !!actor && !actorFetching
  });
  const { data: backendRecipient, isLoading: recipientLoading } = useQuery({
    queryKey: ["imvuRecipient"],
    queryFn: async () => {
      if (!actor) return "ZyroTV";
      return actor.getImvuRecipient();
    },
    enabled: !!actor && !actorFetching
  });
  const {
    data: pendingApprovals,
    isLoading: approvalsLoading,
    refetch: refetchApprovals,
    isFetching: approvalsFetching
  } = useQuery({
    queryKey: ["pendingApprovals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminListPendingSubscriptions();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 1e4
  });
  reactExports.useEffect(() => {
    if (backendPlans && localPlans.length === 0) {
      const plans = backendPlans.length > 0 ? backendPlans : DEFAULT_PLANS;
      setLocalPlans(plans.map(toLocalPlan));
    }
  }, [backendPlans, localPlans.length]);
  reactExports.useEffect(() => {
    if (backendRecipient && !recipientChanged) {
      setRecipientInput(backendRecipient);
    }
  }, [backendRecipient, recipientChanged]);
  const savePlanMutation = useMutation({
    mutationFn: async (plan) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.saveSubscriptionPlan(
        plan.planId,
        plan.name,
        plan.priceCredits,
        plan.features.filter(Boolean),
        plan.discountPercent,
        plan.discountActive
      );
      if (!result) {
        throw new Error(
          `Failed to save plan "${plan.name}" — backend rejected the update`
        );
      }
      return result;
    }
  });
  const saveRecipientMutation = useMutation({
    mutationFn: async (recipient) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.saveImvuRecipient(recipient);
      if (!result) {
        throw new Error(
          "Failed to save IMVU recipient — backend rejected the update"
        );
      }
      return result;
    }
  });
  const setApprovalMutation = useMutation({
    mutationFn: async ({
      principal,
      approve
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.adminApproveSubscription(principal, approve);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingApprovals"] });
    }
  });
  async function handleApprovalAction(approval, approve) {
    const principalText = approval.userPrincipal.toText();
    setProcessingPrincipals((prev) => new Set(prev).add(principalText));
    try {
      await setApprovalMutation.mutateAsync({
        principal: approval.userPrincipal,
        approve
      });
    } finally {
      setProcessingPrincipals((prev) => {
        const next = new Set(prev);
        next.delete(principalText);
        return next;
      });
    }
  }
  function updatePlan(planId, patch) {
    setLocalPlans(
      (prev) => prev.map((p) => p.planId === planId ? { ...p, ...patch } : p)
    );
    setChangedPlanIds((s) => new Set(s).add(planId));
    setSaveToast({ type: "idle" });
  }
  function updateFeature(planId, index, value) {
    setLocalPlans(
      (prev) => prev.map((p) => {
        if (p.planId !== planId) return p;
        const features = [...p.features];
        features[index] = value;
        return { ...p, features };
      })
    );
    setChangedPlanIds((s) => new Set(s).add(planId));
    setSaveToast({ type: "idle" });
  }
  function addFeature(planId) {
    setLocalPlans(
      (prev) => prev.map(
        (p) => p.planId === planId ? { ...p, features: [...p.features, ""] } : p
      )
    );
    setChangedPlanIds((s) => new Set(s).add(planId));
    setSaveToast({ type: "idle" });
  }
  function removeFeature(planId, index) {
    setLocalPlans(
      (prev) => prev.map((p) => {
        if (p.planId !== planId) return p;
        return { ...p, features: p.features.filter((_, i) => i !== index) };
      })
    );
    setChangedPlanIds((s) => new Set(s).add(planId));
    setSaveToast({ type: "idle" });
  }
  async function handleSaveAll() {
    setSaveToast({ type: "saving" });
    try {
      const changedPlans = localPlans.filter(
        (p) => changedPlanIds.has(p.planId)
      );
      for (const plan of changedPlans) {
        await savePlanMutation.mutateAsync(plan);
      }
      if (recipientChanged) {
        const trimmed = recipientInput.trim() || "ZyroTV";
        await saveRecipientMutation.mutateAsync(trimmed);
      }
      setChangedPlanIds(/* @__PURE__ */ new Set());
      setRecipientChanged(false);
      setSaveToast({ type: "saved" });
      queryClient.invalidateQueries({ queryKey: ["subscriptionPlans"] });
      queryClient.invalidateQueries({ queryKey: ["imvuRecipient"] });
      setTimeout(() => setSaveToast({ type: "idle" }), 3e3);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save — please try again";
      setSaveToast({ type: "error", message });
      setTimeout(() => setSaveToast({ type: "idle" }), 5e3);
    }
  }
  function handleReset() {
    const plans = backendPlans && backendPlans.length > 0 ? backendPlans : DEFAULT_PLANS;
    setLocalPlans(plans.map(toLocalPlan));
    setRecipientInput(backendRecipient ?? "ZyroTV");
    setChangedPlanIds(/* @__PURE__ */ new Set());
    setRecipientChanged(false);
    setSaveToast({ type: "idle" });
  }
  if (!isAdminAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center justify-center min-h-[70vh] text-center px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Please authenticate via the Admin button in the header." }) });
  }
  const isLoading = plansLoading || recipientLoading || actorFetching;
  const displayRecipient = backendRecipient ?? "ZyroTV";
  const pendingList = pendingApprovals ?? [];
  const isSaving = saveToast.type === "saving";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-background px-4 md:px-6 py-6 max-w-7xl mx-auto",
      "data-ocid": "admin-subscriptions-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AdminNav, { active: "Subscriptions", onTabChange }),
        saveToast.type === "saved" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "fixed top-6 right-6 z-50 flex items-center gap-2 glass-card rounded-xl px-5 py-3 text-sm font-medium text-foreground shadow-lg border border-emerald-500/30",
            "data-ocid": "save-toast",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 text-emerald-400" }),
              "Subscription plans saved to server"
            ]
          }
        ),
        saveToast.type === "error" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "fixed top-6 right-6 z-50 flex items-start gap-2 glass-card rounded-xl px-5 py-3 text-sm font-medium text-foreground shadow-lg border border-destructive/30 max-w-sm",
            "data-ocid": "save-error-toast",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 text-destructive shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: saveToast.message }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setSaveToast({ type: "idle" }),
                  className: "ml-1 p-0.5 hover:text-destructive transition-colors shrink-0",
                  "aria-label": "Dismiss",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 mb-6 flex-wrap",
            "data-ocid": "subscriptions-sub-tabs",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setSubTab("pending"),
                  className: `flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-smooth ${subTab === "pending" ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`,
                  "data-ocid": "subtab-pending",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4" }),
                    "Pending Approvals",
                    pendingList.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-amber-500 text-background text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0", children: pendingList.length })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setSubTab("pricing"),
                  className: `flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-smooth ${subTab === "pricing" ? "bg-primary/15 text-primary border border-primary/30" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`,
                  "data-ocid": "subtab-pricing",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-4 h-4" }),
                    "Plan Pricing"
                  ]
                }
              )
            ]
          }
        ),
        subTab === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "pending-approvals-section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5 flex-wrap gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground mb-1", children: "Pending Subscriptions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Review and approve or reject paid subscription requests." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => refetchApprovals(),
                disabled: approvalsFetching,
                className: "flex items-center gap-1.5 px-3 py-2 rounded-lg glass-card text-sm text-muted-foreground hover:text-foreground transition-smooth disabled:opacity-50",
                "data-ocid": "refresh-approvals-btn",
                "aria-label": "Refresh approvals",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    RefreshCw,
                    {
                      className: `w-4 h-4 ${approvalsFetching ? "animate-spin" : ""}`
                    }
                  ),
                  "Refresh"
                ]
              }
            )
          ] }),
          approvalsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-20 glass-card rounded-xl animate-pulse border border-border/40"
            },
            i
          )) }) : pendingList.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "glass-card rounded-2xl py-20 text-center border border-border/40",
              "data-ocid": "no-pending-approvals",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-8 h-8 text-emerald-400" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground mb-1", children: "All caught up!" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No pending subscription requests at this time." })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "pending-approvals-list", children: pendingList.map((approval) => {
            const principalText = approval.userPrincipal.toText();
            const isProcessing = processingPrincipals.has(principalText);
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              PendingApprovalRow,
              {
                approval,
                onApprove: () => handleApprovalAction(approval, true),
                onReject: () => handleApprovalAction(approval, false),
                isProcessing
              },
              principalText
            );
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 glass-card rounded-xl p-4 border border-border/40 flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-5 h-5 text-amber-400 shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: "Approve requests after verifying the user's IMVU credit payment. Approving grants the user immediate access to their selected plan. Rejecting removes their pending request." })
          ] })
        ] }),
        subTab === "pricing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "pricing-editor-section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6 flex-wrap gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground mb-1", children: "Subscription Pricing" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Changes are saved permanently to the server and persist after refresh." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: handleReset,
                  className: "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-smooth",
                  "data-ocid": "reset-plans-btn",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-4 h-4" }),
                    " Reset"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: handleSaveAll,
                  disabled: isSaving || changedPlanIds.size === 0 && !recipientChanged,
                  className: "flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-smooth disabled:opacity-50 disabled:cursor-not-allowed",
                  "data-ocid": "save-plans-btn",
                  children: isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 animate-spin" }),
                    " Saving..."
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4" }),
                    " Save All Changes"
                  ] })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "glass-card rounded-xl p-5 mb-6 border border-primary/30 bg-primary/5",
              "data-ocid": "imvu-recipient-card",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-5 h-5 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm text-foreground mb-0.5", children: "IMVU Credits Recipient" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-3", children: "The IMVU account name subscribers send credits to. Saved to server." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 max-w-md flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[180px]", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm select-none", children: "@" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "text",
                          value: recipientInput,
                          onChange: (e) => {
                            setRecipientInput(e.target.value);
                            setRecipientChanged(true);
                            setSaveToast({ type: "idle" });
                          },
                          placeholder: "ZyroTV",
                          className: "w-full pl-7 pr-3 py-2.5 rounded-lg bg-muted/20 border border-border/60 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-smooth",
                          "data-ocid": "imvu-recipient-input"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground shrink-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Current:" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-bold", children: [
                        "@",
                        displayRecipient
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/60 mt-2", children: 'Hit "Save All Changes" to apply the new recipient across the site.' })
                ] })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "glass-card rounded-xl p-5 mb-8 border border-border/50 flex items-start gap-4",
              "data-ocid": "imvu-info-card",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-muted/40 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-5 h-5 text-muted-foreground" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm text-foreground mb-1", children: "IMVU Credits Payment" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground leading-relaxed", children: [
                    "Subscribers pay by sending IMVU credits to",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-semibold", children: [
                      "@",
                      displayRecipient
                    ] }),
                    '. After sending, they submit their request which appears under "Pending Approvals" for you to review and approve.'
                  ] })
                ] })
              ]
            }
          ),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "glass-card rounded-2xl p-6 border border-border/40 animate-pulse",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-muted/40 rounded mb-4 w-16" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 bg-muted/40 rounded mb-3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 bg-muted/40 rounded mb-5" }),
                [0, 1, 2].map((j) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 bg-muted/40 rounded mb-2" }, j))
              ]
            },
            i
          )) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8",
              "data-ocid": "plans-grid",
              children: localPlans.map((plan) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                PlanCard,
                {
                  plan,
                  changed: changedPlanIds.has(plan.planId),
                  imvuRecipient: displayRecipient,
                  onUpdateName: (v) => updatePlan(plan.planId, { name: v }),
                  onUpdatePrice: (v) => updatePlan(plan.planId, { priceCredits: BigInt(v) }),
                  onUpdateFeature: (i, v) => updateFeature(plan.planId, i, v),
                  onAddFeature: () => addFeature(plan.planId),
                  onRemoveFeature: (i) => removeFeature(plan.planId, i),
                  onTogglePopular: () => updatePlan(plan.planId, { isPopular: !plan.isPopular }),
                  onUpdateDiscountPercent: (v) => updatePlan(plan.planId, { discountPercent: BigInt(v) }),
                  onToggleDiscountActive: () => updatePlan(plan.planId, {
                    discountActive: !plan.discountActive
                  })
                },
                plan.planId
              ))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "glass-card rounded-xl p-6 border border-border/50",
              "data-ocid": "plans-preview",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-bold text-foreground mb-4", children: "Subscriber-Facing Preview" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: localPlans.map((plan) => {
                  const colors = TIER_COLORS[plan.planId] ?? TIER_COLORS.Free;
                  const price = Number(plan.priceCredits);
                  const discountPercent = Number(plan.discountPercent);
                  const discountedPrice = plan.planId !== "Free" && plan.discountActive && discountPercent > 0 ? Math.round(price * (100 - discountPercent) / 100) : null;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: `rounded-xl p-5 bg-muted/20 border ${colors.border} relative`,
                      children: [
                        plan.isPopular && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-0.5 rounded-full", children: "Popular" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-black text-lg text-foreground mb-1", children: plan.name }),
                        price === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl font-black text-foreground mb-0.5", children: "Free" }) : discountedPrice !== null ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-0.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm line-through text-muted-foreground mr-1.5", children: price.toLocaleString() }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-2xl font-black text-primary", children: discountedPrice.toLocaleString() }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1 text-xs font-bold text-primary bg-primary/15 border border-primary/30 px-1.5 py-0.5 rounded-full", children: [
                            "-",
                            discountPercent,
                            "%"
                          ] })
                        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-2xl font-black text-foreground mb-0.5", children: [
                          price.toLocaleString(),
                          " credits"
                        ] }),
                        price > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-3", children: "per month on IMVU" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-3 space-y-1.5", children: [
                          plan.features.slice(0, 4).map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "li",
                            {
                              className: "flex items-center gap-1.5 text-xs text-foreground/80",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3 text-primary shrink-0" }),
                                f
                              ]
                            },
                            f
                          )),
                          plan.features.length > 4 && /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "text-xs text-muted-foreground pl-4.5", children: [
                            "+",
                            plan.features.length - 4,
                            " more"
                          ] })
                        ] })
                      ]
                    },
                    plan.planId
                  );
                }) })
              ]
            }
          )
        ] })
      ]
    }
  );
}
export {
  AdminSubscriptionsPage as default
};
