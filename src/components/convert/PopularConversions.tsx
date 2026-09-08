import { ArrowUpRightIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getUnit, pairSlug, pairs } from "@/convert/data";

/** Grid of links to the most searched conversion pages. Shown on the unit converter and the converters category. */
export function PopularConversions({ limit = 18 }: { limit?: number }) {
  return (
    <section aria-labelledby="popular-conversions" className="mt-16">
      <p className="label-mono">Quick answers</p>
      <div className="mt-1 flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="popular-conversions" className="text-2xl">
          Popular conversions
        </h2>
        <Link href="/convert" className="font-mono text-[11px] font-bold uppercase tracking-wider hover:bg-highlight">
          All {pairs.length} conversions
        </Link>
      </div>
      <ul className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {pairs.slice(0, limit).map((p) => {
          const f = getUnit(p.from);
          const t = getUnit(p.to);
          return (
            <li key={pairSlug(p)}>
              <Link
                href={`/convert/${pairSlug(p)}`}
                className="group flex items-center justify-between gap-3 border-2 border-border bg-card px-3 py-2 text-sm font-semibold transition-colors hover:bg-highlight"
              >
                <span>
                  {f.plural} to {t.plural}
                  <span className="ms-2 font-mono text-[11px] font-normal text-muted-foreground">
                    {f.symbol} → {t.symbol}
                  </span>
                </span>
                <ArrowUpRightIcon className="size-4 shrink-0" strokeWidth={2.5} />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
