"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Chip,
  CopyButton,
  ErrorText,
  Hint,
  Label,
  SelectField,
  Stat,
  TextInput,
  ToolPanel,
} from "@/components/tools/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Unit = "seconds" | "milliseconds" | "microseconds" | "nanoseconds";
type TzMode = "local" | "utc";

const UNIT_LABEL: Record<Unit, string> = {
  seconds: "seconds",
  milliseconds: "milliseconds",
  microseconds: "microseconds",
  nanoseconds: "nanoseconds",
};

/** Largest magnitude a JavaScript Date can represent, in milliseconds. */
const MAX_MS = 8.64e15;
const DAY_MS = 86_400_000;

const pad = (n: number, width = 2) => String(n).padStart(width, "0");

function detectUnit(digits: number): Unit | null {
  if (digits <= 10) return "seconds";
  if (digits <= 13) return "milliseconds";
  if (digits <= 16) return "microseconds";
  if (digits <= 19) return "nanoseconds";
  return null;
}

type Parsed = { ms: number; unit: Unit; error?: undefined } | { error: string; ms?: undefined; unit?: undefined };
type DateResult = { ms: number; error?: undefined } | { error: string; ms?: undefined };

function parseTimestamp(raw: string): Parsed | null {
  const s = raw.trim().replace(/[\s_,]/g, "");
  if (!s) return null;
  const m = /^(-?)(\d+)(?:\.(\d+))?$/.exec(s);
  if (!m) return { error: "Enter digits only, for example 1700000000 or 1700000000123." };
  const [, sign, intPart, frac = ""] = m;
  const unit = detectUnit(intPart.replace(/^0+(?=\d)/, "").length);
  if (!unit) return { error: "Too many digits. Unix timestamps have at most 19 digits (nanoseconds)." };
  let ms: number;
  switch (unit) {
    case "seconds":
      ms = Math.round(Number(`${intPart}.${frac || "0"}`) * 1000);
      break;
    case "milliseconds":
      ms = Number(intPart);
      break;
    case "microseconds":
      ms = Number(BigInt(intPart) / BigInt(1000));
      break;
    case "nanoseconds":
      ms = Number(BigInt(intPart) / BigInt(1_000_000));
      break;
  }
  if (sign === "-") ms = -ms;
  if (!Number.isFinite(ms) || Math.abs(ms) > MAX_MS) {
    return { error: "Out of range for a JavaScript Date (about 270,000 years either side of 1970)." };
  }
  return { ms, unit };
}

function rfc2822(d: Date): string {
  return d.toUTCString().replace(/ GMT$/, " +0000");
}

function utcStamp(ms: number): string {
  return `${new Date(ms).toISOString().replace("T", " ").slice(0, 19)} UTC`;
}

function relativeTime(ms: number, nowMs: number): string {
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  const diff = Math.round((ms - nowMs) / 1000);
  const abs = Math.abs(diff);
  if (abs < 60) return rtf.format(diff, "second");
  if (abs < 3600) return rtf.format(Math.round(diff / 60), "minute");
  if (abs < 86_400) return rtf.format(Math.round(diff / 3600), "hour");
  if (abs < 86_400 * 30) return rtf.format(Math.round(diff / 86_400), "day");
  if (abs < 86_400 * 365) return rtf.format(Math.round(diff / (86_400 * 30.4375)), "month");
  return rtf.format(Math.round(diff / (86_400 * 365.25)), "year");
}

function dayOfYear(d: Date): { day: number; total: number } {
  const y = d.getUTCFullYear();
  const start = Date.UTC(y, 0, 1);
  const day = Math.floor((Date.UTC(y, d.getUTCMonth(), d.getUTCDate()) - start) / DAY_MS) + 1;
  const total = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? 366 : 365;
  return { day, total };
}

function isoWeek(d: Date): string {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const weekday = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - weekday);
  const yearStart = Date.UTC(t.getUTCFullYear(), 0, 1);
  const week = Math.ceil(((t.getTime() - yearStart) / DAY_MS + 1) / 7);
  return `${t.getUTCFullYear()}-W${pad(week)}`;
}

