"use client";

import { useMemo, useState } from "react";
import { Button, Label, NumberInput, SelectField, Stat, ToolPanel } from "@/components/tools/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface YearRow {
  year: number;
  contributions: number;
  interest: number;
  balance: number;
}

const FREQUENCIES = [
  { label: "Daily (365/yr)", value: 365 },
  { label: "Monthly (12/yr)", value: 12 },
  { label: "Quarterly (4/yr)", value: 4 },
  { label: "Annually (1/yr)", value: 1 },
];

const FREQUENCY_OPTIONS = FREQUENCIES.map((f) => ({ value: String(f.value), label: f.label }));

const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "INR", "MAD"];

/**
 * Month-by-month projection. Contributions are monthly regardless of compounding frequency, so the
 * nominal annual rate is converted to an equivalent monthly rate: (1 + r/n)^(n/12) - 1.
 * Interest is credited first, then the contribution is added at the end of the month.
 */
function project(initial: number, monthly: number, annualRatePct: number, years: number, n: number): YearRow[] {
  const r = annualRatePct / 100;
  const monthlyRate = Math.pow(1 + r / n, n / 12) - 1;
  const rows: YearRow[] = [];
  let balance = initial;
  let contributions = initial;
  for (let year = 1; year <= years; year++) {
    for (let m = 0; m < 12; m++) {
      balance += balance * monthlyRate;
      balance += monthly;
      contributions += monthly;
    }
    rows.push({ year, contributions, interest: balance - contributions, balance });
  }
  return rows;
}

const money = (n: number, currency: string) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 2 }).format(n);

export default function CompoundInterestCalculatorTool() {
  const [initial, setInitial] = useState<number | "">(10000);
  const [monthly, setMonthly] = useState<number | "">(200);
  const [rate, setRate] = useState<number | "">(7);
  const [years, setYears] = useState<number | "">(20);
  const [frequency, setFrequency] = useState(12);
  const [currency, setCurrency] = useState("USD");
  const [showAll, setShowAll] = useState(false);

  const yearCount = Math.min(60, Math.max(0, Math.floor(Number(years) || 0)));
  const rows = useMemo(
    () => project(Number(initial) || 0, Number(monthly) || 0, Number(rate) || 0, yearCount, frequency),
    [initial, monthly, rate, yearCount, frequency],
  );

  const last = rows[rows.length - 1];
  const finalBalance = last ? last.balance : Number(initial) || 0;
  const totalContributions = last ? last.contributions : Number(initial) || 0;
  const totalInterest = Math.max(0, finalBalance - totalContributions);
  const apy = (Math.pow(1 + (Number(rate) || 0) / 100 / frequency, frequency) - 1) * 100;

  const contribPct = finalBalance > 0 ? Math.min(100, (totalContributions / finalBalance) * 100) : 100;
  const interestPct = 100 - contribPct;
  const visible = showAll ? rows : rows.slice(0, 10);

  return (
    <ToolPanel>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Label htmlFor="ci-initial">Initial deposit</Label>
          <NumberInput id="ci-initial" value={initial} onChange={setInitial} min={0} step={100} prefix={currency} />
        </div>
        <div>
          <Label htmlFor="ci-monthly">Monthly contribution</Label>
          <NumberInput id="ci-monthly" value={monthly} onChange={setMonthly} min={0} step={10} prefix={currency} />
        </div>
        <div>
          <Label htmlFor="ci-rate">Annual interest rate</Label>
          <NumberInput id="ci-rate" value={rate} onChange={setRate} min={0} max={100} step={0.01} suffix="%" />
        </div>
        <div>
          <Label htmlFor="ci-years">Years (1-60)</Label>
          <NumberInput id="ci-years" value={years} onChange={setYears} min={1} max={60} step={1} suffix="yr" />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Label htmlFor="ci-frequency" className="mb-0 text-muted-foreground">
            Compounding
          </Label>
          <SelectField
            id="ci-frequency"
            size="sm"
            className="w-40"
            value={String(frequency)}
            onChange={(v) => setFrequency(Number(v))}
            options={FREQUENCY_OPTIONS}
          />
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="ci-currency" className="mb-0 text-muted-foreground">
            Currency
          </Label>
          <SelectField id="ci-currency" size="sm" className="w-24" value={currency} onChange={setCurrency} options={CURRENCIES} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Final balance" value={money(finalBalance, currency)} className="border-brand/40 bg-brand/5" />
        <Stat label="Total contributions" value={money(totalContributions, currency)} />
        <Stat label="Interest earned" value={money(totalInterest, currency)} />
        <Stat label="Effective annual rate" value={`${apy.toFixed(2)}%`} />
      </div>

      <div className="mt-4">
        <div className="flex h-2 overflow-hidden rounded-full bg-muted" aria-hidden>
          <div className="bg-foreground transition-all" style={{ width: `${contribPct}%` }} />
          <div className="bg-brand transition-all" style={{ width: `${interestPct}%` }} />
        </div>
        <div className="mt-1.5 flex justify-between font-mono text-[11px] text-muted-foreground">
          <span>contributions {contribPct.toFixed(0)}%</span>
          <span>interest {interestPct.toFixed(0)}%</span>
        </div>
      </div>

      {rows.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <p className="label-mono">Year-by-year growth</p>
            {rows.length > 10 && (
              <Button size="sm" onClick={() => setShowAll((s) => !s)}>
                {showAll ? "Show first 10 years" : `Show all ${rows.length} years`}
              </Button>
            )}
          </div>
          <div className="mt-3 overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="label-mono">Year</TableHead>
                  <TableHead className="label-mono text-end">Contributions</TableHead>
                  <TableHead className="label-mono text-end">Interest</TableHead>
                  <TableHead className="label-mono text-end">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="font-mono text-[13px] tabular-nums">
                {visible.map((row) => (
                  <TableRow key={row.year}>
                    <TableCell className="text-muted-foreground">{row.year}</TableCell>
                    <TableCell className="text-end">{money(row.contributions, currency)}</TableCell>
                    <TableCell className="text-end text-brand-strong">{money(row.interest, currency)}</TableCell>
                    <TableCell className="text-end">{money(row.balance, currency)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </ToolPanel>
  );
}
