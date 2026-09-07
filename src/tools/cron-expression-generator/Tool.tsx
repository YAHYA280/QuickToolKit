"use client";

import { useEffect, useMemo, useState } from "react";
import cronstrue from "cronstrue";
import { RefreshCwIcon } from "lucide-react";
import {
  Button,
  CheckboxField,
  Chip,
  CopyButton,
  ErrorText,
  Hint,
  Label,
  NumberInput,
  Segmented,
  SelectField,
  Stat,
  TextInput,
  ToolActions,
  ToolPanel,
} from "@/components/tools/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Mode = "build" | "parse";
type FieldKey = "minute" | "hour" | "dayOfMonth" | "month" | "dayOfWeek";
type FieldMode = "every" | "step" | "specific" | "range";

interface FieldState {
  mode: FieldMode;
  step: number | "";
  values: number[];
  from: number | "";
  to: number | "";
}

interface FieldDef {
  key: FieldKey;
  label: string;
  unit: string;
  min: number;
  max: number;
  names?: readonly string[];
}

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"] as const;
const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

const FIELDS: readonly FieldDef[] = [
  { key: "minute", label: "Minute", unit: "minutes", min: 0, max: 59 },
  { key: "hour", label: "Hour", unit: "hours", min: 0, max: 23 },
  { key: "dayOfMonth", label: "Day of month", unit: "days", min: 1, max: 31 },
  { key: "month", label: "Month", unit: "months", min: 1, max: 12, names: MONTHS },
  { key: "dayOfWeek", label: "Day of week", unit: "days", min: 0, max: 6, names: DAYS },
];

const MODE_OPTIONS = [
  { value: "every", label: "Every" },
  { value: "step", label: "Every N" },
  { value: "specific", label: "Specific values" },
  { value: "range", label: "Range" },
] as const;

const PRESETS = [
  { label: "Every minute", expr: "* * * * *" },
  { label: "Hourly", expr: "0 * * * *" },
  { label: "Daily at midnight", expr: "0 0 * * *" },
  { label: "Weekdays 9am", expr: "0 9 * * 1-5" },
  { label: "First of month", expr: "0 0 1 * *" },
  { label: "Every 15 minutes", expr: "*/15 * * * *" },
] as const;

const ALIASES: Record<string, string> = {
  "@yearly": "0 0 1 1 *",
  "@annually": "0 0 1 1 *",
  "@monthly": "0 0 1 * *",
  "@weekly": "0 0 * * 0",
  "@daily": "0 0 * * *",
  "@midnight": "0 0 * * *",
  "@hourly": "0 * * * *",
};

const REFERENCE = [
  { field: "Minute", values: "0-59", special: "* , - /", example: "*/15" },
  { field: "Hour", values: "0-23", special: "* , - /", example: "9-17" },
  { field: "Day of month", values: "1-31", special: "* , - / ?", example: "1,15" },
  { field: "Month", values: "1-12 or JAN-DEC", special: "* , - /", example: "JAN,JUL" },
  { field: "Day of week", values: "0-6 or SUN-SAT (7 = SUN)", special: "* , - / ?", example: "MON-FRI" },
] as const;

const SPECIAL = [
  { char: "*", meaning: "Any value" },
  { char: ",", meaning: "List separator: 1,15,30" },
  { char: "-", meaning: "Range: MON-FRI" },
  { char: "/", meaning: "Step: */5 or 1-30/10" },
  { char: "?", meaning: "No specific value (same as * here)" },
  { char: "@hourly", meaning: "Alias for 0 * * * * (also @daily, @weekly, @monthly, @yearly)" },
] as const;

const MAX_DAYS = 366;
const RUN_COUNT = 5;

/* ------------------------------------------------------------------
   Parsing and matching
   ------------------------------------------------------------------ */

