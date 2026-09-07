import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";

export function LogoMark({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={className}>
      <rect x="1" y="1" width="30" height="30" className="fill-primary stroke-foreground" strokeWidth="2" />
      <rect x="8" y="8" width="16" height="4" className="fill-highlight" />
      <rect x="14" y="12" width="4" height="12" className="fill-highlight" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label={`${siteConfig.name} home`}>
      <LogoMark />
      <span className="font-display text-[15px] uppercase tracking-wide">{siteConfig.name}</span>
    </Link>
  );
}
