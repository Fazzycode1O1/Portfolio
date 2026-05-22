import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { PageTransition } from "@/components/motion/page-transition";
import { MarketingDecorations } from "@/components/shared/marketing-decorations";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MarketingDecorations />
      <Navbar />
      <main className="relative">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </>
  );
}
