import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  BookmarkPlus,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Film,
  Flame,
  Play,
  Sparkles,
  Star,
  Tv,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createActor } from "../backend";
import type { ShowPublic } from "../backend";
import { Button } from "../components/ui/ZyroButton";
import { useAuthStore } from "../lib/auth-store";
import { hexToImageSrc } from "../utils/image";

// ─── Landscape Card (Hulu-style 16:9) ───────────────────────────────────────

function LandscapeCard({
  show,
  index,
}: {
  show: ShowPublic;
  index?: number;
}) {
  const coverSrc = hexToImageSrc(show.coverImageUrl);
  return (
    <Link
      to="/show/$showId"
      params={{ showId: String(show.id) }}
      className="group shrink-0 w-[280px] sm:w-[320px]"
      data-ocid={`show-card.item.${(index ?? 0) + 1}`}
    >
      <div className="relative rounded-xl overflow-hidden bg-card border border-border/40 transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-[0_0_24px_rgba(168,85,247,0.22)] group-hover:scale-[1.03]">
        {/* 16:9 thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-muted/20">
          {coverSrc ? (
            <img
              src={coverSrc}
              alt={show.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/10 via-muted/20 to-background flex items-center justify-center">
              <Film className="w-10 h-10 text-muted-foreground/30" />
            </div>
          )}

          {/* Play overlay */}
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.5)]">
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            </div>
          </div>

          {/* Free badge */}
          {show.isFree && (
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold uppercase tracking-wide">
              Free
            </span>
          )}

          {/* Lock badge */}
          {!show.isFree && (
            <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-primary/80 text-white text-[10px] font-bold uppercase tracking-wide">
              Premium
            </span>
          )}
        </div>

        {/* Title */}
        <div className="px-3 py-2.5">
          <p className="font-display font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors duration-200">
            {show.title}
          </p>
          {show.description && (
            <p className="text-muted-foreground text-xs line-clamp-1 mt-0.5">
              {show.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── Horizontal Row ───────────────────────────────────────────────────────────

function HorizontalRow({
  title,
  icon,
  href,
  children,
  initialVisible = false,
}: {
  title: string;
  icon?: React.ReactNode;
  href?: string;
  children: React.ReactNode;
  initialVisible?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(initialVisible);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialVisible) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [initialVisible]);

  function scrollBy(dir: "left" | "right") {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -640 : 640,
      behavior: "smooth",
    });
  }

  return (
    <section
      ref={ref}
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      {/* Row header */}
      <div className="flex items-center justify-between mb-4 px-6 md:px-10">
        <h2 className="flex items-center gap-2.5 font-display font-bold text-lg md:text-xl text-foreground">
          {icon}
          {title}
        </h2>
        <div className="flex items-center gap-2">
          {href && (
            <Link
              to={href as "/browse"}
              className="text-sm text-primary hover:text-primary/80 font-display transition-colors duration-200 mr-2"
              data-ocid="see-all-link"
            >
              See All
            </Link>
          )}
          <button
            type="button"
            onClick={() => scrollBy("left")}
            className="w-7 h-7 rounded-full bg-muted/60 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy("right")}
            className="w-7 h-7 rounded-full bg-muted/60 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable track */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory pl-6 md:pl-10 pr-6"
      >
        {children}
      </div>
    </section>
  );
}

// ─── Skeleton cards ───────────────────────────────────────────────────────────

