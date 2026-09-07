"use client";

import { useEffect, useRef, useState } from "react";
import { DownloadIcon, LoaderCircleIcon, UploadIcon, XIcon } from "lucide-react";
import {
  Button,
  CheckboxField,
  Chip,
  ErrorText,
  Hint,
  Label,
  NumberInput,
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
  formatBytes,
  formatLabel,
  guessType,
  isAcceptedType,
  loadImage,
  outputFilename,
  releaseImage,
  renderToBlob,
  resolveOutputType,
  type OutputType,
} from "./image-utils";

type Format = "keep" | OutputType;
type Status = "idle" | "working" | "done" | "error";

interface Item {
  id: string;
  file: File;
  sourceType: string;
  previewUrl: string;
  status: Status;
  width?: number;
  height?: number;
  result?: { blob: Blob; width: number; height: number; type: OutputType };
  error?: string;
}

const FORMAT_OPTIONS = [
  { value: "keep", label: "Keep original" },
  { value: "image/jpeg", label: "JPEG" },
  { value: "image/webp", label: "WebP" },
  { value: "image/png", label: "PNG" },
] as const;

const HIGHLIGHT_STAT = "border-primary bg-primary text-primary-foreground [&_.label-mono]:text-primary-foreground/80";

let counter = 0;
const nextId = () => `img-${Date.now().toString(36)}-${counter++}`;
const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Positive when the output is smaller than the input. */
function savedPercent(before: number, after: number): number {
  return before > 0 ? ((before - after) / before) * 100 : 0;
}

function savedLabel(pct: number): string {
  const abs = Math.abs(pct);
  const digits = abs < 10 ? 1 : 0;
  return `${pct >= 0 ? "-" : "+"}${abs.toFixed(digits)}%`;
}

