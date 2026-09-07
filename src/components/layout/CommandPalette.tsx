"use client";

import { useCallback } from "react";
import { useRouter } from "@/i18n/navigation";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { ToolSummary } from "@/components/tools/ToolSearch";
import type { Category } from "@/tools/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tools: ToolSummary[];
  categories: Category[];
}

/** The heavy part of the command menu (cmdk + dialog). Loaded on first open only. */
export default function CommandPalette({ open, onOpenChange, tools, categories }: Props) {
  const router = useRouter();
  const go = useCallback(
    (href: string) => {
      onOpenChange(false);
      router.push(href);
    },
    [router, onOpenChange],
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Search tools" description="Jump to any tool" className="sm:max-w-xl">
      <Command filter={(value, search) => (value.toLowerCase().includes(search.trim().toLowerCase()) ? 1 : 0)}>
        <CommandInput placeholder="Type a tool name, e.g. jwt, loan, regex" />
        <CommandList>
          <CommandEmpty>No tools found.</CommandEmpty>
          {categories.map((category) => {
            const list = tools.filter((t) => t.category === category.slug);
            if (!list.length) return null;
            return (
              <CommandGroup key={category.slug} heading={category.name}>
                {list.map((tool) => (
                  <CommandItem
                    key={tool.slug}
                    value={`${tool.name} ${tool.keywords.join(" ")}`}
                    onSelect={() => go(`/tools/${tool.slug}`)}
                  >
                    <span className="me-1 w-8 shrink-0 font-mono text-[11px] text-muted-foreground">{tool.icon}</span>
                    <span className="shrink-0 whitespace-nowrap">{tool.name}</span>
                    <span className="ms-auto min-w-0 truncate text-xs text-muted-foreground">{tool.shortDescription}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
