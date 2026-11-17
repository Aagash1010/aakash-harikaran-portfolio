import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { EASE_OUT } from "../../lib/motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

const statuses = [
  "Initialising workspace",
  "Calibrating the core",
  "Rendering the interface",
  "Ready",
];

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  // Framer's useReducedMotion resolves after the first render, which would let
  // the full countdown start for users who asked for less motion. Read the
  // media query synchronously so the intro is short from the very first frame.
  const [reduced] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const finished = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let cancelled = false;
    let raf = 0;
    let exitTimer = 0;

    // A local completion guard keeps StrictMode's double effect run safe:
    // the first run is cancelled and its timer cleared, so the second run
    // must be able to complete on its own.
    const complete = () => {
      if (cancelled) return;
      finished.current = true;
      exitTimer = window.setTimeout(() => {
        if (!cancelled) onCompleteRef.current();
      }, 260);
    };

    if (reduced) {
      setProgress(100);
      complete();
    } else {
      const duration = 1500;
      const start = performance.now();

      const tick = (now: number) => {
        if (cancelled) return;
        // The rAF timestamp is the frame's start time, which can precede the
        // effect's own performance.now(); clamp so progress never goes below 0.
        const t = Math.min(1, Math.max(0, (now - start) / duration));
        setProgress(Math.round((1 - Math.pow(1 - t, 3)) * 100));
        if (t < 1) raf = requestAnimationFrame(tick);
        else complete();
      };

      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(exitTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [reduced]);

  const skip = () => {
    if (finished.current) return;
    finished.current = true;
    setProgress(100);
    window.setTimeout(() => onCompleteRef.current(), 60);
  };

  const status =
    progress < 28
      ? statuses[0]
      : progress < 62
        ? statuses[1]
        : progress < 100
          ? statuses[2]
          : statuses[3];

  return (
    <motion.div
      className="fixed inset-0 z-[240] flex flex-col overflow-hidden bg-base"
      initial={{ opacity: 1 }}
      exit={
        reduced
          ? { opacity: 0, transition: { duration: 0.2 } }
          : {
              y: "-100%",
              transition: { duration: 0.85, ease: EASE_OUT },
            }
      }
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 blueprint-grid opacity-60"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-[-10%] h-[34rem] w-[34rem] rounded-full bg-lime/[0.09] blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-8%] top-[-12%] h-[26rem] w-[26rem] rounded-full border border-line"
      />

      <div className="container-x relative flex items-center justify-between pb-4 pt-7">
        <div className="flex items-center gap-3">
          <span className="relative grid size-8 place-items-center border border-line">
            <span className="font-display text-[10px] font-bold tracking-[-0.08em]">
              AH
            </span>
            <span className="absolute bottom-0 right-0 size-1.5 bg-lime" />
          </span>
          <span className="font-mono text-[8px] uppercase tracking-[0.24em] text-muted">
            Beyond the interface
          </span>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
          Sri Lanka / 2026
        </span>
      </div>

      <div className="container-x relative flex flex-1 flex-col justify-center py-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="eyebrow mb-5"
        >
          <span className="text-accent">Portfolio</span>
          <span aria-hidden className="h-px w-8 bg-line" />
          Beyond the interface
        </motion.p>

        <div className="overflow-hidden">
          <motion.h1
            initial={reduced ? false : { y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1, ease: EASE_OUT, delay: 0.05 }}
            className="h-hero text-ink"
          >
            AAGASH
          </motion.h1>
        </div>
        <div className="overflow-hidden">
          <motion.p
            initial={reduced ? false : { y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1, ease: EASE_OUT, delay: 0.14 }}
            className="h-hero text-muted/45"
          >
            HARIKARAN<span className="text-lime">.</span>
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[9px] uppercase tracking-[0.2em] text-muted"
        >
          <span>Software Developer</span>
          <span className="text-line">/</span>
          <span>AI Enthusiast</span>
          <span className="text-line">/</span>
          <span>Creative Technologist</span>
        </motion.div>
      </div>

      <div className="container-x relative pb-7">
        <div className="mb-4 flex items-end justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted">
              {status}
            </span>
            <span className="flex gap-1" aria-hidden>
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  className="size-1 rounded-full bg-lime"
                  style={{
                    opacity:
                      progress > 30 + dot * 22 ? 1 : 0.18,
                    transition: "opacity 300ms ease",
                  }}
                />
              ))}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold tabular-nums tracking-[-0.04em] sm:text-5xl">
              {String(progress).padStart(3, "0")}
            </span>
            <span className="font-mono text-[10px] text-muted">%</span>
          </div>
        </div>

        <div className="relative h-px w-full overflow-hidden bg-line">
          <div
            className="absolute inset-y-0 left-0 w-full origin-left bg-lime transition-transform duration-150 ease-linear"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>

        <div className="mt-4 flex items-center justify-between gap-6">
          <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-muted/70">
            Beyond the interface — Aagash
          </span>
          <button
            type="button"
            onClick={skip}
            className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent"
          >
            Skip intro
          </button>
        </div>
      </div>
    </motion.div>
  );
}
