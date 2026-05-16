import { c as createLucideIcon, k as useInternetIdentity, a as useActor, b as useQuery, r as reactExports, j as jsxRuntimeExports, Z as Zap, p as SubscriptionTier, q as ShieldCheck, X, U as User, d as createActor } from "./index-BiC3Bukn.js";
import { B as Button, C as Clock } from "./button-BnI6w-mQ.js";
import { u as useMutation } from "./useMutation-BlzaivA3.js";
import { L as Lock } from "./lock-C6J3FreY.js";
import { S as Star } from "./star-Bz45glpD.js";
import { C as Check } from "./check-Cliyqnti.js";
import { S as Send } from "./send-CHALuWUW.js";
import { C as CircleAlert } from "./circle-alert-2UkViAKo.js";
import { C as ChevronRight } from "./chevron-right-y-grUHwQ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }]
];
const Calendar = createLucideIcon("calendar", __iconNode$1);
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
      d: "M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z",
      key: "1vdc57"
    }
  ],
  ["path", { d: "M5 21h14", key: "11awu3" }]
];
const Crown = createLucideIcon("crown", __iconNode);
const PLAN_ICONS = {
  Free: Star,
  Pro: Zap,
  Premium: Crown
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
function formatExpiryDate(ts) {
  const ms = Number(ts / BigInt(1e6));
  return new Date(ms).toLocaleDateString("en-US", {
    month: "long",
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
function getEffectivePrice(plan) {
  const full = Number(plan.priceCredits);
  const pct = Number(plan.discountPercent);
  if (plan.discountActive && pct > 0) {
    return Math.round(full * (100 - pct) / 100);
  }
  return full;
}
function hasActiveDiscount(plan) {
  return plan.discountActive && Number(plan.discountPercent) > 0;
}
function ActiveSubscriptionBanner({ profile }) {
  const tier = profile.subscriptionTier;
  const expiresAt = profile.subscriptionExpiresAt;
  const isPro = tier === "Pro";
  const isPremium = tier === "Premium";
  if (!isPro && !isPremium) return null;
  const expired = expiresAt ? isExpired(expiresAt) : false;
  const soon = expiresAt && !expired ? isExpiringSoon(expiresAt) : false;
  const tierColor = isPremium ? "border-amber-500/40 bg-amber-500/5" : "border-primary/40 bg-primary/5";
  const tierTextColor = isPremium ? "text-amber-400" : "text-primary";
  const TierIcon = isPremium ? Crown : Zap;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `glass-card rounded-2xl p-5 mb-8 border ${tierColor} flex flex-col sm:flex-row sm:items-center gap-4`,
      "data-ocid": "active-subscription-banner",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isPremium ? "bg-amber-500/15" : "bg-primary/15"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: `w-6 h-6 ${tierTextColor}` })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TierIcon, { className: `w-4 h-4 ${tierTextColor}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `font-display font-bold text-base ${tierTextColor}`, children: [
              tier,
              " Member"
            ] }),
            expired ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full", children: "Expired" }) : soon ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full", children: "Expiring soon" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full", children: "Active" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3.5 h-3.5 shrink-0" }),
            expiresAt ? expired ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-red-400", children: [
              "Your membership expired on ",
              formatExpiryDate(expiresAt)
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Your",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-semibold ${tierTextColor}`, children: tier }),
              " ",
              "membership expires on",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: soon ? "text-amber-400 font-semibold" : "text-foreground font-medium",
                  children: formatExpiryDate(expiresAt)
                }
              )
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Active membership — no expiry set" })
          ] })
        ] }),
        (expired || soon) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `flex items-center gap-1.5 text-xs ${expired ? "text-red-400" : "text-amber-400"} bg-muted/20 rounded-lg px-3 py-2`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3.5 h-3.5" }),
              expired ? "Renew below to restore access" : "Renew soon to keep access"
            ]
          }
        ) })
      ]
    }
  );
}
const FAQ_ITEMS = [
  {
    q: "How long does activation take?",
    a: "Once the admin verifies your IMVU credits payment and approves your request, your account is activated within 24 hours."
  },
  {
    q: "What if I send the wrong amount?",
    a: "Contact us via DM on IMVU at ZyroTV with your username and the amount sent. We'll manually verify and adjust your plan accordingly."
  },
  {
    q: "Is there a family plan?",
    a: "The Premium plan supports up to 4 simultaneous streams, making it perfect for households. Individual profiles with personalized recommendations coming soon!"
  },
  {
    q: "What happens to my watchlist if I downgrade?",
    a: "Your watchlist and watch history are always preserved. You'll just need to resubscribe to access Pro or Premium-exclusive content."
  }
];
const FEATURE_COMPARISON = [
  { feature: "Access all free episodes", free: true, pro: true, premium: true },
  { feature: "HD quality (1080p)", free: false, pro: true, premium: true },
  { feature: "4K Ultra HD", free: false, pro: false, premium: true },
  { feature: "Ad-free experience", free: false, pro: true, premium: true },
  {
    feature: "Offline downloads",
    free: false,
    pro: "5 episodes",
    premium: "Unlimited"
  },
  { feature: "Simultaneous screens", free: "1", pro: "2", premium: "4" },
  { feature: "Early access releases", free: false, pro: true, premium: true },
  { feature: "Priority support", free: false, pro: false, premium: true }
];
function buildSteps(recipient) {
  return [
    { n: 1, text: "Open the IMVU app on your device" },
    { n: 2, text: 'Tap "Send Credits" in your wallet' },
    { n: 3, text: `Search for the account: ${recipient}` },
    { n: 4, text: (credits) => `Send exactly ${credits} credits` },
    { n: 5, text: "Come back here and confirm your IMVU username below" }
  ];
}
function CheckoutModal({
  plan,
  onClose,
  onSuccess,
  imvuRecipient,
  onRequestApproval
}) {
  const [imvuUsername, setImvuUsername] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const fullPrice = Number(plan.priceCredits);
  const discountPct = Number(plan.discountPercent);
  const discounted = hasActiveDiscount(plan);
  const effectivePrice = discounted ? Math.round(fullPrice * (100 - discountPct) / 100) : fullPrice;
  const credits = effectivePrice.toLocaleString();
  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!imvuUsername.trim()) {
      setError("Please enter your IMVU username");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await onRequestApproval(imvuUsername.trim());
      onSuccess();
    } catch {
      setError("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md",
      "data-ocid": "checkout-overlay",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "glass-card rounded-2xl w-full max-w-lg relative overflow-y-auto max-h-[90vh]",
          "data-ocid": "checkout-modal",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-7 pt-7 pb-5 border-b border-border/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Pay with IMVU Credits" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display font-bold text-foreground", children: [
                    plan.name,
                    " Plan",
                    discounted ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      " — ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "line-through text-muted-foreground font-normal text-sm", children: fullPrice.toLocaleString() }),
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: credits }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1 text-xs font-bold text-primary bg-primary/15 border border-primary/30 px-1.5 py-0.5 rounded-full", children: [
                        "-",
                        discountPct,
                        "% OFF"
                      ] })
                    ] }) : ` — ${credits} credits/mo`
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  className: "text-muted-foreground hover:text-foreground transition-smooth rounded-lg p-1",
                  "aria-label": "Close checkout",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-7 py-6 space-y-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-primary/10 border border-primary/30 p-4 flex items-center justify-between gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-0.5", children: "Amount to send" }),
                  discounted && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm line-through text-muted-foreground leading-none mb-1", children: [
                    fullPrice.toLocaleString(),
                    " credits"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-3xl font-black text-gradient-purple", children: credits }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                    "IMVU Credits",
                    discounted && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1.5 text-primary font-semibold", children: [
                      "(",
                      discountPct,
                      "% off)"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-0.5", children: "Send to" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl font-bold text-foreground", children: imvuRecipient }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-primary font-medium mt-0.5", children: "IMVU Account" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground mb-3", children: "Follow these steps:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "space-y-3", children: buildSteps(imvuRecipient).map(({ n, text }) => {
                  const label = typeof text === "function" ? text(credits) : text;
                  const isRecipient = n === 3;
                  const isAmount = n === 4;
                  const highlight = isRecipient ? imvuRecipient : isAmount ? credits : "";
                  const parts = highlight ? label.split(highlight) : [label];
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "li",
                    {
                      className: "flex items-start gap-3",
                      "data-ocid": `checkout-step-${n}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center mt-0.5", children: n }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground/85 leading-relaxed", children: parts.length === 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: parts[0] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: parts[0] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-bold", children: highlight }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: parts[1] })
                        ] }) })
                      ]
                    },
                    n
                  );
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/50" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleConfirm, className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "label",
                    {
                      htmlFor: "imvu-username",
                      className: "text-xs text-muted-foreground mb-1.5 block font-medium",
                      children: "Your IMVU Username"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        id: "imvu-username",
                        "data-ocid": "imvu-username-input",
                        className: "w-full bg-muted/40 border border-input rounded-lg pl-10 pr-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary transition-smooth",
                        placeholder: "e.g. YourIMVUname123",
                        value: imvuUsername,
                        onChange: (e) => {
                          setImvuUsername(e.target.value);
                          if (error) setError("");
                        }
                      }
                    )
                  ] }),
                  error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-destructive text-xs mt-1", children: error })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 text-xs text-muted-foreground bg-muted/20 rounded-lg px-3.5 py-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3.5 h-3.5 shrink-0 mt-0.5 text-primary/70" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Your request will be sent to the admin for approval. You'll get full access once verified." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": "checkout-submit",
                    type: "submit",
                    className: "w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-smooth glow-primary flex items-center gap-2",
                    disabled: loading,
                    children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" }),
                      "Submitting request..."
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4" }),
                      "I've sent the credits — Submit Request"
                    ] })
                  }
                )
              ] })
            ] })
          ]
        }
      )
    }
  );
}
function LoginPromptModal({
  onClose,
  onLogin
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md",
      "data-ocid": "login-prompt-overlay",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "glass-card rounded-2xl w-full max-w-sm p-8 text-center",
          "data-ocid": "login-prompt-modal",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-8 h-8 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground mb-2", children: "Sign In Required" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6 leading-relaxed", children: "You need to sign in with Internet Identity to subscribe to a plan." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  "data-ocid": "login-prompt-btn",
                  onClick: onLogin,
                  className: "w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-smooth glow-primary",
                  children: "Sign In with Internet Identity"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  className: "text-sm text-muted-foreground hover:text-foreground transition-smooth",
                  children: "Cancel"
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
function PendingModal({
  planName,
  onClose,
  imvuRecipient
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md",
      "data-ocid": "pending-overlay",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "glass-card rounded-2xl w-full max-w-md p-10 text-center",
          "data-ocid": "pending-modal",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-10 h-10 text-amber-400" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl font-bold text-foreground mb-3", children: "Request Submitted!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground mb-2 text-sm leading-relaxed", children: [
              "Your ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: planName }),
              " ",
              "subscription request is now",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-amber-400 font-semibold", children: "pending admin approval" }),
              "."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-8 text-sm leading-relaxed bg-muted/20 rounded-xl px-4 py-3 border border-border/50", children: "The admin will review your payment and activate your account. Once approved, you'll have full access." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 text-xs text-muted-foreground mb-8", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3.5 h-3.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Questions? DM us on IMVU:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: imvuRecipient })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                "data-ocid": "pending-continue",
                onClick: onClose,
                className: "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 h-11 rounded-xl transition-smooth flex items-center gap-2 mx-auto",
                children: [
                  "Back to Plans",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
                ]
              }
            )
          ]
        }
      )
    }
  );
}
function renderFeatureCell(val) {
  if (val === true) return /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 text-primary mx-auto" });
  if (val === false)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40 text-base block text-center", children: "—" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/80 text-xs font-medium", children: val });
}
function SubscribePage() {
  const { identity, login, isInitializing } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { data: backendPlans, isLoading: plansLoading } = useQuery({
    queryKey: ["subscriptionPlans"],
    queryFn: async () => {
      if (!actor) return DEFAULT_PLANS;
      const plans2 = await actor.getSubscriptionPlans();
      return plans2.length > 0 ? plans2 : DEFAULT_PLANS;
    },
    enabled: !!actor && !actorFetching
  });
  const { data: backendRecipient } = useQuery({
    queryKey: ["imvuRecipient"],
    queryFn: async () => {
      if (!actor) return "ZyroTV";
      const r = await actor.getImvuRecipient();
      return r || "ZyroTV";
    },
    enabled: !!actor && !actorFetching
  });
  const { data: callerProfile } = useQuery({
    queryKey: ["callerProfile"],
    queryFn: async () => {
      if (!actor || !identity) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && !!identity
  });
  const activateSubscriptionMutation = useMutation({
    mutationFn: async (tier) => {
      if (!actor) throw new Error("No actor");
      return actor.activateSubscription(tier);
    }
  });
  const plans = backendPlans ?? DEFAULT_PLANS;
  const imvuRecipient = backendRecipient ?? "ZyroTV";
  const [selectedPlan, setSelectedPlan] = reactExports.useState(null);
  const [showPending, setShowPending] = reactExports.useState(false);
  const [pendingPlanName, setPendingPlanName] = reactExports.useState("");
  const [showLoginPrompt, setShowLoginPrompt] = reactExports.useState(false);
  const [openFaq, setOpenFaq] = reactExports.useState(null);
  const handleSubscribe = (plan) => {
    if (!identity) {
      setShowLoginPrompt(true);
      return;
    }
    setSelectedPlan(plan);
  };
  const handleRequestApproval = async (_imvuUsername) => {
    const planId = ((selectedPlan == null ? void 0 : selectedPlan.planId) ?? "pro").toLowerCase();
    const tier = planId === "premium" ? SubscriptionTier.Premium : planId === "pro" ? SubscriptionTier.Pro : SubscriptionTier.Free;
    await activateSubscriptionMutation.mutateAsync(tier);
  };
  const handleSuccess = () => {
    setPendingPlanName((selectedPlan == null ? void 0 : selectedPlan.name) ?? "Pro");
    setSelectedPlan(null);
    setShowPending(true);
  };
  const isLoggedIn = !isInitializing && !!identity;
  const userProfile = callerProfile ?? null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", "data-ocid": "subscribe-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "py-20 px-4 text-center relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 max-w-3xl mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-4 h-4 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-primary font-semibold", children: "Premium Streaming" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-5xl md:text-6xl font-black mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-purple", children: "Unlock Premium" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "Streaming" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-muted-foreground", children: "Watch exclusive shows, go ad-free, and stream in 4K" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-primary/80 font-medium", children: "Pay with IMVU Credits — fast, simple, no card needed" }),
        !isLoggedIn && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: login,
            className: "mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 border border-primary/30 rounded-full text-sm text-primary font-semibold hover:bg-primary/20 transition-smooth",
            "data-ocid": "hero-login-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-4 h-4" }),
              "Sign in with Internet Identity to subscribe"
            ]
          }
        )
      ] })
    ] }),
    isLoggedIn && userProfile && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 max-w-5xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ActiveSubscriptionBanner, { profile: userProfile }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "px-4 pb-16 max-w-5xl mx-auto",
        "data-ocid": "pricing-plans",
        children: plansLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-6", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "glass-card rounded-2xl p-7 border border-border/40 animate-pulse",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-muted/40 rounded-xl mb-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 bg-muted/40 rounded mb-2 w-20" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 bg-muted/40 rounded mb-6 w-32" }),
              [0, 1, 2, 3].map((j) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-muted/40 rounded mb-2" }, j))
            ]
          },
          i
        )) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-6 items-start", children: plans.map((plan) => {
          const Icon = PLAN_ICONS[plan.planId] ?? Star;
          const isPopular = plan.planId === "Pro";
          const fullPrice = Number(plan.priceCredits);
          const discountPct = Number(plan.discountPercent);
          const discounted = hasActiveDiscount(plan);
          const effectivePrice = getEffectivePrice(plan);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `glass-card rounded-2xl p-7 flex flex-col relative transition-smooth ${isPopular ? "neon-border glow-primary md:-mt-3" : "border-border"}`,
              "data-ocid": `plan-${plan.planId.toLowerCase()}`,
              children: [
                isPopular && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full tracking-wider uppercase whitespace-nowrap", children: "Most Popular" }),
                discounted && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-black px-2.5 py-1 rounded-full shadow-[0_0_12px_rgba(168,85,247,0.5)] tracking-wide",
                    "data-ocid": `plan-discount-badge-${plan.planId.toLowerCase()}`,
                    children: [
                      discountPct,
                      "% OFF"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${isPopular ? "bg-primary/20" : "bg-muted/60"}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Icon,
                      {
                        className: `w-6 h-6 ${isPopular ? "text-primary" : "text-muted-foreground"}`
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-bold text-foreground mb-1", children: plan.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-baseline gap-2 mb-1 flex-wrap", children: fullPrice === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl font-black text-foreground", children: "Free" }) : discounted ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl font-bold line-through text-muted-foreground", children: fullPrice.toLocaleString() }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl font-black text-primary", children: effectivePrice.toLocaleString() }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-sm self-end pb-1", children: "credits/month" })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl font-black text-foreground", children: fullPrice.toLocaleString() }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-sm", children: "credits/month" })
                ] }) }),
                fullPrice > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-primary/80 font-medium mb-5", children: "Send via IMVU · Admin approval required" }),
                fullPrice === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3 mb-8 flex-1", children: plan.features.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "li",
                  {
                    className: "flex items-start gap-2.5 text-sm text-foreground/80",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 text-primary mt-0.5 shrink-0" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: f })
                    ]
                  },
                  f
                )) }),
                plan.planId === "Free" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-full rounded-xl h-11 bg-muted/30 border border-border flex items-center justify-center text-muted-foreground text-sm font-semibold",
                    "data-ocid": "plan-free-cta",
                    children: "Free — No approval needed"
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": `plan-${plan.planId.toLowerCase()}-cta`,
                    onClick: () => handleSubscribe(plan),
                    className: `w-full rounded-xl h-11 font-semibold transition-smooth ${isPopular ? "bg-primary hover:bg-primary/90 text-primary-foreground glow-primary" : "bg-muted/50 hover:bg-primary hover:text-primary-foreground text-foreground border border-border"}`,
                    children: "Subscribe with IMVU"
                  }
                )
              ]
            },
            plan.planId
          );
        }) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-4 pb-14 max-w-5xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-6 border border-primary/20 bg-primary/5 flex flex-col md:flex-row items-center gap-4 text-center md:text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-7 h-7 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-bold text-foreground mb-1", children: "We accept IMVU Credits" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "All subscriptions are paid via IMVU credits. Send your credits to",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-bold", children: imvuRecipient }),
          " on IMVU, confirm your username, and the admin will approve your plan."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-0.5", children: "Send credits to" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl font-black text-gradient-purple", children: imvuRecipient }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "on IMVU" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: "px-4 pb-16 max-w-5xl mx-auto",
        "data-ocid": "feature-comparison",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground text-center mb-8", children: "Full Feature Comparison" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-card rounded-2xl overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-6 py-4 text-muted-foreground font-medium text-sm w-1/2", children: "Feature" }),
              plans.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "th",
                {
                  className: `px-4 py-4 text-center text-sm font-bold ${p.planId === "Pro" ? "text-primary" : "text-foreground"}`,
                  children: p.name
                },
                p.planId
              ))
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: FEATURE_COMPARISON.map((row, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: `border-b border-border/50 ${i % 2 === 0 ? "" : "bg-muted/10"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-3.5 text-sm text-foreground/80", children: row.feature }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3.5 text-center", children: renderFeatureCell(row.free) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3.5 text-center", children: renderFeatureCell(row.pro) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3.5 text-center", children: renderFeatureCell(row.premium) })
                ]
              },
              row.feature
            )) })
          ] }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: "px-4 pb-20 max-w-2xl mx-auto",
        "data-ocid": "subscribe-faq",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground text-center mb-8", children: "Frequently Asked Questions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: FAQ_ITEMS.map((item, faqIdx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": `faq-item-${faqIdx}`,
                onClick: () => setOpenFaq(openFaq === faqIdx ? null : faqIdx),
                className: "w-full flex items-center justify-between px-6 py-4 text-left hover:bg-muted/20 transition-smooth",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground text-sm", children: item.q }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `text-primary text-xl font-light transition-transform duration-300 ${openFaq === faqIdx ? "rotate-45" : ""}`,
                      children: "+"
                    }
                  )
                ]
              }
            ),
            openFaq === faqIdx && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-4", children: item.a })
          ] }, item.q)) })
        ]
      }
    ),
    showLoginPrompt && /* @__PURE__ */ jsxRuntimeExports.jsx(
      LoginPromptModal,
      {
        onClose: () => setShowLoginPrompt(false),
        onLogin: () => {
          setShowLoginPrompt(false);
          login();
        }
      }
    ),
    selectedPlan && !showPending && /* @__PURE__ */ jsxRuntimeExports.jsx(
      CheckoutModal,
      {
        plan: selectedPlan,
        onClose: () => setSelectedPlan(null),
        onSuccess: handleSuccess,
        imvuRecipient,
        onRequestApproval: handleRequestApproval
      }
    ),
    showPending && /* @__PURE__ */ jsxRuntimeExports.jsx(
      PendingModal,
      {
        planName: pendingPlanName,
        onClose: () => setShowPending(false),
        imvuRecipient
      }
    )
  ] });
}
export {
  SubscribePage as default
};
