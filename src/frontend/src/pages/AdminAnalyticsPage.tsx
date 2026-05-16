import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  DollarSign,
  Film,
  RotateCcw,
  TrendingUp,
  Trophy,
  Users,
  Video,
} from "lucide-react";
import { useState } from "react";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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
import { AdminNav, type AdminTab } from "./AdminPage";

const tooltipStyle = {
  backgroundColor: "#1a1625",
  border: "1px solid #3d3555",
  borderRadius: "10px",
  color: "#e5e7eb",
  fontSize: "12px",
};

const axisColor = "#6b7280";
const gridColor = "#28253a";

function MetricCard({
  icon: Icon,
  label,
  value,
  sub,
  iconColor,
  iconBg,
  loading,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
  iconColor: string;
  iconBg: string;
  loading?: boolean;
}) {
  return (
    <div
      className="glass-card rounded-xl p-5"
      data-ocid={`metric-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div
        className={`w-10 h-10 rounded-lg mb-4 flex items-center justify-center ${iconBg}`}
      >
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      {loading ? (
        <>
          <Skeleton className="h-8 w-20 mb-1" />
          <Skeleton className="h-3 w-24 mb-1" />
          <Skeleton className="h-3 w-16" />
        </>
      ) : (
        <>
          <p className="font-display text-3xl font-black text-foreground mb-0.5">
            {value}
          </p>
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
          <p className="text-xs text-muted-foreground/60 mt-0.5">{sub}</p>
        </>
      )}
    </div>
  );
}

function formatNum(n: bigint): string {
  const num = Number(n);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toLocaleString();
}

export default function AdminAnalyticsPage({
  onTabChange,
}: { onTabChange: (tab: AdminTab) => void }) {
  const { isAdminAuthenticated } = useAdminStore();
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [resetOpen, setResetOpen] = useState(false);

  const { data: analytics, isLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.adminGetAnalytics();
    },
    enabled: !!actor && !actorFetching && isAdminAuthenticated,
  });

  const resetMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const ok = await actor.adminResetAnalytics();
      if (!ok) throw new Error("Reset returned false");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
      toast.success("Analytics have been reset successfully");
      setResetOpen(false);
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to reset analytics. Please try again.";
      toast.error(msg);
      setResetOpen(false);
    },
  });

  if (!isAdminAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
        <p className="text-muted-foreground">
          Please authenticate via the Admin button in the header.
        </p>
      </div>
    );
  }

  // Build tier distribution from real data
  const tierDistribution = analytics
    ? [
        {
          name: "Free",
          value: Number(analytics.freeSubscribers),
          color: "#4b5563",
        },
        {
          name: "Pro",
          value: Number(analytics.proSubscribers),
          color: "#a855f7",
        },
        {
          name: "Premium",
          value: Number(analytics.premiumSubscribers),
          color: "#7c3aed",
        },
      ]
    : [
        { name: "Free", value: 0, color: "#4b5563" },
        { name: "Pro", value: 0, color: "#a855f7" },
        { name: "Premium", value: 0, color: "#7c3aed" },
      ];

  // Subscriber growth — backend doesn't store history, show current total as single point
  const subscriberGrowth = analytics
    ? [
        {
          month: "Now",
          subscribers:
            Number(analytics.freeSubscribers) +
            Number(analytics.proSubscribers) +
            Number(analytics.premiumSubscribers),
        },
      ]
    : [{ month: "Now", subscribers: 0 }];

  return (
    <div
      className="bg-background px-4 md:px-6 py-6 max-w-7xl mx-auto"
      data-ocid="admin-analytics-page"
    >
      <AdminNav active="Analytics" onTabChange={onTabChange} />

      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">
            Platform Analytics
          </h1>
          <p className="text-muted-foreground text-sm">
            Live data from backend
          </p>
        </div>

        <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="flex items-center gap-2 shadow-[0_0_16px_rgba(239,68,68,0.25)] hover:shadow-[0_0_24px_rgba(239,68,68,0.45)] transition-all"
              data-ocid="analytics.open_modal_button"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Analytics
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent
            className="glass-card border-destructive/30"
            data-ocid="analytics.dialog"
          >
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 font-display text-foreground">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                Reset All Analytics?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                This will clear{" "}
                <strong className="text-foreground">
                  all view counts, likes, and watch history
                </strong>{" "}
                across the entire platform. Subscriber counts will not be
                affected.{" "}
                <span className="text-destructive font-semibold">
                  This cannot be undone.
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                data-ocid="analytics.cancel_button"
                disabled={resetMutation.isPending}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                data-ocid="analytics.confirm_button"
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

      {/* Row 1 — Metric Cards */}
      <div
        className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
        data-ocid="analytics-metrics"
      >
        <MetricCard
          icon={Users}
          label="Total Users"
          value={analytics ? formatNum(analytics.totalUsers) : "0"}
          sub="Registered accounts"
          iconColor="text-primary"
          iconBg="bg-primary/10"
          loading={isLoading}
        />
        <MetricCard
          icon={Film}
          label="Total Shows"
          value={
            analytics ? Number(analytics.totalShows).toLocaleString() : "0"
          }
          sub="All uploaded shows"
          iconColor="text-emerald-400"
          iconBg="bg-emerald-400/10"
          loading={isLoading}
        />
        <MetricCard
          icon={Video}
          label="Total Episodes"
          value={
            analytics ? Number(analytics.totalEpisodes).toLocaleString() : "0"
          }
          sub="Across all shows"
          iconColor="text-amber-400"
          iconBg="bg-amber-400/10"
          loading={isLoading}
        />
      </div>

      {/* Row 1b — Subscriber tier cards */}
      <div
        className="grid grid-cols-3 gap-4 mb-8"
        data-ocid="analytics-subscriber-tiers"
      >
        <MetricCard
          icon={Users}
          label="Free Subscribers"
          value={analytics ? formatNum(analytics.freeSubscribers) : "0"}
          sub="No paid plan"
          iconColor="text-muted-foreground"
          iconBg="bg-muted/30"
          loading={isLoading}
        />
        <MetricCard
          icon={TrendingUp}
          label="Pro Subscribers"
          value={analytics ? formatNum(analytics.proSubscribers) : "0"}
          sub="Pro tier active"
          iconColor="text-primary"
          iconBg="bg-primary/10"
          loading={isLoading}
        />
        <MetricCard
          icon={DollarSign}
          label="Premium Subscribers"
          value={analytics ? formatNum(analytics.premiumSubscribers) : "0"}
          sub="Premium tier active"
          iconColor="text-violet-400"
          iconBg="bg-violet-400/10"
          loading={isLoading}
        />
      </div>

      {/* Row 2 — Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div
          className="glass-card rounded-xl p-6"
          data-ocid="chart-subscribers"
        >
          <h2 className="font-display text-base font-bold text-foreground mb-1">
            Active Subscribers (Current)
          </h2>
          <p className="text-xs text-muted-foreground mb-6">
            Total paid + free users on the platform right now
          </p>
          {isLoading ? (
            <Skeleton className="w-full h-[240px] rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart
                data={subscriberGrowth}
                margin={{ top: 0, right: 0, left: -10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={gridColor}
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: axisColor, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: axisColor, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) =>
                    v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v.toString()
                  }
                />
                <Tooltip
                  formatter={(value: number) => [
                    value.toLocaleString(),
                    "Subscribers",
                  ]}
                  contentStyle={tooltipStyle}
                />
                <Line
                  type="monotone"
                  dataKey="subscribers"
                  stroke="#a855f7"
                  strokeWidth={2.5}
                  dot={{ fill: "#a855f7", r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "#a855f7" }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Row 3 — Pie + Tier Summary */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div
          className="glass-card rounded-xl p-6"
          data-ocid="chart-tier-distribution"
        >
          <h2 className="font-display text-base font-bold text-foreground mb-6">
            Subscription Tier Distribution
          </h2>
          {isLoading ? (
            <Skeleton className="w-full h-[280px] rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={tierDistribution}
                  cx="50%"
                  cy="48%"
                  innerRadius={65}
                  outerRadius={105}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {tierDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  formatter={(value: string) => (
                    <span style={{ color: "#9ca3af", fontSize: "12px" }}>
                      {value}
                    </span>
                  )}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `${value.toLocaleString()} users`,
                    name,
                  ]}
                  contentStyle={tooltipStyle}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div
          className="glass-card rounded-xl p-6"
          data-ocid="analytics-summary-card"
        >
          <div className="flex items-center gap-2 mb-5">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="font-display text-base font-bold text-foreground">
              Platform Summary
            </h2>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {["a", "b", "c", "d", "e", "f"].map((k) => (
                <Skeleton key={k} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="space-y-0.5">
              <div className="grid grid-cols-2 px-2 pb-3 text-xs text-muted-foreground font-semibold uppercase tracking-wider border-b border-border">
                <span>Metric</span>
                <span className="text-right">Value</span>
              </div>
              {[
                {
                  label: "Total Users",
                  value: analytics
                    ? Number(analytics.totalUsers).toLocaleString()
                    : "0",
                },
                {
                  label: "Total Shows",
                  value: analytics
                    ? Number(analytics.totalShows).toLocaleString()
                    : "0",
                },
                {
                  label: "Total Episodes",
                  value: analytics
                    ? Number(analytics.totalEpisodes).toLocaleString()
                    : "0",
                },
                {
                  label: "Free Accounts",
                  value: analytics
                    ? Number(analytics.freeSubscribers).toLocaleString()
                    : "0",
                },
                {
                  label: "Paid Subscribers",
                  value: analytics
                    ? (
                        Number(analytics.proSubscribers) +
                        Number(analytics.premiumSubscribers)
                      ).toLocaleString()
                    : "0",
                },
              ].map((row, i) => (
                <div
                  key={row.label}
                  className="grid grid-cols-2 px-2 py-2.5 rounded-lg hover:bg-muted/20 transition-smooth items-center"
                  data-ocid={`analytics-summary-row.${i + 1}`}
                >
                  <span className="text-sm text-muted-foreground">
                    {row.label}
                  </span>
                  <span className="text-right text-sm font-mono font-bold text-foreground">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
