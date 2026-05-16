import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Minus,
  Percent,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Send,
  Star,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createActor } from "../backend";
import type {
  PendingSubscriptionPublic,
  SubscriptionPlanConfig,
} from "../backend";
import { useAdminStore } from "../lib/admin-store";

import { AdminNav, type AdminTab } from "./AdminPage";

const TIER_COLORS: Record<
  string,
  { badge: string; glow: string; border: string }
> = {
  Free: {
    badge: "bg-muted/40 text-muted-foreground",
    glow: "",
    border: "border-border/60",
  },
  Pro: {
    badge: "bg-primary/15 text-primary",
    glow: "shadow-[0_0_20px_rgba(168,85,247,0.1)]",
    border: "border-primary/30",
  },
  Premium: {
    badge: "bg-amber-500/15 text-amber-400",
    glow: "shadow-[0_0_20px_rgba(251,191,36,0.1)]",
    border: "border-amber-500/30",
  },
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

function principalShort(p: string): string {
  if (p.length <= 14) return p;
  return `${p.slice(0, 8)}…${p.slice(-4)}`;
}

interface LocalPlan extends SubscriptionPlanConfig {
  isPopular: boolean;
}

interface PlanCardProps {
  plan: LocalPlan;
  onUpdateName: (v: string) => void;
  onUpdatePrice: (v: number) => void;
  onUpdateFeature: (i: number, v: string) => void;
  onAddFeature: () => void;
  onRemoveFeature: (i: number) => void;
  onTogglePopular: () => void;
  onUpdateDiscountPercent: (v: number) => void;
  onToggleDiscountActive: () => void;
  changed: boolean;
  imvuRecipient: string;
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
  imvuRecipient,
}: PlanCardProps) {
  const colors = TIER_COLORS[plan.planId] ?? TIER_COLORS.Free;
  const price = Number(plan.priceCredits);
  const discountPercent = Number(plan.discountPercent);
  const discountActive = plan.discountActive;
  const isPaid = plan.planId !== "Free";

  const discountedPrice =
    isPaid && discountActive && discountPercent > 0
      ? Math.round((price * (100 - discountPercent)) / 100)
      : null;

  return (
    <div
      className={`glass-card rounded-2xl p-6 border ${colors.border} ${colors.glow} relative`}
      data-ocid={`plan-card-${plan.planId.toLowerCase()}`}
    >
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-[0_0_12px_rgba(168,85,247,0.4)]">
          Most Popular
        </div>
      )}

      {changed && (
        <div
          className="absolute top-4 right-4 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]"
          title="Unsaved changes"
        />
      )}

      <div className="flex items-center gap-2 mb-4">
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full ${colors.badge}`}
        >
          {plan.planId}
        </span>
        <button
          type="button"
          onClick={onTogglePopular}
          title={plan.isPopular ? "Remove popular badge" : "Mark as popular"}
          aria-label={
            plan.isPopular ? "Remove popular badge" : "Mark as popular"
          }
          className={`ml-auto p-1.5 rounded-lg transition-smooth ${plan.isPopular ? "text-amber-400 hover:bg-amber-400/10" : "text-muted-foreground hover:text-amber-400 hover:bg-muted/40"}`}
          data-ocid={`toggle-popular-${plan.planId.toLowerCase()}`}
        >
          <Star
            className={`w-4 h-4 ${plan.isPopular ? "fill-amber-400" : ""}`}
          />
        </button>
      </div>

      <div className="mb-3">
        <label
          className="block text-xs font-medium text-muted-foreground mb-1.5"
          htmlFor={`plan-name-${plan.planId}`}
        >
          Plan Name
        </label>
        <input
          id={`plan-name-${plan.planId}`}
          type="text"
          value={plan.name}
          onChange={(e) => onUpdateName(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-muted/20 border border-border/50 text-sm font-display font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth"
          data-ocid={`plan-name-input-${plan.planId.toLowerCase()}`}
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-xs font-medium text-muted-foreground mb-1.5"
          htmlFor={`plan-price-${plan.planId}`}
        >
          Price (IMVU Credits / month)
        </label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            id={`plan-price-${plan.planId}`}
            type="number"
            min={0}
            step={1}
            value={price}
            onChange={(e) =>
              onUpdatePrice(
                Math.max(0, Number.parseInt(e.target.value, 10) || 0),
              )
            }
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-muted/20 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth"
            data-ocid={`plan-price-input-${plan.planId.toLowerCase()}`}
          />
        </div>
        {price > 0 && !discountedPrice && (
          <p className="mt-1.5 text-xs text-muted-foreground">
            Send {price.toLocaleString()} credits to{" "}
            <span className="text-primary font-medium">@{imvuRecipient}</span>{" "}
            on IMVU
          </p>
        )}
        {discountedPrice !== null && (
          <p className="mt-1.5 text-xs text-muted-foreground">
            <span className="line-through">{price.toLocaleString()}</span>
            {" → "}
            <span className="text-primary font-semibold">
              {discountedPrice.toLocaleString()} credits
            </span>{" "}
            to{" "}
            <span className="text-primary font-medium">@{imvuRecipient}</span>
          </p>
        )}
      </div>

      {/* Discount section — only for paid plans */}
      {isPaid && (
        <div
          className="mb-5 rounded-xl border border-primary/20 bg-primary/5 p-3.5"
          data-ocid={`discount-section-${plan.planId.toLowerCase()}`}
        >
          <div className="flex items-center gap-1.5 mb-3">
            <Percent className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">Discount</span>
          </div>

          <div className="flex items-end gap-3">
            <div className="flex-1 min-w-0">
              <label
                className="block text-xs font-medium text-muted-foreground mb-1.5"
                htmlFor={`discount-pct-${plan.planId}`}
              >
                Discount %
              </label>
              <div className="relative">
                <input
                  id={`discount-pct-${plan.planId}`}
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  value={discountPercent}
                  onChange={(e) =>
                    onUpdateDiscountPercent(
                      Math.min(
                        100,
                        Math.max(0, Number.parseInt(e.target.value, 10) || 0),
                      ),
                    )
                  }
                  className="w-full pr-8 pl-3 py-2 rounded-lg bg-muted/20 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth"
                  data-ocid={`discount-percent-input-${plan.planId.toLowerCase()}`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                  %
                </span>
              </div>
            </div>

            {/* Toggle */}
            <div className="flex flex-col items-center gap-1.5 shrink-0 pb-0.5">
              <span className="text-xs font-medium text-muted-foreground">
                Active
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={discountActive}
                onClick={onToggleDiscountActive}
                data-ocid={`discount-toggle-${plan.planId.toLowerCase()}`}
                className={`relative w-11 h-6 rounded-full border transition-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  discountActive
                    ? "bg-primary border-primary shadow-[0_0_10px_rgba(168,85,247,0.35)]"
                    : "bg-muted/30 border-border/50"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-background shadow transition-transform duration-200 ${
                    discountActive ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {discountPercent > 0 && discountActive && (
            <p className="mt-2.5 text-xs font-medium text-primary/80">
              Subscribers pay{" "}
              <span className="font-bold text-primary">
                {Math.round(
                  (price * (100 - discountPercent)) / 100,
                ).toLocaleString()}{" "}
                credits
              </span>{" "}
              instead of {price.toLocaleString()}
            </p>
          )}
          {discountPercent > 0 && !discountActive && (
            <p className="mt-2.5 text-xs text-muted-foreground/60">
              Discount configured but not active
            </p>
          )}
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">
            Features
          </span>
          <button
            type="button"
            onClick={onAddFeature}
            aria-label="Add feature"
            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-smooth"
            data-ocid={`add-feature-${plan.planId.toLowerCase()}`}
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {plan.features.map((feat, i) => (
            <div
              key={`${plan.planId}-feat-${i}`}
              className="flex items-center gap-2"
            >
              <Check className="w-3.5 h-3.5 text-primary shrink-0" />
              <input
                type="text"
                value={feat}
                onChange={(e) => onUpdateFeature(i, e.target.value)}
                className="flex-1 min-w-0 px-2 py-1.5 rounded-lg bg-muted/20 border border-border/40 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth"
                data-ocid={`feature-input-${plan.planId.toLowerCase()}-${i}`}
              />
              <button
                type="button"
                onClick={() => onRemoveFeature(i)}
                aria-label="Remove feature"
                className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth shrink-0"
                data-ocid={`remove-feature-${plan.planId.toLowerCase()}-${i}`}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface PendingApprovalRowProps {
  approval: PendingSubscriptionPublic;
  onApprove: () => void;
  onReject: () => void;
  isProcessing: boolean;
}

function formatDate(ts: bigint): string {
  const ms = Number(ts / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function PendingApprovalRow({
  approval,
  onApprove,
  onReject,
  isProcessing,
}: PendingApprovalRowProps) {
  const principalText = approval.userPrincipal.toText();
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-muted/10 border border-border/40 hover:bg-muted/20 transition-smooth"
      data-ocid={`pending-row-${principalText.slice(0, 8)}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5 text-amber-400" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {approval.username || principalShort(principalText)}
          </p>
          <p
            className="text-xs font-mono text-muted-foreground truncate"
            title={principalText}
          >
            {principalShort(principalText)}
          </p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {approval.planName}
            </span>
            <span className="text-xs text-amber-400 font-medium">
              Pending approval
            </span>
          </div>
          <p className="text-xs text-muted-foreground/70 mt-0.5">
            Requested {formatDate(approval.requestedAt)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {isProcessing ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground px-4 py-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Processing...
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={onApprove}
              aria-label="Approve subscription"
              data-ocid={`approve-btn-${principalText.slice(0, 8)}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/25 transition-smooth"
            >
              <CheckCircle2 className="w-4 h-4" />
              Approve
            </button>
            <button
              type="button"
              onClick={onReject}
              aria-label="Reject subscription"
              data-ocid={`reject-btn-${principalText.slice(0, 8)}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm font-semibold hover:bg-destructive/20 transition-smooth"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </button>
          </>
        )}
      </div>
    </div>
  );
}

type SubTab = "pricing" | "pending";

interface AdminSubscriptionsPageProps {
  onTabChange: (tab: AdminTab) => void;
}

function toLocalPlan(cfg: SubscriptionPlanConfig): LocalPlan {
  return {
    ...cfg,
    isPopular: cfg.planId.toLowerCase() === "pro",
  };
}

type SaveToast =
  | { type: "idle" }
  | { type: "saving" }
  | { type: "saved" }
  | { type: "error"; message: string };

export default function AdminSubscriptionsPage({
  onTabChange,
}: AdminSubscriptionsPageProps) {
  const { isAdminAuthenticated } = useAdminStore();
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  const [subTab, setSubTab] = useState<SubTab>("pending");
  const [localPlans, setLocalPlans] = useState<LocalPlan[]>([]);
  const [recipientInput, setRecipientInput] = useState("ZyroTV");
  const [changedPlanIds, setChangedPlanIds] = useState<Set<string>>(new Set());
  const [recipientChanged, setRecipientChanged] = useState(false);
  const [saveToast, setSaveToast] = useState<SaveToast>({ type: "idle" });
  const [processingPrincipals, setProcessingPrincipals] = useState<Set<string>>(
    new Set(),
  );

  const { data: backendPlans, isLoading: plansLoading } = useQuery({
    queryKey: ["subscriptionPlans"],
    queryFn: async () => {
      if (!actor) return DEFAULT_PLANS;
      return actor.getSubscriptionPlans();
    },
    enabled: !!actor && !actorFetching,
  });

  const { data: backendRecipient, isLoading: recipientLoading } = useQuery({
    queryKey: ["imvuRecipient"],
    queryFn: async () => {
      if (!actor) return "ZyroTV";
      return actor.getImvuRecipient();
    },
    enabled: !!actor && !actorFetching,
  });

  const {
    data: pendingApprovals,
    isLoading: approvalsLoading,
    refetch: refetchApprovals,
    isFetching: approvalsFetching,
  } = useQuery<PendingSubscriptionPublic[]>({
    queryKey: ["pendingApprovals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminListPendingSubscriptions();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 10_000,
  });

  useEffect(() => {
    if (backendPlans && localPlans.length === 0) {
      const plans = backendPlans.length > 0 ? backendPlans : DEFAULT_PLANS;
      setLocalPlans(plans.map(toLocalPlan));
    }
  }, [backendPlans, localPlans.length]);

  useEffect(() => {
    if (backendRecipient && !recipientChanged) {
      setRecipientInput(backendRecipient);
    }
  }, [backendRecipient, recipientChanged]);

  const savePlanMutation = useMutation({
    mutationFn: async (plan: LocalPlan) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.saveSubscriptionPlan(
        plan.planId,
        plan.name,
        plan.priceCredits,
        plan.features.filter(Boolean),
        plan.discountPercent,
        plan.discountActive,
      );
      if (!result) {
        throw new Error(
          `Failed to save plan "${plan.name}" — backend rejected the update`,
        );
      }
      return result;
    },
  });

  const saveRecipientMutation = useMutation({
    mutationFn: async (recipient: string) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.saveImvuRecipient(recipient);
      if (!result) {
        throw new Error(
          "Failed to save IMVU recipient — backend rejected the update",
        );
      }
      return result;
    },
  });

  const setApprovalMutation = useMutation({
    mutationFn: async ({
      principal,
      approve,
    }: {
      principal: PendingSubscriptionPublic["userPrincipal"];
      approve: boolean;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.adminApproveSubscription(principal, approve);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingApprovals"] });
    },
  });

  async function handleApprovalAction(
    approval: PendingSubscriptionPublic,
    approve: boolean,
  ) {
    const principalText = approval.userPrincipal.toText();
    setProcessingPrincipals((prev) => new Set(prev).add(principalText));
    try {
      await setApprovalMutation.mutateAsync({
        principal: approval.userPrincipal,
        approve,
      });
    } finally {
      setProcessingPrincipals((prev) => {
        const next = new Set(prev);
        next.delete(principalText);
        return next;
      });
    }
  }

  function updatePlan(planId: string, patch: Partial<LocalPlan>) {
    setLocalPlans((prev) =>
      prev.map((p) => (p.planId === planId ? { ...p, ...patch } : p)),
    );
    setChangedPlanIds((s) => new Set(s).add(planId));
    setSaveToast({ type: "idle" });
  }

  function updateFeature(planId: string, index: number, value: string) {
    setLocalPlans((prev) =>
      prev.map((p) => {
        if (p.planId !== planId) return p;
        const features = [...p.features];
        features[index] = value;
        return { ...p, features };
      }),
    );
    setChangedPlanIds((s) => new Set(s).add(planId));
    setSaveToast({ type: "idle" });
  }

  function addFeature(planId: string) {
    setLocalPlans((prev) =>
      prev.map((p) =>
        p.planId === planId ? { ...p, features: [...p.features, ""] } : p,
      ),
    );
    setChangedPlanIds((s) => new Set(s).add(planId));
    setSaveToast({ type: "idle" });
  }

  function removeFeature(planId: string, index: number) {
    setLocalPlans((prev) =>
      prev.map((p) => {
        if (p.planId !== planId) return p;
        return { ...p, features: p.features.filter((_, i) => i !== index) };
      }),
    );
    setChangedPlanIds((s) => new Set(s).add(planId));
    setSaveToast({ type: "idle" });
  }

  async function handleSaveAll() {
    setSaveToast({ type: "saving" });
    try {
      const changedPlans = localPlans.filter((p) =>
        changedPlanIds.has(p.planId),
      );

      for (const plan of changedPlans) {
        await savePlanMutation.mutateAsync(plan);
      }

      if (recipientChanged) {
        const trimmed = recipientInput.trim() || "ZyroTV";
        await saveRecipientMutation.mutateAsync(trimmed);
      }

      setChangedPlanIds(new Set());
      setRecipientChanged(false);
      setSaveToast({ type: "saved" });
      queryClient.invalidateQueries({ queryKey: ["subscriptionPlans"] });
      queryClient.invalidateQueries({ queryKey: ["imvuRecipient"] });
      setTimeout(() => setSaveToast({ type: "idle" }), 3000);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to save — please try again";
      setSaveToast({ type: "error", message });
      setTimeout(() => setSaveToast({ type: "idle" }), 5000);
    }
  }

  function handleReset() {
    const plans =
      backendPlans && backendPlans.length > 0 ? backendPlans : DEFAULT_PLANS;
    setLocalPlans(plans.map(toLocalPlan));
    setRecipientInput(backendRecipient ?? "ZyroTV");
    setChangedPlanIds(new Set());
    setRecipientChanged(false);
    setSaveToast({ type: "idle" });
  }

  if (!isAdminAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
        <p className="text-muted-foreground">
          Please authenticate via the Admin button in the header.
        </p>
      </div>
    );
  }

  const isLoading = plansLoading || recipientLoading || actorFetching;
  const displayRecipient = backendRecipient ?? "ZyroTV";
  const pendingList = pendingApprovals ?? [];
  const isSaving = saveToast.type === "saving";

  return (
    <div
      className="bg-background px-4 md:px-6 py-6 max-w-7xl mx-auto"
      data-ocid="admin-subscriptions-page"
    >
      <AdminNav active="Subscriptions" onTabChange={onTabChange} />

      {/* Status toasts */}
      {saveToast.type === "saved" && (
        <div
          className="fixed top-6 right-6 z-50 flex items-center gap-2 glass-card rounded-xl px-5 py-3 text-sm font-medium text-foreground shadow-lg border border-emerald-500/30"
          data-ocid="save-toast"
        >
          <Check className="w-4 h-4 text-emerald-400" />
          Subscription plans saved to server
        </div>
      )}
      {saveToast.type === "error" && (
        <div
          className="fixed top-6 right-6 z-50 flex items-start gap-2 glass-card rounded-xl px-5 py-3 text-sm font-medium text-foreground shadow-lg border border-destructive/30 max-w-sm"
          data-ocid="save-error-toast"
        >
          <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
          <span>{saveToast.message}</span>
          <button
            type="button"
            onClick={() => setSaveToast({ type: "idle" })}
            className="ml-1 p-0.5 hover:text-destructive transition-colors shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Sub-tab switcher */}
      <div
        className="flex items-center gap-2 mb-6 flex-wrap"
        data-ocid="subscriptions-sub-tabs"
      >
        <button
          type="button"
          onClick={() => setSubTab("pending")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-smooth ${
            subTab === "pending"
              ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
          data-ocid="subtab-pending"
        >
          <Clock className="w-4 h-4" />
          Pending Approvals
          {pendingList.length > 0 && (
            <span className="bg-amber-500 text-background text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
              {pendingList.length}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setSubTab("pricing")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-smooth ${
            subTab === "pricing"
              ? "bg-primary/15 text-primary border border-primary/30"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
          data-ocid="subtab-pricing"
        >
          <CreditCard className="w-4 h-4" />
          Plan Pricing
        </button>
      </div>

      {/* ── PENDING APPROVALS TAB ── */}
      {subTab === "pending" && (
        <div data-ocid="pending-approvals-section">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-1">
                Pending Subscriptions
              </h1>
              <p className="text-sm text-muted-foreground">
                Review and approve or reject paid subscription requests.
              </p>
            </div>
            <button
              type="button"
              onClick={() => refetchApprovals()}
              disabled={approvalsFetching}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg glass-card text-sm text-muted-foreground hover:text-foreground transition-smooth disabled:opacity-50"
              data-ocid="refresh-approvals-btn"
              aria-label="Refresh approvals"
            >
              <RefreshCw
                className={`w-4 h-4 ${approvalsFetching ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          {approvalsLoading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-20 glass-card rounded-xl animate-pulse border border-border/40"
                />
              ))}
            </div>
          ) : pendingList.length === 0 ? (
            <div
              className="glass-card rounded-2xl py-20 text-center border border-border/40"
              data-ocid="no-pending-approvals"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-emerald-400" />
              </div>
              <p className="font-display font-semibold text-foreground mb-1">
                All caught up!
              </p>
              <p className="text-sm text-muted-foreground">
                No pending subscription requests at this time.
              </p>
            </div>
          ) : (
            <div className="space-y-3" data-ocid="pending-approvals-list">
              {pendingList.map((approval) => {
                const principalText = approval.userPrincipal.toText();
                const isProcessing = processingPrincipals.has(principalText);
                return (
                  <PendingApprovalRow
                    key={principalText}
                    approval={approval}
                    onApprove={() => handleApprovalAction(approval, true)}
                    onReject={() => handleApprovalAction(approval, false)}
                    isProcessing={isProcessing}
                  />
                );
              })}
            </div>
          )}

          <div className="mt-6 glass-card rounded-xl p-4 border border-border/40 flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Approve requests after verifying the user's IMVU credit payment.
              Approving grants the user immediate access to their selected plan.
              Rejecting removes their pending request.
            </p>
          </div>
        </div>
      )}

      {/* ── PLAN PRICING TAB ── */}
      {subTab === "pricing" && (
        <div data-ocid="pricing-editor-section">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-1">
                Subscription Pricing
              </h1>
              <p className="text-sm text-muted-foreground">
                Changes are saved permanently to the server and persist after
                refresh.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-smooth"
                data-ocid="reset-plans-btn"
              >
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
              <button
                type="button"
                onClick={handleSaveAll}
                disabled={
                  isSaving || (changedPlanIds.size === 0 && !recipientChanged)
                }
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                data-ocid="save-plans-btn"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save All Changes
                  </>
                )}
              </button>
            </div>
          </div>

          {/* IMVU Recipient Setting */}
          <div
            className="glass-card rounded-xl p-5 mb-6 border border-primary/30 bg-primary/5"
            data-ocid="imvu-recipient-card"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                <Send className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-sm text-foreground mb-0.5">
                  IMVU Credits Recipient
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  The IMVU account name subscribers send credits to. Saved to
                  server.
                </p>
                <div className="flex items-center gap-3 max-w-md flex-wrap">
                  <div className="relative flex-1 min-w-[180px]">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm select-none">
                      @
                    </span>
                    <input
                      type="text"
                      value={recipientInput}
                      onChange={(e) => {
                        setRecipientInput(e.target.value);
                        setRecipientChanged(true);
                        setSaveToast({ type: "idle" });
                      }}
                      placeholder="ZyroTV"
                      className="w-full pl-7 pr-3 py-2.5 rounded-lg bg-muted/20 border border-border/60 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-smooth"
                      data-ocid="imvu-recipient-input"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                    <span>Current:</span>
                    <span className="text-primary font-bold">
                      @{displayRecipient}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground/60 mt-2">
                  Hit "Save All Changes" to apply the new recipient across the
                  site.
                </p>
              </div>
            </div>
          </div>

          {/* IMVU Payment info card */}
          <div
            className="glass-card rounded-xl p-5 mb-8 border border-border/50 flex items-start gap-4"
            data-ocid="imvu-info-card"
          >
            <div className="w-10 h-10 rounded-xl bg-muted/40 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-sm text-foreground mb-1">
                IMVU Credits Payment
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Subscribers pay by sending IMVU credits to{" "}
                <span className="text-primary font-semibold">
                  @{displayRecipient}
                </span>
                . After sending, they submit their request which appears under
                "Pending Approvals" for you to review and approve.
              </p>
            </div>
          </div>

          {/* Plans Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="glass-card rounded-2xl p-6 border border-border/40 animate-pulse"
                >
                  <div className="h-4 bg-muted/40 rounded mb-4 w-16" />
                  <div className="h-8 bg-muted/40 rounded mb-3" />
                  <div className="h-10 bg-muted/40 rounded mb-5" />
                  {[0, 1, 2].map((j) => (
                    <div key={j} className="h-8 bg-muted/40 rounded mb-2" />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              data-ocid="plans-grid"
            >
              {localPlans.map((plan) => (
                <PlanCard
                  key={plan.planId}
                  plan={plan}
                  changed={changedPlanIds.has(plan.planId)}
                  imvuRecipient={displayRecipient}
                  onUpdateName={(v) => updatePlan(plan.planId, { name: v })}
                  onUpdatePrice={(v) =>
                    updatePlan(plan.planId, { priceCredits: BigInt(v) })
                  }
                  onUpdateFeature={(i, v) => updateFeature(plan.planId, i, v)}
                  onAddFeature={() => addFeature(plan.planId)}
                  onRemoveFeature={(i) => removeFeature(plan.planId, i)}
                  onTogglePopular={() =>
                    updatePlan(plan.planId, { isPopular: !plan.isPopular })
                  }
                  onUpdateDiscountPercent={(v) =>
                    updatePlan(plan.planId, { discountPercent: BigInt(v) })
                  }
                  onToggleDiscountActive={() =>
                    updatePlan(plan.planId, {
                      discountActive: !plan.discountActive,
                    })
                  }
                />
              ))}
            </div>
          )}

          {/* Preview panel */}
          <div
            className="glass-card rounded-xl p-6 border border-border/50"
            data-ocid="plans-preview"
          >
            <h2 className="font-display text-lg font-bold text-foreground mb-4">
              Subscriber-Facing Preview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {localPlans.map((plan) => {
                const colors = TIER_COLORS[plan.planId] ?? TIER_COLORS.Free;
                const price = Number(plan.priceCredits);
                const discountPercent = Number(plan.discountPercent);
                const discountedPrice =
                  plan.planId !== "Free" &&
                  plan.discountActive &&
                  discountPercent > 0
                    ? Math.round((price * (100 - discountPercent)) / 100)
                    : null;
                return (
                  <div
                    key={plan.planId}
                    className={`rounded-xl p-5 bg-muted/20 border ${colors.border} relative`}
                  >
                    {plan.isPopular && (
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        Popular
                      </div>
                    )}
                    <p className="font-display font-black text-lg text-foreground mb-1">
                      {plan.name}
                    </p>
                    {price === 0 ? (
                      <p className="font-display text-2xl font-black text-foreground mb-0.5">
                        Free
                      </p>
                    ) : discountedPrice !== null ? (
                      <div className="mb-0.5">
                        <span className="text-sm line-through text-muted-foreground mr-1.5">
                          {price.toLocaleString()}
                        </span>
                        <span className="font-display text-2xl font-black text-primary">
                          {discountedPrice.toLocaleString()}
                        </span>
                        <span className="ml-1 text-xs font-bold text-primary bg-primary/15 border border-primary/30 px-1.5 py-0.5 rounded-full">
                          -{discountPercent}%
                        </span>
                      </div>
                    ) : (
                      <p className="font-display text-2xl font-black text-foreground mb-0.5">
                        {price.toLocaleString()} credits
                      </p>
                    )}
                    {price > 0 && (
                      <p className="text-xs text-muted-foreground mb-3">
                        per month on IMVU
                      </p>
                    )}
                    <ul className="mt-3 space-y-1.5">
                      {plan.features.slice(0, 4).map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-1.5 text-xs text-foreground/80"
                        >
                          <Check className="w-3 h-3 text-primary shrink-0" />
                          {f}
                        </li>
                      ))}
                      {plan.features.length > 4 && (
                        <li className="text-xs text-muted-foreground pl-4.5">
                          +{plan.features.length - 4} more
                        </li>
                      )}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
