import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { navItems } from "../../data/profile";
import { useActiveSection } from "../../hooks/useActiveSection";
import { cn, scrollToSection } from "../../lib/utils";

const ids: string[] = navItems.map((item) => item.id);

/**
 * A quiet desktop "journey rail" that mirrors the chapter you are reading.
 * It is a progress indicator first and a shortcut second: every tick keeps its
 * label behind hover/focus so the column never competes with the page copy.
 */
export function SectionRail() {
  const active = useActiveSection(ids);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.4,
  });
  const activeIndex = Math.max(0, ids.indexOf(active));

  return (
    <nav
      aria-label="Section progress"
      className="fixed right-5 top-1/2 z-[120] hidden -translate-y-1/2 xl:block"
    >
      <div className="flex flex-col items-end">
        <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-muted/45">
          <span className="text-accent tabular-nums">
            {String(activeIndex + 1).padStart(2, "0")}
          </span>{" "}
          / {String(ids.length).padStart(2, "0")}
        </span>

        <div className="relative mt-3 flex flex-col items-end gap-2 py-1 pr-1.5">
          <span
            aria-hidden
            className="absolute right-0 top-0 h-full w-px bg-line/60"
          />
          <motion.span
            aria-hidden
            className="absolute right-0 top-0 h-full w-px origin-top bg-lime/75"
            style={{ scaleY: reduced ? scrollYProgress : smooth }}
          />

          {navItems.map((item) => {
            const isActive = item.id === active;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(event) => {
                  event.preventDefault();
                  scrollToSection(item.id);
                }}
                aria-current={isActive ? "true" : undefined}
                aria-label={`${item.index} — ${item.label}`}
                className="group relative flex h-4 items-center justify-end pl-3 focus-visible:outline-offset-4"
              >
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute right-full mr-3 translate-x-1 whitespace-nowrap border border-line bg-base/90 px-2 py-1 font-mono text-[6.5px] uppercase tracking-[0.16em] opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100",
                    isActive ? "text-accent" : "text-muted",
                  )}
                >
                  {item.index} / {item.label}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "block h-px transition-all duration-500",
                    isActive
                      ? "w-5 bg-lime"
                      : "w-2.5 bg-muted/50 group-hover:w-4 group-hover:bg-ink/70",
                  )}
                />
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
