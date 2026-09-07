import { ArrowUpRightIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { ToolDefinition } from "@/tools/types";

type CardTool = Pick<ToolDefinition, "slug" | "name" | "shortDescription" | "icon">;

interface Props {
  tool: CardTool;
  index?: number;
  category?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function ToolCard({ tool, index, category, className, style }: Props) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      style={style}
      className={cn(
        "group relative flex flex-col rounded-lg border border-border bg-card p-5 transition-colors duration-200",
        "hover:border-brand/70 focus-visible:border-brand focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] tracking-wider text-muted-foreground">
          {index !== undefined ? String(index + 1).padStart(2, "0") : tool.icon}
        </span>
        <ArrowUpRightIcon className="size-4 text-muted-foreground transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand" />
      </div>
      <span className="mt-7 font-display text-lg font-semibold leading-tight tracking-tight">{tool.name}</span>
      <span className="mt-1.5 text-sm leading-6 text-muted-foreground">{tool.shortDescription}</span>
      {category && (
        <span className="mt-5 inline-flex w-fit rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          {category}
        </span>
      )}
    </Link>
  );
}
