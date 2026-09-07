import type { ReactNode } from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ToolContent } from "@/tools/types";

export interface LinkTarget {
  href: string;
  /** Phrases that identify the target tool in prose (tool name, primary keyword). Matched case-insensitively. */
  phrases: string[];
}

const MAX_CONTEXT_LINKS = 4;

/**
 * Turns the first mention of another tool inside prose into an internal link.
 * Each target is linked at most once per article; at most MAX_CONTEXT_LINKS links in total.
 */
function createLinkifier(links: LinkTarget[]) {
  const used = new Set<string>();
  const patterns = links
    .flatMap((l) => l.phrases.map((p) => ({ href: l.href, phrase: p })))
    .filter((p) => p.phrase.length >= 4)
    .sort((a, b) => b.phrase.length - a.phrase.length);

  return function linkify(text: string, keyPrefix: string): ReactNode {
    if (!patterns.length || used.size >= MAX_CONTEXT_LINKS) return text;
    const lower = text.toLowerCase();
    let best: { index: number; length: number; href: string } | null = null;
    for (const p of patterns) {
      if (used.has(p.href)) continue;
      const idx = lower.indexOf(p.phrase.toLowerCase());
      if (idx === -1) continue;
      // whole-word boundaries only
      const before = idx === 0 ? " " : lower[idx - 1];
      const after = idx + p.phrase.length >= lower.length ? " " : lower[idx + p.phrase.length];
      if (/[a-z0-9]/.test(before) || /[a-z0-9]/.test(after)) continue;
      if (!best || idx < best.index) best = { index: idx, length: p.phrase.length, href: p.href };
    }
    if (!best) return text;
    used.add(best.href);
    const { index, length, href } = best;
    return (
      <>
        {text.slice(0, index)}
        <Link key={`${keyPrefix}-link`} href={href}>
          {text.slice(index, index + length)}
        </Link>
        {text.slice(index + length)}
      </>
    );
  };
}

export function ToolArticle({
  name,
  content,
  links = [],
}: {
  name: string;
  content: ToolContent;
  links?: LinkTarget[];
}) {
  const t = useTranslations("tool");
  const linkify = createLinkifier(links);

  return (
    <article className="prose-tool mt-12">
      <div className="max-w-2xl">
        {content.intro.map((p, i) => (
          <p key={i} className={i === 0 ? "text-[17px] leading-8 text-foreground" : undefined}>
            {linkify(p, `intro-${i}`)}
          </p>
        ))}
      </div>

      <h2 id="how-to-use" className="scroll-mt-20">
        {t("howToUse", { name })}
      </h2>
      <ol className="!list-none !ps-0 !space-y-3">
        {content.howTo.map((step, i) => (
          <li key={i} className="flex gap-4">
            <span className="mt-0.5 grid size-7 shrink-0 place-items-center ink-block font-mono text-[11px] font-bold">
              {i + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>

      {content.features.length > 0 && (
        <>
          <h2 id="features" className="scroll-mt-20">
            {t("features")}
          </h2>
          <ul className="!list-none !ps-0 grid gap-x-8 gap-y-2 sm:grid-cols-2">
            {content.features.map((f, i) => (
              <li key={i} className="flex gap-3">
                <CheckIcon className="mt-1.5 size-4 shrink-0 text-primary" strokeWidth={3} />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <h2 id="faq" className="scroll-mt-20">
        {t("faq")}
      </h2>
      <div className="brut divide-y-2 divide-border">
        {content.faq.map((item, i) => (
          <details key={i} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold transition-colors hover:bg-highlight [&::-webkit-details-marker]:hidden">
              <span className="ps-5">{item.question}</span>
              <ChevronDownIcon className="me-5 size-5 shrink-0 transition-transform duration-200 group-open:rotate-180" strokeWidth={2.5} />
            </summary>
            <p className="!mt-0 px-5 pb-5 text-muted-foreground">{linkify(item.answer, `faq-${i}`)}</p>
          </details>
        ))}
      </div>
    </article>
  );
}
