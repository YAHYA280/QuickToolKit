import { ImageResponse } from "next/og";
import { routing } from "@/i18n/routing";
import { ogImageSize } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { tools } from "@/tools/registry";

export const alt = `${siteConfig.name} – ${siteConfig.tagline}`;
export const size = ogImageSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#ffd60a",
        color: "#0a0a0a",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: "#2323ff", border: "4px solid #0a0a0a", display: "flex" }} />
        <div style={{ fontSize: 30, fontWeight: 700 }}>{`${siteConfig.name.toLowerCase()}.`}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 84, fontWeight: 900, letterSpacing: -2, textTransform: "uppercase", lineHeight: 1 }}>
          Tools that run in the tab, not the cloud.
        </div>
        <div style={{ fontSize: 30, color: "#0a0a0a" }}>{siteConfig.tagline}</div>
      </div>
      <div style={{ display: "flex", gap: 40, fontSize: 24, color: "#0a0a0a", fontFamily: "monospace" }}>
        <span>{tools.length} tools</span>
        <span>0 uploads</span>
        <span>0 accounts</span>
      </div>
    </div>,
    size,
  );
}
