"use client";

import dynamic from "next/dynamic";

// Warm-minimal design drops decorative cursor effects in both modes. Only the
// scroll-progress bar remains — it's an informational affordance, not decoration.
const ScrollProgress = dynamic(
  () => import("@/components/motion/scroll-progress").then((m) => m.ScrollProgress),
  { ssr: false }
);

export function MarketingDecorations() {
  return <ScrollProgress />;
}
