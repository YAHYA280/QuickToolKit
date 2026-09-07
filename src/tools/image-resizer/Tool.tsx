"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DownloadIcon, LoaderCircleIcon, UploadIcon } from "lucide-react";
import {
  Button,
  CheckboxField,
  ErrorText,
  Hint,
  Label,
  NumberInput,
  Segmented,
  SelectField,
  SliderField,
  Stat,
  ToolActions,
  ToolPanel,
} from "@/components/tools/ui";
import { cn } from "@/lib/utils";
import {
  MAX_DIMENSION,
  downloadBlob,
  extensionFor,
  formatBytes,
  formatLabel,
  guessType,
  isAcceptedType,
  loadImage,
  releaseImage,
  renderToBlob,
  resolveOutputType,
  type CropRect,
  type ImageSource,
  type OutputType,
} from "../image-compressor/image-utils";

type Mode = "pixels" | "percent" | "preset";
type Fit = "fit" | "fill" | "stretch";
type Format = "keep" | OutputType;

interface Source {
  file: File;
  url: string;
  width: number;
  height: number;
  type: string;
}

interface Plan {
  width: number;
  height: number;
  crop?: CropRect;
}

interface Result {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  type: OutputType;
}

const PRESETS = [
  { value: "1920x1080", label: "1920 x 1080 (Full HD)" },
  { value: "1280x720", label: "1280 x 720 (HD)" },
  { value: "1080x1080", label: "1080 x 1080 (Instagram)" },
  { value: "1200x630", label: "1200 x 630 (Open Graph)" },
  { value: "800x600", label: "800 x 600" },
  { value: "512x512", label: "512 x 512" },
  { value: "256x256", label: "256 x 256" },
  { value: "128x128", label: "128 x 128 (icon)" },
] as const;

const MODE_OPTIONS = [
  { value: "pixels", label: "By pixels" },
  { value: "percent", label: "By percentage" },
  { value: "preset", label: "Preset" },
] as const;

const FIT_OPTIONS = [
  { value: "fit", label: "Fit" },
  { value: "fill", label: "Fill" },
  { value: "stretch", label: "Stretch" },
] as const;

const FORMAT_OPTIONS = [
  { value: "keep", label: "Keep original" },
  { value: "image/jpeg", label: "JPEG" },
  { value: "image/png", label: "PNG" },
  { value: "image/webp", label: "WebP" },
] as const;

const FIT_HINTS: Record<Fit, string> = {
  fit: "Scales the whole picture to fit inside the frame; one side may end up smaller than the preset.",
  fill: "Scales to cover the frame and crops the overflow evenly from the center.",
  stretch: "Forces the exact size and ignores the aspect ratio.",
};

const HIGHLIGHT_STAT = "border-primary bg-primary text-primary-foreground [&_.label-mono]:text-primary-foreground/80";

function planOutput(
  src: Source,
  mode: Mode,
  width: number | "",
  height: number | "",
  percent: number,
  preset: string,
  fit: Fit,
): Plan {
  const round = (n: number) => Math.max(1, Math.round(n));
  if (mode === "percent") {
    const s = percent / 100;
    return { width: round(src.width * s), height: round(src.height * s) };
  }
  if (mode === "preset") {
    const [tw, th] = preset.split("x").map(Number);
    if (fit === "stretch") return { width: tw, height: th };
    if (fit === "fit") {
      const s = Math.min(tw / src.width, th / src.height);
      return { width: round(src.width * s), height: round(src.height * s) };
    }
    const s = Math.max(tw / src.width, th / src.height);
    const sw = tw / s;
    const sh = th / s;
    return { width: tw, height: th, crop: { sx: (src.width - sw) / 2, sy: (src.height - sh) / 2, sw, sh } };
  }
  const w = width === "" ? 0 : Number(width);
  const h = height === "" ? 0 : Number(height);
  if (w <= 0 && h <= 0) return { width: src.width, height: src.height };
  if (w <= 0) return { width: round((h * src.width) / src.height), height: round(h) };
  if (h <= 0) return { width: round(w), height: round((w * src.height) / src.width) };
  return { width: round(w), height: round(h) };
}

