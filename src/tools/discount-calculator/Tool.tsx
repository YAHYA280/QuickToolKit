"use client";

import { useMemo, useState } from "react";
import { Hint, Label, NumberInput, Segmented, SelectField, Stat, ToolPanel } from "@/components/tools/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

type Mode = "percent" | "fixed" | "bxgy" | "find";

const MODES: { value: Mode; label: string }[] = [
  { value: "percent", label: "Percent off" },
  { value: "fixed", label: "Fixed amount off" },
  { value: "bxgy", label: "Buy X get Y" },
  { value: "find", label: "Find the discount" },
];

const QUICK_PCTS = [5, 10, 15, 20, 25, 30, 40, 50];
const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "INR", "MAD"];
const HIGHLIGHT = "border-primary bg-primary text-primary-foreground [&_.label-mono]:text-primary-foreground/80";
const DASH = "—";

const num = (v: number | "") => (v === "" || !Number.isFinite(v) ? 0 : Math.max(0, v));
const rate = (v: number | "") => Math.min(100, num(v)) / 100;

const money = (n: number, currency: string) =>
  Number.isFinite(n)
    ? new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 2 }).format(n)
    : DASH;

const percent = (n: number) =>
  Number.isFinite(n) ? `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(n)}%` : DASH;

interface Outcome {
  final: number;
  saved: number;
  effective: number;
  taxAdded: number;
  finalLabel: string;
  /** Buy X get Y only: price per item once the free ones are counted. */
  perItem?: number;
}

const FORMULA: Record<Mode, string> = {
  percent: "final = price x (1 - first %) x (1 - second %) x (1 + tax %). Stacked discounts multiply: 20% then 10% = 28% off.",
  fixed: "final = (price - amount off) x (1 + tax %)",
  bxgy: "effective % off = free / (buy + free) x 100 ; you pay = price x buy",
  find: "% off = (original - final) / original x 100",
};

