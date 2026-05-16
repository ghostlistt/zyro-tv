/**
 * auth-store.ts — Internet Identity bridge
 *
 * Provides a stable API that the rest of the app uses unchanged.
 * Real authentication is delegated to useInternetIdentity (core-infrastructure).
 *
 * - login() → triggers II popup
 * - logout() → clears II session
 * - isLoggedIn → true when an II identity is active
 * - currentUser → derived from backend profile (username, tier, role)
 *
 * Watchlist helpers remain as local mirrors of backend state for quick UI
 * updates (they should be reconciled with the backend via useQueries).
 */

import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useCallback } from "react";
import type { UserProfilePublic } from "../backend";
import { SubscriptionTier } from "../types";
import type { UserProfile } from "../types";

export type { UserProfile };

// ---------------------------------------------------------------------------
// Lightweight profile adapter: backend → local UserProfile shape
// ---------------------------------------------------------------------------

export function profileFromBackend(
  bp: UserProfilePublic,
  isAdmin: boolean,
): UserProfile {
  return {
    id: bp.principal.toText(),
    username: bp.username,
    email: "",
    avatarUrl:
      bp.profilePicUrl ??
      `https://api.dicebear.com/9.x/identicon/svg?seed=${bp.principal.toText()}`,
    role: isAdmin ? "admin" : "viewer",
    subscriptionTier:
      (bp.subscriptionTier as unknown as SubscriptionTier) ??
      SubscriptionTier.Free,
    joinedAt: Number(bp.createdAt / BigInt(1_000_000)),
    watchHistory: [],
    watchlist: [],
  };
}

// ---------------------------------------------------------------------------
// Primary auth hook — replaces useAuthStore everywhere
// ---------------------------------------------------------------------------

export interface AuthState {
  /** Internet Identity identity (undefined = not logged in) */
  identity: ReturnType<typeof useInternetIdentity>["identity"];
  isLoggedIn: boolean;
  isInitializing: boolean;
  /** Cached backend profile (populated by pages/components that call getCallerUserProfile) */
  currentUser: UserProfile | null;
  /** Trigger Internet Identity login popup */
  login: () => void;
  /** Alias for login — kept for backward compatibility with Sign In buttons */
  loginAs: (role: "viewer" | "admin") => void;
  /** Clear Internet Identity session */
  logout: () => void;
  /** No-op stubs kept for backward compatibility with pages not yet updated */
  toggleWatchlist: (showId: string) => void;
  isInWatchlist: (showId: string) => boolean;
}

/**
 * Drop-in replacement for the old Zustand useAuthStore.
 * Components that previously called `useAuthStore()` can call `useAuthStore()` unchanged.
 */
export function useAuthStore(): AuthState {
  const ii = useInternetIdentity();

  const isLoggedIn = !!ii.identity && !ii.isInitializing;

  const login = useCallback(() => {
    ii.login();
  }, [ii]);

  const loginAs = useCallback(
    (_role: "viewer" | "admin") => {
      ii.login();
    },
    [ii],
  );

  const logout = useCallback(() => {
    ii.clear();
  }, [ii]);

  // Watchlist stubs — actual watchlist state lives in backend/useQueries.
  // These exist so existing ShowCard/ProfilePage code doesn't break.
  const toggleWatchlist = useCallback((_showId: string) => {
    // handled by backend mutations in useQueries
  }, []);

  const isInWatchlist = useCallback((_showId: string) => false, []);

  return {
    identity: ii.identity,
    isLoggedIn,
    isInitializing: ii.isInitializing,
    currentUser: null, // pages that need profile data use useCallerProfile from useQueries
    login,
    loginAs,
    logout,
    toggleWatchlist,
    isInWatchlist,
  };
}

// ---------------------------------------------------------------------------
// Legacy export for any code that still imports getAllRegisteredUsers
// ---------------------------------------------------------------------------
export function getAllRegisteredUsers(): UserProfile[] {
  return [];
}

// ---------------------------------------------------------------------------
// Username setup detection helpers
// ---------------------------------------------------------------------------

/**
 * Returns true if the given username string looks like a raw Principal
 * (long alphanumeric string with dashes, e.g. "xxxxx-xxxxx-xxxxx-xxxxx-cai").
 * Used to detect first-time login where the username hasn't been set yet.
 */
export function isPrincipalLikeUsername(username: string): boolean {
  // Principals have 5 groups of 5 chars separated by hyphens, length >= 27
  // Example: "aaaaa-bbbbb-ccccc-ddddd-cai" or longer
  if (username.length < 20) return false;
  // Contains only alphanumeric + hyphens (no underscores, spaces, etc.)
  if (!/^[a-z0-9-]+$/.test(username)) return false;
  // Has at least 4 hyphens (5+ groups)
  const parts = username.split("-");
  return parts.length >= 4;
}
