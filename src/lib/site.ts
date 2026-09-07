if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_SITE_URL) {
  console.warn("[site] NEXT_PUBLIC_SITE_URL is not set; canonical URLs and the sitemap will point at localhost.");
}

export const siteConfig = {
  name: "TabUtils",
  tagline: "Free online tools, calculators and converters",
  description:
    "Fast, free, privacy-friendly online tools. Format JSON, decode JWTs, generate passwords, calculate loans and more. Everything runs in your browser.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  author: "TabUtils",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@tabutils.com",
  twitter: "",
};

export const adsConfig = {
  client: process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "",
  slots: {
    top: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP ?? "",
    inArticle: process.env.NEXT_PUBLIC_ADSENSE_SLOT_INARTICLE ?? "",
    sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR ?? "",
  },
};

export const adsEnabled = adsConfig.client.length > 0;
