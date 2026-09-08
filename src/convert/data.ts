/**
 * Unit definitions and the list of conversion pairs that get their own page (/convert/<from>-to-<to>).
 * Server-safe, no React. Factors convert TO the category base unit; temperature and fuel economy are functions.
 */

export type ConvertCategory = "length" | "weight" | "temperature" | "volume" | "area" | "speed" | "data" | "pressure" | "fuel";

export interface Unit {
  id: string;
  /** URL segment, e.g. "inches" */
  slug: string;
  name: string;
  plural: string;
  symbol: string;
  category: ConvertCategory;
  /** multiply by this to get the base unit (ignored for temperature/fuel) */
  factor: number;
  /** short note used in copy, e.g. "US customary" */
  system: "metric" | "imperial" | "us" | "si" | "digital";
}

const u = (id: string, slug: string, name: string, plural: string, symbol: string, category: ConvertCategory, factor: number, system: Unit["system"]): Unit => ({
  id,
  slug,
  name,
  plural,
  symbol,
  category,
  factor,
  system,
});

export const units: Unit[] = [
  // length (base: meter)
  u("mm", "mm", "millimeter", "millimeters", "mm", "length", 0.001, "metric"),
  u("cm", "cm", "centimeter", "centimeters", "cm", "length", 0.01, "metric"),
  u("m", "meters", "meter", "meters", "m", "length", 1, "metric"),
  u("km", "km", "kilometer", "kilometers", "km", "length", 1000, "metric"),
  u("in", "inches", "inch", "inches", "in", "length", 0.0254, "imperial"),
  u("ft", "feet", "foot", "feet", "ft", "length", 0.3048, "imperial"),
  u("yd", "yards", "yard", "yards", "yd", "length", 0.9144, "imperial"),
  u("mi", "miles", "mile", "miles", "mi", "length", 1609.344, "imperial"),
  // weight (base: kilogram)
  u("g", "grams", "gram", "grams", "g", "weight", 0.001, "metric"),
  u("kg", "kg", "kilogram", "kilograms", "kg", "weight", 1, "metric"),
  u("oz", "ounces", "ounce", "ounces", "oz", "weight", 0.028349523125, "imperial"),
  u("lb", "lbs", "pound", "pounds", "lb", "weight", 0.45359237, "imperial"),
  u("st", "stone", "stone", "stone", "st", "weight", 6.35029318, "imperial"),
  // temperature (functions)
  u("c", "celsius", "degree Celsius", "degrees Celsius", "°C", "temperature", 1, "metric"),
  u("f", "fahrenheit", "degree Fahrenheit", "degrees Fahrenheit", "°F", "temperature", 1, "us"),
  u("k", "kelvin", "kelvin", "kelvin", "K", "temperature", 1, "si"),
  // volume (base: liter)
  u("ml", "ml", "milliliter", "milliliters", "mL", "volume", 0.001, "metric"),
  u("l", "liters", "liter", "liters", "L", "volume", 1, "metric"),
  u("tsp", "teaspoons", "teaspoon", "teaspoons", "tsp", "volume", 0.00492892159375, "us"),
  u("tbsp", "tablespoons", "tablespoon", "tablespoons", "tbsp", "volume", 0.01478676478125, "us"),
  u("floz", "fl-oz", "fluid ounce", "fluid ounces", "fl oz", "volume", 0.0295735295625, "us"),
  u("cup", "cups", "cup", "cups", "cup", "volume", 0.2365882365, "us"),
  u("qt", "quarts", "quart", "quarts", "qt", "volume", 0.946352946, "us"),
  u("gal", "gallons", "gallon", "gallons", "gal", "volume", 3.785411784, "us"),
  // area (base: square meter)
  u("sqft", "square-feet", "square foot", "square feet", "sq ft", "area", 0.09290304, "imperial"),
  u("sqm", "square-meters", "square meter", "square meters", "m²", "area", 1, "metric"),
  u("acre", "acres", "acre", "acres", "ac", "area", 4046.8564224, "imperial"),
  u("ha", "hectares", "hectare", "hectares", "ha", "area", 10000, "metric"),
  // speed (base: meter per second)
  u("kmh", "kmh", "kilometer per hour", "kilometers per hour", "km/h", "speed", 1000 / 3600, "metric"),
  u("mph", "mph", "mile per hour", "miles per hour", "mph", "speed", 1609.344 / 3600, "imperial"),
  u("kn", "knots", "knot", "knots", "kn", "speed", 1852 / 3600, "si"),
  u("mps", "meters-per-second", "meter per second", "meters per second", "m/s", "speed", 1, "si"),
  // data (base: byte, decimal)
  u("kb", "kb", "kilobyte", "kilobytes", "KB", "data", 1e3, "digital"),
  u("mb", "mb", "megabyte", "megabytes", "MB", "data", 1e6, "digital"),
  u("gb", "gb", "gigabyte", "gigabytes", "GB", "data", 1e9, "digital"),
  u("tb", "tb", "terabyte", "terabytes", "TB", "data", 1e12, "digital"),
  // pressure (base: pascal)
  u("psi", "psi", "pound per square inch", "pounds per square inch", "psi", "pressure", 6894.757293168, "imperial"),
  u("bar", "bar", "bar", "bar", "bar", "pressure", 100000, "metric"),
  u("kpa", "kpa", "kilopascal", "kilopascals", "kPa", "pressure", 1000, "si"),
  // fuel economy (functions)
  u("mpg", "mpg", "mile per gallon", "miles per gallon", "mpg", "fuel", 1, "us"),
  u("l100", "l-per-100km", "liter per 100 km", "liters per 100 kilometers", "L/100 km", "fuel", 1, "metric"),
];

