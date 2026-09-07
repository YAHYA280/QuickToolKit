"use client";

import { useState } from "react";
import { ArrowLeftRightIcon } from "lucide-react";
import { Button, Chip, Label, NumberInput, SelectField, Stat, ToolPanel } from "@/components/tools/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Unit {
  id: string;
  name: string;
  /** Multiplier to the category's base unit. Ignored for temperature. */
  factor: number;
}

interface Category {
  id: string;
  name: string;
  units: Unit[];
}

const CATEGORIES: Category[] = [
  {
    id: "length",
    name: "Length",
    units: [
      { id: "mm", name: "Millimeter", factor: 0.001 },
      { id: "cm", name: "Centimeter", factor: 0.01 },
      { id: "m", name: "Meter", factor: 1 },
      { id: "km", name: "Kilometer", factor: 1000 },
      { id: "in", name: "Inch", factor: 0.0254 },
      { id: "ft", name: "Foot", factor: 0.3048 },
      { id: "yd", name: "Yard", factor: 0.9144 },
      { id: "mi", name: "Mile", factor: 1609.344 },
    ],
  },
  {
    id: "weight",
    name: "Weight",
    units: [
      { id: "mg", name: "Milligram", factor: 0.000001 },
      { id: "g", name: "Gram", factor: 0.001 },
      { id: "kg", name: "Kilogram", factor: 1 },
      { id: "t", name: "Tonne", factor: 1000 },
      { id: "oz", name: "Ounce", factor: 0.028349523125 },
      { id: "lb", name: "Pound", factor: 0.45359237 },
      { id: "st", name: "Stone", factor: 6.35029318 },
    ],
  },
  {
    id: "temperature",
    name: "Temperature",
    units: [
      { id: "°C", name: "Celsius", factor: 1 },
      { id: "°F", name: "Fahrenheit", factor: 1 },
      { id: "K", name: "Kelvin", factor: 1 },
    ],
  },
  {
    id: "area",
    name: "Area",
    units: [
      { id: "mm²", name: "Square millimeter", factor: 0.000001 },
      { id: "cm²", name: "Square centimeter", factor: 0.0001 },
      { id: "m²", name: "Square meter", factor: 1 },
      { id: "ha", name: "Hectare", factor: 10000 },
      { id: "km²", name: "Square kilometer", factor: 1000000 },
      { id: "in²", name: "Square inch", factor: 0.00064516 },
      { id: "ft²", name: "Square foot", factor: 0.09290304 },
      { id: "ac", name: "Acre", factor: 4046.8564224 },
    ],
  },
  {
    id: "volume",
    name: "Volume",
    units: [
      { id: "ml", name: "Milliliter", factor: 0.001 },
      { id: "l", name: "Liter", factor: 1 },
      { id: "m³", name: "Cubic meter", factor: 1000 },
      { id: "tsp", name: "Teaspoon (US)", factor: 0.00492892159375 },
      { id: "tbsp", name: "Tablespoon (US)", factor: 0.01478676478125 },
      { id: "fl oz", name: "Fluid ounce (US)", factor: 0.0295735295625 },
      { id: "cup", name: "Cup (US)", factor: 0.2365882365 },
      { id: "pt", name: "Pint (US)", factor: 0.473176473 },
      { id: "qt", name: "Quart (US)", factor: 0.946352946 },
      { id: "gal", name: "Gallon (US)", factor: 3.785411784 },
    ],
  },
  {
    id: "speed",
    name: "Speed",
    units: [
      { id: "m/s", name: "Meter per second", factor: 1 },
      { id: "km/h", name: "Kilometer per hour", factor: 1 / 3.6 },
      { id: "mph", name: "Mile per hour", factor: 0.44704 },
      { id: "kn", name: "Knot", factor: 1852 / 3600 },
    ],
  },
  {
    id: "data",
    name: "Data",
    units: [
      { id: "B", name: "Byte", factor: 1 },
      { id: "KB", name: "Kilobyte (1000 B)", factor: 1e3 },
      { id: "MB", name: "Megabyte (1000 KB)", factor: 1e6 },
      { id: "GB", name: "Gigabyte (1000 MB)", factor: 1e9 },
      { id: "TB", name: "Terabyte (1000 GB)", factor: 1e12 },
      { id: "KiB", name: "Kibibyte (1024 B)", factor: 1024 },
      { id: "MiB", name: "Mebibyte (1024 KiB)", factor: 1024 ** 2 },
      { id: "GiB", name: "Gibibyte (1024 MiB)", factor: 1024 ** 3 },
    ],
  },
];

