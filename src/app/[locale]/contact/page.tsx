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
    path: "/contact",
    title: "Contact",
    description: `Report a bug, request a tool or ask a question about ${siteConfig.name}.`,
  });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="prose-tool mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-semibold sm:text-5xl">Contact</h1>
      <p>
        Questions, bug reports and tool requests are welcome. Email{" "}
        <a href={`mailto:${siteConfig.contactEmail}`}>
          {siteConfig.contactEmail}
        </a>{" "}
        and include the tool name and, if relevant, the input that caused a problem.
      </p>
      <h2>Before you write</h2>
      <ul>
        <li>All tools run client-side, so no account or data recovery is possible.</li>
        <li>For advertising or privacy questions, see the privacy policy first.</li>
        <li>Replies usually take one to three business days.</li>
      </ul>
    </div>
  );
}
