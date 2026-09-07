/* ------------------------------------------------------------------
   Shared browser-only image helpers for the compressor and resizer.
   Decoding, scaling and encoding all happen through the canvas API;
   nothing is sent anywhere.
   ------------------------------------------------------------------ */

/** Long-side cap for the working canvas; larger inputs or outputs are rejected. */
export const MAX_DIMENSION = 8192;

export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp"] as const;
export type AcceptedType = (typeof ACCEPTED_TYPES)[number];

/** Formats the canvas can encode. GIF and BMP sources are written out as PNG. */
export type OutputType = "image/jpeg" | "image/png" | "image/webp";

export type ImageSource = ImageBitmap | HTMLImageElement;

export interface LoadedImage {
  bitmap: ImageSource;
  width: number;
  height: number;
}

export interface CropRect {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
}

export interface RenderOptions {
  width: number;
  height: number;
  type: OutputType;
  /** 0 to 1; ignored for PNG. */
  quality?: number;
  /** Source rectangle to draw from (used for cover crops). Defaults to the whole image. */
  crop?: CropRect;
}

const EXT_TO_TYPE: Record<string, AcceptedType> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  bmp: "image/bmp",
};

export function isAcceptedType(type: string): type is AcceptedType {
  return (ACCEPTED_TYPES as readonly string[]).includes(type);
}

/** MIME type of a File, falling back to its extension when the browser reports none. */
export function guessType(file: File): string {
  if (file.type) return file.type.toLowerCase();
  const ext = file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase();
  return EXT_TO_TYPE[ext] ?? "";
}

export function resolveOutputType(requested: OutputType | "keep", sourceType: string): OutputType {
  if (requested !== "keep") return requested;
  if (sourceType === "image/jpeg" || sourceType === "image/webp") return sourceType;
  return "image/png";
}

export function extensionFor(type: OutputType): "jpg" | "png" | "webp" {
  if (type === "image/jpeg") return "jpg";
  if (type === "image/webp") return "webp";
  return "png";
}

export function formatLabel(type: OutputType): "JPEG" | "PNG" | "WebP" {
  if (type === "image/jpeg") return "JPEG";
  if (type === "image/webp") return "WebP";
  return "PNG";
}

function decodeWithImageElement(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not decode this image"));
    };
    img.src = url;
  });
}

function assertWithinLimit(width: number, height: number, what: string) {
  if (Math.max(width, height) > MAX_DIMENSION) {
    throw new Error(`${what} is ${width} x ${height} px; the limit is ${MAX_DIMENSION} px on the long side`);
  }
}

/** Decode a File. Prefers createImageBitmap (off the main thread, honours EXIF rotation), falls back to an <img>. */
export async function loadImage(file: File): Promise<LoadedImage> {
  let loaded: LoadedImage | null = null;
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      loaded = { bitmap, width: bitmap.width, height: bitmap.height };
    } catch {
      loaded = null;
    }
  }
  if (!loaded) {
    const img = await decodeWithImageElement(file);
    loaded = { bitmap: img, width: img.naturalWidth, height: img.naturalHeight };
  }
  if (loaded.width === 0 || loaded.height === 0) {
    releaseImage(loaded.bitmap);
    throw new Error("Could not decode this image");
  }
  try {
    assertWithinLimit(loaded.width, loaded.height, "Image");
  } catch (e) {
    releaseImage(loaded.bitmap);
    throw e;
  }
  return loaded;
}

/** Free GPU/CPU memory held by an ImageBitmap. No-op for <img>. */
export function releaseImage(source: ImageSource): void {
  if ("close" in source && typeof source.close === "function") source.close();
}

/** Draw the source onto a canvas at the requested size and encode it. */
export async function renderToBlob(source: ImageSource, options: RenderOptions): Promise<Blob> {
  const width = Math.max(1, Math.round(options.width));
  const height = Math.max(1, Math.round(options.height));
  assertWithinLimit(width, height, "Output");

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D is not available in this browser");

  // JPEG has no alpha channel: transparent areas would otherwise turn black.
  if (options.type === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const crop = options.crop;
  if (crop) ctx.drawImage(source, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, width, height);
  else ctx.drawImage(source, 0, 0, width, height);

  const quality = options.type === "image/png" ? undefined : clamp01(options.quality ?? 0.8);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, options.type, quality));
  canvas.width = 0;
  canvas.height = 0;
  if (!blob) throw new Error("Encoding failed; the image may be too large for this device");
  // Browsers that cannot encode the requested type silently fall back to PNG.
  if (blob.type !== options.type) {
    throw new Error(`${formatLabel(options.type)} export is not supported by this browser`);
  }
  return blob;
}

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

export function formatBytes(n: number): string {
  if (!Number.isFinite(n) || n < 0) return "0 B";
  if (n < 1024) return `${Math.round(n)} B`;
  const units = ["KB", "MB", "GB"];
  let value = n / 1024;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  const digits = value < 10 ? 2 : value < 100 ? 1 : 0;
  return `${value.toFixed(digits)} ${units[i]}`;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Give the browser a moment to start the download before releasing the URL.
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function replaceExtension(name: string, ext: string): string {
  const clean = ext.replace(/^\./, "");
  const dot = name.lastIndexOf(".");
  const stem = dot > 0 ? name.slice(0, dot) : name;
  return `${stem}.${clean}`;
}

/** Keep the original file name when the format is unchanged; otherwise swap the extension. */
export function outputFilename(name: string, sourceType: string, type: OutputType): string {
  if (sourceType === type) return name;
  return replaceExtension(name, extensionFor(type));
}
