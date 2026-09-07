"use client";

import { useMemo, useState } from "react";
import { Hint, Label, NumberInput, Segmented, SelectField, Stat, ToolPanel } from "@/components/tools/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

type Mode = "annual" | "hourly" | "monthly";

const MODES: { value: Mode; label: string }[] = [
  { value: "annual", label: "Annual salary" },
  { value: "hourly", label: "Hourly rate" },
  { value: "monthly", label: "Monthly pay" },
];

const DEFAULT_AMOUNT: Record<Mode, number> = { annual: 60000, hourly: 30, monthly: 5000 };
const AMOUNT_SUFFIX: Record<Mode, string> = { annual: "/yr", hourly: "/hr", monthly: "/mo" };
const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "INR", "MAD"];
const HIGHLIGHT = "border-primary bg-primary text-primary-foreground [&_.label-mono]:text-primary-foreground/80";
const DASH = "—";

const num = (v: number | "") => (v === "" || !Number.isFinite(v) ? 0 : Math.max(0, v));

const money = (n: number, currency: string) =>
  Number.isFinite(n)
    ? new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 2 }).format(n)
    : DASH;

const plain = (n: number) =>
  Number.isFinite(n) ? new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(n) : DASH;

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

export default function SalaryToHourlyCalculatorTool() {
  const [mode, setMode] = useState<Mode>("annual");
  const [amount, setAmount] = useState<number | "">(DEFAULT_AMOUNT.annual);
  const [hoursPerWeek, setHoursPerWeek] = useState<number | "">(40);
  const [weeksPerYear, setWeeksPerYear] = useState<number | "">(52);
  const [ptoDays, setPtoDays] = useState<number | "">(0);
  const [raisePct, setRaisePct] = useState<number | "">(5);
  const [currency, setCurrency] = useState("USD");

  const switchMode = (next: Mode) => {
    setMode(next);
    setAmount(DEFAULT_AMOUNT[next]);
  };

  const r = useMemo(() => {
    const value = num(amount);
    const hpw = num(hoursPerWeek);
    const wpy = num(weeksPerYear);
    const hoursPerDay = hpw / 5;
    const paidHours = hpw * wpy;
    const workedHours = Math.max(0, paidHours - num(ptoDays) * hoursPerDay);
    const annual = mode === "annual" ? value : mode === "monthly" ? value * 12 : value * paidHours;
    const hourly = mode === "hourly" ? value : paidHours > 0 ? annual / paidHours : NaN;
    const weekly = wpy > 0 ? annual / wpy : NaN;
    return {
      hpw,
      hoursPerDay,
      paidHours,
      workedHours,
      annual,
      hourly,
      effectiveHourly: workedHours > 0 ? annual / workedHours : NaN,
      daily: hourly * hoursPerDay,
      weekly,
      biweekly: weekly * 2,
      semiMonthly: annual / 24,
      monthly: annual / 12,
    };
  }, [mode, amount, hoursPerWeek, weeksPerYear, ptoDays]);

  const primaryIsHourly = mode !== "hourly";
  const primaryKey = primaryIsHourly ? "hourly" : "annual";
  const raiseFactor = 1 + num(raisePct) / 100;
  const raisedHourly = r.hourly * raiseFactor;
  const raisedAnnual = r.annual * raiseFactor;

  const rows = [
    { key: "hourly", label: "Hourly", value: r.hourly, note: "per hour" },
    { key: "daily", label: "Daily", value: r.daily, note: `${plain(r.hoursPerDay)} h/day` },
    { key: "weekly", label: "Weekly", value: r.weekly, note: `${plain(r.hpw)} h/week` },
    { key: "biweekly", label: "Biweekly", value: r.biweekly, note: "every 2 weeks" },
    { key: "semi", label: "Semi-monthly", value: r.semiMonthly, note: "24 pay periods" },
    { key: "monthly", label: "Monthly", value: r.monthly, note: "12 pay periods" },
    { key: "annual", label: "Annual", value: r.annual, note: `${plain(r.paidHours)} paid hours` },
  ];

  return (
    <ToolPanel>
      <div className="flex flex-wrap items-center gap-3">
        <Label className="mb-0">I know my</Label>
        <Segmented aria-label="Known amount" value={mode} onChange={switchMode} options={MODES} />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Label htmlFor="sth-amount">{MODES.find((m) => m.value === mode)?.label}</Label>
          <NumberInput
            id="sth-amount"
            value={amount}
            onChange={setAmount}
            min={0}
            step={mode === "hourly" ? 0.5 : 100}
            prefix={currency}
            suffix={AMOUNT_SUFFIX[mode]}
          />
        </div>
        <div>
          <Label htmlFor="sth-hours">Hours per week</Label>
          <NumberInput id="sth-hours" value={hoursPerWeek} onChange={setHoursPerWeek} min={0} max={168} step={0.5} suffix="h" />
          <Hint>Daily rate uses hours per week / 5</Hint>
        </div>
        <div>
          <Label htmlFor="sth-weeks">Weeks per year</Label>
          <NumberInput id="sth-weeks" value={weeksPerYear} onChange={setWeeksPerYear} min={0} max={52} step={1} suffix="wk" />
          <Hint>Use fewer than 52 if some weeks are unpaid</Hint>
        </div>
        <div>
          <Label htmlFor="sth-pto">Paid time off</Label>
          <NumberInput id="sth-pto" value={ptoDays} onChange={setPtoDays} min={0} max={365} step={1} suffix="days" />
          <Hint>Paid days off reduce hours worked, not pay</Hint>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-sm">
        <Label htmlFor="sth-currency" className="mb-0 text-muted-foreground">
          Currency
        </Label>
        <SelectField id="sth-currency" size="sm" className="w-24" value={currency} onChange={setCurrency} options={CURRENCIES} />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat
          label={primaryIsHourly ? "Hourly rate" : "Annual salary"}
          value={money(primaryIsHourly ? r.hourly : r.annual, currency)}
          className={HIGHLIGHT}
        />
        <Stat
          label={mode === "monthly" ? "Annual salary" : "Monthly pay"}
          value={money(mode === "monthly" ? r.annual : r.monthly, currency)}
        />
        <Stat label="Hours worked / year" value={plain(r.workedHours)} />
        <Stat label="Per hour worked" value={money(r.effectiveHourly, currency)} />
      </div>
      <Hint>
        annual = hourly x hours/week x weeks/year. Per hour worked = annual / (paid hours - PTO days x hours/day).
      </Hint>

      <div className="mt-8">
        <p className="label-mono">Pay period equivalents</p>
        <div className="mt-3 overflow-x-auto border-2 border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="label-mono">Period</TableHead>
                <TableHead className="label-mono text-end">Amount</TableHead>
                <TableHead className="label-mono text-end">Basis</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="font-mono text-[13px] tabular-nums">
              {rows.map((row) => {
                const primary = row.key === primaryKey;
                return (
                  <TableRow key={row.key}>
                    <TableCell className={cn(primary && "font-bold")}>{row.label}</TableCell>
                    <TableCell className={cn("text-end", primary && "font-bold text-brand-strong")}>
                      {money(row.value, currency)}
                    </TableCell>
                    <TableCell className="text-end text-muted-foreground">{row.note}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <section className="mt-8 brut-flat p-4">
        <h3 className="label-mono">After a raise</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div>
            <Label htmlFor="sth-raise">Raise</Label>
            <NumberInput id="sth-raise" value={raisePct} onChange={setRaisePct} min={0} max={1000} step={0.1} suffix="%" />
          </div>
          <Result
            label="New hourly"
            value={money(raisedHourly, currency)}
            note={Number.isFinite(raisedHourly) ? `+${money(raisedHourly - r.hourly, currency)} per hour` : undefined}
          />
          <Result
            label="New annual"
            value={money(raisedAnnual, currency)}
            note={Number.isFinite(raisedAnnual) ? `+${money(raisedAnnual - r.annual, currency)} per year` : undefined}
          />
        </div>
      </section>
    </ToolPanel>
  );
}
