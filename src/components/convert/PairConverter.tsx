"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRightIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { CopyButton, Hint, Label, NumberInput, SelectField, Stat } from "@/components/tools/ui";
import { convert, formatNumber, getUnit } from "@/convert/data";

interface Props {
  fromId: string;
  toId: string;
  reverseHref: string;
  initial?: number;
}

const PRECISION = ["2", "3", "4", "6"] as const;

export function PairConverter({ fromId, toId, reverseHref, initial = 1 }: Props) {
  const from = getUnit(fromId);
  const to = getUnit(toId);
  const [value, setValue] = useState<number | "">(initial);
  const [precision, setPrecision] = useState<(typeof PRECISION)[number]>("4");

  const result = useMemo(() => {
    const v = value === "" ? NaN : value;
    if (!Number.isFinite(v)) return null;
    return convert(v, from, to);
  }, [value, from, to]);

  const display = result === null ? "–" : formatNumber(result, Number(precision) + 2);
  const fixed = result === null ? "" : result.toFixed(Number(precision));

  return (
    <div className="p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <div>
          <Label htmlFor="pair-from">{from.plural}</Label>
          <NumberInput id="pair-from" value={value} onChange={setValue} step={from.category === "data" ? 1 : 0.1} suffix={from.symbol} />
        </div>
        <Button asChild variant="outline" size="icon" aria-label={`Switch to ${to.plural} to ${from.plural}`} className="mx-auto">
          <Link href={reverseHref}>
            <ArrowLeftRightIcon />
          </Link>
        </Button>
        <Stat label={to.plural} value={`${display} ${to.symbol}`} className="border-primary bg-primary text-primary-foreground [&_.label-mono]:text-primary-foreground/80" />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Decimals</span>
          <SelectField aria-label="Decimal places" size="sm" className="w-20" value={precision} onChange={(v) => setPrecision(v as (typeof PRECISION)[number])} options={PRECISION} />
        </div>
        <CopyButton text={fixed} label="Copy result" size="sm" />
        <span className="flex-1" />
        <Hint className="mt-0">
          {value === "" || result === null ? "Enter a number" : `${formatNumber(Number(value), 8)} ${from.symbol} = ${fixed} ${to.symbol}`}
        </Hint>
      </div>
    </div>
  );
}
