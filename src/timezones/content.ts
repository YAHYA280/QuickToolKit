import {
  formatDay,
  formatDiff,
  formatOffset,
  getZone,
  hourLabel,
  shiftHour,
  transitionDates,
  yearOffsets,
  type Zone,
  type ZonePair,
} from "./data";

export interface ZoneContent {
  h1: string;
  metaTitle: string;
  description: string;
  intro: string[];
  /** difference in minutes (to − from) on standard time and, if either zone has DST, during northern summer */
  diffStandard: number;
  diffSummer: number | null;
  offsets: { from: ReturnType<typeof yearOffsets>; to: ReturnType<typeof yearOffsets> };
  transitions: { from: Date[]; to: Date[] };
  meeting: { fromStart: number; fromEnd: number; toStart: number; toEnd: number } | null;
  faq: { question: string; answer: string }[];
  year: number;
}

const label = (z: Zone) => z.abbr;
const fullName = (z: Zone) => `${z.name} (${z.abbr})`;

function aheadText(diff: number, a: Zone, b: Zone): string {
  if (diff === 0) return `${label(b)} and ${label(a)} show the same time`;
  return diff > 0 ? `${label(b)} is ${formatDiff(diff)} ahead of ${label(a)}` : `${label(b)} is ${formatDiff(-diff)} behind ${label(a)}`;
}

/** Working-hours overlap (9 am to 5 pm in both zones) for a given difference. */
function overlap(diff: number): ZoneContent["meeting"] {
  // in "from" hours, "to" business hours run from 9 - diff/60 to 17 - diff/60
  const toStartInFrom = 9 - diff / 60;
  const toEndInFrom = 17 - diff / 60;
  const start = Math.max(9, toStartInFrom);
  const end = Math.min(17, toEndInFrom);
  if (end - start < 1) return null;
  return { fromStart: start, fromEnd: end, toStart: start + diff / 60, toEnd: end + diff / 60 };
}

