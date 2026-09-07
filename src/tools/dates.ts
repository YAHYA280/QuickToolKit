/**
 * Publication and last-updated dates (ISO 8601, UTC) for every tool.
 * Used by the sitemap (<lastmod>) and by tool JSON-LD (datePublished / dateModified).
 * Bump `updated` when a tool's UI or article content changes meaningfully.
 */
export interface ToolDates {
  published: string;
  updated: string;
}

/** Date the site (and its static pages) first went live. */
export const siteLaunched = "2026-09-07";

export const toolDates: Record<string, ToolDates> = {
  "json-formatter": { published: "2026-09-07", updated: "2026-09-07" },
  base64: { published: "2026-09-07", updated: "2026-09-07" },
  "url-encoder": { published: "2026-09-07", updated: "2026-09-07" },
  "jwt-decoder": { published: "2026-09-07", updated: "2026-09-07" },
  "uuid-generator": { published: "2026-09-07", updated: "2026-09-07" },
  "hash-generator": { published: "2026-09-07", updated: "2026-09-07" },
  "regex-tester": { published: "2026-09-07", updated: "2026-09-07" },
  "word-counter": { published: "2026-09-07", updated: "2026-09-07" },
  "case-converter": { published: "2026-09-07", updated: "2026-09-07" },
  "password-generator": { published: "2026-09-07", updated: "2026-09-07" },
  "color-converter": { published: "2026-09-07", updated: "2026-09-07" },
  "unit-converter": { published: "2026-09-07", updated: "2026-09-07" },
  "loan-calculator": { published: "2026-09-07", updated: "2026-09-07" },
  "compound-interest-calculator": { published: "2026-09-07", updated: "2026-09-07" },
  "percentage-calculator": { published: "2026-09-07", updated: "2026-09-07" },
  "qr-code-generator": { published: "2026-09-07", updated: "2026-09-07" },
  "unix-timestamp-converter": { published: "2026-09-07", updated: "2026-09-07" },
  "image-compressor": { published: "2026-09-07", updated: "2026-09-07" },
  "image-resizer": { published: "2026-09-07", updated: "2026-09-07" },
  "text-diff": { published: "2026-09-07", updated: "2026-09-07" },
};

/** Dates for a tool, falling back to the site launch date for unknown slugs. */
export function getToolDates(slug: string): ToolDates {
  return toolDates[slug] ?? { published: siteLaunched, updated: siteLaunched };
}

/** Latest ISO date among the given dates (string compare is safe for YYYY-MM-DD). */
export function latestDate(dates: string[]): string {
  return dates.reduce((max, d) => (d > max ? d : max), siteLaunched);
}
