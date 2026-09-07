"use client";

import { useMemo, useState } from "react";
import { Button, Hint, Label, NumberInput, Segmented, SelectField, Stat, ToolPanel } from "@/components/tools/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type TenureUnit = "years" | "months";

interface MonthRow {
  index: number;
  date: Date;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

interface YearRow {
  year: number;
  from: Date;
  to: Date;
  principal: number;
  interest: number;
  paid: number;
  balance: number;
}

const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "INR", "MAD"];
const UNITS: readonly { value: TenureUnit; label: string }[] = [
  { value: "years", label: "Years" },
  { value: "months", label: "Months" },
];
const MAX_MONTHS = 600;

/** EMI = P x r x (1+r)^n / ((1+r)^n - 1); P / n when the rate is zero. */
function emiFor(principal: number, annualRatePct: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / months;
  const f = Math.pow(1 + r, months);
  return (principal * r * f) / (f - 1);
}

const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);
const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
const parseKey = (key: string) => {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1);
};

function schedule(principal: number, annualRatePct: number, months: number, start: Date): MonthRow[] {
  if (principal <= 0 || months <= 0) return [];
  const r = annualRatePct / 100 / 12;
  const emi = emiFor(principal, annualRatePct, months);
  const rows: MonthRow[] = [];
  let balance = principal;
  for (let i = 1; i <= months; i++) {
    const interest = balance * r;
    const paidPrincipal = Math.min(emi - interest, balance);
    balance = Math.max(0, balance - paidPrincipal);
    rows.push({ index: i, date: addMonths(start, i - 1), emi, principal: paidPrincipal, interest, balance });
  }
  return rows;
}

function byYear(rows: MonthRow[]): YearRow[] {
  const years: YearRow[] = [];
  for (const row of rows) {
    const y = Math.ceil(row.index / 12);
    let cur = years[y - 1];
    if (!cur) {
      cur = { year: y, from: row.date, to: row.date, principal: 0, interest: 0, paid: 0, balance: row.balance };
      years.push(cur);
    }
    cur.to = row.date;
    cur.principal += row.principal;
    cur.interest += row.interest;
    cur.paid += row.emi;
    cur.balance = row.balance;
  }
  return years;
}

const money = (n: number, currency: string, digits = 2) =>
  new Intl.NumberFormat(currency === "INR" ? "en-IN" : undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: digits,
  }).format(n);

const fmtMonth = (d: Date) => new Intl.DateTimeFormat(undefined, { month: "short", year: "numeric" }).format(d);

