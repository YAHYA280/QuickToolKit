import { useTranslations } from "next-intl";
import { ToolCard } from "./ToolCard";
import type { ToolDefinition } from "@/tools/types";

export function RelatedTools({ tools }: { tools: ToolDefinition[] }) {
  const t = useTranslations("tool");
  if (!tools.length) return null;
  return (
    <section aria-labelledby="related" className="mt-16">
      <p className="label-mono">Next up</p>
      <h2 id="related" className="mt-1 text-2xl font-semibold">
        {t("related")}
      </h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  );
}
