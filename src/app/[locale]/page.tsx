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

      <section className="relative overflow-hidden border-b border-border">
        <div className="bg-grid bg-grid-fade pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 pt-16 pb-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:pt-24 lg:pb-20">
          <div className="animate-fade">
            <p className="label-mono">Free · client-side · no account</p>
            <h1 className="mt-4 text-[2.6rem] leading-[1.02] font-semibold sm:text-6xl lg:text-[4.25rem]">
              Tools that run
              <br />
              in the tab,{" "}
              <span className="relative inline-block">
                <span className="relative z-10">not the cloud</span>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-1 z-0 h-3 -rotate-1 bg-brand/30 sm:h-4"
                />
              </span>
              .
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">{t("subtitle")}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="h-10 px-4">
                <Link href="/#tools">
                  Browse all {tools.length} tools <ArrowRightIcon data-icon="inline-end" />
                </Link>
              </Button>
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                or press
                <KbdGroup>
                  <Kbd>Ctrl</Kbd>
                  <Kbd>K</Kbd>
                </KbdGroup>
              </span>
            </div>
          </div>

          <aside
            className="animate-rise rounded-xl border border-border bg-card shadow-[0_1px_0_0_var(--border),0_20px_50px_-30px_rgb(0_0_0/0.35)]"
            aria-label="Popular tools"
          >
            <div className="flex h-9 items-center justify-between border-b border-border bg-muted/40 px-4">
              <span className="font-mono text-[11px] text-muted-foreground">~/popular</span>
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                <span className="size-1.5 rounded-full bg-success" /> runs locally
              </span>
            </div>
            <ul className="divide-y divide-border">
              {popular.map((tool, i) => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-accent"
                  >
                    <span className="w-6 font-mono text-[11px] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1">
                      <span className="block text-sm font-medium">{tool.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">{tool.shortDescription}</span>
                    </span>
                    <ArrowUpRightIcon className="size-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand" />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="grid grid-cols-3 divide-x divide-border border-t border-border font-mono text-[11px]">
              {[
                [String(tools.length), "tools"],
                ["0", "uploads"],
                ["0", "accounts"],
              ].map(([n, label]) => (
                <div key={label} className="px-4 py-2.5">
                  <span className="text-foreground">{n}</span>{" "}
                  <span className="text-muted-foreground">{label}</span>
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
