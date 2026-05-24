/**
 * Vertical section identifier — sits on the left margin of each section and
 * reads top-to-bottom like a book spine. Replaces the `numeral-stencil`
 * watermark from R3. Mono caps, very muted, decorative only.
 *
 * Rendered on md+ only; on mobile there's no margin to host it without
 * competing with content.
 */
interface Props {
  /** Two-digit section number, e.g. "03". */
  index: string;
  /** Short uppercase label, e.g. "WORK". Long labels are fine — they stack
   *  vertically below the index, separated by a hairline. */
  label: string;
}

export function SpineLabel({ index, label }: Props) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-3 top-32 hidden flex-col items-center gap-5 md:flex lg:left-6"
    >
      <span
        className="font-mono text-[10px] uppercase tracking-[0.32em] text-text-subtle whitespace-nowrap"
        style={{ writingMode: "vertical-rl" }}
      >
        § {index}
      </span>
      <span aria-hidden className="h-10 w-px bg-border" />
      <span
        className="font-mono text-[10px] uppercase tracking-[0.32em] text-text-muted whitespace-nowrap"
        style={{ writingMode: "vertical-rl" }}
      >
        {label}
      </span>
    </div>
  );
}