interface CronSpec {
  minute: Set<number>;
  hour: Set<number>;
  dayOfMonth: Set<number>;
  month: Set<number>;
  dayOfWeek: Set<number>;
  /** Field starts with "*" (or "?"): standard cron then ANDs the two day fields instead of ORing them. */
  domAny: boolean;
  dowAny: boolean;
}

function expandAlias(expr: string): string {
  const key = expr.trim().toLowerCase();
  return ALIASES[key] ?? expr.trim();
}

function parseValue(token: string, def: FieldDef): number {
  if (def.names) {
    const i = def.names.indexOf(token.toUpperCase());
    if (i >= 0) return def.min + i;
  }
  if (!/^\d+$/.test(token)) throw new Error(`${def.label}: "${token}" is not a valid value`);
  let n = Number(token);
  if (def.key === "dayOfWeek" && n === 7) n = 0;
  if (n < def.min || n > def.max) throw new Error(`${def.label}: ${n} is out of range (${def.min}-${def.max})`);
  return n;
}

function parseField(text: string, def: FieldDef): { set: Set<number>; any: boolean } {
  const set = new Set<number>();
  if (!text) throw new Error(`${def.label}: field is empty`);
  for (const part of text.split(",")) {
    if (!part) throw new Error(`${def.label}: empty item in list "${text}"`);
    const [rangeText, stepText, ...rest] = part.split("/");
    if (rest.length) throw new Error(`${def.label}: too many "/" in "${part}"`);
    let step = 1;
    if (stepText !== undefined) {
      if (!/^\d+$/.test(stepText) || Number(stepText) < 1) throw new Error(`${def.label}: invalid step "${stepText}"`);
      step = Number(stepText);
    }
    let from: number;
    let to: number;
    if (rangeText === "*" || rangeText === "?") {
      from = def.min;
      to = def.max;
    } else if (rangeText.includes("-")) {
      const [a, b, ...more] = rangeText.split("-");
      if (more.length || !a || !b) throw new Error(`${def.label}: invalid range "${rangeText}"`);
      from = parseValue(a, def);
      to = parseValue(b, def);
      if (from > to) throw new Error(`${def.label}: range "${rangeText}" starts after it ends`);
    } else {
      from = parseValue(rangeText, def);
      to = stepText !== undefined ? def.max : from;
    }
    for (let v = from; v <= to; v += step) set.add(v);
  }
  return { set, any: text.startsWith("*") || text.startsWith("?") };
}

function parseExpression(raw: string): CronSpec {
  const expr = expandAlias(raw);
  const parts = expr.split(/\s+/).filter(Boolean);
  if (parts.length !== 5) throw new Error(`Expected 5 fields (minute hour day month weekday), got ${parts.length}`);
  const [minute, hour, dom, month, dow] = FIELDS.map((def, i) => parseField(parts[i], def));
  return {
    minute: minute.set,
    hour: hour.set,
    dayOfMonth: dom.set,
    month: month.set,
    dayOfWeek: dow.set,
    domAny: dom.any,
    dowAny: dow.any,
  };
}

function dayMatches(spec: CronSpec, t: Date): boolean {
  const dom = spec.dayOfMonth.has(t.getDate());
  const dow = spec.dayOfWeek.has(t.getDay());
  return spec.domAny || spec.dowAny ? dom && dow : dom || dow;
}

/** Walks forward from `from` (local time), skipping whole months/days/hours that cannot match. */
function nextRuns(spec: CronSpec, from: Date, count: number): Date[] {
  const out: Date[] = [];
  const t = new Date(from);
  t.setSeconds(0, 0);
  t.setMinutes(t.getMinutes() + 1);
  const limit = from.getTime() + MAX_DAYS * 86_400_000;
  let guard = 0;
  while (t.getTime() <= limit && out.length < count && guard++ < 2_000_000) {
    if (!spec.month.has(t.getMonth() + 1)) {
      t.setMonth(t.getMonth() + 1, 1);
      t.setHours(0, 0, 0, 0);
      continue;
    }
    if (!dayMatches(spec, t)) {
      t.setDate(t.getDate() + 1);
      t.setHours(0, 0, 0, 0);
      continue;
    }
    if (!spec.hour.has(t.getHours())) {
      t.setHours(t.getHours() + 1, 0, 0, 0);
      continue;
    }
    if (!spec.minute.has(t.getMinutes())) {
      t.setMinutes(t.getMinutes() + 1);
      continue;
    }
    out.push(new Date(t));
    t.setMinutes(t.getMinutes() + 1);
  }
  return out;
}

