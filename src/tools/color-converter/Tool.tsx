"use client";

import { useState } from "react";
import { Button, Chip, CopyButton, ErrorText, Hint, Label, TextInput, ToolPanel } from "@/components/tools/ui";

interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** Parses a channel token; percentages scale to `max`, plain numbers are clamped to [0, max]. */
function parseChannel(token: string, max: number): number | null {
  const t = token.trim();
  if (!t) return null;
  if (t.endsWith("%")) {
    const n = Number(t.slice(0, -1));
    return Number.isFinite(n) ? (clamp(n, 0, 100) / 100) * max : null;
  }
  const n = Number(t);
  return Number.isFinite(n) ? clamp(n, 0, max) : null;
}

function parseHue(token: string): number | null {
  const m = /^(-?\d*\.?\d+)(deg|turn|rad|grad)?$/.exec(token.trim());
  if (!m) return null;
  const n = Number(m[1]);
  if (!Number.isFinite(n)) return null;
  const deg = m[2] === "turn" ? n * 360 : m[2] === "rad" ? (n * 180) / Math.PI : m[2] === "grad" ? n * 0.9 : n;
  return ((deg % 360) + 360) % 360;
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r, g, b] =
    h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l * 100];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s * 100, l * 100];
}

function parseColor(raw: string): Rgba | null {
  const s = raw.trim().toLowerCase();
  if (!s) return null;

  const hex = /^#?([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/.exec(s);
  if (hex) {
    let h = hex[1];
    if (h.length <= 4) h = h.replace(/./g, (c) => c + c);
    const n = parseInt(h, 16);
    if (h.length === 6) return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
    return { r: (n >>> 24) & 255, g: (n >>> 16) & 255, b: (n >>> 8) & 255, a: (n & 255) / 255 };
  }

  const fn = /^(rgba?|hsla?)\(\s*(.+?)\s*\)$/.exec(s);
  if (!fn) return null;
  const parts = fn[2].split(/\s*[,/]\s*|\s+/).filter(Boolean);
  if (parts.length < 3 || parts.length > 4) return null;
  const a = parts.length === 4 ? parseChannel(parts[3], 1) : 1;
  if (a === null) return null;

  if (fn[1].startsWith("rgb")) {
    const r = parseChannel(parts[0], 255);
    const g = parseChannel(parts[1], 255);
    const b = parseChannel(parts[2], 255);
    if (r === null || g === null || b === null) return null;
    return { r, g, b, a };
  }

  const h = parseHue(parts[0]);
  const sat = parseChannel(parts[1], 100);
  const light = parseChannel(parts[2], 100);
  if (h === null || sat === null || light === null) return null;
  const [r, g, b] = hslToRgb(h, sat / 100, light / 100);
  return { r, g, b, a };
}

