"use client";

import dynamic from "next/dynamic";

/**
 * Marketing-page decorations. CursorGlow was retired in G3 — the cinematic
 * atmosphere now lives inside the hero's own SoftAtmosphere layer instead of
 * tracking the cursor globally.
 */
const ScrollProgress = dynamic(
  () => import("@/components/motion/scroll-progress").then((m) => m.ScrollProgress),
  { ssr: false }
);

export function MarketingDecorations() {
  return <ScrollProgress />;
}
