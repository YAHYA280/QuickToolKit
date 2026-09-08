import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRightIcon, ChevronDownIcon } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { AdSlot } from "@/components/ads/AdSlot";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ZoneConverter } from "@/components/time/ZoneConverter";
import { ToolFrame } from "@/components/tools/ToolFrame";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { siteLaunched } from "@/tools/dates";
import {
  formatDay,
  formatDiff,
  formatOffset,
  getZone,
  getZonePair,
  hourLabel,
  reverseZoneSlug,
  shiftHour,
  zonePairSlug,
  zonePairs,
} from "@/timezones/data";
import { buildZoneContent } from "@/timezones/content";

type Params = Promise<{ locale: string; pair: string }>;

const BUILD_YEAR = new Date().getUTCFullYear();

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => zonePairs.map((p) => ({ locale, pair: zonePairSlug(p) })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, pair: slug } = await params;
  const pair = getZonePair(slug);
  if (!pair) return {};
  const c = buildZoneContent(pair, BUILD_YEAR);
  return pageMetadata({ locale, path: `/time/${slug}`, title: c.metaTitle, description: c.description });
}

function HourTable({ diff, fromAbbr, toAbbr }: { diff: number; fromAbbr: string; toAbbr: string }) {
  const hours = [0, 3, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 22];
  return (
    <div className="not-prose overflow-x-auto border-2 border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted hover:bg-muted">
            <TableHead className="label-mono">{fromAbbr}</TableHead>
            <TableHead className="label-mono">{toAbbr}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="font-mono text-[13px] tabular-nums">
          {hours.map((h) => {
            const r = shiftHour(h, diff);
            return (
              <TableRow key={h} className={h >= 9 && h < 17 ? "bg-highlight/30" : undefined}>
                <TableCell>{hourLabel(h)}</TableCell>
                <TableCell className="text-brand-strong">
                  {hourLabel(r.hour, r.minute)}
                  {r.dayShift === 1 && <span className="ms-2 text-muted-foreground">next day</span>}
                  {r.dayShift === -1 && <span className="ms-2 text-muted-foreground">previous day</span>}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default async function TimePairPage({ params }: { params: Params }) {
  const { locale, pair: slug } = await params;
  setRequestLocale(locale);
  const pair = getZonePair(slug);
  if (!pair) notFound();

  const from = getZone(pair.from);
  const to = getZone(pair.to);
  const c = buildZoneContent(pair, BUILD_YEAR);
  const url = absoluteUrl(locale, `/time/${slug}`);
  const reverse = reverseZoneSlug(pair);
  const others = zonePairs.filter((p) => (p.from === pair.from || p.to === pair.from) && zonePairSlug(p) !== slug && zonePairSlug(p) !== reverse).slice(0, 8);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: `${c.h1} Time Converter`,
      url,
      description: c.description,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      isAccessibleForFree: true,
      inLanguage: locale,
      datePublished: siteLaunched,
      dateModified: `${BUILD_YEAR}-01-01`,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: c.faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
        { "@type": "ListItem", position: 2, name: "Time zones", item: absoluteUrl(locale, "/time") },
        { "@type": "ListItem", position: 3, name: c.h1, item: url },
      ],
    },
  ];

  const linkClass =
    "brut group flex items-center justify-between gap-3 px-4 py-3 text-sm font-semibold transition-[transform,box-shadow] hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-highlight hover:shadow-hard-sm";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <JsonLd data={jsonLd} />
      <Breadcrumbs items={[{ name: "Time zones", href: "/time" }, { name: c.h1 }]} />

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <header>
            <p className="label-mono">
              {from.name} → {to.name}
            </p>
            <h1 className="mt-2 text-3xl sm:text-5xl">{c.h1} time converter</h1>
            <p className="mt-3 max-w-2xl text-lg leading-7 text-muted-foreground">
              {to.abbr} is {c.diffStandard === 0 ? "the same time as" : `${formatDiff(Math.abs(c.diffStandard))} ${c.diffStandard > 0 ? "ahead of" : "behind"}`} {from.abbr}
              {c.diffSummer !== null ? ` on standard time, ${formatDiff(Math.abs(c.diffSummer))} in summer` : ""}. Pick a time to convert it.
            </p>
          </header>

          <AdSlot placement="top" className="mt-8" />

          <ToolFrame slug={slug} path={`time/${slug}`} statusHint="Uses your device clock and time zone rules. Nothing is sent to a server." className="mt-6">
            <ZoneConverter fromSlug={pair.from} toSlug={pair.to} reverseHref={`/time/${reverse}`} />
          </ToolFrame>

          <article className="prose-tool mt-12">
            <div className="max-w-2xl">
              {c.intro.map((p, i) => (
                <p key={i} className={i === 0 ? "text-[17px] leading-8 text-foreground" : undefined}>
                  {p}
                </p>
              ))}
            </div>

            <h2 id="offsets" className="scroll-mt-20">
              {from.abbr} and {to.abbr} UTC offsets
            </h2>
            <div className="not-prose grid gap-3 sm:grid-cols-2">
              {[
                { z: from, o: c.offsets.from, t: c.transitions.from },
                { z: to, o: c.offsets.to, t: c.transitions.to },
              ].map(({ z, o, t }) => (
                <div key={z.slug} className="brut-flat p-4">
                  <p className="label-mono">{z.abbr}</p>
                  <p className="mt-1 font-mono text-lg font-bold">{formatOffset(o.standard)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{z.name}</p>
                  {o.daylight !== null && t.length >= 2 ? (
                    <p className="mt-2 text-sm">
                      {z.dstAbbr} {formatOffset(o.daylight)} from {formatDay(t[0])} to {formatDay(t[1])}, {BUILD_YEAR}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-muted-foreground">No daylight saving time</p>
                  )}
                </div>
              ))}
            </div>

            <h2 id="table" className="scroll-mt-20">
              {c.h1} conversion table{c.diffSummer !== null ? " (standard time)" : ""}
            </h2>
            <HourTable diff={c.diffStandard} fromAbbr={from.abbr} toAbbr={to.abbr} />
            {c.diffSummer !== null && (
              <>
                <h2 id="table-summer" className="scroll-mt-20">
                  {c.h1} during daylight saving
                </h2>
                <p>
                  Between the dates listed above, the difference is {formatDiff(Math.abs(c.diffSummer))} instead of {formatDiff(Math.abs(c.diffStandard))}.
                </p>
                <HourTable diff={c.diffSummer} fromAbbr={from.dstAbbr ? `${from.abbr}/${from.dstAbbr}` : from.abbr} toAbbr={to.dstAbbr ? `${to.abbr}/${to.dstAbbr}` : to.abbr} />
              </>
            )}

            <h2 id="faq" className="scroll-mt-20">
              Frequently asked questions
            </h2>
            <div className="brut divide-y-2 divide-border">
              {c.faq.map((item, i) => (
                <details key={i} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold transition-colors hover:bg-highlight [&::-webkit-details-marker]:hidden">
                    <span className="ps-5">{item.question}</span>
                    <ChevronDownIcon className="me-5 size-5 shrink-0 transition-transform duration-200 group-open:rotate-180" strokeWidth={2.5} />
                  </summary>
                  <p className="!mt-0 px-5 pb-5 text-muted-foreground">{item.answer}</p>
                </details>
              ))}
            </div>
          </article>

          <AdSlot placement="inArticle" className="mt-10" />

          <section aria-labelledby="related-zones" className="mt-12">
            <p className="label-mono">Related</p>
            <h2 id="related-zones" className="mt-1 text-2xl">
              More {from.abbr} conversions
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <li>
                <Link href={`/time/${reverse}`} className={linkClass}>
                  {to.abbr} to {from.abbr}
                  <ArrowUpRightIcon className="size-4" strokeWidth={2.5} />
                </Link>
              </li>
              {others.map((p) => (
                <li key={zonePairSlug(p)}>
                  <Link href={`/time/${zonePairSlug(p)}`} className={linkClass}>
                    {getZone(p.from).abbr} to {getZone(p.to).abbr}
                    <ArrowUpRightIcon className="size-4" strokeWidth={2.5} />
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/tools/unix-timestamp-converter" className={`${linkClass} bg-highlight`}>
                  Unix timestamp converter
                  <ArrowUpRightIcon className="size-4" strokeWidth={2.5} />
                </Link>
              </li>
            </ul>
          </section>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-6">
            <nav aria-label="Popular time zone conversions" className="brut">
              <p className="border-b-2 border-border ink-block px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em]">Popular</p>
              <ul className="divide-y-2 divide-border">
                {zonePairs
                  .filter((p) => zonePairSlug(p) !== slug)
                  .slice(0, 8)
                  .map((p) => (
                    <li key={zonePairSlug(p)}>
                      <Link href={`/time/${zonePairSlug(p)}`} className="group flex items-center justify-between gap-3 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-highlight">
                        <span>
                          {getZone(p.from).abbr} → {getZone(p.to).abbr}
                        </span>
                        <ArrowUpRightIcon className="size-4" strokeWidth={2.5} />
                      </Link>
                    </li>
                  ))}
              </ul>
            </nav>
            <AdSlot placement="sidebar" />
          </div>
        </aside>
      </div>
    </div>
  );
}
