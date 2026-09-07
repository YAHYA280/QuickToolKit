"use client";

import { Fragment, useMemo, useRef, useState } from "react";
import { ArrowLeftRightIcon, CheckIcon, DownloadIcon } from "lucide-react";
import { diffChars, diffLines, diffWords, type Change } from "diff";
import {
  Button,
  CheckboxField,
  CopyButton,
  ErrorText,
  Hint,
  Label,
  Segmented,
  Stat,
  TextArea,
  ToolActions,
  ToolPanel,
  useHotkey,
} from "@/components/tools/ui";
import { cn } from "@/lib/utils";

type Granularity = "lines" | "words" | "chars";
type View = "unified" | "split";
type Kind = "ctx" | "add" | "del";

const MAX_CHARS = 200_000;
const MAX_ROWS = 5_000;
const MAX_PARTS = 20_000;

const GRANULARITIES: { value: Granularity; label: string }[] = [
  { value: "lines", label: "Lines" },
  { value: "words", label: "Words" },
  { value: "chars", label: "Characters" },
];

const VIEWS: { value: View; label: string }[] = [
  { value: "unified", label: "Unified" },
  { value: "split", label: "Side by side" },
];

const UNIT: Record<Granularity, string> = { lines: "lines", words: "words", chars: "chars" };

const SAMPLE_OLD = [
  "Release notes for version 2.4",
  "The quick brown fox jumps over the lazy dog.",
  "Fixed a crash when opening large files.",
  "Improved startup time by 20 percent.",
  "Known issue: dark mode flickers on Windows.",
].join("\n");

const SAMPLE_NEW = [
  "Release notes for version 2.5",
  "The quick brown fox leaps over the lazy dog.",
  "Fixed a crash when opening very large files.",
  "Improved startup time by 35 percent.",
  "Added a text diff checker to the tools page.",
].join("\n");

interface LineCell {
  no: number;
  text: string;
  kind: Kind;
}

interface UnifiedRow {
  kind: Kind;
  oldNo?: number;
  newNo?: number;
  text: string;
}

interface SplitRow {
  left: LineCell | null;
  right: LineCell | null;
}

const KIND_CLASS: Record<Kind, string> = {
  ctx: "border-s-2 border-transparent",
  add: "border-s-2 border-success bg-success/15 text-foreground",
  del: "border-s-2 border-destructive bg-destructive/15 text-foreground",
};

const MARKER: Record<Kind, string> = { ctx: " ", add: "+", del: "-" };

/** diffLines tokens keep their trailing newline; drop the empty tail it produces. */
function splitLines(value: string): string[] {
  const lines = value.split("\n");
  if (lines.length > 1 && lines[lines.length - 1] === "") lines.pop();
  return lines;
}

function buildRows(changes: Change[]): { unified: UnifiedRow[]; split: SplitRow[] } {
  const unified: UnifiedRow[] = [];
  const split: SplitRow[] = [];
  let oldNo = 1;
  let newNo = 1;
  let dels: LineCell[] = [];
  let adds: LineCell[] = [];

  // Pair queued removals with additions row by row; the longer side gets placeholders.
  const flush = () => {
    const n = Math.max(dels.length, adds.length);
    for (let i = 0; i < n; i++) {
      split.push({ left: i < dels.length ? dels[i] : null, right: i < adds.length ? adds[i] : null });
    }
    dels = [];
    adds = [];
  };

  for (const change of changes) {
    const lines = splitLines(change.value);
    if (change.removed) {
      for (const text of lines) {
        unified.push({ kind: "del", oldNo, text });
        dels.push({ no: oldNo, text, kind: "del" });
        oldNo++;
      }
    } else if (change.added) {
      for (const text of lines) {
        unified.push({ kind: "add", newNo, text });
        adds.push({ no: newNo, text, kind: "add" });
        newNo++;
      }
    } else {
      flush();
      for (const text of lines) {
        unified.push({ kind: "ctx", oldNo, newNo, text });
        split.push({ left: { no: oldNo, text, kind: "ctx" }, right: { no: newNo, text, kind: "ctx" } });
        oldNo++;
        newNo++;
      }
    }
  }
  flush();
  return { unified, split };
}

function prepare(text: string, granularity: Granularity, ignoreWhitespace: boolean, ignoreCase: boolean): string {
  let out = text.replace(/\r\n?/g, "\n");
  if (ignoreCase) out = out.toLowerCase();
  if (granularity === "chars" && ignoreWhitespace) out = out.replace(/\s+/g, " ").trim();
  return out;
}

function counts(text: string): string {
  const lines = text ? text.split("\n").length : 0;
  return `${lines.toLocaleString()} lines · ${text.length.toLocaleString()} chars`;
}

function LineNo({ value }: { value?: number }) {
  return <span className="w-10 shrink-0 pe-2 text-end text-muted-foreground select-none">{value ?? ""}</span>;
}

function Marker({ kind }: { kind: Kind }) {
  return (
    <span className="w-5 shrink-0 text-center font-bold select-none" aria-hidden={kind === "ctx" || undefined}>
      {MARKER[kind]}
    </span>
  );
}