function toDatetimeLocalValue(d: Date, mode: TzMode): string {
  if (mode === "utc") {
    return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
  }
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

interface ResultRow {
  label: string;
  value: string;
}

function ResultRows({ rows }: { rows: ResultRow[] }) {
  return (
    <div className="mt-3 border-2 border-border">
      <Table>
        <TableBody className="font-mono text-[13px]">
          {rows.map((row) => (
            <TableRow key={row.label}>
              <TableCell className="label-mono w-44 whitespace-normal text-muted-foreground">{row.label}</TableCell>
              <TableCell className="whitespace-normal break-all tabular-nums">{row.value}</TableCell>
              <TableCell className="w-0 text-end">
                <CopyButton text={row.value} size="xs" variant="ghost" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

const REFERENCE: { seconds: number; note: string }[] = [
  { seconds: 0, note: "Unix epoch" },
  { seconds: 1_000_000_000, note: "One billion seconds" },
  { seconds: 1_234_567_890, note: "1234567890 day" },
  { seconds: 1_700_000_000, note: "1.7 billion seconds" },
  { seconds: 2_147_483_647, note: "Signed 32-bit maximum (year 2038 problem)" },
];

const DATETIME_INPUT =
  "h-9 w-full min-w-0 border-2 border-border bg-card px-3 font-mono text-sm outline-none transition-[box-shadow,border-color] focus-visible:border-primary focus-visible:shadow-hard-blue";

export default function UnixTimestampConverterTool() {
  const [now, setNow] = useState(0);
  const [timeZone, setTimeZone] = useState("");
  const [tsInput, setTsInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [tzMode, setTzMode] = useState<TzMode>("local");

  // The clock starts after mount so the server-rendered markup matches the client on hydration.
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = window.setTimeout(() => {
      tick();
      setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }, 0);
    const id = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);

  const nowSeconds = now ? String(Math.floor(now / 1000)) : "";
  const nowMillis = now ? String(now) : "";
  const nowIso = now ? new Date(now).toISOString() : "";

  const parsed = useMemo(() => parseTimestamp(tsInput), [tsInput]);

  const tsRows = useMemo<ResultRow[]>(() => {
    if (!parsed || parsed.error !== undefined) return [];
    const d = new Date(parsed.ms);
    const doy = dayOfYear(d);
    const local = new Intl.DateTimeFormat(undefined, { dateStyle: "full", timeStyle: "long" }).format(d);
    const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "UTC" }).format(d);
    return [
      { label: "UTC (ISO 8601)", value: d.toISOString() },
      { label: "RFC 2822", value: rfc2822(d) },
      { label: `Local (${timeZone || "browser time zone"})`, value: local },
      { label: "Relative", value: now ? relativeTime(parsed.ms, now) : "…" },
      { label: "Unix seconds", value: String(Math.floor(parsed.ms / 1000)) },
      { label: "Unix milliseconds", value: String(parsed.ms) },
      { label: "Day of week", value: weekday },
      { label: "Day of year", value: `${doy.day} of ${doy.total}` },
      { label: "ISO week", value: isoWeek(d) },
    ];
  }, [parsed, now, timeZone]);

  const fromDate = useMemo<DateResult | null>(() => {
    if (!dateInput) return null;
    const ms = tzMode === "utc" ? Date.parse(`${dateInput}Z`) : new Date(dateInput).getTime();
    if (Number.isNaN(ms)) return { error: "That date could not be parsed. Pick a full date and time." };
    return { ms };
  }, [dateInput, tzMode]);

  const dateRows = useMemo<ResultRow[]>(() => {
    if (!fromDate || fromDate.ms === undefined) return [];
    const d = new Date(fromDate.ms);
    return [
      { label: "Unix seconds", value: String(Math.floor(fromDate.ms / 1000)) },
      { label: "Unix milliseconds", value: String(fromDate.ms) },
      { label: "UTC (ISO 8601)", value: d.toISOString() },
      { label: "RFC 2822", value: rfc2822(d) },
    ];
  }, [fromDate]);

  const fillNow = () => setDateInput(toDatetimeLocalValue(new Date(), tzMode));

  const yearStart = now ? Math.floor(Date.UTC(new Date(now).getUTCFullYear(), 0, 1) / 1000) : null;

  return (
    <ToolPanel>
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <Stat
            label="Current Unix time (seconds)"
            value={nowSeconds || "…"}
            className="border-primary bg-primary text-primary-foreground [&_.label-mono]:text-primary-foreground/80"
          />
          <CopyButton text={nowSeconds} size="xs" variant="ghost" className="mt-1.5" label="Copy seconds" />
        </div>
        <div>
          <Stat label="Milliseconds" value={nowMillis || "…"} />
          <CopyButton text={nowMillis} size="xs" variant="ghost" className="mt-1.5" label="Copy milliseconds" />
        </div>
        <div>
          <Stat label="ISO 8601 (UTC)" value={nowIso || "…"} />
          <CopyButton text={nowIso} size="xs" variant="ghost" className="mt-1.5" label="Copy ISO" />
        </div>
      </div>

      <section className="mt-8">
        <p className="label-mono">Timestamp to date</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
          <div>
            <Label htmlFor="ts-in">Unix timestamp</Label>
            <TextInput
              id="ts-in"
              inputMode="decimal"
              autoComplete="off"
              value={tsInput}
              onChange={(e) => setTsInput(e.target.value)}
              placeholder="1700000000 or 1700000000123"
              aria-invalid={Boolean(parsed?.error) || undefined}
              aria-describedby={parsed?.error ? "ts-error" : undefined}
            />
          </div>
          <div className="sm:pt-[26px]">
            <Button onClick={() => setTsInput(String(Math.floor(Date.now() / 1000)))}>Now</Button>
          </div>
        </div>
        {parsed && parsed.error === undefined && (
          <Hint className="flex flex-wrap items-center gap-2">
            <span>Detected</span>
            <Chip>{UNIT_LABEL[parsed.unit]}</Chip>
            <span>from the digit count: up to 10 digits is seconds, 13 milliseconds, 16 microseconds, 19 nanoseconds.</span>
          </Hint>
        )}
        <ErrorText>{parsed?.error && <span id="ts-error">{parsed.error}</span>}</ErrorText>
        {tsRows.length > 0 && <ResultRows rows={tsRows} />}
      </section>

      <section className="mt-8">
        <p className="label-mono">Date to timestamp</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_11rem_auto]">
          <div>
            <Label htmlFor="date-in">Date and time</Label>
            <input
              id="date-in"
              type="datetime-local"
              step={1}
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className={DATETIME_INPUT}
              aria-invalid={Boolean(fromDate?.error) || undefined}
            />
          </div>
          <div>
            <Label htmlFor="date-tz">Interpret as</Label>
            <SelectField
              id="date-tz"
              value={tzMode}
              onChange={(v) => setTzMode(v as TzMode)}
              options={[
                { value: "local", label: timeZone ? `Local (${timeZone})` : "Local time" },
                { value: "utc", label: "UTC" },
              ]}
            />
          </div>
          <div className="sm:pt-[26px]">
            <Button onClick={fillNow}>Now</Button>
          </div>
        </div>
        <ErrorText>{fromDate?.error}</ErrorText>
        {dateRows.length > 0 && <ResultRows rows={dateRows} />}
      </section>

      <section className="mt-8">
        <p className="label-mono">Quick reference</p>
        <div className="mt-3 border-2 border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="label-mono">Timestamp</TableHead>
                <TableHead className="label-mono">Date (UTC)</TableHead>
                <TableHead className="label-mono">Note</TableHead>
                <TableHead className="w-0" />
              </TableRow>
            </TableHeader>
            <TableBody className="font-mono text-[13px] tabular-nums">
              {REFERENCE.map((row) => (
                <TableRow key={row.seconds}>
                  <TableCell>{row.seconds}</TableCell>
                  <TableCell>{utcStamp(row.seconds * 1000)}</TableCell>
                  <TableCell className="whitespace-normal text-muted-foreground">{row.note}</TableCell>
                  <TableCell className="text-end">
                    <Button size="xs" variant="ghost" onClick={() => setTsInput(String(row.seconds))}>
                      Load
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {yearStart !== null && (
                <TableRow>
                  <TableCell>{yearStart}</TableCell>
                  <TableCell>{utcStamp(yearStart * 1000)}</TableCell>
                  <TableCell className="whitespace-normal text-muted-foreground">Start of the current year</TableCell>
                  <TableCell className="text-end">
                    <Button size="xs" variant="ghost" onClick={() => setTsInput(String(yearStart))}>
                      Load
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </ToolPanel>
  );
}
