"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentProps,
  type ReactNode,
} from "react";
import { CheckIcon, CircleAlertIcon, CopyIcon } from "lucide-react";
import { Button as UiButton, type buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label as UiLabel } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

/* ------------------------------------------------------------------
   Shared primitives used by every tool. Built on shadcn/ui so all tools
   look and behave the same. Keep the API stable; tools depend on it.
   ------------------------------------------------------------------ */

export function ToolPanel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("p-4 sm:p-6", className)}>{children}</div>;
}

/** Horizontal row of actions under a tool's inputs. */
export function ToolActions({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mt-4 flex flex-wrap items-center gap-2", className)}>{children}</div>;
}

export function Label({ htmlFor, children, className }: { htmlFor?: string; children: ReactNode; className?: string }) {
  return (
    <UiLabel htmlFor={htmlFor} className={cn("mb-1.5 block", className)}>
      {children}
    </UiLabel>
  );
}

export function Hint({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("mt-1.5 font-mono text-[11px] text-muted-foreground", className)}>{children}</p>;
}

/**
 * Monospace textarea. `autoGrow` sizes to content (up to 60vh); `flashKey`
 * replays a brief highlight whenever it changes (use on read-only outputs).
 */
export function TextArea({
  className,
  autoGrow = false,
  flashKey,
  ...props
}: ComponentProps<"textarea"> & { autoGrow?: boolean; flashKey?: string | number }) {
  return (
    <Textarea
      key={flashKey !== undefined ? String(flashKey) : undefined}
      spellCheck={false}
      {...props}
      className={cn(
        "code-surface resize-y bg-card font-mono text-sm leading-relaxed",
        autoGrow ? "field-sizing-content max-h-[60vh]" : "field-sizing-fixed",
        flashKey !== undefined && flashKey !== "" && "animate-flash",
        className,
      )}
    />
  );
}

/** Plain text input, monospace by default for data entry. */
export function TextInput({ className, mono = true, ...props }: ComponentProps<"input"> & { mono?: boolean }) {
  return (
    <input
      {...props}
      className={cn(
        "h-9 w-full min-w-0 border-2 border-foreground bg-card px-3 text-sm outline-none transition-[box-shadow,border-color] placeholder:text-muted-foreground focus-visible:border-primary focus-visible:shadow-hard-blue",
        mono && "font-mono",
        className,
      )}
    />
  );
}

export function NumberInput({
  id,
  value,
  onChange,
  min,
  max,
  step,
  prefix,
  suffix,
  className,
}: {
  id: string;
  value: number | "";
  onChange: (v: number | "") => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-9 items-center border-2 border-foreground bg-card transition-[box-shadow,border-color] focus-within:border-primary focus-within:shadow-hard-blue",
        className,
      )}
    >
      {prefix && <span className="ps-3 font-mono text-xs text-muted-foreground">{prefix}</span>}
      <input
        id={id}
        type="number"
        inputMode="decimal"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
        className="h-full w-full min-w-0 bg-transparent px-3 font-mono text-sm tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      {suffix && <span className="pe-3 font-mono text-xs text-muted-foreground">{suffix}</span>}
    </div>
  );
}

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";

export function Button({
  variant = "secondary",
  size,
  className,
  type = "button",
  ...props
}: Omit<ComponentProps<"button">, "type"> & {
  variant?: ButtonVariant;
  size?: VariantProps<typeof buttonVariants>["size"];
  type?: "button" | "submit";
}) {
  const map: Record<ButtonVariant, VariantProps<typeof buttonVariants>["variant"]> = {
    primary: "default",
    secondary: "outline",
    ghost: "ghost",
    destructive: "destructive",
  };
  return <UiButton type={type} variant={map[variant]} size={size} className={className} {...props} />;
}

export function useCopy(timeout = 1500) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), timeout);
      } catch {
        setCopied(false);
      }
    },
    [timeout],
  );
  return { copied, copy };
}

