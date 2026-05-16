import { a as useActor, r as reactExports, E as ExternalBlob, d as createActor } from "./index-BiC3Bukn.js";
function bytesToHex(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = Number.parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}
function isObjStoreUrl(url) {
  return url.startsWith("objstore:");
}
function getObjStoreHash(url) {
  return url.slice("objstore:".length);
}
function useVideoUpload() {
  const { actor, isFetching } = useActor(createActor);
  const uploadFile = reactExports.useCallback(
    async (file, onProgress) => {
      if (!actor) {
        throw new Error(
          "Not connected to the network. Please wait a moment and try again."
        );
      }
      const backendWithStorage = actor;
      if (typeof backendWithStorage._uploadFile !== "function" || typeof backendWithStorage._downloadFile !== "function") {
        throw new Error(
          "Storage upload is not available. Please use the link option instead."
        );
      }
      onProgress(10);
      const arrayBuffer = await file.arrayBuffer();
      const fileBytes = new Uint8Array(arrayBuffer);
      onProgress(40);
      const externalBlob = ExternalBlob.fromBytes(fileBytes).withUploadProgress(
        (pct) => {
          onProgress(40 + Math.round(pct * 0.5));
        }
      );
      const hashBytes = await backendWithStorage._uploadFile(externalBlob);
      onProgress(100);
      return `objstore:${bytesToHex(hashBytes)}`;
    },
    [actor]
  );
  return { uploadFile: actor && !isFetching ? uploadFile : void 0 };
}
export {
  getObjStoreHash as g,
  hexToBytes as h,
  isObjStoreUrl as i,
  useVideoUpload as u
};
