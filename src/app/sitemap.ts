import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site";
import { tools, getToolsByCategory } from "@/tools/registry";
import { categories } from "@/tools/categories";
import { pairSlug, pairs } from "@/convert/data";
import { zonePairSlug, zonePairs } from "@/timezones/data";
import { getToolDates, latestDate, siteLaunched } from "@/tools/dates";

function localizedUrl(locale: string, path: string): string {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${siteConfig.url}${prefix}${path}`;
}

const staticPages: Array<{
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
}> = [
  { path: "/about", changeFrequency: "yearly", priority: 0.3 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  // The home page lists every tool, so it changes whenever any tool does.
  const homeUpdated = latestDate(tools.map((tool) => getToolDates(tool.slug).updated));

  for (const locale of routing.locales) {
    entries.push({
      url: localizedUrl(locale, ""),
      lastModified: homeUpdated,
      changeFrequency: "weekly",
      priority: 1,
    });
    for (const tool of tools) {
      entries.push({
        url: localizedUrl(locale, `/tools/${tool.slug}`),
        lastModified: getToolDates(tool.slug).updated,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
    for (const category of categories) {
      const updated = latestDate(
        getToolsByCategory(category.slug).map((tool) => getToolDates(tool.slug).updated),
      );
      entries.push({
        url: localizedUrl(locale, `/category/${category.slug}`),
        lastModified: updated,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
    for (const page of staticPages) {
      entries.push({
        url: localizedUrl(locale, page.path),
        lastModified: siteLaunched,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      });
    }
    entries.push({ url: localizedUrl(locale, "/convert"), lastModified: new Date(siteLaunched), changeFrequency: "monthly", priority: 0.7 });
    for (const pair of pairs) {
      entries.push({ url: localizedUrl(locale, `/convert/${pairSlug(pair)}`), lastModified: new Date(siteLaunched), changeFrequency: "yearly", priority: 0.6 });
    }
    entries.push({ url: localizedUrl(locale, "/time"), lastModified: new Date(siteLaunched), changeFrequency: "monthly", priority: 0.7 });
    for (const pair of zonePairs) {
      entries.push({ url: localizedUrl(locale, `/time/${zonePairSlug(pair)}`), lastModified: new Date(siteLaunched), changeFrequency: "yearly", priority: 0.6 });
    }
  }
  return entries;
}