export function CopyButton({
  text,
  label = "Copy",
  copiedLabel = "Copied",
  size,
  variant = "secondary",
  className,
}: {
  text: string;
  label?: string;
  copiedLabel?: string;
  size?: VariantProps<typeof buttonVariants>["size"];
  variant?: ButtonVariant;
  className?: string;
}) {
  const { copied, copy } = useCopy();
  return (
    <Button
      onClick={() => copy(text)}
      disabled={!text}
      size={size}
      variant={variant}
      className={className}
      aria-live="polite"
    >
      {copied ? <CheckIcon data-icon="inline-start" className="text-success" /> : <CopyIcon data-icon="inline-start" />}
      {copied ? copiedLabel : label}
    </Button>
  );
}

export function Stat({
  label,
  value,
  mono = true,
  className,
}: {
  label: string;
  value: string;
  mono?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0 brut-flat px-4 py-3", className)}>
      <p className="label-mono">{label}</p>
      <p key={value} className={cn("animate-pop mt-1.5 truncate text-lg font-bold tabular-nums", mono && "font-mono")}>
        {value}
      </p>
    </div>
  );
}

export function ErrorText({ children, className, action }: { children: ReactNode; className?: string; action?: ReactNode }) {
  if (!children) return null;
  return (
    <div role="alert" className={cn("animate-pop mt-2 flex items-start gap-2 text-sm text-destructive", className)}>
      <CircleAlertIcon className="mt-0.5 size-4 shrink-0" />
      <span className="min-w-0 flex-1 font-mono text-[13px] break-words">{children}</span>
      {action}
    </div>
  );
}

type Option = { value: string; label: string } | string;

