"use client";

import { useEffect, useState } from "react";
import {
  Button,
  CheckboxField,
  CopyButton,
  ErrorText,
  Hint,
  Label,
  NumberInput,
  Segmented,
  SelectField,
  SliderField,
  ToolActions,
  ToolPanel,
} from "@/components/tools/ui";
import { WORDS } from "./words";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{}|;:,.<>?/~";
const AMBIGUOUS = "0O1lI|";

type Mode = "password" | "passphrase";

const MODES: { value: Mode; label: string }[] = [
  { value: "password", label: "Password" },
  { value: "passphrase", label: "Passphrase" },
];

interface PasswordOptions {
  length: number | "";
  lower: boolean;
  upper: boolean;
  digits: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
  count: number | "";
}

interface PassphraseOptions {
  words: number | "";
  separator: string;
  capitalize: boolean;
  appendNumber: boolean;
  count: number | "";
}

const DEFAULT_PASSWORD: PasswordOptions = {
  length: 16,
  lower: true,
  upper: true,
  digits: true,
  symbols: true,
  excludeAmbiguous: false,
  count: 5,
};

const DEFAULT_PASSPHRASE: PassphraseOptions = {
  words: 4,
  separator: "-",
  capitalize: false,
  appendNumber: false,
  count: 5,
};

const SEPARATORS = [
  { label: "Hyphen (-)", value: "-" },
  { label: "Space", value: " " },
  { label: "Underscore (_)", value: "_" },
  { label: "Period (.)", value: "." },
  { label: "None", value: "" },
];

/** Radix Select forbids an empty-string item value, so "None" is keyed as "none" in the dropdown only. */
const NO_SEPARATOR = "none";
const SEPARATOR_OPTIONS = SEPARATORS.map((s) => ({ value: s.value || NO_SEPARATOR, label: s.label }));

const clamp = (v: number | "", min: number, max: number, fallback: number) => {
  const n = v === "" ? fallback : Math.floor(v);
  return Math.min(max, Math.max(min, Number.isFinite(n) ? n : fallback));
};

/** Uniform integer in [0, max) using rejection sampling so no value is favoured by modulo bias. */
function randomInt(max: number): number {
  const range = 4294967296; // 2^32, the span of one Uint32
  const limit = range - (range % max);
  const buf = new Uint32Array(1);
  let x: number;
  do {
    crypto.getRandomValues(buf);
    x = buf[0];
  } while (x >= limit);
  return x % max;
}

const pick = (chars: string) => chars[randomInt(chars.length)];

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function charSets(o: PasswordOptions): string[] {
  const strip = (s: string) => (o.excludeAmbiguous ? [...s].filter((c) => !AMBIGUOUS.includes(c)).join("") : s);
  const sets: string[] = [];
  if (o.lower) sets.push(strip(LOWER));
  if (o.upper) sets.push(strip(UPPER));
  if (o.digits) sets.push(strip(DIGITS));
  if (o.symbols) sets.push(strip(SYMBOLS));
  return sets;
}

function generatePassword(o: PasswordOptions): string {
  const sets = charSets(o);
  if (sets.length === 0) return "";
  const length = clamp(o.length, 4, 128, 16);
  const pool = sets.join("");
  // One guaranteed character from every enabled set, then fill from the whole pool and shuffle.
  const chars = sets.map((s) => pick(s));
  while (chars.length < length) chars.push(pick(pool));
  return shuffle(chars).join("");
}

function generatePassphrase(o: PassphraseOptions): string {
  const count = clamp(o.words, 3, 8, 4);
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    const w = WORDS[randomInt(WORDS.length)];
    words.push(o.capitalize ? w[0].toUpperCase() + w.slice(1) : w);
  }
  if (o.appendNumber) words.push(String(randomInt(100)).padStart(2, "0"));
  return words.join(o.separator);
}

function generate(mode: Mode, pw: PasswordOptions, pp: PassphraseOptions): string[] {
  const count = clamp(mode === "password" ? pw.count : pp.count, 1, 20, 5);
  return Array.from({ length: count }, () => (mode === "password" ? generatePassword(pw) : generatePassphrase(pp)));
}

function entropyBits(mode: Mode, pw: PasswordOptions, pp: PassphraseOptions): number {
  if (mode === "password") {
    const poolSize = charSets(pw).join("").length;
    return poolSize ? clamp(pw.length, 4, 128, 16) * Math.log2(poolSize) : 0;
  }
  return clamp(pp.words, 3, 8, 4) * Math.log2(WORDS.length) + (pp.appendNumber ? Math.log2(100) : 0);
}

function strengthOf(bits: number): { label: string; color: string; pct: number } {
  const pct = Math.min(100, Math.round(bits));
  if (bits < 40) return { label: "Weak", color: "bg-destructive", pct };
  if (bits < 60) return { label: "Fair", color: "bg-destructive", pct };
  if (bits < 80) return { label: "Strong", color: "bg-brand", pct };
  return { label: "Very strong", color: "bg-success", pct };
}

