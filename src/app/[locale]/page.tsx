import type { Metadata } from "next";
import { ArrowRightIcon, ArrowUpRightIcon } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { ToolSearch, type ToolSummary } from "@/components/tools/ToolSearch";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, alternatesFor, ogImage, ogLocale, siteOgImage } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { categories } from "@/tools/categories";
import { getPopularTools, tools } from "@/tools/registry";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = `${siteConfig.name} – ${siteConfig.tagline}`;
  return {
    title: { absolute: title },
    description: siteConfig.description,
    alternates: alternatesFor(locale, "/"),
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: ogLocale(locale),
      title,
      description: siteConfig.description,
      url: absoluteUrl(locale, "/"),
      images: [ogImage(locale, siteOgImage)],
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const popular = getPopularTools(6);
  const organizationId = `${siteConfig.url}/#organization`;

  const summaries: ToolSummary[] = tools.map((tool) => ({
    slug: tool.slug,
    category: tool.category,
    name: tool.name,
    shortDescription: tool.shortDescription,
    keywords: tool.keywords,
    icon: tool.icon,
  }));

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": organizationId,
            name: siteConfig.name,
            url: siteConfig.url,
            logo: `${siteConfig.url}/icon.svg`,
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: siteConfig.name,
            url: siteConfig.url,
            description: siteConfig.description,
            inLanguage: locale,
            publisher: { "@id": organizationId },
          },
        ]}
      />

      <section className="relative overflow-hidden border-b-2 border-border bg-highlight text-highlight-foreground">
        <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 pt-14 pb-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:pt-20 lg:pb-20">
          <div className="animate-fade">
            <p className="label-mono">Free · client-side · no account</p>
            <h1 className="mt-5 text-[2.5rem] leading-[0.95] sm:text-6xl lg:text-[4.5rem]">
              Tools that run
              <br />
              in the tab.
              <br />
              <span className="ink-block inline-block px-2">Not the cloud.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-foreground/90">{t("subtitle")}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="h-11 px-5 text-[15px]">
                <Link href="/#tools">
                  Browse all {tools.length} tools <ArrowRightIcon data-icon="inline-end" strokeWidth={2.5} />
                </Link>
              </Button>
              <span className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider">
                or press
                <KbdGroup>
                  <Kbd>Ctrl</Kbd>
                  <Kbd>K</Kbd>
                </KbdGroup>
              </span>
            </div>
          </div>

          <aside className="animate-rise brut shadow-hard-lg" aria-label="Popular tools">
            <div className="flex h-10 items-center justify-between ink-block px-4">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.1em]">~/popular</span>
              <span className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em]">
                <span className="size-2 bg-success" /> runs locally
              </span>
            </div>
            <ul className="divide-y-2 divide-border">
              {popular.map((tool, i) => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    <span className="w-6 font-mono text-[11px] font-bold">{String(i + 1).padStart(2, "0")}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-[13px] uppercase tracking-wide">{tool.name}</span>
                      <span className="block truncate text-xs text-muted-foreground group-hover:text-primary-foreground/80">{tool.shortDescription}</span>
                    </span>
                    <ArrowUpRightIcon className="size-4" strokeWidth={2.5} />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="grid grid-cols-3 divide-x-2 divide-border border-t-2 border-border font-mono text-[11px] font-bold uppercase tracking-wider">
              {[
                [String(tools.length), "tools"],
                ["0", "uploads"],
                ["0", "accounts"],
              ].map(([n, label]) => (
                <div key={label} className="px-4 py-2.5">
                  <span className="text-primary">{n}</span> <span>{label}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <ToolSearch tools={summaries} categories={categories} />
      </section>
    </>
  );
}
