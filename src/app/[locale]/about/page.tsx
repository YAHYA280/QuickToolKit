import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/about",
    title: "About",
    description: `Who builds ${siteConfig.name}, why every tool runs in your browser, and how the site is funded.`,
  });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="prose-tool mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-semibold sm:text-5xl">About {siteConfig.name}</h1>
      <p>
        {siteConfig.name} is a collection of free online tools built by a web developer who got
        tired of utility sites that upload your data, hide the tool under ten ads, or stop working
        without an account. Every tool here runs entirely in your browser using standard web APIs.
        Nothing you paste, type or calculate is sent to a server.
      </p>
      <h2>What you will find</h2>
      <ul>
        <li>Developer utilities: JSON formatting, encoding and decoding, hashing, regex testing.</li>
        <li>Text tools: word and character counting, case conversion, password generation.</li>
        <li>Finance calculators: loan payments, compound interest, percentages.</li>
        <li>Converters for units and colors.</li>
      </ul>
      <h2>How the site is funded</h2>
      <p>
        The site is free and supported by advertising. Ads are served by Google AdSense and are
        kept out of the tool area so they never get in the way of your work. See the{" "}
        <Link href="/privacy">
          privacy policy
        </Link>{" "}
        for how advertising cookies are handled.
      </p>
      <h2>Accuracy</h2>
      <p>
        Calculators use standard formulas that are documented on each tool page. They are intended
        for estimates and education. For financial, legal or medical decisions, confirm results with
        a qualified professional.
      </p>
      <h2>Contact</h2>
      <p>
        Found a bug or want a new tool? Reach out via the{" "}
        <Link href="/contact">
          contact page
        </Link>
        .
      </p>
    </div>
  );
}
