"use client";

import * as React from "react";

/** Lightweight intersection-observer hook with a single-shot mode. */
export function useInView<T extends Element>(options: IntersectionObserverInit & { once?: boolean } = {}) {
  const { once = true, ...io } = options;
  const ref = React.useRef<T>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold: 0.15, rootMargin: "-10% 0px", ...io }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once, io]);

  return [ref, inView] as const;
}
