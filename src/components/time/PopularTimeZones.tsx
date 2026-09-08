import { ArrowUpRightIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getZone, zonePairSlug, zonePairs } from "@/timezones/data";

/** Grid of links to the most searched time zone pages. Shown on the Unix timestamp tool. */
export function PopularTimeZones({ limit = 12 }: { limit?: number }) {
  return (
    <section aria-labelledby="popular-zones" className="mt-16">
      <p className="label-mono">Quick answers</p>
      <div className="mt-1 flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="popular-zones" className="text-2xl">
          Time zone conversions
        </h2>
        <Link href="/time" className="font-mono text-[11px] font-bold uppercase tracking-wider hover:bg-highlight">
          All {zonePairs.length} pages
        </Link>
      </div>
      <ul className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {zonePairs.slice(0, limit).map((p) => (
          <li key={zonePairSlug(p)}>
            <Link
              href={`/time/${zonePairSlug(p)}`}
              className="group flex items-center justify-between gap-3 border-2 border-border bg-card px-3 py-2 text-sm font-semibold transition-colors hover:bg-highlight"
            >
              <span>
                {getZone(p.from).abbr} to {getZone(p.to).abbr}
                <span className="ms-2 font-mono text-[11px] font-normal text-muted-foreground">{getZone(p.to).name}</span>
              </span>
              <ArrowUpRightIcon className="size-4 shrink-0" strokeWidth={2.5} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
