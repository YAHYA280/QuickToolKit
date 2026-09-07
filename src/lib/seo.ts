import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site";
import { siteLaunched } from "@/tools/dates";

export function localizedPath(locale: string, path: string): string {
  const clean = path === "/" ? "" : path;
  return locale === routing.defaultLocale ? clean || "/" : `/${locale}${clean}`;
}

export function absoluteUrl(locale: string, path: string): string {
  const p = localizedPath(locale, path);
  return `${siteConfig.url}${p === "/" ? "" : p}`;
}

/** canonical + hreflang alternates for every configured locale */
export function alternatesFor(locale: string, path: string): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = absoluteUrl(l, path);
  languages["x-default"] = absoluteUrl(routing.defaultLocale, path);
  return { canonical: absoluteUrl(locale, path), languages };
}

const openGraphLocales: Record<string, string> = { en: "en_US", fr: "fr_FR", ar: "ar_AR" };

/** Open Graph locale code (e.g. en_US) for a routing locale */
export function ogLocale(locale: string): string {
  return openGraphLocales[locale] ?? locale;
}

export const ogImageSize = { width: 1200, height: 630 } as const;

export interface OgImageOptions {
  /** Un-localized path of a generated opengraph-image route, e.g. "/tools/json-formatter/opengraph-image" */
  path: string;
  alt: string;
  /** Cache-busting token, typically the content's last-updated date */
  version: string;
}

/**
 * Open Graph image descriptor for a generated opengraph-image route.
 * The file convention would emit "/en/…/opengraph-image", which the next-intl proxy
 * answers with a 307 for the default locale (localePrefix "as-needed"). Building the
 * URL with absoluteUrl() drops the prefix so crawlers get the image in one request.
 */
export function ogImage(locale: string, { path, alt, version }: OgImageOptions) {
  return {
    url: `${absoluteUrl(locale, path)}?v=${encodeURIComponent(version)}`,
    width: ogImageSize.width,
    height: ogImageSize.height,
    type: "image/png",
    alt,
  };
}

/** Site-wide image rendered by app/[locale]/opengraph-image.tsx */
export const siteOgImage: OgImageOptions = {
  path: "/opengraph-image",
  alt: `${siteConfig.name} – ${siteConfig.tagline}`,
  version: siteLaunched,
};

interface PageMetadataOptions {
  locale: string;
  /** Un-localized path, e.g. "/about" or "/tools/json-formatter" */
  path: string;
  /** Page title; the layout template appends the site name */
  title: string;
  description: string;
  keywords?: string[];
  /** Defaults to the site-wide image */
  image?: OgImageOptions;
}

/**
 * Title, description, canonical + hreflang and Open Graph for a page.
 * Page-level `openGraph` replaces the layout's, so siteName/type are repeated here.
 * Twitter card tags are auto-filled by Next from Open Graph.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  image = siteOgImage,
}: PageMetadataOptions): Metadata {
  return {
    title,
    description,
    alternates: alternatesFor(locale, path),
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: ogLocale(locale),
      title,
      description,
      url: absoluteUrl(locale, path),
      images: [ogImage(locale, image)],
    },
  };
}
