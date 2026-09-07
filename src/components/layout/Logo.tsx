import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";

export function LogoMark({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={className}>
      <rect width="32" height="32" rx="7" className="fill-brand" />
      <rect x="8" y="8" width="16" height="4" rx="1" className="fill-brand-foreground" />
      <rect x="14" y="12" width="4" height="12" rx="1" className="fill-brand-foreground" />
      <rect x="20" y="20" width="4" height="4" rx="1" className="fill-brand-foreground/70" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label={`${siteConfig.name} home`}>
      <LogoMark />
      <span className="font-display text-[17px] font-semibold tracking-tight">
        {siteConfig.name.toLowerCase()}
        <span className="text-brand">.</span>
      </span>
    </Link>
  );
}
