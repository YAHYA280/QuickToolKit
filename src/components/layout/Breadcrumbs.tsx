import { ChevronRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export interface Crumb {
  name: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const t = useTranslations("breadcrumbs");
  const all: Crumb[] = [{ name: t("home"), href: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1">
        {all.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRightIcon aria-hidden className="size-3 rtl:rotate-180" />}
            {item.href && i < all.length - 1 ? (
              <Link href={item.href} className="transition-colors hover:text-foreground">
                {item.name}
              </Link>
            ) : (
              <span aria-current="page" className="text-foreground">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
