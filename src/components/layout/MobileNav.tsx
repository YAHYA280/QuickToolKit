"use client";

import { useState } from "react";
import { MenuIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LogoMark } from "./Logo";
import type { Category } from "@/tools/types";

interface Props {
  categories: Category[];
  siteName: string;
  links: { href: string; label: string }[];
}

export function MobileNav({ categories, siteName, links }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
          <MenuIcon className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 font-display">
            <LogoMark className="size-6" /> {siteName}
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-1 px-4">
          <p className="label-mono mb-2">Categories</p>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2 text-sm hover:bg-accent"
            >
              {c.name}
            </Link>
          ))}
          <Separator className="my-3" />
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
