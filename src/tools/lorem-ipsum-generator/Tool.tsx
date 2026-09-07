"use client";

import { useMemo, useState } from "react";
import { RefreshCwIcon } from "lucide-react";
import {
  Button,
  CheckboxField,
  CopyButton,
  Hint,
  KbdHint,
  Label,
  NumberInput,
  Segmented,
  SliderField,
  Stat,
  TextArea,
  ToolActions,
  ToolPanel,
  useHotkey,
} from "@/components/tools/ui";

type Unit = "paragraphs" | "sentences" | "words";
type Format = "plain" | "html" | "markdown";

const WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do",
  "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim",
  "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "aliquip",
  "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat",
  "non", "proident", "sunt", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id",
  "est", "laborum", "at", "vero", "eos", "accusamus", "iusto", "odio", "dignissimos", "ducimus",
  "blanditiis", "praesentium",
];

const OPENING = ["lorem", "ipsum", "dolor", "sit", "amet,", "consectetur", "adipiscing", "elit"];

const LIMITS: Record<Unit, { max: number; initial: number }> = {
  paragraphs: { max: 50, initial: 3 },
  sentences: { max: 200, initial: 5 },
  words: { max: 1000, initial: 50 },
};

const UNIT_OPTIONS = [
  { value: "paragraphs", label: "Paragraphs" },
  { value: "sentences", label: "Sentences" },
  { value: "words", label: "Words" },
] as const;

const FORMAT_OPTIONS = [
  { value: "plain", label: "Plain" },
  { value: "html", label: "HTML" },
  { value: "markdown", label: "Markdown" },
] as const;

interface Options {
  unit: Unit;
  count: number;
  classic: boolean;
  variance: number;
}