export default function EmiCalculatorTool() {
  const [amount, setAmount] = useState<number | "">(1000000);
  const [rate, setRate] = useState<number | "">(8.5);
  const [tenure, setTenure] = useState<number | "">(20);
  const [unit, setUnit] = useState<TenureUnit>("years");
  const [fee, setFee] = useState<number | "">(0);
  const [currency, setCurrency] = useState("INR");
  const [showMonthly, setShowMonthly] = useState(false);
  const [now] = useState(() => addMonths(new Date(), 0));
  const [startKey, setStartKey] = useState(() => monthKey(now));

  const startOptions = useMemo(
    () => Array.from({ length: 12 }, (_, i) => addMonths(now, i)).map((d) => ({ value: monthKey(d), label: fmtMonth(d) })),
    [now],
  );
  const start = useMemo(() => parseKey(startKey), [startKey]);

  const principal = Math.max(0, Number(amount) || 0);
  const rateNum = Math.max(0, Number(rate) || 0);
  const tenureNum = Math.max(0, Number(tenure) || 0);
  const months = Math.min(MAX_MONTHS, Math.round(unit === "years" ? tenureNum * 12 : tenureNum));
  const feePct = Math.max(0, Number(fee) || 0);

  const switchUnit = (next: TenureUnit) => {
    if (next === unit) return;
    if (next === "months") setTenure(Math.round(tenureNum * 12));
    else setTenure(Math.round((tenureNum / 12) * 10) / 10);
    setUnit(next);
  };

  const rows = useMemo(() => schedule(principal, rateNum, months, start), [principal, rateNum, months, start]);
  const years = useMemo(() => byYear(rows), [rows]);

  const emi = emiFor(principal, rateNum, months);
  const totalPayment = emi * months;
  const totalInterest = Math.max(0, totalPayment - principal);
  const interestShare = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;
  const feeAmount = (principal * feePct) / 100;
  const totalCost = totalPayment + feeAmount;
  const monthlyRows = rows.slice(0, 12);

  return (
    <ToolPanel>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Label htmlFor="emi-amount">Loan amount</Label>
          <NumberInput id="emi-amount" value={amount} onChange={setAmount} min={0} step={10000} prefix={currency} />
        </div>
        <div>
          <Label htmlFor="emi-rate">Interest rate (annual)</Label>
          <NumberInput id="emi-rate" value={rate} onChange={setRate} min={0} max={100} step={0.05} suffix="%" />
        </div>
        <div>
          <Label htmlFor="emi-tenure">Loan tenure</Label>
          <div className="flex items-center gap-2">
            <NumberInput
              id="emi-tenure"
              value={tenure}
              onChange={setTenure}
              min={0}
              max={unit === "years" ? 50 : MAX_MONTHS}
              step={1}
              className="flex-1"
            />
            <Segmented aria-label="Tenure unit" value={unit} onChange={switchUnit} options={UNITS} />
          </div>
        </div>
        <div>
          <Label htmlFor="emi-fee">Processing fee (optional)</Label>
          <NumberInput id="emi-fee" value={fee} onChange={setFee} min={0} max={100} step={0.05} suffix="%" />
          <Hint>Charged once on the loan amount; it adds to cost, not to the EMI.</Hint>
        </div>
        <div>
          <Label htmlFor="emi-start">First EMI month</Label>
          <SelectField id="emi-start" value={startKey} onChange={setStartKey} options={startOptions} />
        </div>
        <div>
          <Label htmlFor="emi-currency">Currency</Label>
          <SelectField id="emi-currency" value={currency} onChange={setCurrency} options={CURRENCIES} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat
          label="Monthly EMI"
          value={money(emi, currency)}
          className="border-primary bg-primary text-primary-foreground [&_.label-mono]:text-primary-foreground/80"
        />
        <Stat label="Total interest" value={money(totalInterest, currency, 0)} />
        <Stat label="Total payment" value={money(totalPayment, currency, 0)} />
        <Stat label="Interest as % of total" value={`${interestShare.toFixed(1)}%`} />
      </div>
      <Hint>
        {months.toLocaleString()} EMIs of {money(emi, currency)} from {fmtMonth(start)}
        {months > 0 ? ` to ${fmtMonth(addMonths(start, months - 1))}` : ""}.
        {feeAmount > 0
          ? ` Processing fee ${money(feeAmount, currency, 0)} (${feePct}%) makes the total cost ${money(totalCost, currency, 0)}.`
          : ""}
      </Hint>

      {totalPayment > 0 && (
        <div className="mt-4">
          <div className="flex h-3 overflow-hidden border-2 border-border bg-muted" aria-hidden>
            <div className="bg-foreground" style={{ width: `${100 - interestShare}%` }} />
            <div className="bg-primary" style={{ width: `${interestShare}%` }} />
          </div>
          <div className="mt-1.5 flex justify-between font-mono text-[11px] text-muted-foreground">
            <span>
              principal {money(principal, currency, 0)} ({Math.round(100 - interestShare)}%)
            </span>
            <span>
              interest {money(totalInterest, currency, 0)} ({Math.round(interestShare)}%)
            </span>
          </div>
        </div>
      )}

      {rows.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <p className="label-mono">{showMonthly ? "First 12 EMIs" : "Repayment schedule by year"}</p>
            <Button size="sm" onClick={() => setShowMonthly((s) => !s)}>
              {showMonthly ? "Show yearly" : "Show monthly"}
            </Button>
          </div>
          <div className="mt-3 overflow-x-auto border-2 border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead className="label-mono">{showMonthly ? "Month" : "Year"}</TableHead>
                  {!showMonthly && <TableHead className="label-mono">Period</TableHead>}
                  <TableHead className="label-mono text-end">{showMonthly ? "EMI" : "Total paid"}</TableHead>
                  <TableHead className="label-mono text-end">Principal</TableHead>
                  <TableHead className="label-mono text-end">Interest</TableHead>
                  <TableHead className="label-mono text-end">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="font-mono text-[13px] tabular-nums">
                {showMonthly
                  ? monthlyRows.map((row) => (
                      <TableRow key={row.index}>
                        <TableCell>
                          <span className="text-muted-foreground">{row.index}</span> {fmtMonth(row.date)}
                        </TableCell>
                        <TableCell className="text-end">{money(row.emi, currency)}</TableCell>
                        <TableCell className="text-end">{money(row.principal, currency)}</TableCell>
                        <TableCell className="text-end text-brand-strong">{money(row.interest, currency)}</TableCell>
                        <TableCell className="text-end">{money(row.balance, currency)}</TableCell>
                      </TableRow>
                    ))
                  : years.map((row) => (
                      <TableRow key={row.year}>
                        <TableCell className="text-muted-foreground">{row.year}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          {fmtMonth(row.from)} to {fmtMonth(row.to)}
                        </TableCell>
                        <TableCell className="text-end">{money(row.paid, currency, 0)}</TableCell>
                        <TableCell className="text-end">{money(row.principal, currency, 0)}</TableCell>
                        <TableCell className="text-end text-brand-strong">{money(row.interest, currency, 0)}</TableCell>
                        <TableCell className="text-end">{money(row.balance, currency, 0)}</TableCell>
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
