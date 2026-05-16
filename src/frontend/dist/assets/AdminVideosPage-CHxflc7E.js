import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, l as cn, X, R as ReactDOM, s as useAdminStore, a as useActor, h as useQueryClient, C as Category, b as useQuery, f as ChevronDown, d as createActor } from "./index-BiC3Bukn.js";
import { F as Film } from "./film-DdtsYYYl.js";
import { C as CircleAlert } from "./circle-alert-2UkViAKo.js";
import { C as CircleCheckBig } from "./circle-check-big-BD4jnPKH.js";
import { u as useVideoUpload } from "./useVideoUpload-CrjDZ9HL.js";
import { A as AdminNav, F as Flag } from "./AdminPage-CeISIFGI.js";
import { P as Plus } from "./plus-UP_q622i.js";
import { L as LockOpen } from "./lock-open-IhH0KOXI.js";
import { T as Tv } from "./tv-c6wygwpJ.js";
import { T as Trash2 } from "./trash-2-BdSAybum.js";
import "./useMutation-BlzaivA3.js";
import "./button-BnI6w-mQ.js";
import "./trending-up-JNvejBpN.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]];
const ChevronUp = createLucideIcon("chevron-up", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  [
    "path",
    {
      d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
      key: "sc7q7i"
    }
  ]
];
const Funnel = createLucideIcon("funnel", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M9 17H7A5 5 0 0 1 7 7h2", key: "8i5ue5" }],
  ["path", { d: "M15 7h2a5 5 0 1 1 0 10h-2", key: "1b9ql8" }],
  ["line", { x1: "8", x2: "16", y1: "12", y2: "12", key: "1jonct" }]
];
const Link2 = createLucideIcon("link-2", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
];
const Pencil = createLucideIcon("pencil", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
];
const Upload = createLucideIcon("upload", __iconNode);
const ACCEPT = "video/mp4,video/webm,video/quicktime,video/x-msvideo,video/x-matroska,.mp4,.webm,.mov,.avi,.mkv";
function formatFileName(name, maxLen = 36) {
  if (name.length <= maxLen) return name;
  const ext = name.lastIndexOf(".");
  if (ext > 0) {
    return `${name.slice(0, maxLen - 3 - (name.length - ext))}...${name.slice(ext)}`;
  }
  return `${name.slice(0, maxLen)}...`;
}
function isExternalLink(url) {
  return url.startsWith("http://") || url.startsWith("https://");
}
function PortalFileInput({ inputRef, onChange, ocid }) {
  return ReactDOM.createPortal(
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        ref: inputRef,
        type: "file",
        accept: ACCEPT,
        form: "",
        onChange,
        className: "sr-only",
        "data-ocid": ocid,
        tabIndex: -1,
        onClick: (e) => {
          e.stopPropagation();
        },
        "aria-hidden": "true"
      }
    ),
    document.body
  );
}
function VideoUploadZone({
  value,
  onChange,
  uploadFile,
  error,
  existingUrl,
  ocidPrefix = "video-upload"
}) {
  const [uploadState, setUploadState] = reactExports.useState({
    status: "idle"
  });
  const [showLinkInput, setShowLinkInput] = reactExports.useState(false);
  const [linkValue, setLinkValue] = reactExports.useState(
    value && isExternalLink(value) ? value : ""
  );
  const fileInputRef = reactExports.useRef(null);
  const [mounted, setMounted] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  const processFile = reactExports.useCallback(
    async (file) => {
      if (!file.type.startsWith("video/")) {
        setUploadState({
          status: "error",
          message: "Please select a valid video file (MP4, WebM, MOV, AVI, MKV)"
        });
        return;
      }
      setUploadState({
        status: "uploading",
        progress: 10,
        fileName: file.name
      });
      if (uploadFile) {
        try {
          const url = await uploadFile(file, (progress) => {
            setUploadState(
              (s) => s.status === "uploading" ? { ...s, progress } : s
            );
          });
          setUploadState({ status: "done", fileName: file.name, url });
          onChange(url);
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Upload failed. Please try again.";
          setUploadState({ status: "error", message: msg });
        }
      } else {
        try {
          setUploadState({
            status: "uploading",
            progress: 30,
            fileName: file.name
          });
          const arrayBuffer = await file.arrayBuffer();
          const blob = new Blob([arrayBuffer], { type: file.type });
          const url = URL.createObjectURL(blob);
          setUploadState({ status: "done", fileName: file.name, url });
          onChange(url);
        } catch {
          setUploadState({
            status: "error",
            message: "Failed to read file. Please try again."
          });
        }
      }
    },
    [uploadFile, onChange]
  );
  function handleFileChange(e) {
    var _a;
    e.stopPropagation();
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    e.target.value = "";
    if (file) {
      void processFile(file);
    }
  }
  function handleDrop(e) {
    var _a;
    e.preventDefault();
    e.stopPropagation();
    setUploadState((s) => s.status === "uploading" ? s : { status: "idle" });
    const file = (_a = e.dataTransfer.files) == null ? void 0 : _a[0];
    if (file) void processFile(file);
  }
  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    setUploadState(
      (s) => s.status === "idle" || s.status === "dragging" ? { status: "dragging" } : s
    );
  }
  function handleDragLeave(e) {
    e.preventDefault();
    setUploadState((s) => s.status === "dragging" ? { status: "idle" } : s);
  }
  function handleReset() {
    setUploadState({ status: "idle" });
    setLinkValue("");
    onChange("");
  }
  function handleLinkChange(url) {
    setLinkValue(url);
    if (url.trim()) onChange(url.trim());
  }
  function openFilePicker() {
    requestAnimationFrame(() => {
      var _a;
      (_a = fileInputRef.current) == null ? void 0 : _a.click();
    });
  }
  const isDragging = uploadState.status === "dragging";
  const isUploading = uploadState.status === "uploading";
  const isDone = uploadState.status === "done";
  const isError = uploadState.status === "error";
  const showExisting = existingUrl && uploadState.status === "idle" && !linkValue;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    mounted && /* @__PURE__ */ jsxRuntimeExports.jsx(
      PortalFileInput,
      {
        inputRef: fileInputRef,
        onChange: handleFileChange,
        ocid: `${ocidPrefix}-file-input`
      }
    ),
    showExisting && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/5 border border-primary/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "w-4 h-4 text-primary flex-shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Current video" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground truncate", children: isExternalLink(existingUrl) ? "Video linked" : "Uploaded video file" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-primary/70 font-medium bg-primary/10 px-2 py-0.5 rounded-full", children: "Active" })
    ] }),
    !isDone && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onDrop: handleDrop,
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onClick: () => {
          if (!isUploading) openFilePicker();
        },
        "aria-label": "Upload video file — click to browse or drag and drop",
        "data-ocid": `${ocidPrefix}-dropzone`,
        className: cn(
          "w-full rounded-xl border-2 border-dashed transition-all duration-300 overflow-hidden cursor-pointer text-left",
          isDragging ? "border-primary bg-primary/10 shadow-[0_0_30px_oklch(var(--primary)/0.25)]" : isUploading ? "border-primary/40 bg-primary/5 cursor-default" : isError ? "border-destructive/50 bg-destructive/5" : "border-border/50 bg-muted/10 hover:border-primary/50 hover:bg-primary/5 hover:shadow-[0_0_20px_oklch(var(--primary)/0.15)]"
        ),
        children: isUploading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-8 flex flex-col items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-14 h-14 flex items-center justify-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-full border-2 border-primary/20" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin",
                style: { animationDuration: "1.1s" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "w-6 h-6 text-primary" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-xs space-y-2 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-display font-semibold text-foreground truncate max-w-full", children: uploadState.status === "uploading" && formatFileName(uploadState.fileName) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-1.5 bg-muted/40 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500",
                style: {
                  width: `${uploadState.status === "uploading" ? uploadState.progress : 0}%`
                }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Uploading",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-medium", children: [
                uploadState.status === "uploading" ? Math.round(uploadState.progress) : 0,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground/60", children: "Keep this page open while uploading" })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-8 flex flex-col items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300",
                isDragging ? "bg-primary/20 shadow-[0_0_24px_oklch(var(--primary)/0.4)] scale-110" : "bg-primary/10"
              ),
              children: isDragging ? /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-7 h-7 text-primary animate-bounce" }) : isError ? /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "w-7 h-7 text-destructive" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "w-7 h-7 text-primary" })
            }
          ),
          isError ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-1 max-w-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1.5 mb-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 text-destructive flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-display font-semibold text-destructive", children: "Upload failed" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: uploadState.message }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-primary mt-2 font-medium", children: "↑ Click or drop a file to try again" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-display font-semibold text-foreground", children: "Drop your video here" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "or",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold underline underline-offset-2", children: "browse files" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground/70 pt-0.5", children: "MP4, WebM, MOV, AVI, MKV · Large files supported" })
          ] })
        ] })
      }
    ),
    isDone && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-3 px-4 py-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25",
        "data-ocid": `${ocidPrefix}-success`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-5 h-5 text-emerald-400" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-display font-semibold text-foreground", children: "Video ready" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: uploadState.status === "done" && formatFileName(uploadState.fileName) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: (e) => {
                e.stopPropagation();
                handleReset();
              },
              "aria-label": "Remove video",
              "data-ocid": `${ocidPrefix}-remove-btn`,
              className: "w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-smooth flex-shrink-0",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setShowLinkInput((v) => !v),
          "data-ocid": `${ocidPrefix}-link-toggle`,
          className: "flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-smooth",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "w-3.5 h-3.5" }),
            showLinkInput ? "Hide link input" : "Or paste a link (YouTube, Vimeo, etc.)"
          ]
        }
      ),
      showLinkInput && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "url",
            value: linkValue,
            onChange: (e) => handleLinkChange(e.target.value),
            onBlur: () => {
              if (linkValue.trim()) onChange(linkValue.trim());
            },
            placeholder: "https://youtube.com/watch?v=... or Vimeo, .mp4 link",
            "data-ocid": `${ocidPrefix}-link-input`,
            className: "w-full pl-9 pr-3 py-2 rounded-lg bg-muted/30 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth"
          }
        )
      ] })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "p",
      {
        className: "text-xs text-destructive",
        "data-ocid": `${ocidPrefix}-field-error`,
        children: error
      }
    )
  ] });
}
const STATUS_STYLES = {
  Approved: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  Pending: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  Flagged: "bg-destructive/15 text-destructive border border-destructive/30"
};
const FILTER_TABS = ["All", "Pending", "Approved", "Flagged"];
const CATEGORY_OPTIONS = [
  { value: Category.Drama, label: "Drama" },
  { value: Category.RealityTV, label: "Reality TV" },
  { value: Category.Comedy, label: "Comedy" },
  { value: Category.Exclusive, label: "Exclusive" }
];
const EMPTY_SHOW = {
  title: "",
  description: "",
  category: Category.Drama,
  isFree: false
};
const EMPTY_EPISODE = {
  seasonNumber: "1",
  episodeNumber: "",
  title: "",
  description: "",
  videoUrl: "",
  thumbnailUrl: "",
  duration: ""
};
function toShowRow(show) {
  const status = show.isApproved ? "Approved" : "Pending";
  return {
    id: String(show.id),
    title: show.title,
    category: show.category,
    status,
    coverUrl: show.coverImageUrl ?? "",
    isFree: show.isFree
  };
}
function ModalHeader({
  icon,
  title,
  subtitle,
  onClose,
  ocid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border/40", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      icon,
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-bold text-foreground", children: title })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
      subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "max-w-[140px] truncate", children: subtitle }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onClose,
          className: "w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-smooth",
          "aria-label": "Close",
          "data-ocid": ocid,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
        }
      )
    ] })
  ] });
}
function AddEpisodeModal({
  show,
  onClose,
  onSuccess
}) {
  const { actor } = useActor(createActor);
  const { uploadFile } = useVideoUpload();
  const [form, setForm] = reactExports.useState(EMPTY_EPISODE);
  const [errors, setErrors] = reactExports.useState({});
  const [submitting, setSubmitting] = reactExports.useState(false);
  const maxSeasons = Math.max(Number(show.seasonCount ?? 1), 1);
  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = "Episode title is required";
    if (!form.episodeNumber.trim())
      e.episodeNumber = "Episode number is required";
    if (!form.videoUrl.trim()) e.videoUrl = "Video URL is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  async function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate() || !actor) return;
    setSubmitting(true);
    try {
      const showId = show.id;
      let seasonId;
      const seasons = await actor.listSeasons(showId);
      const targetNum = BigInt(
        form.seasonNumber === "new" ? seasons.length + 1 : form.seasonNumber
      );
      const existing = seasons.find((s) => s.seasonNumber === targetNum);
      if (existing) {
        seasonId = existing.id;
      } else {
        seasonId = await actor.createSeason({
          showId,
          seasonNumber: targetNum,
          title: `Season ${String(targetNum)}`
        });
      }
      const durationSec = form.duration ? BigInt(Math.round(Number.parseFloat(form.duration) * 60)) : BigInt(0);
      await actor.createEpisode({
        title: form.title,
        showId,
        description: form.description,
        seasonId,
        episodeNumber: BigInt(form.episodeNumber),
        durationSeconds: durationSec,
        videoUrl: form.videoUrl.trim() || void 0,
        thumbnailUrl: form.thumbnailUrl.trim() || void 0
      });
      onSuccess(`Episode "${form.title}" added to ${show.title}`);
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to add episode";
      setErrors((prev) => ({ ...prev, title: msg }));
    } finally {
      setSubmitting(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm",
      "data-ocid": "add-episode-modal",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-lg glass-card rounded-2xl border border-primary/30 shadow-2xl overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ModalHeader,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "w-4 h-4 text-primary" }),
            title: "Add Episode",
            subtitle: show.title,
            onClose,
            ocid: "close-episode-modal"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          EpisodeFormBody,
          {
            form,
            setForm,
            errors,
            maxSeasons,
            submitting,
            submitLabel: "Add Episode",
            submittingLabel: "Adding...",
            submitIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            onSubmit: handleSubmit,
            onCancel: onClose,
            cancelOcid: "cancel-episode-btn",
            submitOcid: "save-episode-btn",
            uploadFile
          }
        )
      ] })
    }
  );
}
function EpisodeFormBody({
  form,
  setForm,
  errors,
  maxSeasons,
  submitting,
  submitLabel,
  submittingLabel,
  submitIcon,
  onSubmit,
  onCancel,
  cancelOcid,
  submitOcid,
  existingVideoUrl,
  uploadFile
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "label",
          {
            htmlFor: "modal-ep-season",
            className: "block text-xs font-medium text-muted-foreground mb-1.5",
            children: [
              "Season ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            id: "modal-ep-season",
            value: form.seasonNumber,
            onChange: (e) => setForm((f) => ({ ...f, seasonNumber: e.target.value })),
            className: "w-full px-3 py-2 rounded-lg bg-muted/30 border border-border/60 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth",
            "data-ocid": "ep-season-select",
            children: [
              Array.from({ length: maxSeasons }, (_, i) => i + 1).map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: String(n), children: [
                "Season ",
                n
              ] }, n)),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "new", children: "+ New Season" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "label",
          {
            htmlFor: "modal-ep-number",
            className: "block text-xs font-medium text-muted-foreground mb-1.5",
            children: [
              "Episode # ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id: "modal-ep-number",
            type: "number",
            min: "1",
            value: form.episodeNumber,
            onChange: (e) => setForm((f) => ({ ...f, episodeNumber: e.target.value })),
            placeholder: "e.g. 1",
            className: "w-full px-3 py-2 rounded-lg bg-muted/30 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth",
            "data-ocid": "ep-number-input"
          }
        ),
        errors.episodeNumber && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-destructive", children: errors.episodeNumber })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "label",
        {
          htmlFor: "modal-ep-title",
          className: "block text-xs font-medium text-muted-foreground mb-1.5",
          children: [
            "Episode Title ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          id: "modal-ep-title",
          type: "text",
          value: form.title,
          onChange: (e) => setForm((f) => ({ ...f, title: e.target.value })),
          placeholder: "e.g. The Beginning",
          className: "w-full px-3 py-2 rounded-lg bg-muted/30 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth",
          "data-ocid": "ep-title-input"
        }
      ),
      errors.title && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-destructive", children: errors.title })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "label",
        {
          htmlFor: "modal-ep-desc",
          className: "block text-xs font-medium text-muted-foreground mb-1.5",
          children: "Description"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          id: "modal-ep-desc",
          value: form.description,
          rows: 2,
          onChange: (e) => setForm((f) => ({ ...f, description: e.target.value })),
          placeholder: "What happens in this episode?",
          className: "w-full px-3 py-2 rounded-lg bg-muted/30 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth resize-none",
          "data-ocid": "ep-desc-textarea"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-medium text-muted-foreground mb-1.5", children: [
        "Video ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        VideoUploadZone,
        {
          value: form.videoUrl,
          onChange: (url) => setForm((f) => ({ ...f, videoUrl: url })),
          uploadFile,
          error: errors.videoUrl,
          existingUrl: existingVideoUrl,
          ocidPrefix: "ep-video"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "modal-ep-thumb-url",
            className: "block text-xs font-medium text-muted-foreground mb-1.5",
            children: "Thumbnail URL"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "modal-ep-thumb-url",
              type: "url",
              value: form.thumbnailUrl,
              onChange: (e) => setForm((f) => ({ ...f, thumbnailUrl: e.target.value })),
              placeholder: "https://...",
              className: "w-full pl-9 pr-3 py-2 rounded-lg bg-muted/30 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth",
              "data-ocid": "ep-thumb-url-input"
            }
          )
        ] }),
        form.thumbnailUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 w-full aspect-video rounded-lg overflow-hidden bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: form.thumbnailUrl,
            alt: "Thumbnail preview",
            className: "w-full h-full object-cover",
            onError: (e) => {
              e.currentTarget.style.display = "none";
            }
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "modal-ep-duration",
            className: "block text-xs font-medium text-muted-foreground mb-1.5",
            children: "Duration (mins)"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id: "modal-ep-duration",
            type: "number",
            min: "1",
            value: form.duration,
            onChange: (e) => setForm((f) => ({ ...f, duration: e.target.value })),
            placeholder: "e.g. 45",
            className: "w-full px-3 py-2 rounded-lg bg-muted/30 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth",
            "data-ocid": "ep-duration-input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[10px] text-muted-foreground", children: "Leave blank if unknown" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-3 pt-2 border-t border-border/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onCancel,
          className: "px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-smooth",
          "data-ocid": cancelOcid,
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          disabled: submitting,
          onClick: (e) => onSubmit(e),
          className: "flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-smooth disabled:opacity-60",
          "data-ocid": submitOcid,
          children: [
            submitIcon,
            submitting ? submittingLabel : submitLabel
          ]
        }
      )
    ] })
  ] });
}
function EditEpisodeModal({
  episode,
  maxSeasons,
  onClose,
  onSuccess
}) {
  const { actor } = useActor(createActor);
  const { uploadFile } = useVideoUpload();
  const [form, setForm] = reactExports.useState({
    seasonNumber: "1",
    // season is fixed during edit; shown for info only
    episodeNumber: String(episode.episodeNumber),
    title: episode.title,
    description: episode.description,
    videoUrl: episode.videoUrl ?? "",
    thumbnailUrl: episode.thumbnailUrl ?? "",
    duration: episode.durationSeconds ? String(Math.round(Number(episode.durationSeconds) / 60)) : ""
  });
  const [errors, setErrors] = reactExports.useState({});
  const [submitting, setSubmitting] = reactExports.useState(false);
  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = "Episode title is required";
    if (!form.episodeNumber.trim())
      e.episodeNumber = "Episode number is required";
    if (!form.videoUrl.trim()) e.videoUrl = "Video URL is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  async function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate() || !actor) return;
    setSubmitting(true);
    try {
      const durationSec = form.duration ? BigInt(Math.round(Number.parseFloat(form.duration) * 60)) : BigInt(0);
      const epResult = await actor.updateEpisode(episode.id, {
        title: form.title,
        description: form.description,
        episodeNumber: BigInt(form.episodeNumber),
        durationSeconds: durationSec,
        videoUrl: form.videoUrl.trim() || void 0,
        thumbnailUrl: form.thumbnailUrl.trim() || void 0
      });
      if (epResult.__kind__ === "err") {
        throw new Error(epResult.err);
      }
      onSuccess(`Episode "${form.title}" updated successfully`);
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update episode";
      setErrors((prev) => ({ ...prev, title: msg }));
    } finally {
      setSubmitting(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm",
      "data-ocid": "edit-episode-modal",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-lg glass-card rounded-2xl border border-primary/30 shadow-2xl overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ModalHeader,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-4 h-4 text-primary" }),
            title: "Edit Episode",
            subtitle: episode.title,
            onClose,
            ocid: "close-edit-episode-modal"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          EpisodeFormBody,
          {
            form,
            setForm,
            errors,
            maxSeasons,
            submitting,
            submitLabel: "Save Changes",
            submittingLabel: "Saving...",
            submitIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-4 h-4" }),
            onSubmit: handleSubmit,
            onCancel: onClose,
            cancelOcid: "cancel-edit-episode-btn",
            submitOcid: "save-edit-episode-btn",
            existingVideoUrl: episode.videoUrl,
            uploadFile
          }
        )
      ] })
    }
  );
}
function EditSeasonModal({
  season,
  onClose,
  onSuccess
}) {
  const { actor } = useActor(createActor);
  const [title, setTitle] = reactExports.useState(season.title);
  const [seasonNumber, setSeasonNumber] = reactExports.useState(String(season.seasonNumber));
  const [error, setError] = reactExports.useState(null);
  const [submitting, setSubmitting] = reactExports.useState(false);
  async function handleSubmit(ev) {
    ev.preventDefault();
    if (!title.trim()) {
      setError("Season title is required");
      return;
    }
    if (!seasonNumber.trim() || Number.isNaN(Number(seasonNumber))) {
      setError("Valid season number is required");
      return;
    }
    if (!actor) return;
    setSubmitting(true);
    setError(null);
    try {
      const seasonResult = await actor.updateSeason(season.id, {
        title: title.trim(),
        seasonNumber: BigInt(seasonNumber)
      });
      if (seasonResult.__kind__ === "err") {
        throw new Error(seasonResult.err);
      }
      onSuccess(`Season "${title}" updated successfully`);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update season");
    } finally {
      setSubmitting(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm",
      "data-ocid": "edit-season-modal",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-md glass-card rounded-2xl border border-primary/30 shadow-2xl overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ModalHeader,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-4 h-4 text-primary" }),
            title: "Edit Season",
            subtitle: season.title,
            onClose,
            ocid: "close-edit-season-modal"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "px-6 py-5 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "label",
              {
                htmlFor: "edit-season-number",
                className: "block text-xs font-medium text-muted-foreground mb-1.5",
                children: [
                  "Season Number ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "edit-season-number",
                type: "number",
                min: "1",
                value: seasonNumber,
                onChange: (e) => setSeasonNumber(e.target.value),
                className: "w-full px-3 py-2 rounded-lg bg-muted/30 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth",
                "data-ocid": "season-number-input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "label",
              {
                htmlFor: "edit-season-title",
                className: "block text-xs font-medium text-muted-foreground mb-1.5",
                children: [
                  "Season Title ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "edit-season-title",
                type: "text",
                value: title,
                onChange: (e) => setTitle(e.target.value),
                placeholder: "e.g. Season 1",
                className: "w-full px-3 py-2 rounded-lg bg-muted/30 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth",
                "data-ocid": "season-title-input"
              }
            )
          ] }),
          error && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-destructive",
              "data-ocid": "edit-season-error",
              children: error
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-3 pt-2 border-t border-border/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                className: "px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-smooth",
                "data-ocid": "cancel-edit-season-btn",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "submit",
                disabled: submitting,
                className: "flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-smooth disabled:opacity-60",
                "data-ocid": "save-edit-season-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-4 h-4" }),
                  submitting ? "Saving..." : "Save Changes"
                ]
              }
            )
          ] })
        ] })
      ] })
    }
  );
}
function EditShowModal({
  show,
  onClose,
  onSuccess
}) {
  const { actor } = useActor(createActor);
  const [form, setForm] = reactExports.useState({
    title: show.title,
    description: show.description,
    category: show.category,
    coverImageUrl: show.coverImageUrl ?? "",
    isFree: show.isFree
  });
  const [errors, setErrors] = reactExports.useState({});
  const [submitting, setSubmitting] = reactExports.useState(false);
  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.category) e.category = "Category is required";
    if (!form.coverImageUrl.trim())
      e.coverImageUrl = "Cover image URL is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  async function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate() || !actor) return;
    setSubmitting(true);
    try {
      await actor.updateShow({
        id: show.id,
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        coverImageUrl: form.coverImageUrl.trim() || void 0,
        trailerBlob: void 0,
        isFree: form.isFree
      });
      onSuccess(`"${form.title}" updated successfully`);
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update show";
      setErrors((prev) => ({ ...prev, title: msg }));
    } finally {
      setSubmitting(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm",
      "data-ocid": "edit-show-modal",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-lg glass-card rounded-2xl border border-primary/30 shadow-2xl overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ModalHeader,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-4 h-4 text-primary" }),
            title: "Edit Show",
            subtitle: show.title,
            onClose,
            ocid: "close-edit-show-modal"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "form",
          {
            onSubmit: handleSubmit,
            className: "px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "label",
                  {
                    htmlFor: "edit-show-title",
                    className: "block text-xs font-medium text-muted-foreground mb-1.5",
                    children: [
                      "Title ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "edit-show-title",
                    type: "text",
                    value: form.title,
                    onChange: (e) => setForm((f) => ({ ...f, title: e.target.value })),
                    placeholder: "Show title",
                    className: "w-full px-3 py-2 rounded-lg bg-muted/30 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth",
                    "data-ocid": "edit-show-title-input"
                  }
                ),
                errors.title && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-destructive", children: errors.title })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "label",
                  {
                    htmlFor: "edit-show-category",
                    className: "block text-xs font-medium text-muted-foreground mb-1.5",
                    children: [
                      "Category ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "select",
                  {
                    id: "edit-show-category",
                    value: form.category,
                    onChange: (e) => setForm((f) => ({
                      ...f,
                      category: e.target.value
                    })),
                    className: "w-full px-3 py-2 rounded-lg bg-muted/30 border border-border/60 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth",
                    "data-ocid": "edit-show-category-select",
                    children: CATEGORY_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: opt.value, children: opt.label }, opt.value))
                  }
                ),
                errors.category && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-destructive", children: errors.category })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "label",
                  {
                    htmlFor: "edit-show-desc",
                    className: "block text-xs font-medium text-muted-foreground mb-1.5",
                    children: [
                      "Description ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "textarea",
                  {
                    id: "edit-show-desc",
                    value: form.description,
                    rows: 3,
                    onChange: (e) => setForm((f) => ({ ...f, description: e.target.value })),
                    placeholder: "Describe the show...",
                    className: "w-full px-3 py-2 rounded-lg bg-muted/30 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth resize-none",
                    "data-ocid": "edit-show-desc-textarea"
                  }
                ),
                errors.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-destructive", children: errors.description })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "label",
                  {
                    htmlFor: "edit-show-cover",
                    className: "block text-xs font-medium text-muted-foreground mb-1.5",
                    children: [
                      "Cover Image URL ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      id: "edit-show-cover",
                      type: "url",
                      value: form.coverImageUrl,
                      onChange: (e) => setForm((f) => ({ ...f, coverImageUrl: e.target.value })),
                      placeholder: "https://example.com/cover.jpg",
                      className: "w-full pl-9 pr-3 py-2 rounded-lg bg-muted/30 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth",
                      "data-ocid": "edit-show-cover-input"
                    }
                  )
                ] }),
                errors.coverImageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-destructive", children: errors.coverImageUrl }),
                form.coverImageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 w-20 aspect-[2/3] rounded-lg overflow-hidden bg-muted/30 border border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: form.coverImageUrl,
                    alt: "Cover preview",
                    className: "w-full h-full object-cover",
                    onError: (e) => {
                      e.currentTarget.style.display = "none";
                    }
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    role: "switch",
                    "aria-checked": form.isFree,
                    "aria-label": "Free for non-subscribers",
                    onClick: () => setForm((f) => ({ ...f, isFree: !f.isFree })),
                    className: `relative rounded-full border transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${form.isFree ? "bg-emerald-500/80 border-emerald-500" : "bg-muted/40 border-border/60"}`,
                    style: { width: "2.5rem", height: "1.375rem" },
                    "data-ocid": "edit-show-free-toggle",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-foreground transition-transform ${form.isFree ? "translate-x-[1.125rem]" : "translate-x-0"}`
                      }
                    )
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-foreground flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(LockOpen, { className: "w-3.5 h-3.5 text-emerald-400" }),
                    "Free for non-subscribers"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: form.isFree ? "Anyone can watch — no subscription required" : "Subscribers only" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-3 pt-2 border-t border-border/50", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: onClose,
                    className: "px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-smooth",
                    "data-ocid": "cancel-edit-show-btn",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "submit",
                    disabled: submitting,
                    className: "flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-smooth disabled:opacity-60",
                    "data-ocid": "save-edit-show-btn",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-4 h-4" }),
                      submitting ? "Saving..." : "Save Changes"
                    ]
                  }
                )
              ] })
            ]
          }
        )
      ] })
    }
  );
}
function EpisodesPanel({
  show,
  onToast
}) {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [editEpisode, setEditEpisode] = reactExports.useState(null);
  const [editSeason, setEditSeason] = reactExports.useState(null);
  const { data: seasons = [], isLoading: seasonsLoading } = useQuery({
    queryKey: ["seasons-panel", String(show.id)],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSeasons(show.id);
    },
    enabled: !!actor && !actorFetching
  });
  const sortedSeasons = [...seasons].sort(
    (a, b) => Number(a.seasonNumber) - Number(b.seasonNumber)
  );
  async function handleDeleteEpisode(epId) {
    if (!actor) return;
    try {
      await actor.adminDeleteEpisode(epId);
      queryClient.invalidateQueries({
        queryKey: ["seasons-panel", String(show.id)]
      });
      onToast("Episode deleted");
    } catch {
      onToast("Failed to delete episode");
    }
  }
  function handleEpisodeEditSuccess(msg) {
    queryClient.invalidateQueries({
      queryKey: ["seasons-panel", String(show.id)]
    });
    queryClient.invalidateQueries({ queryKey: ["episodes"] });
    onToast(msg);
  }
  function handleSeasonEditSuccess(msg) {
    queryClient.invalidateQueries({
      queryKey: ["seasons-panel", String(show.id)]
    });
    queryClient.invalidateQueries({ queryKey: ["seasons", String(show.id)] });
    onToast(msg);
  }
  if (seasonsLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 space-y-2", children: [0, 1].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 bg-muted/20 rounded-lg animate-pulse" }, i)) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/5 border-t border-border/40", children: [
    editEpisode && /* @__PURE__ */ jsxRuntimeExports.jsx(
      EditEpisodeModal,
      {
        episode: editEpisode,
        maxSeasons: Math.max(Number(show.seasonCount ?? 1), 1),
        onClose: () => setEditEpisode(null),
        onSuccess: handleEpisodeEditSuccess
      }
    ),
    editSeason && /* @__PURE__ */ jsxRuntimeExports.jsx(
      EditSeasonModal,
      {
        season: editSeason,
        onClose: () => setEditSeason(null),
        onSuccess: handleSeasonEditSuccess
      }
    ),
    sortedSeasons.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center py-4", children: "No seasons yet. Add episodes to create seasons." }) : sortedSeasons.map((season) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      SeasonSection,
      {
        season,
        onEditSeason: () => setEditSeason(season),
        onEditEpisode: setEditEpisode,
        onDeleteEpisode: handleDeleteEpisode
      },
      String(season.id)
    ))
  ] });
}
function SeasonSection({
  season,
  onEditSeason,
  onEditEpisode,
  onDeleteEpisode
}) {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { data: episodes = [], isLoading } = useQuery({
    queryKey: ["episodes-panel", String(season.id)],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listEpisodes(season.id);
    },
    enabled: !!actor && !actorFetching
  });
  const sorted = [...episodes].sort(
    (a, b) => Number(a.episodeNumber) - Number(b.episodeNumber)
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border/30 last:border-b-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-2.5 bg-muted/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-display font-bold text-primary/80 uppercase tracking-wider", children: season.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
          sorted.length,
          " episode",
          sorted.length !== 1 ? "s" : ""
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: onEditSeason,
            title: "Edit season",
            "aria-label": "Edit season",
            className: "flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 text-[10px] font-semibold transition-smooth",
            "data-ocid": `edit-season-${String(season.id)}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3 h-3" }),
              "Edit"
            ]
          }
        )
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-2 space-y-1.5", children: [0, 1].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-7 bg-muted/20 rounded animate-pulse" }, i)) }) : sorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground px-4 py-2", children: "No episodes in this season." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border/20", children: sorted.map((ep) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-3 px-4 py-2 hover:bg-muted/10 transition-smooth group",
        "data-ocid": `episode-row-${String(ep.id)}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-7 rounded overflow-hidden bg-muted/30 flex-shrink-0", children: ep.thumbnailUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: ep.thumbnailUrl,
              alt: ep.title,
              className: "w-full h-full object-cover",
              onError: (e) => {
                e.currentTarget.style.display = "none";
              }
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Tv, { className: "w-3 h-3 text-muted-foreground" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-display font-medium text-foreground truncate", children: [
              "E",
              String(ep.episodeNumber),
              " — ",
              ep.title
            ] }),
            ep.durationSeconds > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
              Math.floor(Number(ep.durationSeconds) / 60),
              "m"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-smooth", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => onEditEpisode(ep),
                title: "Edit episode",
                "aria-label": "Edit episode",
                className: "p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-smooth",
                "data-ocid": `edit-episode-${String(ep.id)}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3 h-3" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => onDeleteEpisode(ep.id),
                title: "Delete episode",
                "aria-label": "Delete episode",
                className: "p-1.5 rounded-lg hover:bg-destructive/20 text-destructive transition-smooth",
                "data-ocid": `delete-episode-${String(ep.id)}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" })
              }
            )
          ] })
        ]
      },
      String(ep.id)
    )) })
  ] });
}
function AdminVideosPage({
  onTabChange
}) {
  const { isAdminAuthenticated } = useAdminStore();
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = reactExports.useState("All");
  const [toast, setToast] = reactExports.useState(null);
  const [showUploadOpen, setShowUploadOpen] = reactExports.useState(false);
  const [addEpisodeShow, setAddEpisodeShow] = reactExports.useState(null);
  const [editShowTarget, setEditShowTarget] = reactExports.useState(null);
  const [expandedShowId, setExpandedShowId] = reactExports.useState(null);
  const [showForm, setShowForm] = reactExports.useState(EMPTY_SHOW);
  const [coverUrl, setCoverUrl] = reactExports.useState("");
  const [showErrors, setShowErrors] = reactExports.useState({});
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const { data: shows, isLoading: showsLoading } = useQuery({
    queryKey: ["adminShows"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminListShows();
    },
    enabled: !!actor && !actorFetching
  });
  if (!isAdminAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center justify-center min-h-[70vh] text-center px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Please authenticate via the Admin button in the header." }) });
  }
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };
  const videoRows = (shows ?? []).map(toShowRow);
  const counts = {
    All: videoRows.length,
    Pending: videoRows.filter((v) => v.status === "Pending").length,
    Approved: videoRows.filter((v) => v.status === "Approved").length,
    Flagged: videoRows.filter((v) => v.status === "Flagged").length
  };
  const filtered = activeFilter === "All" ? videoRows : videoRows.filter((v) => v.status === activeFilter);
  async function handleApprove(id) {
    if (!actor) return;
    try {
      await actor.adminApproveShow(BigInt(id), true);
      queryClient.invalidateQueries({ queryKey: ["adminShows"] });
      showToast("Show approved and published");
    } catch {
      showToast("Failed to approve show");
    }
  }
  async function handleDelete(id) {
    if (!actor) return;
    try {
      await actor.deleteShow(BigInt(id));
      queryClient.invalidateQueries({ queryKey: ["adminShows"] });
      showToast("Show deleted from platform");
    } catch {
      showToast("Failed to delete show");
    }
  }
  async function handleToggleFree(id, currentlyFree) {
    if (!actor) return;
    const currentShow = (shows ?? []).find((s) => String(s.id) === id);
    if (!currentShow) return;
    try {
      await actor.updateShow({
        id: currentShow.id,
        title: currentShow.title,
        description: currentShow.description,
        category: currentShow.category,
        coverImageUrl: currentShow.coverImageUrl,
        trailerBlob: void 0,
        isFree: !currentlyFree
      });
      queryClient.invalidateQueries({ queryKey: ["adminShows"] });
      queryClient.invalidateQueries({ queryKey: ["approvedShows"] });
      showToast(
        !currentlyFree ? "Show marked as Free for non-subscribers" : "Show restricted to subscribers only"
      );
    } catch {
      showToast("Failed to update show access");
    }
  }
  function validateShowForm() {
    const errors = {};
    if (!showForm.title.trim()) errors.title = "Title is required";
    if (!showForm.description.trim())
      errors.description = "Description is required";
    setShowErrors(errors);
    return Object.keys(errors).length === 0;
  }
  async function handleAddShow(e) {
    e.preventDefault();
    if (!validateShowForm() || !actor) return;
    setIsSubmitting(true);
    try {
      const showId = await actor.createShow({
        title: showForm.title,
        description: showForm.description,
        category: showForm.category,
        coverImageUrl: coverUrl.trim() || void 0,
        trailerBlob: void 0,
        isFree: showForm.isFree
      });
      await actor.adminApproveShow(showId, true);
      queryClient.invalidateQueries({ queryKey: ["adminShows"] });
      queryClient.invalidateQueries({ queryKey: ["approvedShows"] });
      showToast(`Show "${showForm.title}" created successfully`);
      setShowForm(EMPTY_SHOW);
      setCoverUrl("");
      setShowErrors({});
      setShowUploadOpen(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create show";
      showToast(`Error: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  }
  function toggleExpand(id) {
    setExpandedShowId((prev) => prev === id ? null : id);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-background px-4 md:px-6 py-6 max-w-7xl mx-auto",
      "data-ocid": "admin-videos-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AdminNav, { active: "Videos", onTabChange }),
        toast && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "fixed top-6 right-6 z-50 glass-card rounded-xl px-5 py-3 text-sm font-medium text-foreground shadow-lg border border-primary/30",
            "data-ocid": "admin-toast",
            children: toast
          }
        ),
        addEpisodeShow && /* @__PURE__ */ jsxRuntimeExports.jsx(
          AddEpisodeModal,
          {
            show: addEpisodeShow,
            onClose: () => setAddEpisodeShow(null),
            onSuccess: (msg) => {
              showToast(msg);
              queryClient.invalidateQueries({ queryKey: ["adminShows"] });
              queryClient.invalidateQueries({
                queryKey: ["seasons-panel", String(addEpisodeShow.id)]
              });
            }
          }
        ),
        editShowTarget && /* @__PURE__ */ jsxRuntimeExports.jsx(
          EditShowModal,
          {
            show: editShowTarget,
            onClose: () => setEditShowTarget(null),
            onSuccess: (msg) => {
              showToast(msg);
              queryClient.invalidateQueries({ queryKey: ["adminShows"] });
              queryClient.invalidateQueries({ queryKey: ["approvedShows"] });
              setEditShowTarget(null);
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Video Management" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setShowUploadOpen((v) => !v),
              className: "flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-smooth",
              "data-ocid": "add-show-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                "New Show",
                showUploadOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-3.5 h-3.5" })
              ]
            }
          )
        ] }),
        showUploadOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "glass-card rounded-xl p-6 mb-6 border border-primary/20",
            "data-ocid": "upload-show-panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-5 h-5 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-bold text-foreground", children: "Upload New Show" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "form",
                {
                  onSubmit: handleAddShow,
                  className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "label",
                        {
                          className: "block text-xs font-medium text-muted-foreground mb-1.5",
                          htmlFor: "show-title",
                          children: [
                            "Title ",
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          id: "show-title",
                          type: "text",
                          value: showForm.title,
                          onChange: (e) => setShowForm((f) => ({ ...f, title: e.target.value })),
                          className: "w-full px-3 py-2.5 rounded-lg bg-muted/30 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth",
                          placeholder: "Show title",
                          "data-ocid": "show-title-input"
                        }
                      ),
                      showErrors.title && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-destructive", children: showErrors.title })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "label",
                        {
                          className: "block text-xs font-medium text-muted-foreground mb-1.5",
                          htmlFor: "show-category",
                          children: "Category"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "select",
                        {
                          id: "show-category",
                          value: showForm.category,
                          onChange: (e) => setShowForm((f) => ({
                            ...f,
                            category: e.target.value
                          })),
                          className: "w-full px-3 py-2.5 rounded-lg bg-muted/30 border border-border/60 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth",
                          "data-ocid": "show-category-select",
                          children: CATEGORY_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: opt.value, children: opt.label }, opt.value))
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "label",
                        {
                          className: "block text-xs font-medium text-muted-foreground mb-1.5",
                          htmlFor: "show-desc",
                          children: [
                            "Description ",
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "textarea",
                        {
                          id: "show-desc",
                          value: showForm.description,
                          rows: 3,
                          onChange: (e) => setShowForm((f) => ({ ...f, description: e.target.value })),
                          className: "w-full px-3 py-2.5 rounded-lg bg-muted/30 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth resize-none",
                          placeholder: "Describe the show...",
                          "data-ocid": "show-desc-input"
                        }
                      ),
                      showErrors.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-destructive", children: showErrors.description })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "label",
                        {
                          className: "block text-xs font-medium text-muted-foreground mb-1.5",
                          htmlFor: "show-cover-url",
                          children: "Cover Image URL (Thumbnail)"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            id: "show-cover-url",
                            type: "url",
                            value: coverUrl,
                            onChange: (e) => setCoverUrl(e.target.value),
                            placeholder: "https://example.com/cover.jpg",
                            className: "w-full pl-9 pr-3 py-2.5 rounded-lg bg-muted/30 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth",
                            "data-ocid": "show-cover-url-input"
                          }
                        )
                      ] }),
                      coverUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 w-24 aspect-[2/3] rounded-lg overflow-hidden bg-muted/30 border border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "img",
                        {
                          src: coverUrl,
                          alt: "Thumbnail preview",
                          className: "w-full h-full object-cover",
                          onError: (e) => {
                            e.currentTarget.style.display = "none";
                          }
                        }
                      ) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 pt-6", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            id: "show-is-free",
                            type: "checkbox",
                            checked: showForm.isFree,
                            onChange: (e) => setShowForm((f) => ({ ...f, isFree: e.target.checked })),
                            className: "sr-only",
                            "data-ocid": "show-free-checkbox"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            role: "switch",
                            "aria-checked": showForm.isFree,
                            "aria-labelledby": "show-is-free-label",
                            onClick: () => setShowForm((f) => ({ ...f, isFree: !f.isFree })),
                            className: `relative rounded-full border transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${showForm.isFree ? "bg-emerald-500/80 border-emerald-500" : "bg-muted/40 border-border/60"}`,
                            style: { width: "2.5rem", height: "1.375rem" },
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: `absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-foreground transition-transform ${showForm.isFree ? "translate-x-[1.125rem]" : "translate-x-0"}`
                              }
                            )
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "label",
                          {
                            id: "show-is-free-label",
                            htmlFor: "show-is-free",
                            className: "text-sm font-medium text-foreground cursor-pointer flex items-center gap-1.5",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(LockOpen, { className: "w-3.5 h-3.5 text-emerald-400" }),
                              "Free for non-subscribers"
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Anyone can watch — no subscription required" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2 flex justify-end gap-3 pt-2 border-t border-border/50 mt-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => {
                            setShowUploadOpen(false);
                            setShowErrors({});
                            setShowForm(EMPTY_SHOW);
                            setCoverUrl("");
                          },
                          className: "px-5 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-smooth",
                          children: "Cancel"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          type: "submit",
                          disabled: isSubmitting,
                          className: "flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-smooth disabled:opacity-60",
                          "data-ocid": "submit-show-btn",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                            isSubmitting ? "Creating..." : "Create Show"
                          ]
                        }
                      )
                    ] })
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 mb-6 flex-wrap",
            "data-ocid": "video-filter-tabs",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "w-4 h-4 text-muted-foreground mr-1" }),
              FILTER_TABS.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": `filter-${tab.toLowerCase()}`,
                  onClick: () => setActiveFilter(tab),
                  className: `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${activeFilter === tab ? "bg-primary text-primary-foreground" : "bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/50"}`,
                  children: [
                    tab,
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `text-xs px-1.5 py-0.5 rounded-full ${activeFilter === tab ? "bg-primary-foreground/20" : "bg-muted"}`,
                        children: counts[tab]
                      }
                    )
                  ]
                },
                tab
              ))
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "glass-card rounded-xl overflow-hidden",
            "data-ocid": "videos-table",
            children: [
              showsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 space-y-3", children: [0, 1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-14 bg-muted/20 rounded-lg animate-pulse"
                },
                i
              )) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/10", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider w-16", children: "Cover" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider", children: "Title" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider hidden md:table-cell", children: "Category" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider hidden sm:table-cell", children: "Access" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider", children: "Status" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider", children: "Actions" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((video, i) => {
                  const isExpanded = expandedShowId === video.id;
                  const backendShow = (shows ?? []).find(
                    (s) => String(s.id) === video.id
                  );
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "tr",
                      {
                        className: `border-b border-border/50 ${i % 2 === 0 ? "" : "bg-muted/5"}`,
                        "data-ocid": `video-row-${video.id}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-9 rounded-lg overflow-hidden bg-muted/30 flex items-center justify-center", children: video.coverUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "img",
                            {
                              src: video.coverUrl,
                              alt: video.title,
                              className: "w-full h-full object-cover",
                              onError: (e) => {
                                e.currentTarget.style.display = "none";
                              }
                            }
                          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Tv, { className: "w-5 h-5 text-muted-foreground" }) }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground max-w-[200px] truncate", children: video.title }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden md:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs bg-primary/10 text-primary px-2 py-1 rounded-full", children: video.category }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden sm:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "button",
                            {
                              type: "button",
                              onClick: () => handleToggleFree(video.id, video.isFree),
                              title: video.isFree ? "Free — click to restrict" : "Subscribers only — click to make free",
                              "data-ocid": `toggle-free-${video.id}`,
                              className: `flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-smooth hover:opacity-80 ${video.isFree ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : "bg-muted/30 text-muted-foreground border-border/40"}`,
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(LockOpen, { className: "w-3 h-3" }),
                                video.isFree ? "Free" : "Subscribers"
                              ]
                            }
                          ) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: `text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[video.status]}`,
                              children: video.status
                            }
                          ) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "button",
                              {
                                type: "button",
                                "data-ocid": `edit-show-${video.id}`,
                                onClick: () => {
                                  if (backendShow) setEditShowTarget(backendShow);
                                },
                                title: "Edit show details",
                                "aria-label": "Edit show details",
                                className: "flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-muted/30 text-muted-foreground border border-border/40 hover:bg-primary/15 hover:text-primary hover:border-primary/30 text-xs font-semibold transition-smooth",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5" }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Edit" })
                                ]
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "button",
                              {
                                type: "button",
                                "data-ocid": `expand-episodes-${video.id}`,
                                onClick: () => toggleExpand(video.id),
                                title: isExpanded ? "Hide episodes" : "Manage episodes",
                                "aria-label": "Manage episodes",
                                className: `flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-smooth ${isExpanded ? "bg-primary/20 border-primary/40 text-primary" : "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"}`,
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "w-3.5 h-3.5" }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: isExpanded ? "Hide" : "Episodes" })
                                ]
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "button",
                              {
                                type: "button",
                                "data-ocid": `add-episode-${video.id}`,
                                onClick: () => {
                                  if (backendShow) setAddEpisodeShow(backendShow);
                                },
                                title: "Add Episode",
                                "aria-label": "Add episode to show",
                                className: "flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-muted/30 text-muted-foreground border border-border/40 hover:bg-muted/50 text-xs font-semibold transition-smooth",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Add Ep" })
                                ]
                              }
                            ),
                            video.status !== "Approved" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "button",
                              {
                                type: "button",
                                "data-ocid": `approve-video-${video.id}`,
                                onClick: () => handleApprove(video.id),
                                title: "Approve",
                                "aria-label": "Approve show",
                                className: "p-1.5 rounded-lg hover:bg-emerald-500/20 text-emerald-400 transition-smooth",
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4" })
                              }
                            ),
                            video.status !== "Flagged" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "button",
                              {
                                type: "button",
                                "data-ocid": `flag-video-${video.id}`,
                                onClick: () => showToast("Flag feature coming soon"),
                                title: "Flag",
                                "aria-label": "Flag show",
                                className: "p-1.5 rounded-lg hover:bg-amber-500/20 text-amber-400 transition-smooth",
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "w-4 h-4" })
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "button",
                              {
                                type: "button",
                                "data-ocid": `delete-video-${video.id}`,
                                onClick: () => handleDelete(video.id),
                                title: "Delete",
                                "aria-label": "Delete show",
                                className: "p-1.5 rounded-lg hover:bg-destructive/20 text-destructive transition-smooth",
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                              }
                            )
                          ] }) })
                        ]
                      },
                      video.id
                    ),
                    isExpanded && backendShow && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "tr",
                      {
                        "data-ocid": `episodes-panel-${video.id}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          EpisodesPanel,
                          {
                            show: backendShow,
                            onToast: showToast
                          }
                        ) })
                      },
                      `${video.id}-episodes`
                    )
                  ] });
                }) })
              ] }) }),
              !showsLoading && filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "py-16 text-center text-muted-foreground",
                  "data-ocid": "no-videos",
                  children: (shows ?? []).length === 0 ? "No shows uploaded yet. Create your first show above." : "No shows match the selected filter."
                }
              )
            ]
          }
        )
      ]
    }
  );
}
export {
  AdminVideosPage as default
};