/** Small seeded PRNG so the first render is identical on the server and the client. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function sentenceLength(rand: () => number, variance: number): number {
  const spread = Math.round((variance / 100) * 9);
  const offset = Math.round((rand() * 2 - 1) * spread);
  return Math.max(3, 11 + offset);
}

function makeSentence(rand: () => number, length: number, variance: number, opening?: string[]): string {
  const words = opening ? [...opening] : [];
  let last = words[words.length - 1] ?? "";
  while (words.length < length) {
    const w = WORDS[Math.floor(rand() * WORDS.length)];
    if (w === last) continue;
    words.push(w);
    last = w;
  }
  // A comma or two in longer sentences keeps the rhythm natural.
  const start = opening ? opening.length : 3;
  if (words.length >= 9 && words.length - start > 5) {
    const at = start + Math.floor(rand() * (words.length - start - 3));
    if (!words[at].endsWith(",")) words[at] += ",";
    if (words.length >= 16 && variance > 30) {
      const second = at + 4 + Math.floor(rand() * Math.max(1, words.length - at - 6));
      if (second < words.length - 2 && !words[second].endsWith(",")) words[second] += ",";
    }
  }
  const text = words.join(" ");
  return text.charAt(0).toUpperCase() + text.slice(1) + ".";
}

function makeParagraph(rand: () => number, variance: number, opening?: string[]): string {
  const count = 4 + Math.floor(rand() * 4);
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const open = i === 0 ? opening : undefined;
    const len = Math.max(sentenceLength(rand, variance), open ? open.length + 3 : 0);
    out.push(makeSentence(rand, len, variance, open));
  }
  return out.join(" ");
}

function generate(opts: Options, seed: number): string[] {
  const rand = mulberry32(seed);
  const opening = opts.classic ? OPENING : undefined;
  const count = Math.max(1, Math.min(LIMITS[opts.unit].max, Math.trunc(opts.count)));

  if (opts.unit === "paragraphs") {
    return Array.from({ length: count }, (_, i) => makeParagraph(rand, opts.variance, i === 0 ? opening : undefined));
  }
  if (opts.unit === "sentences") {
    const out: string[] = [];
    for (let i = 0; i < count; i++) {
      const open = i === 0 ? opening : undefined;
      const len = Math.max(sentenceLength(rand, opts.variance), open ? open.length + 3 : 0);
      out.push(makeSentence(rand, len, opts.variance, open));
    }
    return [out.join(" ")];
  }
  const sentences: string[] = [];
  let total = 0;
  while (total < count) {
    const open = total === 0 ? opening : undefined;
    const len = Math.max(sentenceLength(rand, opts.variance), open ? open.length + 3 : 0);
    const s = makeSentence(rand, len, opts.variance, open);
    sentences.push(s);
    total += len;
  }
  const words = sentences.join(" ").split(" ").slice(0, count);
  const text = words.join(" ").replace(/[.,]$/, "");
  return [text + "."];
}

function format(paragraphs: string[], fmt: Format): string {
  if (fmt === "html") return paragraphs.map((p) => `<p>${p}</p>`).join("\n");
  if (fmt === "markdown") return paragraphs.join("\n\n");
  return paragraphs.join("\n");
}

const DEFAULT_OPTIONS: Options = { unit: "paragraphs", count: 3, classic: true, variance: 50 };
const DEFAULT_SEED = 1;
const HIGHLIGHT = "border-primary bg-primary text-primary-foreground [&_.label-mono]:text-primary-foreground/80";

export default function LoremIpsumGeneratorTool() {
  const [unit, setUnit] = useState<Unit>(DEFAULT_OPTIONS.unit);
  const [count, setCount] = useState<number | "">(DEFAULT_OPTIONS.count);
  const [classic, setClassic] = useState(DEFAULT_OPTIONS.classic);
  const [variance, setVariance] = useState(DEFAULT_OPTIONS.variance);
  const [fmt, setFmt] = useState<Format>("plain");
  const [seed, setSeed] = useState(DEFAULT_SEED);

  const safeCount = count === "" ? LIMITS[unit].initial : count;

  const paragraphs = useMemo(
    () => generate({ unit, count: safeCount, classic, variance }, seed),
    [unit, safeCount, classic, variance, seed],
  );
  const output = useMemo(() => format(paragraphs, fmt), [paragraphs, fmt]);

  const regenerate = () => setSeed(Math.floor(Math.random() * 0x7fffffff) + 1);
  useHotkey("mod+enter", regenerate);

  const switchUnit = (next: Unit) => {
    setUnit(next);
    setCount(LIMITS[next].initial);
  };

  const plain = paragraphs.join(" ");
  const wordCount = plain.split(/\s+/).filter(Boolean).length;

  return (
    <ToolPanel>
      <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
        <div>
          <p className="label-mono mb-1.5">Unit</p>
          <Segmented aria-label="Unit" value={unit} onChange={switchUnit} options={UNIT_OPTIONS} />
        </div>
        <div>
          <Label htmlFor="lorem-count">Count</Label>
          <NumberInput id="lorem-count" value={count} onChange={setCount} min={1} max={LIMITS[unit].max} className="w-28" />
        </div>
        <div>
          <p className="label-mono mb-1.5">Format</p>
          <Segmented aria-label="Output format" value={fmt} onChange={setFmt} options={FORMAT_OPTIONS} />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <CheckboxField
          id="lorem-classic"
          checked={classic}
          onChange={setClassic}
          label="Start with Lorem ipsum dolor sit amet"
          className="self-center"
        />
        <div>
          <div className="mb-2 flex items-center justify-between">
            <Label htmlFor="lorem-variance" className="mb-0">
              Sentence length variance
            </Label>
            <span className="font-mono text-xs text-muted-foreground">{variance}%</span>
          </div>
          <SliderField id="lorem-variance" value={variance} onChange={setVariance} min={0} max={100} step={5} />
          <Hint>0% gives uniform sentences of about 11 words; 100% ranges from 3 to 20.</Hint>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-1.5 flex items-center justify-between">
          <Label htmlFor="lorem-out" className="mb-0">
            Output
          </Label>
          <Hint className="mt-0">{fmt === "html" ? "HTML paragraphs" : fmt === "markdown" ? "Markdown paragraphs" : "Plain text"}</Hint>
        </div>
        <TextArea id="lorem-out" readOnly value={output} autoGrow rows={8} flashKey={seed} aria-label="Generated text" />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <Stat label="Words" value={wordCount.toLocaleString()} className={HIGHLIGHT} />
        <Stat label="Characters" value={output.length.toLocaleString()} />
        <Stat label="Paragraphs" value={paragraphs.length.toLocaleString()} />
      </div>

      <ToolActions>
        <Button variant="primary" onClick={regenerate}>
          <RefreshCwIcon data-icon="inline-start" />
          Generate
          <KbdHint combo="mod+enter" />
        </Button>
        <CopyButton text={output} />
      </ToolActions>
    </ToolPanel>
  );
}
