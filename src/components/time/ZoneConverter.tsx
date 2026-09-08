"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeftRightIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Chip, CopyButton, Hint, Label, Stat } from "@/components/tools/ui";
import { abbrAt, formatDiff, formatOffset, getZone, hourLabel, isDst, offsetMinutes } from "@/timezones/data";

interface Props {
  fromSlug: string;
  toSlug: string;
  reverseHref: string;
}

/** "YYYY-MM-DDTHH:MM" wall-clock string of an instant in a zone (for datetime-local). */
function wallClock(date: Date, tz: string): string {
  const f = new Intl.DateTimeFormat("en-CA", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
  const p = Object.fromEntries(f.formatToParts(date).map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}

/** Instant for a wall-clock string interpreted in a zone (handles DST by iterating once). */
function fromWallClock(value: string, tz: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!m) return null;
  const [, y, mo, d, h, mi] = m.map(Number);
  const guess = Date.UTC(y, mo - 1, d, h, mi);
  const off1 = offsetMinutes(tz, new Date(guess));
  const candidate = new Date(guess - off1 * 60000);
  const off2 = offsetMinutes(tz, candidate);
  return off1 === off2 ? candidate : new Date(guess - off2 * 60000);
}

function formatLong(date: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "short", month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(date);
}

export function ZoneConverter({ fromSlug, toSlug, reverseHref }: Props) {
  const from = getZone(fromSlug);
  const to = getZone(toSlug);
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    // default to "now" in the source zone after hydration
    const id = setTimeout(() => setInput((v) => v || wallClock(new Date(), from.iana)), 0);
    return () => clearTimeout(id);
  }, [from.iana]);

  const result = useMemo(() => {
    const instant = input ? fromWallClock(input, from.iana) : null;
    if (!instant) return null;
    const fromOff = offsetMinutes(from.iana, instant);
    const toOff = offsetMinutes(to.iana, instant);
    const diff = toOff - fromOff;
    const rows = Array.from({ length: 24 }, (_, h) => {
      const base = fromWallClock(`${input.slice(0, 10)}T${String(h).padStart(2, "0")}:00`, from.iana) ?? instant;
      return { h, at: base, toText: new Intl.DateTimeFormat("en-US", { timeZone: to.iana, hour: "numeric", minute: "2-digit", weekday: "short" }).format(base) };
    });
    return { instant, fromOff, toOff, diff, rows };
  }, [input, from.iana, to.iana]);

  const day = input ? input.slice(0, 10) : "";

  return (
    <div className="p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <div>
          <Label htmlFor="tz-from">
            Time in {from.abbr}
            {result && <span className="ms-2 font-mono text-[11px] font-normal text-muted-foreground">{abbrAt(from, result.instant)} · {formatOffset(result.fromOff)}</span>}
          </Label>
          <input
            id="tz-from"
            type="datetime-local"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="h-9 w-full border-2 border-border bg-card px-3 font-mono text-sm outline-none transition-[box-shadow,border-color] focus-visible:border-primary focus-visible:shadow-hard-blue"
          />
        </div>
        <Button asChild variant="outline" size="icon" aria-label={`Switch to ${to.abbr} to ${from.abbr}`} className="mx-auto">
          <Link href={reverseHref}>
            <ArrowLeftRightIcon />
          </Link>
        </Button>
        <Stat
          label={`Time in ${to.abbr}${result ? ` · ${abbrAt(to, result.instant)}` : ""}`}
          value={result ? formatLong(result.instant, to.iana) : "…"}
          mono={false}
          className="border-primary bg-primary text-primary-foreground [&_.label-mono]:text-primary-foreground/80"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setInput(wallClock(new Date(), from.iana))}>
          Now
        </Button>
        {result && <CopyButton size="sm" text={`${formatLong(result.instant, from.iana)} ${abbrAt(from, result.instant)} = ${formatLong(result.instant, to.iana)} ${abbrAt(to, result.instant)}`} label="Copy" />}
        <span className="flex-1" />
        {result && (
          <div className="flex flex-wrap gap-1.5">
            <Chip>
              {result.diff === 0 ? "same time" : `${to.abbr} ${result.diff > 0 ? "+" : "−"}${formatDiff(Math.abs(result.diff))}`}
            </Chip>
            {isDst(from, result.instant) && <Chip className="bg-highlight text-highlight-foreground">{from.abbr} on daylight time</Chip>}
            {isDst(to, result.instant) && <Chip className="bg-highlight text-highlight-foreground">{to.abbr} on daylight time</Chip>}
          </div>
        )}
      </div>

      {result && (
        <div className="mt-6">
          <p className="label-mono">Hour by hour on {day}</p>
          <Hint className="mt-1">Computed for the selected date, so daylight saving on either side is already included.</Hint>
          <div className="mt-3 overflow-x-auto border-2 border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead className="label-mono">{from.abbr}</TableHead>
                  <TableHead className="label-mono">{to.abbr}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="font-mono text-[13px] tabular-nums">
                {result.rows.map((r) => (
                  <TableRow key={r.h} className={r.h >= 9 && r.h < 17 ? "bg-highlight/30" : undefined}>
                    <TableCell>{hourLabel(r.h)}</TableCell>
                    <TableCell className="text-brand-strong">{r.toText}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Hint className="mt-2">Highlighted rows are 9 am to 5 pm in {from.abbr}.</Hint>
        </div>
      )}
    </div>
  );
}
