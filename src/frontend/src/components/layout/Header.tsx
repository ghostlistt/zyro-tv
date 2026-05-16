import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  ChevronDown,
  LogIn,
  LogOut,
  Search,
  Shield,
  User,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createActor } from "../../backend";
import { useAdminStore } from "../../lib/admin-store";
import { cn } from "../../lib/utils";
import { AdminPasswordModal } from "../ui/AdminPasswordModal";

interface HeaderProps {
  onOpenAdminPanel: () => void;
}

/** Truncate a long principal string to first 8 chars */
export function shortPrincipal(text: string): string {
  if (text.length <= 12) return text;
  return `${text.slice(0, 8)}…`;
}

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/browse", label: "Browse" },
  { to: "/subscribe", label: "Plans" },
];

export function Header({ onOpenAdminPanel }: HeaderProps) {
  const ii = useInternetIdentity();
  const { isAdminAuthenticated } = useAdminStore();
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isLoggedIn = !!ii.identity && !ii.isInitializing;

  // Fetch backend profile for display name / tier
  const { data: profile } = useQuery({
    queryKey: ["callerProfile", ii.identity?.getPrincipal().toText()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && isLoggedIn,
    staleTime: 1000 * 60 * 5,
  });

  const principalText = ii.identity?.getPrincipal().toText() ?? "";
  const displayName = profile?.username || shortPrincipal(principalText);
  const avatarLetter = displayName.charAt(0).toUpperCase() || "?";
  const avatarUrl = profile?.profilePicUrl;

  // Transparent → solid on scroll
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: "/search", search: { q: searchQuery } });
      setSearchQuery("");
      setSearchOpen(false);
    }
  }

  function handleAdminButtonClick() {
    if (isAdminAuthenticated) {
      onOpenAdminPanel();
    } else {
      setAdminModalOpen(true);
    }
  }

  function handleLogout() {
    ii.clear();
    setUserMenuOpen(false);
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300",
          scrolled
            ? "bg-card/95 backdrop-blur-xl border-b border-border/50 shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
            : "bg-gradient-to-b from-background/90 to-transparent backdrop-blur-sm border-b border-transparent",
        )}
        data-ocid="header"
      >
        <div className="flex items-center h-full px-4 md:px-6 gap-0">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-display font-bold text-xl text-foreground shrink-0 mr-8"
            data-ocid="logo"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)]">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span>
              <span className="text-primary drop-shadow-[0_0_8px_rgba(168,85,247,0.7)]">
                Zyro
              </span>{" "}
              TV
            </span>
          </Link>

          {/* Primary nav links — Hulu style inline */}
          <nav
            className="hidden md:flex items-center gap-1 h-full"
            aria-label="Primary navigation"
          >
            {NAV_LINKS.map(({ to, label }) => {
              const isActive =
                to === "/" ? pathname === "/" : pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to as "/"}
                  className={cn(
                    "relative px-4 h-full flex items-center text-sm font-display font-medium transition-colors duration-200",
                    isActive
                      ? "text-foreground after:absolute after:bottom-0 after:left-4 after:right-4 after:h-[2px] after:bg-primary after:rounded-full after:shadow-[0_0_8px_rgba(168,85,247,0.7)]"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  data-ocid={`nav-${label.toLowerCase()}`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-1 ml-auto">
            {/* Search — icon toggles inline search overlay */}
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search shows..."
                    className="w-52 sm:w-72 pl-9 pr-4 h-9 bg-muted/50 border border-border/60 rounded-full text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-smooth"
                    data-ocid="search-input"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth"
                  aria-label="Close search"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="w-9 h-9 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-smooth"
                aria-label="Open search"
                data-ocid="search-toggle"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Admin button */}
            <button
              type="button"
              onClick={handleAdminButtonClick}
              title={isAdminAuthenticated ? "Open Admin Panel" : "Admin Access"}
              aria-label="Admin access"
              className={cn(
                "w-9 h-9 flex items-center justify-center rounded-full transition-smooth",
                isAdminAuthenticated
                  ? "text-primary hover:bg-primary/15 hover:shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                  : "text-muted-foreground hover:text-primary hover:bg-muted/50",
              )}
              data-ocid="admin-menu-btn"
            >
              <Shield className="w-5 h-5" />
            </button>

            {/* ── Logged in ── */}
            {isLoggedIn ? (
              <div className="relative ml-1" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 pl-1 pr-2 h-9 rounded-full hover:bg-muted/50 transition-smooth"
                  data-ocid="user-menu-btn"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-7 h-7 rounded-full object-cover border border-primary/40"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary text-xs font-bold select-none">
                      {avatarLetter}
                    </div>
                  )}
                  <ChevronDown
                    className={cn(
                      "w-3.5 h-3.5 text-muted-foreground hidden sm:block transition-transform duration-200",
                      userMenuOpen && "rotate-180",
                    )}
                  />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-xl shadow-glass-lg py-1.5 z-50 animate-scale-in">
                    {/* Identity info */}
                    <div className="px-3 py-2.5 border-b border-border">
                      <p className="font-display font-semibold text-sm text-foreground truncate">
                        {displayName}
                      </p>
                      <p
                        className="text-[11px] text-muted-foreground font-mono truncate mt-0.5"
                        title={principalText}
                      >
                        {shortPrincipal(principalText)}
                      </p>
                      {profile?.subscriptionTier && (
                        <span className="inline-block mt-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-primary/15 text-primary capitalize">
                          {String(profile.subscriptionTier)}
                        </span>
                      )}
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/60 transition-smooth"
                      data-ocid="profile-link"
                    >
                      <User className="w-4 h-4" /> Profile
                    </Link>

                    {/* Mobile nav links in dropdown */}
                    <div className="md:hidden border-t border-border/50 mt-1 pt-1">
                      {NAV_LINKS.map(({ to, label }) => (
                        <Link
                          key={to}
                          to={to as "/"}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/60 transition-smooth"
                          data-ocid={`mobile-nav-${label.toLowerCase()}`}
                        >
                          {label}
                        </Link>
                      ))}
                    </div>

                    <div className="border-t border-border/50 mt-1 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleAdminButtonClick();
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted/60 transition-smooth"
                        data-ocid="admin-link"
                      >
                        <Shield className="w-4 h-4 text-primary" /> Admin Panel
                      </button>
                    </div>

                    <div className="border-t border-border mt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-muted/60 transition-smooth"
                        data-ocid="logout-btn"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ── Logged out ── */
              <div className="flex items-center gap-2 ml-1">
                {ii.isInitializing ? (
                  <div className="w-7 h-7 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => ii.login()}
                      className="flex items-center gap-1.5 px-3 h-9 text-sm font-display text-muted-foreground hover:text-foreground transition-smooth"
                      data-ocid="signin-btn"
                    >
                      <LogIn className="w-4 h-4" />
                      <span className="hidden sm:inline">Log In</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => ii.login()}
                      className="px-4 h-9 text-sm font-display font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-smooth"
                      data-ocid="signup-btn"
                    >
                      Start Watching
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {adminModalOpen && (
        <AdminPasswordModal
          onClose={() => setAdminModalOpen(false)}
          onSuccess={onOpenAdminPanel}
        />
      )}
    </>
  );
}
