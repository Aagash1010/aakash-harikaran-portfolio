import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT, STAGGER } from "../../lib/motion";
import { cn } from "../../lib/utils";

type SplitMode = "words" | "chars";

interface SplitTextProps {
  text: string;
  mode?: SplitMode;
  className?: string;
  /** Drives the reveal explicitly (hero intro). Omit to reveal on scroll. */
  active?: boolean;
  delay?: number;
  stagger?: number;
  duration?: number;
  once?: boolean;
  /** `false` leaves clipping to a parent line mask (large display type). */
  masked?: boolean;
  as?: "span" | "div";
}

interface Token {
  key: string;
  text: string;
  trailingSpace: boolean;
}

function tokenize(text: string, mode: SplitMode): Token[] {
  const words = text.split(/\s+/).filter(Boolean);
  const tokens: Token[] = [];

  words.forEach((word, wordIndex) => {
    const parts = mode === "chars" ? word.split("") : [word];
    parts.forEach((part, partIndex) => {
      tokens.push({
        key: `${wordIndex}-${partIndex}`,
        text: part,
        trailingSpace:
          partIndex === parts.length - 1 && wordIndex < words.length - 1,
      });
    });
  });

  return tokens;
}

/**
 * Word- or letter-level masked reveal.
 * Screen readers get the full string once; the animated glyphs are hidden.
 */
export function SplitText({
  text,
  mode = "words",
  className,
  active,
  delay = 0,
  stagger = STAGGER.tight,
  duration = 0.9,
  once = true,
  masked = true,
  as: Tag = "span",
}: SplitTextProps) {
  const reduced = useReducedMotion();
  const tokens = tokenize(text, mode);

  const controlled = active !== undefined;
  const animate = reduced
    ? "visible"
    : controlled
      ? active
        ? "visible"
        : "hidden"
      : undefined;

  return (
    <Tag className={cn("inline", className)}>
      <span className="sr-only">{text}</span>

      <motion.span
        aria-hidden
        className="inline-block"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: stagger, delayChildren: delay },
          },
        }}
        initial={reduced ? false : "hidden"}
        animate={animate}
        whileInView={!reduced && !controlled ? "visible" : undefined}
        viewport={{ once, amount: 0.4 }}
      >
        {tokens.map((token) => (
          <Fragment key={token.key}>
            {masked ? (
              <span className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom">
                <motion.span
                  className="inline-block"
                  variants={{
                    hidden: { y: "118%" },
                    visible: {
                      y: "0%",
                      transition: { duration, ease: EASE_OUT },
                    },
                  }}
                >
                  {token.text}
                </motion.span>
              </span>
            ) : (
              <motion.span
                className="inline-block"
                variants={{
                  hidden: { y: "0.6em", opacity: 0 },
                  visible: {
                    y: "0em",
                    opacity: 1,
                    transition: { duration, ease: EASE_OUT },
                  },
                }}
              >
                {token.text}
              </motion.span>
            )}
            {token.trailingSpace ? " " : null}
          </Fragment>
        ))}
      </motion.span>
    </Tag>
  );
}
