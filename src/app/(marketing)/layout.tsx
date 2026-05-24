import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { PageTransition } from "@/components/motion/page-transition";
import { MarketingDecorations } from "@/components/shared/marketing-decorations";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Skip-to-content: visible only on keyboard focus. First focusable
          element so screen-reader / keyboard users can bypass the navbar. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:shadow-elev-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)] focus:ring-offset-2 focus:ring-offset-bg"
      >
        Skip to content
      </a>
      <MarketingDecorations />
      <Navbar />
      <main id="main" className="relative">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </>
  );
}