function toCelsius(value: number, unit: string): number {
  if (unit === "°F") return ((value - 32) * 5) / 9;
  if (unit === "K") return value - 273.15;
  return value;
}

function fromCelsius(celsius: number, unit: string): number {
  if (unit === "°F") return (celsius * 9) / 5 + 32;
  if (unit === "K") return celsius + 273.15;
  return celsius;
}

function convert(category: Category, value: number, from: string, to: string): number {
  if (category.id === "temperature") return fromCelsius(toCelsius(value, from), to);
  const fromUnit = category.units.find((u) => u.id === from);
  const toUnit = category.units.find((u) => u.id === to);
  if (!fromUnit || !toUnit) return NaN;
  return (value * fromUnit.factor) / toUnit.factor;
}

/** Up to 6 significant digits, thousands separators, no floating-point noise. */
function fmt(n: number): string {
  if (!Number.isFinite(n)) return "–";
  if (n === 0) return "0";
  const abs = Math.abs(n);
  if (abs >= 1e15 || abs < 1e-6) return n.toExponential(5).replace(/\.?0+e/, "e");
  return Number(n.toPrecision(6)).toLocaleString("en-US", { maximumFractionDigits: 12 });
}

const CATEGORY_OPTIONS = CATEGORIES.map((c) => ({ value: c.id, label: c.name }));

export default function UnitConverterTool() {
  const [categoryId, setCategoryId] = useState(CATEGORIES[0].id);
  const [from, setFrom] = useState(CATEGORIES[0].units[2].id);
  const [to, setTo] = useState(CATEGORIES[0].units[5].id);
  const [value, setValue] = useState<number | "">(1);

  const category = CATEGORIES.find((c) => c.id === categoryId) ?? CATEGORIES[0];
  const amount = value === "" ? NaN : value;
  const result = convert(category, amount, from, to);
  const unitFactor = convert(category, 1, from, to);
  const unitOptions = category.units.map((u) => ({ value: u.id, label: `${u.name} (${u.id})` }));

  const changeCategory = (id: string) => {
    const next = CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
    setCategoryId(next.id);
    setFrom(next.units[0].id);
    setTo(next.units[1].id);
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <ToolPanel>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="unit-category">Category</Label>
          <SelectField id="unit-category" value={categoryId} onChange={changeCategory} options={CATEGORY_OPTIONS} />
        </div>
        <div>
          <Label htmlFor="unit-value">Value</Label>
          <NumberInput id="unit-value" value={value} onChange={setValue} step={1} />
        </div>
      </div>

      <div className="mt-4 grid items-end gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <div>
          <Label htmlFor="unit-from">From</Label>
          <SelectField id="unit-from" value={from} onChange={setFrom} options={unitOptions} />
        </div>
        <div className="flex justify-center">
          <Button size="icon" aria-label="Swap units" title="Swap units" onClick={swap}>
            <ArrowLeftRightIcon />
          </Button>
        </div>
        <div>
          <Label htmlFor="unit-to">To</Label>
          <SelectField id="unit-to" value={to} onChange={setTo} options={unitOptions} />
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Stat label="Result" value={`${fmt(result)} ${to}`} className="border-brand/40 bg-brand/5" />
        <Stat label="Conversion factor" value={`1 ${from} = ${fmt(unitFactor)} ${to}`} />
      </div>

      <div className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="label-mono">All {category.name.toLowerCase()} units</p>
          <Chip>
            {value === "" ? "Value" : fmt(amount)} {from}
          </Chip>
        </div>
        <div className="mt-3 overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="label-mono">Unit</TableHead>
                <TableHead className="label-mono">Symbol</TableHead>
                <TableHead className="label-mono text-end">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-[13px]">
              {category.units.map((u) => (
                <TableRow key={u.id} className={u.id === to ? "bg-brand/10 hover:bg-brand/10" : undefined}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell className="font-mono text-muted-foreground">{u.id}</TableCell>
                  <TableCell className="text-end font-mono tabular-nums">
                    {fmt(convert(category, amount, from, u.id))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </ToolPanel>
  );
}
