/**
 * Time zones that get conversion pages (/time/<a>-to-<b>) and the pairs list.
 * All offset math goes through Intl with IANA zone ids, so daylight saving is handled by the runtime.
 */

export interface Zone {
  /** URL segment and the abbreviation people search for */
  slug: string;
  /** IANA id used for all computations */
  iana: string;
  /** standard-time abbreviation and name */
  abbr: string;
  name: string;
  /** daylight-time abbreviation, if the zone observes DST */
  dstAbbr?: string;
  dstName?: string;
  /** example cities for copy */
  cities: string[];
  region: string;
}

export const zones: Zone[] = [
  { slug: "utc", iana: "Etc/UTC", abbr: "UTC", name: "Coordinated Universal Time", cities: ["Reykjavik (same clock)", "servers and aviation"], region: "Global" },
  { slug: "gmt", iana: "Etc/GMT", abbr: "GMT", name: "Greenwich Mean Time", cities: ["Accra", "Dakar", "London in winter"], region: "Global" },
  { slug: "bst", iana: "Europe/London", abbr: "GMT", name: "Greenwich Mean Time", dstAbbr: "BST", dstName: "British Summer Time", cities: ["London", "Edinburgh", "Dublin (IST)"], region: "United Kingdom" },
  { slug: "est", iana: "America/New_York", abbr: "EST", name: "Eastern Standard Time", dstAbbr: "EDT", dstName: "Eastern Daylight Time", cities: ["New York", "Toronto", "Miami", "Atlanta"], region: "North America" },
  { slug: "cst", iana: "America/Chicago", abbr: "CST", name: "Central Standard Time", dstAbbr: "CDT", dstName: "Central Daylight Time", cities: ["Chicago", "Dallas", "Houston", "Mexico City (no DST)"], region: "North America" },
  { slug: "mst", iana: "America/Denver", abbr: "MST", name: "Mountain Standard Time", dstAbbr: "MDT", dstName: "Mountain Daylight Time", cities: ["Denver", "Salt Lake City", "Phoenix (no DST)"], region: "North America" },
  { slug: "pst", iana: "America/Los_Angeles", abbr: "PST", name: "Pacific Standard Time", dstAbbr: "PDT", dstName: "Pacific Daylight Time", cities: ["Los Angeles", "San Francisco", "Seattle", "Vancouver"], region: "North America" },
  { slug: "akst", iana: "America/Anchorage", abbr: "AKST", name: "Alaska Standard Time", dstAbbr: "AKDT", dstName: "Alaska Daylight Time", cities: ["Anchorage", "Juneau"], region: "North America" },
  { slug: "hst", iana: "Pacific/Honolulu", abbr: "HST", name: "Hawaii Standard Time", cities: ["Honolulu", "Hilo"], region: "North America" },
  { slug: "brt", iana: "America/Sao_Paulo", abbr: "BRT", name: "Brasilia Time", cities: ["Sao Paulo", "Rio de Janeiro", "Brasilia"], region: "South America" },
  { slug: "cet", iana: "Europe/Paris", abbr: "CET", name: "Central European Time", dstAbbr: "CEST", dstName: "Central European Summer Time", cities: ["Paris", "Berlin", "Madrid", "Rome", "Amsterdam"], region: "Europe" },
  { slug: "eet", iana: "Europe/Athens", abbr: "EET", name: "Eastern European Time", dstAbbr: "EEST", dstName: "Eastern European Summer Time", cities: ["Athens", "Helsinki", "Kyiv", "Bucharest"], region: "Europe" },
  { slug: "msk", iana: "Europe/Moscow", abbr: "MSK", name: "Moscow Standard Time", cities: ["Moscow", "Saint Petersburg"], region: "Europe" },
  { slug: "sast", iana: "Africa/Johannesburg", abbr: "SAST", name: "South Africa Standard Time", cities: ["Johannesburg", "Cape Town"], region: "Africa" },
  { slug: "gst", iana: "Asia/Dubai", abbr: "GST", name: "Gulf Standard Time", cities: ["Dubai", "Abu Dhabi", "Muscat"], region: "Middle East" },
  { slug: "ist", iana: "Asia/Kolkata", abbr: "IST", name: "India Standard Time", cities: ["Mumbai", "Delhi", "Bengaluru", "Kolkata"], region: "Asia" },
  { slug: "sgt", iana: "Asia/Singapore", abbr: "SGT", name: "Singapore Time", cities: ["Singapore", "Kuala Lumpur (MYT)", "Manila (PHT)"], region: "Asia" },
  { slug: "hkt", iana: "Asia/Hong_Kong", abbr: "HKT", name: "Hong Kong Time", cities: ["Hong Kong", "Macau"], region: "Asia" },
  { slug: "china", iana: "Asia/Shanghai", abbr: "CST", name: "China Standard Time", cities: ["Beijing", "Shanghai", "Shenzhen", "Taipei"], region: "Asia" },
  { slug: "jst", iana: "Asia/Tokyo", abbr: "JST", name: "Japan Standard Time", cities: ["Tokyo", "Osaka"], region: "Asia" },
  { slug: "kst", iana: "Asia/Seoul", abbr: "KST", name: "Korea Standard Time", cities: ["Seoul", "Busan"], region: "Asia" },
  { slug: "aest", iana: "Australia/Sydney", abbr: "AEST", name: "Australian Eastern Standard Time", dstAbbr: "AEDT", dstName: "Australian Eastern Daylight Time", cities: ["Sydney", "Melbourne", "Canberra", "Brisbane (no DST)"], region: "Oceania" },
  { slug: "nzst", iana: "Pacific/Auckland", abbr: "NZST", name: "New Zealand Standard Time", dstAbbr: "NZDT", dstName: "New Zealand Daylight Time", cities: ["Auckland", "Wellington"], region: "Oceania" },
];