export function buildZoneContent(pair: ZonePair, year: number): ZoneContent {
  const from = getZone(pair.from);
  const to = getZone(pair.to);
  const fo = yearOffsets(from, year);
  const tof = yearOffsets(to, year);
  const hasDst = fo.daylight !== null || tof.daylight !== null;
  // Northern-hemisphere summer: July offsets
  const julyFrom = fo.daylight !== null && !isSouthern(from) ? fo.daylight : fo.standard;
  const julyTo = tof.daylight !== null && !isSouthern(to) ? tof.daylight : tof.standard;
  // Southern DST zones are on daylight time in January instead
  const janFrom = fo.daylight !== null && isSouthern(from) ? fo.daylight : fo.standard;
  const janTo = tof.daylight !== null && isSouthern(to) ? tof.daylight : tof.standard;
  const diffJan = janTo - janFrom;
  const diffJul = julyTo - julyFrom;
  const diffSummer = hasDst && diffJul !== diffJan ? diffJul : null;
  const baseDiff = diffJan;

  const h1 = `${label(from)} to ${label(to)}`;
  const candidates = [`${h1} Time Converter (${from.name} to ${to.name})`, `${h1} Time Converter and Difference`, `${h1} Time Converter`];
  const metaTitle = candidates.find((t) => t.length <= 50) ?? `${h1} Converter`;

  const description = `Convert ${label(from)} to ${label(to)} instantly. ${aheadText(baseDiff, from, to)}${diffSummer !== null ? ` in winter, ${formatDiff(Math.abs(diffSummer))} in summer` : ""}. Hour-by-hour table, DST dates and best meeting times.`;

  const intro: string[] = [
    `This ${label(from)} to ${label(to)} converter turns any time in ${fullName(from)} into ${fullName(to)}, using your device clock so daylight saving is applied automatically. ${aheadText(baseDiff, from, to)}${diffSummer !== null ? ` when both zones are on standard time, and ${formatDiff(Math.abs(diffSummer))} ${diffSummer > 0 ? "ahead" : "behind"} during the summer months when clocks have shifted` : ""}. ${label(from)} is ${formatOffset(fo.standard)}${fo.daylight !== null ? ` (${from.dstAbbr}: ${formatOffset(fo.daylight)})` : ""}; ${label(to)} is ${formatOffset(tof.standard)}${tof.daylight !== null ? ` (${to.dstAbbr}: ${formatOffset(tof.daylight)})` : ""}.`,
    `${label(from)} covers ${from.cities.slice(0, 3).join(", ")}; ${label(to)} covers ${to.cities.slice(0, 3).join(", ")}. ${hasDst ? `Because ${fo.daylight !== null && tof.daylight !== null ? "both zones change their clocks on different dates" : `only ${fo.daylight !== null ? label(from) : label(to)} observes daylight saving time`}, the difference is not constant through the year. The tables below show both cases, and the converter at the top always uses the rule in force on the date you pick.` : `Neither zone observes daylight saving time, so the difference is the same every day of the year.`}`,
  ];

  const transitions = { from: transitionDates(from, year), to: transitionDates(to, year) };
  const meeting = overlap(baseDiff);

  const ex = (h: number, diff: number) => {
    const r = shiftHour(h, diff);
    return `${hourLabel(h)} ${label(from)} = ${hourLabel(r.hour, r.minute)} ${label(to)}${r.dayShift === 1 ? " the next day" : r.dayShift === -1 ? " the previous day" : ""}`;
  };

  const faq: ZoneContent["faq"] = [
    {
      question: `What is the time difference between ${label(from)} and ${label(to)}?`,
      answer: `${aheadText(baseDiff, from, to)}${diffSummer !== null ? ` on standard time. During daylight saving the gap changes to ${formatDiff(Math.abs(diffSummer))}` : ""}. That comes from the UTC offsets: ${label(from)} is ${formatOffset(fo.standard)} and ${label(to)} is ${formatOffset(tof.standard)}. For example, ${ex(9, baseDiff)}${diffSummer !== null ? `, and in summer ${ex(9, diffSummer)}` : ""}.`,
    },
    {
      question: `Is ${label(to)} ahead of or behind ${label(from)}?`,
      answer: baseDiff === 0
        ? `Neither. ${label(from)} and ${label(to)} share the same clock time${diffSummer !== null ? " on standard time; the gap opens to " + formatDiff(Math.abs(diffSummer)) + " while one zone is on daylight time" : " all year"}. ${to.slug === "utc" || from.slug === "utc" ? "UTC is a time standard, not a zone with DST, which is why GMT and UTC read the same even though GMT is strictly a zone name." : "Check the dates below if you are scheduling around a clock change."}`
        : `${aheadText(baseDiff, from, to)}, so when it is noon in ${label(from)} it is ${hourLabel(shiftHour(12, baseDiff).hour, shiftHour(12, baseDiff).minute)} in ${label(to)}${shiftHour(12, baseDiff).dayShift ? (shiftHour(12, baseDiff).dayShift === 1 ? " the next day" : " the previous day") : ""}. Ahead means the clock there already shows a later time; a call at 5 pm ${label(from)} lands at ${hourLabel(shiftHour(17, baseDiff).hour, shiftHour(17, baseDiff).minute)} ${label(to)}.`,
    },
    {
      question: `Does ${label(from)} or ${label(to)} observe daylight saving time in ${year}?`,
      answer: hasDst
        ? [
            fo.daylight !== null
              ? `${label(from)} switches to ${from.dstAbbr} (${formatOffset(fo.daylight)}) on ${formatDay(transitions.from[0])} and back on ${formatDay(transitions.from[1])} in ${year}.`
              : `${label(from)} keeps ${formatOffset(fo.standard)} all year.`,
            tof.daylight !== null
              ? `${label(to)} switches to ${to.dstAbbr} (${formatOffset(tof.daylight)}) on ${formatDay(transitions.to[0])} and back on ${formatDay(transitions.to[1])}.`
              : `${label(to)} keeps ${formatOffset(tof.standard)} all year.`,
            "Between those dates the difference in the table above shifts by an hour, which is the usual cause of missed calls in spring and autumn.",
          ].join(" ")
        : `No. Neither ${label(from)} nor ${label(to)} changes its clocks, so the ${formatDiff(Math.abs(baseDiff))} difference holds every day of the year. That makes recurring meetings between ${from.cities[0]} and ${to.cities[0]} easy to keep at a fixed local time on both ends.`,
    },
    {
      question: `What is the best time for a meeting between ${label(from)} and ${label(to)}?`,
      answer: meeting
        ? `Standard office hours (9 am to 5 pm) overlap from ${hourLabel(meeting.fromStart)} to ${hourLabel(meeting.fromEnd)} ${label(from)}, which is ${hourLabel(((meeting.toStart % 24) + 24) % 24)} to ${hourLabel(((meeting.toEnd % 24) + 24) % 24)} ${label(to)}. Pick a slot inside that window and both sides stay within a normal working day. Check the daylight saving dates above, because the window moves by an hour when only one side has changed clocks.`
        : `Office hours (9 am to 5 pm) do not overlap at all with a ${formatDiff(Math.abs(baseDiff))} difference. The least painful options are early morning in ${baseDiff > 0 ? label(from) : label(to)} or early evening in ${baseDiff > 0 ? label(to) : label(from)}; for example ${ex(8, baseDiff)} and ${ex(18, baseDiff)}. Rotate the inconvenient slot between the two sides for recurring calls.`,
    },
    {
      question: `Which cities use ${label(from)} and ${label(to)}?`,
      answer: `${label(from)} (${from.name}) is used in ${from.cities.join(", ")}. ${label(to)} (${to.name}) is used in ${to.cities.join(", ")}. ${from.slug === "gmt" || to.slug === "gmt" ? "Note that the United Kingdom is only on GMT in winter; from late March to late October London runs on British Summer Time, one hour ahead, so use the BST pages for UK business hours in summer." : "Some cities inside a zone skip daylight saving, noted in parentheses, so their offset matches only part of the year."}`,
    },
  ];

  return {
    h1,
    metaTitle,
    description: description.length > 158 ? description.slice(0, 155).replace(/\s+\S*$/, "") + "." : description,
    intro,
    diffStandard: baseDiff,
    diffSummer,
    offsets: { from: fo, to: tof },
    transitions,
    meeting,
    faq,
    year,
  };
}

function isSouthern(z: Zone): boolean {
  return z.iana.startsWith("Australia/") || z.iana.startsWith("Pacific/Auckland") || z.iana.startsWith("America/Sao_Paulo");
}
