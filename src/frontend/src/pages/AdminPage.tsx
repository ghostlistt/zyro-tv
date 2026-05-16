import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Clock,
  DollarSign,
  Flag,
  RotateCcw,
  ShieldCheck,
  TrendingUp,
  Tv,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createActor } from "../backend";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { useAdminStore } from "../lib/admin-store";

export type AdminTab =
  | "Overview"
  | "Videos"
  | "Users"
  | "Analytics"
  | "Subscriptions";

const ADMIN_TABS: AdminTab[] = [
  "Overview",
  "Videos",
  "Users",
  "Analytics",
  "Subscriptions",
];

interface AdminNavProps {
  active: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  pendingCount?: number;
}

export function AdminNav({
  active,
  onTabChange,
  pendingCount = 0,
}: AdminNavProps) {
  return (
    <div
      className="flex flex-wrap gap-1 mb-8 glass-card rounded-xl p-1.5"
      data-ocid="admin-nav"
    >
      {ADMIN_TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onTabChange(tab)}
          className={`relative px-4 py-2.5 rounded-lg text-sm font-medium transition-smooth ${
            active === tab
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
          data-ocid={`admin-nav-${tab.toLowerCase()}`}
        >
          {tab}
          {tab === "Subscriptions" && pendingCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-background text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {pendingCount > 9 ? "9+" : pendingCount}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

interface AdminPageProps {
  onTabChange: (tab: AdminTab) => void;
}

export default function AdminPage({ onTabChange }: AdminPageProps) {
  const { isAdminAuthenticated } = useAdminStore();
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [resetOpen, setResetOpen] = useState(false);

  const { data: pendingApprovals } = useQuery({
    queryKey: ["pendingApprovals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminListPendingSubscriptions();
    },
    enabled: !!actor && !actorFetching && isAdminAuthenticated,
    refetchInterval: 10_000,
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.adminGetAnalytics();
    },
    enabled: !!actor && !actorFetching && isAdminAuthenticated,
    refetchInterval: 10_000,
  });

  const resetMutation = useMutation({
    mutationFn: async () => {
      if (!actor)
        throw new Error(
          "Not connected to backend. Please refresh and try again.",
        );
      const ok = await actor.adminResetAnalytics();
      if (!ok) throw new Error("Reset was not confirmed by the server.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
      toast.success("Overview stats have been reset successfully");
      setResetOpen(false);
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error ? err.message : "Failed to reset overview stats.";
      toast.error(msg);
      setResetOpen(false);
    },
  });

  if (!isAdminAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
        <ShieldCheck className="w-16 h-16 text-primary mb-6" />
        <h1 className="font-display font-black text-2xl text-foreground mb-3">
          Admin Access Required
        </h1>
        <p className="text-muted-foreground">
          Click the <strong>shield icon</strong> in the header and enter your
          admin password.
        </p>
      </div>
    );
  }

  const pendingCount = pendingApprovals?.length ?? 0;
  const totalUsers = analytics ? Number(analytics.totalUsers) : null;
  const activeSubscribers = analytics
    ? Number(analytics.proSubscribers) + Number(analytics.premiumSubscribers)
    : null;
  const totalShows = analytics ? Number(analytics.totalShows) : null;

  const stats = [
    {
      label: "Total Users",
      value: totalUsers,
      icon: Users,
      change: "+12.4%",
      sub: "Registered accounts",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Active Subscribers",
      value: activeSubscribers,
      icon: TrendingUp,
      change: "+8.7%",
      sub: "Pro · Premium",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Total Shows",
      value: totalShows,
      icon: Tv,
      change: "Live catalog",
      sub: "All uploaded shows",
      color: "text-amber-400",
      bg: "bg-amber-400/10",
    },
    {
      label: "Pending Subs",
      value: pendingCount,
      icon: DollarSign,
      change: "Need review",
      sub: "subscription requests",
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
  ];

  const quickActions = [
    {
      label: "Pending Subscriptions",
      count: pendingCount,
      tab: "Subscriptions" as AdminTab,
      icon: DollarSign,
      urgent: pendingCount > 0,
    },
    {
      label: "Flagged Videos",
      count: 0,
      tab: "Videos" as AdminTab,
      icon: Flag,
      urgent: false,
    },
    {
      label: "Pending Shows",
      count: 0,
      tab: "Videos" as AdminTab,
      icon: Tv,
      urgent: false,
    },
    {
      label: "Manage Users",
      count: 0,
      tab: "Users" as AdminTab,
      icon: Users,
      urgent: false,
    },
  ];

  return (
    <div
      className="min-h-[60vh] bg-background px-4 md:px-6 py-6 max-w-7xl mx-auto"
      data-ocid="admin-page"
    >
      <AdminNav
        active="Overview"
        onTabChange={onTabChange}
        pendingCount={pendingCount}
      />

      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-1">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, Admin. Here's what's happening on Zyro TV.
          </p>
        </div>

        <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              className="flex items-center gap-2 shadow-[0_0_16px_rgba(239,68,68,0.2)] hover:shadow-[0_0_24px_rgba(239,68,68,0.4)] transition-all shrink-0"
              data-ocid="overview.open_modal_button"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Overview
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent
            className="glass-card border-destructive/30"
            data-ocid="overview.dialog"
          >
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 font-display text-foreground">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                Reset Overview Stats?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                This will clear{" "}
                <strong className="text-foreground">
                  all view counts, likes, and watch history
                </strong>{" "}
                across the entire platform. User accounts and subscription tiers
                will not be affected.{" "}
                <span className="text-destructive font-semibold">
                  This cannot be undone.
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                data-ocid="overview.cancel_button"
                disabled={resetMutation.isPending}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                data-ocid="overview.confirm_button"
                disabled={resetMutation.isPending}
                onClick={(e) => {
                  e.preventDefault();
                  resetMutation.mutate();
                }}
              >
                {resetMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-destructive-foreground/30 border-t-destructive-foreground rounded-full animate-spin" />
                    Resetting…
                  </span>
                ) : (
                  "Yes, Reset Everything"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Pending alert banner */}
      {pendingCount > 0 && (
        <button
          type="button"
          onClick={() => onTabChange("Subscriptions")}
          className="w-full mb-6 flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/15 transition-smooth text-left"
          data-ocid="pending-alert-banner"
        >
          <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-400">
              {pendingCount} pending subscription{" "}
              {pendingCount === 1 ? "request" : "requests"} waiting for your
              approval
            </p>
            <p className="text-xs text-muted-foreground">
              Click to review and approve or reject
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-amber-400 shrink-0" />
        </button>
      )}

      {/* Stats Row */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        data-ocid="admin-stats"
      >
        {stats.map((s) => (
          <div
            key={s.label}
            className="glass-card rounded-xl p-5"
            data-ocid={`stat-${s.label.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}
              >
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-medium ${s.color}`}
              >
                <ArrowUpRight className="w-3 h-3" />
                {s.change}
              </div>
            </div>
            {analyticsLoading && s.label !== "Pending Subs" ? (
              <>
                <Skeleton className="h-8 w-20 mb-1" />
                <Skeleton className="h-3 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
              </>
            ) : (
              <>
                <p className="font-display text-3xl font-black text-foreground mb-0.5">
                  {s.value !== null ? s.value.toLocaleString() : "0"}
                </p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">
                  {s.sub}
                </p>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="glass-card rounded-xl p-6" data-ocid="quick-actions">
          <h2 className="font-display text-lg font-bold text-foreground mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => onTabChange(action.tab)}
                className={`flex items-center justify-between p-4 rounded-xl transition-smooth group w-full text-left ${
                  action.urgent
                    ? "bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20"
                    : "bg-muted/20 hover:bg-muted/40"
                }`}
                data-ocid={`quick-action-${action.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      action.urgent ? "bg-amber-500/20" : "bg-muted/60"
                    }`}
                  >
                    <action.icon
                      className={`w-5 h-5 ${action.urgent ? "text-amber-400" : "text-primary"}`}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {action.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {action.count > 0 && (
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        action.urgent
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-primary/20 text-primary"
                      }`}
                    >
                      {action.count}
                    </span>
                  )}
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-smooth" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card rounded-xl p-6" data-ocid="recent-activity">
          <h2 className="font-display text-lg font-bold text-foreground mb-4">
            Recent Activity
          </h2>
          <div
            className="flex flex-col items-center justify-center py-10 text-center"
            data-ocid="recent-activity.empty_state"
          >
            <Clock className="w-10 h-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No recent activity</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Activity will appear here as users interact with the platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
