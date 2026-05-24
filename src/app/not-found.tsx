import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden p-6 text-center">
      <div aria-hidden className="absolute inset-0 -z-10 aurora-bg opacity-50" />

      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-text-subtle">
          § Error · 404
        </p>
        <p className="numeral-xl mt-6 text-signal">404</p>
        <h1 className="display-xl font-display mt-4 [text-wrap:balance]">Page not found</h1>
        <p className="mt-4 text-text-muted body-pretty mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Link
          href="/"
          className="group mt-10 inline-flex items-baseline gap-3 text-text transition-colors duration-fast ease-out-quart hover:text-signal-bright"
        >
          <ArrowLeft className="size-4 translate-y-0.5 transition-transform duration-base ease-out-quart group-hover:-translate-x-1" />
          <span className="text-base">Back home</span>
        </Link>
      </div>
    </div>
  );
}
