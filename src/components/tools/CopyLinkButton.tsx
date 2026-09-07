"use client";

import { CheckIcon, LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useCopy } from "@/components/tools/ui";

export function CopyLinkButton({ label = "Copy link" }: { label?: string }) {
  const { copied, copy } = useCopy(1800);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={() => copy(window.location.href)}
          aria-label={label}
          aria-live="polite"
        >
          {copied ? <CheckIcon data-icon="inline-start" className="text-success" /> : <LinkIcon data-icon="inline-start" />}
          {copied ? "Copied" : label}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Copy this tool&apos;s URL</TooltipContent>
    </Tooltip>
  );
}
