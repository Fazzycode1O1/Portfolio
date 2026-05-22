import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const runtime = "edge";
export const alt = siteConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background:
            "radial-gradient(60% 50% at 20% 30%, rgba(124,92,255,0.45), transparent 60%), radial-gradient(50% 40% at 80% 25%, rgba(79,139,255,0.38), transparent 60%), radial-gradient(45% 40% at 50% 80%, rgba(79,224,255,0.30), transparent 60%), #07070B",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 28, color: "#A0A0AE" }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: "linear-gradient(135deg,#7C5CFF,#4F8BFF,#4FE0FF)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 22,
              color: "white",
            }}
          >
            A
          </div>
          <span>{siteConfig.name}.dev</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 96,
              lineHeight: 1.0,
              letterSpacing: -3,
              fontWeight: 700,
              maxWidth: 980,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <span>Building the web&apos;s&nbsp;</span>
            <span
              style={{
                backgroundImage: "linear-gradient(135deg,#7C5CFF,#4F8BFF,#4FE0FF)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              intelligent
            </span>
            <span>&nbsp;future.</span>
          </div>
          <div style={{ fontSize: 28, color: "#A0A0AE", maxWidth: 900 }}>
            {siteConfig.author.role}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 22, color: "#6B6B7A" }}>
          <span>{siteConfig.url.replace(/^https?:\/\//, "")}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 10, height: 10, borderRadius: 999, background: "#34D399" }} />
            Available for opportunities
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
