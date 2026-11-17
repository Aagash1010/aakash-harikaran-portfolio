import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { cn } from "../../lib/utils";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  /** Maximum tilt in degrees at the card edge. */
  max?: number;
  /** Extra scale on hover, e.g. 0.01 for a barely-there lift. */
  hoverScale?: number;
  perspective?: number;
  /** Cursor-following lime light inside the card face. */
  spotlight?: boolean;
}

/**
 * GPU-friendly pointer tilt with an optional cursor spotlight.
 * Only activates for a mouse with motion allowed; touch and keyboard users get
 * the untouched static card, and the DOM order never changes.
 */
export function TiltCard({
  children,
  className,
  max = 6,
  hoverScale = 0.008,
  perspective = 1200,
  spotlight = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const lift = useMotionValue(1);

  const rotateX = useSpring(tiltX, { stiffness: 170, damping: 20, mass: 0.45 });
  const rotateY = useSpring(tiltY, { stiffness: 170, damping: 20, mass: 0.45 });
  const scale = useSpring(lift, { stiffness: 220, damping: 24, mass: 0.4 });

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const element = ref.current;
    if (reduced || event.pointerType !== "mouse" || !element) return;

    const rect = element.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    tiltY.set((px - 0.5) * max * 2);
    tiltX.set(-(py - 0.5) * max * 2);
    lift.set(1 + hoverScale);

    element.style.setProperty("--mx", `${(px * 100).toFixed(2)}%`);
    element.style.setProperty("--my", `${(py * 100).toFixed(2)}%`);
  };

  const reset = () => {
    tiltX.set(0);
    tiltY.set(0);
    lift.set(1);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
      onBlur={reset}
      style={{
        rotateX,
        rotateY,
        scale,
        transformPerspective: perspective,
      }}
      className={cn("tilt-card relative", className)}
    >
      {children}
      {spotlight ? <span aria-hidden className="tilt-spotlight" /> : null}
    </motion.div>
  );
}
