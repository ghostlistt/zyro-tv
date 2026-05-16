import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Film,
  Filter,
  Flag,
  Link2,
  Pencil,
  Plus,
  Trash2,
  Tv,
  Unlock,
  Upload,
  X,
} from "lucide-react";
import { useState } from "react";
import { createActor } from "../backend";
import type { EpisodePublic, SeasonPublic, ShowPublic } from "../backend";
import { Category as BackendCategory } from "../backend";
import { VideoUploadZone } from "../components/VideoUploadZone";
import { useVideoUpload } from "../hooks/useVideoUpload";
import { useAdminStore } from "../lib/admin-store";
import { AdminNav, type AdminTab } from "./AdminPage";

// ─── Types ─────────────────────────────────────────────────────────────────────

type VideoStatus = "Approved" | "Pending" | "Flagged";
type FilterTab = "All" | VideoStatus;

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<VideoStatus, string> = {
  Approved: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  Pending: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  Flagged: "bg-destructive/15 text-destructive border border-destructive/30",
};

const FILTER_TABS: FilterTab[] = ["All", "Pending", "Approved", "Flagged"];

const CATEGORY_OPTIONS = [
  { value: BackendCategory.Drama, label: "Drama" },
  { value: BackendCategory.RealityTV, label: "Reality TV" },
  { value: BackendCategory.Comedy, label: "Comedy" },
  { value: BackendCategory.Exclusive, label: "Exclusive" },
];

// ─── Form interfaces ───────────────────────────────────────────────────────────

interface NewShowForm {
  title: string;
  description: string;
  category: BackendCategory;
  isFree: boolean;
}

const EMPTY_SHOW: NewShowForm = {
  title: "",
  description: "",
  category: BackendCategory.Drama,
  isFree: false,
};

interface EpisodeForm {
  seasonNumber: string;
  episodeNumber: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
}

const EMPTY_EPISODE: EpisodeForm = {
  seasonNumber: "1",
  episodeNumber: "",
  title: "",
  description: "",
  videoUrl: "",
  thumbnailUrl: "",
  duration: "",
};

interface ShowRowState {
  id: string;
  title: string;
  category: string;
  status: VideoStatus;
  coverUrl: string;
  isFree: boolean;
}

function toShowRow(show: ShowPublic): ShowRowState {
  const status: VideoStatus = show.isApproved ? "Approved" : "Pending";
  return {
    id: String(show.id),
    title: show.title,
    category: show.category,
    status,
    coverUrl: show.coverImageUrl ?? "",
    isFree: show.isFree,
  };
}

// ─── Shared Modal Chrome ──────────────────────────────────────────────────────

