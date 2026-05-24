export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-bg">
      <div className="aurora-bg absolute inset-0 opacity-30" aria-hidden />
      <div className="relative flex flex-col items-center gap-6">
        <div className="relative size-12">
          {/* Custom breath — replaces animate-ping for the new identity. */}
          <span
            aria-hidden
            className="absolute inset-0 rounded-sm bg-signal/40 motion-reduce:hidden"
            style={{ animation: "pulse-glow 2.4s ease-out infinite" }}
          />
          <div className="relative grid size-12 place-items-center rounded-sm bg-accent-gradient shadow-elev-2">
            <span className="font-display text-base font-bold text-white">A</span>
          </div>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.32em] text-text-subtle">
          <span aria-hidden className="size-1 rounded-full bg-signal" />
          <span>Loading · Index 2026</span>
          <span aria-hidden className="size-1 rounded-full bg-signal" />
        </div>
      </div>
    </div>
  );
}
