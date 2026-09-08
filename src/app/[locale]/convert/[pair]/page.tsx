import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRightIcon, ChevronDownIcon } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { AdSlot } from "@/components/ads/AdSlot";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PairConverter } from "@/components/convert/PairConverter";
import { ToolFrame } from "@/components/tools/ToolFrame";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { siteLaunched } from "@/tools/dates";
import {
  categoryLabel,
  convert,
  formatNumber,
  getPair,
  getUnit,
  pairSlug,
  pairs,
  pairsInCategory,
  reverseSlug,
  tableValues,
} from "@/convert/data";
import { buildPairContent } from "@/convert/content";

type Params = Promise<{ locale: string; pair: string }>;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => pairs.map((p) => ({ locale, pair: pairSlug(p) })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, pair: slug } = await params;
  const pair = getPair(slug);
  if (!pair) return {};
  const c = buildPairContent(pair);
  return pageMetadata({ locale, path: `/convert/${slug}`, title: c.metaTitle, description: c.description });
}

export default async function ConvertPairPage({ params }: { params: Params }) {
  const { locale, pair: slug } = await params;
  setRequestLocale(locale);
  const pair = getPair(slug);
  if (!pair) notFound();

  const from = getUnit(pair.from);
  const to = getUnit(pair.to);
  const c = buildPairContent(pair);
  const url = absoluteUrl(locale, `/convert/${slug}`);
  const reverse = reverseSlug(pair);
  const reverseFrom = to;
  const reverseTo = from;
  const siblings = pairsInCategory(from.category).filter((p) => pairSlug(p) !== slug && pairSlug(p) !== reverse);
  const values = tableValues(from);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: c.title,
      url,
      description: c.description,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      isAccessibleForFree: true,
      inLanguage: locale,
      datePublished: siteLaunched,
      dateModified: siteLaunched,
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
        { "@type": "ListItem", position: 2, name: "Conversions", item: absoluteUrl(locale, "/convert") },
        { "@type": "ListItem", position: 3, name: c.h1, item: url },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <JsonLd data={jsonLd} />
      <Breadcrumbs items={[{ name: "Conversions", href: "/convert" }, { name: c.h1 }]} />

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <header>
            <p className="label-mono">{categoryLabel[from.category]} · {from.symbol} → {to.symbol}</p>
            <h1 className="mt-2 text-3xl sm:text-5xl">{c.h1}</h1>
            <p className="mt-3 max-w-2xl text-lg leading-7 text-muted-foreground">
              {c.ratio ? `${c.ratio}.` : `Formula: ${c.formula}.`} Enter a value to convert it instantly.
            </p>
          </header>

          <AdSlot placement="top" className="mt-8" />

          <ToolFrame slug={slug} path={`convert/${slug}`} statusHint="Computed in your browser. Nothing is sent to a server." className="mt-6">
            <PairConverter fromId={pair.from} toId={pair.to} reverseHref={`/convert/${reverse}`} initial={from.category === "temperature" ? 20 : 1} />
          </ToolFrame>

          <article className="prose-tool mt-12">
            <div className="max-w-2xl">
              {c.intro.map((p, i) => (
                <p key={i} className={i === 0 ? "text-[17px] leading-8 text-foreground" : undefined}>
                  {p}
                </p>
              ))}
            </div>

            <h2 id="formula" className="scroll-mt-20">
              {from.symbol} to {to.symbol} formula
            </h2>
            <p className="brut inline-block px-4 py-2 font-mono text-base">{c.formula}</p>
            {c.ratio && <p>{c.ratio}. Multiply the value in {from.plural} by that factor to get {to.plural}.</p>}

            <h2 id="table" className="scroll-mt-20">
              {c.h1} conversion table
            </h2>
            <div className="not-prose overflow-x-auto border-2 border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted hover:bg-muted">
                    <TableHead className="label-mono">{from.plural}</TableHead>
                    <TableHead className="label-mono text-end">{to.plural}</TableHead>
                    <TableHead className="label-mono text-end">Rounded</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="font-mono text-[13px] tabular-nums">
                  {values.map((v) => {
                    const r = convert(v, from, to);
                    return (
                      <TableRow key={v}>
                        <TableCell>
                          {formatNumber(v, 6)} {from.symbol}
                        </TableCell>
                        <TableCell className="text-end text-brand-strong">
                          {formatNumber(r, 6)} {to.symbol}
                        </TableCell>
                        <TableCell className="text-end text-muted-foreground">{formatNumber(r, 3)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

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

          <section aria-labelledby="related-conversions" className="mt-12">
            <p className="label-mono">Related</p>
            <h2 id="related-conversions" className="mt-1 text-2xl">
              More {categoryLabel[from.category].toLowerCase()} conversions
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <li>
                <Link href={`/convert/${reverse}`} className="brut group flex items-center justify-between gap-3 px-4 py-3 text-sm font-semibold transition-[transform,box-shadow] hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-highlight hover:shadow-hard-sm">
                  {reverseFrom.plural} to {reverseTo.plural}
                  <ArrowUpRightIcon className="size-4" strokeWidth={2.5} />
                </Link>
              </li>
              {siblings.slice(0, 8).map((p) => (
                <li key={pairSlug(p)}>
                  <Link href={`/convert/${pairSlug(p)}`} className="brut group flex items-center justify-between gap-3 px-4 py-3 text-sm font-semibold transition-[transform,box-shadow] hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-highlight hover:shadow-hard-sm">
                    {getUnit(p.from).plural} to {getUnit(p.to).plural}
                    <ArrowUpRightIcon className="size-4" strokeWidth={2.5} />
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/tools/unit-converter" className="brut group flex items-center justify-between gap-3 bg-highlight px-4 py-3 text-sm font-semibold transition-[transform,box-shadow] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-hard-sm">
                  All units: Unit Converter
                  <ArrowUpRightIcon className="size-4" strokeWidth={2.5} />
                </Link>
              </li>
            </ul>
          </section>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-6">
            <nav aria-label="Other conversions" className="brut">
              <p className="border-b-2 border-border ink-block px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em]">Popular conversions</p>
              <ul className="divide-y-2 divide-border">
                {pairs
                  .filter((p) => pairSlug(p) !== slug)
                  .slice(0, 8)
                  .map((p) => (
                    <li key={pairSlug(p)}>
                      <Link href={`/convert/${pairSlug(p)}`} className="group flex items-center justify-between gap-3 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-highlight">
                        <span>
                          {getUnit(p.from).symbol} → {getUnit(p.to).symbol}
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