function SplitCell({ cell, className }: { cell: LineCell | null; className?: string }) {
  if (!cell) return <span className={cn("flex min-w-0 bg-muted", className)} />;
  return (
    <span className={cn("flex min-w-0 items-start", KIND_CLASS[cell.kind], className)}>
      <LineNo value={cell.no} />
      <Marker kind={cell.kind} />
      <span className="min-w-0 flex-1 pe-3 break-words whitespace-pre-wrap">{cell.text || " "}</span>
    </span>
  );
}

export default function TextDiffTool() {
  const [oldText, setOldText] = useState("");
  const [newText, setNewText] = useState("");
  const [granularity, setGranularity] = useState<Granularity>("lines");
  const [view, setView] = useState<View>("unified");
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);
  const oldRef = useRef<HTMLTextAreaElement>(null);
  const newRef = useRef<HTMLTextAreaElement>(null);

  useHotkey("mod+enter", () => newRef.current?.focus());

  const tooLarge = oldText.length > MAX_CHARS || newText.length > MAX_CHARS;
  const effectiveView: View = granularity === "lines" ? view : "unified";

  const result = useMemo(() => {
    if (tooLarge) return null;
    const a = prepare(oldText, granularity, ignoreWhitespace, ignoreCase);
    const b = prepare(newText, granularity, ignoreWhitespace, ignoreCase);
    if (!a && !b) return null;

    const lineChanges = diffLines(a, b, { ignoreWhitespace });
    const changes =
      granularity === "lines" ? lineChanges : granularity === "words" ? diffWords(a, b) : diffChars(a, b);

    let added = 0;
    let removed = 0;
    let unchanged = 0;
    for (const c of changes) {
      if (c.added) added += c.count;
      else if (c.removed) removed += c.count;
      else unchanged += c.count;
    }
    // Similarity is always character-based so a one-word edit per line does not read as 0%.
    const charChanges = granularity === "chars" ? changes : diffChars(a, b);
    let unchangedChars = 0;
    for (const c of charChanges) if (!c.added && !c.removed) unchangedChars += c.value.length;
    const maxLen = Math.max(a.length, b.length);
    const similarity = maxLen === 0 ? 100 : Math.min(100, Math.round((unchangedChars / maxLen) * 100));
    const identical = added === 0 && removed === 0;

    const rows = buildRows(lineChanges);
    const linesIdentical = lineChanges.every((c) => !c.added && !c.removed);
    const diffText = linesIdentical
      ? ""
      : ["--- Original", "+++ Changed", ...rows.unified.map((r) => MARKER[r.kind] + r.text)].join("\n");

    return { changes, added, removed, unchanged, similarity, identical, rows, diffText };
  }, [oldText, newText, granularity, ignoreWhitespace, ignoreCase, tooLarge]);

  const diffText = result?.diffText ?? "";

  const swap = () => {
    setOldText(newText);
    setNewText(oldText);
  };

  const clear = () => {
    setOldText("");
    setNewText("");
    oldRef.current?.focus();
  };

  const loadSample = () => {
    setOldText(SAMPLE_OLD);
    setNewText(SAMPLE_NEW);
  };

  const download = () => {
    if (!diffText) return;
    const url = URL.createObjectURL(new Blob([diffText], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "text-diff.diff";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const notes: string[] = [];
  if (ignoreCase) notes.push("Ignore case: both texts are lowercased before comparing, so the output is shown in lowercase.");
  if (granularity === "words") notes.push("Word mode always ignores spacing between words.");
  if (granularity === "chars" && ignoreWhitespace) notes.push("Runs of whitespace are collapsed to a single space before comparing.");
  if (view === "split" && granularity !== "lines") notes.push("Side by side is available for Lines only. Showing the Unified view.");

  const unit = UNIT[granularity];

  return (
    <ToolPanel>
      <div className="mb-3 flex flex-wrap items-center justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={loadSample}>
          Load sample
        </Button>
        <Button variant="ghost" size="sm" onClick={swap} disabled={!oldText && !newText} aria-label="Swap Original and Changed">
          <ArrowLeftRightIcon data-icon="inline-start" />
          Swap
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <Label htmlFor="diff-old" className="mb-0">
              Original
            </Label>
            <Hint className="mt-0">{counts(oldText)}</Hint>
          </div>
          <TextArea
            ref={oldRef}
            id="diff-old"
            rows={12}
            value={oldText}
            onChange={(e) => setOldText(e.target.value)}
            placeholder="Paste the original text"
            aria-invalid={tooLarge || undefined}
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <Label htmlFor="diff-new" className="mb-0">
              Changed
            </Label>
            <Hint className="mt-0">{counts(newText)}</Hint>
          </div>
          <TextArea
            ref={newRef}
            id="diff-new"
            rows={12}
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Paste the changed text"
            aria-invalid={tooLarge || undefined}
          />
        </div>
      </div>

      <ErrorText>
        {tooLarge && `Each side is limited to ${MAX_CHARS.toLocaleString()} characters. Shorten the text to compare it.`}
      </ErrorText>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
        <Segmented aria-label="Granularity" value={granularity} onChange={setGranularity} options={GRANULARITIES} />
        <CheckboxField id="diff-ws" checked={ignoreWhitespace} onChange={setIgnoreWhitespace} label="Ignore whitespace" />
        <CheckboxField id="diff-case" checked={ignoreCase} onChange={setIgnoreCase} label="Ignore case" />
        <span className="flex-1" />
        <Segmented aria-label="View" value={view} onChange={setView} options={VIEWS} />
      </div>
      {notes.map((note) => (
        <Hint key={note}>{note}</Hint>
      ))}

      {result && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label={`Additions · ${unit}`} value={`+${result.added.toLocaleString()}`} />
          <Stat label={`Deletions · ${unit}`} value={`-${result.removed.toLocaleString()}`} />
          <Stat label={`Unchanged · ${unit}`} value={result.unchanged.toLocaleString()} />
          <Stat
            label="Similarity"
            value={`${result.similarity}%`}
            className="border-primary bg-primary text-primary-foreground [&_.label-mono]:text-primary-foreground/80"
          />
        </div>
      )}

      <div className="mt-6">
        <p className="label-mono mb-2">Differences</p>

        {!result && !tooLarge && (
          <div className="brut-flat p-3 font-mono text-[13px] text-muted-foreground">
            Paste text into Original and Changed, or click Load sample, to see the differences here.
          </div>
        )}

        {result?.identical && (
          <div className="brut-flat flex items-center gap-2 p-3 text-sm" role="status">
            <CheckIcon className="size-4 shrink-0 text-success" />
            <span>
              No differences found. Both texts are identical
              {ignoreCase || ignoreWhitespace ? " with the current ignore options" : ""}.
            </span>
          </div>
        )}

        {result && !result.identical && granularity !== "lines" && (
          <>
            <pre className="code-surface brut-flat max-h-[60vh] overflow-auto p-3 font-mono text-[13px] leading-relaxed break-words whitespace-pre-wrap">
              {result.changes.slice(0, MAX_PARTS).map((c, i) =>
                c.added ? (
                  <ins key={i} className="border-s-2 border-success bg-success/15 text-foreground underline decoration-2">
                    {c.value}
                  </ins>
                ) : c.removed ? (
                  <del key={i} className="border-s-2 border-destructive bg-destructive/15 text-foreground line-through decoration-2">
                    {c.value}
                  </del>
                ) : (
                  <Fragment key={i}>{c.value}</Fragment>
                ),
              )}
            </pre>
            <Hint>Removed text is struck through, added text is underlined.</Hint>
            {result.changes.length > MAX_PARTS && <Hint>Showing the first {MAX_PARTS.toLocaleString()} changes.</Hint>}
          </>
        )}

        {result && !result.identical && granularity === "lines" && effectiveView === "unified" && (
          <>
            <pre className="code-surface brut-flat max-h-[60vh] overflow-auto py-2 font-mono text-[13px] leading-relaxed">
              {result.rows.unified.slice(0, MAX_ROWS).map((row, i) => (
                <span key={i} className={cn("flex items-start", KIND_CLASS[row.kind])}>
                  <LineNo value={row.oldNo} />
                  <LineNo value={row.newNo} />
                  <Marker kind={row.kind} />
                  <span className="min-w-0 flex-1 pe-3 break-words whitespace-pre-wrap">{row.text || " "}</span>
                </span>
              ))}
            </pre>
            {result.rows.unified.length > MAX_ROWS && <Hint>Showing the first {MAX_ROWS.toLocaleString()} lines.</Hint>}
          </>
        )}

        {result && !result.identical && granularity === "lines" && effectiveView === "split" && (
          <>
            <div className="code-surface brut-flat max-h-[60vh] overflow-auto font-mono text-[13px] leading-relaxed">
              <div className="grid grid-cols-2">
                <span className="label-mono border-e-2 border-b-2 border-border bg-muted px-3 py-1.5">Original</span>
                <span className="label-mono border-b-2 border-border bg-muted px-3 py-1.5">Changed</span>
                {result.rows.split.slice(0, MAX_ROWS).map((row, i) => (
                  <Fragment key={i}>
                    <SplitCell cell={row.left} className="border-e-2 border-border" />
                    <SplitCell cell={row.right} />
                  </Fragment>
                ))}
              </div>
            </div>
            {result.rows.split.length > MAX_ROWS && <Hint>Showing the first {MAX_ROWS.toLocaleString()} rows.</Hint>}
          </>
        )}
      </div>

      <ToolActions>
        <CopyButton text={diffText} label="Copy unified diff" />
        <Button onClick={download} disabled={!diffText}>
          <DownloadIcon data-icon="inline-start" />
          Download .diff
        </Button>
        <span className="flex-1" />
        <Button variant="ghost" onClick={clear} disabled={!oldText && !newText}>
          Clear
        </Button>
      </ToolActions>
    </ToolPanel>
  );
}
