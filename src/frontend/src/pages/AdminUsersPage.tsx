import { useActor } from "@caffeineai/core-infrastructure";
import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Ban,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  History,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { createActor } from "../backend";
import type { SignupHistoryEntry, UserProfilePublic } from "../backend";
import { useAdminStore } from "../lib/admin-store";
import { isPrincipalLikeUsername } from "../lib/auth-store";
import { SubscriptionTier } from "../types";
import { AdminNav, type AdminTab } from "./AdminPage";

// ── Constants ─────────────────────────────────────────────────────────────────

const TIER_BADGE: Record<string, string> = {
  [SubscriptionTier.Premium]:
    "bg-amber-500/15 text-amber-400 border border-amber-500/20",
  [SubscriptionTier.Pro]: "bg-primary/15 text-primary border border-primary/20",
  [SubscriptionTier.Free]:
    "bg-muted/30 text-muted-foreground border border-border/40",
};

const PAGE_SIZE = 10;

// ── Helpers ───────────────────────────────────────────────────────────────────

function principalShort(p: string): string {
  if (p.length <= 16) return p;
  return `${p.slice(0, 8)}…${p.slice(-4)}`;
}

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts / BigInt(1_000_000));
  const d = new Date(ms);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatExpiryDate(ts: bigint): string {
  const ms = Number(ts / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
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

// ── Sub-components ────────────────────────────────────────────────────────────

const COL_KEYS = ["col-a", "col-b", "col-c", "col-d", "col-e"];

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr className="border-b border-border/50">
      {COL_KEYS.slice(0, cols).map((k) => (
        <td key={k} className="px-4 py-3">
          <div className="h-4 w-24 bg-muted/40 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

function TierBadge({ tier }: { tier: string }) {
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${TIER_BADGE[tier] ?? "bg-muted/30 text-muted-foreground border border-border/40"}`}
    >
      {tier}
    </span>
  );
}

function ExpiryBadge({ expiresAt }: { expiresAt?: bigint }) {
  if (!expiresAt)
    return <span className="text-xs text-muted-foreground/50">—</span>;

  const expired = isExpired(expiresAt);
  const soon = !expired && isExpiringSoon(expiresAt);
  const dateStr = formatExpiryDate(expiresAt);

  if (expired) {
    return (
      <span className="text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full whitespace-nowrap">
        Expired {dateStr}
      </span>
    );
  }
  if (soon) {
    return (
      <span className="text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full whitespace-nowrap">
        Expires {dateStr}
      </span>
    );
  }
  return (
    <span className="text-xs text-muted-foreground whitespace-nowrap">
      Expires {dateStr}
    </span>
  );
}

// ── Remove Subscription Confirm ───────────────────────────────────────────────

function RemoveSubscriptionButton({
  user,
  onRemoved,
}: {
  user: UserProfilePublic;
  onRemoved: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const { actor } = useActor(createActor);

  const removeMutation = useMutation({
    mutationFn: async (principal: Principal) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.adminRemoveSubscription(principal);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      setConfirming(false);
      onRemoved();
    },
  });

  if (confirming) {
    return (
      <div
        className="flex items-center gap-1.5 bg-destructive/10 border border-destructive/30 rounded-lg px-2 py-1"
        data-ocid={`remove-subscription-confirm-${user.principal.toText().slice(0, 8)}`}
      >
        <span className="text-xs text-destructive font-medium whitespace-nowrap">
          Remove?
        </span>
        <button
          type="button"
          onClick={() => removeMutation.mutate(user.principal)}
          disabled={removeMutation.isPending}
          className="text-xs font-bold text-destructive hover:text-red-300 transition-smooth px-1.5 py-0.5 rounded hover:bg-destructive/20 disabled:opacity-50"
          aria-label="Confirm remove subscription"
          data-ocid={`remove-subscription-confirm-btn-${user.principal.toText().slice(0, 8)}`}
        >
          {removeMutation.isPending ? "…" : "Yes"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="text-muted-foreground hover:text-foreground transition-smooth p-0.5 rounded"
          aria-label="Cancel remove"
          data-ocid={`remove-subscription-cancel-btn-${user.principal.toText().slice(0, 8)}`}
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="flex items-center gap-1 p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-smooth"
      title="Remove Subscription"
      aria-label="Remove Subscription"
      data-ocid={`remove-subscription-btn-${user.principal.toText().slice(0, 8)}`}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}

// ── Users Tab ─────────────────────────────────────────────────────────────────

function UsersTab() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [banned, setBanned] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);

  const {
    data: users,
    isLoading,
    refetch,
    isFetching,
  } = useQuery<UserProfilePublic[]>({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminListUsers();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 10_000,
  });

  const allUsers = users ?? [];

  const filtered = useMemo(
    () =>
      allUsers.filter(
        (u) =>
          u.username.toLowerCase().includes(search.toLowerCase()) ||
          u.principal.toText().includes(search),
      ),
    [allUsers, search],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleBan = (id: string) => {
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

  return (
    <>
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="glass-card rounded-xl px-4 py-2.5 border border-border/50 flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground leading-none">
                Total Users
              </p>
              {isLoading ? (
                <div className="h-5 w-8 bg-muted/40 rounded animate-pulse mt-0.5" />
              ) : (
                <p className="text-base font-bold text-foreground leading-none mt-0.5">
                  {allUsers.length.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
        <button
          type="button"
          data-ocid="refresh-users-btn"
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg glass-card text-sm text-muted-foreground hover:text-foreground transition-smooth disabled:opacity-50"
          aria-label="Refresh users"
        >
          <RefreshCw
            className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md" data-ocid="user-search">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          className="w-full bg-muted/30 border border-input rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-smooth"
          placeholder="Search by username or principal..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Table */}
      <div
        className="glass-card rounded-xl overflow-hidden mb-6"
        data-ocid="users-table"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/10">
                <th className="text-left px-4 py-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  User
                </th>
                <th className="text-left px-4 py-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider hidden sm:table-cell">
                  Principal
                </th>
                <th className="text-left px-4 py-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider hidden md:table-cell">
                  Plan
                </th>
                <th className="text-left px-4 py-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider hidden lg:table-cell">
                  Expiry
                </th>
                <th className="text-left px-4 py-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider hidden xl:table-cell">
                  Registered
                </th>
                <th className="text-right px-4 py-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? ["sk0", "sk1", "sk2", "sk3", "sk4"].map((sk) => (
                    <tr key={sk} className="border-b border-border/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-muted/40 animate-pulse" />
                          <div className="h-4 w-28 bg-muted/40 rounded animate-pulse" />
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <div className="h-4 w-20 bg-muted/40 rounded animate-pulse" />
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="h-4 w-14 bg-muted/40 rounded animate-pulse" />
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="h-4 w-20 bg-muted/40 rounded animate-pulse" />
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell">
                        <div className="h-4 w-20 bg-muted/40 rounded animate-pulse" />
                      </td>
                      <td className="px-4 py-3" />
                    </tr>
                  ))
                : paged.map((user, i) => {
                    const principalStr = user.principal.toText();
                    const isBanned = banned.has(principalStr);
                    const tier = user.subscriptionTier as string;
                    const isPending = isPrincipalLikeUsername(user.username);
                    const isPaid =
                      tier === SubscriptionTier.Pro ||
                      tier === SubscriptionTier.Premium;
                    return (
                      <tr
                        key={principalStr}
                        className={`border-b border-border/50 ${i % 2 === 0 ? "" : "bg-muted/5"} ${isBanned ? "opacity-50" : ""}`}
                        data-ocid={`user-row-${principalStr.slice(0, 8)}`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                              {isPending
                                ? "?"
                                : user.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {isPending ? (
                                  <span className="text-muted-foreground italic">
                                    Pending setup
                                  </span>
                                ) : (
                                  user.username
                                )}
                              </p>
                              {isBanned && (
                                <span className="text-xs text-destructive">
                                  Banned
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground font-mono hidden sm:table-cell">
                          <span title={principalStr}>
                            {principalShort(principalStr)}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <TierBadge tier={tier} />
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <ExpiryBadge expiresAt={user.subscriptionExpiresAt} />
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap hidden xl:table-cell">
                          {formatTimestamp(user.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              data-ocid={`view-user-${i}`}
                              className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-smooth"
                              title="View Profile"
                              aria-label="View Profile"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                            {isPaid && (
                              <RemoveSubscriptionButton
                                user={user}
                                onRemoved={handleSubscriptionRemoved}
                              />
                            )}
                            <button
                              type="button"
                              data-ocid={`ban-user-${i}`}
                              onClick={() => toggleBan(principalStr)}
                              className={`p-1.5 rounded-lg transition-smooth ${
                                isBanned
                                  ? "text-emerald-400 hover:bg-emerald-500/10"
                                  : "text-muted-foreground hover:bg-muted/50"
                              }`}
                              title={isBanned ? "Unban User" : "Ban User"}
                              aria-label={isBanned ? "Unban User" : "Ban User"}
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
        {!isLoading && paged.length === 0 && (
          <div
            className="py-16 text-center text-muted-foreground"
            data-ocid="no-users"
          >
            {search
              ? "No users match your search."
              : "No registered users yet."}
          </div>
        )}
      </div>

      {/* Legend */}
      {!isLoading && allUsers.length > 0 && (
        <div className="flex items-center gap-4 flex-wrap text-xs text-muted-foreground mb-6">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span>
              Paid subscribers have a "Remove Subscription" button (trash icon)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-red-400 font-medium">Red date</span>
            <span>= expired</span>
            <span className="text-amber-400 font-medium ml-2">Yellow date</span>
            <span>= expiring within 7 days</span>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && filtered.length > 0 && (
        <div
          className="flex items-center justify-between"
          data-ocid="users-pagination"
        >
          <p className="text-sm text-muted-foreground">
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–
            {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}{" "}
            users
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-ocid="pagination-prev"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg glass-card disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted/50 transition-smooth"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from(
              { length: Math.min(totalPages, 7) },
              (_, i) => i + 1,
            ).map((p) => (
              <button
                key={p}
                type="button"
                data-ocid={`page-${p}`}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-smooth ${
                  p === page
                    ? "bg-primary text-primary-foreground"
                    : "glass-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              data-ocid="pagination-next"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg glass-card disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted/50 transition-smooth"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ── Signup History Tab ────────────────────────────────────────────────────────

function SignupHistoryTab() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const [historyPage, setHistoryPage] = useState(1);

  const {
    data: history,
    isLoading,
    refetch,
    isFetching,
  } = useQuery<SignupHistoryEntry[]>({
    queryKey: ["adminSignupHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminGetSignupHistory();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 10_000,
  });

  const allEntries = history ?? [];
  const totalPages = Math.max(1, Math.ceil(allEntries.length / PAGE_SIZE));
  const paged = allEntries.slice(
    (historyPage - 1) * PAGE_SIZE,
    historyPage * PAGE_SIZE,
  );

  return (
    <>
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="glass-card rounded-xl px-4 py-2.5 border border-border/50 flex items-center gap-2">
            <History className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground leading-none">
                Total Registered
              </p>
              {isLoading ? (
                <div className="h-5 w-8 bg-muted/40 rounded animate-pulse mt-0.5" />
              ) : (
                <p className="text-base font-bold text-foreground leading-none mt-0.5">
                  {allEntries.length.toLocaleString()} accounts
                </p>
              )}
            </div>
          </div>
        </div>
        <button
          type="button"
          data-ocid="refresh-history-btn"
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg glass-card text-sm text-muted-foreground hover:text-foreground transition-smooth disabled:opacity-50"
          aria-label="Refresh signup history"
        >
          <RefreshCw
            className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Info banner */}
      <div className="flex items-center gap-2 mb-5 px-4 py-3 rounded-xl bg-primary/5 border border-primary/15 text-sm text-muted-foreground">
        <Clock className="w-4 h-4 text-primary shrink-0" />
        <span>
          Complete account registration history — newest signups first.
          Read-only.
        </span>
      </div>

      {/* Table */}
      <div
        className="glass-card rounded-xl overflow-hidden mb-6"
        data-ocid="signup-history-table"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/10">
                <th className="text-left px-4 py-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  Signup Date
                </th>
                <th className="text-left px-4 py-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  Username
                </th>
                <th className="text-left px-4 py-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider hidden md:table-cell">
                  Plan / Tier
                </th>
                <th className="text-left px-4 py-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider hidden sm:table-cell">
                  Principal
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? ["h0", "h1", "h2", "h3", "h4"].map((sk) => (
                    <SkeletonRow key={sk} cols={4} />
                  ))
                : paged.map((entry, i) => {
                    const isPending = isPrincipalLikeUsername(entry.username);
                    return (
                      <tr
                        key={`${entry.principal}-${entry.signedUpAt.toString()}`}
                        className={`border-b border-border/50 ${i % 2 === 0 ? "" : "bg-muted/5"}`}
                        data-ocid={`history-row-${i + 1}`}
                      >
                        <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                            {formatTimestamp(entry.signedUpAt)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                              {isPending
                                ? "?"
                                : entry.username.charAt(0).toUpperCase()}
                            </div>
                            {isPending ? (
                              <span className="text-sm text-muted-foreground italic">
                                Pending setup
                              </span>
                            ) : (
                              <span className="text-sm font-medium text-foreground">
                                {entry.username}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <TierBadge tier={entry.currentTier} />
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground font-mono hidden sm:table-cell">
                          <span title={entry.principal}>
                            {principalShort(entry.principal)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
        {!isLoading && allEntries.length === 0 && (
          <div
            className="py-16 text-center text-muted-foreground"
            data-ocid="signup-history-empty_state"
          >
            No signup history yet. Users will appear here as they register.
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && allEntries.length > PAGE_SIZE && (
        <div
          className="flex items-center justify-between"
          data-ocid="history-pagination"
        >
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            {Math.min((historyPage - 1) * PAGE_SIZE + 1, allEntries.length)}–
            {Math.min(historyPage * PAGE_SIZE, allEntries.length)} of{" "}
            {allEntries.length} accounts
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-ocid="history-pagination-prev"
              onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
              disabled={historyPage === 1}
              className="p-2 rounded-lg glass-card disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted/50 transition-smooth"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from(
              { length: Math.min(totalPages, 7) },
              (_, i) => i + 1,
            ).map((p) => (
              <button
                key={p}
                type="button"
                data-ocid={`history-page-${p}`}
                onClick={() => setHistoryPage(p)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-smooth ${
                  p === historyPage
                    ? "bg-primary text-primary-foreground"
                    : "glass-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              data-ocid="history-pagination-next"
              onClick={() => setHistoryPage((p) => Math.min(totalPages, p + 1))}
              disabled={historyPage === totalPages}
              className="p-2 rounded-lg glass-card disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted/50 transition-smooth"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

type InnerTab = "users" | "history";

export default function AdminUsersPage({
  onTabChange,
}: { onTabChange: (tab: AdminTab) => void }) {
  const { isAdminAuthenticated } = useAdminStore();
  const [innerTab, setInnerTab] = useState<InnerTab>("users");

  if (!isAdminAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
        <p className="text-muted-foreground">
          Please authenticate via the Admin button in the header.
        </p>
      </div>
    );
  }

  return (
    <div
      className="bg-background px-4 md:px-6 py-6 max-w-7xl mx-auto"
      data-ocid="admin-users-page"
    >
      <AdminNav active="Users" onTabChange={onTabChange} />

      {/* Page title */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">
          User Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Live user registry and full signup history — updates every 10 seconds.
          Remove subscriptions to revert users to the free tier.
        </p>
      </div>

      {/* Inner tab switcher */}
      <div
        className="flex items-center gap-1 p-1 rounded-xl bg-muted/20 border border-border/40 mb-6 w-fit"
        data-ocid="users-inner-tabs"
      >
        <button
          type="button"
          data-ocid="users-tab"
          onClick={() => setInnerTab("users")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
            innerTab === "users"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="w-4 h-4" />
          Active Users
        </button>
        <button
          type="button"
          data-ocid="signup-history-tab"
          onClick={() => setInnerTab("history")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
            innerTab === "history"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <History className="w-4 h-4" />
          Signup History
        </button>
      </div>

      {/* Tab content */}
      {innerTab === "users" ? <UsersTab /> : <SignupHistoryTab />}
    </div>
  );
}
