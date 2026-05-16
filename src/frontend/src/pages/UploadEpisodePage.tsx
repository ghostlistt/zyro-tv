import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  Film,
  Link2,
} from "lucide-react";
import { useState } from "react";
import { createActor } from "../backend";
import type { ShowPublic } from "../backend";
import { Category as BackendCategory } from "../backend";
import { VideoUploadZone } from "../components/VideoUploadZone";
import { Button } from "../components/ui/ZyroButton";
import { useVideoUpload } from "../hooks/useVideoUpload";
import { useAuthStore } from "../lib/auth-store";
import { cn } from "../lib/utils";

const CATEGORY_OPTIONS = [
  { value: BackendCategory.Drama, label: "Drama" },
  { value: BackendCategory.RealityTV, label: "Reality TV" },
  { value: BackendCategory.Comedy, label: "Comedy" },
  { value: BackendCategory.Exclusive, label: "Exclusive" },
];

interface Step1Data {
  mode: "existing" | "new";
  existingShowId: string;
  newTitle: string;
  newDesc: string;
  newCategory: BackendCategory;
  newCoverUrl: string;
}

interface Step2Data {
  seasonNumber: string;
  episodeNumber: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
}

export default function UploadEpisodePage() {
  const { currentUser, isLoggedIn } = useAuthStore();
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { uploadFile } = useVideoUpload();
  const [step, setStep] = useState<1 | 2>(1);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [s1, setS1] = useState<Step1Data>({
    mode: "existing",
    existingShowId: "",
    newTitle: "",
    newDesc: "",
    newCategory: BackendCategory.Drama,
    newCoverUrl: "",
  });

  const [s2, setS2] = useState<Step2Data>({
    seasonNumber: "1",
    episodeNumber: "",
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
    duration: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load shows from backend
  const { data: adminShows = [] } = useQuery<ShowPublic[]>({
    queryKey: ["adminShows"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminListShows();
    },
    enabled: !!actor && !actorFetching,
  });

  const selectedShow =
    adminShows.find((s) => String(s.id) === s1.existingShowId) ?? adminShows[0];

  if (!isLoggedIn || !currentUser || currentUser.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Film className="w-16 h-16 text-primary/40" />
        <p className="font-display text-xl font-semibold text-foreground">
          Admin access required
        </p>
        <Link to="/">
          <Button variant="primary">Go Home</Button>
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] gap-5 px-4"
        data-ocid="upload-success"
      >
        <div className="w-20 h-20 rounded-full bg-primary/10 neon-border flex items-center justify-center">
          <Check className="w-10 h-10 text-primary" />
        </div>
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Episode Added!
          </h2>
          <p className="text-muted-foreground">
            Your episode has been added successfully.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/">
            <Button variant="secondary">Back to Home</Button>
          </Link>
          <Button
            variant="primary"
            onClick={() => {
              setSuccess(false);
              setStep(1);
              setS2({
                seasonNumber: "1",
                episodeNumber: "",
                title: "",
                description: "",
                videoUrl: "",
                thumbnailUrl: "",
                duration: "",
              });
            }}
          >
            Add Another
          </Button>
        </div>
      </div>
    );
  }

  function handleStep1Next() {
    const e: Record<string, string> = {};
    if (s1.mode === "new" && !s1.newTitle.trim())
      e.newTitle = "Series title is required";
    if (s1.mode === "new" && !s1.newDesc.trim())
      e.newDesc = "Description is required";
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    if (s1.mode === "existing" && !s1.existingShowId && adminShows[0]) {
      setS1((p) => ({ ...p, existingShowId: String(adminShows[0].id) }));
    }
    setErrors({});
    setStep(2);
  }

  async function handleSubmit(e?: React.FormEvent | React.MouseEvent) {
    if (e) e.preventDefault();
    const errs: Record<string, string> = {};
    if (!s2.title.trim()) errs.title = "Episode title is required";
    if (!s2.episodeNumber.trim())
      errs.episodeNumber = "Episode number is required";
    if (!s2.videoUrl.trim()) errs.videoUrl = "Video URL is required";
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    if (!actor) {
      setErrors({ submit: "Not connected to backend" });
      return;
    }

    setUploading(true);

    try {
      let showId: bigint;

      // Step A: Create a new show if needed
      if (s1.mode === "new") {
        showId = await actor.createShow({
          title: s1.newTitle,
          description: s1.newDesc,
          category: s1.newCategory,
          coverImageUrl: s1.newCoverUrl.trim() || undefined,
          trailerBlob: undefined,
          isFree: false,
        });
        // Auto-approve
        await actor.adminApproveShow(showId, true);
      } else {
        const existingId =
          s1.existingShowId || (adminShows[0] ? String(adminShows[0].id) : "");
        if (!existingId) {
          setErrors({ submit: "Please select a show" });
          setUploading(false);
          return;
        }
        showId = BigInt(existingId);
      }

      // Step B: Resolve or create a season
      let seasonId: bigint;
      const seasons = await actor.listSeasons(showId);
      if (s2.seasonNumber === "new" || s2.seasonNumber === "") {
        const nextSeasonNum = BigInt(seasons.length + 1);
        seasonId = await actor.createSeason({
          showId,
          seasonNumber: nextSeasonNum,
          title: `Season ${String(nextSeasonNum)}`,
        });
      } else {
        const targetNum = BigInt(s2.seasonNumber);
        const existing = seasons.find((s) => s.seasonNumber === targetNum);
        if (existing) {
          seasonId = existing.id;
        } else {
          seasonId = await actor.createSeason({
            showId,
            seasonNumber: targetNum,
            title: `Season ${s2.seasonNumber}`,
          });
        }
      }

      // Step C: Create the episode with URL strings directly
      const durationSec = s2.duration
        ? BigInt(Math.round(Number.parseFloat(s2.duration) * 60))
        : BigInt(0);

      await actor.createEpisode({
        title: s2.title,
        showId,
        description: s2.description,
        seasonId,
        videoUrl: s2.videoUrl.trim() || undefined,
        thumbnailUrl: s2.thumbnailUrl.trim() || undefined,
        episodeNumber: BigInt(s2.episodeNumber),
        durationSeconds: durationSec,
      });

      setUploading(false);
      setSuccess(true);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Upload failed. Please try again.";
      setErrors({ submit: msg });
      setUploading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8" data-ocid="upload-page">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link to="/">
          <button
            type="button"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Upload Episode
          </h1>
          <p className="text-sm text-muted-foreground">Step {step} of 2</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8">
        {([1, 2] as const).map((n) => (
          <div key={n} className="flex items-center gap-3">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-sm transition-all",
                step >= n
                  ? "bg-primary text-primary-foreground glow-primary"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {step > n ? <Check className="w-4 h-4" /> : n}
            </div>
            <span
              className={cn(
                "text-sm font-display",
                step >= n ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {n === 1 ? "Select Series" : "Episode Details"}
            </span>
            {n < 2 && (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="glass-card rounded-2xl p-6 space-y-5">
          <div className="flex gap-3">
            {(["existing", "new"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setS1((p) => ({ ...p, mode }))}
                className={cn(
                  "flex-1 py-2.5 px-4 rounded-lg font-display font-semibold text-sm transition-all",
                  s1.mode === mode
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/40 text-muted-foreground hover:text-foreground",
                )}
              >
                {mode === "existing"
                  ? "Select Existing Show"
                  : "Create New Series"}
              </button>
            ))}
          </div>

          {s1.mode === "existing" ? (
            <div>
              <label
                htmlFor="existing-show"
                className="block text-sm font-display font-medium text-foreground mb-1.5"
              >
                Select Show
              </label>
              <div className="relative">
                <select
                  id="existing-show"
                  value={
                    s1.existingShowId ||
                    (adminShows[0] ? String(adminShows[0].id) : "")
                  }
                  onChange={(e) =>
                    setS1((p) => ({ ...p, existingShowId: e.target.value }))
                  }
                  className="w-full h-10 px-3 pr-9 rounded-lg bg-muted/60 border border-input text-foreground text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-ring"
                  data-ocid="show-select"
                >
                  {adminShows.length === 0 ? (
                    <option value="">No shows available</option>
                  ) : (
                    adminShows.map((s) => (
                      <option key={String(s.id)} value={String(s.id)}>
                        {s.title}
                      </option>
                    ))
                  )}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="new-series-title"
                  className="block text-sm font-display font-medium text-foreground mb-1.5"
                >
                  Series Title
                </label>
                <input
                  id="new-series-title"
                  type="text"
                  value={s1.newTitle}
                  onChange={(e) =>
                    setS1((p) => ({ ...p, newTitle: e.target.value }))
                  }
                  placeholder="e.g. Dark Protocol Season 2"
                  className="w-full h-10 px-3 rounded-lg bg-muted/60 border border-input text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {errors.newTitle && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.newTitle}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="new-series-desc"
                  className="block text-sm font-display font-medium text-foreground mb-1.5"
                >
                  Description
                </label>
                <textarea
                  id="new-series-desc"
                  value={s1.newDesc}
                  onChange={(e) =>
                    setS1((p) => ({ ...p, newDesc: e.target.value }))
                  }
                  placeholder="What's this series about?"
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-muted/60 border border-input text-foreground placeholder:text-muted-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {errors.newDesc && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.newDesc}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="new-series-category"
                  className="block text-sm font-display font-medium text-foreground mb-1.5"
                >
                  Category
                </label>
                <div className="relative">
                  <select
                    id="new-series-category"
                    value={s1.newCategory}
                    onChange={(e) =>
                      setS1((p) => ({
                        ...p,
                        newCategory: e.target.value as BackendCategory,
                      }))
                    }
                    className="w-full h-10 px-3 pr-9 rounded-lg bg-muted/60 border border-input text-foreground text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Cover Image URL */}
              <div>
                <label
                  htmlFor="new-series-cover-url"
                  className="block text-sm font-display font-medium text-foreground mb-1.5"
                >
                  Cover Image URL
                </label>
                <div className="relative">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <input
                    id="new-series-cover-url"
                    type="url"
                    value={s1.newCoverUrl}
                    onChange={(e) =>
                      setS1((p) => ({ ...p, newCoverUrl: e.target.value }))
                    }
                    placeholder="https://example.com/cover.jpg"
                    className="w-full h-10 pl-9 pr-3 rounded-lg bg-muted/60 border border-input text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    data-ocid="cover-url-input"
                  />
                </div>
                {/* Live preview */}
                {s1.newCoverUrl && (
                  <div className="mt-2 w-20 aspect-[2/3] rounded-lg overflow-hidden bg-muted/30 border border-border/40">
                    <img
                      src={s1.newCoverUrl}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display =
                          "none";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleStep1Next}
            data-ocid="step1-next-btn"
          >
            Continue <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="glass-card rounded-2xl p-6 space-y-5">
          {selectedShow && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="w-10 h-14 rounded bg-muted/60 overflow-hidden flex-shrink-0 flex items-center justify-center">
                {selectedShow.coverImageUrl ? (
                  <img
                    src={selectedShow.coverImageUrl}
                    alt={selectedShow.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Film className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="font-display font-semibold text-foreground text-sm">
                  {selectedShow.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {String(selectedShow.seasonCount)} seasons
                </p>
              </div>
            </div>
          )}

          {/* Season + Episode number */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="ep-season"
                className="block text-sm font-display font-medium text-foreground mb-1.5"
              >
                Season
              </label>
              <div className="relative">
                <select
                  id="ep-season"
                  value={s2.seasonNumber}
                  onChange={(e) =>
                    setS2((p) => ({ ...p, seasonNumber: e.target.value }))
                  }
                  className="w-full h-10 px-3 pr-9 rounded-lg bg-muted/60 border border-input text-foreground text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {Array.from(
                    {
                      length: Math.max(
                        Number(selectedShow?.seasonCount ?? 1),
                        1,
                      ),
                    },
                    (_, i) => i + 1,
                  ).map((n) => (
                    <option key={n} value={String(n)}>
                      Season {n}
                    </option>
                  ))}
                  <option value="new">+ New Season</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            <div>
              <label
                htmlFor="ep-number"
                className="block text-sm font-display font-medium text-foreground mb-1.5"
              >
                Episode #
              </label>
              <input
                id="ep-number"
                type="number"
                min="1"
                value={s2.episodeNumber}
                onChange={(e) =>
                  setS2((p) => ({ ...p, episodeNumber: e.target.value }))
                }
                placeholder="e.g. 5"
                className="w-full h-10 px-3 rounded-lg bg-muted/60 border border-input text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                data-ocid="episode-number-input"
              />
              {errors.episodeNumber && (
                <p className="text-destructive text-xs mt-1">
                  {errors.episodeNumber}
                </p>
              )}
            </div>
          </div>

          {/* Episode title */}
          <div>
            <label
              htmlFor="ep-title"
              className="block text-sm font-display font-medium text-foreground mb-1.5"
            >
              Episode Title
            </label>
            <input
              id="ep-title"
              type="text"
              value={s2.title}
              onChange={(e) => setS2((p) => ({ ...p, title: e.target.value }))}
              placeholder="e.g. The Point of No Return"
              className="w-full h-10 px-3 rounded-lg bg-muted/60 border border-input text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              data-ocid="episode-title-input"
            />
            {errors.title && (
              <p className="text-destructive text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="ep-desc"
              className="block text-sm font-display font-medium text-foreground mb-1.5"
            >
              Episode Description
            </label>
            <textarea
              id="ep-desc"
              value={s2.description}
              onChange={(e) =>
                setS2((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="What happens in this episode?"
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-muted/60 border border-input text-foreground placeholder:text-muted-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Video Upload */}
          <div>
            <p className="text-sm font-display font-medium text-foreground mb-1.5">
              Video <span className="text-destructive">*</span>
            </p>
            <VideoUploadZone
              value={s2.videoUrl}
              onChange={(url) => setS2((p) => ({ ...p, videoUrl: url }))}
              uploadFile={uploadFile}
              error={errors.videoUrl}
              ocidPrefix="ep-video"
            />
          </div>

          {/* Thumbnail URL + Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="ep-thumbnail-url"
                className="block text-sm font-display font-medium text-foreground mb-1.5"
              >
                Thumbnail URL
              </label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                <input
                  id="ep-thumbnail-url"
                  type="url"
                  value={s2.thumbnailUrl}
                  onChange={(e) =>
                    setS2((p) => ({ ...p, thumbnailUrl: e.target.value }))
                  }
                  placeholder="https://example.com/thumb.jpg"
                  className="w-full h-10 pl-9 pr-3 rounded-lg bg-muted/60 border border-input text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  data-ocid="thumbnail-url-input"
                />
              </div>
              {/* Live thumbnail preview */}
              {s2.thumbnailUrl && (
                <div className="mt-2 w-full aspect-video rounded-lg overflow-hidden bg-muted/30 border border-border/40">
                  <img
                    src={s2.thumbnailUrl}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display =
                        "none";
                    }}
                  />
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="ep-duration"
                className="block text-sm font-display font-medium text-foreground mb-1.5"
              >
                Duration (mins)
              </label>
              <input
                id="ep-duration"
                type="number"
                min="1"
                value={s2.duration}
                onChange={(e) =>
                  setS2((p) => ({ ...p, duration: e.target.value }))
                }
                placeholder="Auto-detect"
                className="w-full h-10 px-3 rounded-lg bg-muted/60 border border-input text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                Leave blank to skip
              </p>
            </div>
          </div>

          {errors.submit && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
              <p className="text-sm text-destructive">{errors.submit}</p>
            </div>
          )}

          {uploading && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <span>Adding episode...</span>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => {
                setStep(1);
                setErrors({});
              }}
            >
              Back
            </Button>
            <Button
              type="button"
              variant="primary"
              size="lg"
              loading={uploading}
              className="flex-1"
              data-ocid="upload-submit-btn"
              onClick={handleSubmit}
            >
              Add Episode
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
