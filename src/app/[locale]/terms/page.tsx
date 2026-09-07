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
    path: "/terms",
    title: "Terms of Use",
    description: `Terms for using the free tools on ${siteConfig.name}.`,
  });
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="prose-tool mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-semibold sm:text-5xl">Terms of Use</h1>
      <p className="label-mono">Last updated: September 2026</p>

      <h2>Use of the tools</h2>
      <p>
        The tools on {siteConfig.name} are provided free of charge for personal and commercial
        use. You may not attempt to disrupt the site, scrape it at high volume, or reproduce it as
        your own service.
      </p>

      <h2>No warranty</h2>
      <p>
        The tools are provided &quot;as is&quot; without warranty of any kind. Calculators produce
        estimates based on standard formulas; results may differ from those of banks, tax
        authorities or other institutions. Always verify important figures independently.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, {siteConfig.name} is not liable for any loss or
        damage arising from use of, or reliance on, the tools or content on this site.
      </p>

      <h2>Advertising</h2>
      <p>
        The site displays third-party advertisements. We do not endorse advertised products and
        are not responsible for third-party content.
      </p>

      <h2>Changes</h2>
      <p>These terms may change. Continued use of the site means you accept the current version.</p>
    </div>
  );
}
