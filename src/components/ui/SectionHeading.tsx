import { motion, useReducedMotion } from "framer-motion";
import { Reveal, MaskLine } from "./Reveal";
import { EASE_OUT } from "../../lib/motion";
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
  const reduced = useReducedMotion();

  return (
    <div className={cn("relative", className)}>
      <Reveal className="flex items-center gap-3.5" y={14}>
        <span className="mono-label text-accent">{index}</span>
        <motion.span
          aria-hidden
          className="h-px w-8 origin-left bg-line sm:w-12"
          initial={reduced ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, delay: 0.12, ease: EASE_OUT }}
        />
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

      <motion.div
        aria-hidden
        className="mt-9 h-px w-full origin-left bg-line md:mt-12"
        initial={reduced ? false : { scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.1, delay: 0.24, ease: EASE_OUT }}
      />
    </div>
  );
}
