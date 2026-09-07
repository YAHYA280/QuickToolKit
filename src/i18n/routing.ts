import { defineRouting } from "next-intl/routing";

// Add "fr" / "ar" here (plus messages/<locale>.json and tool content) to enable a locale.
export const routing = defineRouting({
  locales: ["en"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  // Single locale today: skip the NEXT_LOCALE cookie (keeps HTML CDN-cacheable) and Accept-Language redirects.
  localeCookie: false,
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

export const localeDirection: Record<string, "ltr" | "rtl"> = {
  en: "ltr",
  fr: "ltr",
  ar: "rtl",
};