export default function DiscountCalculatorTool() {
  const [mode, setMode] = useState<Mode>("percent");
  const [price, setPrice] = useState<number | "">(80);
  const [pct1, setPct1] = useState<number | "">(20);
  const [pct2, setPct2] = useState<number | "">("");
  const [tax, setTax] = useState<number | "">("");
  const [amountOff, setAmountOff] = useState<number | "">(15);
  const [buyQty, setBuyQty] = useState<number | "">(2);
  const [freeQty, setFreeQty] = useState<number | "">(1);
  const [finalPrice, setFinalPrice] = useState<number | "">(60);
  const [currency, setCurrency] = useState("USD");

  const out = useMemo<Outcome>(() => {
    const p = num(price);
    if (mode === "percent") {
      const discounted = p * (1 - rate(pct1)) * (1 - rate(pct2));
      const saved = p - discounted;
      const taxAdded = discounted * rate(tax);
      return { final: discounted + taxAdded, saved, effective: p > 0 ? (saved / p) * 100 : NaN, taxAdded, finalLabel: "Final price" };
    }
    if (mode === "fixed") {
      const discounted = Math.max(0, p - num(amountOff));
      const saved = p - discounted;
      const taxAdded = discounted * rate(tax);
      return { final: discounted + taxAdded, saved, effective: p > 0 ? (saved / p) * 100 : NaN, taxAdded, finalLabel: "Final price" };
    }
    if (mode === "bxgy") {
      const buy = Math.max(1, Math.floor(num(buyQty)) || 1);
      const free = Math.max(0, Math.floor(num(freeQty)));
      const items = buy + free;
      const pay = p * buy;
      return {
        final: pay,
        saved: p * free,
        effective: (free / items) * 100,
        taxAdded: 0,
        finalLabel: `You pay for ${items} items`,
        perItem: pay / items,
      };
    }
    const fin = num(finalPrice);
    const saved = p - fin;
    return { final: fin, saved, effective: p > 0 ? (saved / p) * 100 : NaN, taxAdded: 0, finalLabel: "Final price" };
  }, [mode, price, pct1, pct2, tax, amountOff, buyQty, freeQty, finalPrice]);

  const basePrice = num(price);
  const quick = useMemo(
    () =>
      QUICK_PCTS.map((pct) => {
        const saved = (basePrice * pct) / 100;
        return { pct, saved, final: basePrice - saved };
      }),
    [basePrice],
  );

  const highlightFinal = mode !== "find";

  return (
    <ToolPanel>
      <Segmented aria-label="Discount mode" className="flex-wrap" value={mode} onChange={setMode} options={MODES} />

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Label htmlFor="disc-price">{mode === "bxgy" ? "Price per item" : "Original price"}</Label>
          <NumberInput id="disc-price" value={price} onChange={setPrice} min={0} step={0.01} prefix={currency} />
        </div>

        {mode === "percent" && (
          <>
            <div>
              <Label htmlFor="disc-pct1">Discount</Label>
              <NumberInput id="disc-pct1" value={pct1} onChange={setPct1} min={0} max={100} step={0.01} suffix="% off" />
            </div>
            <div>
              <Label htmlFor="disc-pct2">Second discount</Label>
              <NumberInput id="disc-pct2" value={pct2} onChange={setPct2} min={0} max={100} step={0.01} suffix="% off" />
              <Hint>Optional, applied after the first</Hint>
            </div>
            <div>
              <Label htmlFor="disc-tax">Sales tax</Label>
              <NumberInput id="disc-tax" value={tax} onChange={setTax} min={0} max={100} step={0.01} suffix="%" />
              <Hint>Optional, added to the discounted price</Hint>
            </div>
          </>
        )}

        {mode === "fixed" && (
          <>
            <div>
              <Label htmlFor="disc-amount">Amount off</Label>
              <NumberInput id="disc-amount" value={amountOff} onChange={setAmountOff} min={0} step={0.01} prefix={currency} />
            </div>
            <div>
              <Label htmlFor="disc-tax">Sales tax</Label>
              <NumberInput id="disc-tax" value={tax} onChange={setTax} min={0} max={100} step={0.01} suffix="%" />
              <Hint>Optional, added to the discounted price</Hint>
            </div>
          </>
        )}

        {mode === "bxgy" && (
          <>
            <div>
              <Label htmlFor="disc-buy">Buy quantity</Label>
              <NumberInput id="disc-buy" value={buyQty} onChange={setBuyQty} min={1} max={1000} step={1} suffix="items" />
            </div>
            <div>
              <Label htmlFor="disc-free">Free quantity</Label>
              <NumberInput id="disc-free" value={freeQty} onChange={setFreeQty} min={0} max={1000} step={1} suffix="items" />
              <Hint>Buy 2 get 1 free = 33.33% off</Hint>
            </div>
          </>
        )}

        {mode === "find" && (
          <div>
            <Label htmlFor="disc-final">Final price</Label>
            <NumberInput id="disc-final" value={finalPrice} onChange={setFinalPrice} min={0} step={0.01} prefix={currency} />
            <Hint>The price you were charged</Hint>
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center gap-2 text-sm">
        <Label htmlFor="disc-currency" className="mb-0 text-muted-foreground">
          Currency
        </Label>
        <SelectField id="disc-currency" size="sm" className="w-24" value={currency} onChange={setCurrency} options={CURRENCIES} />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label={out.finalLabel} value={money(out.final, currency)} className={cn(highlightFinal && HIGHLIGHT)} />
        <Stat label="You save" value={money(out.saved, currency)} />
        <Stat label="Effective discount" value={percent(out.effective)} className={cn(!highlightFinal && HIGHLIGHT)} />
        {mode === "bxgy" ? (
          <Stat label="Per item" value={money(out.perItem ?? NaN, currency)} />
        ) : (
          <Stat label="Tax added" value={money(out.taxAdded, currency)} />
        )}
      </div>
      <Hint>{FORMULA[mode]}</Hint>

      <div className="mt-8">
        <p className="label-mono">Quick reference for {money(basePrice, currency)}</p>
        <div className="mt-3 overflow-x-auto border-2 border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="label-mono">Discount</TableHead>
                <TableHead className="label-mono text-end">You save</TableHead>
                <TableHead className="label-mono text-end">Final price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="font-mono text-[13px] tabular-nums">
              {quick.map((row) => {
                const active = Number.isFinite(out.effective) && Math.abs(out.effective - row.pct) < 0.005;
                return (
                  <TableRow key={row.pct}>
                    <TableCell className={cn(active && "font-bold text-brand-strong")}>{row.pct}% off</TableCell>
                    <TableCell className="text-end">{money(row.saved, currency)}</TableCell>
                    <TableCell className={cn("text-end", active && "font-bold text-brand-strong")}>
                      {money(row.final, currency)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <Hint>Prices before tax</Hint>
      </div>
    </ToolPanel>
  );
}
