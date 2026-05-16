import { j as jsxRuntimeExports, l as cn, u as useAuthStore, g as useNavigate, r as reactExports, L as Link } from "./index-BiC3Bukn.js";
import { F as Film } from "./film-DdtsYYYl.js";
import { P as Play } from "./play-BUJyb-yg.js";
import { L as LockOpen } from "./lock-open-IhH0KOXI.js";
import { C as Check } from "./check-Cliyqnti.js";
import { P as Plus } from "./plus-UP_q622i.js";
const categoryStyles = {
  "Reality TV": "bg-rose-500/15 text-rose-400 border border-rose-500/30",
  RealityTV: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
  Drama: "bg-primary/15 text-primary border border-primary/30",
  Comedy: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  Exclusive: "bg-primary/15 text-primary border border-primary/30"
};
const categoryLabels = {
  RealityTV: "Reality TV"
};
function CategoryBadge({ category, className }) {
  const style = categoryStyles[category] ?? "bg-muted/30 text-muted-foreground border border-border/40";
  const label = categoryLabels[category] ?? category;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-display font-semibold tracking-wide",
        style,
        className
      ),
      children: label
    }
  );
}
function getShowId(show) {
  return String(show.id);
}
function getTitle(show) {
  return show.title;
}
function getCoverUrl(show) {
  if ("coverImageUrl" in show && show.coverImageUrl) {
    return show.coverImageUrl;
  }
  const local = show;
  return local.coverImageUrl || void 0;
}
function getCategory(show) {
  return show.category;
}
function getIsFree(show) {
  if ("coverImageUrl" in show) return show.isFree;
  const local = show;
  return local.isFree === true || local.requiresSubscription === "Free";
}
function getIsTrending(show) {
  if ("coverImageUrl" in show) return false;
  return show.isTrending;
}
function getIsExclusive(show) {
  if ("coverImageUrl" in show) return show.category === "Exclusive";
  return show.isExclusive;
}
function ShowCard({ show, className }) {
  const { isInWatchlist, toggleWatchlist, isLoggedIn } = useAuthStore();
  const navigate = useNavigate();
  const id = getShowId(show);
  const inWatchlist = isInWatchlist(id);
  const isFree = getIsFree(show);
  const isTrending = getIsTrending(show);
  const isExclusive = getIsExclusive(show);
  const [imgError, setImgError] = reactExports.useState(false);
  const coverUrl = getCoverUrl(show);
  const hasImage = !!coverUrl && !imgError;
  function handleWatchlist(e) {
    e.preventDefault();
    e.stopPropagation();
    if (isLoggedIn) toggleWatchlist(id);
  }
  function handlePlay(e) {
    e.preventDefault();
    e.stopPropagation();
    void navigate({
      to: "/show/$showId",
      params: { showId: id }
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `group relative rounded-lg overflow-hidden bg-card border border-border/40 transition-smooth hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(168,85,247,0.25)] hover:border-primary/40 cursor-pointer ${className ?? ""}`,
      "data-ocid": "show-card",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/show/$showId", params: { showId: id }, className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[2/3] overflow-hidden", children: [
          hasImage ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: coverUrl,
              alt: getTitle(show),
              className: "w-full h-full object-cover transition-smooth group-hover:scale-105",
              loading: "lazy",
              onError: () => setImgError(true)
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-gradient-to-br from-primary/10 via-muted/30 to-background flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "w-10 h-10 text-muted-foreground/40" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-smooth" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: handlePlay,
              className: "w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.6)] hover:bg-primary transition-smooth",
              "aria-label": `Play ${getTitle(show)}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-5 h-5 text-white fill-white ml-0.5" })
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-2 left-2 flex flex-col gap-1", children: [
            isExclusive && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-1.5 py-0.5 text-[10px] font-display font-bold bg-primary text-primary-foreground rounded uppercase tracking-wider", children: "Exclusive" }),
            isTrending && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-1.5 py-0.5 text-[10px] font-display font-bold bg-amber-500/90 text-black rounded uppercase tracking-wider", children: "Trending" }),
            isFree && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-display font-bold bg-emerald-500/90 text-black rounded uppercase tracking-wider", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LockOpen, { className: "w-2.5 h-2.5" }),
              "Free"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: handleWatchlist,
              className: "absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-border/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth hover:bg-primary/80 hover:border-primary",
              "aria-label": inWatchlist ? "Remove from watchlist" : "Add to watchlist",
              children: inWatchlist ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 text-foreground" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm text-foreground truncate leading-tight group-hover:text-primary transition-colors", children: getTitle(show) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryBadge, { category: getCategory(show) }),
          isFree && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-400 font-semibold", children: "Free" }) })
        ] })
      ] })
    }
  );
}
export {
  CategoryBadge as C,
  ShowCard as S
};
