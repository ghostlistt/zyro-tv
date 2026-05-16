import { Link, useNavigate } from "@tanstack/react-router";
import { Check, Film, Play, Plus, Unlock } from "lucide-react";
import { useState } from "react";
import type { ShowPublic } from "../../backend";
import { useAuthStore } from "../../lib/auth-store";
import type { Show } from "../../types";
import { CategoryBadge } from "./CategoryBadge";

// ShowCard accepts either the backend ShowPublic or the local Show type
export type ShowCardData = ShowPublic | Show;

interface ShowCardProps {
  show: ShowCardData;
  className?: string;
}

function getShowId(show: ShowCardData): string {
  return String(show.id);
}

function getTitle(show: ShowCardData): string {
  return show.title;
}

function getCoverUrl(show: ShowCardData): string | undefined {
  // Backend ShowPublic uses coverImageUrl (plain URL string)
  if ("coverImageUrl" in show && show.coverImageUrl) {
    return show.coverImageUrl;
  }
  // Local Show type uses coverImageUrl too (updated)
  const local = show as Show;
  return local.coverImageUrl || undefined;
}

function getCategory(show: ShowCardData): string {
  return show.category as string;
}

function getIsFree(show: ShowCardData): boolean {
  if ("coverImageUrl" in show) return (show as ShowPublic).isFree;
  const local = show as unknown as Show;
  return local.isFree === true || local.requiresSubscription === "Free";
}

function getIsTrending(show: ShowCardData): boolean {
  if ("coverImageUrl" in show) return false;
  return (show as unknown as Show).isTrending;
}

function getIsExclusive(show: ShowCardData): boolean {
  if ("coverImageUrl" in show) return show.category === "Exclusive";
  return (show as unknown as Show).isExclusive;
}

export function ShowCard({ show, className }: ShowCardProps) {
  const { isInWatchlist, toggleWatchlist, isLoggedIn } = useAuthStore();
  const navigate = useNavigate();
  const id = getShowId(show);
  const inWatchlist = isInWatchlist(id);
  const isFree = getIsFree(show);
  const isTrending = getIsTrending(show);
  const isExclusive = getIsExclusive(show);
  const [imgError, setImgError] = useState(false);

  const coverUrl = getCoverUrl(show);
  const hasImage = !!coverUrl && !imgError;

  function handleWatchlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (isLoggedIn) toggleWatchlist(id);
  }

  function handlePlay(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    void navigate({
      to: "/show/$showId",
      params: { showId: id },
    });
  }

  return (
    <div
      className={`group relative rounded-lg overflow-hidden bg-card border border-border/40 transition-smooth hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(168,85,247,0.25)] hover:border-primary/40 cursor-pointer ${className ?? ""}`}
      data-ocid="show-card"
    >
      <Link to="/show/$showId" params={{ showId: id }} className="block">
        <div className="relative aspect-[2/3] overflow-hidden">
          {hasImage ? (
            <img
              src={coverUrl}
              alt={getTitle(show)}
              className="w-full h-full object-cover transition-smooth group-hover:scale-105"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/10 via-muted/30 to-background flex items-center justify-center">
              <Film className="w-10 h-10 text-muted-foreground/40" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />

          {/* Play button on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth">
            <button
              type="button"
              onClick={handlePlay}
              className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.6)] hover:bg-primary transition-smooth"
              aria-label={`Play ${getTitle(show)}`}
            >
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            </button>
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isExclusive && (
              <span className="px-1.5 py-0.5 text-[10px] font-display font-bold bg-primary text-primary-foreground rounded uppercase tracking-wider">
                Exclusive
              </span>
            )}
            {isTrending && (
              <span className="px-1.5 py-0.5 text-[10px] font-display font-bold bg-amber-500/90 text-black rounded uppercase tracking-wider">
                Trending
              </span>
            )}
            {isFree && (
              <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-display font-bold bg-emerald-500/90 text-black rounded uppercase tracking-wider">
                <Unlock className="w-2.5 h-2.5" />
                Free
              </span>
            )}
          </div>

          {/* Watchlist button */}
          <button
            type="button"
            onClick={handleWatchlist}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-border/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth hover:bg-primary/80 hover:border-primary"
            aria-label={
              inWatchlist ? "Remove from watchlist" : "Add to watchlist"
            }
          >
            {inWatchlist ? (
              <Check className="w-4 h-4 text-primary" />
            ) : (
              <Plus className="w-4 h-4 text-foreground" />
            )}
          </button>
        </div>

        <div className="p-3 space-y-1.5">
          <h3 className="font-display font-semibold text-sm text-foreground truncate leading-tight group-hover:text-primary transition-colors">
            {getTitle(show)}
          </h3>
          <CategoryBadge category={getCategory(show)} />
          {isFree && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="text-emerald-400 font-semibold">Free</span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