const byId = new Map(units.map((x) => [x.id, x]));
export const getUnit = (id: string): Unit => {
  const x = byId.get(id);
  if (!x) throw new Error(`unknown unit ${id}`);
  return x;
};

export const categoryLabel: Record<ConvertCategory, string> = {
  length: "Length",
  weight: "Weight",
  temperature: "Temperature",
  volume: "Volume",
  area: "Area",
  speed: "Speed",
  data: "Data",
  pressure: "Pressure",
  fuel: "Fuel economy",
};

/** Convert a value between two units of the same category. */
export function convert(value: number, from: Unit, to: Unit): number {
  if (from.category !== to.category) throw new Error("unit category mismatch");
  if (from.id === to.id) return value;
  if (from.category === "temperature") {
    const c = from.id === "c" ? value : from.id === "f" ? (value - 32) * (5 / 9) : value - 273.15;
    return to.id === "c" ? c : to.id === "f" ? c * (9 / 5) + 32 : c + 273.15;
  }
  if (from.category === "fuel") {
    if (value === 0) return 0;
    // mpg (US) <-> L/100 km: 235.214583 / x
    return 235.214583 / value;
  }
  return (value * from.factor) / to.factor;
}

/** Human formula text for a pair. */
export function formulaText(from: Unit, to: Unit): string {
  if (from.category === "temperature") {
    const key = `${from.id}>${to.id}`;
    const map: Record<string, string> = {
      "c>f": "°F = °C × 9/5 + 32",
      "f>c": "°C = (°F − 32) × 5/9",
      "c>k": "K = °C + 273.15",
      "k>c": "°C = K − 273.15",
      "f>k": "K = (°F − 32) × 5/9 + 273.15",
      "k>f": "°F = (K − 273.15) × 9/5 + 32",
    };
    return map[key] ?? "";
  }
  if (from.category === "fuel") return `${to.symbol} = 235.215 ÷ ${from.symbol}`;
  const ratio = from.factor / to.factor;
  return `${to.symbol} = ${from.symbol} × ${formatNumber(ratio, 6)}`;
}

/** Exact or best-known ratio sentence, e.g. "1 inch is exactly 2.54 centimeters". */
export function ratioSentence(from: Unit, to: Unit): string {
  if (from.category === "temperature" || from.category === "fuel") return "";
  const r = convert(1, from, to);
  const shown = formatNumber(r, 6);
  // "exactly" only when the displayed number is the true ratio (2.54), not a rounding of it (0.393701)
  const exact = isExact(from, to) && Number(shown.replace(/,/g, "")) === r;
  return `1 ${from.name} is ${exact ? "exactly" : "about"} ${shown} ${r === 1 ? to.name : to.plural}`;
}

