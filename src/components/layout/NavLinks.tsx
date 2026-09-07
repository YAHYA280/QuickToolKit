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
              "px-2.5 py-1.5 text-sm font-semibold transition-colors hover:bg-highlight hover:text-highlight-foreground",
              active && "ink-block hover:ink-block",
            )}
          >
            {c.name}
          </Link>
        );
      })}
    </nav>
  );
}