function luminance({ r, g, b }: Rgba): number {
  const lin = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrastRatio(l1: number, l2: number): number {
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

const hex2 = (n: number) => Math.round(n).toString(16).padStart(2, "0");
const round = (n: number, digits = 0) => Number(n.toFixed(digits));

const EXAMPLES = ["#1e90ff", "rgb(255, 99, 71)", "hsl(150 60% 45%)", "#00000080"];

const CHECKERBOARD = {
  backgroundImage:
    "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
  backgroundSize: "16px 16px",
  backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0",
} as const;

function PassFail({ ok, children }: { ok: boolean; children: string }) {
  return (
    <span className={ok ? "text-success" : "text-destructive"}>
      {ok ? "Pass" : "Fail"} {children}
    </span>
  );
}

export default function ColorConverterTool() {
  const [input, setInput] = useState("#1e90ff");
  const color = parseColor(input);
  const error = input.trim() && !color ? "Unrecognized color. Try #1e90ff, rgb(30, 144, 255) or hsl(210, 100%, 56%)." : "";

  const r = color ? Math.round(color.r) : 0;
  const g = color ? Math.round(color.g) : 0;
  const b = color ? Math.round(color.b) : 0;
  const a = color ? round(color.a, 3) : 1;
  const hasAlpha = a < 1;
  const [h, s, l] = color ? rgbToHsl(color.r, color.g, color.b) : [0, 0, 0];
  const H = round(h, 1);
  const S = round(s, 1);
  const L = round(l, 1);

  const hex6 = `#${hex2(r)}${hex2(g)}${hex2(b)}`;
  const hex8 = `${hex6}${hex2(a * 255)}`;

  const outputs = color
    ? [
        { label: "HEX", value: hasAlpha ? hex8 : hex6 },
        { label: "RGB", value: `rgb(${r}, ${g}, ${b})` },
        { label: "RGBA", value: `rgba(${r}, ${g}, ${b}, ${a})` },
        { label: "HSL", value: `hsl(${H}, ${S}%, ${L}%)` },
        { label: "HSLA", value: `hsla(${H}, ${S}%, ${L}%, ${a})` },
        { label: "CSS rgb()", value: `rgb(${r} ${g} ${b}${hasAlpha ? ` / ${a}` : ""})` },
        { label: "CSS hsl()", value: `hsl(${H} ${S}% ${L}%${hasAlpha ? ` / ${a}` : ""})` },
      ]
    : [];

  const lum = color ? luminance({ r, g, b, a: 1 }) : 0;
  const contrasts = [
    { name: "On white", bg: "#ffffff", ratio: contrastRatio(lum, 1) },
    { name: "On black", bg: "#000000", ratio: contrastRatio(lum, 0) },
  ];

  return (
    <ToolPanel>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="color-in">Color</Label>
          <div className="flex items-center gap-2">
            <TextInput
              id="color-in"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
              autoComplete="off"
              placeholder="#1e90ff, rgb(30 144 255), hsl(210, 100%, 56%)"
            />
            <input
              type="color"
              aria-label="Pick a color"
              value={color ? hex6 : "#000000"}
              onChange={(e) => setInput(e.target.value)}
              className="size-9 shrink-0 cursor-pointer rounded-lg border-2 border-border bg-card p-1"
            />
          </div>
          <ErrorText>{error}</ErrorText>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="label-mono">Try</span>
            {EXAMPLES.map((example) => (
              <Button key={example} size="sm" className="font-mono" onClick={() => setInput(example)}>
                {example}
              </Button>
            ))}
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border border-border" style={CHECKERBOARD}>
            <div
              className="flex h-40 items-end justify-end p-3"
              style={{ backgroundColor: color ? `rgba(${r}, ${g}, ${b}, ${a})` : "transparent" }}
            >
              {color && <Chip className="bg-card/90">{hasAlpha ? hex8 : hex6}</Chip>}
            </div>
          </div>
        </div>

        <div>
          <p className="label-mono mb-1.5">Formats</p>
          {outputs.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted-foreground">
              Enter a valid color to see conversions.
            </p>
          ) : (
            <div className="space-y-2">
              {outputs.map((o) => (
                <div
                  key={o.label}
                  className="flex items-center justify-between gap-3 brut-flat px-3 py-2"
                >
                  <span className="label-mono w-20 shrink-0">{o.label}</span>
                  <span className="min-w-0 flex-1 break-all font-mono text-sm">{o.value}</span>
                  <CopyButton text={o.value} size="sm" variant="ghost" className="shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {color && (
        <div className="mt-6">
          <p className="label-mono">Contrast (WCAG 2, normal text)</p>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {contrasts.map((c) => (
              <div key={c.name} className="flex items-center gap-3 brut-flat p-3">
                <div
                  className="flex h-16 w-24 shrink-0 items-center justify-center rounded-md border border-border text-lg font-semibold"
                  style={{ backgroundColor: c.bg, color: hex6 }}
                >
                  Aa
                </div>
                <div className="text-sm">
                  <p className="font-medium">
                    {c.name} · <span className="font-mono tabular-nums">{c.ratio.toFixed(2)}:1</span>
                  </p>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs">
                    <PassFail ok={c.ratio >= 4.5}>AA 4.5:1</PassFail>
                    <PassFail ok={c.ratio >= 7}>AAA 7:1</PassFail>
                    <PassFail ok={c.ratio >= 3}>AA large 3:1</PassFail>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {hasAlpha && <Hint>Contrast is calculated for the opaque color; alpha is ignored.</Hint>}
        </div>
      )}
    </ToolPanel>
  );
}
