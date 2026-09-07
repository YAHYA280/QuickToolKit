import Script from "next/script";
import { adsConfig, adsEnabled } from "@/lib/site";

/**
 * Loads the AdSense loader once, after hydration. Auto Ads, anchor ads and
 * Google's consent message (Privacy & messaging) are all served through this
 * single tag once configured in the AdSense dashboard.
 */
export function AdSenseScript() {
  if (!adsEnabled) return null;
  return (
    <Script
      id="adsbygoogle-init"
      strategy="afterInteractive"
      async
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsConfig.client}`}
    />
  );
}
