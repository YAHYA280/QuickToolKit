import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/privacy",
    title: "Privacy Policy",
    description: `How ${siteConfig.name} handles data, cookies and advertising.`,
  });
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="prose-tool mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-semibold sm:text-5xl">Privacy Policy</h1>
      <p className="label-mono">Last updated: September 2026</p>

      <h2>Summary</h2>
      <p>
        {siteConfig.name} does not require an account and does not collect the content you enter
        into any tool. All processing happens in your browser. The site uses cookies only for
        advertising and anonymous analytics, as described below.
      </p>

      <h2>Data you enter into tools</h2>
      <p>
        Text, numbers, files and other inputs are processed locally with JavaScript and are never
        transmitted to our servers. Closing the page discards them.
      </p>

      <h2>Advertising (Google AdSense)</h2>
      <p>
        We use Google AdSense to display ads. Google and its partners use cookies, including the
        DoubleClick cookie, to serve ads based on your prior visits to this and other websites.
        Third-party vendors may use cookies or web beacons to measure ad performance. You can opt
        out of personalized advertising at{" "}
        <a href="https://www.google.com/settings/ads">
          Google Ads Settings
        </a>{" "}
        or{" "}
        <a href="https://www.aboutads.info/choices/">
          aboutads.info
        </a>
        . Details on how Google uses data from sites that use its services are at{" "}
        <a href="https://policies.google.com/technologies/partner-sites">
          policies.google.com/technologies/partner-sites
        </a>
        .
      </p>

      <h2>Consent</h2>
      <p>
        Visitors from the European Economic Area, the United Kingdom and Switzerland are shown a
        consent message before any advertising cookies are set. You can change your choice at any
        time using the privacy link in the site footer or by clearing site data in your browser.
      </p>

      <h2>Analytics</h2>
      <p>
        We may use privacy-respecting, aggregated analytics to understand which tools are used.
        No personally identifiable information is collected.
      </p>

      <h2>Log data</h2>
      <p>
        Our hosting provider records standard server logs (IP address, user agent, requested URL,
        timestamp) for security and operational purposes. Logs are retained for a limited time.
      </p>

      <h2>Children</h2>
      <p>
        The site is not directed at children under 13 and we do not knowingly collect personal
        information from them.
      </p>

      <h2>Changes</h2>
      <p>
        This policy may be updated. The date at the top reflects the latest revision.
      </p>

      <h2>Contact</h2>
      <p>
        Privacy questions: <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
      </p>
    </div>
  );
}
