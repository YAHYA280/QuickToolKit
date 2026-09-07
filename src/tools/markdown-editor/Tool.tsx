"use client";

import { useMemo, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { DownloadIcon } from "lucide-react";
import {
  Button,
  CopyButton,
  Hint,
  Label,
  Segmented,
  Stat,
  TextArea,
  ToolActions,
  ToolPanel,
} from "@/components/tools/ui";

type View = "split" | "editor" | "preview";

const VIEWS: { value: View; label: string }[] = [
  { value: "split", label: "Split" },
  { value: "editor", label: "Editor" },
  { value: "preview", label: "Preview" },
];

const SAMPLE = [
  "# Markdown Editor",
  "",
  "Write **Markdown** on the left and watch the *live preview* update on the right. Everything runs in your browser.",
  "",
  "## Why Markdown?",
  "",
  "- Plain text that stays readable without a renderer",
  "- Converts cleanly to HTML for blogs, docs and READMEs",
  "- Supported by GitHub, GitLab, Reddit, Slack and most editors",
  "",
  "## Task list",
  "",
  "- [x] Write the draft",
  "- [ ] Review the headings",
  "- [ ] Export as HTML",
  "",
  "## Table",
  "",
  "| Syntax | Example | Result |",
  "| --- | --- | --- |",
  "| Bold | `**text**` | **text** |",
  "| Italic | `*text*` | *text* |",
  "| Strike | `~~text~~` | ~~text~~ |",
  "| Link | `[site](https://example.com)` | [site](https://example.com) |",
  "",
  "## Code block",
  "",
  "```js",
  "function slugify(title) {",
  '  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");',
  "}",
  "```",
  "",
  "> Tip: select some text and press **Bold** or **Link** in the toolbar.",
  "> Ctrl+B and Ctrl+I work while typing.",
  "",
  "Read the [GFM spec](https://github.github.com/gfm/) for the full syntax.",
].join("\n");

const PREVIEW_CLASS =
  "prose-tool [&_h1]:mb-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:mt-8 [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-bold " +
  "[&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_th]:border-b-2 [&_th]:border-border [&_th]:p-2 [&_th]:text-start [&_td]:border-b [&_td]:border-border [&_td]:p-2 " +
  "[&_pre]:my-4 [&_pre]:overflow-auto [&_pre]:border-2 [&_pre]:border-border [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:text-[13px] [&_pre_code]:border-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0 " +
  "[&_code]:font-mono [&_blockquote]:my-4 [&_blockquote]:border-s-4 [&_blockquote]:border-border [&_blockquote]:ps-4 [&_blockquote]:text-muted-foreground [&_img]:max-w-full [&_hr]:my-6 [&_hr]:border-t-2 [&_hr]:border-border " +
  "[&_input]:me-1.5 [&_del]:text-muted-foreground";

type Edit = { next: string; start: number; end: number };

function wrapSelection(el: HTMLTextAreaElement, before: string, after: string, placeholder: string): Edit {
  const { value, selectionStart, selectionEnd } = el;
  const selected = value.slice(selectionStart, selectionEnd) || placeholder;
  const next = value.slice(0, selectionStart) + before + selected + after + value.slice(selectionEnd);
  const start = selectionStart + before.length;
  return { next, start, end: start + selected.length };
}

function prefixLines(el: HTMLTextAreaElement, prefix: string, placeholder: string): Edit {
  const { value, selectionStart, selectionEnd } = el;
  const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
  const nl = value.indexOf("\n", selectionEnd);
  const lineEnd = nl === -1 ? value.length : nl;
  const block = value.slice(lineStart, lineEnd) || placeholder;
  const prefixed = block
    .split("\n")
    .map((line) => (line.startsWith(prefix) ? line.slice(prefix.length) : prefix + line))
    .join("\n");
  const next = value.slice(0, lineStart) + prefixed + value.slice(lineEnd);
  return { next, start: lineStart, end: lineStart + prefixed.length };
}

function downloadFile(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const noopSubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;
/** False during SSR and the hydration render so the sanitized preview never mismatches. */
const useHydrated = () => useSyncExternalStore(noopSubscribe, getClientSnapshot, getServerSnapshot);

export default function MarkdownEditorTool() {
  const [input, setInput] = useState(SAMPLE);
  const [view, setView] = useState<View>("split");
  const hydrated = useHydrated();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const html = useMemo(() => {
    if (!hydrated || typeof window === "undefined") return "";
    const raw = marked.parse(input, { gfm: true, breaks: false, async: false });
    return DOMPurify.sanitize(raw);
  }, [input, hydrated]);

  const stats = useMemo(() => {
    const words = input.trim() ? input.trim().split(/\s+/).length : 0;
    const headings = input.split("\n").filter((l) => /^#{1,6}\s/.test(l)).length;
    return { words, chars: input.length, headings };
  }, [input]);

  const title = useMemo(() => {
    const m = /^#\s+(.+)$/m.exec(input);
    return m ? m[1].trim() : "Document";
  }, [input]);

  const apply = (edit: (el: HTMLTextAreaElement) => Edit) => {
    const el = inputRef.current;
    if (!el) return;
    const { next, start, end } = edit(el);
    setInput(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start, end);
    });
  };

  const bold = () => apply((el) => wrapSelection(el, "**", "**", "bold text"));
  const italic = () => apply((el) => wrapSelection(el, "*", "*", "italic text"));
  const heading = () => apply((el) => prefixLines(el, "## ", "Heading"));
  const link = () => apply((el) => wrapSelection(el, "[", "](https://example.com)", "link text"));
  const code = () => apply((el) => wrapSelection(el, "`", "`", "code"));
  const list = () => apply((el) => prefixLines(el, "- ", "List item"));
  const quote = () => apply((el) => prefixLines(el, "> ", "Quote"));

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!(e.ctrlKey || e.metaKey) || e.altKey) return;
    const key = e.key.toLowerCase();
    if (key === "b") {
      e.preventDefault();
      bold();
    } else if (key === "i") {
      e.preventDefault();
      italic();
    }
  };

  const fullHtml = () =>
    [
      "<!doctype html>",
      '<html lang="en">',
      "<head>",
      '<meta charset="utf-8">',
      '<meta name="viewport" content="width=device-width, initial-scale=1">',
      "<title>" + escapeHtml(title) + "</title>",
      "</head>",
      "<body>",
      html,
      "</body>",
      "</html>",
      "",
    ].join("\n");

  const fileBase = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "document";

  const showEditor = view !== "preview";
  const showPreview = view !== "editor";

  return (
    <ToolPanel>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap items-center gap-1" role="toolbar" aria-label="Formatting">
          <Button size="sm" onClick={bold} className="font-bold" aria-label="Bold" title="Bold (Ctrl+B)">
            B
          </Button>
          <Button size="sm" onClick={italic} className="italic" aria-label="Italic" title="Italic (Ctrl+I)">
            I
          </Button>
          <Button size="sm" onClick={heading} aria-label="Heading" title="Heading">
            H
          </Button>
          <Button size="sm" onClick={link} title="Link">
            Link
          </Button>
          <Button size="sm" onClick={code} className="font-mono" title="Inline code">
            Code
          </Button>
          <Button size="sm" onClick={list} title="Bullet list">
            List
          </Button>
          <Button size="sm" onClick={quote} title="Blockquote">
            Quote
          </Button>
        </div>
        <span className="flex-1" />
        <Segmented aria-label="View" value={view} onChange={setView} options={VIEWS} />
      </div>

      <div className={showEditor && showPreview ? "mt-4 grid gap-4 md:grid-cols-2" : "mt-4 grid gap-4"}>
        {showEditor && (
          <div>
            <Label htmlFor="md-in">Markdown</Label>
            <TextArea
              ref={inputRef}
              id="md-in"
              rows={18}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="# Start typing Markdown"
              className="font-mono"
            />
            <Hint>GitHub Flavored Markdown: tables, task lists, strikethrough and fenced code blocks are supported.</Hint>
          </div>
        )}
        {showPreview && (
          <div>
            <Label>Preview</Label>
            <div
              id="md-preview"
              className={"min-h-[30rem] max-h-[70vh] overflow-auto border-2 border-border bg-card p-4 " + PREVIEW_CLASS}
              dangerouslySetInnerHTML={{ __html: html }}
            />
            {!html && <Hint>{input.trim() ? "Rendering preview" : "Preview appears here as you type."}</Hint>}
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Stat label="Words" value={stats.words.toLocaleString()} />
        <Stat label="Characters" value={stats.chars.toLocaleString()} />
        <Stat label="Headings" value={stats.headings.toLocaleString()} />
      </div>

      <ToolActions>
        <CopyButton text={html} label="Copy HTML" variant="primary" />
        <CopyButton text={input} label="Copy Markdown" />
        <Button onClick={() => downloadFile(fileBase + ".md", input, "text/markdown;charset=utf-8")} disabled={!input}>
          <DownloadIcon data-icon="inline-start" />
          Download .md
        </Button>
        <Button onClick={() => downloadFile(fileBase + ".html", fullHtml(), "text/html;charset=utf-8")} disabled={!html}>
          <DownloadIcon data-icon="inline-start" />
          Download .html
        </Button>
        <span className="flex-1" />
        <Button variant="ghost" onClick={() => setInput(SAMPLE)} disabled={input === SAMPLE}>
          Reset sample
        </Button>
        <Button variant="ghost" onClick={() => setInput("")} disabled={!input}>
          Clear
        </Button>
      </ToolActions>
    </ToolPanel>
  );
}
