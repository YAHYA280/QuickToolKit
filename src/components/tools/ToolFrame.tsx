import type { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface Props {
  slug: string;
  statusLabel?: string;
  statusHint?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Window-like chrome around every tool: black title bar with the path on the left, live status on the right. */
export function ToolFrame({ slug, statusLabel = "runs locally", statusHint, actions, children, className }: Props) {
  return (
    <section aria-label={slug} className={cn("animate-rise brut overflow-hidden", className)}>
      <div className="flex h-10 items-center justify-between gap-3 bg-foreground px-4 text-background">
        <span className="truncate font-mono text-[11px] font-bold uppercase tracking-[0.1em]">~/tools/{slug}</span>
        <div className="flex items-center gap-2">
          {actions}
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex cursor-default items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em]" tabIndex={0}>
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping bg-success/60 motion-reduce:hidden" />
                  <span className="relative inline-flex size-2 bg-success" />
                </span>
                {statusLabel}
              </span>
            </TooltipTrigger>
            {statusHint && <TooltipContent side="bottom">{statusHint}</TooltipContent>}
          </Tooltip>
        </div>
      </div>
      {children}
    </section>
  );
}
