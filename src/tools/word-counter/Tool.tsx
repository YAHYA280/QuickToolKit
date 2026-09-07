"use client";

import { useMemo, useState } from "react";
import { Button, Chip, CopyButton, Label, Stat, TextArea, ToolActions, ToolPanel } from "@/components/tools/ui";

const STOP_WORDS = new Set(
  "the a an and or but of to in on at for with by from as is are was were be been it this that these those i you he she we they my your his her our their not no yes if then so than too very can will just".split(
    " ",
  ),
);

function analyze(text: string) {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/) : [];
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const sentences = trimmed ? (trimmed.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) ?? []).length : 0;
  const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;
  const readingMinutes = words.length / 238;
  const speakingMinutes = words.length / 150;

  const freq = new Map<string, number>();
  for (const raw of words) {
    const w = raw.toLowerCase().replace(/[^\p{L}\p{N}'-]/gu, "");
    if (!w || w.length < 3 || STOP_WORDS.has(w)) continue;
    freq.set(w, (freq.get(w) ?? 0) + 1);
  }
  const keywords = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);

  return {
    words: words.length,
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    readingMinutes,
    speakingMinutes,
    keywords,
  };
}

function formatMinutes(min: number): string {
  if (min === 0) return "0 s";
  if (min < 1) return `${Math.max(1, Math.round(min * 60))} s`;
  const m = Math.floor(min);
  const s = Math.round((min - m) * 60);
  return s ? `${m} min ${s} s` : `${m} min`;
}

const LIMITS = [
  { name: "X post", max: 280 },
  { name: "Meta description", max: 160 },
  { name: "Instagram caption", max: 2200 },
];

export default function WordCounterTool() {
  const [text, setText] = useState("");
  const stats = useMemo(() => analyze(text), [text]);

  return (
    <ToolPanel>
      <Label htmlFor="wc-in">Your text</Label>
      <TextArea
        id="wc-in"
        rows={12}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type your text here. Counts update as you type."
        className="font-sans text-[15px]"
      />
      <ToolActions>
        <CopyButton text={text} />
        <Button variant="ghost" onClick={() => setText("")}>
          Clear
        </Button>
        <span className="flex-1" />
        <div className="flex flex-wrap gap-1.5">
          {LIMITS.map((l) => {
            const over = stats.characters > l.max;
            return (
              <Chip key={l.name} className={over ? "border-destructive/50 text-destructive" : "text-muted-foreground"}>
                {l.name} {stats.characters}/{l.max}
              </Chip>
            );
          })}
        </div>
      </ToolActions>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <Stat label="Words" value={stats.words.toLocaleString()} className="border-primary bg-primary text-primary-foreground [&_.label-mono]:text-primary-foreground/80" />
        <Stat label="Characters" value={stats.characters.toLocaleString()} />
        <Stat label="No spaces" value={stats.charactersNoSpaces.toLocaleString()} />
        <Stat label="Sentences" value={stats.sentences.toLocaleString()} />
        <Stat label="Paragraphs" value={stats.paragraphs.toLocaleString()} />
        <Stat label="Reading time" value={formatMinutes(stats.readingMinutes)} />
        <Stat label="Speaking time" value={formatMinutes(stats.speakingMinutes)} />
        <Stat label="Avg word length" value={stats.words ? (stats.charactersNoSpaces / stats.words).toFixed(1) : "0"} />
      </div>

      {stats.keywords.length > 0 && (
        <div className="mt-6">
          <p className="label-mono">Top keywords</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {stats.keywords.map(([word, count]) => (
              <li key={word}>
                <Chip>
                  {word} <span className="ms-1.5 text-muted-foreground">×{count}</span>
                </Chip>
              </li>
            ))}
          </ul>
        </div>
      )}
    </ToolPanel>
  );
}
