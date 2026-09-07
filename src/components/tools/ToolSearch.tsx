"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { SearchIcon, XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToolCard } from "./ToolCard";
import type { Category } from "@/tools/types";

/** Serializable subset of ToolDefinition (no component) so it can cross the server/client boundary. */
export interface ToolSummary {
  slug: string;
  category: string;
  name: string;
  shortDescription: string;
  keywords: string[];
  icon: string;
}

interface Props {
  tools: ToolSummary[];
  categories: Category[];
}

export function ToolSearch({ tools, categories }: Props) {
  const t = useTranslations("home");
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query.trim().toLowerCase());

  const filtered = useMemo(() => {
    if (!deferred) return tools;
    return tools.filter((tool) =>
      [tool.name, tool.shortDescription, ...tool.keywords].some((s) => s.toLowerCase().includes(deferred)),
    );
  }, [tools, deferred]);

  const indexOf = (slug: string) => tools.findIndex((t) => t.slug === slug);
  const categoryName = (slug: string) => categories.find((c) => c.slug === slug)?.name;

  return (
    <div id="tools" className="scroll-mt-20">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="label-mono">Index</p>
          <h2 className="mt-1 text-2xl sm:text-3xl">{t("allTools")}</h2>
        </div>
        <p className="hidden font-mono text-xs text-muted-foreground sm:block">
          {String(filtered.length).padStart(2, "0")} / {String(tools.length).padStart(2, "0")}
        </p>
      </div>

      <div className="relative mt-6">
        <SearchIcon className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <label className="sr-only" htmlFor="tool-search">
          {t("searchPlaceholder")}
        </label>
        <Input
          id="tool-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="h-11 bg-card ps-9 pe-10 text-base shadow-hard md:text-base"
          autoComplete="off"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute end-1.5 top-1/2 -translate-y-1/2"
            onClick={() => setQuery("")}
            aria-label="Clear search"
          >
            <XIcon />
          </Button>
        )}
      </div>

      {deferred ? (
        filtered.length ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} index={indexOf(tool.slug)} category={categoryName(tool.category)} />
            ))}
          </div>
        ) : (
          <p className="mt-8 border-2 border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            {t("noResults", { query })}
          </p>
        )
      ) : (
        <div className="mt-10 space-y-14">
          {categories.map((category) => {
            const list = tools.filter((tool) => tool.category === category.slug);
            if (!list.length) return null;
            return (
              <section key={category.slug} aria-labelledby={`cat-${category.slug}`}>
                <div className="flex items-baseline justify-between gap-4 border-b-2 border-border pb-3">
                  <div>
                    <h3 id={`cat-${category.slug}`} className="font-display text-lg uppercase tracking-wide">
                      {category.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
                  </div>
                  <span className="label-mono-muted shrink-0">{list.length} tools</span>
                </div>
                <div className="stagger mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((tool, i) => (
                    <ToolCard
                      key={tool.slug}
                      tool={tool}
                      index={indexOf(tool.slug)}
                      style={{ ["--i" as string]: i }}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
