import { useEffect, type RefObject } from "react";

/**
 * Lightweight scroll-linked drift.
 * Driven by a single rAF-throttled transform instead of a full animation
 * library, so it costs nothing to the initial bundle. Automatically disabled
 * when the visitor prefers reduced motion.
 */
export function useParallax(
  ref: RefObject<HTMLElement | null>,
  strength = 40,
) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const trigger = element.parentElement ?? element;
    const max = strength / 10;
    let frame = 0;
    let active = true;

    const update = () => {
      frame = 0;
      if (!active) return;
      const rect = trigger.getBoundingClientRect();
      const viewport = window.innerHeight;
      const span = viewport + rect.height;
      const progress = Math.min(
        1,
        Math.max(0, (viewport - rect.top) / span),
      );
      const offset = -max + progress * max * 2;
      element.style.transform = `translate3d(0, ${offset.toFixed(3)}%, 0)`;
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const applyPreference = () => {
      if (reduced.matches) {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        element.style.transform = "";
      } else {
        schedule();
      }
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", applyPreference);

    return () => {
      active = false;
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", applyPreference);
      element.style.transform = "";
    };
  }, [ref, strength]);
}
