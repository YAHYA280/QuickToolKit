"use client";

import { useEffect, useRef } from "react";
import { adsConfig, adsEnabled } from "@/lib/site";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type Placement = "top" | "inArticle" | "sidebar";

const minHeight: Record<Placement, number> = {
  top: 100,
  inArticle: 250,
  sidebar: 600,
};

interface AdSlotProps {
  placement: Placement;
  className?: string;
}

/**
 * Responsive AdSense unit. Reserves height so ads never shift layout (CLS).
 * Renders a labelled placeholder in development when no client id is set.
 */
export function AdSlot({ placement, className = "" }: AdSlotProps) {
  const slot = adsConfig.slots[placement];
  const pushed = useRef(false);

  useEffect(() => {
    if (!adsEnabled || !slot || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // adsbygoogle not ready; Auto Ads still cover the page
    }
  }, [slot]);

  if (!adsEnabled || !slot) {
    if (process.env.NODE_ENV === "production") return null;
    return (
      <div
        aria-hidden
        className={cn("label-mono-muted flex items-center justify-center border-2 border-dashed border-border/40", className)}
        style={{ minHeight: minHeight[placement] }}
      >
        ad · {placement}
      </div>
    );
  }

  return (
    <div
      className={cn(placement === "top" && "min-h-[250px] md:min-h-[100px]", className)}
      style={placement === "top" ? undefined : { minHeight: minHeight[placement] }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adsConfig.client}
        data-ad-slot={slot}
        data-ad-format={placement === "inArticle" ? "fluid" : "auto"}
        data-ad-layout={placement === "inArticle" ? "in-article" : undefined}
        data-full-width-responsive="true"
      />
    </div>
  );
}
