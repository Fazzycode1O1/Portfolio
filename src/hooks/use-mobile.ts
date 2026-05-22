"use client";

import * as React from "react";

/** Detects coarse pointers (touch) or narrow viewports — for disabling heavy effects. */
export function useIsTouch(): boolean {
  const [isTouch, setIsTouch] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => setIsTouch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isTouch;
}

export function useMediaQuery(query: string): boolean {
  const [match, setMatch] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return match;
}

export function useIsMobile(breakpoint = 768): boolean {
  return useMediaQuery(`(max-width: ${breakpoint - 1}px)`);
}