const bySlug = new Map(zones.map((z) => [z.slug, z]));
export const getZone = (slug: string): Zone => {
  const z = bySlug.get(slug);
  if (!z) throw new Error(`unknown zone ${slug}`);
  return z;
};

export interface ZonePair {
  from: string;
  to: string;
}
const both = (a: string, b: string): ZonePair[] => [
  { from: a, to: b },
  { from: b, to: a },
];

export const zonePairs: ZonePair[] = [
  ...both("est", "gmt"),
  ...both("est", "pst"),
  ...both("est", "cst"),
  ...both("est", "mst"),
  ...both("est", "utc"),
  ...both("est", "ist"),
  ...both("est", "cet"),
  ...both("est", "bst"),
  ...both("est", "jst"),
  ...both("est", "aest"),
  ...both("est", "hkt"),
  ...both("est", "sgt"),
  ...both("est", "china"),
  ...both("est", "hst"),
  ...both("pst", "gmt"),
  ...both("pst", "utc"),
  ...both("pst", "ist"),
  ...both("pst", "cet"),
  ...both("pst", "bst"),
  ...both("pst", "jst"),
  ...both("pst", "aest"),
  ...both("pst", "hst"),
  ...both("cst", "gmt"),
  ...both("cst", "ist"),
  ...both("cst", "pst"),
  ...both("gmt", "ist"),
  ...both("gmt", "cet"),
  ...both("gmt", "utc"),
  ...both("gmt", "jst"),
  ...both("gmt", "aest"),
  ...both("gmt", "sgt"),
  ...both("utc", "ist"),
  ...both("utc", "cet"),
  ...both("utc", "jst"),
  ...both("ist", "cet"),
  ...both("ist", "sgt"),
  ...both("ist", "aest"),
  ...both("ist", "gst"),
  ...both("bst", "ist"),
  ...both("bst", "cet"),
  ...both("cet", "jst"),
];

export const zonePairSlug = (p: ZonePair): string => `${p.from}-to-${p.to}`;
const pairBySlug = new Map(zonePairs.map((p) => [zonePairSlug(p), p]));
export const getZonePair = (slug: string): ZonePair | undefined => pairBySlug.get(slug);
export const reverseZoneSlug = (p: ZonePair): string => zonePairSlug({ from: p.to, to: p.from });

