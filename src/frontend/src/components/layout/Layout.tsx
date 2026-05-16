import { Link } from "@tanstack/react-router";
import { LogOut, X, Zap } from "lucide-react";
import { Suspense, lazy, useState } from "react";
import { useAdminStore } from "../../lib/admin-store";
import type { AdminTab } from "../../pages/AdminPage";
import { Header } from "./Header";

const AdminPage = lazy(() => import("../../pages/AdminPage"));
const AdminVideosPage = lazy(() => import("../../pages/AdminVideosPage"));
const AdminUsersPage = lazy(() => import("../../pages/AdminUsersPage"));
const AdminAnalyticsPage = lazy(() => import("../../pages/AdminAnalyticsPage"));
const AdminSubscriptionsPage = lazy(
  () => import("../../pages/AdminSubscriptionsPage"),
);

interface LayoutProps {
  children: React.ReactNode;
}

function AdminPanelOverlay({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<AdminTab>("Overview");
  const { logoutAdmin } = useAdminStore();

  function handleTabChange(tab: AdminTab) {
    setActiveTab(tab);
  }

  function handleClose() {
    onClose();
  }

  const tabContent = {
    Overview: <AdminPage onTabChange={handleTabChange} />,
    Videos: <AdminVideosPage onTabChange={handleTabChange} />,
    Users: <AdminUsersPage onTabChange={handleTabChange} />,
    Analytics: <AdminAnalyticsPage onTabChange={handleTabChange} />,
    Subscriptions: <AdminSubscriptionsPage onTabChange={handleTabChange} />,
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex flex-col bg-background/95 backdrop-blur-md overflow-hidden"
      data-ocid="admin-panel-overlay"
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-card border-b border-border/60 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.5)]">
            <Zap className="w-3.5 h-3.5 text-white fill-white" />
          </div>
          <span className="font-display font-bold text-base text-foreground">
            <span className="text-primary">Zyro</span> TV
          </span>
          <span className="text-muted-foreground/40 text-sm mx-1">·</span>
          <span className="text-sm font-display font-semibold text-primary">
            Admin Panel
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              logoutAdmin();
              handleClose();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth"
            data-ocid="admin-logout-btn"
          >
            <LogOut className="w-3.5 h-3.5" />
            Exit Admin
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth"
            aria-label="Close admin panel"
            data-ocid="admin-panel-close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Panel Body */}
      <div className="flex-1 overflow-y-auto">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          }
        >
          {tabContent[activeTab]}
        </Suspense>
      </div>
    </div>
  );
}

export function Layout({ children }: LayoutProps) {
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onOpenAdminPanel={() => setAdminPanelOpen(true)} />

      {/* Full-width main — no sidebar offset */}
      <main
        className="flex-1 pt-16 min-h-[calc(100vh-4rem)] overflow-x-hidden"
        data-ocid="main-content"
      >
        <div className="min-h-full flex flex-col">
          <div className="flex-1">{children}</div>

          <footer className="bg-card/40 border-t border-border/40 mt-auto">
            <div className="max-w-screen-xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
                  <Zap className="w-3 h-3 text-white fill-white" />
                </div>
                <span className="font-display font-bold text-sm text-foreground">
                  <span className="text-primary">Zyro</span> TV
                </span>
              </div>

              <nav className="flex gap-6 text-xs text-muted-foreground">
                <Link
                  to="/"
                  className="hover:text-foreground transition-smooth"
                >
                  Home
                </Link>
                <Link
                  to="/browse"
                  className="hover:text-foreground transition-smooth"
                >
                  Browse
                </Link>
                <Link
                  to="/subscribe"
                  className="hover:text-foreground transition-smooth"
                >
                  Plans
                </Link>
              </nav>

              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} Zyro TV. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </main>

      {adminPanelOpen && (
        <AdminPanelOverlay onClose={() => setAdminPanelOpen(false)} />
      )}
    </div>
  );
}
