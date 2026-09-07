"use client";

import { useMemo, useState } from "react";
import {
  Button,
  CheckboxField,
  Chip,
  CopyButton,
  Hint,
  Label,
  NumberInput,
  Segmented,
  Stat,
  TextArea,
  TextInput,
  ToolActions,
  ToolPanel,
} from "@/components/tools/ui";

type Separator = "-" | "_" | "";

const SEPARATORS: { value: Separator; label: string }[] = [
  { value: "-", label: "Hyphen -" },
  { value: "_", label: "Underscore _" },
  { value: "", label: "None" },
];

/** Letters that NFD normalization does not decompose. */
const SPECIAL: Record<string, string> = {
  "\u00df": "ss", // sharp s
  "\u00e6": "ae",
  "\u00c6": "AE",
  "\u0153": "oe",
  "\u0152": "OE",
  "\u00f8": "o",
  "\u00d8": "O",
  "\u0142": "l",
  "\u0141": "L",
  "\u0111": "d",
  "\u0110": "D",
  "\u00f0": "d",
  "\u00d0": "D",
  "\u00fe": "th",
  "\u00de": "TH",
  "\u0131": "i",
};
const SPECIAL_RE = new RegExp(`[${Object.keys(SPECIAL).join("")}]`, "g");

const STOP_WORDS = new Set([
  "a", "an", "the", "of", "and", "or", "but", "in", "on", "at", "to", "for", "with", "by", "from", "is", "are", "was",
  "were", "be", "as", "it", "its", "this", "that", "these", "those", "vs", "via", "into", "your", "my", "our",
]);

interface Options {
  separator: Separator;
  lowercase: boolean;
  transliterate: boolean;
  removeStopWords: boolean;
  maxLength: number;
}

function slugify(text: string, opts: Options): string {
  let s = text.trim().replace(/&/g, " and ").replace(/['\u2019]/g, "");
  if (opts.transliterate) {
    s = s
      .replace(SPECIAL_RE, (ch) => SPECIAL[ch] ?? ch)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }
  if (opts.lowercase) s = s.toLowerCase();

  let words = s.split(opts.transliterate ? /[^A-Za-z0-9]+/ : /[^\p{L}\p{N}]+/u).filter(Boolean);
  if (opts.removeStopWords) {
    const kept = words.filter((w) => !STOP_WORDS.has(w.toLowerCase()));
    if (kept.length) words = kept;
  }

  let slug = words.join(opts.separator);
  if (opts.maxLength > 0 && slug.length > opts.maxLength) {
    const cut = opts.separator ? slug.lastIndexOf(opts.separator, opts.maxLength) : -1;
    slug = cut > 0 ? slug.slice(0, cut) : slug.slice(0, opts.maxLength);
  }
  return slug;
}

const SAMPLE = [
  "10 Tips for Writing Better Blog Posts in 2026",
  "Cr\u00e8me Br\u00fbl\u00e9e: The Ultimate Guide",
  "What's New in TypeScript 6? A Quick Tour",
  "Stra\u00dfe & Co. \u2013 Caf\u00e9 \u00d8resund",
].join("\n");

export default function SlugGeneratorTool() {
  const [input, setInput] = useState(SAMPLE);
  const [separator, setSeparator] = useState<Separator>("-");
  const [lowercase, setLowercase] = useState(true);
  const [transliterate, setTransliterate] = useState(true);
  const [removeStopWords, setRemoveStopWords] = useState(false);
  const [maxLength, setMaxLength] = useState<number | "">(60);
  const [baseUrl, setBaseUrl] = useState("https://example.com/blog/");

  const rows = useMemo(() => {
    const opts: Options = {
      separator,
      lowercase,
      transliterate,
      removeStopWords,
      maxLength: maxLength === "" ? 0 : Math.max(0, Math.floor(maxLength)),
    };
    return input
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => ({ source: line, slug: slugify(line, opts) }));
  }, [input, separator, lowercase, transliterate, removeStopWords, maxLength]);

  const slugs = rows.map((r) => r.slug).filter(Boolean);
  const output = rows.map((r) => r.slug).join("\n");
  const average = slugs.length ? Math.round(slugs.reduce((n, s) => n + s.length, 0) / slugs.length) : 0;
  const base = baseUrl.trim();
  const previewRows = rows.slice(0, 12);

  return (
    <ToolPanel>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="slug-in">Titles (one per line)</Label>
          <TextArea
            id="slug-in"
            rows={8}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="How to Brew Better Coffee at Home"
          />
          <Hint>
            Transliteration covers Latin accents only. Cyrillic, Arabic, CJK and other scripts are dropped; untick it to keep
            Unicode letters.
          </Hint>
        </div>
        <div>
          <Label htmlFor="slug-out">Slugs</Label>
          <TextArea id="slug-out" rows={8} value={output} readOnly placeholder="how-to-brew-better-coffee-at-home" />
          {rows.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5" aria-label="Slug lengths">
              {rows.map((r, i) => (
                <Chip key={i} className={r.slug ? "" : "text-destructive"}>
                  {r.slug ? `${r.slug.length}` : "empty"}
                </Chip>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Separator</span>
          <Segmented aria-label="Separator" value={separator} onChange={setSeparator} options={SEPARATORS} />
        </div>
        <CheckboxField id="slug-lower" checked={lowercase} onChange={setLowercase} label="Lowercase" />
        <CheckboxField
          id="slug-translit"
          checked={transliterate}
          onChange={setTransliterate}
          label={"Transliterate accents (\u00e9 -> e)"}
        />
        <CheckboxField
          id="slug-stop"
          checked={removeStopWords}
          onChange={setRemoveStopWords}
          label="Remove stop words (a, an, the, of, and...)"
        />
        <div className="flex items-center gap-2 text-sm">
          <Label htmlFor="slug-max" className="mb-0 text-muted-foreground">
            Max length
          </Label>
          <NumberInput id="slug-max" value={maxLength} onChange={setMaxLength} min={0} max={500} step={1} className="w-24" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Stat label="Slugs" value={slugs.length.toLocaleString()} />
        <Stat label="Average length" value={average.toLocaleString()} />
      </div>

      <div className="mt-4">
        <Label htmlFor="slug-base">Base URL for preview</Label>
        <TextInput
          id="slug-base"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          placeholder="https://example.com/blog/"
          inputMode="url"
        />
        {previewRows.length > 0 && (
          <ul className="mt-2 space-y-1 border-2 border-border bg-card p-3 font-mono text-[13px]">
            {previewRows.map((r, i) => (
              <li key={i} className="truncate">
                <span className="text-muted-foreground">{base}</span>
                <span className={r.slug ? "font-bold text-brand-strong" : "text-destructive"}>{r.slug || "(empty)"}</span>
              </li>
            ))}
            {rows.length > previewRows.length && (
              <li className="text-muted-foreground">+{rows.length - previewRows.length} more</li>
            )}
          </ul>
        )}
      </div>

      <ToolActions>
        <CopyButton text={output} variant="primary" label="Copy slugs" />
        <CopyButton text={rows.map((r) => base + r.slug).join("\n")} label="Copy URLs" />
        <span className="flex-1" />
        <Button variant="ghost" onClick={() => setInput("")} disabled={!input}>
          Clear
        </Button>
      </ToolActions>
    </ToolPanel>
  );
}
