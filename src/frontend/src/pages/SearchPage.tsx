import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Search, Sparkles, TrendingUp, Tv, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Category as BackendCategory, createActor } from "../backend";
import type { ShowPublic } from "../backend";
import { ShowCard } from "../components/ui/ShowCard";

const CATEGORIES: { label: string; value: BackendCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Reality TV", value: BackendCategory.RealityTV },
  { label: "Drama", value: BackendCategory.Drama },
  { label: "Comedy", value: BackendCategory.Comedy },
  { label: "Exclusive", value: BackendCategory.Exclusive },
];

const POPULAR_SEARCHES = [
  {
    label: "Reality TV",
    Icon: Tv,
    color: "text-amber-400",
    bgColor: "bg-amber-400/10 border-amber-400/20",
  },
  {
    label: "Drama",
    Icon: Sparkles,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10 border-purple-400/20",
  },
  {
    label: "Comedy",
    Icon: TrendingUp,
    color: "text-green-400",
    bgColor: "bg-green-400/10 border-green-400/20",
  },
  {
    label: "Exclusive",
    Icon: Sparkles,
    color: "text-primary",
    bgColor: "bg-primary/10 border-primary/20",
  },
  {
    label: "Sci-Fi",
    Icon: Tv,
    color: "text-primary",
    bgColor: "bg-primary/10 border-primary/20",
  },
  {
    label: "Thriller",
    Icon: TrendingUp,
    color: "text-red-400",
    bgColor: "bg-red-400/10 border-red-400/20",
  },
];

export default function SearchPage() {
  const search = useSearch({ from: "/search" });
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const { actor, isFetching: actorFetching } = useActor(createActor);

  const [query, setQuery] = useState((search as { q?: string }).q ?? "");
  const [activeCategory, setActiveCategory] = useState<BackendCategory | "all">(
    "all",
  );

  // Sync URL param → local state (only on first render)
  const didInit = useRef(false);
  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true;
      const q = (search as { q?: string }).q ?? "";
      setQuery(q);
      inputRef.current?.focus();
    }
  }, [search]);

  // Update URL on input change (debounced)
  useEffect(() => {
    const t = setTimeout(() => {
      void navigate({
        to: "/search",
        search: { q: query },
        replace: true,
      });
    }, 300);
    return () => clearTimeout(t);
  }, [query, navigate]);

  // Backend search query
  const { data: searchResults = [] } = useQuery<ShowPublic[]>({
    queryKey: ["searchShows", query.trim()],
    queryFn: async () => {
      if (!actor || !query.trim()) return [];
      return actor.searchShows(query.trim());
    },
    enabled: !!actor && !actorFetching && query.trim().length > 0,
  });

  // Trending shows for empty state
  const { data: trendingShows = [] } = useQuery<ShowPublic[]>({
    queryKey: ["trendingShows"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTrendingShows();
    },
    enabled: !!actor && !actorFetching,
  });

  const filteredShows = useMemo(() => {
    let shows = searchResults;
    if (activeCategory !== "all") {
      shows = shows.filter((s) => s.category === activeCategory);
    }
    return shows;
  }, [searchResults, activeCategory]);

  const hasQuery = query.trim().length > 0;

  function handlePopularSearch(label: string) {
    setQuery(label);
    inputRef.current?.focus();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <div className="bg-card/60 backdrop-blur-xl border-b border-border/40 sticky top-0 z-20 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search shows, genres..."
              className="w-full pl-12 pr-12 py-3 bg-muted/50 border border-border hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl text-foreground placeholder:text-muted-foreground outline-none transition-smooth text-sm sm:text-base"
              data-ocid="search-input"
              aria-label="Search Zyro TV"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <AnimatePresence mode="wait">
          {!hasQuery ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-display font-semibold text-foreground mb-4">
                Popular Searches
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-10">
                {POPULAR_SEARCHES.map((item, i) => (
                  <motion.button
                    key={item.label}
                    type="button"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handlePopularSearch(item.label)}
                    className={`glass-card rounded-xl p-4 flex flex-col items-center gap-2 border ${item.bgColor} transition-smooth hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] cursor-pointer`}
                    data-ocid="popular-search-pill"
                  >
                    <item.Icon className={`w-6 h-6 ${item.color}`} />
                    <span className="text-sm font-medium text-foreground">
                      {item.label}
                    </span>
                  </motion.button>
                ))}
              </div>

              <h2 className="text-lg font-display font-semibold text-foreground mb-4">
                Trending Shows
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {trendingShows.map((show, i) => (
                  <motion.div
                    key={String(show.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <ShowCard show={show} />
                  </motion.div>
                ))}
                {trendingShows.length === 0 && (
                  <div className="col-span-full text-center py-10 text-muted-foreground text-sm">
                    No trending shows yet
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {/* Category filter pills */}
              <div className="flex items-center gap-2 mb-5 flex-wrap">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setActiveCategory(cat.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-smooth ${
                      activeCategory === cat.value
                        ? "border-primary bg-primary/20 text-primary"
                        : "border-border/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                    data-ocid="category-filter-pill"
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Results count */}
              <p className="text-sm text-muted-foreground mb-5">
                {filteredShows.length > 0 ? (
                  <>
                    Found{" "}
                    <span className="text-primary font-semibold">
                      {filteredShows.length}
                    </span>{" "}
                    result{filteredShows.length !== 1 ? "s" : ""} for{" "}
                    <span className="text-foreground font-medium">
                      "{query}"
                    </span>
                  </>
                ) : (
                  <>
                    No results for{" "}
                    <span className="text-foreground font-medium">
                      "{query}"
                    </span>
                  </>
                )}
              </p>

              {/* Empty state */}
              {filteredShows.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-24 text-center"
                  data-ocid="search-empty-state"
                >
                  <div className="w-24 h-24 rounded-full bg-muted/50 border border-border/40 flex items-center justify-center mb-6">
                    <Search className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-foreground mb-2">
                    No results for "{query}"
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-xs mb-6">
                    Try different keywords or browse by category below.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {POPULAR_SEARCHES.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => handlePopularSearch(p.label)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium border border-border/40 text-muted-foreground hover:border-primary/40 hover:text-primary transition-smooth"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Shows grid */}
              {filteredShows.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredShows.map((show, i) => (
                    <motion.div
                      key={String(show.id)}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <ShowCard show={show} />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
