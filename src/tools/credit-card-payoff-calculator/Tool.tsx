"use client";

import { useMemo, useState } from "react";
import { ErrorText, Hint, Label, NumberInput, Segmented, SelectField, Stat, ToolPanel } from "@/components/tools/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Strategy = "fixed" | "target";

interface Result {
  payment: number;
  months: number;
  interest: number;
  paid: number;
  never: boolean;
}

const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "INR", "MAD"];
const STRATEGIES: readonly { value: Strategy; label: string }[] = [
  { value: "fixed", label: "Fixed monthly payment" },
  { value: "target", label: "Pay off in N months" },
];
const MAX_MONTHS = 1200;

/** Monthly compounding at APR / 12. The final payment is only what is left, so `paid` can be below payment x months. */
function simulate(balance: number, aprPct: number, payment: number): Result {
  const r = aprPct / 100 / 12;
  if (balance <= 0) return { payment, months: 0, interest: 0, paid: 0, never: false };
  if (payment <= 0 || payment <= balance * r) return { payment, months: 0, interest: 0, paid: 0, never: true };
  let bal = balance;
  let months = 0;
  let interest = 0;
  let paid = 0;
  while (bal > 0.005 && months < MAX_MONTHS) {
    months++;
    const i = bal * r;
    interest += i;
    const p = Math.min(payment, bal + i);
    paid += p;
    bal = bal + i - p;
  }
  return { payment, months, interest, paid, never: bal > 0.005 };
}

/** Payment that clears the balance in exactly n months: B r (1+r)^n / ((1+r)^n - 1). */
function requiredPayment(balance: number, aprPct: number, months: number): number {
  if (balance <= 0 || months <= 0) return 0;
  const r = aprPct / 100 / 12;
  if (r === 0) return balance / months;
  const f = Math.pow(1 + r, months);
  return (balance * r * f) / (f - 1);
}

const money = (n: number, currency: string, digits = 2) =>
  new Intl.NumberFormat(currency === "INR" ? "en-IN" : undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: digits,
  }).format(n);

const fmtMonth = (d: Date) => new Intl.DateTimeFormat(undefined, { month: "short", year: "numeric" }).format(d);
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);
const fmtMonths = (n: number) => {
  const y = Math.floor(n / 12);
  const m = n % 12;
  if (y === 0) return `${m} mo`;
  return m === 0 ? `${y} yr` : `${y} yr ${m} mo`;
};

