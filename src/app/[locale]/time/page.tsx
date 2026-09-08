import type { Metadata } from "next";
import { ArrowUpRightIcon } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { formatOffset, getZone, yearOffsets, zonePairSlug, zonePairs, zones } from "@/timezones/data";

const BUILD_YEAR = new Date().getUTCFullYear();

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/time",
    title: "Time Zone Converter: EST, PST, GMT, IST & more",
    description: `${zonePairs.length} time zone conversions with hour-by-hour tables, daylight saving dates and meeting-time overlap. EST, PST, CST, GMT, UTC, IST, CET, JST, AEST and more.`,
  });
}

export default async function TimeHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const groups = new Map<string, typeof zonePairs>();
  for (const p of zonePairs) {
    const key = p.from;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(p);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Time zone conversions",
          url: absoluteUrl(locale, "/time"),
          numberOfItems: zonePairs.length,
          itemListElement: zonePairs.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: `${getZone(p.from).abbr} to ${getZone(p.to).abbr}`,
            url: absoluteUrl(locale, `/time/${zonePairSlug(p)}`),
          })),
        }}
      />
      <Breadcrumbs items={[{ name: "Time zones" }]} />
      <header className="mt-8 max-w-2xl border-b-2 border-border pb-8">
        <p className="label-mono">{zonePairs.length} conversions</p>
        <h1 className="mt-2 text-3xl sm:text-5xl">Time zone converter</h1>
        <p className="mt-3 text-lg leading-7 text-muted-foreground">
          Each page converts between two zones with daylight saving applied automatically, shows the hour-by-hour table for
          any date, and lists the working-hours overlap for scheduling calls.
        </p>
      </header>

      <section aria-labelledby="zones" className="mt-10">
        <h2 id="zones" className="text-xl sm:text-2xl">
          Zones covered
        </h2>
        <div className="mt-4 overflow-x-auto border-2 border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="label-mono px-3 py-2 text-start">Zone</th>
                <th className="label-mono px-3 py-2 text-start">Name</th>
                <th className="label-mono px-3 py-2 text-start">Standard</th>
                <th className="label-mono px-3 py-2 text-start">Daylight</th>
                <th className="label-mono px-3 py-2 text-start">Cities</th>
              </tr>
            </thead>
            <tbody className="font-mono text-[13px]">
              {zones.map((z) => {
                const o = yearOffsets(z, BUILD_YEAR);
                return (
                  <tr key={z.slug} className="border-t border-border">
                    <td className="px-3 py-2 font-bold">{z.abbr}</td>
                    <td className="px-3 py-2 font-sans">{z.name}</td>
                    <td className="px-3 py-2">{formatOffset(o.standard)}</td>
                    <td className="px-3 py-2">{o.daylight !== null ? `${z.dstAbbr} ${formatOffset(o.daylight)}` : "none"}</td>
                    <td className="px-3 py-2 font-sans text-muted-foreground">{z.cities.slice(0, 3).join(", ")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-12 space-y-12">
        {[...groups.entries()].map(([fromSlug, list]) => {
          const from = getZone(fromSlug);
          return (
            <section key={fromSlug} aria-labelledby={`zone-${fromSlug}`}>
              <div className="flex items-baseline justify-between border-b-2 border-border pb-3">
                <h2 id={`zone-${fromSlug}`} className="text-xl sm:text-2xl">
                  From {from.abbr}
                </h2>
                <span className="label-mono-muted">{list.length} pages</span>
              </div>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((p) => (
                  <li key={zonePairSlug(p)}>
                    <Link
                      href={`/time/${zonePairSlug(p)}`}
                      className="brut group flex items-center justify-between gap-3 px-4 py-3 transition-[transform,box-shadow,background-color] duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-highlight hover:shadow-hard-sm"
                    >
                      <span>
                        <span className="block text-sm font-semibold">
                          {getZone(p.from).abbr} to {getZone(p.to).abbr}
                        </span>
                        <span className="block font-mono text-[11px] text-muted-foreground">{getZone(p.to).name}</span>
                      </span>
                      <ArrowUpRightIcon className="size-4" strokeWidth={2.5} />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
