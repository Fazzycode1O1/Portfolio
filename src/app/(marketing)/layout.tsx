import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { CursorGlow } from "@/components/shared/cursor-glow";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { PageTransition } from "@/components/motion/page-transition";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <CursorGlow />
      <Navbar />
      <main className="relative">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </>
  );
}
