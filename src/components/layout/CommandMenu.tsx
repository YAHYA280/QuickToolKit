"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import type { ToolSummary } from "@/components/tools/ToolSearch";
import type { Category } from "@/tools/types";

// cmdk + dialog are only downloaded the first time the palette is needed.
const CommandPalette = dynamic(() => import("./CommandPalette"), { ssr: false });

interface Props {
  tools: ToolSummary[];
  categories: Category[];
}

export function CommandMenu({ tools, categories }: Props) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setLoaded(true);
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className="h-8 w-8 justify-start gap-2 px-0 text-muted-foreground sm:w-56 sm:px-2.5"
        onClick={() => {
          setLoaded(true);
          setOpen(true);
        }}
        onPointerEnter={() => setLoaded(true)}
        onFocus={() => setLoaded(true)}
        aria-label="Search tools"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <SearchIcon className="mx-auto size-4 sm:mx-0" />
        <span className="hidden flex-1 text-start text-sm font-normal sm:inline">Search tools</span>
        <KbdGroup className="hidden sm:inline-flex">
          <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Button>
      {loaded && <CommandPalette open={open} onOpenChange={setOpen} tools={tools} categories={categories} />}
    </>
  );
}
