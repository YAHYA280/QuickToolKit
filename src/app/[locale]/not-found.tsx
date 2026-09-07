import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { ArrowLeftIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <div className="mx-auto max-w-2xl px-4 py-28 text-center">
      <p className="label-mono">404</p>
      <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{t("title")}</h1>
      <p className="mt-4 text-muted-foreground">{t("description")}</p>
      <Button asChild className="mt-8">
        <Link href="/">
          <ArrowLeftIcon data-icon="inline-start" className="rtl:rotate-180" /> {t("backHome")}
        </Link>
      </Button>
    </div>
  );
}
