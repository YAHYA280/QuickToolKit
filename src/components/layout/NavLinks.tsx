"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { Category } from "@/tools/types";

export function NavLinks({ categories, className }: { categories: Category[]; className?: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Categories" className={cn("flex items-center gap-1", className)}>
      {categories.map((c) => {
        const href = `/category/${c.slug}`;
        const active = pathname === href;
        return (
          <Link
            key={c.slug}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
              active && "bg-accent text-foreground",
            )}
          >
            {c.name}
          </Link>
        );
      })}
    </nav>
  );
}
