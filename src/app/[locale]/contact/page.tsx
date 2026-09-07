import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { tools } from "@/tools/registry";
import { ContactForm } from "./ContactForm";

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
    description: `Report a bug, request a tool or ask a question about ${siteConfig.name}. We reply within one to three business days.`,
  });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const toolOptions = tools.map((t) => ({ slug: t.slug, name: t.name }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="label-mono">Contact</p>
      <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">Tell us what broke, or what to build next</h1>
      <p className="mt-4 max-w-2xl text-lg leading-7 text-muted-foreground">
        Bug reports, tool requests and questions all land in the same inbox. Include the tool name and, if relevant,
        the input that caused a problem.
      </p>

      <div className="mt-8">
        <ContactForm tools={toolOptions} />
      </div>

      <div className="prose-tool mt-12 max-w-2xl">
        <h2>Prefer email?</h2>
        <p>
          Write to <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>. Same inbox, same
          reply time.
        </p>
        <h2>Before you write</h2>
        <ul>
          <li>All tools run client-side, so there are no accounts and nothing to recover.</li>
          <li>For advertising or privacy questions, the privacy policy answers most of them.</li>
          <li>Replies usually take one to three business days.</li>
        </ul>
      </div>
    </div>
  );
}