export default function ImageCompressorTool() {
  const [items, setItems] = useState<Item[]>([]);
  const [format, setFormat] = useState<Format>("keep");
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState<number | "">("");
  const [stripMetadata, setStripMetadata] = useState(true);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [notice, setNotice] = useState("");
  const urlsRef = useRef(new Set<string>());

  // Revoke every preview URL still alive when the tool unmounts.
  useEffect(() => {
    const urls = urlsRef.current;
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
      urls.clear();
    };
  }, []);

  const revoke = (url: string) => {
    URL.revokeObjectURL(url);
    urlsRef.current.delete(url);
  };

  const addFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    const accepted: Item[] = [];
    const skipped: string[] = [];
    for (const file of Array.from(list)) {
      const sourceType = guessType(file);
      if (!isAcceptedType(sourceType)) {
        skipped.push(file.name);
        continue;
      }
      const previewUrl = URL.createObjectURL(file);
      urlsRef.current.add(previewUrl);
      accepted.push({ id: nextId(), file, sourceType, previewUrl, status: "idle" });
    }
    if (accepted.length) setItems((prev) => [...prev, ...accepted]);
    setNotice(
      skipped.length
        ? `Skipped ${skipped.length} unsupported file${skipped.length > 1 ? "s" : ""}: ${skipped.slice(0, 3).join(", ")}${skipped.length > 3 ? " and more" : ""}`
        : "",
    );
  };

  const removeItem = (id: string) => {
    const target = items.find((i) => i.id === id);
    if (target) revoke(target.previewUrl);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearAll = () => {
    items.forEach((i) => revoke(i.previewUrl));
    setItems([]);
    setNotice("");
  };

  const compressAll = async () => {
    if (busy || items.length === 0) return;
    setBusy(true);
    const limit = maxWidth === "" ? 0 : Math.max(1, Math.floor(Number(maxWidth)));
    for (const item of items) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: "working", error: undefined } : i)));
      try {
        const loaded = await loadImage(item.file);
        try {
          const type = resolveOutputType(format, item.sourceType);
          const scale = limit > 0 && loaded.width > limit ? limit / loaded.width : 1;
          const width = Math.max(1, Math.round(loaded.width * scale));
          const height = Math.max(1, Math.round(loaded.height * scale));
          const blob = await renderToBlob(loaded.bitmap, { width, height, type, quality: quality / 100 });
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id
                ? { ...i, status: "done", width: loaded.width, height: loaded.height, result: { blob, width, height, type } }
                : i,
            ),
          );
        } finally {
          releaseImage(loaded.bitmap);
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : "Could not process this image";
        setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: "error", error: message, result: undefined } : i)));
      }
      // Yield between files so the rows repaint and the page stays responsive.
      await sleep(0);
    }
    setBusy(false);
  };

  const downloadItem = (item: Item) => {
    if (!item.result) return;
    downloadBlob(item.result.blob, outputFilename(item.file.name, item.sourceType, item.result.type));
  };

  const downloadAll = async () => {
    const done = items.filter((i) => i.result);
    for (const item of done) {
      downloadItem(item);
      // Browsers throttle back-to-back downloads; space them out slightly.
      await sleep(400);
    }
  };

  const done = items.filter((i) => i.result);
  const totalBefore = items.reduce((n, i) => n + i.file.size, 0);
  const doneBefore = done.reduce((n, i) => n + i.file.size, 0);
  const doneAfter = done.reduce((n, i) => n + (i.result?.blob.size ?? 0), 0);
  const totalSaved = savedPercent(doneBefore, doneAfter);
  const pngOnly = format === "image/png";

  return (
    <ToolPanel>
      <fieldset disabled={busy} className={cn("m-0 min-w-0 border-0 p-0", busy && "pointer-events-none opacity-60")}>
        <label
          htmlFor="ic-files"
          onDragOver={(e) => {
            e.preventDefault();
            if (!dragging) setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            addFiles(e.dataTransfer.files);
          }}
          className={cn(
            "flex min-h-40 cursor-pointer flex-col items-center justify-center border-2 border-dashed border-border bg-card p-6 text-center hover:bg-highlight hover:text-highlight-foreground",
            dragging && "bg-highlight text-highlight-foreground",
          )}
        >
          <input
            id="ic-files"
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <UploadIcon className="mb-2 size-6" aria-hidden />
          <span className="text-sm font-bold">Drop images here or click to choose</span>
          <span className="mt-1 font-mono text-[11px] opacity-80">
            JPG, PNG, WebP, GIF, BMP · several files at once · up to {MAX_DIMENSION} px
          </span>
        </label>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label htmlFor="ic-format">Output format</Label>
            <SelectField id="ic-format" value={format} onChange={(v) => setFormat(v as Format)} options={FORMAT_OPTIONS} />
            <Hint>WebP is smallest; JPEG is most compatible. GIF and BMP are written as PNG.</Hint>
          </div>
          <div className={cn(pngOnly && "opacity-50")}>
            <div className="mb-1.5 flex items-center justify-between">
              <Label htmlFor="ic-quality" className="mb-0">
                Quality
              </Label>
              <Hint className="mt-0">{pngOnly ? "lossless" : quality}</Hint>
            </div>
            <div className={cn("pt-2.5", pngOnly && "pointer-events-none")} aria-disabled={pngOnly || undefined}>
              <SliderField id="ic-quality" value={quality} onChange={setQuality} min={10} max={100} aria-label="Quality" />
            </div>
            <Hint>80 is a good default for photos; PNG ignores this setting.</Hint>
          </div>
          <div>
            <Label htmlFor="ic-maxw">Max width</Label>
            <NumberInput id="ic-maxw" value={maxWidth} onChange={setMaxWidth} min={1} max={MAX_DIMENSION} step={1} suffix="px" />
            <Hint>Leave empty to keep the original dimensions.</Hint>
          </div>
          <div>
            <Label htmlFor="ic-meta">Metadata</Label>
            <CheckboxField id="ic-meta" checked={stripMetadata} onChange={setStripMetadata} label="Strip metadata" className="h-9" />
            <Hint>Canvas re-encoding always removes EXIF, GPS and camera data, whatever this box says.</Hint>
          </div>
        </div>

        {items.length > 0 && (
          <ul className="mt-4 grid gap-2">
            {items.map((item) => {
              const pct = item.result ? savedPercent(item.file.size, item.result.blob.size) : 0;
              return (
                <li key={item.id} className="flex items-center gap-3 border-2 border-border bg-card p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.previewUrl} alt="" className="size-14 shrink-0 border-2 border-border object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{item.file.name}</p>
                    <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
                      {formatBytes(item.file.size)}
                      {item.result && (
                        <>
                          {" → "}
                          <span className="text-foreground">{formatBytes(item.result.blob.size)}</span>
                          {` · ${item.result.width} x ${item.result.height} · ${formatLabel(item.result.type)}`}
                        </>
                      )}
                      {item.status === "working" && " · Working…"}
                      {item.status === "error" && <span className="text-destructive"> · {item.error}</span>}
                    </p>
                  </div>
                  {item.result && (
                    <Chip className={pct > 0 ? "text-success" : "text-destructive"}>{savedLabel(pct)}</Chip>
                  )}
                  <Button size="sm" onClick={() => downloadItem(item)} disabled={!item.result}>
                    <DownloadIcon data-icon="inline-start" />
                    Download
                  </Button>
                  <Button size="icon-sm" variant="ghost" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.file.name}`}>
                    <XIcon />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </fieldset>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Files" value={items.length.toLocaleString()} />
        <Stat label="Total before" value={formatBytes(totalBefore)} />
        <Stat label="Total after" value={done.length ? formatBytes(doneAfter) : "Pending"} />
        <Stat label="Total saved" value={done.length ? savedLabel(totalSaved) : "Pending"} className={HIGHLIGHT_STAT} />
      </div>

      <ToolActions>
        <Button variant="primary" onClick={compressAll} disabled={busy || items.length === 0}>
          {busy ? (
            <>
              <LoaderCircleIcon data-icon="inline-start" className="animate-spin" />
              Working…
            </>
          ) : (
            "Compress all"
          )}
        </Button>
        <Button onClick={downloadAll} disabled={busy || done.length === 0}>
          <DownloadIcon data-icon="inline-start" />
          Download all
        </Button>
        <Button variant="ghost" onClick={clearAll} disabled={busy || items.length === 0}>
          Clear
        </Button>
        <span className="flex-1" />
        <Hint className="mt-0">Files never leave your browser.</Hint>
      </ToolActions>
      <ErrorText>{notice}</ErrorText>
    </ToolPanel>
  );
}