/* ------------------------------------------------------------------
   Builder state <-> expression
   ------------------------------------------------------------------ */

function clamp(v: number | "", min: number, max: number, fallback: number): number {
  if (v === "" || Number.isNaN(v)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(v)));
}

function fieldText(f: FieldState, def: FieldDef): string {
  switch (f.mode) {
    case "every":
      return "*";
    case "step":
      return `*/${clamp(f.step, 1, def.max, 1)}`;
    case "specific":
      return f.values.length ? [...f.values].sort((a, b) => a - b).join(",") : "*";
    case "range": {
      const a = clamp(f.from, def.min, def.max, def.min);
      const b = clamp(f.to, def.min, def.max, def.max);
      return a <= b ? `${a}-${b}` : `${b}-${a}`;
    }
  }
}

function fieldFromText(text: string, def: FieldDef): FieldState {
  const base: FieldState = { mode: "every", step: 5, values: [], from: def.min, to: def.max };
  if (text === "*") return base;
  const step = /^\*\/(\d+)$/.exec(text);
  if (step) return { ...base, mode: "step", step: Number(step[1]) };
  const range = /^(\d+)-(\d+)$/.exec(text);
  if (range) return { ...base, mode: "range", from: Number(range[1]), to: Number(range[2]) };
  const { set } = parseField(text, def);
  return { ...base, mode: "specific", values: [...set].sort((a, b) => a - b) };
}

type Fields = Record<FieldKey, FieldState>;

function fieldsFromExpression(expr: string): Fields {
  const parts = expandAlias(expr).split(/\s+/);
  return Object.fromEntries(FIELDS.map((def, i) => [def.key, fieldFromText(parts[i] ?? "*", def)])) as Fields;
}

function buildExpression(fields: Fields): string {
  return FIELDS.map((def) => fieldText(fields[def.key], def)).join(" ");
}

function valueLabel(def: FieldDef, v: number): string {
  if (def.names) {
    const name = def.names[v - def.min];
    return name.charAt(0) + name.slice(1).toLowerCase();
  }
  return String(v).padStart(2, "0");
}

function rangeOf(min: number, max: number): number[] {
  return Array.from({ length: max - min + 1 }, (_, i) => min + i);
}

