import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";
import { categories } from "@/tools/categories";
import { tools } from "@/tools/registry";
import { LogoMark } from "./Logo";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <LogoMark className="size-6" />
            <span className="font-display font-semibold">{siteConfig.name}</span>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
            {siteConfig.tagline}. {t("madeWith")}
          </p>
          <p className="label-mono mt-6">
            {tools.length} tools · 0 uploads · 0 accounts
          </p>
        </div>
        <div>
          <p className="label-mono">{t("categories")}</p>
          <ul className="mt-3 space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} className="text-muted-foreground transition-colors hover:text-foreground">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="label-mono">Popular</p>
          <ul className="mt-3 space-y-2 text-sm">
            {tools
              .filter((tool) => tool.popular)
              .slice(0, 5)
              .map((tool) => (
                <li key={tool.slug}>
                  <Link href={`/tools/${tool.slug}`} className="text-muted-foreground transition-colors hover:text-foreground">
                    {tool.name}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
        <div>
          <p className="label-mono">{t("company")}</p>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              ["/about", nav("about")],
              ["/contact", nav("contact")],
              ["/privacy", nav("privacy")],
              ["/terms", nav("terms")],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-muted-foreground transition-colors hover:text-foreground">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 font-mono text-[11px] text-muted-foreground">
          <span>
            &copy; {new Date().getFullYear()} {siteConfig.name}. {t("rights")}
          </span>
          <span className="hidden sm:inline">client-side · no tracking of tool input</span>
        </p>
      </div>
    </footer>
  );
}
