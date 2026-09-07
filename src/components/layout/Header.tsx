import { useTranslations } from "next-intl";
import { siteConfig } from "@/lib/site";
import { categories } from "@/tools/categories";
import { tools } from "@/tools/registry";
import type { ToolSummary } from "@/components/tools/ToolSearch";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { CommandMenu } from "./CommandMenu";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";
import { NavLinks } from "./NavLinks";

export function Header() {
  const t = useTranslations("nav");
  const summaries: ToolSummary[] = tools.map((tool) => ({
    slug: tool.slug,
    category: tool.category,
    name: tool.name,
    shortDescription: tool.shortDescription,
    keywords: tool.keywords,
    icon: tool.icon,
  }));

  return (
    <header className="sticky top-0 z-40 border-b-2 border-border bg-card">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:start-2 focus:top-2 focus:z-50 focus:border-2 focus:border-border focus:bg-highlight focus:px-3 focus:py-1.5 focus:text-sm focus:font-bold"
      >
        {t("skipToContent")}
      </a>
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
        <Logo />
        <NavLinks categories={categories} className="ms-4 hidden md:flex" />
        <div className="ms-auto flex items-center gap-2">
          <CommandMenu tools={summaries} categories={categories} />
          <ThemeToggle />
          <MobileNav
            categories={categories}
            siteName={siteConfig.name}
            links={[
              { href: "/about", label: t("about") },
              { href: "/contact", label: t("contact") },
              { href: "/privacy", label: t("privacy") },
            ]}
          />
        </div>
      </div>
    </header>
  );
}
