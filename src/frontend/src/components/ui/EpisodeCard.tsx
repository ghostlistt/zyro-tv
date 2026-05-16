import { Link } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { formatDuration, getProgressPercent } from "../../lib/utils";
import type { Episode, WatchHistoryEntry } from "../../types";

interface EpisodeCardProps {
  episode: Episode;
  showId: string;
  watchHistory?: WatchHistoryEntry;
  isActive?: boolean;
}

export function EpisodeCard({
  episode,
  showId,
  watchHistory,
  isActive,
}: EpisodeCardProps) {
  const progress = watchHistory
    ? getProgressPercent(
        watchHistory.progressSeconds,
        watchHistory.totalSeconds,
      )
    : 0;
  const isCompleted = progress === 100;

  return (
    <Link
      to="/watch/$showId/$seasonId/$episodeId"
      params={{ showId, seasonId: episode.seasonId, episodeId: episode.id }}
      className={`group flex gap-3 p-3 rounded-lg border transition-smooth hover:bg-card/80 hover:border-primary/30 ${
        isActive
          ? "bg-primary/10 border-primary/40"
          : "bg-card/40 border-border/40"
      }`}
      data-ocid="episode-card"
    >
      <div className="relative flex-shrink-0 w-32 aspect-video rounded-md overflow-hidden">
        <img
          src={episode.thumbnailUrl}
          alt={episode.title}
          className="w-full h-full object-cover transition-smooth group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth">
          <Play className="w-6 h-6 text-white fill-white" />
        </div>
        {progress > 0 && !isCompleted && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-border/60">
            <div
              className="h-full bg-primary transition-smooth"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        {isCompleted && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/60" />
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-display text-muted-foreground">
            E{episode.episodeNumber}
          </span>
          {isActive && (
            <span className="text-[10px] px-1.5 py-0.5 bg-primary/20 text-primary rounded font-display font-semibold uppercase tracking-wide">
              Playing
            </span>
          )}
        </div>
        <h4 className="font-display font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
          {episode.title}
        </h4>
        <p className="text-xs text-muted-foreground">
          {formatDuration(episode.duration)}
        </p>
      </div>
    </Link>
  );
}