/* ------------------------------------------------------------------
   Offset math via Intl (works in Node 20+ and every modern browser)
   ------------------------------------------------------------------ */
const dtfCache = new Map<string, Intl.DateTimeFormat>();
function dtf(tz: string): Intl.DateTimeFormat {
  let f = dtfCache.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    dtfCache.set(tz, f);
  }
  return f;
}

/** Offset from UTC in minutes for a zone at a given instant (positive = ahead of UTC). */
export function offsetMinutes(tz: string, date: Date): number {
  const parts = dtf(tz).formatToParts(date);
  const m: Record<string, number> = {};
  for (const p of parts) if (p.type !== "literal") m[p.type] = Number(p.value);
  const asUTC = Date.UTC(m.year, m.month - 1, m.day, m.hour, m.minute, m.second);
  return Math.round((asUTC - date.getTime()) / 60000);
}

export function formatOffset(minutes: number): string {
  const sign = minutes >= 0 ? "+" : "−";
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const mm = abs % 60;
  return `UTC${sign}${h}${mm ? `:${String(mm).padStart(2, "0")}` : ""}`;
}

export function formatDiff(minutes: number): string {
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const mm = abs % 60;
  if (abs === 0) return "0 hours";
  const hours = h === 1 ? "1 hour" : `${h} hours`;
  return mm ? `${hours} ${mm} minutes` : hours;
}

/** Is the zone on daylight time at this instant? (compares to the smaller of its January/July offsets) */
export function isDst(z: Zone, date: Date): boolean {
  if (!z.dstAbbr) return false;
  const year = date.getUTCFullYear();
  const jan = offsetMinutes(z.iana, new Date(Date.UTC(year, 0, 15)));
  const jul = offsetMinutes(z.iana, new Date(Date.UTC(year, 6, 15)));
  if (jan === jul) return false;
  return offsetMinutes(z.iana, date) === Math.max(jan, jul);
}

export function abbrAt(z: Zone, date: Date): string {
  return isDst(z, date) && z.dstAbbr ? z.dstAbbr : z.abbr;
}

/** Standard and daylight offsets for a year (minutes). */
export function yearOffsets(z: Zone, year: number): { standard: number; daylight: number | null } {
  const jan = offsetMinutes(z.iana, new Date(Date.UTC(year, 0, 15)));
  const jul = offsetMinutes(z.iana, new Date(Date.UTC(year, 6, 15)));
  if (jan === jul || !z.dstAbbr) return { standard: jan, daylight: null };
  return { standard: Math.min(jan, jul), daylight: Math.max(jan, jul) };
}

/** Dates (UTC day) on which the offset changes during a year, e.g. DST start and end. */
export function transitionDates(z: Zone, year: number): Date[] {
  if (!z.dstAbbr) return [];
  const out: Date[] = [];
  let prev = offsetMinutes(z.iana, new Date(Date.UTC(year, 0, 1)));
  for (let day = 1; day <= 366; day++) {
    const d = new Date(Date.UTC(year, 0, day, 12));
    if (d.getUTCFullYear() !== year) break;
    const o = offsetMinutes(z.iana, d);
    if (o !== prev) {
      out.push(d);
      prev = o;
    }
  }
  return out;
}

export function formatDay(d: Date): string {
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", timeZone: "UTC" }).format(d);
}

/** Convert an hour (0-23) in `from` to the hour in `to` given a minute difference. Returns hour and day shift. */
export function shiftHour(hour: number, diffMinutes: number): { hour: number; minute: number; dayShift: -1 | 0 | 1 } {
  const total = hour * 60 + diffMinutes;
  const dayShift = total < 0 ? -1 : total >= 1440 ? 1 : 0;
  const wrapped = ((total % 1440) + 1440) % 1440;
  return { hour: Math.floor(wrapped / 60), minute: wrapped % 60, dayShift };
}

export function hourLabel(hour: number, minute = 0): string {
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const ampm = hour < 12 ? "am" : "pm";
  return `${h12}${minute ? `:${String(minute).padStart(2, "0")}` : ""} ${ampm}`;
}
