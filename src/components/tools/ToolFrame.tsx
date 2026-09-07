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

/** Window-like chrome around every tool: mono path on the left, live status + optional actions on the right. */
export function ToolFrame({ slug, statusLabel = "runs locally", statusHint, actions, children, className }: Props) {
  return (
    <section
      aria-label={slug}
      className={cn(
        "animate-rise overflow-hidden rounded-xl border border-border bg-card shadow-[0_1px_0_0_var(--border),0_24px_60px_-40px_rgb(0_0_0/0.4)]",
        className,
      )}
    >
      <div className="flex h-10 items-center justify-between gap-3 border-b border-border bg-muted/40 px-4">
        <span className="truncate font-mono text-[11px] text-muted-foreground">~/tools/{slug}</span>
        <div className="flex items-center gap-2">
          {actions}
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex cursor-default items-center gap-1.5 font-mono text-[11px] text-muted-foreground" tabIndex={0}>
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-success/60 motion-reduce:hidden" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-success" />
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
