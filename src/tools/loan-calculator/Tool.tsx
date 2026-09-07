"use client";

import { useMemo, useState } from "react";
import { Button, Label, NumberInput, SelectField, Stat, ToolPanel } from "@/components/tools/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Row {
  period: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

function amortize(principal: number, annualRatePct: number, months: number): { payment: number; rows: Row[] } {
  if (principal <= 0 || months <= 0) return { payment: 0, rows: [] };
  const r = annualRatePct / 100 / 12;
  const payment = r === 0 ? principal / months : (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  const rows: Row[] = [];
  let balance = principal;
  for (let i = 1; i <= months; i++) {
    const interest = balance * r;
    const principalPaid = Math.min(payment - interest, balance);
    balance = Math.max(0, balance - principalPaid);
    rows.push({ period: i, payment, principal: principalPaid, interest, balance });
  }
  return { payment, rows };
}

const money = (n: number, currency: string) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 2 }).format(n);

const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "INR", "MAD"];

export default function LoanCalculatorTool() {
  const [amount, setAmount] = useState<number | "">(25000);
  const [rate, setRate] = useState<number | "">(6.5);
  const [years, setYears] = useState<number | "">(5);
  const [monthsExtra, setMonthsExtra] = useState<number | "">(0);
  const [currency, setCurrency] = useState("USD");
  const [showAll, setShowAll] = useState(false);

  const totalMonths = (Number(years) || 0) * 12 + (Number(monthsExtra) || 0);
  const { payment, rows } = useMemo(
    () => amortize(Number(amount) || 0, Number(rate) || 0, totalMonths),
    [amount, rate, totalMonths],
  );
  const totalPaid = payment * totalMonths;
  const totalInterest = totalPaid - (Number(amount) || 0);
  const visible = showAll ? rows : rows.slice(0, 12);
  const interestShare = totalPaid > 0 ? Math.max(0, totalInterest) / totalPaid : 0;

  return (
    <ToolPanel>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Label htmlFor="loan-amount">Loan amount</Label>
          <NumberInput id="loan-amount" value={amount} onChange={setAmount} min={0} step={100} prefix={currency} />
        </div>
        <div>
          <Label htmlFor="loan-rate">Rate (annual)</Label>
          <NumberInput id="loan-rate" value={rate} onChange={setRate} min={0} max={100} step={0.01} suffix="%" />
        </div>
        <div>
          <Label htmlFor="loan-years">Term (years)</Label>
          <NumberInput id="loan-years" value={years} onChange={setYears} min={0} max={50} step={1} suffix="yr" />
        </div>
        <div>
          <Label htmlFor="loan-months">Extra months</Label>
          <NumberInput id="loan-months" value={monthsExtra} onChange={setMonthsExtra} min={0} max={11} step={1} />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-sm">
        <Label htmlFor="loan-currency" className="mb-0 text-muted-foreground">
          Currency
        </Label>
        <SelectField id="loan-currency" size="sm" className="w-24" value={currency} onChange={setCurrency} options={CURRENCIES} />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Monthly payment" value={money(payment, currency)} className="border-primary bg-primary text-primary-foreground [&_.label-mono]:text-primary-foreground/80" />
        <Stat label="Total interest" value={money(Math.max(0, totalInterest), currency)} />
        <Stat label="Total paid" value={money(totalPaid, currency)} />
        <Stat label="Payments" value={totalMonths.toLocaleString()} />
      </div>

      {totalPaid > 0 && (
        <div className="mt-4">
          <div className="flex h-2 overflow-hidden rounded-full bg-muted" aria-hidden>
            <div className="bg-foreground" style={{ width: `${(1 - interestShare) * 100}%` }} />
            <div className="bg-brand" style={{ width: `${interestShare * 100}%` }} />
          </div>
          <div className="mt-1.5 flex justify-between font-mono text-[11px] text-muted-foreground">
            <span>principal {Math.round((1 - interestShare) * 100)}%</span>
            <span>interest {Math.round(interestShare * 100)}%</span>
          </div>
        </div>
      )}

      {rows.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <p className="label-mono">Amortization schedule</p>
            {rows.length > 12 && (
              <Button size="sm" onClick={() => setShowAll((s) => !s)}>
                {showAll ? "Show first year" : `Show all ${rows.length} months`}
              </Button>
            )}
          </div>
          <div className="mt-3 overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead className="label-mono">Month</TableHead>
                  <TableHead className="label-mono text-end">Payment</TableHead>
                  <TableHead className="label-mono text-end">Principal</TableHead>
                  <TableHead className="label-mono text-end">Interest</TableHead>
                  <TableHead className="label-mono text-end">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="font-mono text-[13px] tabular-nums">
                {visible.map((row) => (
                  <TableRow key={row.period}>
                    <TableCell className="text-muted-foreground">{row.period}</TableCell>
                    <TableCell className="text-end">{money(row.payment, currency)}</TableCell>
                    <TableCell className="text-end">{money(row.principal, currency)}</TableCell>
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
