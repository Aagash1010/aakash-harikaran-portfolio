import { useEffect, useState } from "react";
import { useMotionValue, useReducedMotion, useSpring, motion } from "framer-motion";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const reduced = useReducedMotion();

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const dotX = useSpring(x, { stiffness: 900, damping: 55, mass: 0.2 });
  const dotY = useSpring(y, { stiffness: 900, damping: 55, mass: 0.2 });
  const ringX = useSpring(x, { stiffness: 170, damping: 22, mass: 0.35 });
  const ringY = useSpring(y, { stiffness: 170, damping: 22, mass: 0.35 });

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const canUse = finePointer.matches && !reduced;
    setEnabled(canUse);
    if (!canUse) return;

    document.body.dataset.customCursor = "true";

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
    };

    const onOver = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest<HTMLElement>(
        "a, button, [role='button'], [data-cursor='hover'], input, textarea, select",
      );
      setHovering(Boolean(target));
      setLabel(target?.dataset.cursorLabel ?? null);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      delete document.body.dataset.customCursor;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [reduced, x, y]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="desktop-only-cursor pointer-events-none fixed inset-0 z-[300] overflow-hidden"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <motion.div className="absolute left-0 top-0" style={{ x: dotX, y: dotY }}>
        <motion.span
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime"
          animate={{
            width: hovering ? 4 : 6,
            height: hovering ? 4 : 6,
            opacity: hovering && label ? 0 : 1,
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>

      <motion.div className="absolute left-0 top-0" style={{ x: ringX, y: ringY }}>
        <motion.div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-center"
          style={{
            borderColor: "var(--c-accent)",
            color: "var(--c-base)",
            backgroundColor: label ? "var(--c-accent)" : "transparent",
          }}
          animate={{
            width: label ? 70 : hovering ? 44 : 26,
            height: label ? 70 : hovering ? 44 : 26,
            opacity: visible ? 1 : 0,
            scale: pressed ? 0.82 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.4 }}
        >
          {label ? (
            <span className="font-mono text-[8px] font-medium uppercase tracking-[0.18em]">
              {label}
            </span>
          ) : null}
        </motion.div>
      </motion.div>
    </div>
  );
}
