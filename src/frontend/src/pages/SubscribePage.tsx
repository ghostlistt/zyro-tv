import { Button } from "@/components/ui/button";
import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Crown,
  Lock,
  Send,
  ShieldCheck,
  Star,
  User,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { SubscriptionTier, createActor } from "../backend";
import type { SubscriptionPlanConfig, UserProfilePublic } from "../backend";

const PLAN_ICONS: Record<string, React.ElementType> = {
  Free: Star,
  Pro: Zap,
  Premium: Crown,
};

const DEFAULT_PLANS: SubscriptionPlanConfig[] = [
  {
    planId: "Free",
    name: "Free",
    priceCredits: BigInt(0),
    features: [
      "Access all free episodes",
      "1 device at a time",
      "Limited episodes per show",
    ],
    discountPercent: BigInt(0),
    discountActive: false,
  },
  {
    planId: "Pro",
    name: "Pro",
    priceCredits: BigInt(1000),
    features: [
      "All Free content + Pro exclusives",
      "HD quality (1080p)",
      "Ad-free experience",
      "2 devices simultaneously",
      "Offline downloads (5 episodes)",
      "Early access to new releases",
    ],
    discountPercent: BigInt(0),
    discountActive: false,
  },
  {
    planId: "Premium",
    name: "Premium",
    priceCredits: BigInt(2000),
    features: [
      "All content including exclusives",
      "4K Ultra HD quality",
      "Ad-free experience",
      "4 devices simultaneously",
      "Unlimited offline downloads",
      "Day-1 exclusive access",
      "Priority support",
    ],
    discountPercent: BigInt(0),
    discountActive: false,
  },
];

