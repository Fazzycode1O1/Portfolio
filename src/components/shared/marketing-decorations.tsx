"use client";

import dynamic from "next/dynamic";

// Client-only decorative effects. Isolated into a `"use client"` wrapper so the
// surrounding marketing layout can stay a server component while these still
// get `ssr: false` (their initial state depends on pointer/scroll which has no
// meaningful server output).
const CursorGlow = dynamic(
  () => import("@/components/shared/cursor-glow").then((m) => m.CursorGlow),
  { ssr: false }
);
const ScrollProgress = dynamic(
  () => import("@/components/motion/scroll-progress").then((m) => m.ScrollProgress),
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
