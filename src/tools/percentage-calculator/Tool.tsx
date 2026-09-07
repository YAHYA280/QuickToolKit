"use client";

import { useState, type ReactNode } from "react";
import { Hint, Label, NumberInput, Segmented, ToolPanel } from "@/components/tools/ui";

const formatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 4 });

/** Up to 4 decimals, trailing zeros trimmed; a dash for empty inputs or division by zero. */
const show = (v: number | null) => (v === null || !Number.isFinite(v) ? "—" : formatter.format(v));

const num = (v: number | "") => (v === "" || !Number.isFinite(v) ? null : v);

type Op = "plus" | "minus";

const OPERATIONS: { value: Op; label: string }[] = [
  { value: "plus", label: "plus" },
  { value: "minus", label: "minus" },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <h3 className="label-mono">{title}</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">{children}</div>
    </section>
  );
}

function Result({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="min-w-0 self-end">
      <p className="label-mono truncate">{label}</p>
      <p className="mt-1.5 truncate font-mono text-lg tabular-nums">
        <span className="text-brand-strong">{value}</span>
      </p>
      {note && <Hint>{note}</Hint>}
    </div>
  );
}

export default function PercentageCalculatorTool() {
  // (a) What is X% of Y
  const [aPct, setAPct] = useState<number | "">(20);
  const [aBase, setABase] = useState<number | "">(150);
  // (b) X is what percent of Y
  const [bPart, setBPart] = useState<number | "">(30);
  const [bWhole, setBWhole] = useState<number | "">(150);
  // (c) Percentage change from X to Y
  const [cFrom, setCFrom] = useState<number | "">(100);
  const [cTo, setCTo] = useState<number | "">(125);
  // (d) Y plus/minus X%
  const [dBase, setDBase] = useState<number | "">(100);
  const [dOp, setDOp] = useState<Op>("plus");
  const [dPct, setDPct] = useState<number | "">(15);

  const a = num(aPct) !== null && num(aBase) !== null ? (Number(aPct) / 100) * Number(aBase) : null;

  const b = num(bPart) !== null && num(bWhole) !== null && Number(bWhole) !== 0 ? (Number(bPart) / Number(bWhole)) * 100 : null;

  const c = num(cFrom) !== null && num(cTo) !== null && Number(cFrom) !== 0 ? ((Number(cTo) - Number(cFrom)) / Math.abs(Number(cFrom))) * 100 : null;
  const cLabel = c === null ? "" : c > 0 ? "increase" : c < 0 ? "decrease" : "no change";
  const cText = c === null ? "—" : `${c > 0 ? "+" : ""}${show(c)}%`;

  const dAmount = num(dBase) !== null && num(dPct) !== null ? (Number(dBase) * Number(dPct)) / 100 : null;
  const d = dAmount === null ? null : dOp === "plus" ? Number(dBase) + dAmount : Number(dBase) - dAmount;

  return (
    <ToolPanel className="space-y-4">
      <Section title="What is X% of Y?">
        <div>
          <Label htmlFor="pc-a-pct">X (percent)</Label>
          <NumberInput id="pc-a-pct" value={aPct} onChange={setAPct} step={0.01} suffix="%" />
        </div>
        <div>
          <Label htmlFor="pc-a-base">Y (number)</Label>
          <NumberInput id="pc-a-base" value={aBase} onChange={setABase} step={0.01} />
        </div>
        <Result label={`${show(num(aPct))}% of ${show(num(aBase))}`} value={show(a)} />
      </Section>

      <Section title="X is what percent of Y?">
        <div>
          <Label htmlFor="pc-b-part">X (part)</Label>
          <NumberInput id="pc-b-part" value={bPart} onChange={setBPart} step={0.01} />
        </div>
        <div>
          <Label htmlFor="pc-b-whole">Y (whole)</Label>
          <NumberInput id="pc-b-whole" value={bWhole} onChange={setBWhole} step={0.01} />
        </div>
        <Result label="Result" value={b === null ? "—" : `${show(b)}%`} note={num(bWhole) === 0 ? "Cannot divide by zero" : undefined} />
      </Section>

      <Section title="Percentage change from X to Y">
        <div>
          <Label htmlFor="pc-c-from">X (old value)</Label>
          <NumberInput id="pc-c-from" value={cFrom} onChange={setCFrom} step={0.01} />
        </div>
        <div>
          <Label htmlFor="pc-c-to">Y (new value)</Label>
          <NumberInput id="pc-c-to" value={cTo} onChange={setCTo} step={0.01} />
        </div>
        <Result label="Change" value={cText} note={num(cFrom) === 0 ? "Cannot divide by zero" : cLabel || undefined} />
      </Section>

      <Section title="Add or subtract a percentage (tax, tip, discount)">
        <div>
          <Label htmlFor="pc-d-base">Y (number)</Label>
          <NumberInput id="pc-d-base" value={dBase} onChange={setDBase} step={0.01} />
        </div>
        <div>
          <Label htmlFor="pc-d-pct">X (percent)</Label>
          <div className="flex items-center gap-2">
            <Segmented aria-label="Plus or minus" className="h-9 shrink-0" value={dOp} onChange={setDOp} options={OPERATIONS} />
            <div className="flex-1">
              <NumberInput id="pc-d-pct" value={dPct} onChange={setDPct} step={0.01} suffix="%" />
            </div>
          </div>
        </div>
        <Result
          label={`${show(num(dBase))} ${dOp === "plus" ? "+" : "−"} ${show(num(dPct))}%`}
          value={show(d)}
          note={dAmount === null ? undefined : `${dOp === "plus" ? "Added" : "Subtracted"} ${show(Math.abs(dAmount))}`}
        />
      </Section>
    </ToolPanel>
  );
}