function formatRun(d: Date): string {
  return d.toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function relative(d: Date, now: Date): string {
  const mins = Math.max(0, Math.round((d.getTime() - now.getTime()) / 60_000));
  const days = Math.floor(mins / 1440);
  const hours = Math.floor((mins % 1440) / 60);
  const rest = mins % 60;
  if (days > 0) return `in ${days}d ${hours}h`;
  if (hours > 0) return `in ${hours}h ${rest}m`;
  return `in ${rest}m`;
}

function describe(expr: string): string {
  try {
    return cronstrue.toString(expandAlias(expr), { throwExceptionOnParseError: true });
  } catch {
    return "";
  }
}

const HIGHLIGHT = "border-primary bg-primary text-primary-foreground [&_.label-mono]:text-primary-foreground/80";

export default function CronExpressionGeneratorTool() {
  const [mode, setMode] = useState<Mode>("build");
  const [fields, setFields] = useState<Fields>(() => fieldsFromExpression("0 9 * * 1-5"));
  const [parseInput, setParseInput] = useState("*/5 9-17 * * MON-FRI");
  const [now, setNow] = useState<Date | null>(null);

  // "Now" differs between server and client, so run times are computed only after mount.
  useEffect(() => {
    const id = window.setTimeout(() => setNow(new Date()), 0);
    return () => window.clearTimeout(id);
  }, []);

  const expression = mode === "build" ? buildExpression(fields) : parseInput.trim();

  const analysis = useMemo(() => {
    if (!expression) return { spec: null, description: "", error: "" };
    try {
      return { spec: parseExpression(expression), description: describe(expression), error: "" };
    } catch (e) {
      return { spec: null, description: "", error: e instanceof Error ? e.message : "Invalid cron expression" };
    }
  }, [expression]);

  const runs = useMemo(
    () => (analysis.spec && now ? nextRuns(analysis.spec, now, RUN_COUNT) : []),
    [analysis.spec, now],
  );

  const update = (key: FieldKey, patch: Partial<FieldState>) =>
    setFields((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));

  const toggleValue = (key: FieldKey, v: number, checked: boolean) =>
    setFields((prev) => {
      const values = checked ? [...prev[key].values, v] : prev[key].values.filter((x) => x !== v);
      return { ...prev, [key]: { ...prev[key], values } };
    });

  const applyPreset = (expr: string) => {
    if (mode === "build") setFields(fieldsFromExpression(expr));
    else setParseInput(expr);
    setNow(new Date());
  };

  const expanded = expandAlias(expression);

  return (
    <ToolPanel>
      <Segmented
        aria-label="Mode"
        value={mode}
        onChange={setMode}
        options={[
          { value: "build", label: "Build" },
          { value: "parse", label: "Parse" },
        ]}
      />

      {mode === "build" ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FIELDS.map((def) => {
            const f = fields[def.key];
            return (
              <div key={def.key} className="brut-flat p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <Label htmlFor={`cron-${def.key}-mode`} className="mb-0">
                    {def.label}
                  </Label>
                  <Chip className="text-brand-strong">{fieldText(f, def)}</Chip>
                </div>
                <SelectField
                  id={`cron-${def.key}-mode`}
                  size="sm"
                  value={f.mode}
                  onChange={(v) => update(def.key, { mode: v as FieldMode })}
                  options={MODE_OPTIONS}
                />
                {f.mode === "step" && (
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Every</span>
                    <NumberInput
                      id={`cron-${def.key}-step`}
                      value={f.step}
                      onChange={(v) => update(def.key, { step: v })}
                      min={1}
                      max={def.max}
                      className="w-24"
                    />
                    <span className="text-muted-foreground">{def.unit}</span>
                  </div>
                )}
                {f.mode === "range" && (
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">From</span>
                    <NumberInput
                      id={`cron-${def.key}-from`}
                      value={f.from}
                      onChange={(v) => update(def.key, { from: v })}
                      min={def.min}
                      max={def.max}
                      className="w-20"
                    />
                    <span className="text-muted-foreground">to</span>
                    <NumberInput
                      id={`cron-${def.key}-to`}
                      value={f.to}
                      onChange={(v) => update(def.key, { to: v })}
                      min={def.min}
                      max={def.max}
                      className="w-20"
                    />
                  </div>
                )}
                {f.mode === "specific" && (
                  <div className="mt-2 flex max-h-44 flex-wrap gap-1.5 overflow-auto">
                    {rangeOf(def.min, def.max).map((v) => {
                      const checked = f.values.includes(v);
                      return (
                        <CheckboxField
                          key={v}
                          id={`cron-${def.key}-${v}`}
                          checked={checked}
                          onChange={(c) => toggleValue(def.key, v, c)}
                          label={<span className="font-mono text-xs">{valueLabel(def, v)}</span>}
                          className={`border-2 px-2 py-1 ${checked ? "border-primary bg-highlight text-highlight-foreground" : "border-border bg-card"}`}
                        />
                      );
                    })}
                    {f.values.length === 0 && (
                      <Hint className="mt-0 basis-full">Nothing ticked yet, so this field is treated as *.</Hint>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-4">
          <Label htmlFor="cron-parse">Cron expression</Label>
          <TextInput
            id="cron-parse"
            value={parseInput}
            onChange={(e) => setParseInput(e.target.value)}
            placeholder="*/5 * * * *"
            autoComplete="off"
            spellCheck={false}
            aria-invalid={Boolean(analysis.error) || undefined}
            className="h-11 text-base"
          />
          <ErrorText>{analysis.error}</ErrorText>
          {!analysis.error && expanded !== expression && (
            <Hint>
              {expression} expands to <span className="text-foreground">{expanded}</span>
            </Hint>
          )}
        </div>
      )}

      <ToolActions>
        <span className="text-sm text-muted-foreground">Presets</span>
        {PRESETS.map((p) => (
          <Button key={p.expr} size="sm" onClick={() => applyPreset(p.expr)} aria-pressed={expanded === p.expr}>
            {p.label}
          </Button>
        ))}
      </ToolActions>

      <div className="mt-6">
        <p className="label-mono">Expression</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <Chip className="px-4 py-2 text-xl tracking-wide sm:text-2xl">
            {expression || <span className="text-muted-foreground">Type an expression</span>}
          </Chip>
          <CopyButton text={analysis.spec ? expression : ""} />
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Stat
          label="Meaning"
          value={analysis.description || (analysis.error ? "Invalid expression" : "...")}
          mono={false}
          className={`${HIGHLIGHT} [&>p:last-child]:text-base [&>p:last-child]:whitespace-normal`}
        />
        <div className="min-w-0">
          <div className="flex items-center justify-between">
            <p className="label-mono">Next {RUN_COUNT} runs (your local time)</p>
            <Button size="xs" variant="ghost" onClick={() => setNow(new Date())} disabled={!analysis.spec}>
              <RefreshCwIcon data-icon="inline-start" />
              Recalculate
            </Button>
          </div>
          <ol className="mt-2 brut-flat divide-y divide-border font-mono text-sm">
            {runs.map((d) => (
              <li key={d.getTime()} className="flex items-center justify-between gap-3 px-3 py-2">
                <span className="tabular-nums">{formatRun(d)}</span>
                <span className="text-xs text-muted-foreground">{now ? relative(d, now) : ""}</span>
              </li>
            ))}
            {runs.length === 0 && (
              <li className="px-3 py-2 text-muted-foreground">
                {!analysis.spec
                  ? "Fix the expression to see run times"
                  : now
                    ? `No run in the next ${MAX_DAYS} days`
                    : "Calculating..."}
              </li>
            )}
          </ol>
        </div>
      </div>

      <details className="mt-6 brut-flat">
        <summary className="cursor-pointer px-3 py-2 text-sm font-medium select-none">Field reference</summary>
        <div className="border-t border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="label-mono">Field</TableHead>
                <TableHead className="label-mono">Allowed values</TableHead>
                <TableHead className="label-mono">Special characters</TableHead>
                <TableHead className="label-mono">Example</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-[13px]">
              {REFERENCE.map((row) => (
                <TableRow key={row.field}>
                  <TableCell className="font-medium">{row.field}</TableCell>
                  <TableCell className="font-mono whitespace-normal">{row.values}</TableCell>
                  <TableCell className="font-mono">{row.special}</TableCell>
                  <TableCell>
                    <Chip className="text-brand-strong">{row.example}</Chip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="border-t border-border">
          <Table>
            <TableBody className="text-[13px]">
              {SPECIAL.map((row) => (
                <TableRow key={row.char}>
                  <TableCell className="w-28">
                    <Chip className="text-brand-strong">{row.char}</Chip>
                  </TableCell>
                  <TableCell className="whitespace-normal text-muted-foreground">{row.meaning}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </details>
    </ToolPanel>
  );
}
