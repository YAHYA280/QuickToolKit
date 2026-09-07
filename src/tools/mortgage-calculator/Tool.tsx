"use client";

import { useMemo, useState } from "react";
import {
  Button,
  CheckboxField,
  Hint,
  Label,
  NumberInput,
  Segmented,
  SelectField,
  Stat,
  ToolPanel,
} from "@/components/tools/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type DownMode = "percent" | "amount";

interface MonthRow {
  month: number;
  principal: number;
  interest: number;
  pmi: number;
  balance: number;
}

interface YearRow {
  year: number;
  principal: number;
  interest: number;
  pmi: number;
  balance: number;
}

const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "INR", "MAD"];
const TERMS = [
  { value: "30", label: "30 years" },
  { value: "20", label: "20 years" },
  { value: "15", label: "15 years" },
  { value: "10", label: "10 years" },
];
const DOWN_MODES: readonly { value: DownMode; label: string }[] = [
  { value: "percent", label: "%" },
  { value: "amount", label: "amount" },
];
const MAX_MONTHS = 1200;

/** M = P r (1+r)^n / ((1+r)^n - 1); P / n when the rate is zero. */
function monthlyPayment(principal: number, annualRatePct: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / months;
  const f = Math.pow(1 + r, months);
  return (principal * r * f) / (f - 1);
}

/** Month-by-month schedule. PMI is charged while the balance is above 80% of the home price. */
function amortize(
  loan: number,
  annualRatePct: number,
  months: number,
  extra: number,
  price: number,
  pmiRatePct: number,
): MonthRow[] {
  if (loan <= 0 || months <= 0) return [];
  const r = annualRatePct / 100 / 12;
  const pi = monthlyPayment(loan, annualRatePct, months);
  const pmiMonthly = pmiRatePct > 0 ? (loan * pmiRatePct) / 100 / 12 : 0;
  const rows: MonthRow[] = [];
  let balance = loan;
  let m = 0;
  while (balance > 0.005 && m < MAX_MONTHS) {
    m++;
    const interest = balance * r;
    const pmi = pmiMonthly > 0 && price > 0 && balance / price > 0.8 ? pmiMonthly : 0;
    const principal = Math.min(pi - interest + extra, balance);
    balance = Math.max(0, balance - principal);
    rows.push({ month: m, principal, interest, pmi, balance });
  }
  return rows;
}

function byYear(rows: MonthRow[]): YearRow[] {
  const years: YearRow[] = [];
  for (const row of rows) {
    const y = Math.ceil(row.month / 12);
    let cur = years[y - 1];
    if (!cur) {
      cur = { year: y, principal: 0, interest: 0, pmi: 0, balance: row.balance };
      years.push(cur);
    }
    cur.principal += row.principal;
    cur.interest += row.interest;
    cur.pmi += row.pmi;
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
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);
const fmtDuration = (months: number) => {
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y > 0 && m > 0) return `${y} yr ${m} mo`;
  if (y > 0) return `${y} yr`;
  return `${m} mo`;
};

