import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { createActor } from "../backend";
import type { ShowPublic } from "../backend";
import { Category as BackendCategory } from "../backend";
import { CategoryBadge } from "../components/ui/CategoryBadge";
import { ShowCard } from "../components/ui/ShowCard";
import { SkeletonCard } from "../components/ui/SkeletonCard";

const ALL_CATEGORIES = [
  BackendCategory.RealityTV,
  BackendCategory.Drama,
  BackendCategory.Comedy,
  BackendCategory.Exclusive,
];

const SORT_OPTIONS = [
  { value: "trending", label: "Trending" },
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
] as const;

type SortOption = (typeof SORT_OPTIONS)[number]["value"];

const CATEGORY_LABEL_MAP: Record<string, string> = {
  [BackendCategory.RealityTV]: "Reality TV",
  [BackendCategory.Drama]: "Drama",
  [BackendCategory.Comedy]: "Comedy",
  [BackendCategory.Exclusive]: "Exclusive",
};

export default function BrowsePage() {
  const { actor, isFetching: actorFetching } = useActor(createActor);

  const [selectedCategory, setSelectedCategory] = useState<
    BackendCategory | "all"
  >("all");
  const [sortBy, setSortBy] = useState<SortOption>("trending");
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data: allShows, isLoading } = useQuery<ShowPublic[]>({
    queryKey: ["approvedShows"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listApprovedShows();
    },
    enabled: !!actor && !actorFetching,
  });

  const results = useMemo(() => {
    let list = allShows ?? [];

    if (selectedCategory !== "all") {
      list = list.filter((s) => s.category === selectedCategory);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q),
      );
    }

    const sorted = [...list].sort((a, b) => {
      if (sortBy === "popular") return Number(b.totalViews - a.totalViews);
      if (sortBy === "newest") return Number(b.createdAt - a.createdAt);
      // trending: featured first, then by views
      const tA = a.isFeatured ? 1 : 0;
      const tB = b.isFeatured ? 1 : 0;
      return tB - tA || Number(b.totalViews - a.totalViews);
    });

    return sorted;
  }, [allShows, selectedCategory, sortBy, query]);

  const showSkeletons = isLoading || actorFetching;

  return (
    <div
      className="min-h-full px-4 sm:px-6 md:px-8 py-8"
      data-ocid="browse-page"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-black text-3xl md:text-4xl text-foreground mb-2">
          Browse Shows
        </h1>
        <p className="text-muted-foreground text-base">
          Discover original content across all genres
        </p>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="search"
          placeholder="Search shows, genres..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-12 pl-11 pr-12 rounded-xl bg-card border border-border/60 text-foreground placeholder:text-muted-foreground text-sm font-body focus:outline-none focus:border-primary/60 focus:shadow-[0_0_0_3px_rgba(168,85,247,0.15)] transition-smooth"
          data-ocid="browse-search"
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

      {/* Filter bar */}
      <div
        className="rounded-2xl bg-card/60 border border-border/40 p-4 mb-6 transition-smooth"
        data-ocid="filter-bar"
      >
        {/* Category tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-1.5 rounded-full text-sm font-display font-semibold transition-smooth border ${
              selectedCategory === "all"
                ? "bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(168,85,247,0.35)]"
                : "bg-muted/40 text-muted-foreground border-border/40 hover:border-primary/40 hover:text-foreground"
            }`}
            data-ocid="filter-all"
          >
            All
          </button>
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`transition-smooth rounded-full ${
                selectedCategory === cat
                  ? "ring-2 ring-primary ring-offset-1 ring-offset-background scale-105"
                  : "opacity-80 hover:opacity-100 hover:scale-[1.02]"
              }`}
              data-ocid={`filter-${cat}`}
            >
              <CategoryBadge
                category={cat as string}
                className="px-3 py-1.5 text-sm cursor-pointer"
              />
            </button>
          ))}

          {/* Sort toggle button */}
          <button
            type="button"
            onClick={() => setShowFilters((p) => !p)}
            className={`ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-display font-semibold transition-smooth border ${
              showFilters
                ? "bg-primary/15 text-primary border-primary/40"
                : "bg-muted/40 text-muted-foreground border-border/40 hover:border-primary/40"
            }`}
            data-ocid="sort-toggle"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Sort
          </button>
        </div>

        {/* Sort options */}
        {showFilters && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/40 flex-wrap">
            <span className="text-xs text-muted-foreground font-display mr-1">
              Sort by:
            </span>
            {SORT_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setSortBy(value)}
                className={`px-3 py-1.5 rounded-full text-xs font-display font-semibold capitalize transition-smooth border ${
                  sortBy === value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/40 text-muted-foreground border-border/40 hover:border-primary/40 hover:text-foreground"
                }`}
                data-ocid={`sort-${value}`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results count */}
      {!showSkeletons && (
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-muted-foreground font-display">
            {query ? (
              <>
                <span className="text-foreground font-semibold">
                  {results.length}
                </span>{" "}
                result{results.length !== 1 ? "s" : ""} for "
                <span className="text-primary">{query}</span>"
              </>
            ) : (
              <>
                Showing{" "}
                <span className="text-foreground font-semibold">
                  {results.length}
                </span>{" "}
                show{results.length !== 1 ? "s" : ""}
                {selectedCategory !== "all" && (
                  <>
                    {" "}
                    in{" "}
                    <span className="text-primary">
                      {CATEGORY_LABEL_MAP[selectedCategory] ?? selectedCategory}
                    </span>
                  </>
                )}
              </>
            )}
          </p>
          {(selectedCategory !== "all" || query) && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setQuery("");
              }}
              className="text-xs text-muted-foreground hover:text-primary transition-colors font-display flex items-center gap-1"
              data-ocid="clear-filters"
            >
              <X className="w-3.5 h-3.5" />
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      {showSkeletons ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {Array.from({ length: 10 }, (_, i) => `sk-${i}`).map((id) => (
            <SkeletonCard key={id} />
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {results.map((show) => (
            <ShowCard key={String(show.id)} show={show} />
          ))}
        </div>
      ) : (
        /* Empty state */
        <div
          className="flex flex-col items-center justify-center py-20 text-center"
          data-ocid="browse-empty"
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
            <Search className="w-9 h-9 text-primary/60" />
          </div>
          <h3 className="font-display font-bold text-xl text-foreground mb-2">
            {query || selectedCategory !== "all"
              ? "No shows found"
              : "No shows available yet"}
          </h3>
          <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
            {query
              ? `No results for "${query}". Try a different search term.`
              : selectedCategory !== "all"
                ? "No shows match the selected category. Try browsing all shows."
                : "No shows available yet. Check back soon!"}
          </p>
          {(query || selectedCategory !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setQuery("");
              }}
              className="mt-5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-sm hover:bg-primary/90 transition-smooth"
            >
              Browse all shows
            </button>
          )}
        </div>
      )}
    </div>
  );
}
