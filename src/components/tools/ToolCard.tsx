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
        "group brut relative flex flex-col p-5 transition-[transform,box-shadow,background-color] duration-100",
        "hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-highlight hover:shadow-hard-sm",
        "focus-visible:bg-highlight focus-visible:outline-none",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] font-bold tracking-wider">
          {index !== undefined ? String(index + 1).padStart(2, "0") : tool.icon}
        </span>
        <ArrowUpRightIcon className="size-5" strokeWidth={2.5} />
      </div>
      <span className="mt-7 font-display text-[15px] uppercase leading-tight tracking-wide">{tool.name}</span>
      <span className="mt-2 text-sm leading-6 text-muted-foreground group-hover:text-highlight-foreground">{tool.shortDescription}</span>
      {category && (
        <span className="mt-5 inline-flex w-fit border-2 border-border bg-card px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em]">
          {category}
        </span>
      )}
    </Link>
  );
}
