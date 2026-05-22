"use client";

import * as React from "react";

/**
 * Lightweight inertia-scroll for the document. Lerps actual scrollY toward the wheel target
 * for a Lenis-like feel without the dep.
 *
 * - Mounts a body-level wheel handler
 * - Yields to native touch scrolling (mobile)
 * - Respects prefers-reduced-motion
 * - Pause when tab hidden
 *
 * Render once near the root, e.g. in a layout.
 */
export function SmoothScroll({ lerp = 0.1 }: { lerp?: number }) {
  React.useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    if (mq.matches) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    let target = window.scrollY;
    let current = window.scrollY;
    let raf: number | null = null;
    let active = true;

    function onWheel(e: WheelEvent) {
      // Ignore zoom + non-vertical / inside scrollable elements
      if (e.ctrlKey || e.metaKey) return;
      const inScrollable = isInsideScrollable(e.target as Element | null);
      if (inScrollable) return;

      e.preventDefault();
      const max = document.documentElement.scrollHeight - window.innerHeight;
      target = Math.max(0, Math.min(max, target + e.deltaY));
      if (raf == null) raf = requestAnimationFrame(loop);
    }

    function loop() {
      const diff = target - current;
      if (Math.abs(diff) < 0.5) {
        current = target;
        window.scrollTo(0, current);
        raf = null;
        return;
      }
      current += diff * lerp;
      window.scrollTo(0, current);
      raf = requestAnimationFrame(loop);
    }

    function onScroll() {
      // Keep target in sync when user uses keyboard / scrollbar / anchors
      if (raf == null) {
        target = window.scrollY;
        current = window.scrollY;
      }
    }

    function onVisibility() {
      active = document.visibilityState === "visible";
      if (!active && raf != null) { cancelAnimationFrame(raf); raf = null; }
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, [lerp]);

  return null;
}

function isInsideScrollable(el: Element | null): boolean {
  let n: Element | null = el;
  while (n && n !== document.body) {
    const s = getComputedStyle(n);
    const overflowY = s.overflowY;
    if ((overflowY === "auto" || overflowY === "scroll") && n.scrollHeight > n.clientHeight) return true;
    n = n.parentElement;
  }
  return false;
}
