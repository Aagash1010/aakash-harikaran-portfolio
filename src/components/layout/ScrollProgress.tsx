import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 top-0 z-[160] h-[2px] w-full origin-left bg-lime"
      style={{ scaleX: reduced ? scrollYProgress : scaleX }}
    />
  );
}
