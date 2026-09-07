import { ImageResponse } from "next/og";
import { routing } from "@/i18n/routing";
import { ogImageSize } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { getCategory } from "@/tools/categories";
import { getTool, getToolContent, tools } from "@/tools/registry";

export const size = ogImageSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => tools.map((tool) => ({ locale, slug: tool.slug })));
}

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const tool = getTool(slug);
  const content = tool ? getToolContent(tool, locale) : undefined;
  const category = tool ? getCategory(tool.category) : undefined;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#f8f6f1",
        color: "#26221d",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "#e8590c", display: "flex" }} />
          <div style={{ fontSize: 30, fontWeight: 700 }}>{`${siteConfig.name.toLowerCase()}.`}</div>
        </div>
        <div style={{ fontSize: 22, color: "#6b6259", fontFamily: "monospace", letterSpacing: 2 }}>
          {category?.name.toUpperCase()}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>{tool?.name}</div>
        <div style={{ fontSize: 32, color: "#6b6259", lineHeight: 1.3 }}>{tool?.shortDescription}</div>
      </div>
      <div style={{ display: "flex", gap: 40, fontSize: 24, color: "#6b6259", fontFamily: "monospace" }}>
        <span>free</span>
        <span>runs locally</span>
        <span>{content ? "no sign-up" : ""}</span>
      </div>
    </div>,
    size,
  );
}
