"use client";

import { useMemo, useState } from "react";
import { Button, CopyButton, Hint, Label, TextArea, ToolActions, ToolPanel } from "@/components/tools/ui";

type CaseId =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "constant"
  | "alternating";

interface CaseStyle {
  id: CaseId;
  label: string;
  apply: (text: string) => string;
}

const SMALL_WORDS = new Set([
  "a", "an", "the", "and", "but", "or", "nor", "for", "so", "yet",
  "of", "at", "by", "in", "on", "to", "up", "as", "per", "via", "vs",
]);

/** Upper-case the first letter of a word, skipping leading punctuation like "(" or quotes. */
function capitalize(word: string): string {
  for (let i = 0; i < word.length; i++) {
    const c = word[i];
    if (c.toLowerCase() !== c.toUpperCase()) {
      return word.slice(0, i) + c.toUpperCase() + word.slice(i + 1);
    }
  }
  return word;
}

/** Split on whitespace, underscores, hyphens and camelCase boundaries. Punctuation is dropped. */
function splitWords(text: string): string[] {
  return text
    .replace(/([a-z\d])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .split(/[\s_-]+/)
    .map((w) => w.replace(/[^\w\u00C0-\uFFFF]/g, ""))
    .filter(Boolean);
}

function titleCase(text: string): string {
  return text
    .split("\n")
    .map((line) => {
      let index = 0;
      return line.replace(/\S+/g, (word) => {
        const lower = word.toLowerCase();
        const bare = lower.replace(/[^a-z]/g, "");
        const keepLower = index > 0 && SMALL_WORDS.has(bare);
        index++;
        return keepLower ? lower : capitalize(lower);
      });
    })
    .join("\n");
}

function sentenceCase(text: string): string {
  let out = "";
  let capitalizeNext = true;
  for (const ch of text.toLowerCase()) {
    if (capitalizeNext && ch.toLowerCase() !== ch.toUpperCase()) {
      out += ch.toUpperCase();
      capitalizeNext = false;
    } else {
      out += ch;
      if (ch === "." || ch === "!" || ch === "?" || ch === "\n") capitalizeNext = true;
    }
  }
  return out;
}

function alternatingCase(text: string): string {
  let upper = false;
  let out = "";
  for (const ch of text) {
    if (ch.toLowerCase() === ch.toUpperCase()) {
      out += ch;
      continue;
    }
    out += upper ? ch.toUpperCase() : ch.toLowerCase();
    upper = !upper;
  }
  return out;
}

/** Apply a word-joining transform to each line independently. */
function perLine(text: string, join: (words: string[]) => string): string {
  return text
    .split("\n")
    .map((line) => join(splitWords(line)))
    .join("\n");
}

const CASES: CaseStyle[] = [
  { id: "upper", label: "UPPERCASE", apply: (t) => t.toUpperCase() },
  { id: "lower", label: "lowercase", apply: (t) => t.toLowerCase() },
  { id: "title", label: "Title Case", apply: titleCase },
  { id: "sentence", label: "Sentence case", apply: sentenceCase },
  {
    id: "camel",
    label: "camelCase",
    apply: (t) =>
      perLine(t, (w) => w.map((x, i) => (i === 0 ? x.toLowerCase() : capitalize(x.toLowerCase()))).join("")),
  },
  {
    id: "pascal",
    label: "PascalCase",
    apply: (t) => perLine(t, (w) => w.map((x) => capitalize(x.toLowerCase())).join("")),
  },
  { id: "snake", label: "snake_case", apply: (t) => perLine(t, (w) => w.map((x) => x.toLowerCase()).join("_")) },
  { id: "kebab", label: "kebab-case", apply: (t) => perLine(t, (w) => w.map((x) => x.toLowerCase()).join("-")) },
  {
    id: "constant",
    label: "CONSTANT_CASE",
    apply: (t) => perLine(t, (w) => w.map((x) => x.toUpperCase()).join("_")),
  },
  { id: "alternating", label: "aLtErNaTiNg", apply: alternatingCase },
];

export default function CaseConverterTool() {
  const [input, setInput] = useState("");
  const [active, setActive] = useState<CaseId | null>(null);

  const current = CASES.find((c) => c.id === active);
  const output = useMemo(() => (current ? current.apply(input) : ""), [current, input]);

  const useOutput = () => {
    setInput(output);
    setActive(null);
  };
  const clear = () => {
    setInput("");
    setActive(null);
  };

  return (
    <ToolPanel>
      <Label htmlFor="case-in">Input text</Label>
      <TextArea
        id="case-in"
        rows={6}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type or paste text, e.g. hello world or userFirstName. Each line is converted separately."
        className="font-sans"
      />

      <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Case style">
        {CASES.map((c) => (
          <Button
            key={c.id}
            size="sm"
            variant={active === c.id ? "primary" : "secondary"}
            aria-pressed={active === c.id}
            onClick={() => setActive(c.id)}
          >
            {c.label}
          </Button>
        ))}
      </div>

      <div className="mt-6">
        <Label htmlFor="case-out">Output{current ? ` (${current.label})` : ""}</Label>
        <TextArea
          id="case-out"
          rows={6}
          value={output}
          readOnly
          placeholder="Pick a case above and the converted text appears here."
          className="font-sans"
        />
      </div>

      <ToolActions>
        <CopyButton text={output} />
        <Button onClick={useOutput} disabled={!output}>
          Use output as input
        </Button>
        <Button variant="ghost" onClick={clear} disabled={!input}>
          Clear
        </Button>
        <span className="flex-1" />
        <Hint className="mt-0">
          {input.length.toLocaleString()} characters · {splitWords(input).length.toLocaleString()} words
        </Hint>
      </ToolActions>
    </ToolPanel>
  );
}
