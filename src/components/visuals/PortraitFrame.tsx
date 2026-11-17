import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { ScanFace } from "lucide-react";
import { profile } from "../../data/profile";

/**
 * PORTRAIT INTEGRATION
 * The hero portrait lives in `public/portrait.jpg` and is presented exactly as
 * photographed — no generated face, no retouching, no filters on the subject.
 * The frame supplies the art direction: a masked reveal, a slow scroll parallax,
 * restrained lighting overlays and the same hairline language as the rest of
 * the interface. Replace the file (keeping the name) to update the portrait.
 */
export function PortraitFrame({ revealed = true }: { revealed?: boolean }) {
  const reduced = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, { stiffness: 130, damping: 18 });
  const rotateY = useSpring(tiltY, { stiffness: 130, damping: 18 });

  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ["start end", "end start"],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], ["-2.4%", "2.4%"]);

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    tiltY.set(px * 5);
    tiltX.set(py * -5);
  };

  const resetTilt = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <div ref={frameRef} className="group relative mx-auto w-full">
      {/* Ambient bloom so the portrait separates from the page without a hard edge. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-8 -z-10 bg-[radial-gradient(ellipse_at_55%_38%,rgba(198,255,77,0.11),transparent_66%)] blur-2xl"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute -inset-2 border border-line/70 transition-colors duration-500 group-hover:border-accent/25"
      />

      <motion.div
        style={{ rotateX, rotateY, transformPerspective: 1100 }}
        onPointerMove={handleMove}
        onPointerLeave={resetTilt}
        className="relative will-change-transform"
      >
        <div className="noise-surface relative overflow-hidden border border-white/15 bg-[#0d0d0d] shadow-[0_44px_110px_-44px_rgba(0,0,0,0.9)]">
          <div className="relative z-20 flex items-center justify-between gap-4 border-b border-white/10 bg-[#0a0a0a] px-4 py-2.5">
            <span className="font-mono text-[7px] uppercase tracking-[0.24em] text-[#f5f5f5]/70">
              Portrait / 001
            </span>
            <span className="flex items-center gap-2 font-mono text-[7px] uppercase tracking-[0.2em] text-[#858585]">
              06° 55′ N
              <ScanFace size={12} strokeWidth={1.4} className="text-[#c6ff4d]/80" />
            </span>
          </div>

          <div className="relative aspect-[6/7] overflow-hidden">
            {profile.photo ? (
              <>
                <motion.div
                  className="absolute inset-0"
                  initial={
                    reduced
                      ? false
                      : { clipPath: "inset(0 0 100% 0)", scale: 1.05 }
                  }
                  animate={
                    revealed || reduced
                      ? { clipPath: "inset(0 0 0% 0)", scale: 1 }
                      : undefined
                  }
                  transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Parallax layer — the photograph itself is never altered. */}
                  <motion.div
                    className="absolute inset-[-4%]"
                    style={{ y: reduced ? 0 : photoY }}
                  >
                    <div className="h-full w-full transition-transform duration-[1600ms] ease-out group-hover:scale-[1.025]">
                      <img
                        src={profile.photo}
                        srcSet="/portrait-sm.jpg 640w, /portrait-md.jpg 900w, /portrait.jpg 1215w"
                        sizes="(min-width: 1024px) 25rem, (min-width: 640px) 22rem, 80vw"
                        alt={profile.photoAlt}
                        width={1215}
                        height={1295}
                        loading="eager"
                        decoding="async"
                        fetchPriority="high"
                        className="h-full w-full object-cover object-[54%_center]"
                      />
                    </div>
                  </motion.div>
                </motion.div>

                {/* Lighting + integration overlays. Neutral, low-opacity treatment
                    only — the face, skin tone and hair stay exactly as photographed. */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/3 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/25 to-transparent"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/5 bg-[linear-gradient(90deg,rgba(8,8,8,0.26),transparent)]"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_86%_4%,rgba(255,247,232,0.05),transparent_38%)]"
                />

              </>
            ) : (
              <div className="absolute inset-0 bg-[linear-gradient(150deg,#171717_0%,#0c0c0c_58%,#111111_100%)]">
                <div aria-hidden className="absolute inset-0 blueprint-grid opacity-40" />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(198,255,77,0.14),transparent_58%)]"
                />
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-9 h-px bg-gradient-to-r from-transparent via-[#c6ff4d]/50 to-transparent"
                />

                <div className="absolute inset-0 flex flex-col justify-center px-6">
                  <div className="relative mx-auto flex flex-col items-center">
                    <div
                      aria-hidden
                      className="absolute -inset-8 rounded-full border border-white/10"
                    />
                    <div
                      aria-hidden
                      className="orbit-spin-reverse absolute -inset-12 rounded-full border border-dashed border-white/[0.13]"
                    />
                    <span className="font-display text-[clamp(4.6rem,12vw,7rem)] font-bold leading-[0.78] tracking-[-0.09em] text-[#f5f5f5]/90 transition-transform duration-700 group-hover:-translate-y-1">
                      A<span className="text-[#c6ff4d]">H</span>
                    </span>
                    <span className="mt-6 h-px w-12 bg-[#c6ff4d]/60" />
                    <span className="mt-4 font-mono text-[8px] uppercase tracking-[0.34em] text-[#858585]">
                      Portrait incoming
                    </span>
                  </div>
                </div>

                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4">
                  <p className="max-w-[11rem] text-[10.5px] leading-relaxed text-[#858585]">
                    A reserved frame for the person behind the interface.
                  </p>
                  <span className="shrink-0 font-mono text-[7px] leading-relaxed text-[#858585]/70">
                    07.8731° N
                    <br />
                    080.7718° E
                  </span>
                </div>

                <div
                  aria-hidden
                  className="scan-line pointer-events-none absolute inset-x-6 top-0 h-14 bg-gradient-to-b from-transparent via-[#c6ff4d]/[0.06] to-transparent"
                />
              </div>
            )}

            <div aria-hidden className="pointer-events-none absolute inset-2.5 z-20">
              <span className="absolute left-0 top-0 size-3.5 border-l border-t border-[#c6ff4d]/60 transition-all duration-500 group-hover:size-5" />
              <span className="absolute right-0 top-0 size-3.5 border-r border-t border-[#c6ff4d]/60 transition-all duration-500 group-hover:size-5" />
              <span className="absolute bottom-0 left-0 size-3.5 border-b border-l border-[#c6ff4d]/60 transition-all duration-500 group-hover:size-5" />
              <span className="absolute bottom-0 right-0 size-3.5 border-b border-r border-[#c6ff4d]/60 transition-all duration-500 group-hover:size-5" />
            </div>

            {/* Subject plate — sits on the frame, never over the face. */}
            <div className="pointer-events-none absolute inset-x-3.5 bottom-3.5 z-20 flex items-end justify-between gap-3">
              <p className="font-mono text-[6.5px] uppercase leading-relaxed tracking-[0.2em] text-[#f5f5f5]/60">
                Studio light
                <br />
                <span className="text-[#c6ff4d]/80">Unedited frame</span>
              </p>
              <span className="font-mono text-[6.5px] uppercase tracking-[0.18em] text-[#858585]/60">
                {profile.location}
              </span>
            </div>
          </div>

          <div className="relative z-20 flex items-center justify-between gap-4 border-t border-white/10 bg-[#0a0a0a] px-4 py-3.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <span aria-hidden className="h-7 w-px shrink-0 bg-[#c6ff4d]/70" />
              <div className="min-w-0">
                <p className="truncate font-display text-[12px] font-semibold uppercase tracking-[0.02em] text-[#f5f5f5]">
                  {profile.name}
                </p>
                <p className="mt-0.5 truncate font-mono text-[7px] uppercase tracking-[0.16em] text-[#858585]">
                  {profile.specialization} / {profile.university}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span className="flex items-center gap-1.5 font-mono text-[7px] uppercase tracking-[0.16em] text-[#c6ff4d]">
                <span className="relative flex size-1.5">
                  <span className="pulse-dot absolute inset-0 rounded-full bg-[#c6ff4d] text-[#c6ff4d]" />
                </span>
                Open
              </span>
              <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-[#858585]">
                2026
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