export default function PasswordGeneratorTool() {
  const [mode, setMode] = useState<Mode>("password");
  const [pw, setPw] = useState<PasswordOptions>(DEFAULT_PASSWORD);
  const [pp, setPp] = useState<PassphraseOptions>(DEFAULT_PASSPHRASE);
  const [results, setResults] = useState<string[]>([]);

  // Random output must not be server-rendered (it would differ on hydration), so the first batch is
  // produced on the client after mount. Deferred to a macrotask to avoid a synchronous setState in the effect.
  useEffect(() => {
    const id = window.setTimeout(() => setResults(generate("password", DEFAULT_PASSWORD, DEFAULT_PASSPHRASE)), 0);
    return () => window.clearTimeout(id);
  }, []);

  const switchMode = (next: Mode) => {
    setMode(next);
    setResults(generate(next, pw, pp));
  };
  const updatePw = (patch: Partial<PasswordOptions>) => {
    const next = { ...pw, ...patch };
    setPw(next);
    setResults(generate("password", next, pp));
  };
  const updatePp = (patch: Partial<PassphraseOptions>) => {
    const next = { ...pp, ...patch };
    setPp(next);
    setResults(generate("passphrase", pw, next));
  };
  const regenerate = () => setResults(generate(mode, pw, pp));

  const noSets = mode === "password" && charSets(pw).length === 0;
  const bits = entropyBits(mode, pw, pp);
  const strength = strengthOf(bits);
  const poolSize = charSets(pw).join("").length;
  const visible = noSets ? [] : results.filter(Boolean);

  return (
    <ToolPanel>
      <Segmented aria-label="Mode" value={mode} onChange={switchMode} options={MODES} />

      {mode === "password" ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="pw-length">Length</Label>
            <div className="flex items-center gap-4">
              <SliderField
                id="pw-length-range"
                aria-label="Password length"
                min={4}
                max={128}
                value={clamp(pw.length, 4, 128, 16)}
                onChange={(v) => updatePw({ length: v })}
                className="flex-1"
              />
              <div className="w-28 shrink-0">
                <NumberInput id="pw-length" value={pw.length} onChange={(v) => updatePw({ length: v })} min={4} max={128} step={1} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:col-span-2 sm:grid-cols-3">
            <CheckboxField id="pw-lower" checked={pw.lower} onChange={(v) => updatePw({ lower: v })} label="Lowercase (a-z)" />
            <CheckboxField id="pw-upper" checked={pw.upper} onChange={(v) => updatePw({ upper: v })} label="Uppercase (A-Z)" />
            <CheckboxField id="pw-digits" checked={pw.digits} onChange={(v) => updatePw({ digits: v })} label="Digits (0-9)" />
            <CheckboxField id="pw-symbols" checked={pw.symbols} onChange={(v) => updatePw({ symbols: v })} label="Symbols (!@#$%)" />
            <CheckboxField
              id="pw-ambiguous"
              checked={pw.excludeAmbiguous}
              onChange={(v) => updatePw({ excludeAmbiguous: v })}
              label="Exclude ambiguous (0O1lI|)"
            />
          </div>
          <div>
            <Label htmlFor="pw-count">How many</Label>
            <NumberInput id="pw-count" value={pw.count} onChange={(v) => updatePw({ count: v })} min={1} max={20} step={1} />
          </div>
          <Hint className="mt-0 self-end">Character pool: {poolSize} characters</Hint>
        </div>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="pp-words">Words (3-8)</Label>
            <NumberInput id="pp-words" value={pp.words} onChange={(v) => updatePp({ words: v })} min={3} max={8} step={1} />
          </div>
          <div>
            <Label htmlFor="pp-sep">Separator</Label>
            <SelectField
              id="pp-sep"
              value={pp.separator || NO_SEPARATOR}
              onChange={(v) => updatePp({ separator: v === NO_SEPARATOR ? "" : v })}
              options={SEPARATOR_OPTIONS}
            />
          </div>
          <div>
            <Label htmlFor="pp-count">How many</Label>
            <NumberInput id="pp-count" value={pp.count} onChange={(v) => updatePp({ count: v })} min={1} max={20} step={1} />
          </div>
          <div className="flex flex-wrap gap-4 sm:col-span-3">
            <CheckboxField id="pp-capitalize" checked={pp.capitalize} onChange={(v) => updatePp({ capitalize: v })} label="Capitalize words" />
            <CheckboxField id="pp-number" checked={pp.appendNumber} onChange={(v) => updatePp({ appendNumber: v })} label="Append a number" />
          </div>
        </div>
      )}

      <ErrorText>{noSets ? "Enable at least one character set." : null}</ErrorText>

      <div className="mt-5">
        <div className="flex items-center justify-between text-sm">
          <span>
            Strength: <strong>{noSets ? "—" : strength.label}</strong>
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">{noSets ? "0" : bits.toFixed(1)} bits</span>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted" aria-hidden>
          <div className={`h-full rounded-full transition-all ${strength.color}`} style={{ width: `${noSets ? 0 : strength.pct}%` }} />
        </div>
      </div>

      <ToolActions>
        <Button variant="primary" onClick={regenerate} disabled={noSets}>
          Generate
        </Button>
        <CopyButton text={visible.join("\n")} label="Copy all" />
      </ToolActions>

      {visible.length > 0 && (
        <ul className="mt-4 min-h-[230px] space-y-2">
          {visible.map((r, i) => (
            <li
              key={`${i}-${r}`}
              className="flex items-center justify-between gap-3 brut-flat px-4 py-2.5 font-mono text-sm break-all"
            >
              <code>{r}</code>
              <CopyButton text={r} size="sm" variant="ghost" className="shrink-0 font-sans" />
            </li>
          ))}
        </ul>
      )}
    </ToolPanel>
  );
}
