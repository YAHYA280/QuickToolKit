"use client";

import { useCallback, useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
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
  tools: ToolSummary[];
  categories: Category[];
}

export function CommandMenu({ tools, categories }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  return (
    <>
      <Button
        variant="outline"
        className="h-8 w-8 justify-start gap-2 px-0 text-muted-foreground sm:w-56 sm:px-2.5"
        onClick={() => setOpen(true)}
        aria-label="Search tools"
      >
        <SearchIcon className="mx-auto size-4 sm:mx-0" />
        <span className="hidden flex-1 text-start text-sm font-normal sm:inline">Search tools</span>
        <KbdGroup className="hidden sm:inline-flex">
          <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} title="Search tools" description="Jump to any tool" className="sm:max-w-xl">
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
    </>
  );
}
