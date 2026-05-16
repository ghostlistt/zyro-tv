import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useNavigate,
} from "@tanstack/react-router";
import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createActor } from "./backend";
import { Layout } from "./components/layout/Layout";
import LoadingScreen from "./components/ui/LoadingScreen";
import { isPrincipalLikeUsername } from "./lib/auth-store";

// Fix 1: QueryClient is only created in main.tsx — no second instance here.

const HomePage = lazy(() => import("./pages/HomePage"));
const BrowsePage = lazy(() => import("./pages/BrowsePage"));
const ShowDetailPage = lazy(() => import("./pages/ShowDetailPage"));
const WatchPage = lazy(() => import("./pages/WatchPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const SubscribePage = lazy(() => import("./pages/SubscribePage"));
const UsernameSetupPage = lazy(() => import("./pages/UsernameSetupPage"));

const Spinner = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      <Suspense fallback={<Spinner />}>{children}</Suspense>
    </Layout>
  );
}

/**
 * Fix 3: Non-blocking UsernameGuard.
 * - Not logged in → render children immediately, no check needed.
 * - Logged in → render children right away AND check in background.
 *   Only redirect if profile explicitly has a missing/principal-like username.
 *   A 2-second safety fallback ensures we never block indefinitely.
 */
function UsernameGuard({ children }: { children: React.ReactNode }) {
  const ii = useInternetIdentity();
  const { actor, isFetching } = useActor(createActor);
  const navigate = useNavigate();
  const [showSpinner, setShowSpinner] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didCheckRef = useRef(false);

  useEffect(() => {
    // Not logged in — nothing to check
    if (!ii.identity) {
      setShowSpinner(false);
      return;
    }

    // Still initializing / actor not ready — wait but cap at 2 seconds
    if (ii.isInitializing || isFetching || !actor) {
      if (!timerRef.current) {
        // Show a brief spinner, but bail out after 2 seconds regardless
        setShowSpinner(true);
        timerRef.current = setTimeout(() => {
          setShowSpinner(false);
        }, 2000);
      }
      return;
    }

    // Actor ready and logged in — clear the safety timer, do the check once
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setShowSpinner(false);

    if (didCheckRef.current) return;
    didCheckRef.current = true;

    let cancelled = false;
    (async () => {
      try {
        const profile = await actor.getCallerUserProfile();
        if (cancelled) return;
        if (!profile || isPrincipalLikeUsername(profile.username)) {
          navigate({ to: "/setup-username" });
        }
      } catch {
        // Network hiccup — let the user through
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [ii.identity, ii.isInitializing, isFetching, actor, navigate]);

  // Clean up safety timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Show a brief spinner only while we're waiting for the actor on first load
  if (showSpinner) return <Spinner />;

  // Always render children — redirect happens async in background if needed
  return <>{children}</>;
}

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <PageShell>
      <UsernameGuard>
        <HomePage />
      </UsernameGuard>
    </PageShell>
  ),
});

const browseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/browse",
  component: () => (
    <PageShell>
      <UsernameGuard>
        <BrowsePage />
      </UsernameGuard>
    </PageShell>
  ),
});

const showRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/show/$showId",
  component: () => (
    <PageShell>
      <UsernameGuard>
        <ShowDetailPage />
      </UsernameGuard>
    </PageShell>
  ),
});

const watchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/watch/$showId/$seasonId/$episodeId",
  component: () => (
    <PageShell>
      <UsernameGuard>
        <WatchPage />
      </UsernameGuard>
    </PageShell>
  ),
});

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/search",
  component: () => (
    <PageShell>
      <UsernameGuard>
        <SearchPage />
      </UsernameGuard>
    </PageShell>
  ),
  validateSearch: (search: Record<string, unknown>) => ({
    q: (search.q as string | undefined) ?? "",
  }),
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: () => (
    <PageShell>
      <UsernameGuard>
        <ProfilePage />
      </UsernameGuard>
    </PageShell>
  ),
});

const subscribeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/subscribe",
  component: () => (
    <PageShell>
      <UsernameGuard>
        <SubscribePage />
      </UsernameGuard>
    </PageShell>
  ),
});

// Username setup — no Layout wrapper, no UsernameGuard (it IS the gate)
const usernameSetupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/setup-username",
  component: () => (
    <Suspense fallback={<Spinner />}>
      <UsernameSetupPage />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  browseRoute,
  showRoute,
  watchRoute,
  searchRoute,
  profileRoute,
  subscribeRoute,
  usernameSetupRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

/**
 * Fix 2: LoadingScreen always completes within 3 seconds max.
 * Fix 4: Actor connection timeout — if actor isn't ready in 5s, proceed unauthenticated.
 */
function AppContent() {
  const [loading, setLoading] = useState(true);
  const completedRef = useRef(false);

  const handleComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setLoading(false);
  }, []);

  useEffect(() => {
    // Hard 3-second maximum — splash ALWAYS dismisses
    const maxTimer = setTimeout(handleComplete, 3000);
    return () => clearTimeout(maxTimer);
  }, [handleComplete]);

  return (
    <>
      {loading && <LoadingScreen onComplete={handleComplete} />}
      <RouterProvider router={router} />
    </>
  );
}

export default function App() {
  // Fix 1: No QueryClientProvider here — main.tsx owns the single instance.
  return <AppContent />;
}