export default function MortgageCalculatorTool() {
  const [price, setPrice] = useState<number | "">(400000);
  const [down, setDown] = useState<number | "">(20);
  const [downMode, setDownMode] = useState<DownMode>("percent");
  const [term, setTerm] = useState("30");
  const [rate, setRate] = useState<number | "">(6.5);
  const [tax, setTax] = useState<number | "">(4800);
  const [insurance, setInsurance] = useState<number | "">(1500);
  const [hoa, setHoa] = useState<number | "">(0);
  const [pmiEnabled, setPmiEnabled] = useState(true);
  const [pmiRate, setPmiRate] = useState<number | "">(0.5);
  const [extra, setExtra] = useState<number | "">(0);
  const [currency, setCurrency] = useState("USD");
  const [showMonthly, setShowMonthly] = useState(false);
  const [start] = useState(() => addMonths(new Date(), 0));

  const priceNum = Math.max(0, Number(price) || 0);
  const downRaw = Math.max(0, Number(down) || 0);
  const downAmount = Math.min(priceNum, downMode === "percent" ? (priceNum * downRaw) / 100 : downRaw);
  const downPct = priceNum > 0 ? (downAmount / priceNum) * 100 : 0;
  const loan = priceNum - downAmount;
  const months = (Number(term) || 30) * 12;
  const rateNum = Math.max(0, Number(rate) || 0);
  const extraNum = Math.max(0, Number(extra) || 0);
  const pmiApplies = pmiEnabled && loan > 0 && downPct < 20;
  const pmiRateNum = pmiApplies ? Math.max(0, Number(pmiRate) || 0) : 0;

  const switchDownMode = (mode: DownMode) => {
    if (mode === downMode) return;
    if (mode === "amount") setDown(Math.round((priceNum * downRaw) / 100));
    else setDown(priceNum > 0 ? Math.round((downRaw / priceNum) * 1000) / 10 : 0);
    setDownMode(mode);
  };

  const rows = useMemo(
    () => amortize(loan, rateNum, months, extraNum, priceNum, pmiRateNum),
    [loan, rateNum, months, extraNum, priceNum, pmiRateNum],
  );
  const years = useMemo(() => byYear(rows), [rows]);

  const pi = monthlyPayment(loan, rateNum, months);
  const taxM = Math.max(0, Number(tax) || 0) / 12;
  const insM = Math.max(0, Number(insurance) || 0) / 12;
  const hoaM = Math.max(0, Number(hoa) || 0);
  const pmiM = rows[0]?.pmi ?? 0;
  const others = taxM + insM + hoaM + pmiM;
  const totalMonthly = pi + others;

  const totalInterest = rows.reduce((s, r) => s + r.interest, 0);
  const baseInterest = loan > 0 ? pi * months - loan : 0;
  const interestSaved = extraNum > 0 ? Math.max(0, baseInterest - totalInterest) : 0;
  const payoffMonths = rows.length;
  const payoffDate = payoffMonths > 0 ? fmtMonth(addMonths(start, payoffMonths)) : "n/a";
  const pmiEnd = rows.reduce((last, r) => (r.pmi > 0 ? r.month : last), 0);
  const totalPmi = rows.reduce((s, r) => s + r.pmi, 0);

  const segments = [
    { key: "pi", label: "Principal & interest", value: pi, cls: "bg-foreground" },
    { key: "tax", label: "Property tax", value: taxM, cls: "bg-primary" },
    { key: "ins", label: "Home insurance", value: insM, cls: "bg-success" },
    { key: "hoa", label: "HOA", value: hoaM, cls: "bg-highlight" },
    { key: "pmi", label: "PMI", value: pmiM, cls: "bg-foreground/40" },
  ].filter((s) => s.value > 0);

  const monthlyRows = rows.slice(0, 12);

  return (
    <ToolPanel>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Label htmlFor="mtg-price">Home price</Label>
          <NumberInput id="mtg-price" value={price} onChange={setPrice} min={0} step={1000} prefix={currency} />
        </div>
        <div className="lg:col-span-2">
          <Label htmlFor="mtg-down">Down payment</Label>
          <div className="flex items-center gap-2">
            <NumberInput
              id="mtg-down"
              value={down}
              onChange={setDown}
              min={0}
              step={downMode === "percent" ? 0.5 : 1000}
              prefix={downMode === "amount" ? currency : undefined}
              suffix={downMode === "percent" ? "%" : undefined}
              className="flex-1"
            />
            <Segmented aria-label="Down payment mode" value={downMode} onChange={switchDownMode} options={DOWN_MODES} />
          </div>
          <Hint>
            {money(downAmount, currency, 0)} down ({downPct.toFixed(1)}%), loan amount {money(loan, currency, 0)}
          </Hint>
        </div>
        <div>
          <Label htmlFor="mtg-term">Loan term</Label>
          <SelectField id="mtg-term" value={term} onChange={setTerm} options={TERMS} />
        </div>
        <div>
          <Label htmlFor="mtg-rate">Interest rate</Label>
          <NumberInput id="mtg-rate" value={rate} onChange={setRate} min={0} max={100} step={0.01} suffix="%" />
        </div>
        <div>
          <Label htmlFor="mtg-tax">Property tax</Label>
          <NumberInput id="mtg-tax" value={tax} onChange={setTax} min={0} step={100} prefix={currency} suffix="/yr" />
        </div>
        <div>
          <Label htmlFor="mtg-ins">Home insurance</Label>
          <NumberInput id="mtg-ins" value={insurance} onChange={setInsurance} min={0} step={50} prefix={currency} suffix="/yr" />
        </div>
        <div>
          <Label htmlFor="mtg-hoa">HOA fees</Label>
          <NumberInput id="mtg-hoa" value={hoa} onChange={setHoa} min={0} step={10} prefix={currency} suffix="/mo" />
        </div>
        <div>
          <Label htmlFor="mtg-extra">Extra monthly payment</Label>
          <NumberInput id="mtg-extra" value={extra} onChange={setExtra} min={0} step={50} prefix={currency} suffix="/mo" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="mtg-pmi-rate">PMI</Label>
          <div className="flex flex-wrap items-center gap-3">
            <CheckboxField
              id="mtg-pmi"
              checked={pmiEnabled}
              onChange={setPmiEnabled}
              label="Add PMI when down payment is under 20%"
            />
            {pmiEnabled && (
              <NumberInput
                id="mtg-pmi-rate"
                value={pmiRate}
                onChange={setPmiRate}
                min={0}
                max={5}
                step={0.05}
                suffix="%/yr"
                className="w-32"
              />
            )}
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-sm">
        <Label htmlFor="mtg-currency" className="mb-0 text-muted-foreground">
          Currency
        </Label>
        <SelectField id="mtg-currency" size="sm" className="w-24" value={currency} onChange={setCurrency} options={CURRENCIES} />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
        <Stat
          label="Total monthly payment"
          value={money(totalMonthly, currency)}
          className="border-primary bg-primary text-primary-foreground [&_.label-mono]:text-primary-foreground/80"
        />
        <Stat label="Principal & interest" value={money(pi, currency)} />
        <Stat label="Tax, insurance, HOA & PMI" value={money(others, currency)} />
        <Stat label={extraNum > 0 ? "Payoff date (with extra)" : "Payoff date"} value={payoffDate} />
        <Stat label="Interest saved by extra" value={money(interestSaved, currency, 0)} />
        <Stat label="Total interest" value={money(totalInterest, currency, 0)} />
      </div>

      {extraNum > 0 && payoffMonths > 0 && (
        <Hint>
          Paying {money(extraNum, currency, 0)} extra each month clears the loan in {fmtDuration(payoffMonths)} instead of{" "}
          {term} years and saves {money(interestSaved, currency, 0)} in interest.
        </Hint>
      )}
      {pmiApplies && pmiM > 0 && (
        <Hint>
          PMI of {money(pmiM, currency)}/mo applies until the balance falls to 80% of the price, around month {pmiEnd} (
          {fmtMonth(addMonths(start, pmiEnd))}), {money(totalPmi, currency, 0)} in total.
        </Hint>
      )}
      {pmiEnabled && !pmiApplies && loan > 0 && (
        <Hint>No PMI: the down payment is {downPct.toFixed(1)}%, which is 20% or more.</Hint>
      )}

      {totalMonthly > 0 && (
        <div className="mt-4">
          <div className="flex h-3 overflow-hidden border-2 border-border bg-muted" aria-hidden>
            {segments.map((s) => (
              <div key={s.key} className={s.cls} style={{ width: `${(s.value / totalMonthly) * 100}%` }} />
            ))}
          </div>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-muted-foreground">
            {segments.map((s) => (
              <li key={s.key} className="flex items-center gap-1.5">
                <span className={`inline-block size-2.5 border border-border ${s.cls}`} aria-hidden />
                <span>
                  {s.label} {money(s.value, currency)} ({Math.round((s.value / totalMonthly) * 100)}%)
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {rows.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <p className="label-mono">{showMonthly ? "First 12 months" : "Amortization by year"}</p>
            <Button size="sm" onClick={() => setShowMonthly((s) => !s)}>
              {showMonthly ? "Show yearly" : "Show monthly"}
            </Button>
          </div>
          <div className="mt-3 overflow-x-auto border-2 border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead className="label-mono">{showMonthly ? "Month" : "Year"}</TableHead>
                  <TableHead className="label-mono text-end">Principal paid</TableHead>
                  <TableHead className="label-mono text-end">Interest paid</TableHead>
                  <TableHead className="label-mono text-end">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="font-mono text-[13px] tabular-nums">
                {showMonthly
                  ? monthlyRows.map((row) => (
                      <TableRow key={row.month}>
                        <TableCell className="text-muted-foreground">
                          {row.month} <span className="text-foreground">{fmtMonth(addMonths(start, row.month))}</span>
                        </TableCell>
                        <TableCell className="text-end">{money(row.principal, currency)}</TableCell>
                        <TableCell className="text-end text-brand-strong">{money(row.interest, currency)}</TableCell>
                        <TableCell className="text-end">{money(row.balance, currency)}</TableCell>
                      </TableRow>
                    ))
                  : years.map((row) => (
                      <TableRow key={row.year}>
                        <TableCell className="text-muted-foreground">{row.year}</TableCell>
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
