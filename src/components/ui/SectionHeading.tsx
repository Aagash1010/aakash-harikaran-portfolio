import { Reveal, MaskLine } from "./Reveal";
import { cn } from "../../lib/utils";

interface SectionHeadingProps {
  index: string;
  label: string;
  lines: React.ReactNode[];
  description?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  id?: string;
}

export function SectionHeading({
  index,
  label,
  lines,
  description,
  className,
  titleClassName,
  id,
}: SectionHeadingProps) {
  return (
    <div className={cn("relative", className)}>
      <Reveal className="flex items-center gap-3.5" y={14}>
        <span className="mono-label text-accent">{index}</span>
        <span aria-hidden className="h-px w-8 bg-line sm:w-12" />
        <span className="mono-label text-muted">{label}</span>
        <span
          aria-hidden
          className="mono-label ml-auto hidden text-muted/60 md:block"
        >
          BEYOND THE INTERFACE / 2026
        </span>
      </Reveal>

      <div className="mt-6 grid items-end gap-6 md:mt-8 md:grid-cols-12 md:gap-10">
        <h2
          id={id}
          className={cn(
            "h-section md:col-span-8 lg:col-span-7",
            titleClassName,
          )}
        >
          {lines.map((line, lineIndex) => (
            <MaskLine key={lineIndex} delay={lineIndex * 0.09}>
              {line}
            </MaskLine>
          ))}
        </h2>

        {description ? (
          <Reveal
            className="body-copy max-w-md md:col-span-4 md:justify-self-end lg:col-span-4 lg:max-w-xs"
            delay={0.18}
          >
            {description}
          </Reveal>
        ) : null}
      </div>

      <Reveal delay={0.24} y={10} className="mt-9 md:mt-12">
        <div className="hairline" />
      </Reveal>
    </div>
  );
}