function LandscapeSkeletons({ count = 5 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => `sk-${i}`).map((key) => (
        <div key={key} className="shrink-0 w-[280px] sm:w-[320px] snap-start">
          <div className="rounded-xl overflow-hidden bg-card border border-border/40 animate-pulse">
            <div className="aspect-video bg-muted/20" />
            <div className="px-3 py-2.5 space-y-1.5">
              <div className="h-3.5 w-3/4 bg-muted/30 rounded" />
              <div className="h-3 w-1/2 bg-muted/20 rounded" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function RowEmpty({ label }: { label: string }) {
  return (
    <div
      className="shrink-0 w-full min-w-[300px] flex flex-col items-center justify-center py-12 text-center rounded-xl border border-border/30 bg-card/20"
      data-ocid="shows-empty-state"
    >
      <Tv className="w-8 h-8 text-muted-foreground/40 mb-3" />
      <p className="font-display font-semibold text-sm text-foreground">
        {label}
      </p>
      <p className="text-muted-foreground text-xs mt-1">Check back soon!</p>
    </div>
  );
}

// ─── Hero Branding Placeholder (no shows yet) ─────────────────────────────────

function HeroBrandingPlaceholder() {
  return (
    <section
      className="relative w-full flex items-end overflow-hidden"
      style={{ minHeight: "88vh" }}
      data-ocid="hero-section"
    >
      <div className="absolute inset-0 bg-[#0a0a0a]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_-10%,rgba(168,85,247,0.28),transparent)]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(168,85,247,1) 1px,transparent 1px),linear-gradient(90deg,rgba(168,85,247,1) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>
      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />

      <div className="relative z-10 w-full px-6 md:px-14 pb-16 pt-32 flex flex-col items-start max-w-2xl">
        <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(168,85,247,0.3)]">
          <Zap className="w-8 h-8 text-primary fill-primary/20" />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-display font-bold uppercase tracking-widest mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Premium Streaming
        </div>
        <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl text-foreground mb-4 leading-[0.9] tracking-tighter">
          Zyro{" "}
          <span className="text-primary drop-shadow-[0_0_30px_rgba(168,85,247,0.8)]">
            TV
          </span>
        </h1>
        <p className="text-muted-foreground text-lg mb-8 max-w-lg leading-relaxed">
          Premium original content is on its way. Subscribe now and be the first
          to watch exclusive shows the moment they drop.
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <Link to="/subscribe">
            <Button
              variant="primary"
              size="lg"
              className="gap-2 shadow-[0_0_30px_rgba(168,85,247,0.45)] text-base px-8"
              data-ocid="hero-subscribe-btn"
            >
              <Play className="w-5 h-5 fill-current" />
              Get Started
            </Button>
          </Link>
          <Link to="/browse">
            <Button
              variant="secondary"
              size="lg"
              className="text-base"
              data-ocid="hero-browse-btn"
            >
              Browse Library
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection({ featuredShows }: { featuredShows: ShowPublic[] }) {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);
  const { isLoggedIn, toggleWatchlist, isInWatchlist } = useAuthStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (featuredShows.length < 2) return;
    intervalRef.current = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % featuredShows.length);
        setFading(false);
      }, 350);
    }, 6000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [featuredShows.length]);

  if (featuredShows.length === 0) return <HeroBrandingPlaceholder />;

  const show = featuredShows[current]!;
  const coverSrc = hexToImageSrc(show.coverImageUrl);
  const inWatchlist = isInWatchlist(String(show.id));

  return (
    <section
      className="relative w-full flex items-end overflow-hidden"
      style={{ minHeight: "88vh" }}
      data-ocid="hero-section"
    >
      {/* Background image — full bleed */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${fading ? "opacity-0" : "opacity-100"}`}
      >
        {coverSrc ? (
          <img
            src={coverSrc}
            alt={show.title}
            className="w-full h-full object-cover object-center scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-muted/20 to-background" />
        )}

        {/* Cinematic gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/95 via-[#0a0a0a]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-[#0a0a0a]/50" />
      </div>

      {/* Content — bottom-left anchored */}
      <div className="relative z-10 w-full px-6 md:px-14 pb-14 pt-32">
        <div
          className={`max-w-2xl transition-all duration-500 ${fading ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}
        >
          {/* Badges */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {show.isFree && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-display font-bold border border-emerald-500/30 uppercase tracking-wide">
                Free
              </span>
            )}
            {!show.isFree && (
              <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-display font-bold border border-primary/30 uppercase tracking-wide">
                Premium
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-semibold">4.5</span>
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground mb-4 leading-[0.9] tracking-tighter drop-shadow-2xl">
            {show.title}
          </h1>

          {/* Description */}
          <p className="text-muted-foreground text-base md:text-lg mb-7 line-clamp-2 max-w-xl leading-relaxed">
            {show.description}
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              to="/show/$showId"
              params={{ showId: String(show.id) }}
              data-ocid="hero-play-btn"
            >
              <Button
                variant="primary"
                size="lg"
                className="gap-2.5 shadow-[0_0_30px_rgba(168,85,247,0.4)] text-base px-8"
              >
                <Play className="w-5 h-5 fill-current" />
                Watch Now
              </Button>
            </Link>
            {isLoggedIn && (
              <Button
                variant="secondary"
                size="lg"
                className="gap-2 text-base"
                onClick={() => toggleWatchlist(String(show.id))}
                data-ocid="hero-watchlist-btn"
              >
                {inWatchlist ? (
                  <>
                    <CheckCircle className="w-5 h-5" /> In Watchlist
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-5 h-5" /> Add to Watchlist
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Slide dots */}
      {featuredShows.length > 1 && (
        <div className="absolute bottom-5 right-8 flex items-center gap-2 z-20">
          {featuredShows.map((s, i) => (
            <button
              key={String(s.id)}
              type="button"
              onClick={() => {
                if (i === current) return;
                setFading(true);
                setTimeout(() => {
                  setCurrent(i);
                  setFading(false);
                }, 350);
              }}
              aria-label={`Show ${s.title}`}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 h-2 bg-primary shadow-[0_0_8px_rgba(168,85,247,0.8)]"
                  : "w-2 h-2 bg-border/60 hover:bg-primary/60"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { currentUser, isLoggedIn } = useAuthStore();
  const { actor, isFetching: actorFetching } = useActor(createActor);

  const { data: allShows = [], isLoading } = useQuery<ShowPublic[]>({
    queryKey: ["approvedShows"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listApprovedShows();
    },
    enabled: !!actor && !actorFetching,
  });

  // Derived sections
  const featuredShows = allShows.filter((s) => s.isFeatured).slice(0, 5);
  const heroShows =
    featuredShows.length > 0 ? featuredShows : allShows.slice(0, 5);

  const trendingShows = [...allShows]
    .sort((a, b) => Number(b.totalViews - a.totalViews))
    .slice(0, 10);

  const newShows = [...allShows]
    .sort((a, b) => Number(b.createdAt - a.createdAt))
    .slice(0, 10);

  const recommendedShows = isLoggedIn
    ? [...allShows].sort(() => Math.random() - 0.5).slice(0, 10)
    : allShows.slice(0, 10);

  return (
    <div className="min-h-full" data-ocid="home-page">
      {/* Hero — full bleed, no padding */}
      {isLoading ? (
        <section
          className="relative w-full flex items-center justify-center overflow-hidden bg-[#0a0a0a]"
          style={{ minHeight: "88vh" }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(168,85,247,0.15),transparent)]" />
          <div className="flex flex-col items-center gap-4 z-10">
            <div className="w-16 h-16 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            <p className="text-muted-foreground text-sm font-display">
              Loading...
            </p>
          </div>
        </section>
      ) : (
        <HeroSection featuredShows={heroShows} />
      )}

      {/* Content rows — Hulu-style horizontal scrollable sections */}
      <div className="py-8 space-y-10">
        {/* Continue Watching — logged in + has history */}
        {isLoggedIn && currentUser && currentUser.watchHistory.length > 0 && (
          <HorizontalRow
            title="Continue Watching"
            icon={<Clock className="w-5 h-5 text-primary" />}
            href="/profile"
            initialVisible
          >
            {currentUser.watchHistory.slice(0, 8).map((entry, i) => {
              const historyShow = allShows.find(
                (s) => String(s.id) === entry.showId,
              );
              if (!historyShow) return null;
              return (
                <div
                  key={entry.episodeId}
                  className="snap-start"
                  data-ocid={`continue-watching.item.${i + 1}`}
                >
                  <LandscapeCard show={historyShow} index={i} />
                </div>
              );
            })}
          </HorizontalRow>
        )}

        {/* Trending Now */}
        <HorizontalRow
          title="Trending Now"
          icon={<Flame className="w-5 h-5 text-rose-400" />}
          href="/browse"
          initialVisible
        >
          {isLoading ? (
            <LandscapeSkeletons count={5} />
          ) : trendingShows.length > 0 ? (
            trendingShows.map((show, i) => (
              <div
                key={String(show.id)}
                className="snap-start"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                <LandscapeCard show={show} index={i} />
              </div>
            ))
          ) : (
            <RowEmpty label="No trending shows yet" />
          )}
        </HorizontalRow>

        {/* New This Week */}
        <HorizontalRow
          title="New This Week"
          icon={<Sparkles className="w-5 h-5 text-amber-400" />}
          href="/browse"
        >
          {isLoading ? (
            <LandscapeSkeletons count={5} />
          ) : newShows.length > 0 ? (
            newShows.map((show, i) => (
              <div key={String(show.id)} className="snap-start">
                <LandscapeCard show={show} index={i} />
              </div>
            ))
          ) : (
            <RowEmpty label="No new shows yet" />
          )}
        </HorizontalRow>

        {/* Recommended for You */}
        <HorizontalRow
          title={isLoggedIn ? "Recommended for You" : "Popular on Zyro TV"}
          icon={<Star className="w-5 h-5 text-amber-400 fill-amber-400/60" />}
          href="/browse"
        >
          {isLoading ? (
            <LandscapeSkeletons count={5} />
          ) : recommendedShows.length > 0 ? (
            recommendedShows.map((show, i) => (
              <div key={String(show.id)} className="snap-start">
                <LandscapeCard show={show} index={i} />
              </div>
            ))
          ) : (
            <RowEmpty label="No shows yet" />
          )}
        </HorizontalRow>

        {/* CTA Banner — logged out only */}
        {!isLoggedIn && (
          <section
            className="relative mx-6 md:mx-10 rounded-2xl overflow-hidden border border-primary/20 p-8 md:p-12 text-center"
            data-ocid="cta-banner"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.1)_0%,transparent_70%)]" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-display font-semibold uppercase tracking-wider mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Free to Start
              </div>
              <h2 className="font-display font-black text-3xl md:text-4xl text-foreground mb-3">
                Start Streaming Today
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto leading-relaxed">
                Watch exclusive original content on Zyro TV. No credit card
                required.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link to="/subscribe">
                  <Button
                    variant="primary"
                    size="lg"
                    className="shadow-[0_0_30px_rgba(168,85,247,0.4)] text-base px-8"
                    data-ocid="cta-subscribe-btn"
                  >
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/browse">
                  <Button variant="secondary" size="lg" className="text-base">
                    Browse Content
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
