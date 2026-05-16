/**
 * Returns a usable image src from a stored value.
 *
 * The backend now stores images as plain URL strings (coverImageUrl, thumbnailUrl, videoUrl).
 * This utility passes through any http/https/blob/data URLs directly.
 *
 * Legacy hex-encoded blobs are also handled for backwards compatibility.
 */

const cache = new Map<string, string>();

export function hexToImageSrc(
  value: string | null | undefined,
): string | undefined {
  if (!value || value.trim().length === 0) return undefined;

  const trimmed = value.trim();

  // If it looks like a real URL (http/https/blob/data), return as-is
  if (
    trimmed.startsWith("http") ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }

  // Return cached result if available
  const cached = cache.get(trimmed);
  if (cached) return cached;

  // Validate it's actually a hex string before converting
  if (!/^[0-9a-fA-F]+$/.test(trimmed)) {
    return undefined;
  }

  // Ensure even length — pad with leading zero if odd
  const normalized = trimmed.length % 2 !== 0 ? `0${trimmed}` : trimmed;

  // Convert hex → Uint8Array
  const len = normalized.length / 2;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = Number.parseInt(normalized.slice(i * 2, i * 2 + 2), 16);
  }

  if (len < 4) return undefined;

  // Detect MIME type from magic bytes
  let mimeType = "image/jpeg";
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    mimeType = "image/png";
  } else if (bytes[0] === 0xff && bytes[1] === 0xd8) {
    mimeType = "image/jpeg";
  } else if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
    mimeType = "image/gif";
  } else if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46
  ) {
    mimeType = "image/webp";
  }

  try {
    const blob = new Blob([bytes], { type: mimeType });
    const url = URL.createObjectURL(blob);
    cache.set(trimmed, url);
    return url;
  } catch {
    return undefined;
  }
}
