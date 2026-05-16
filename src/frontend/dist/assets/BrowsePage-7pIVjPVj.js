import { c as createLucideIcon, j as jsxRuntimeExports, a as useActor, r as reactExports, b as useQuery, S as Search, X, C as Category, d as createActor } from "./index-BiC3Bukn.js";
import { C as CategoryBadge, S as ShowCard } from "./ShowCard-BsvhYlEI.js";
import "./film-DdtsYYYl.js";
import "./play-BUJyb-yg.js";
import "./lock-open-IhH0KOXI.js";
import "./check-Cliyqnti.js";
import "./plus-UP_q622i.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["line", { x1: "21", x2: "14", y1: "4", y2: "4", key: "obuewd" }],
  ["line", { x1: "10", x2: "3", y1: "4", y2: "4", key: "1q6298" }],
  ["line", { x1: "21", x2: "12", y1: "12", y2: "12", key: "1iu8h1" }],
  ["line", { x1: "8", x2: "3", y1: "12", y2: "12", key: "ntss68" }],
  ["line", { x1: "21", x2: "16", y1: "20", y2: "20", key: "14d8ph" }],
  ["line", { x1: "12", x2: "3", y1: "20", y2: "20", key: "m0wm8r" }],
  ["line", { x1: "14", x2: "14", y1: "2", y2: "6", key: "14e1ph" }],
  ["line", { x1: "8", x2: "8", y1: "10", y2: "14", key: "1i6ji0" }],
  ["line", { x1: "16", x2: "16", y1: "18", y2: "22", key: "1lctlv" }]
];
const SlidersHorizontal = createLucideIcon("sliders-horizontal", __iconNode);
function SkeletonCard() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-lg overflow-hidden bg-card animate-pulse",
      "data-ocid": "skeleton-card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[2/3] bg-muted/50" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-muted/50 rounded w-3/4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 bg-muted/50 rounded w-1/2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 bg-muted/50 rounded w-1/3" })
        ] })
      ]
    }
  );
}
const ALL_CATEGORIES = [
  Category.RealityTV,
  Category.Drama,
  Category.Comedy,
  Category.Exclusive
];
const SORT_OPTIONS = [
  { value: "trending", label: "Trending" },
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" }
];
const CATEGORY_LABEL_MAP = {
  [Category.RealityTV]: "Reality TV",
  [Category.Drama]: "Drama",
  [Category.Comedy]: "Comedy",
  [Category.Exclusive]: "Exclusive"
};
function BrowsePage() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const [selectedCategory, setSelectedCategory] = reactExports.useState("all");
  const [sortBy, setSortBy] = reactExports.useState("trending");
  const [query, setQuery] = reactExports.useState("");
  const [showFilters, setShowFilters] = reactExports.useState(false);
  const { data: allShows, isLoading } = useQuery({
    queryKey: ["approvedShows"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listApprovedShows();
    },
    enabled: !!actor && !actorFetching
  });
  const results = reactExports.useMemo(() => {
    let list = allShows ?? [];
    if (selectedCategory !== "all") {
      list = list.filter((s) => s.category === selectedCategory);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
      );
    }
    const sorted = [...list].sort((a, b) => {
      if (sortBy === "popular") return Number(b.totalViews - a.totalViews);
      if (sortBy === "newest") return Number(b.createdAt - a.createdAt);
      const tA = a.isFeatured ? 1 : 0;
      const tB = b.isFeatured ? 1 : 0;
      return tB - tA || Number(b.totalViews - a.totalViews);
    });
    return sorted;
  }, [allShows, selectedCategory, sortBy, query]);
  const showSkeletons = isLoading || actorFetching;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-full px-4 sm:px-6 md:px-8 py-8",
      "data-ocid": "browse-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-black text-3xl md:text-4xl text-foreground mb-2", children: "Browse Shows" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-base", children: "Discover original content across all genres" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "search",
              placeholder: "Search shows, genres...",
              value: query,
              onChange: (e) => setQuery(e.target.value),
              className: "w-full h-12 pl-11 pr-12 rounded-xl bg-card border border-border/60 text-foreground placeholder:text-muted-foreground text-sm font-body focus:outline-none focus:border-primary/60 focus:shadow-[0_0_0_3px_rgba(168,85,247,0.15)] transition-smooth",
              "data-ocid": "browse-search"
            }
          ),
          query && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setQuery(""),
              className: "absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
              "aria-label": "Clear search",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-2xl bg-card/60 border border-border/40 p-4 mb-6 transition-smooth",
            "data-ocid": "filter-bar",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setSelectedCategory("all"),
                    className: `px-4 py-1.5 rounded-full text-sm font-display font-semibold transition-smooth border ${selectedCategory === "all" ? "bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(168,85,247,0.35)]" : "bg-muted/40 text-muted-foreground border-border/40 hover:border-primary/40 hover:text-foreground"}`,
                    "data-ocid": "filter-all",
                    children: "All"
                  }
                ),
                ALL_CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setSelectedCategory(cat),
                    className: `transition-smooth rounded-full ${selectedCategory === cat ? "ring-2 ring-primary ring-offset-1 ring-offset-background scale-105" : "opacity-80 hover:opacity-100 hover:scale-[1.02]"}`,
                    "data-ocid": `filter-${cat}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      CategoryBadge,
                      {
                        category: cat,
                        className: "px-3 py-1.5 text-sm cursor-pointer"
                      }
                    )
                  },
                  cat
                )),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowFilters((p) => !p),
                    className: `ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-display font-semibold transition-smooth border ${showFilters ? "bg-primary/15 text-primary border-primary/40" : "bg-muted/40 text-muted-foreground border-border/40 hover:border-primary/40"}`,
                    "data-ocid": "sort-toggle",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersHorizontal, { className: "w-3.5 h-3.5" }),
                      "Sort"
                    ]
                  }
                )
              ] }),
              showFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-4 pt-4 border-t border-border/40 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-display mr-1", children: "Sort by:" }),
                SORT_OPTIONS.map(({ value, label }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setSortBy(value),
                    className: `px-3 py-1.5 rounded-full text-xs font-display font-semibold capitalize transition-smooth border ${sortBy === value ? "bg-primary text-primary-foreground border-primary" : "bg-muted/40 text-muted-foreground border-border/40 hover:border-primary/40 hover:text-foreground"}`,
                    "data-ocid": `sort-${value}`,
                    children: label
                  },
                  value
                ))
              ] })
            ]
          }
        ),
        !showSkeletons && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-display", children: query ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: results.length }),
            " ",
            "result",
            results.length !== 1 ? "s" : "",
            ' for "',
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: query }),
            '"'
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            "Showing",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: results.length }),
            " ",
            "show",
            results.length !== 1 ? "s" : "",
            selectedCategory !== "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              " ",
              "in",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: CATEGORY_LABEL_MAP[selectedCategory] ?? selectedCategory })
            ] })
          ] }) }),
          (selectedCategory !== "all" || query) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                setSelectedCategory("all");
                setQuery("");
              },
              className: "text-xs text-muted-foreground hover:text-primary transition-colors font-display flex items-center gap-1",
              "data-ocid": "clear-filters",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" }),
                "Clear filters"
              ]
            }
          )
        ] }),
        showSkeletons ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4", children: Array.from({ length: 10 }, (_, i) => `sk-${i}`).map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCard, {}, id)) }) : results.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4", children: results.map((show) => /* @__PURE__ */ jsxRuntimeExports.jsx(ShowCard, { show }, String(show.id))) }) : (
          /* Empty state */
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center py-20 text-center",
              "data-ocid": "browse-empty",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-9 h-9 text-primary/60" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-xl text-foreground mb-2", children: query || selectedCategory !== "all" ? "No shows found" : "No shows available yet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-xs leading-relaxed", children: query ? `No results for "${query}". Try a different search term.` : selectedCategory !== "all" ? "No shows match the selected category. Try browsing all shows." : "No shows available yet. Check back soon!" }),
                (query || selectedCategory !== "all") && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setSelectedCategory("all");
                      setQuery("");
                    },
                    className: "mt-5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-sm hover:bg-primary/90 transition-smooth",
                    children: "Browse all shows"
                  }
                )
              ]
            }
          )
        )
      ]
    }
  );
}
export {
  BrowsePage as default
};
