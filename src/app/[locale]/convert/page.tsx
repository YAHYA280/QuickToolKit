import type { Metadata } from "next";
import { ArrowUpRightIcon } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { categoryLabel, getUnit, pairSlug, pairs, pairsInCategory, type ConvertCategory } from "@/convert/data";

const CATEGORIES: ConvertCategory[] = ["length", "weight", "temperature", "volume", "area", "speed", "data", "pressure", "fuel"];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/convert",
    title: "Unit Conversions: cm to inches, kg to lbs & more",
    description: `${pairs.length} quick unit conversions with formulas and tables: length, weight, temperature, volume, area, speed, data, pressure and fuel economy. Runs in your browser.`,
  });
}

export default async function ConvertHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Unit conversions",
          url: absoluteUrl(locale, "/convert"),
          numberOfItems: pairs.length,
          itemListElement: pairs.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: `${getUnit(p.from).plural} to ${getUnit(p.to).plural}`,
            url: absoluteUrl(locale, `/convert/${pairSlug(p)}`),
          })),
        }}
      />
      <Breadcrumbs items={[{ name: "Conversions" }]} />
      <header className="mt-8 max-w-2xl border-b-2 border-border pb-8">
        <p className="label-mono">{pairs.length} conversions</p>
        <h1 className="mt-2 text-3xl sm:text-5xl">Unit conversions</h1>
        <p className="mt-3 text-lg leading-7 text-muted-foreground">
          One page per conversion, each with the exact formula, a table of common values and worked examples. For anything not
          listed, the <Link href="/tools/unit-converter" className="font-bold text-primary underline decoration-2 underline-offset-4">Unit Converter</Link> handles every unit at once.
        </p>
      </header>

      <div className="mt-10 space-y-12">
        {CATEGORIES.map((cat) => {
          const list = pairsInCategory(cat);
          if (!list.length) return null;
          return (
            <section key={cat} aria-labelledby={`cat-${cat}`}>
              <div className="flex items-baseline justify-between border-b-2 border-border pb-3">
                <h2 id={`cat-${cat}`} className="text-xl sm:text-2xl">
                  {categoryLabel[cat]}
                </h2>
                <span className="label-mono-muted">{list.length} pages</span>
              </div>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((p) => {
                  const f = getUnit(p.from);
                  const t = getUnit(p.to);
                  return (
                    <li key={pairSlug(p)}>
                      <Link
                        href={`/convert/${pairSlug(p)}`}
                        className="brut group flex items-center justify-between gap-3 px-4 py-3 transition-[transform,box-shadow,background-color] duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-highlight hover:shadow-hard-sm"
                      >
                        <span>
                          <span className="block text-sm font-semibold">
                            {f.plural} to {t.plural}
                          </span>
                          <span className="block font-mono text-[11px] text-muted-foreground">
                            {f.symbol} → {t.symbol}
                          </span>
                        </span>
                        <ArrowUpRightIcon className="size-4" strokeWidth={2.5} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
