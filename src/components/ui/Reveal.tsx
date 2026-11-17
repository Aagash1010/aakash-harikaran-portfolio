import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "../../lib/motion";
import { cn } from "../../lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  amount?: number;
  once?: boolean;
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  amount = 0.2,
  once = true,
}: RevealProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.85, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

interface MaskLineProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/** A single masked line of display type that rises into view. */
export function MaskLine({ children, className, delay = 0 }: MaskLineProps) {
  const reduced = useReducedMotion();

  // The clip lives on the observed element. A nested observer would measure the
  // already-clipped child (ratio 0) and never resolve, leaving headings hidden.
  return (
    <motion.span
      className={cn("block overflow-hidden pb-[0.09em] -mb-[0.09em]", className)}
      initial={reduced ? false : "hidden"}
      whileInView={reduced ? undefined : "visible"}
      viewport={{ once: true, amount: 0.35 }}
    >
      <motion.span
        className="block will-change-transform"
        variants={{
          hidden: { y: "115%" },
          visible: {
            y: "0%",
            transition: { duration: 1, delay, ease: EASE_OUT },
          },
        }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}
