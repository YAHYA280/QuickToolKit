import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRightIcon } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { AdSlot } from "@/components/ads/AdSlot";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { ToolArticle } from "@/components/tools/ToolArticle";
import { ToolFrame } from "@/components/tools/ToolFrame";
import { ToolRenderer } from "@/components/tools/ToolRenderer";
import { CopyLinkButton } from "@/components/tools/CopyLinkButton";
import { Badge } from "@/components/ui/badge";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { getCategory } from "@/tools/categories";
import { getToolDates } from "@/tools/dates";
import { toolAliases } from "@/tools/aliases";
import { PopularConversions } from "@/components/convert/PopularConversions";
import { getRelatedTools, getTool, getToolContent, getToolsByCategory, tools } from "@/tools/registry";

type Params = Promise<{ locale: string; slug: string }>;

function formatDate(iso: string, locale: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => tools.map((tool) => ({ locale, slug: tool.slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  const content = getToolContent(tool, locale);
  return pageMetadata({
    locale,
    path: `/tools/${tool.slug}`,
    title: content.title,
    description: content.description,
    keywords: tool.keywords,
    image: {
      path: `/tools/${tool.slug}/opengraph-image`,
      alt: content.title,
      version: getToolDates(tool.slug).updated,
    },
  });
}

export default async function ToolPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const tool = getTool(slug);
  if (!tool) notFound();

  const t = await getTranslations("tool");
  const content = getToolContent(tool, locale);
  const category = getCategory(tool.category);
  const related = getRelatedTools(tool);
  const siblings = getToolsByCategory(tool.category).filter((s) => s.slug !== tool.slug);
  const url = absoluteUrl(locale, `/tools/${tool.slug}`);
  const dates = getToolDates(tool.slug);
  const linkTargets = tools
    .filter((x) => x.slug !== tool.slug)
    .map((x) => ({ href: `/tools/${x.slug}`, phrases: [x.name, ...(toolAliases[x.slug] ?? []), ...x.keywords.filter((k) => k.length >= 5)] }));

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: tool.name,
      url,
      description: content.description,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript",
      inLanguage: locale,
      isAccessibleForFree: true,
      datePublished: dates.published,
      dateModified: dates.updated,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: content.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl(locale, "/") },
        ...(category
          ? [
              {
                "@type": "ListItem",
                position: 2,
                name: category.name,
                item: absoluteUrl(locale, `/category/${category.slug}`),
              },
            ]
          : []),
        { "@type": "ListItem", position: category ? 3 : 2, name: tool.name, item: url },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <JsonLd data={jsonLd} />
      <Breadcrumbs
        items={[
          ...(category ? [{ name: category.name, href: `/category/${category.slug}` }] : []),
          { name: tool.name },
        ]}
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <header className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {category && <p className="label-mono">{category.name}</p>}
                {tool.popular && (
                  <Badge className="bg-highlight text-highlight-foreground">
                    Popular
                  </Badge>
                )}
              </div>
              <div className="mt-2 flex items-center gap-4">
                <span
                  aria-hidden
                  className="brut hidden size-12 shrink-0 place-items-center bg-highlight font-mono text-sm font-bold text-highlight-foreground sm:grid"
                >
                  {tool.icon}
                </span>
                <h1 className="text-3xl sm:text-5xl">{tool.name}</h1>
              </div>
              <p className="mt-3 text-lg leading-7 text-muted-foreground">{tool.shortDescription}</p>
              <p className="label-mono-muted mt-3">
                {t("updatedOn", { date: formatDate(dates.updated, locale) })}
              </p>
              {tool.category === "finance" && (
                <p className="mt-4 max-w-xl border-2 border-border bg-highlight px-3 py-2 text-sm font-medium text-highlight-foreground">
                  {t("financeDisclaimer")}
                </p>
              )}
            </div>
            <div className="shrink-0">
              <CopyLinkButton />
            </div>
          </header>

          <AdSlot placement="top" className="mt-8" />

          <ToolFrame slug={tool.slug} statusHint={t("privacyNote")} className="mt-6">
            <ToolRenderer slug={tool.slug} />
          </ToolFrame>

          <AdSlot placement="inArticle" className="mt-10" />

          <ToolArticle name={tool.name} content={content} links={linkTargets} />

          {tool.slug === "unit-converter" && <PopularConversions />}

          <RelatedTools tools={related} />
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-6">
            {siblings.length > 0 && category && (
              <nav aria-label={t("moreIn", { category: category.name })} className="brut">
                <p className="border-b-2 border-border ink-block px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em]">{t("moreIn", { category: category.name })}</p>
                <ul className="divide-y-2 divide-border">
                  {siblings.slice(0, 6).map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/tools/${s.slug}`}
                        className="group flex items-center justify-between gap-3 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-highlight"
                      >
                        <span>{s.name}</span>
                        <ArrowUpRightIcon className="size-4" strokeWidth={2.5} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            <AdSlot placement="sidebar" />
          </div>
        </aside>
      </div>
    </div>
  );
}