function isExact(from: Unit, to: Unit): boolean {
  // pairs where the international definition fixes the ratio
  const exactPairs = new Set(["in>cm", "cm>in", "ft>m", "m>ft", "yd>m", "m>yd", "mi>km", "km>mi", "lb>kg", "kg>lb", "oz>g", "g>oz", "st>kg", "kg>st"]);
  return exactPairs.has(`${from.id}>${to.id}`) || from.category === "data" || from.category === "pressure";
}

/** Sensible significant-digit formatting without float noise. */
export function formatNumber(n: number, maxSig = 6): string {
  if (!Number.isFinite(n)) return "–";
  if (n === 0) return "0";
  const abs = Math.abs(n);
  if (abs >= 1e15 || abs < 1e-6) return n.toExponential(3);
  const digits = Math.max(0, maxSig - Math.floor(Math.log10(abs)) - 1);
  const fixed = n.toFixed(Math.min(digits, 10));
  const trimmed = fixed.replace(/\.?0+$/, "");
  return Number(trimmed).toLocaleString("en-US", { maximumFractionDigits: 10 });
}

/* ------------------------------------------------------------------
   Pairs that get a page. Order = display order on the hub.
   ------------------------------------------------------------------ */
export interface Pair {
  from: string;
  to: string;
}

const both = (a: string, b: string): Pair[] => [
  { from: a, to: b },
  { from: b, to: a },
];

export const pairs: Pair[] = [
  ...both("cm", "in"),
  ...both("mm", "in"),
  ...both("m", "ft"),
  ...both("km", "mi"),
  ...both("in", "ft"),
  ...both("yd", "m"),
  ...both("kg", "lb"),
  ...both("g", "oz"),
  ...both("st", "kg"),
  ...both("lb", "st"),
  ...both("c", "f"),
  ...both("c", "k"),
  ...both("f", "k"),
  ...both("l", "gal"),
  ...both("ml", "floz"),
  ...both("cup", "ml"),
  ...both("tbsp", "ml"),
  ...both("tsp", "ml"),
  ...both("l", "qt"),
  ...both("sqft", "sqm"),
  ...both("acre", "sqft"),
  ...both("ha", "acre"),
  ...both("kmh", "mph"),
  ...both("kn", "mph"),
  ...both("mps", "kmh"),
  ...both("mb", "gb"),
  ...both("kb", "mb"),
  ...both("gb", "tb"),
  ...both("psi", "bar"),
  ...both("kpa", "psi"),
  ...both("mpg", "l100"),
];

export const pairSlug = (p: Pair): string => `${getUnit(p.from).slug}-to-${getUnit(p.to).slug}`;

const bySlug = new Map(pairs.map((p) => [pairSlug(p), p]));
export const getPair = (slug: string): Pair | undefined => bySlug.get(slug);
export const reverseSlug = (p: Pair): string => pairSlug({ from: p.to, to: p.from });

export function pairsInCategory(category: ConvertCategory): Pair[] {
  return pairs.filter((p) => getUnit(p.from).category === category);
}

/** Values shown in the conversion table for a given source unit. */
export function tableValues(from: Unit): number[] {
  if (from.category === "temperature") {
    return from.id === "k" ? [0, 100, 200, 250, 273.15, 293.15, 300, 310.15, 350, 373.15, 400, 500] : [-40, -30, -20, -10, 0, 10, 20, 25, 30, 37, 40, 50, 60, 70, 80, 90, 100, 150, 200, 250, 300, 350, 400, 450];
  }
  if (from.category === "fuel") return [5, 6, 7, 8, 9, 10, 12, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 100];
  if (from.category === "data") return [1, 2, 4, 8, 16, 32, 50, 64, 100, 128, 200, 256, 500, 512, 1000, 1024, 2000, 2048, 5000, 10000];
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 100, 150, 200, 250, 300, 500, 750, 1000];
}