export default function CreditCardPayoffCalculatorTool() {
  const [balance, setBalance] = useState<number | "">(5000);
  const [apr, setApr] = useState<number | "">(22.99);
  const [strategy, setStrategy] = useState<Strategy>("fixed");
  const [payment, setPayment] = useState<number | "">(200);
  const [targetMonths, setTargetMonths] = useState<number | "">(24);
  const [currency, setCurrency] = useState("USD");
  const [start] = useState(() => addMonths(new Date(), 0));

  const balanceNum = Math.max(0, Number(balance) || 0);
  const aprNum = Math.max(0, Number(apr) || 0);
  const monthlyInterest = (balanceNum * aprNum) / 100 / 12;
  const target = Math.min(MAX_MONTHS, Math.max(0, Math.round(Number(targetMonths) || 0)));

  const userPayment =
    strategy === "fixed" ? Math.max(0, Number(payment) || 0) : requiredPayment(balanceNum, aprNum, target);

  const result = useMemo(() => simulate(balanceNum, aprNum, userPayment), [balanceNum, aprNum, userPayment]);

  const scenarios = useMemo(() => {
    const minimum = Math.max(25, balanceNum * 0.02);
    return [
      { key: "min", label: "Minimum-style payment", note: "2% of balance, at least 25", result: simulate(balanceNum, aprNum, minimum) },
      { key: "you", label: "Your payment", note: strategy === "target" ? `clears in ${target} months` : "", result },
      { key: "plus", label: "Your payment + 50", note: "", result: simulate(balanceNum, aprNum, userPayment + 50) },
    ];
  }, [balanceNum, aprNum, userPayment, strategy, target, result]);

  const cannotClear = balanceNum > 0 && strategy === "fixed" && result.never;
  const error = cannotClear
    ? `A payment of ${money(userPayment, currency)} never clears the balance: interest alone is ${money(monthlyInterest, currency)} a month. Pay more than ${money(monthlyInterest, currency)}.`
    : strategy === "target" && balanceNum > 0 && target === 0
      ? "Enter the number of months you want to pay the balance off in."
      : "";

  const ok = balanceNum > 0 && !result.never && result.months > 0;
  const payoffDate = ok ? fmtMonth(addMonths(start, result.months)) : "n/a";
  const dash = "n/a";

  return (
    <ToolPanel>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Label htmlFor="cc-balance">Card balance</Label>
          <NumberInput id="cc-balance" value={balance} onChange={setBalance} min={0} step={100} prefix={currency} />
        </div>
        <div>
          <Label htmlFor="cc-apr">APR</Label>
          <NumberInput id="cc-apr" value={apr} onChange={setApr} min={0} max={100} step={0.01} suffix="%" />
          <Hint>Interest this month at this rate: {money(monthlyInterest, currency)}</Hint>
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor={strategy === "fixed" ? "cc-payment" : "cc-months"}>Strategy</Label>
          <div className="flex flex-wrap items-center gap-2">
            <Segmented aria-label="Payoff strategy" value={strategy} onChange={setStrategy} options={STRATEGIES} />
            {strategy === "fixed" ? (
              <NumberInput
                id="cc-payment"
                value={payment}
                onChange={setPayment}
                min={0}
                step={10}
                prefix={currency}
                suffix="/mo"
                className="w-40"
              />
            ) : (
              <NumberInput
                id="cc-months"
                value={targetMonths}
                onChange={setTargetMonths}
                min={1}
                max={MAX_MONTHS}
                step={1}
                suffix="months"
                className="w-40"
              />
            )}
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-sm">
        <Label htmlFor="cc-currency" className="mb-0 text-muted-foreground">
          Currency
        </Label>
        <SelectField id="cc-currency" size="sm" className="w-24" value={currency} onChange={setCurrency} options={CURRENCIES} />
      </div>
      <ErrorText>{error}</ErrorText>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {strategy === "fixed" ? (
          <Stat
            label="Months to payoff"
            value={ok ? `${result.months} (${fmtMonths(result.months)})` : dash}
            className="border-primary bg-primary text-primary-foreground [&_.label-mono]:text-primary-foreground/80"
          />
        ) : (
          <Stat
            label="Required monthly payment"
            value={ok ? money(userPayment, currency) : dash}
            className="border-primary bg-primary text-primary-foreground [&_.label-mono]:text-primary-foreground/80"
          />
        )}
        <Stat label="Total interest" value={ok ? money(result.interest, currency) : dash} />
        <Stat label="Total paid" value={ok ? money(result.paid, currency) : dash} />
        <Stat label={strategy === "fixed" ? "Payoff date" : `Payoff date (${result.months} months)`} value={payoffDate} />
      </div>
      {ok && strategy === "fixed" && (
        <Hint>
          Paying {money(userPayment, currency)} a month clears {money(balanceNum, currency)} in {fmtMonths(result.months)}; the
          last payment is smaller than the rest.
        </Hint>
      )}
      {ok && strategy === "target" && (
        <Hint>
          {money(userPayment, currency)} a month for {result.months} months costs {money(result.interest, currency)} in interest
          on top of the {money(balanceNum, currency)} balance.
        </Hint>
      )}

      {balanceNum > 0 && (
        <div className="mt-8">
          <p className="label-mono">Compare payments</p>
          <div className="mt-3 overflow-x-auto border-2 border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead className="label-mono">Scenario</TableHead>
                  <TableHead className="label-mono text-end">Monthly</TableHead>
                  <TableHead className="label-mono text-end">Months</TableHead>
                  <TableHead className="label-mono text-end">Total interest</TableHead>
                  <TableHead className="label-mono text-end">Total paid</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="font-mono text-[13px] tabular-nums">
                {scenarios.map((s) => (
                  <TableRow key={s.key} className={s.key === "you" ? "font-bold" : undefined}>
                    <TableCell>
                      {s.label}
                      {s.note && <span className="ms-2 font-normal text-muted-foreground">{s.note}</span>}
                    </TableCell>
                    <TableCell className="text-end">{money(s.result.payment, currency)}</TableCell>
                    <TableCell className="text-end">{s.result.never ? "Never" : s.result.months}</TableCell>
                    <TableCell className="text-end text-brand-strong">
                      {s.result.never ? dash : money(s.result.interest, currency)}
                    </TableCell>
                    <TableCell className="text-end">{s.result.never ? dash : money(s.result.paid, currency)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Hint>
            Real card minimums are recalculated on the shrinking balance each month, so they take even longer than the fixed
            minimum-style row shown here.
          </Hint>
        </div>
      )}
    </ToolPanel>
  );
}
