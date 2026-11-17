import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { cn } from "../../lib/utils";

interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

/**
 * Gives a subtle magnetic pull to CTAs on precise pointers.
 * The motion wrapper keeps the hit area stable while the child shifts.
 */
export function Magnetic({ children, strength = 0.22, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.25 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.25 });

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      onBlur={reset}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.div>
  );
}