function ModalHeader({
  icon,
  title,
  subtitle,
  onClose,
  ocid,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onClose: () => void;
  ocid: string;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="font-display text-base font-bold text-foreground">
          {title}
        </h2>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {subtitle && <span className="max-w-[140px] truncate">{subtitle}</span>}
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-smooth"
          aria-label="Close"
          data-ocid={ocid}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Add Episode Modal ────────────────────────────────────────────────────────

function AddEpisodeModal({
  show,
  onClose,
  onSuccess,
}: {
  show: ShowPublic;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}) {
  const { actor } = useActor(createActor);
  const { uploadFile } = useVideoUpload();
  const [form, setForm] = useState<EpisodeForm>(EMPTY_EPISODE);
  const [errors, setErrors] = useState<
    Partial<Record<keyof EpisodeForm, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);

  const maxSeasons = Math.max(Number(show.seasonCount ?? 1), 1);

  function validate(): boolean {
    const e: Partial<Record<keyof EpisodeForm, string>> = {};
    if (!form.title.trim()) e.title = "Episode title is required";
    if (!form.episodeNumber.trim())
      e.episodeNumber = "Episode number is required";
    if (!form.videoUrl.trim()) e.videoUrl = "Video URL is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent | React.MouseEvent) {
    ev.preventDefault();
    if (!validate() || !actor) return;
    setSubmitting(true);
    try {
      const showId = show.id;
      let seasonId: bigint;
      const seasons = await actor.listSeasons(showId);
      const targetNum = BigInt(
        form.seasonNumber === "new" ? seasons.length + 1 : form.seasonNumber,
      );
      const existing = seasons.find((s) => s.seasonNumber === targetNum);
      if (existing) {
        seasonId = existing.id;
      } else {
        seasonId = await actor.createSeason({
          showId,
          seasonNumber: targetNum,
          title: `Season ${String(targetNum)}`,
        });
      }

      const durationSec = form.duration
        ? BigInt(Math.round(Number.parseFloat(form.duration) * 60))
        : BigInt(0);

      await actor.createEpisode({
        title: form.title,
        showId,
        description: form.description,
        seasonId,
        episodeNumber: BigInt(form.episodeNumber),
        durationSeconds: durationSec,
        videoUrl: form.videoUrl.trim() || undefined,
        thumbnailUrl: form.thumbnailUrl.trim() || undefined,
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      data-ocid="add-episode-modal"
    >
      <div className="relative w-full max-w-lg glass-card rounded-2xl border border-primary/30 shadow-2xl overflow-hidden">
        <ModalHeader
          icon={<Film className="w-4 h-4 text-primary" />}
          title="Add Episode"
          subtitle={show.title}
          onClose={onClose}
          ocid="close-episode-modal"
        />
        <EpisodeFormBody
          form={form}
          setForm={setForm}
          errors={errors}
          maxSeasons={maxSeasons}
          submitting={submitting}
          submitLabel="Add Episode"
          submittingLabel="Adding..."
          submitIcon={<Plus className="w-4 h-4" />}
          onSubmit={handleSubmit}
          onCancel={onClose}
          cancelOcid="cancel-episode-btn"
          submitOcid="save-episode-btn"
          uploadFile={uploadFile}
        />
      </div>
    </div>
  );
}

// ─── Shared Episode Form Body ─────────────────────────────────────────────────

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
  uploadFile,
}: {
  form: EpisodeForm;
  setForm: React.Dispatch<React.SetStateAction<EpisodeForm>>;
  errors: Partial<Record<keyof EpisodeForm, string>>;
  maxSeasons: number;
  submitting: boolean;
  submitLabel: string;
  submittingLabel: string;
  submitIcon: React.ReactNode;
  onSubmit: (e: React.FormEvent | React.MouseEvent) => void;
  onCancel: () => void;
  cancelOcid: string;
  submitOcid: string;
  existingVideoUrl?: string;
  uploadFile?: (
    file: File,
    onProgress: (pct: number) => void,
  ) => Promise<string>;
}) {
  return (
    <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
      {/* Season + Episode row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="modal-ep-season"
            className="block text-xs font-medium text-muted-foreground mb-1.5"
          >
            Season <span className="text-destructive">*</span>
          </label>
          <select
            id="modal-ep-season"
            value={form.seasonNumber}
            onChange={(e) =>
              setForm((f) => ({ ...f, seasonNumber: e.target.value }))
            }
            className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-border/60 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth"
            data-ocid="ep-season-select"
          >
            {Array.from({ length: maxSeasons }, (_, i) => i + 1).map((n) => (
              <option key={n} value={String(n)}>
                Season {n}
              </option>
            ))}
            <option value="new">+ New Season</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="modal-ep-number"
            className="block text-xs font-medium text-muted-foreground mb-1.5"
          >
            Episode # <span className="text-destructive">*</span>
          </label>
          <input
            id="modal-ep-number"
            type="number"
            min="1"
            value={form.episodeNumber}
            onChange={(e) =>
              setForm((f) => ({ ...f, episodeNumber: e.target.value }))
            }
            placeholder="e.g. 1"
            className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth"
            data-ocid="ep-number-input"
          />
          {errors.episodeNumber && (
            <p className="mt-1 text-xs text-destructive">
              {errors.episodeNumber}
            </p>
          )}
        </div>
      </div>

      {/* Episode title */}
      <div>
        <label
          htmlFor="modal-ep-title"
          className="block text-xs font-medium text-muted-foreground mb-1.5"
        >
          Episode Title <span className="text-destructive">*</span>
        </label>
        <input
          id="modal-ep-title"
          type="text"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="e.g. The Beginning"
          className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth"
          data-ocid="ep-title-input"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-destructive">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="modal-ep-desc"
          className="block text-xs font-medium text-muted-foreground mb-1.5"
        >
          Description
        </label>
        <textarea
          id="modal-ep-desc"
          value={form.description}
          rows={2}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          placeholder="What happens in this episode?"
          className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth resize-none"
          data-ocid="ep-desc-textarea"
        />
      </div>

      {/* Video Upload */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-1.5">
          Video <span className="text-destructive">*</span>
        </p>
        <VideoUploadZone
          value={form.videoUrl}
          onChange={(url) => setForm((f) => ({ ...f, videoUrl: url }))}
          uploadFile={uploadFile}
          error={errors.videoUrl}
          existingUrl={existingVideoUrl}
          ocidPrefix="ep-video"
        />
      </div>

      {/* Thumbnail URL + Duration */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="modal-ep-thumb-url"
            className="block text-xs font-medium text-muted-foreground mb-1.5"
          >
            Thumbnail URL
          </label>
          <div className="relative">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <input
              id="modal-ep-thumb-url"
              type="url"
              value={form.thumbnailUrl}
              onChange={(e) =>
                setForm((f) => ({ ...f, thumbnailUrl: e.target.value }))
              }
              placeholder="https://..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-muted/30 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth"
              data-ocid="ep-thumb-url-input"
            />
          </div>
          {form.thumbnailUrl && (
            <div className="mt-2 w-full aspect-video rounded-lg overflow-hidden bg-muted/30">
              <img
                src={form.thumbnailUrl}
                alt="Thumbnail preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
        </div>
        <div>
          <label
            htmlFor="modal-ep-duration"
            className="block text-xs font-medium text-muted-foreground mb-1.5"
          >
            Duration (mins)
          </label>
          <input
            id="modal-ep-duration"
            type="number"
            min="1"
            value={form.duration}
            onChange={(e) =>
              setForm((f) => ({ ...f, duration: e.target.value }))
            }
            placeholder="e.g. 45"
            className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth"
            data-ocid="ep-duration-input"
          />
          <p className="mt-1 text-[10px] text-muted-foreground">
            Leave blank if unknown
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2 border-t border-border/50">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-smooth"
          data-ocid={cancelOcid}
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={submitting}
          onClick={(e) => onSubmit(e as unknown as React.FormEvent)}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-smooth disabled:opacity-60"
          data-ocid={submitOcid}
        >
          {submitIcon}
          {submitting ? submittingLabel : submitLabel}
        </button>
      </div>
    </div>
  );
}

// ─── Edit Episode Modal ───────────────────────────────────────────────────────

function EditEpisodeModal({
  episode,
  maxSeasons,
  onClose,
  onSuccess,
}: {
  episode: EpisodePublic;
  maxSeasons: number;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}) {
  const { actor } = useActor(createActor);
  const { uploadFile } = useVideoUpload();
  const [form, setForm] = useState<EpisodeForm>({
    seasonNumber: "1", // season is fixed during edit; shown for info only
    episodeNumber: String(episode.episodeNumber),
    title: episode.title,
    description: episode.description,
    videoUrl: episode.videoUrl ?? "",
    thumbnailUrl: episode.thumbnailUrl ?? "",
    duration: episode.durationSeconds
      ? String(Math.round(Number(episode.durationSeconds) / 60))
      : "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof EpisodeForm, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    const e: Partial<Record<keyof EpisodeForm, string>> = {};
    if (!form.title.trim()) e.title = "Episode title is required";
    if (!form.episodeNumber.trim())
      e.episodeNumber = "Episode number is required";
    if (!form.videoUrl.trim()) e.videoUrl = "Video URL is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent | React.MouseEvent) {
    ev.preventDefault();
    if (!validate() || !actor) return;
    setSubmitting(true);
    try {
      const durationSec = form.duration
        ? BigInt(Math.round(Number.parseFloat(form.duration) * 60))
        : BigInt(0);

      const epResult = await actor.updateEpisode(episode.id, {
        title: form.title,
        description: form.description,
        episodeNumber: BigInt(form.episodeNumber),
        durationSeconds: durationSec,
        videoUrl: form.videoUrl.trim() || undefined,
        thumbnailUrl: form.thumbnailUrl.trim() || undefined,
      });
      if (epResult.__kind__ === "err") {
        throw new Error(epResult.err);
      }

      onSuccess(`Episode "${form.title}" updated successfully`);
      onClose();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to update episode";
      setErrors((prev) => ({ ...prev, title: msg }));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      data-ocid="edit-episode-modal"
    >
      <div className="relative w-full max-w-lg glass-card rounded-2xl border border-primary/30 shadow-2xl overflow-hidden">
        <ModalHeader
          icon={<Pencil className="w-4 h-4 text-primary" />}
          title="Edit Episode"
          subtitle={episode.title}
          onClose={onClose}
          ocid="close-edit-episode-modal"
        />
        <EpisodeFormBody
          form={form}
          setForm={setForm}
          errors={errors}
          maxSeasons={maxSeasons}
          submitting={submitting}
          submitLabel="Save Changes"
          submittingLabel="Saving..."
          submitIcon={<Pencil className="w-4 h-4" />}
          onSubmit={handleSubmit}
          onCancel={onClose}
          cancelOcid="cancel-edit-episode-btn"
          submitOcid="save-edit-episode-btn"
          existingVideoUrl={episode.videoUrl}
          uploadFile={uploadFile}
        />
      </div>
    </div>
  );
}

// ─── Edit Season Modal ────────────────────────────────────────────────────────

function EditSeasonModal({
  season,
  onClose,
  onSuccess,
}: {
  season: SeasonPublic;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}) {
  const { actor } = useActor(createActor);
  const [title, setTitle] = useState(season.title);
  const [seasonNumber, setSeasonNumber] = useState(String(season.seasonNumber));
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(ev: React.FormEvent) {
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
        seasonNumber: BigInt(seasonNumber),
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      data-ocid="edit-season-modal"
    >
      <div className="relative w-full max-w-md glass-card rounded-2xl border border-primary/30 shadow-2xl overflow-hidden">
        <ModalHeader
          icon={<Pencil className="w-4 h-4 text-primary" />}
          title="Edit Season"
          subtitle={season.title}
          onClose={onClose}
          ocid="close-edit-season-modal"
        />

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label
              htmlFor="edit-season-number"
              className="block text-xs font-medium text-muted-foreground mb-1.5"
            >
              Season Number <span className="text-destructive">*</span>
            </label>
            <input
              id="edit-season-number"
              type="number"
              min="1"
              value={seasonNumber}
              onChange={(e) => setSeasonNumber(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth"
              data-ocid="season-number-input"
            />
          </div>

          <div>
            <label
              htmlFor="edit-season-title"
              className="block text-xs font-medium text-muted-foreground mb-1.5"
            >
              Season Title <span className="text-destructive">*</span>
            </label>
            <input
              id="edit-season-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Season 1"
              className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth"
              data-ocid="season-title-input"
            />
          </div>

          {error && (
            <p
              className="text-xs text-destructive"
              data-ocid="edit-season-error"
            >
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2 border-t border-border/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-smooth"
              data-ocid="cancel-edit-season-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-smooth disabled:opacity-60"
              data-ocid="save-edit-season-btn"
            >
              <Pencil className="w-4 h-4" />
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Edit Show Modal ──────────────────────────────────────────────────────────

interface EditShowForm {
  title: string;
  description: string;
  category: BackendCategory;
  coverImageUrl: string;
  isFree: boolean;
}

function EditShowModal({
  show,
  onClose,
  onSuccess,
}: {
  show: ShowPublic;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}) {
  const { actor } = useActor(createActor);
  const [form, setForm] = useState<EditShowForm>({
    title: show.title,
    description: show.description,
    category: show.category as BackendCategory,
    coverImageUrl: show.coverImageUrl ?? "",
    isFree: show.isFree,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof EditShowForm, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    const e: Partial<Record<keyof EditShowForm, string>> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.category) e.category = "Category is required";
    if (!form.coverImageUrl.trim())
      e.coverImageUrl = "Cover image URL is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate() || !actor) return;
    setSubmitting(true);
    try {
      await actor.updateShow({
        id: show.id,
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        coverImageUrl: form.coverImageUrl.trim() || undefined,
        trailerBlob: undefined,
        isFree: form.isFree,
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      data-ocid="edit-show-modal"
    >
      <div className="relative w-full max-w-lg glass-card rounded-2xl border border-primary/30 shadow-2xl overflow-hidden">
        <ModalHeader
          icon={<Pencil className="w-4 h-4 text-primary" />}
          title="Edit Show"
          subtitle={show.title}
          onClose={onClose}
          ocid="close-edit-show-modal"
        />

        <form
          onSubmit={handleSubmit}
          className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto"
        >
          {/* Title */}
          <div>
            <label
              htmlFor="edit-show-title"
              className="block text-xs font-medium text-muted-foreground mb-1.5"
            >
              Title <span className="text-destructive">*</span>
            </label>
            <input
              id="edit-show-title"
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="Show title"
              className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth"
              data-ocid="edit-show-title-input"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="edit-show-category"
              className="block text-xs font-medium text-muted-foreground mb-1.5"
            >
              Category <span className="text-destructive">*</span>
            </label>
            <select
              id="edit-show-category"
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  category: e.target.value as BackendCategory,
                }))
              }
              className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-border/60 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth"
              data-ocid="edit-show-category-select"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-destructive">{errors.category}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="edit-show-desc"
              className="block text-xs font-medium text-muted-foreground mb-1.5"
            >
              Description <span className="text-destructive">*</span>
            </label>
            <textarea
              id="edit-show-desc"
              value={form.description}
              rows={3}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Describe the show..."
              className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth resize-none"
              data-ocid="edit-show-desc-textarea"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-destructive">
                {errors.description}
              </p>
            )}
          </div>

          {/* Cover Image URL */}
          <div>
            <label
              htmlFor="edit-show-cover"
              className="block text-xs font-medium text-muted-foreground mb-1.5"
            >
              Cover Image URL <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              <input
                id="edit-show-cover"
                type="url"
                value={form.coverImageUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, coverImageUrl: e.target.value }))
                }
                placeholder="https://example.com/cover.jpg"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-muted/30 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth"
                data-ocid="edit-show-cover-input"
              />
            </div>
            {errors.coverImageUrl && (
              <p className="mt-1 text-xs text-destructive">
                {errors.coverImageUrl}
              </p>
            )}
            {form.coverImageUrl && (
              <div className="mt-2 w-20 aspect-[2/3] rounded-lg overflow-hidden bg-muted/30 border border-border/40">
                <img
                  src={form.coverImageUrl}
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

          {/* Free / Subscription toggle */}
          <div className="flex items-start gap-3">
            <div className="relative mt-0.5">
              <button
                type="button"
                role="switch"
                aria-checked={form.isFree}
                aria-label="Free for non-subscribers"
                onClick={() => setForm((f) => ({ ...f, isFree: !f.isFree }))}
                className={`relative rounded-full border transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
                  form.isFree
                    ? "bg-emerald-500/80 border-emerald-500"
                    : "bg-muted/40 border-border/60"
                }`}
                style={{ width: "2.5rem", height: "1.375rem" }}
                data-ocid="edit-show-free-toggle"
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-foreground transition-transform ${
                    form.isFree ? "translate-x-[1.125rem]" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                Free for non-subscribers
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {form.isFree
                  ? "Anyone can watch — no subscription required"
                  : "Subscribers only"}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t border-border/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-smooth"
              data-ocid="cancel-edit-show-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-smooth disabled:opacity-60"
              data-ocid="save-edit-show-btn"
            >
              <Pencil className="w-4 h-4" />
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Episodes Panel (per-show expanded view) ──────────────────────────────────

function EpisodesPanel({
  show,
  onToast,
}: {
  show: ShowPublic;
  onToast: (msg: string) => void;
}) {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [editEpisode, setEditEpisode] = useState<EpisodePublic | null>(null);
  const [editSeason, setEditSeason] = useState<SeasonPublic | null>(null);

  const { data: seasons = [], isLoading: seasonsLoading } = useQuery<
    SeasonPublic[]
  >({
    queryKey: ["seasons-panel", String(show.id)],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSeasons(show.id);
    },
    enabled: !!actor && !actorFetching,
  });

  const sortedSeasons = [...seasons].sort(
    (a, b) => Number(a.seasonNumber) - Number(b.seasonNumber),
  );

  async function handleDeleteEpisode(epId: bigint) {
    if (!actor) return;
    try {
      await actor.adminDeleteEpisode(epId);
      queryClient.invalidateQueries({
        queryKey: ["seasons-panel", String(show.id)],
      });
      onToast("Episode deleted");
    } catch {
      onToast("Failed to delete episode");
    }
  }

  function handleEpisodeEditSuccess(msg: string) {
    queryClient.invalidateQueries({
      queryKey: ["seasons-panel", String(show.id)],
    });
    queryClient.invalidateQueries({ queryKey: ["episodes"] });
    onToast(msg);
  }

  function handleSeasonEditSuccess(msg: string) {
    queryClient.invalidateQueries({
      queryKey: ["seasons-panel", String(show.id)],
    });
    queryClient.invalidateQueries({ queryKey: ["seasons", String(show.id)] });
    onToast(msg);
  }

  if (seasonsLoading) {
    return (
      <div className="px-4 py-3 space-y-2">
        {[0, 1].map((i) => (
          <div key={i} className="h-8 bg-muted/20 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-muted/5 border-t border-border/40">
      {editEpisode && (
        <EditEpisodeModal
          episode={editEpisode}
          maxSeasons={Math.max(Number(show.seasonCount ?? 1), 1)}
          onClose={() => setEditEpisode(null)}
          onSuccess={handleEpisodeEditSuccess}
        />
      )}
      {editSeason && (
        <EditSeasonModal
          season={editSeason}
          onClose={() => setEditSeason(null)}
          onSuccess={handleSeasonEditSuccess}
        />
      )}

      {sortedSeasons.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">
          No seasons yet. Add episodes to create seasons.
        </p>
      ) : (
        sortedSeasons.map((season) => (
          <SeasonSection
            key={String(season.id)}
            season={season}
            onEditSeason={() => setEditSeason(season)}
            onEditEpisode={setEditEpisode}
            onDeleteEpisode={handleDeleteEpisode}
          />
        ))
      )}
    </div>
  );
}

// ─── Season Section ───────────────────────────────────────────────────────────

function SeasonSection({
  season,
  onEditSeason,
  onEditEpisode,
  onDeleteEpisode,
}: {
  season: SeasonPublic;
  onEditSeason: () => void;
  onEditEpisode: (ep: EpisodePublic) => void;
  onDeleteEpisode: (id: bigint) => void;
}) {
  const { actor, isFetching: actorFetching } = useActor(createActor);

  const { data: episodes = [], isLoading } = useQuery<EpisodePublic[]>({
    queryKey: ["episodes-panel", String(season.id)],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listEpisodes(season.id);
    },
    enabled: !!actor && !actorFetching,
  });

  const sorted = [...episodes].sort(
    (a, b) => Number(a.episodeNumber) - Number(b.episodeNumber),
  );

  return (
    <div className="border-b border-border/30 last:border-b-0">
      {/* Season header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/10">
        <span className="text-xs font-display font-bold text-primary/80 uppercase tracking-wider">
          {season.title}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">
            {sorted.length} episode{sorted.length !== 1 ? "s" : ""}
          </span>
          <button
            type="button"
            onClick={onEditSeason}
            title="Edit season"
            aria-label="Edit season"
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 text-[10px] font-semibold transition-smooth"
            data-ocid={`edit-season-${String(season.id)}`}
          >
            <Pencil className="w-3 h-3" />
            Edit
          </button>
        </div>
      </div>

      {/* Episodes */}
      {isLoading ? (
        <div className="px-4 py-2 space-y-1.5">
          {[0, 1].map((i) => (
            <div key={i} className="h-7 bg-muted/20 rounded animate-pulse" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <p className="text-[10px] text-muted-foreground px-4 py-2">
          No episodes in this season.
        </p>
      ) : (
        <div className="divide-y divide-border/20">
          {sorted.map((ep) => (
            <div
              key={String(ep.id)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-muted/10 transition-smooth group"
              data-ocid={`episode-row-${String(ep.id)}`}
            >
              {/* Thumbnail */}
              <div className="w-12 h-7 rounded overflow-hidden bg-muted/30 flex-shrink-0">
                {ep.thumbnailUrl ? (
                  <img
                    src={ep.thumbnailUrl}
                    alt={ep.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display =
                        "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Tv className="w-3 h-3 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-display font-medium text-foreground truncate">
                  E{String(ep.episodeNumber)} — {ep.title}
                </p>
                {ep.durationSeconds > 0 && (
                  <p className="text-[10px] text-muted-foreground">
                    {Math.floor(Number(ep.durationSeconds) / 60)}m
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-smooth">
                <button
                  type="button"
                  onClick={() => onEditEpisode(ep)}
                  title="Edit episode"
                  aria-label="Edit episode"
                  className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-smooth"
                  data-ocid={`edit-episode-${String(ep.id)}`}
                >
                  <Pencil className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteEpisode(ep.id)}
                  title="Delete episode"
                  aria-label="Delete episode"
                  className="p-1.5 rounded-lg hover:bg-destructive/20 text-destructive transition-smooth"
                  data-ocid={`delete-episode-${String(ep.id)}`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminVideosPage({
  onTabChange,
}: { onTabChange: (tab: AdminTab) => void }) {
  const { isAdminAuthenticated } = useAdminStore();
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");
  const [toast, setToast] = useState<string | null>(null);
  const [showUploadOpen, setShowUploadOpen] = useState(false);
  const [addEpisodeShow, setAddEpisodeShow] = useState<ShowPublic | null>(null);
  const [editShowTarget, setEditShowTarget] = useState<ShowPublic | null>(null);
  const [expandedShowId, setExpandedShowId] = useState<string | null>(null);

  const [showForm, setShowForm] = useState<NewShowForm>(EMPTY_SHOW);
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [showErrors, setShowErrors] = useState<
    Partial<Record<keyof NewShowForm, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: shows, isLoading: showsLoading } = useQuery<ShowPublic[]>({
    queryKey: ["adminShows"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminListShows();
    },
    enabled: !!actor && !actorFetching,
  });

  if (!isAdminAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
        <p className="text-muted-foreground">
          Please authenticate via the Admin button in the header.
        </p>
      </div>
    );
  }

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const videoRows: ShowRowState[] = (shows ?? []).map(toShowRow);

  const counts: Record<FilterTab, number> = {
    All: videoRows.length,
    Pending: videoRows.filter((v) => v.status === "Pending").length,
    Approved: videoRows.filter((v) => v.status === "Approved").length,
    Flagged: videoRows.filter((v) => v.status === "Flagged").length,
  };

  const filtered =
    activeFilter === "All"
      ? videoRows
      : videoRows.filter((v) => v.status === activeFilter);

  async function handleApprove(id: string) {
    if (!actor) return;
    try {
      await actor.adminApproveShow(BigInt(id), true);
      queryClient.invalidateQueries({ queryKey: ["adminShows"] });
      showToast("Show approved and published");
    } catch {
      showToast("Failed to approve show");
    }
  }

  async function handleDelete(id: string) {
    if (!actor) return;
    try {
      await actor.deleteShow(BigInt(id));
      queryClient.invalidateQueries({ queryKey: ["adminShows"] });
      showToast("Show deleted from platform");
    } catch {
      showToast("Failed to delete show");
    }
  }

  async function handleToggleFree(id: string, currentlyFree: boolean) {
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
        trailerBlob: undefined,
        isFree: !currentlyFree,
      });
      queryClient.invalidateQueries({ queryKey: ["adminShows"] });
      queryClient.invalidateQueries({ queryKey: ["approvedShows"] });
      showToast(
        !currentlyFree
          ? "Show marked as Free for non-subscribers"
          : "Show restricted to subscribers only",
      );
    } catch {
      showToast("Failed to update show access");
    }
  }

  function validateShowForm(): boolean {
    const errors: Partial<Record<keyof NewShowForm, string>> = {};
    if (!showForm.title.trim()) errors.title = "Title is required";
    if (!showForm.description.trim())
      errors.description = "Description is required";
    setShowErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleAddShow(e: React.FormEvent) {
    e.preventDefault();
    if (!validateShowForm() || !actor) return;
    setIsSubmitting(true);
    try {
      const showId = await actor.createShow({
        title: showForm.title,
        description: showForm.description,
        category: showForm.category,
        coverImageUrl: coverUrl.trim() || undefined,
        trailerBlob: undefined,
        isFree: showForm.isFree,
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

  function toggleExpand(id: string) {
    setExpandedShowId((prev) => (prev === id ? null : id));
  }

  return (
    <div
      className="bg-background px-4 md:px-6 py-6 max-w-7xl mx-auto"
      data-ocid="admin-videos-page"
    >
      <AdminNav active="Videos" onTabChange={onTabChange} />

      {/* Toast */}
      {toast && (
        <div
          className="fixed top-6 right-6 z-50 glass-card rounded-xl px-5 py-3 text-sm font-medium text-foreground shadow-lg border border-primary/30"
          data-ocid="admin-toast"
        >
          {toast}
        </div>
      )}

      {/* Add Episode Modal */}
      {addEpisodeShow && (
        <AddEpisodeModal
          show={addEpisodeShow}
          onClose={() => setAddEpisodeShow(null)}
          onSuccess={(msg) => {
            showToast(msg);
            queryClient.invalidateQueries({ queryKey: ["adminShows"] });
            queryClient.invalidateQueries({
              queryKey: ["seasons-panel", String(addEpisodeShow.id)],
            });
          }}
        />
      )}

      {/* Edit Show Modal */}
      {editShowTarget && (
        <EditShowModal
          show={editShowTarget}
          onClose={() => setEditShowTarget(null)}
          onSuccess={(msg) => {
            showToast(msg);
            queryClient.invalidateQueries({ queryKey: ["adminShows"] });
            queryClient.invalidateQueries({ queryKey: ["approvedShows"] });
            setEditShowTarget(null);
          }}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Video Management
        </h1>
        <button
          type="button"
          onClick={() => setShowUploadOpen((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-smooth"
          data-ocid="add-show-btn"
        >
          <Plus className="w-4 h-4" />
          New Show
          {showUploadOpen ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Upload Show Form */}
      {showUploadOpen && (
        <div
          className="glass-card rounded-xl p-6 mb-6 border border-primary/20"
          data-ocid="upload-show-panel"
        >
          <div className="flex items-center gap-2 mb-5">
            <Upload className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-bold text-foreground">
              Upload New Show
            </h2>
          </div>
          <form
            onSubmit={handleAddShow}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Title */}
            <div>
              <label
                className="block text-xs font-medium text-muted-foreground mb-1.5"
                htmlFor="show-title"
              >
                Title <span className="text-destructive">*</span>
              </label>
              <input
                id="show-title"
                type="text"
                value={showForm.title}
                onChange={(e) =>
                  setShowForm((f) => ({ ...f, title: e.target.value }))
                }
                className="w-full px-3 py-2.5 rounded-lg bg-muted/30 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth"
                placeholder="Show title"
                data-ocid="show-title-input"
              />
              {showErrors.title && (
                <p className="mt-1 text-xs text-destructive">
                  {showErrors.title}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label
                className="block text-xs font-medium text-muted-foreground mb-1.5"
                htmlFor="show-category"
              >
                Category
              </label>
              <select
                id="show-category"
                value={showForm.category}
                onChange={(e) =>
                  setShowForm((f) => ({
                    ...f,
                    category: e.target.value as BackendCategory,
                  }))
                }
                className="w-full px-3 py-2.5 rounded-lg bg-muted/30 border border-border/60 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth"
                data-ocid="show-category-select"
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label
                className="block text-xs font-medium text-muted-foreground mb-1.5"
                htmlFor="show-desc"
              >
                Description <span className="text-destructive">*</span>
              </label>
              <textarea
                id="show-desc"
                value={showForm.description}
                rows={3}
                onChange={(e) =>
                  setShowForm((f) => ({ ...f, description: e.target.value }))
                }
                className="w-full px-3 py-2.5 rounded-lg bg-muted/30 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth resize-none"
                placeholder="Describe the show..."
                data-ocid="show-desc-input"
              />
              {showErrors.description && (
                <p className="mt-1 text-xs text-destructive">
                  {showErrors.description}
                </p>
              )}
            </div>

            {/* Cover Image URL */}
            <div>
              <label
                className="block text-xs font-medium text-muted-foreground mb-1.5"
                htmlFor="show-cover-url"
              >
                Cover Image URL (Thumbnail)
              </label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                <input
                  id="show-cover-url"
                  type="url"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="https://example.com/cover.jpg"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-muted/30 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-smooth"
                  data-ocid="show-cover-url-input"
                />
              </div>
              {coverUrl && (
                <div className="mt-2 w-24 aspect-[2/3] rounded-lg overflow-hidden bg-muted/30 border border-border/40">
                  <img
                    src={coverUrl}
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

            {/* Free toggle */}
            <div className="flex items-start gap-3 pt-6">
              <div className="relative mt-0.5">
                <input
                  id="show-is-free"
                  type="checkbox"
                  checked={showForm.isFree}
                  onChange={(e) =>
                    setShowForm((f) => ({ ...f, isFree: e.target.checked }))
                  }
                  className="sr-only"
                  data-ocid="show-free-checkbox"
                />
                <button
                  type="button"
                  role="switch"
                  aria-checked={showForm.isFree}
                  aria-labelledby="show-is-free-label"
                  onClick={() =>
                    setShowForm((f) => ({ ...f, isFree: !f.isFree }))
                  }
                  className={`relative rounded-full border transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
                    showForm.isFree
                      ? "bg-emerald-500/80 border-emerald-500"
                      : "bg-muted/40 border-border/60"
                  }`}
                  style={{ width: "2.5rem", height: "1.375rem" }}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-foreground transition-transform ${
                      showForm.isFree
                        ? "translate-x-[1.125rem]"
                        : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              <div>
                <label
                  id="show-is-free-label"
                  htmlFor="show-is-free"
                  className="text-sm font-medium text-foreground cursor-pointer flex items-center gap-1.5"
                >
                  <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                  Free for non-subscribers
                </label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Anyone can watch — no subscription required
                </p>
              </div>
            </div>

            {/* Form actions */}
            <div className="md:col-span-2 flex justify-end gap-3 pt-2 border-t border-border/50 mt-2">
              <button
                type="button"
                onClick={() => {
                  setShowUploadOpen(false);
                  setShowErrors({});
                  setShowForm(EMPTY_SHOW);
                  setCoverUrl("");
                }}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-smooth"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-smooth disabled:opacity-60"
                data-ocid="submit-show-btn"
              >
                <Plus className="w-4 h-4" />
                {isSubmitting ? "Creating..." : "Create Show"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Tabs */}
      <div
        className="flex items-center gap-2 mb-6 flex-wrap"
        data-ocid="video-filter-tabs"
      >
        <Filter className="w-4 h-4 text-muted-foreground mr-1" />
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            data-ocid={`filter-${tab.toLowerCase()}`}
            onClick={() => setActiveFilter(tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
              activeFilter === tab
                ? "bg-primary text-primary-foreground"
                : "bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {tab}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${activeFilter === tab ? "bg-primary-foreground/20" : "bg-muted"}`}
            >
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div
        className="glass-card rounded-xl overflow-hidden"
        data-ocid="videos-table"
      >
        {showsLoading ? (
          <div className="p-8 space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-14 bg-muted/20 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/10">
                  <th className="text-left px-4 py-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider w-16">
                    Cover
                  </th>
                  <th className="text-left px-4 py-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                    Title
                  </th>
                  <th className="text-left px-4 py-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider hidden md:table-cell">
                    Category
                  </th>
                  <th className="text-left px-4 py-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider hidden sm:table-cell">
                    Access
                  </th>
                  <th className="text-left px-4 py-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-4 py-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((video, i) => {
                  const isExpanded = expandedShowId === video.id;
                  const backendShow = (shows ?? []).find(
                    (s) => String(s.id) === video.id,
                  );
                  return (
                    <>
                      <tr
                        key={video.id}
                        className={`border-b border-border/50 ${i % 2 === 0 ? "" : "bg-muted/5"}`}
                        data-ocid={`video-row-${video.id}`}
                      >
                        <td className="px-4 py-3">
                          <div className="w-16 h-9 rounded-lg overflow-hidden bg-muted/30 flex items-center justify-center">
                            {video.coverUrl ? (
                              <img
                                src={video.coverUrl}
                                alt={video.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (
                                    e.currentTarget as HTMLImageElement
                                  ).style.display = "none";
                                }}
                              />
                            ) : (
                              <Tv className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-foreground max-w-[200px] truncate">
                            {video.title}
                          </p>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {video.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleFree(video.id, video.isFree)
                            }
                            title={
                              video.isFree
                                ? "Free — click to restrict"
                                : "Subscribers only — click to make free"
                            }
                            data-ocid={`toggle-free-${video.id}`}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-smooth hover:opacity-80 ${
                              video.isFree
                                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                : "bg-muted/30 text-muted-foreground border-border/40"
                            }`}
                          >
                            <Unlock className="w-3 h-3" />
                            {video.isFree ? "Free" : "Subscribers"}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[video.status]}`}
                          >
                            {video.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            {/* Edit Show */}
                            <button
                              type="button"
                              data-ocid={`edit-show-${video.id}`}
                              onClick={() => {
                                if (backendShow) setEditShowTarget(backendShow);
                              }}
                              title="Edit show details"
                              aria-label="Edit show details"
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-muted/30 text-muted-foreground border border-border/40 hover:bg-primary/15 hover:text-primary hover:border-primary/30 text-xs font-semibold transition-smooth"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Edit</span>
                            </button>

                            {/* Expand episodes */}
                            <button
                              type="button"
                              data-ocid={`expand-episodes-${video.id}`}
                              onClick={() => toggleExpand(video.id)}
                              title={
                                isExpanded ? "Hide episodes" : "Manage episodes"
                              }
                              aria-label="Manage episodes"
                              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-smooth ${
                                isExpanded
                                  ? "bg-primary/20 border-primary/40 text-primary"
                                  : "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
                              }`}
                            >
                              <Film className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">
                                {isExpanded ? "Hide" : "Episodes"}
                              </span>
                            </button>

                            {/* Add Episode */}
                            <button
                              type="button"
                              data-ocid={`add-episode-${video.id}`}
                              onClick={() => {
                                if (backendShow) setAddEpisodeShow(backendShow);
                              }}
                              title="Add Episode"
                              aria-label="Add episode to show"
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-muted/30 text-muted-foreground border border-border/40 hover:bg-muted/50 text-xs font-semibold transition-smooth"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Add Ep</span>
                            </button>

                            {video.status !== "Approved" && (
                              <button
                                type="button"
                                data-ocid={`approve-video-${video.id}`}
                                onClick={() => handleApprove(video.id)}
                                title="Approve"
                                aria-label="Approve show"
                                className="p-1.5 rounded-lg hover:bg-emerald-500/20 text-emerald-400 transition-smooth"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            {video.status !== "Flagged" && (
                              <button
                                type="button"
                                data-ocid={`flag-video-${video.id}`}
                                onClick={() =>
                                  showToast("Flag feature coming soon")
                                }
                                title="Flag"
                                aria-label="Flag show"
                                className="p-1.5 rounded-lg hover:bg-amber-500/20 text-amber-400 transition-smooth"
                              >
                                <Flag className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              type="button"
                              data-ocid={`delete-video-${video.id}`}
                              onClick={() => handleDelete(video.id)}
                              title="Delete"
                              aria-label="Delete show"
                              className="p-1.5 rounded-lg hover:bg-destructive/20 text-destructive transition-smooth"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Episodes panel — expanded inline */}
                      {isExpanded && backendShow && (
                        <tr
                          key={`${video.id}-episodes`}
                          data-ocid={`episodes-panel-${video.id}`}
                        >
                          <td colSpan={6} className="p-0">
                            <EpisodesPanel
                              show={backendShow}
                              onToast={showToast}
                            />
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {!showsLoading && filtered.length === 0 && (
          <div
            className="py-16 text-center text-muted-foreground"
            data-ocid="no-videos"
          >
            {(shows ?? []).length === 0
              ? "No shows uploaded yet. Create your first show above."
              : "No shows match the selected filter."}
          </div>
        )}
      </div>
    </div>
  );
}
