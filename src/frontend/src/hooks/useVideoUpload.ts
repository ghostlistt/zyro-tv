import { useActor } from "@caffeineai/core-infrastructure";
import { useCallback } from "react";
import { createActor } from "../backend";
import { ExternalBlob } from "../backend";

/**
 * Simple single-file video upload hook.
 *
 * Reads the entire file into memory, calls _uploadFile once with the full
 * Uint8Array, and returns the resulting hash encoded as a special URL that
 * can be used to re-fetch the video from object storage at any time.
 *
 * The stored URL format is: "objstore:<hex-encoded-hash>"
 * This is a persistent identifier that works across sessions.
 *
 * No chunking — uploads the video as one file for reliability on all devices.
 */

interface BackendWithStorage {
  _uploadFile: (blob: ExternalBlob) => Promise<Uint8Array<ArrayBuffer>>;
  _downloadFile: (bytes: Uint8Array<ArrayBuffer>) => Promise<ExternalBlob>;
}

/** Encode a Uint8Array to a hex string */
function bytesToHex(bytes: Uint8Array<ArrayBuffer>): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Decode a hex string back to Uint8Array */
export function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = Number.parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

/** Check if a videoUrl is a stored object-storage hash reference */
export function isObjStoreUrl(url: string): boolean {
  return url.startsWith("objstore:");
}

/** Extract the hex hash from an objstore URL */
export function getObjStoreHash(url: string): string {
  return url.slice("objstore:".length);
}

export function useVideoUpload() {
  const { actor, isFetching } = useActor(createActor);

  const uploadFile = useCallback(
    async (
      file: File,
      onProgress: (percentage: number) => void,
    ): Promise<string> => {
      if (!actor) {
        throw new Error(
          "Not connected to the network. Please wait a moment and try again.",
        );
      }

      const backendWithStorage = actor as unknown as BackendWithStorage;

      if (
        typeof backendWithStorage._uploadFile !== "function" ||
        typeof backendWithStorage._downloadFile !== "function"
      ) {
        throw new Error(
          "Storage upload is not available. Please use the link option instead.",
        );
      }

      // Notify UI that we've started
      onProgress(10);

      // Read the entire file into memory as Uint8Array
      const arrayBuffer = await file.arrayBuffer();
      const fileBytes = new Uint8Array(arrayBuffer);

      onProgress(40);

      // Upload to object storage — single call, with progress callback
      const externalBlob = ExternalBlob.fromBytes(fileBytes).withUploadProgress(
        (pct: number) => {
          // Map 0–100 upload progress to 40–90% of overall progress
          onProgress(40 + Math.round(pct * 0.5));
        },
      );

      const hashBytes = await backendWithStorage._uploadFile(externalBlob);

      onProgress(100);

      // Store the hash as a hex-encoded "objstore:" URL.
      // This is a persistent reference — NOT a blob:// URL that expires.
      // WatchPage will call _downloadFile(hash) fresh each time to get a
      // valid playable URL for the current session.
      return `objstore:${bytesToHex(hashBytes)}`;
    },
    [actor],
  );

  return { uploadFile: actor && !isFetching ? uploadFile : undefined };
}
