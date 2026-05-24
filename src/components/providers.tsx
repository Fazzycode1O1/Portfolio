"use client";

import { ThemeProvider } from "next-themes";

/**
 * App-wide providers. The Graphite/Atelier rebrand drops light mode — the
 * cinematic identity the site is going for is intrinsically a dark
 * experience. `forcedTheme="dark"` makes next-themes mount the `.dark` class
 * on <html> permanently and ignore localStorage / system preference; the
 * stored "theme" key is no longer consulted at boot.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      forcedTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