export default function ImageResizerTool() {
  const [src, setSrc] = useState<Source | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [mode, setMode] = useState<Mode>("pixels");
  const [width, setWidth] = useState<number | "">("");
  const [height, setHeight] = useState<number | "">("");
  const [lock, setLock] = useState(true);
  const [percent, setPercent] = useState(100);
  const [preset, setPreset] = useState<string>(PRESETS[0].value);
  const [fit, setFit] = useState<Fit>("fit");
  const [format, setFormat] = useState<Format>("keep");
  const [quality, setQuality] = useState(85);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  // Decoded bitmap, object URLs and a render sequence number live outside React state.
  const resources = useRef<{ bitmap: ImageSource | null; srcUrl: string | null; resultUrl: string | null; seq: number }>({
    bitmap: null,
    srcUrl: null,
    resultUrl: null,
    seq: 0,
  });

  useEffect(() => {
    const res = resources.current;
    return () => {
      if (res.bitmap) releaseImage(res.bitmap);
      if (res.srcUrl) URL.revokeObjectURL(res.srcUrl);
      if (res.resultUrl) URL.revokeObjectURL(res.resultUrl);
      res.bitmap = null;
      res.srcUrl = null;
      res.resultUrl = null;
    };
  }, []);

  const plan = useMemo(
    () => (src ? planOutput(src, mode, width, height, percent, preset, fit) : null),
    [src, mode, width, height, percent, preset, fit],
  );
  const outType = src ? resolveOutputType(format, src.type) : null;
  const lossy = outType !== null && outType !== "image/png";
  const tooLarge = plan !== null && Math.max(plan.width, plan.height) > MAX_DIMENSION;
  const upscaling = Boolean(src && plan && (plan.width > src.width || plan.height > src.height));
  const scale = src && plan ? (plan.crop ? plan.width / plan.crop.sw : plan.width / src.width) : 1;

  const dropResult = () => {
    const res = resources.current;
    res.seq++;
    if (res.resultUrl) URL.revokeObjectURL(res.resultUrl);
    res.resultUrl = null;
    setResult(null);
  };

  /** Encode the current plan after `delay` ms. Returns a cancel function for the pending timer. */
  const startRender = useCallback(
    (delay: number) => {
      const res = resources.current;
      if (!src || !plan || !outType || tooLarge || !res.bitmap) return () => {};
      const bitmap = res.bitmap;
      const seq = ++res.seq;
      const timer = setTimeout(async () => {
        setBusy(true);
        try {
          const blob = await renderToBlob(bitmap, {
            width: plan.width,
            height: plan.height,
            type: outType,
            quality: quality / 100,
            crop: plan.crop,
          });
          if (seq !== res.seq) return;
          const url = URL.createObjectURL(blob);
          if (res.resultUrl) URL.revokeObjectURL(res.resultUrl);
          res.resultUrl = url;
          setResult({ blob, url, width: plan.width, height: plan.height, type: outType });
          setError("");
        } catch (e) {
          if (seq === res.seq) setError(e instanceof Error ? e.message : "Could not render the image");
        } finally {
          if (seq === res.seq) setBusy(false);
        }
      }, delay);
      return () => clearTimeout(timer);
    },
    [src, plan, outType, quality, tooLarge],
  );

  // Live preview: re-encode shortly after any setting changes.
  useEffect(() => startRender(300), [startRender]);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    const type = guessType(file);
    if (!isAcceptedType(type)) {
      setError(`Unsupported file: ${file.name}. Use JPG, PNG, WebP, GIF or BMP.`);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const loaded = await loadImage(file);
      const res = resources.current;
      if (res.bitmap) releaseImage(res.bitmap);
      res.bitmap = loaded.bitmap;
      if (res.srcUrl) URL.revokeObjectURL(res.srcUrl);
      const url = URL.createObjectURL(file);
      res.srcUrl = url;
      dropResult();
      setSrc({ file, url, width: loaded.width, height: loaded.height, type });
      setWidth(loaded.width);
      setHeight(loaded.height);
      setPercent(100);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load this image");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    const res = resources.current;
    if (res.bitmap) releaseImage(res.bitmap);
    res.bitmap = null;
    if (res.srcUrl) URL.revokeObjectURL(res.srcUrl);
    res.srcUrl = null;
    dropResult();
    setSrc(null);
    setWidth("");
    setHeight("");
    setPercent(100);
    setMode("pixels");
    setError("");
  };

  const onWidthChange = (v: number | "") => {
    setWidth(v);
    if (lock && src && v !== "" && v > 0) setHeight(Math.max(1, Math.round((v * src.height) / src.width)));
  };

  const onHeightChange = (v: number | "") => {
    setHeight(v);
    if (lock && src && v !== "" && v > 0) setWidth(Math.max(1, Math.round((v * src.width) / src.height)));
  };

  const onLockChange = (v: boolean) => {
    setLock(v);
    if (v && src && width !== "" && width > 0) setHeight(Math.max(1, Math.round((width * src.height) / src.width)));
  };

  const download = () => {
    if (!src || !result) return;
    const stem = src.file.name.replace(/\.[^.]+$/, "");
    downloadBlob(result.blob, `${stem}-${result.width}x${result.height}.${extensionFor(result.type)}`);
  };

  return (
    <ToolPanel>
      <label
        htmlFor="rz-file"
        onDragOver={(e) => {
          e.preventDefault();
          if (!dragging) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          onFile(e.dataTransfer.files[0]);
        }}
        className={cn(
          "flex min-h-40 cursor-pointer flex-col items-center justify-center border-2 border-dashed border-border bg-card p-6 text-center hover:bg-highlight hover:text-highlight-foreground",
          dragging && "bg-highlight text-highlight-foreground",
          src && "min-h-24",
        )}
      >
        <input
          id="rz-file"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            onFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        {loading ? (
          <LoaderCircleIcon className="mb-2 size-6 animate-spin" aria-hidden />
        ) : (
          <UploadIcon className="mb-2 size-6" aria-hidden />
        )}
        <span className="text-sm font-bold">{src ? "Drop another image to replace it" : "Drop an image here or click to choose"}</span>
        <span className="mt-1 font-mono text-[11px] opacity-80">JPG, PNG, WebP, GIF, BMP · up to {MAX_DIMENSION} px</span>
      </label>

      {src && (
        <div className="mt-3 flex items-center gap-3 border-2 border-border bg-card p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src.url} alt="" className="size-14 shrink-0 border-2 border-border object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">{src.file.name}</p>
            <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
              {src.width} x {src.height} px · {formatBytes(src.file.size)} · {src.type.replace("image/", "").toUpperCase()}
            </p>
          </div>
        </div>
      )}

      <div className={cn("mt-4 grid gap-6 md:grid-cols-2", !src && "pointer-events-none opacity-60")} aria-disabled={!src || undefined}>
        <div>
          <Label>Resize mode</Label>
          <Segmented value={mode} onChange={setMode} options={MODE_OPTIONS} aria-label="Resize mode" className="flex-wrap" />

          {mode === "pixels" && (
            <div className="mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="rz-w">Width</Label>
                  <NumberInput id="rz-w" value={width} onChange={onWidthChange} min={1} max={MAX_DIMENSION} step={1} suffix="px" />
                </div>
                <div>
                  <Label htmlFor="rz-h">Height</Label>
                  <NumberInput id="rz-h" value={height} onChange={onHeightChange} min={1} max={MAX_DIMENSION} step={1} suffix="px" />
                </div>
              </div>
              <CheckboxField id="rz-lock" checked={lock} onChange={onLockChange} label="Lock aspect ratio" className="mt-3" />
              <Hint>Leave one field empty to derive it from the other.</Hint>
            </div>
          )}

          {mode === "percent" && (
            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between">
                <Label htmlFor="rz-pct" className="mb-0">
                  Scale
                </Label>
                <Hint className="mt-0">{percent}%</Hint>
              </div>
              <div className="pt-2.5">
                <SliderField id="rz-pct" value={percent} onChange={setPercent} min={1} max={200} aria-label="Scale percentage" />
              </div>
              <Hint>100% keeps the original size; 50% halves both sides.</Hint>
            </div>
          )}

          {mode === "preset" && (
            <div className="mt-4">
              <Label htmlFor="rz-preset">Preset size</Label>
              <SelectField id="rz-preset" value={preset} onChange={setPreset} options={PRESETS} />
              <Label className="mt-3">Fit mode</Label>
              <Segmented value={fit} onChange={setFit} options={FIT_OPTIONS} aria-label="Fit mode" />
              <Hint>{FIT_HINTS[fit]}</Hint>
            </div>
          )}

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="rz-format">Output format</Label>
              <SelectField id="rz-format" value={format} onChange={(v) => setFormat(v as Format)} options={FORMAT_OPTIONS} />
            </div>
            {lossy && (
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <Label htmlFor="rz-quality" className="mb-0">
                    Quality
                  </Label>
                  <Hint className="mt-0">{quality}</Hint>
                </div>
                <div className="pt-2.5">
                  <SliderField id="rz-quality" value={quality} onChange={setQuality} min={10} max={100} aria-label="Quality" />
                </div>
              </div>
            )}
          </div>
          {outType === "image/jpeg" && src && src.type !== "image/jpeg" && (
            <Hint>JPEG has no transparency; transparent areas become white.</Hint>
          )}
          {upscaling && (
            <Hint className="text-destructive">Upscaling above 100% cannot add detail; the result will look softer than the original.</Hint>
          )}
        </div>

        <div>
          <Label>Preview</Label>
          <div className="flex min-h-56 items-center justify-center border-2 border-border bg-muted p-2">
            {result ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={result.url}
                alt={`Resized preview, ${result.width} by ${result.height} pixels`}
                width={result.width}
                height={result.height}
                className={cn("h-auto max-h-96 w-auto max-w-full border-2 border-border bg-card object-contain", busy && "opacity-60")}
              />
            ) : (
              <span className="font-mono text-[11px] text-muted-foreground">
                {src ? (busy ? "Rendering…" : "Preview appears here") : "Load an image to see the result"}
              </span>
            )}
          </div>
          {result && (
            <Hint>
              Shown scaled to fit; the file is {result.width} x {result.height} px {formatLabel(result.type)}.
            </Hint>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Output dimensions" value={plan ? `${plan.width} x ${plan.height}` : "0 x 0"} className={HIGHLIGHT_STAT} />
        <Stat label="Output size" value={result ? formatBytes(result.blob.size) : src ? "Pending" : "0 B"} />
        <Stat label="Original" value={src ? `${src.width} x ${src.height}` : "0 x 0"} />
        <Stat label="Scale" value={`${Math.round(scale * 100)}%`} />
      </div>

      <ToolActions>
        <Button variant="primary" onClick={() => startRender(0)} disabled={!src || busy || tooLarge}>
          {busy ? (
            <>
              <LoaderCircleIcon data-icon="inline-start" className="animate-spin" />
              Working…
            </>
          ) : (
            "Resize"
          )}
        </Button>
        <Button onClick={download} disabled={!result || busy}>
          <DownloadIcon data-icon="inline-start" />
          Download
        </Button>
        <Button variant="ghost" onClick={reset} disabled={!src}>
          Reset
        </Button>
        <span className="flex-1" />
        <Hint className="mt-0">Files never leave your browser.</Hint>
      </ToolActions>
      <ErrorText>{tooLarge ? `Output exceeds ${MAX_DIMENSION} px on the long side; lower the size.` : error}</ErrorText>
    </ToolPanel>
  );
}
