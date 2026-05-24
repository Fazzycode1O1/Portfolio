"use client";

import dynamic from "next/dynamic";

const ScrollProgress = dynamic(
  () => import("@/components/motion/scroll-progress").then((m) => m.ScrollProgress),
  { ssr: false }
);

// Cursor glow is purely decorative — keep it client-only and ssr:false so it
// doesn't ship for touch devices or affect first paint.
const CursorGlow = dynamic(
  () => import("@/components/shared/cursor-glow").then((m) => m.CursorGlow),
  { ssr: false }
);

export function MarketingDecorations() {
  return (
    <>
      <ScrollProgress />
      <CursorGlow />
    </>
  );
}
