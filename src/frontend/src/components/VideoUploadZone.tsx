import { AlertCircle, CheckCircle, Film, Link2, Upload, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { cn } from "../lib/utils";

type UploadState =
  | { status: "idle" }
  | { status: "dragging" }
  | { status: "uploading"; progress: number; fileName: string }
  | { status: "done"; fileName: string; url: string }
  | { status: "error"; message: string };

interface VideoUploadZoneProps {
  value: string;
  onChange: (url: string) => void;
  /** Optional upload handler. Receives the File and a progress callback (0–100).
   *  Must return a Promise that resolves with a persistent URL.
   *  If omitted the component falls back to a local blob:// URL. */
  uploadFile?: (
    file: File,
    onProgress: (percentage: number) => void,
  ) => Promise<string>;
  error?: string;
  /** Shows "Current video" info row in edit mode */
  existingUrl?: string;
  ocidPrefix?: string;
}

// Accept video files only — NO capture attribute to avoid iOS Safari refresh issues
const ACCEPT =
  "video/mp4,video/webm,video/quicktime,video/x-msvideo,video/x-matroska,.mp4,.webm,.mov,.avi,.mkv";

function formatFileName(name: string, maxLen = 36): string {
  if (name.length <= maxLen) return name;
  const ext = name.lastIndexOf(".");
  if (ext > 0) {
    return `${name.slice(0, maxLen - 3 - (name.length - ext))}...${name.slice(ext)}`;
  }
  return `${name.slice(0, maxLen)}...`;
}

function isExternalLink(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

// ─── Portal-mounted hidden file input ────────────────────────────────────────
// Rendered directly on document.body via a portal so it is NEVER inside any
// <form> element in the DOM tree, no matter how deeply nested the component is.
// Key mobile fixes:
//   - NO `capture` attribute (causes iOS Safari to refresh on some devices)
//   - `form=""` attribute disconnects the input from any ancestor form
//   - `onClick` calls e.stopPropagation() to block event propagation

interface PortalFileInputProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ocid: string;
}

function PortalFileInput({ inputRef, onChange, ocid }: PortalFileInputProps) {
  return ReactDOM.createPortal(
    <input
      ref={inputRef}
      type="file"
      accept={ACCEPT}
      // form="" explicitly disconnects this input from any ancestor <form>
      form=""
      onChange={onChange}
      className="sr-only"
      data-ocid={ocid}
      tabIndex={-1}
      // Prevent click events from propagating to any ancestor form or element
      onClick={(e) => {
        e.stopPropagation();
      }}
      aria-hidden="true"
    />,
    document.body,
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function VideoUploadZone({
  value,
  onChange,
  uploadFile,
  error,
  existingUrl,
  ocidPrefix = "video-upload",
}: VideoUploadZoneProps) {
  const [uploadState, setUploadState] = useState<UploadState>({
    status: "idle",
  });
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkValue, setLinkValue] = useState(
    value && isExternalLink(value) ? value : "",
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [mounted, setMounted] = useState(false);

  // Wait for DOM to be ready before rendering portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const processFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("video/")) {
        setUploadState({
          status: "error",
          message:
            "Please select a valid video file (MP4, WebM, MOV, AVI, MKV)",
        });
        return;
      }

      setUploadState({
        status: "uploading",
        progress: 10,
        fileName: file.name,
      });

      if (uploadFile) {
        // ── Real upload via provided handler ──────────────────────────────
        try {
          const url = await uploadFile(file, (progress) => {
            setUploadState((s) =>
              s.status === "uploading" ? { ...s, progress } : s,
            );
          });
          setUploadState({ status: "done", fileName: file.name, url });
          onChange(url);
        } catch (err) {
          const msg =
            err instanceof Error
              ? err.message
              : "Upload failed. Please try again.";
          setUploadState({ status: "error", message: msg });
        }
      } else {
        // ── Fallback: local blob URL (temporary, for previewing only) ─────
        try {
          setUploadState({
            status: "uploading",
            progress: 30,
            fileName: file.name,
          });
          const arrayBuffer = await file.arrayBuffer();
          const blob = new Blob([arrayBuffer], { type: file.type });
          const url = URL.createObjectURL(blob);
          setUploadState({ status: "done", fileName: file.name, url });
          onChange(url);
        } catch {
          setUploadState({
            status: "error",
            message: "Failed to read file. Please try again.",
          });
        }
      }
    },
    [uploadFile, onChange],
  );

  // Deep mobile fix: call preventDefault() immediately before reading any file
  // data. This prevents iOS Safari and Android Chrome from treating the file
  // selection as a form submission event that could cause a page reload.
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Immediately stop propagation — critical for preventing any ancestor
    // form from receiving this event on mobile browsers
    e.stopPropagation();

    const file = e.target.files?.[0];

    // Reset the input value BEFORE processing so the same file can be
    // selected again, and so the input doesn't hold a reference that could
    // confuse mobile browsers
    e.target.value = "";

    if (file) {
      void processFile(file);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setUploadState((s) => (s.status === "uploading" ? s : { status: "idle" }));
    const file = e.dataTransfer.files?.[0];
    if (file) void processFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setUploadState((s) =>
      s.status === "idle" || s.status === "dragging"
        ? { status: "dragging" }
        : s,
    );
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setUploadState((s) => (s.status === "dragging" ? { status: "idle" } : s));
  }

  function handleReset() {
    setUploadState({ status: "idle" });
    setLinkValue("");
    onChange("");
  }

  function handleLinkChange(url: string) {
    setLinkValue(url);
    if (url.trim()) onChange(url.trim());
  }

  function openFilePicker() {
    // Use requestAnimationFrame to ensure the browser has fully processed any
    // preceding event (e.g. button click) before opening the file dialog.
    // This is required on iOS Safari to allow programmatic .click() calls.
    requestAnimationFrame(() => {
      fileInputRef.current?.click();
    });
  }

  const isDragging = uploadState.status === "dragging";
  const isUploading = uploadState.status === "uploading";
  const isDone = uploadState.status === "done";
  const isError = uploadState.status === "error";
  const showExisting =
    existingUrl && uploadState.status === "idle" && !linkValue;

  return (
    <div className="space-y-3">
      {/* Portal-mounted file input — lives directly on document.body,
          completely outside any form element. form="" attr ensures it's
          also disconnected from any ancestor form at the HTML level. */}
      {mounted && (
        <PortalFileInput
          inputRef={fileInputRef}
          onChange={handleFileChange}
          ocid={`${ocidPrefix}-file-input`}
        />
      )}

      {/* Existing video info (edit mode) */}
      {showExisting && (
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/5 border border-primary/20">
          <Film className="w-4 h-4 text-primary flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-muted-foreground">Current video</p>
            <p className="text-xs text-foreground truncate">
              {isExternalLink(existingUrl)
                ? "Video linked"
                : "Uploaded video file"}
            </p>
          </div>
          <span className="text-[10px] text-primary/70 font-medium bg-primary/10 px-2 py-0.5 rounded-full">
            Active
          </span>
        </div>
      )}

      {/* Upload zone — shown when not yet done */}
      {!isDone && (
        <button
          type="button"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => {
            if (!isUploading) openFilePicker();
          }}
          aria-label="Upload video file — click to browse or drag and drop"
          data-ocid={`${ocidPrefix}-dropzone`}
          className={cn(
            "w-full rounded-xl border-2 border-dashed transition-all duration-300 overflow-hidden cursor-pointer text-left",
            isDragging
              ? "border-primary bg-primary/10 shadow-[0_0_30px_oklch(var(--primary)/0.25)]"
              : isUploading
                ? "border-primary/40 bg-primary/5 cursor-default"
                : isError
                  ? "border-destructive/50 bg-destructive/5"
                  : "border-border/50 bg-muted/10 hover:border-primary/50 hover:bg-primary/5 hover:shadow-[0_0_20px_oklch(var(--primary)/0.15)]",
          )}
        >
          {isUploading ? (
            <div className="px-6 py-8 flex flex-col items-center gap-4">
              <div className="relative w-14 h-14 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                <div
                  className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin"
                  style={{ animationDuration: "1.1s" }}
                />
                <Film className="w-6 h-6 text-primary" />
              </div>
              <div className="w-full max-w-xs space-y-2 text-center">
                <p className="text-sm font-display font-semibold text-foreground truncate max-w-full">
                  {uploadState.status === "uploading" &&
                    formatFileName(uploadState.fileName)}
                </p>

                {/* Indeterminate progress bar */}
                <div className="w-full h-1.5 bg-muted/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
                    style={{
                      width: `${uploadState.status === "uploading" ? uploadState.progress : 0}%`,
                    }}
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  Uploading{" "}
                  <span className="text-primary font-medium">
                    {uploadState.status === "uploading"
                      ? Math.round(uploadState.progress)
                      : 0}
                    %
                  </span>
                </p>

                <p className="text-[11px] text-muted-foreground/60">
                  Keep this page open while uploading
                </p>
              </div>
            </div>
          ) : (
            <div className="px-6 py-8 flex flex-col items-center gap-3">
              <div
                className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300",
                  isDragging
                    ? "bg-primary/20 shadow-[0_0_24px_oklch(var(--primary)/0.4)] scale-110"
                    : "bg-primary/10",
                )}
              >
                {isDragging ? (
                  <Upload className="w-7 h-7 text-primary animate-bounce" />
                ) : isError ? (
                  <Film className="w-7 h-7 text-destructive" />
                ) : (
                  <Film className="w-7 h-7 text-primary" />
                )}
              </div>

              {isError ? (
                <div className="text-center space-y-1 max-w-xs">
                  <div className="flex items-center justify-center gap-1.5 mb-0.5">
                    <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                    <p className="text-sm font-display font-semibold text-destructive">
                      Upload failed
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {uploadState.message}
                  </p>
                  <p className="text-xs text-primary mt-2 font-medium">
                    ↑ Click or drop a file to try again
                  </p>
                </div>
              ) : (
                <div className="text-center space-y-1.5">
                  <p className="text-sm font-display font-semibold text-foreground">
                    Drop your video here
                  </p>
                  <p className="text-xs text-muted-foreground">
                    or{" "}
                    <span className="text-primary font-semibold underline underline-offset-2">
                      browse files
                    </span>
                  </p>
                  <p className="text-[11px] text-muted-foreground/70 pt-0.5">
                    MP4, WebM, MOV, AVI, MKV · Large files supported
                  </p>
                </div>
              )}
            </div>
          )}
        </button>
      )}

      {/* Success state */}
      {isDone && (
        <div
          className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25"
          data-ocid={`${ocidPrefix}-success`}
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-display font-semibold text-foreground">
              Video ready
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {uploadState.status === "done" &&
                formatFileName(uploadState.fileName)}
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleReset();
            }}
            aria-label="Remove video"
            data-ocid={`${ocidPrefix}-remove-btn`}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-smooth flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* "Or paste a link" toggle */}
      <div>
        <button
          type="button"
          onClick={() => setShowLinkInput((v) => !v)}
          data-ocid={`${ocidPrefix}-link-toggle`}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-smooth"
        >
          <Link2 className="w-3.5 h-3.5" />
          {showLinkInput
            ? "Hide link input"
            : "Or paste a link (YouTube, Vimeo, etc.)"}
        </button>

        {showLinkInput && (
          <div className="mt-2 relative">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="url"
              value={linkValue}
              onChange={(e) => handleLinkChange(e.target.value)}
              onBlur={() => {
                if (linkValue.trim()) onChange(linkValue.trim());
              }}
              placeholder="https://youtube.com/watch?v=... or Vimeo, .mp4 link"
              data-ocid={`${ocidPrefix}-link-input`}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-muted/30 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth"
            />
          </div>
        )}
      </div>

      {/* Field error */}
      {error && (
        <p
          className="text-xs text-destructive"
          data-ocid={`${ocidPrefix}-field-error`}
        >
          {error}
        </p>
      )}
    </div>
  );
}