function formatExpiryDate(ts: bigint): string {
  const ms = Number(ts / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function isExpired(ts: bigint): boolean {
  const ms = Number(ts / BigInt(1_000_000));
  return ms < Date.now();
}

function isExpiringSoon(ts: bigint): boolean {
  const ms = Number(ts / BigInt(1_000_000));
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  return ms > Date.now() && ms - Date.now() <= sevenDays;
}

/** Returns the effective price for a plan (discounted if active, else full price). */
function getEffectivePrice(plan: SubscriptionPlanConfig): number {
  const full = Number(plan.priceCredits);
  const pct = Number(plan.discountPercent);
  if (plan.discountActive && pct > 0) {
    return Math.round((full * (100 - pct)) / 100);
  }
  return full;
}

function hasActiveDiscount(plan: SubscriptionPlanConfig): boolean {
  return plan.discountActive && Number(plan.discountPercent) > 0;
}

function ActiveSubscriptionBanner({ profile }: { profile: UserProfilePublic }) {
  const tier = profile.subscriptionTier as string;
  const expiresAt = profile.subscriptionExpiresAt;

  const isPro = tier === "Pro";
  const isPremium = tier === "Premium";
  if (!isPro && !isPremium) return null;

  const expired = expiresAt ? isExpired(expiresAt) : false;
  const soon = expiresAt && !expired ? isExpiringSoon(expiresAt) : false;

  const tierColor = isPremium
    ? "border-amber-500/40 bg-amber-500/5"
    : "border-primary/40 bg-primary/5";
  const tierTextColor = isPremium ? "text-amber-400" : "text-primary";
  const TierIcon = isPremium ? Crown : Zap;

  return (
    <div
      className={`glass-card rounded-2xl p-5 mb-8 border ${tierColor} flex flex-col sm:flex-row sm:items-center gap-4`}
      data-ocid="active-subscription-banner"
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isPremium ? "bg-amber-500/15" : "bg-primary/15"}`}
      >
        <ShieldCheck className={`w-6 h-6 ${tierTextColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <TierIcon className={`w-4 h-4 ${tierTextColor}`} />
          <span className={`font-display font-bold text-base ${tierTextColor}`}>
            {tier} Member
          </span>
          {expired ? (
            <span className="text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
              Expired
            </span>
          ) : soon ? (
            <span className="text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              Expiring soon
            </span>
          ) : (
            <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              Active
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar className="w-3.5 h-3.5 shrink-0" />
          {expiresAt ? (
            expired ? (
              <span className="text-red-400">
                Your membership expired on {formatExpiryDate(expiresAt)}
              </span>
            ) : (
              <span>
                Your{" "}
                <span className={`font-semibold ${tierTextColor}`}>{tier}</span>{" "}
                membership expires on{" "}
                <span
                  className={
                    soon
                      ? "text-amber-400 font-semibold"
                      : "text-foreground font-medium"
                  }
                >
                  {formatExpiryDate(expiresAt)}
                </span>
              </span>
            )
          ) : (
            <span>Active membership — no expiry set</span>
          )}
        </div>
      </div>
      {(expired || soon) && (
        <div className="shrink-0">
          <div
            className={`flex items-center gap-1.5 text-xs ${expired ? "text-red-400" : "text-amber-400"} bg-muted/20 rounded-lg px-3 py-2`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            {expired
              ? "Renew below to restore access"
              : "Renew soon to keep access"}
          </div>
        </div>
      )}
    </div>
  );
}

const FAQ_ITEMS = [
  {
    q: "How long does activation take?",
    a: "Once the admin verifies your IMVU credits payment and approves your request, your account is activated within 24 hours.",
  },
  {
    q: "What if I send the wrong amount?",
    a: "Contact us via DM on IMVU at ZyroTV with your username and the amount sent. We'll manually verify and adjust your plan accordingly.",
  },
  {
    q: "Is there a family plan?",
    a: "The Premium plan supports up to 4 simultaneous streams, making it perfect for households. Individual profiles with personalized recommendations coming soon!",
  },
  {
    q: "What happens to my watchlist if I downgrade?",
    a: "Your watchlist and watch history are always preserved. You'll just need to resubscribe to access Pro or Premium-exclusive content.",
  },
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
    premium: "Unlimited",
  },
  { feature: "Simultaneous screens", free: "1", pro: "2", premium: "4" },
  { feature: "Early access releases", free: false, pro: true, premium: true },
  { feature: "Priority support", free: false, pro: false, premium: true },
];

interface CheckoutModalProps {
  plan: SubscriptionPlanConfig;
  onClose: () => void;
  onSuccess: () => void;
  imvuRecipient: string;
  onRequestApproval: (imvuUsername: string) => Promise<void>;
}

function buildSteps(recipient: string) {
  return [
    { n: 1, text: "Open the IMVU app on your device" },
    { n: 2, text: 'Tap "Send Credits" in your wallet' },
    { n: 3, text: `Search for the account: ${recipient}` },
    { n: 4, text: (credits: string) => `Send exactly ${credits} credits` },
    { n: 5, text: "Come back here and confirm your IMVU username below" },
  ];
}

function CheckoutModal({
  plan,
  onClose,
  onSuccess,
  imvuRecipient,
  onRequestApproval,
}: CheckoutModalProps) {
  const [imvuUsername, setImvuUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fullPrice = Number(plan.priceCredits);
  const discountPct = Number(plan.discountPercent);
  const discounted = hasActiveDiscount(plan);
  const effectivePrice = discounted
    ? Math.round((fullPrice * (100 - discountPct)) / 100)
    : fullPrice;
  const credits = effectivePrice.toLocaleString();

  const handleConfirm = async (e: React.FormEvent) => {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
      data-ocid="checkout-overlay"
    >
      <div
        className="glass-card rounded-2xl w-full max-w-lg relative overflow-y-auto max-h-[90vh]"
        data-ocid="checkout-modal"
      >
        <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <Send className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                Pay with IMVU Credits
              </p>
              <p className="font-display font-bold text-foreground">
                {plan.name} Plan
                {discounted ? (
                  <>
                    {" — "}
                    <span className="line-through text-muted-foreground font-normal text-sm">
                      {fullPrice.toLocaleString()}
                    </span>{" "}
                    <span className="text-primary">{credits}</span>
                    <span className="ml-1 text-xs font-bold text-primary bg-primary/15 border border-primary/30 px-1.5 py-0.5 rounded-full">
                      -{discountPct}% OFF
                    </span>
                  </>
                ) : (
                  ` — ${credits} credits/mo`
                )}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-smooth rounded-lg p-1"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-7 py-6 space-y-6">
          <div className="rounded-xl bg-primary/10 border border-primary/30 p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">
                Amount to send
              </p>
              {discounted && (
                <p className="text-sm line-through text-muted-foreground leading-none mb-1">
                  {fullPrice.toLocaleString()} credits
                </p>
              )}
              <p className="font-display text-3xl font-black text-gradient-purple">
                {credits}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                IMVU Credits
                {discounted && (
                  <span className="ml-1.5 text-primary font-semibold">
                    ({discountPct}% off)
                  </span>
                )}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-0.5">Send to</p>
              <p className="font-display text-xl font-bold text-foreground">
                {imvuRecipient}
              </p>
              <p className="text-xs text-primary font-medium mt-0.5">
                IMVU Account
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-3">
              Follow these steps:
            </p>
            <ol className="space-y-3">
              {buildSteps(imvuRecipient).map(({ n, text }) => {
                const label = typeof text === "function" ? text(credits) : text;
                const isRecipient = n === 3;
                const isAmount = n === 4;
                const highlight = isRecipient
                  ? imvuRecipient
                  : isAmount
                    ? credits
                    : "";
                const parts = highlight ? label.split(highlight) : [label];
                return (
                  <li
                    key={n}
                    className="flex items-start gap-3"
                    data-ocid={`checkout-step-${n}`}
                  >
                    <span className="shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                      {n}
                    </span>
                    <span className="text-sm text-foreground/85 leading-relaxed">
                      {parts.length === 1 ? (
                        <span>{parts[0]}</span>
                      ) : (
                        <>
                          <span>{parts[0]}</span>
                          <span className="text-primary font-bold">
                            {highlight}
                          </span>
                          <span>{parts[1]}</span>
                        </>
                      )}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="border-t border-border/50" />

          <form onSubmit={handleConfirm} className="space-y-4">
            <div>
              <label
                htmlFor="imvu-username"
                className="text-xs text-muted-foreground mb-1.5 block font-medium"
              >
                Your IMVU Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="imvu-username"
                  data-ocid="imvu-username-input"
                  className="w-full bg-muted/40 border border-input rounded-lg pl-10 pr-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary transition-smooth"
                  placeholder="e.g. YourIMVUname123"
                  value={imvuUsername}
                  onChange={(e) => {
                    setImvuUsername(e.target.value);
                    if (error) setError("");
                  }}
                />
              </div>
              {error && (
                <p className="text-destructive text-xs mt-1">{error}</p>
              )}
            </div>

            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/20 rounded-lg px-3.5 py-3">
              <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary/70" />
              <span>
                Your request will be sent to the admin for approval. You'll get
                full access once verified.
              </span>
            </div>

            <Button
              data-ocid="checkout-submit"
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-smooth glow-primary flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Submitting request...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  I've sent the credits — Submit Request
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

function LoginPromptModal({
  onClose,
  onLogin,
}: { onClose: () => void; onLogin: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
      data-ocid="login-prompt-overlay"
    >
      <div
        className="glass-card rounded-2xl w-full max-w-sm p-8 text-center"
        data-ocid="login-prompt-modal"
      >
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-5">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          Sign In Required
        </h2>
        <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
          You need to sign in with Internet Identity to subscribe to a plan.
        </p>
        <div className="flex flex-col gap-3">
          <Button
            data-ocid="login-prompt-btn"
            onClick={onLogin}
            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-smooth glow-primary"
          >
            Sign In with Internet Identity
          </Button>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-muted-foreground hover:text-foreground transition-smooth"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function PendingModal({
  planName,
  onClose,
  imvuRecipient,
}: { planName: string; onClose: () => void; imvuRecipient: string }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
      data-ocid="pending-overlay"
    >
      <div
        className="glass-card rounded-2xl w-full max-w-md p-10 text-center"
        data-ocid="pending-modal"
      >
        <div className="w-20 h-20 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-amber-400" />
        </div>
        <h2 className="font-display text-3xl font-bold text-foreground mb-3">
          Request Submitted!
        </h2>
        <p className="text-muted-foreground mb-2 text-sm leading-relaxed">
          Your <span className="text-primary font-semibold">{planName}</span>{" "}
          subscription request is now{" "}
          <span className="text-amber-400 font-semibold">
            pending admin approval
          </span>
          .
        </p>
        <p className="text-muted-foreground mb-8 text-sm leading-relaxed bg-muted/20 rounded-xl px-4 py-3 border border-border/50">
          The admin will review your payment and activate your account. Once
          approved, you'll have full access.
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-8">
          <Lock className="w-3.5 h-3.5" />
          <span>
            Questions? DM us on IMVU:{" "}
            <span className="text-primary font-semibold">{imvuRecipient}</span>
          </span>
        </div>
        <Button
          data-ocid="pending-continue"
          onClick={onClose}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 h-11 rounded-xl transition-smooth flex items-center gap-2 mx-auto"
        >
          Back to Plans
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function renderFeatureCell(val: boolean | string) {
  if (val === true) return <Check className="w-4 h-4 text-primary mx-auto" />;
  if (val === false)
    return (
      <span className="text-muted-foreground/40 text-base block text-center">
        —
      </span>
    );
  return <span className="text-foreground/80 text-xs font-medium">{val}</span>;
}

export default function SubscribePage() {
  const { identity, login, isInitializing } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor(createActor);

  const { data: backendPlans, isLoading: plansLoading } = useQuery({
    queryKey: ["subscriptionPlans"],
    queryFn: async () => {
      if (!actor) return DEFAULT_PLANS;
      const plans = await actor.getSubscriptionPlans();
      return plans.length > 0 ? plans : DEFAULT_PLANS;
    },
    enabled: !!actor && !actorFetching,
  });

  const { data: backendRecipient } = useQuery({
    queryKey: ["imvuRecipient"],
    queryFn: async () => {
      if (!actor) return "ZyroTV";
      const r = await actor.getImvuRecipient();
      return r || "ZyroTV";
    },
    enabled: !!actor && !actorFetching,
  });

  const { data: callerProfile } = useQuery<UserProfilePublic | null>({
    queryKey: ["callerProfile"],
    queryFn: async () => {
      if (!actor || !identity) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && !!identity,
  });

  const activateSubscriptionMutation = useMutation({
    mutationFn: async (tier: SubscriptionTier) => {
      if (!actor) throw new Error("No actor");
      return actor.activateSubscription(tier);
    },
  });

  const plans = backendPlans ?? DEFAULT_PLANS;
  const imvuRecipient = backendRecipient ?? "ZyroTV";

  const [selectedPlan, setSelectedPlan] =
    useState<SubscriptionPlanConfig | null>(null);
  const [showPending, setShowPending] = useState(false);
  const [pendingPlanName, setPendingPlanName] = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubscribe = (plan: SubscriptionPlanConfig) => {
    if (!identity) {
      setShowLoginPrompt(true);
      return;
    }
    setSelectedPlan(plan);
  };

  const handleRequestApproval = async (_imvuUsername: string) => {
    const planId = (selectedPlan?.planId ?? "pro").toLowerCase();
    const tier =
      planId === "premium"
        ? SubscriptionTier.Premium
        : planId === "pro"
          ? SubscriptionTier.Pro
          : SubscriptionTier.Free;
    await activateSubscriptionMutation.mutateAsync(tier);
  };

  const handleSuccess = () => {
    setPendingPlanName(selectedPlan?.name ?? "Pro");
    setSelectedPlan(null);
    setShowPending(true);
  };

  const isLoggedIn = !isInitializing && !!identity;
  const userProfile = callerProfile ?? null;

  return (
    <div className="min-h-screen bg-background" data-ocid="subscribe-page">
      {/* Hero */}
      <section className="py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 mb-6">
            <Crown className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-semibold">
              Premium Streaming
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-black mb-4">
            <span className="text-gradient-purple">Unlock Premium</span>
            <br />
            <span className="text-foreground">Streaming</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Watch exclusive shows, go ad-free, and stream in 4K
          </p>
          <p className="mt-3 text-sm text-primary/80 font-medium">
            Pay with IMVU Credits — fast, simple, no card needed
          </p>
          {!isLoggedIn && (
            <button
              type="button"
              onClick={login}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 border border-primary/30 rounded-full text-sm text-primary font-semibold hover:bg-primary/20 transition-smooth"
              data-ocid="hero-login-btn"
            >
              <Lock className="w-4 h-4" />
              Sign in with Internet Identity to subscribe
            </button>
          )}
        </div>
      </section>

      {/* Active Subscription Banner — shown for logged-in paid subscribers */}
      {isLoggedIn && userProfile && (
        <div className="px-4 max-w-5xl mx-auto">
          <ActiveSubscriptionBanner profile={userProfile} />
        </div>
      )}

      {/* Pricing Cards */}
      <section
        className="px-4 pb-16 max-w-5xl mx-auto"
        data-ocid="pricing-plans"
      >
        {plansLoading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-7 border border-border/40 animate-pulse"
              >
                <div className="w-12 h-12 bg-muted/40 rounded-xl mb-4" />
                <div className="h-6 bg-muted/40 rounded mb-2 w-20" />
                <div className="h-10 bg-muted/40 rounded mb-6 w-32" />
                {[0, 1, 2, 3].map((j) => (
                  <div key={j} className="h-4 bg-muted/40 rounded mb-2" />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {plans.map((plan) => {
              const Icon = PLAN_ICONS[plan.planId] ?? Star;
              const isPopular = plan.planId === "Pro";
              const fullPrice = Number(plan.priceCredits);
              const discountPct = Number(plan.discountPercent);
              const discounted = hasActiveDiscount(plan);
              const effectivePrice = getEffectivePrice(plan);

              return (
                <div
                  key={plan.planId}
                  className={`glass-card rounded-2xl p-7 flex flex-col relative transition-smooth ${
                    isPopular
                      ? "neon-border glow-primary md:-mt-3"
                      : "border-border"
                  }`}
                  data-ocid={`plan-${plan.planId.toLowerCase()}`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full tracking-wider uppercase whitespace-nowrap">
                      Most Popular
                    </div>
                  )}

                  {/* Discount badge */}
                  {discounted && (
                    <div
                      className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-black px-2.5 py-1 rounded-full shadow-[0_0_12px_rgba(168,85,247,0.5)] tracking-wide"
                      data-ocid={`plan-discount-badge-${plan.planId.toLowerCase()}`}
                    >
                      {discountPct}% OFF
                    </div>
                  )}

                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${isPopular ? "bg-primary/20" : "bg-muted/60"}`}
                  >
                    <Icon
                      className={`w-6 h-6 ${isPopular ? "text-primary" : "text-muted-foreground"}`}
                    />
                  </div>

                  <h3 className="font-display text-xl font-bold text-foreground mb-1">
                    {plan.name}
                  </h3>

                  {/* Price display */}
                  <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                    {fullPrice === 0 ? (
                      <span className="text-4xl font-black text-foreground">
                        Free
                      </span>
                    ) : discounted ? (
                      <>
                        <span className="text-xl font-bold line-through text-muted-foreground">
                          {fullPrice.toLocaleString()}
                        </span>
                        <span className="text-4xl font-black text-primary">
                          {effectivePrice.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground text-sm self-end pb-1">
                          credits/month
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-4xl font-black text-foreground">
                          {fullPrice.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          credits/month
                        </span>
                      </>
                    )}
                  </div>

                  {fullPrice > 0 && (
                    <p className="text-xs text-primary/80 font-medium mb-5">
                      Send via IMVU · Admin approval required
                    </p>
                  )}
                  {fullPrice === 0 && <div className="mb-5" />}

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2.5 text-sm text-foreground/80"
                      >
                        <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.planId === "Free" ? (
                    <div
                      className="w-full rounded-xl h-11 bg-muted/30 border border-border flex items-center justify-center text-muted-foreground text-sm font-semibold"
                      data-ocid="plan-free-cta"
                    >
                      Free — No approval needed
                    </div>
                  ) : (
                    <Button
                      data-ocid={`plan-${plan.planId.toLowerCase()}-cta`}
                      onClick={() => handleSubscribe(plan)}
                      className={`w-full rounded-xl h-11 font-semibold transition-smooth ${
                        isPopular
                          ? "bg-primary hover:bg-primary/90 text-primary-foreground glow-primary"
                          : "bg-muted/50 hover:bg-primary hover:text-primary-foreground text-foreground border border-border"
                      }`}
                    >
                      Subscribe with IMVU
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* IMVU Payment Banner */}
      <section className="px-4 pb-14 max-w-5xl mx-auto">
        <div className="glass-card rounded-2xl p-6 border border-primary/20 bg-primary/5 flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
          <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <Send className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-lg font-bold text-foreground mb-1">
              We accept IMVU Credits
            </h3>
            <p className="text-sm text-muted-foreground">
              All subscriptions are paid via IMVU credits. Send your credits to{" "}
              <span className="text-primary font-bold">{imvuRecipient}</span> on
              IMVU, confirm your username, and the admin will approve your plan.
            </p>
          </div>
          <div className="text-center shrink-0">
            <p className="text-xs text-muted-foreground mb-0.5">
              Send credits to
            </p>
            <p className="font-display text-2xl font-black text-gradient-purple">
              {imvuRecipient}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">on IMVU</p>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section
        className="px-4 pb-16 max-w-5xl mx-auto"
        data-ocid="feature-comparison"
      >
        <h2 className="font-display text-2xl font-bold text-foreground text-center mb-8">
          Full Feature Comparison
        </h2>
        <div className="glass-card rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-4 text-muted-foreground font-medium text-sm w-1/2">
                  Feature
                </th>
                {plans.map((p) => (
                  <th
                    key={p.planId}
                    className={`px-4 py-4 text-center text-sm font-bold ${p.planId === "Pro" ? "text-primary" : "text-foreground"}`}
                  >
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURE_COMPARISON.map((row, i) => (
                <tr
                  key={row.feature}
                  className={`border-b border-border/50 ${i % 2 === 0 ? "" : "bg-muted/10"}`}
                >
                  <td className="px-6 py-3.5 text-sm text-foreground/80">
                    {row.feature}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    {renderFeatureCell(row.free)}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    {renderFeatureCell(row.pro)}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    {renderFeatureCell(row.premium)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section
        className="px-4 pb-20 max-w-2xl mx-auto"
        data-ocid="subscribe-faq"
      >
        <h2 className="font-display text-2xl font-bold text-foreground text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, faqIdx) => (
            <div key={item.q} className="glass-card rounded-xl overflow-hidden">
              <button
                type="button"
                data-ocid={`faq-item-${faqIdx}`}
                onClick={() => setOpenFaq(openFaq === faqIdx ? null : faqIdx)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-muted/20 transition-smooth"
              >
                <span className="font-medium text-foreground text-sm">
                  {item.q}
                </span>
                <span
                  className={`text-primary text-xl font-light transition-transform duration-300 ${openFaq === faqIdx ? "rotate-45" : ""}`}
                >
                  +
                </span>
              </button>
              {openFaq === faqIdx && (
                <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-4">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <LoginPromptModal
          onClose={() => setShowLoginPrompt(false)}
          onLogin={() => {
            setShowLoginPrompt(false);
            login();
          }}
        />
      )}

      {/* Checkout Modal */}
      {selectedPlan && !showPending && (
        <CheckoutModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onSuccess={handleSuccess}
          imvuRecipient={imvuRecipient}
          onRequestApproval={handleRequestApproval}
        />
      )}

      {/* Pending Modal */}
      {showPending && (
        <PendingModal
          planName={pendingPlanName}
          onClose={() => setShowPending(false)}
          imvuRecipient={imvuRecipient}
        />
      )}
    </div>
  );
}