export function SelectField({
  id,
  value,
  onChange,
  options,
  placeholder,
  className,
  size = "default",
  "aria-label": ariaLabel,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly Option[];
  placeholder?: string;
  className?: string;
  size?: "sm" | "default";
  "aria-label"?: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id} size={size} className={cn("w-full bg-card", className)} aria-label={ariaLabel}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => {
          const opt = typeof o === "string" ? { value: o, label: o } : o;
          return (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

export function CheckboxField({
  id,
  checked,
  onChange,
  label,
  className,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  label: ReactNode;
  className?: string;
}) {
  return (
    <label htmlFor={id} className={cn("flex cursor-pointer items-center gap-2.5 text-sm select-none", className)}>
      <Checkbox id={id} checked={checked} onCheckedChange={(v) => onChange(v === true)} />
      <span>{label}</span>
    </label>
  );
}

export function SwitchField({
  id,
  checked,
  onChange,
  label,
  className,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  label: ReactNode;
  className?: string;
}) {
  return (
    <label htmlFor={id} className={cn("flex cursor-pointer items-center gap-2.5 text-sm select-none", className)}>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
      <span>{label}</span>
    </label>
  );
}

export function SliderField({
  id,
  value,
  onChange,
  min,
  max,
  step = 1,
  className,
  "aria-label": ariaLabel,
}: {
  id?: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <Slider
      id={id}
      value={[value]}
      onValueChange={([v]) => onChange(v)}
      min={min}
      max={max}
      step={step}
      className={className}
      aria-label={ariaLabel}
    />
  );
}

/** Segmented control for 2-4 mutually exclusive modes (Encode / Decode, Password / Passphrase). */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  className,
  "aria-label": ariaLabel,
}: {
  value: T;
  onChange: (v: T) => void;
  options: readonly { value: T; label: ReactNode }[];
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <div role="group" aria-label={ariaLabel} className={cn("inline-flex border-2 border-foreground bg-card p-0.5", className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "px-3 py-1 text-sm font-bold transition-colors",
            value === o.value ? "bg-foreground text-background" : "text-muted-foreground hover:bg-highlight hover:text-highlight-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Small inline code/value chip. */
export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center border-2 border-foreground bg-card px-2 py-0.5 font-mono text-xs font-bold", className)}>
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------
   Keyboard
   ------------------------------------------------------------------ */

const noopSubscribe = () => () => {};
const isMacSnapshot = () => /Mac|iPhone|iPad/.test(navigator.platform);
const isMacServerSnapshot = () => false;

/** True on macOS after hydration (SSR renders the Ctrl variant). */
export function useIsMac() {
  return useSyncExternalStore(noopSubscribe, isMacSnapshot, isMacServerSnapshot);
}

/** Global hotkey. `combo` like "mod+enter", "mod+shift+c", "escape". Fires inside inputs too. */
export function useHotkey(combo: string, handler: () => void, enabled = true) {
  const ref = useRef(handler);
  useEffect(() => {
    ref.current = handler;
  });
  useEffect(() => {
    if (!enabled) return;
    const parts = combo.toLowerCase().split("+");
    const key = parts.pop() ?? "";
    const wantMod = parts.includes("mod");
    const wantShift = parts.includes("shift");
    const wantAlt = parts.includes("alt");
    const onKey = (e: KeyboardEvent) => {
      if (wantMod !== (e.ctrlKey || e.metaKey)) return;
      if (wantShift !== e.shiftKey) return;
      if (wantAlt !== e.altKey) return;
      if (e.key.toLowerCase() !== key) return;
      e.preventDefault();
      ref.current();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [combo, enabled]);
}

/** Keyboard hint to place inside a Button: <KbdHint combo="mod+enter" /> */
export function KbdHint({ combo, className }: { combo: string; className?: string }) {
  const mac = useIsMac();
  const keys = combo.split("+").map((k) => {
    switch (k.toLowerCase()) {
      case "mod":
        return mac ? "⌘" : "Ctrl";
      case "enter":
        return "↵";
      case "shift":
        return "⇧";
      case "escape":
        return "Esc";
      default:
        return k.length === 1 ? k.toUpperCase() : k;
    }
  });
  return (
    <KbdGroup className={cn("ms-1.5 hidden sm:inline-flex", className)} aria-hidden>
      {keys.map((k, i) => (
        <Kbd key={i} className="text-current opacity-80">
          {k}
        </Kbd>
      ))}
    </KbdGroup>
  );
}

/* ------------------------------------------------------------------
   Code output with syntax highlighting + line numbers
   ------------------------------------------------------------------ */

const JSON_TOKEN =
  /("(?:\\.|[^"\\])*")(\s*:)|("(?:\\.|[^"\\])*")|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|\b(true|false|null)\b|([{}[\],:])/g;

const HIGHLIGHT_LIMIT = 60_000;

function highlightJsonLine(line: string, keyBase: number): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of line.matchAll(JSON_TOKEN)) {
    const start = m.index ?? 0;
    if (start > last) out.push(line.slice(last, start));
    const k = keyBase + i++;
    if (m[1] !== undefined) {
      out.push(
        <span key={k} className="syn-key">
          {m[1]}
        </span>,
        <span key={`${k}c`} className="syn-punct">
          {m[2]}
        </span>,
      );
    } else if (m[3] !== undefined) {
      out.push(
        <span key={k} className="syn-string">
          {m[3]}
        </span>,
      );
    } else if (m[4] !== undefined) {
      out.push(
        <span key={k} className="syn-number">
          {m[4]}
        </span>,
      );
    } else if (m[5] !== undefined) {
      out.push(
        <span key={k} className="syn-literal">
          {m[5]}
        </span>,
      );
    } else {
      out.push(
        <span key={k} className="syn-punct">
          {m[6]}
        </span>,
      );
    }
    last = start + m[0].length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

export function CodeBlock({
  code,
  language = "json",
  lineNumbers = true,
  placeholder = "Output appears here",
  flashKey,
  className,
  id,
  maxHeight = "60vh",
  minHeight = 160,
}: {
  code: string;
  language?: "json" | "text";
  lineNumbers?: boolean;
  placeholder?: string;
  flashKey?: string | number;
  className?: string;
  id?: string;
  maxHeight?: string;
  minHeight?: number;
}) {
  const lines = useMemo(() => {
    if (!code) return [];
    const raw = code.split("\n");
    const highlight = language === "json" && code.length <= HIGHLIGHT_LIMIT;
    return raw.map((line, i) => (highlight ? highlightJsonLine(line, i * 1000) : [line]));
  }, [code, language]);

  return (
    <pre
      key={flashKey !== undefined ? String(flashKey) : undefined}
      id={id}
      tabIndex={0}
      className={cn(
        "code-surface overflow-auto border-2 border-foreground bg-card p-3 font-mono text-[13px] leading-relaxed outline-none focus-visible:border-primary focus-visible:shadow-hard-blue",
        lineNumbers && "code-lines",
        code && flashKey !== undefined && "animate-flash",
        className,
      )}
      style={{ maxHeight, minHeight }}
    >
      {code ? (
        lines.map((nodes, i) => (
          <span key={i} className="code-line">
            <span className="min-w-0 flex-1 whitespace-pre">{nodes.length ? nodes : " "}</span>
          </span>
        ))
      ) : (
        <span className="text-muted-foreground">{placeholder}</span>
      )}
    </pre>
  );
}

/* ------------------------------------------------------------------
   Parse-error helpers (JSON.parse messages differ per engine)
   ------------------------------------------------------------------ */

export interface ParsePosition {
  line: number;
  column: number;
  offset: number;
}

function toLineCol(source: string, offset: number): ParsePosition {
  const clamped = Math.max(0, Math.min(offset, source.length));
  const before = source.slice(0, clamped);
  const line = before.split("\n").length;
  const column = clamped - before.lastIndexOf("\n");
  return { line, column, offset: clamped };
}

/**
 * Extract line/column from a JSON.parse error message.
 * Handles: "line L column C" (Firefox/newer V8), "position N" (V8),
 * V8's context snippet `Unexpected token X, ..."context"... is not valid JSON`,
 * and "Unexpected end of JSON input".
 */
export function locateJsonError(message: string, source: string): ParsePosition | null {
  const lc = /line (\d+)\D+column (\d+)/i.exec(message);
  if (lc) {
    const line = Number(lc[1]);
    const column = Number(lc[2]);
    const offset = source.split("\n").slice(0, line - 1).reduce((n, l) => n + l.length + 1, 0) + column - 1;
    return toLineCol(source, offset);
  }
  const pos = /position (\d+)/i.exec(message);
  if (pos) return toLineCol(source, Number(pos[1]));

  // V8: context is source.slice(pos - 10, pos + 10), "..." marks truncation on either side
  const tok = /Unexpected token (.+?), (\.\.\.)?"([\s\S]*?)"(\.\.\.)? is not valid JSON/.exec(message);
  if (tok) {
    const token = tok[1].replace(/^'|'$/g, "");
    const truncatedStart = Boolean(tok[2]);
    const ctx = tok[3];
    const start = source.indexOf(ctx);
    if (start >= 0) {
      const inCtx = ctx.indexOf(token);
      const offset = truncatedStart ? start + 10 : start + (inCtx >= 0 ? inCtx : 0);
      return toLineCol(source, offset);
    }
  }
  if (/unexpected end of (json )?input/i.test(message)) return toLineCol(source, source.length);
  return null;
}

/** Trim engine-specific noise from a JSON.parse message. */
export function cleanJsonError(message: string): string {
  return message
    .replace(/^JSON\.parse:\s*/i, "")
    .replace(/,\s*(\.\.\.)?"[\s\S]*"(\.\.\.)? is not valid JSON$/, "")
    .replace(/\s+in JSON at position \d+.*$/i, "")
    .replace(/\s+of the JSON data$/i, "")
    .replace(/^\w/, (c) => c.toUpperCase());
}
