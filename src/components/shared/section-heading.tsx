import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({ eyebrow, title, description, align = "left", className }: Props) {
  return (
    <div className={cn("mb-12 md:mb-16 max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <Reveal>
          <div className="mb-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
            <span className="h-px w-6 bg-accent-gradient" />
            <span className="text-gradient">{eyebrow}</span>
          </div>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2 className="font-display text-4xl font-semibold tracking-tight text-text md:text-5xl lg:text-6xl">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.1}>
          <p className="mt-4 text-base text-text-muted md:text-lg">{description}</p>
        </Reveal>
      )}
    </div>
  );
}
