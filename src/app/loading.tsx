export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-bg">
      <div className="aurora-bg absolute inset-0 opacity-40" aria-hidden />
      <div className="relative flex flex-col items-center gap-4">
        <div className="relative size-12">
          <div className="absolute inset-0 animate-ping rounded-full bg-accent-gradient opacity-40" />
          <div className="relative grid size-12 place-items-center rounded-xl bg-accent-gradient shadow-glow-violet">
            <span className="font-display text-lg font-bold text-white">A</span>
          </div>
        </div>
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-text-muted">Loading</div>
      </div>
    </div>
  );
}
