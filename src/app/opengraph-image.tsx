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
            "radial-gradient(60% 50% at 20% 30%, rgba(107,143,168,0.35), transparent 60%), radial-gradient(50% 40% at 80% 25%, rgba(184,149,111,0.20), transparent 60%), #050505",
          color: "#F2F2EE",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 28, color: "#A8A8A2" }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: "linear-gradient(135deg,#8FA9BD,#6B8FA8,#4F7186)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 22,
              color: "#F2F2EE",
            }}
          >
            A
          </div>
          <span style={{ textTransform: "uppercase", letterSpacing: 4 }}>
            {siteConfig.name}
          </span>
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
            <span style={{ color: "#6B8FA8" }}>intelligent</span>
            <span>&nbsp;future.</span>
          </div>
          <div style={{ fontSize: 28, color: "#A8A8A2", maxWidth: 900 }}>
            {siteConfig.author.role}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 22, color: "#6B6B68" }}>
          <span>{siteConfig.url.replace(/^https?:\/\//, "")}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 10, height: 10, borderRadius: 999, background: "#5C8A6F" }} />
            Available for opportunities
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
