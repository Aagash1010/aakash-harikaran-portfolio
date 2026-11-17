import { useEffect } from "react";

/**
 * Publishes a normalised pointer position onto the document root as
 * `--pointer-x` / `--pointer-y` (-1 → 1). CSS layers read it to drift by a few
 * pixels, which gives the page depth without a render loop.
 *
 * Disabled for touch, coarse pointers and reduced-motion users.
 */
export function usePointerField() {
  useEffect(() => {
    const root = document.documentElement;
    const fine = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let frame = 0;
    let px = 0;
    let py = 0;

    const apply = () => {
      frame = 0;
      root.style.setProperty("--pointer-x", px.toFixed(4));
      root.style.setProperty("--pointer-y", py.toFixed(4));
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      px = (event.clientX / window.innerWidth - 0.5) * 2;
      py = (event.clientY / window.innerHeight - 0.5) * 2;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const sync = () => {
      const enabled = fine.matches && !reduced.matches;
      window.removeEventListener("pointermove", onMove);

      if (!enabled) {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        root.style.removeProperty("--pointer-x");
        root.style.removeProperty("--pointer-y");
        return;
      }

      window.addEventListener("pointermove", onMove, { passive: true });
    };

    sync();
    fine.addEventListener("change", sync);
    reduced.addEventListener("change", sync);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      fine.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
      root.style.removeProperty("--pointer-x");
      root.style.removeProperty("--pointer-y");
    };
  }, []);
}
