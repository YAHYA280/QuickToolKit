import { convert, formatNumber, formulaText, getUnit, ratioSentence, type Pair, type Unit } from "./data";

export interface PairContent {
  title: string;
  metaTitle: string;
  description: string;
  h1: string;
  intro: string[];
  formula: string;
  ratio: string;
  faq: { question: string; answer: string }[];
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const fmt = (n: number) => formatNumber(n, 6);
const plural = (n: number, unit: Unit) => (n === 1 ? unit.name : unit.plural);

function whereUsed(unit: Unit): string {
  switch (unit.system) {
    case "metric":
      return "part of the metric system used in most countries";
    case "imperial":
      return "an imperial unit still common in the United States and the United Kingdom";
    case "us":
      return "a US customary unit";
    case "si":
      return "an SI unit used in science and engineering";
    case "digital":
      return "a decimal storage unit as used by drive manufacturers and most operating systems";
  }
}

export function buildPairContent(pair: Pair): PairContent {
  const from = getUnit(pair.from);
  const to = getUnit(pair.to);
  const one = convert(1, from, to);
  const ten = convert(10, from, to);
  const hundred = convert(100, from, to);
  const back = convert(1, to, from);
  const temperature = from.category === "temperature";
  const fuel = from.category === "fuel";

  const fromN = cap(from.plural);
  const toN = to.plural;
  const short = `${from.symbol} to ${to.symbol}`;

  const h1 = `${fromN} to ${cap(toN)}`;
  const title = `${h1} Converter`;
  // " | TabUtils" adds 11 chars; keep the rendered title at or under 61.
  const candidates = [`${title} (${short})`, title, `${short} Converter (${fromN} to ${toN})`, `${short} Converter`];
  const metaTitle = candidates.find((t) => t.length <= 50) ?? `${short} Converter`;

  const description = temperature
    ? `Convert ${from.plural} to ${to.plural} instantly. Formula ${formulaText(from, to)}, a full table from ${fmt(Math.min(...tableFor(from)))} to ${fmt(Math.max(...tableFor(from)))} ${from.symbol}, and worked examples.`
    : fuel
      ? `Convert ${from.plural} to ${to.plural} instantly in your browser. Formula, a conversion table for common values, and the reason the two scales run in opposite directions.`
      : `Convert ${from.plural} to ${to.plural}: ${ratioSentence(from, to)}. Free ${short} converter with formula, conversion table and examples. Runs in your browser.`;

  const intro: string[] = [];
  if (temperature) {
    intro.push(
      `This ${from.plural} to ${to.plural} converter turns any ${from.symbol} reading into ${to.symbol} instantly, in your browser, with the formula shown so you can check the result by hand. ${cap(from.plural)} are ${whereUsed(from)}; ${to.plural} are ${whereUsed(to)}. Water freezes at ${fmt(convert(0, getUnit("c"), from))} ${from.symbol} (${fmt(convert(0, getUnit("c"), to))} ${to.symbol}) and boils at ${fmt(convert(100, getUnit("c"), from))} ${from.symbol} (${fmt(convert(100, getUnit("c"), to))} ${to.symbol}) at sea level.`,
    );
    intro.push(
      `The formula is ${formulaText(from, to)}. For a quick mental estimate between Celsius and Fahrenheit, double the Celsius value and add 30; it is within a few degrees for everyday temperatures. Normal body temperature is ${fmt(convert(37, getUnit("c"), from))} ${from.symbol}, which is ${fmt(convert(37, getUnit("c"), to))} ${to.symbol}.`,
    );
  } else if (fuel) {
    intro.push(
      `This ${from.plural} to ${to.plural} converter switches between the two common ways of expressing fuel economy. ${cap(from.plural)} are ${whereUsed(from)}; ${to.plural} are ${whereUsed(to)}. The scales are inverse: a higher mpg figure is better, while a lower L/100 km figure is better, so ${fmt(20)} ${from.symbol} equals ${fmt(convert(20, from, to))} ${to.symbol} and ${fmt(40)} ${from.symbol} equals ${fmt(convert(40, from, to))} ${to.symbol}.`,
    );
    intro.push(
      `The formula is ${formulaText(from, to)}, using the US gallon (3.785 liters). UK miles per imperial gallon are about 20 percent higher for the same car, so check which gallon a figure uses before comparing. Everything is computed in your browser.`,
    );
  } else {
    intro.push(
      `This ${from.plural} to ${to.plural} converter gives you the ${short} result instantly, in your browser, with the exact ratio so you can verify it. ${ratioSentence(from, to)}, and going the other way, 1 ${to.name} is ${fmt(back)} ${plural(back, from)}. ${cap(from.plural)} are ${whereUsed(from)}; ${to.plural} are ${whereUsed(to)}.`,
    );
    intro.push(
      `To convert by hand, multiply the number of ${from.plural} by ${fmt(one)}. For example, 10 ${from.plural} is ${fmt(ten)} ${plural(ten, to)} and 100 ${from.plural} is ${fmt(hundred)} ${plural(hundred, to)}. The table below lists the most requested values, and the converter above accepts decimals for anything in between.`,
    );
  }

  const faq: PairContent["faq"] = [];
  const q1 = temperature ? 20 : fuel ? 30 : 5;
  const q2 = temperature ? 100 : fuel ? 8 : 12;
  const q3 = temperature ? -10 : fuel ? 50 : 30;
  const ex = (v: number) => `${fmt(v)} ${from.symbol} = ${fmt(convert(v, from, to))} ${to.symbol}`;
  faq.push({
    question: `How many ${to.plural} are in ${fmt(q1)} ${from.plural}?`,
    answer: `${ex(q1)}. ${temperature ? `Apply the formula ${formulaText(from, to)}.` : fuel ? `Divide 235.215 by ${fmt(q1)}.` : `Multiply ${fmt(q1)} by ${fmt(one)}, the number of ${to.plural} in one ${from.name}.`} The converter on this page does the same arithmetic for any value, including decimals.`,
  });
  faq.push({
    question: `What is the formula to convert ${from.plural} to ${to.plural}?`,
    answer: `${formulaText(from, to)}. ${temperature ? "Temperature scales have different zero points, so you cannot simply multiply; the offset matters." : fuel ? "The two units are reciprocal, which is why doubling one halves the other." : `The factor comes from the definitions of the units: ${ratioSentence(from, to)}.`} Worked example: ${ex(q2)}.`,
  });
  faq.push({
    question: `Is ${fmt(q3)} ${from.symbol} the same as ${fmt(convert(q3, from, to))} ${to.symbol}?`,
    answer: `Yes. ${ex(q3)}${temperature && q3 === -10 ? ", a common winter temperature" : ""}. ${temperature ? `Notice that -40 is the one point where Celsius and Fahrenheit agree: -40 °C equals -40 °F.` : `Rounded to ${to.category === "data" ? "the nearest whole unit" : "four decimals"} it is ${formatNumber(convert(q3, from, to), 4)} ${to.symbol}.`}`,
  });
  faq.push({
    question: `How do I convert ${to.plural} back to ${from.plural}?`,
    answer: temperature
      ? `Reverse the formula: ${formulaText(to, from)}. Or use the ${to.plural} to ${from.plural} page linked above, which has its own table and examples.`
      : fuel
        ? `The same formula works in both directions because the units are reciprocal: ${formulaText(to, from)}. The reverse page linked above has a table for ${to.symbol} values.`
        : `Divide by ${fmt(one)}, or multiply by ${fmt(back)}: 1 ${to.name} is ${fmt(back)} ${plural(back, from)}. The ${to.plural} to ${from.plural} page linked above lists common values the other way.`,
  });
  if (!temperature && !fuel) {
    faq.push({
      question: `Is the ${short} conversion exact?`,
      answer: `${ratioSentence(from, to)}. ${ratioSentence(from, to).includes("exactly") ? "The ratio is fixed by international agreement, so results are exact apart from rounding in the display." : "The ratio is a defined constant but produces a long decimal, so this page rounds to six significant digits, which is more precision than any everyday measurement needs."}`,
    });
  }

  return {
    title,
    metaTitle,
    description: description.length > 158 ? description.slice(0, 155).replace(/\s+\S*$/, "") + "." : description,
    h1,
    intro,
    formula: formulaText(from, to),
    ratio: ratioSentence(from, to),
    faq,
  };
}

function tableFor(from: Unit): number[] {
  return from.category === "temperature"
    ? from.id === "k"
      ? [0, 500]
      : [-40, 450]
    : [1, 1000];
}
