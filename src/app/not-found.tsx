import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden p-6 text-center">
      <div aria-hidden className="absolute inset-0 -z-10 aurora-bg opacity-50" />
      <div>
        <p className="font-display text-[clamp(96px,20vw,200px)] font-bold leading-none text-gradient">404</p>
        <h1 className="mt-4 font-display text-3xl font-semibold">Page not found</h1>
        <p className="mt-2 text-text-muted">The page you're looking for doesn't exist or has moved.</p>
        <Button asChild className="mt-8"><Link href="/"><ArrowLeft /> Back home</Link></Button>
      </div>
    </div>
  );
}
