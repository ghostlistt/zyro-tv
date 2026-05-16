import { r as reactExports, j as jsxRuntimeExports, i as useSearch, g as useNavigate, a as useActor, b as useQuery, S as Search, X, C as Category, d as createActor } from "./index-BiC3Bukn.js";
import { S as ShowCard } from "./ShowCard-BsvhYlEI.js";
import { M as MotionConfigContext, i as isHTMLElement, u as useConstant, P as PresenceContext, a as usePresence, b as useIsomorphicLayoutEffect, L as LayoutGroupContext, m as motion } from "./proxy-9YQ-IZmR.js";
import { T as Tv } from "./tv-c6wygwpJ.js";
import { S as Sparkles } from "./sparkles-DnqwujiC.js";
import { T as TrendingUp } from "./trending-up-JNvejBpN.js";
import "./film-DdtsYYYl.js";
import "./play-BUJyb-yg.js";
import "./lock-open-IhH0KOXI.js";
import "./check-Cliyqnti.js";
import "./plus-UP_q622i.js";
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup === "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup === "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return reactExports.useCallback(composeRefs(...refs), refs);
}
class PopChildMeasure extends reactExports.Component {
  getSnapshotBeforeUpdate(prevProps) {
    const element = this.props.childRef.current;
    if (isHTMLElement(element) && prevProps.isPresent && !this.props.isPresent && this.props.pop !== false) {
      const parent = element.offsetParent;
      const parentWidth = isHTMLElement(parent) ? parent.offsetWidth || 0 : 0;
      const parentHeight = isHTMLElement(parent) ? parent.offsetHeight || 0 : 0;
      const computedStyle = getComputedStyle(element);
      const size = this.props.sizeRef.current;
      size.height = parseFloat(computedStyle.height);
      size.width = parseFloat(computedStyle.width);
      size.top = element.offsetTop;
      size.left = element.offsetLeft;
      size.right = parentWidth - size.width - size.left;
      size.bottom = parentHeight - size.height - size.top;
    }
    return null;
  }
  /**
   * Required with getSnapshotBeforeUpdate to stop React complaining.
   */
  componentDidUpdate() {
  }
  render() {
    return this.props.children;
  }
}
function PopChild({ children, isPresent, anchorX, anchorY, root, pop }) {
  var _a;
  const id = reactExports.useId();
  const ref = reactExports.useRef(null);
  const size = reactExports.useRef({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  });
  const { nonce } = reactExports.useContext(MotionConfigContext);
  const childRef = ((_a = children.props) == null ? void 0 : _a.ref) ?? (children == null ? void 0 : children.ref);
  const composedRef = useComposedRefs(ref, childRef);
  reactExports.useInsertionEffect(() => {
    const { width, height, top, left, right, bottom } = size.current;
    if (isPresent || pop === false || !ref.current || !width || !height)
      return;
    const x = anchorX === "left" ? `left: ${left}` : `right: ${right}`;
    const y = anchorY === "bottom" ? `bottom: ${bottom}` : `top: ${top}`;
    ref.current.dataset.motionPopId = id;
    const style = document.createElement("style");
    if (nonce)
      style.nonce = nonce;
    const parent = root ?? document.head;
    parent.appendChild(style);
    if (style.sheet) {
      style.sheet.insertRule(`
          [data-motion-pop-id="${id}"] {
            position: absolute !important;
            width: ${width}px !important;
            height: ${height}px !important;
            ${x}px !important;
            ${y}px !important;
          }
        `);
    }
    return () => {
      var _a2;
      (_a2 = ref.current) == null ? void 0 : _a2.removeAttribute("data-motion-pop-id");
      if (parent.contains(style)) {
        parent.removeChild(style);
      }
    };
  }, [isPresent]);
  return jsxRuntimeExports.jsx(PopChildMeasure, { isPresent, childRef: ref, sizeRef: size, pop, children: pop === false ? children : reactExports.cloneElement(children, { ref: composedRef }) });
}
const PresenceChild = ({ children, initial, isPresent, onExitComplete, custom, presenceAffectsLayout, mode, anchorX, anchorY, root }) => {
  const presenceChildren = useConstant(newChildrenMap);
  const id = reactExports.useId();
  let isReusedContext = true;
  let context = reactExports.useMemo(() => {
    isReusedContext = false;
    return {
      id,
      initial,
      isPresent,
      custom,
      onExitComplete: (childId) => {
        presenceChildren.set(childId, true);
        for (const isComplete of presenceChildren.values()) {
          if (!isComplete)
            return;
        }
        onExitComplete && onExitComplete();
      },
      register: (childId) => {
        presenceChildren.set(childId, false);
        return () => presenceChildren.delete(childId);
      }
    };
  }, [isPresent, presenceChildren, onExitComplete]);
  if (presenceAffectsLayout && isReusedContext) {
    context = { ...context };
  }
  reactExports.useMemo(() => {
    presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
  }, [isPresent]);
  reactExports.useEffect(() => {
    !isPresent && !presenceChildren.size && onExitComplete && onExitComplete();
  }, [isPresent]);
  children = jsxRuntimeExports.jsx(PopChild, { pop: mode === "popLayout", isPresent, anchorX, anchorY, root, children });
  return jsxRuntimeExports.jsx(PresenceContext.Provider, { value: context, children });
};
function newChildrenMap() {
  return /* @__PURE__ */ new Map();
}
const getChildKey = (child) => child.key || "";
function onlyElements(children) {
  const filtered = [];
  reactExports.Children.forEach(children, (child) => {
    if (reactExports.isValidElement(child))
      filtered.push(child);
  });
  return filtered;
}
const AnimatePresence = ({ children, custom, initial = true, onExitComplete, presenceAffectsLayout = true, mode = "sync", propagate = false, anchorX = "left", anchorY = "top", root }) => {
  const [isParentPresent, safeToRemove] = usePresence(propagate);
  const presentChildren = reactExports.useMemo(() => onlyElements(children), [children]);
  const presentKeys = propagate && !isParentPresent ? [] : presentChildren.map(getChildKey);
  const isInitialRender = reactExports.useRef(true);
  const pendingPresentChildren = reactExports.useRef(presentChildren);
  const exitComplete = useConstant(() => /* @__PURE__ */ new Map());
  const exitingComponents = reactExports.useRef(/* @__PURE__ */ new Set());
  const [diffedChildren, setDiffedChildren] = reactExports.useState(presentChildren);
  const [renderedChildren, setRenderedChildren] = reactExports.useState(presentChildren);
  useIsomorphicLayoutEffect(() => {
    isInitialRender.current = false;
    pendingPresentChildren.current = presentChildren;
    for (let i = 0; i < renderedChildren.length; i++) {
      const key = getChildKey(renderedChildren[i]);
      if (!presentKeys.includes(key)) {
        if (exitComplete.get(key) !== true) {
          exitComplete.set(key, false);
        }
      } else {
        exitComplete.delete(key);
        exitingComponents.current.delete(key);
      }
    }
  }, [renderedChildren, presentKeys.length, presentKeys.join("-")]);
  const exitingChildren = [];
  if (presentChildren !== diffedChildren) {
    let nextChildren = [...presentChildren];
    for (let i = 0; i < renderedChildren.length; i++) {
      const child = renderedChildren[i];
      const key = getChildKey(child);
      if (!presentKeys.includes(key)) {
        nextChildren.splice(i, 0, child);
        exitingChildren.push(child);
      }
    }
    if (mode === "wait" && exitingChildren.length) {
      nextChildren = exitingChildren;
    }
    setRenderedChildren(onlyElements(nextChildren));
    setDiffedChildren(presentChildren);
    return null;
  }
  const { forceRender } = reactExports.useContext(LayoutGroupContext);
  return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: renderedChildren.map((child) => {
    const key = getChildKey(child);
    const isPresent = propagate && !isParentPresent ? false : presentChildren === renderedChildren || presentKeys.includes(key);
    const onExit = () => {
      if (exitingComponents.current.has(key)) {
        return;
      }
      if (exitComplete.has(key)) {
        exitingComponents.current.add(key);
        exitComplete.set(key, true);
      } else {
        return;
      }
      let isEveryExitComplete = true;
      exitComplete.forEach((isExitComplete) => {
        if (!isExitComplete)
          isEveryExitComplete = false;
      });
      if (isEveryExitComplete) {
        forceRender == null ? void 0 : forceRender();
        setRenderedChildren(pendingPresentChildren.current);
        propagate && (safeToRemove == null ? void 0 : safeToRemove());
        onExitComplete && onExitComplete();
      }
    };
    return jsxRuntimeExports.jsx(PresenceChild, { isPresent, initial: !isInitialRender.current || initial ? void 0 : false, custom, presenceAffectsLayout, mode, root, onExitComplete: isPresent ? void 0 : onExit, anchorX, anchorY, children: child }, key);
  }) });
};
const CATEGORIES = [
  { label: "All", value: "all" },
  { label: "Reality TV", value: Category.RealityTV },
  { label: "Drama", value: Category.Drama },
  { label: "Comedy", value: Category.Comedy },
  { label: "Exclusive", value: Category.Exclusive }
];
const POPULAR_SEARCHES = [
  {
    label: "Reality TV",
    Icon: Tv,
    color: "text-amber-400",
    bgColor: "bg-amber-400/10 border-amber-400/20"
  },
  {
    label: "Drama",
    Icon: Sparkles,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10 border-purple-400/20"
  },
  {
    label: "Comedy",
    Icon: TrendingUp,
    color: "text-green-400",
    bgColor: "bg-green-400/10 border-green-400/20"
  },
  {
    label: "Exclusive",
    Icon: Sparkles,
    color: "text-primary",
    bgColor: "bg-primary/10 border-primary/20"
  },
  {
    label: "Sci-Fi",
    Icon: Tv,
    color: "text-primary",
    bgColor: "bg-primary/10 border-primary/20"
  },
  {
    label: "Thriller",
    Icon: TrendingUp,
    color: "text-red-400",
    bgColor: "bg-red-400/10 border-red-400/20"
  }
];
function SearchPage() {
  const search = useSearch({ from: "/search" });
  const navigate = useNavigate();
  const inputRef = reactExports.useRef(null);
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const [query, setQuery] = reactExports.useState(search.q ?? "");
  const [activeCategory, setActiveCategory] = reactExports.useState(
    "all"
  );
  const didInit = reactExports.useRef(false);
  reactExports.useEffect(() => {
    var _a;
    if (!didInit.current) {
      didInit.current = true;
      const q = search.q ?? "";
      setQuery(q);
      (_a = inputRef.current) == null ? void 0 : _a.focus();
    }
  }, [search]);
  reactExports.useEffect(() => {
    const t = setTimeout(() => {
      void navigate({
        to: "/search",
        search: { q: query },
        replace: true
      });
    }, 300);
    return () => clearTimeout(t);
  }, [query, navigate]);
  const { data: searchResults = [] } = useQuery({
    queryKey: ["searchShows", query.trim()],
    queryFn: async () => {
      if (!actor || !query.trim()) return [];
      return actor.searchShows(query.trim());
    },
    enabled: !!actor && !actorFetching && query.trim().length > 0
  });
  const { data: trendingShows = [] } = useQuery({
    queryKey: ["trendingShows"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTrendingShows();
    },
    enabled: !!actor && !actorFetching
  });
  const filteredShows = reactExports.useMemo(() => {
    let shows = searchResults;
    if (activeCategory !== "all") {
      shows = shows.filter((s) => s.category === activeCategory);
    }
    return shows;
  }, [searchResults, activeCategory]);
  const hasQuery = query.trim().length > 0;
  function handlePopularSearch(label) {
    var _a;
    setQuery(label);
    (_a = inputRef.current) == null ? void 0 : _a.focus();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card/60 backdrop-blur-xl border-b border-border/40 sticky top-0 z-20 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-2xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: inputRef,
          type: "search",
          value: query,
          onChange: (e) => setQuery(e.target.value),
          placeholder: "Search shows, genres...",
          className: "w-full pl-12 pr-12 py-3 bg-muted/50 border border-border hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl text-foreground placeholder:text-muted-foreground outline-none transition-smooth text-sm sm:text-base",
          "data-ocid": "search-input",
          "aria-label": "Search Zyro TV"
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
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: !hasQuery ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { duration: 0.3 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-display font-semibold text-foreground mb-4", children: "Popular Searches" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-10", children: POPULAR_SEARCHES.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.button,
            {
              type: "button",
              initial: { opacity: 0, scale: 0.9 },
              animate: { opacity: 1, scale: 1 },
              transition: { delay: i * 0.05 },
              onClick: () => handlePopularSearch(item.label),
              className: `glass-card rounded-xl p-4 flex flex-col items-center gap-2 border ${item.bgColor} transition-smooth hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] cursor-pointer`,
              "data-ocid": "popular-search-pill",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(item.Icon, { className: `w-6 h-6 ${item.color}` }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: item.label })
              ]
            },
            item.label
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-display font-semibold text-foreground mb-4", children: "Trending Shows" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4", children: [
            trendingShows.map((show, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: i * 0.07 },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShowCard, { show })
              },
              String(show.id)
            )),
            trendingShows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-full text-center py-10 text-muted-foreground text-sm", children: "No trending shows yet" })
          ] })
        ]
      },
      "empty"
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { duration: 0.3 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-5 flex-wrap", children: CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setActiveCategory(cat.value),
              className: `px-3 py-1.5 rounded-full text-xs font-medium border transition-smooth ${activeCategory === cat.value ? "border-primary bg-primary/20 text-primary" : "border-border/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"}`,
              "data-ocid": "category-filter-pill",
              children: cat.label
            },
            cat.value
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-5", children: filteredShows.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            "Found",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: filteredShows.length }),
            " ",
            "result",
            filteredShows.length !== 1 ? "s" : "",
            " for",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground font-medium", children: [
              '"',
              query,
              '"'
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            "No results for",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground font-medium", children: [
              '"',
              query,
              '"'
            ] })
          ] }) }),
          filteredShows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.95 },
              animate: { opacity: 1, scale: 1 },
              className: "flex flex-col items-center justify-center py-24 text-center",
              "data-ocid": "search-empty-state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 rounded-full bg-muted/50 border border-border/40 flex items-center justify-center mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-10 h-10 text-muted-foreground" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xl font-display font-bold text-foreground mb-2", children: [
                  'No results for "',
                  query,
                  '"'
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-xs mb-6", children: "Try different keywords or browse by category below." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 justify-center", children: POPULAR_SEARCHES.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => handlePopularSearch(p.label),
                    className: "px-3 py-1.5 rounded-full text-xs font-medium border border-border/40 text-muted-foreground hover:border-primary/40 hover:text-primary transition-smooth",
                    children: p.label
                  },
                  p.label
                )) })
              ]
            }
          ),
          filteredShows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4", children: filteredShows.map((show, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 16 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: i * 0.05 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShowCard, { show })
            },
            String(show.id)
          )) })
        ]
      },
      "results"
    ) }) })
  ] });
}
export {
  SearchPage as default
};
