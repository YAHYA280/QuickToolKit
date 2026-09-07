"use client";

import { useMemo, useState } from "react";
import {
  Button,
  CheckboxField,
  Chip,
  Hint,
  Label,
  NumberInput,
  SelectField,
  SliderField,
  Stat,
  ToolPanel,
} from "@/components/tools/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const QUICK_TIPS = [10, 15, 18, 20, 25];
const COMPARE_TIPS = [15, 18, 20, 22, 25];
const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "INR", "MAD"];
const HIGHLIGHT = "border-primary bg-primary text-primary-foreground [&_.label-mono]:text-primary-foreground/80";

const num = (v: number | "") => (v === "" || !Number.isFinite(v) ? 0 : Math.max(0, v));

const money = (n: number, currency: string) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 2 }).format(n);

interface TipResult {
  base: number;
  tip: number;
  total: number;
  perPerson: number;
  tipPerPerson: number;
}

/** `taxPct` is null when tipping on the full bill; otherwise the bill is treated as tax-inclusive. */
function computeTip(bill: number, pct: number, people: number, roundUp: boolean, taxPct: number | null): TipResult {
  const base = taxPct !== null && taxPct > 0 ? bill / (1 + taxPct / 100) : bill;
  let tip = (base * pct) / 100;
  let total = bill + tip;
  if (roundUp) {
    total = Math.ceil(Math.round(total * 100) / 100);
    tip = total - bill;
  }
  return { base, tip, total, perPerson: total / people, tipPerPerson: tip / people };
}

export default function TipCalculatorTool() {
  const [bill, setBill] = useState<number | "">(64);
  const [tipPct, setTipPct] = useState(18);
  const [people, setPeople] = useState<number | "">(2);
  const [roundUp, setRoundUp] = useState(false);
  const [preTax, setPreTax] = useState(false);
  const [taxPct, setTaxPct] = useState<number | "">(8);
  const [currency, setCurrency] = useState("USD");

  const billValue = num(bill);
  const peopleValue = Math.max(1, Math.floor(num(people)) || 1);
  const taxValue = preTax ? Math.min(100, num(taxPct)) : null;

  const result = useMemo(
    () => computeTip(billValue, tipPct, peopleValue, roundUp, taxValue),
    [billValue, tipPct, peopleValue, roundUp, taxValue],
  );
  const compare = useMemo(
    () => COMPARE_TIPS.map((pct) => ({ pct, ...computeTip(billValue, pct, peopleValue, roundUp, taxValue) })),
    [billValue, peopleValue, roundUp, taxValue],
  );

  return (
    <ToolPanel>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="tip-bill">Bill amount</Label>
          <NumberInput id="tip-bill" value={bill} onChange={setBill} min={0} step={0.01} prefix={currency} />
        </div>
        <div>
          <Label htmlFor="tip-people">Split between</Label>
          <NumberInput id="tip-people" value={people} onChange={setPeople} min={1} max={100} step={1} suffix="people" />
        </div>
        <div>
          <Label htmlFor="tip-currency">Currency</Label>
          <SelectField id="tip-currency" value={currency} onChange={setCurrency} options={CURRENCIES} />
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <Label className="mb-0">Tip</Label>
          <Chip>{tipPct}%</Chip>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {QUICK_TIPS.map((q) => (
            <Button
              key={q}
              size="sm"
              variant={tipPct === q ? "primary" : "secondary"}
              aria-pressed={tipPct === q}
              onClick={() => setTipPct(q)}
            >
              {q}%
            </Button>
          ))}
        </div>
        <SliderField className="mt-4" value={tipPct} onChange={setTipPct} min={0} max={30} step={1} aria-label="Tip percentage" />
        <div className="mt-1.5 flex justify-between font-mono text-[11px] text-muted-foreground">
          <span>0%</span>
          <span>30%</span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <CheckboxField id="tip-round" checked={roundUp} onChange={setRoundUp} label="Round total up to whole currency unit" />
        <div>
          <CheckboxField id="tip-pretax" checked={preTax} onChange={setPreTax} label="Tip on pre-tax amount" />
          {preTax && (
            <div className="mt-2 max-w-52">
              <Label htmlFor="tip-tax">Sales tax rate</Label>
              <NumberInput id="tip-tax" value={taxPct} onChange={setTaxPct} min={0} max={100} step={0.01} suffix="%" />
              <Hint>Bill includes tax; tip base = bill / (1 + tax rate)</Hint>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Tip amount" value={money(result.tip, currency)} />
        <Stat label="Total" value={money(result.total, currency)} />
        <Stat label={`Per person (${peopleValue})`} value={money(result.perPerson, currency)} className={HIGHLIGHT} />
        <Stat label="Tip per person" value={money(result.tipPerPerson, currency)} />
      </div>
      <Hint>
        tip = {preTax ? "pre-tax amount" : "bill"} x {tipPct}% ; total = bill + tip ; per person = total / {peopleValue}
        {preTax && ` ; pre-tax amount = ${money(result.base, currency)}`}
      </Hint>

      <div className="mt-8">
        <p className="label-mono">Compare percentages</p>
        <div className="mt-3 overflow-x-auto border-2 border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="label-mono">Tip</TableHead>
                <TableHead className="label-mono text-end">Tip amount</TableHead>
                <TableHead className="label-mono text-end">Total</TableHead>
                <TableHead className="label-mono text-end">Per person</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="font-mono text-[13px] tabular-nums">
              {compare.map((row) => {
                const active = row.pct === tipPct;
                return (
                  <TableRow key={row.pct}>
                    <TableCell className={cn(active && "font-bold text-brand-strong")}>{row.pct}%</TableCell>
                    <TableCell className="text-end">{money(row.tip, currency)}</TableCell>
                    <TableCell className="text-end">{money(row.total, currency)}</TableCell>
                    <TableCell className={cn("text-end", active && "font-bold text-brand-strong")}>
                      {money(row.perPerson, currency)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </ToolPanel>
  );
}
