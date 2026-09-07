import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ToolCard } from "@/components/tools/ToolCard";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { categories, getCategory, isCategorySlug } from "@/tools/categories";
import { getToolsByCategory, tools } from "@/tools/registry";

type Params = Promise<{ locale: string; category: string }>;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    categories.map((category) => ({ locale, category: category.slug })),
  );
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return pageMetadata({
    locale,
    path: `/category/${category.slug}`,
    title: category.title,
    description: category.description,
  });
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { locale, category: slug } = await params;
  setRequestLocale(locale);
  if (!isCategorySlug(slug)) notFound();

  const category = getCategory(slug)!;
  const list = getToolsByCategory(slug);
  const t = await getTranslations("category");
  const url = absoluteUrl(locale, `/category/${category.slug}`);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl(locale, "/") },
        { "@type": "ListItem", position: 2, name: category.name, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: category.name,
      description: category.description,
      url,
      numberOfItems: list.length,
      itemListElement: list.map((tool, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: tool.name,
        url: absoluteUrl(locale, `/tools/${tool.slug}`),
      })),
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <JsonLd data={jsonLd} />
      <Breadcrumbs items={[{ name: category.name }]} />

      <header className="mt-8 grid gap-6 border-b border-border pb-8 md:grid-cols-[1fr_auto] md:items-end">
        <div className="max-w-2xl">
          <p className="label-mono">{t("toolsCount", { count: list.length })}</p>
          <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">{category.name}</h1>
          <p className="mt-3 text-lg leading-7 text-muted-foreground">{category.description}</p>
        </div>
        <nav aria-label="Other categories" className="flex flex-wrap gap-1.5 md:justify-end">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              aria-current={c.slug === slug ? "page" : undefined}
              className={cn(
                "rounded-md border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors",
                c.slug === slug
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
              )}
            >
              {c.name}
            </Link>
          ))}
        </nav>
      </header>

      <div className="stagger mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((tool, i) => (
          <ToolCard
            key={tool.slug}
            tool={tool}
            index={tools.findIndex((x) => x.slug === tool.slug)}
            style={{ ["--i" as string]: i }}
          />
        ))}
      </div>

      <section aria-labelledby="about-category" className="prose-tool mt-16 max-w-3xl">
        <h2 id="about-category" className="scroll-mt-20">
          {`About these ${category.name.toLowerCase()}`}
        </h2>
        {category.intro.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </section>
    </div>
  );
}
