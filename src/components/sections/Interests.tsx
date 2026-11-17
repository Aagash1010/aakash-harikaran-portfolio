import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Binary,
  Boxes,
  BrainCircuit,
  ChartSpline,
  Globe2,
  Layers,
  PenTool,
  Sparkles,
} from "lucide-react";
import { interests, type Interest } from "../../data/profile";
import { cn } from "../../lib/utils";
import { EASE_OUT } from "../../lib/motion";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

const interestIcons = {
  ai: BrainCircuit,
  ml: ChartSpline,
  fullstack: Layers,
  web: Globe2,
  cp: Binary,
  engineering: Boxes,
  uiux: PenTool,
} satisfies Record<Interest["icon"], typeof BrainCircuit>;

const marqueeOne = [...interests, ...interests];
const marqueeTwo = [...interests, ...interests];

export function Interests() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const active = interests[activeIndex];
  const reduced = useReducedMotion();
  const ActiveIcon = interestIcons[active.icon];

  const handlePointer = (event: React.PointerEvent<HTMLElement>) => {
    const element = sectionRef.current;
    if (!element || event.pointerType !== "mouse") return;
    const rect = element.getBoundingClientRect();
    element.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    element.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  return (
    <section
      id="interests"
      ref={sectionRef}
      aria-labelledby="interests-heading"
      onPointerMove={handlePointer}
      style={{ "--mx": "50%", "--my": "40%" } as React.CSSProperties}
      className="section-shell relative overflow-x-clip border-b border-line bg-panel/20"
    >
      {/* Pointer-reactive digital environment */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-30" />
        <div
          className="absolute inset-0 blueprint-grid opacity-70 transition-opacity duration-300"
          style={{
            maskImage:
              "radial-gradient(circle 480px at var(--mx) var(--my), #000 0%, transparent 74%)",
            WebkitMaskImage:
              "radial-gradient(circle 480px at var(--mx) var(--my), #000 0%, transparent 74%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle 520px at var(--mx) var(--my), rgba(198,255,77,0.07), transparent 70%)",
          }}
        />
        {[
          { x: "12%", y: "22%", size: 3, delay: "0s" },
          { x: "78%", y: "18%", size: 2, delay: "1.4s" },
          { x: "88%", y: "62%", size: 3, delay: "0.7s" },
          { x: "24%", y: "74%", size: 2, delay: "2.1s" },
          { x: "58%", y: "36%", size: 2, delay: "3s" },
        ].map((dot) => (
          <span
            key={`${dot.x}-${dot.y}`}
            className="float-slow absolute rounded-full bg-lime/50"
            style={{
              left: dot.x,
              top: dot.y,
              width: dot.size,
              height: dot.size,
              animationDelay: dot.delay,
            }}
          />
        ))}
        <div className="pointer-events-none absolute -left-20 top-1/4 size-72 rounded-full bg-lime/[0.045] blur-[100px]" />
      </div>

      <div className="container-x relative">
        <SectionHeading
          index="EXP"
          label="Curiosity / In motion"
          id="interests-heading"
          lines={[
            "Currently",
            <>
              <span className="text-stroke">exploring</span>
              <span className="text-lime">.</span>
            </>,
          ]}
          description="The directions pulling my attention right now. Some are formal studies, others are questions I keep returning to after hours. A direction of attention — never a claim of mastery."
        />
      </div>

      {/* ---------- Kinetic marquee ---------- */}
      <div className="relative mt-10 md:mt-14">
        <div className="border-y border-line py-5 md:py-7">
          <div className="marquee-track items-center gap-6 md:gap-10">
            {marqueeOne.map((interest, index) => (
              <span
                key={`row1-${interest.name}-${index}`}
                aria-hidden
                className="flex shrink-0 items-center gap-6 md:gap-10"
              >
                <span
                  className={cn(
                    "font-display text-[clamp(2rem,5.2vw,4.6rem)] font-bold uppercase leading-none tracking-[-0.05em] transition-colors duration-300",
                    index % 3 === 1 ? "text-stroke" : "text-ink",
                    index % 4 === 0 ? "text-accent" : "",
                  )}
                >
                  {interest.name}
                </span>
                <span className="font-display text-[clamp(0.85rem,1.6vw,1.3rem)] text-lime/70">
                  ✦
                </span>
              </span>
            ))}
          </div>
        </div>

        <div className="border-b border-line py-4">
          <div className="marquee-track marquee-track--reverse marquee-track--slow items-center gap-5 md:gap-8">
            {marqueeTwo.map((interest, index) => (
              <span
                key={`row2-${interest.name}-${index}`}
                aria-hidden
                className="flex shrink-0 items-baseline gap-5 md:gap-8"
              >
                <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-muted/45">
                  {String((index % interests.length) + 1).padStart(2, "0")}
                </span>
                <span className="serif-accent text-[clamp(1.05rem,2.2vw,1.65rem)] lowercase tracking-[-0.01em] text-muted/80">
                  {interest.tag}
                </span>
                <span aria-hidden className="h-px w-8 bg-line md:w-12" />
              </span>
            ))}
          </div>
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-base to-transparent sm:w-32"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-base to-transparent sm:w-32"
        />
      </div>

      <div className="container-x relative">
        <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-7">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted">
                Active curiosities
              </span>
              <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-muted/60">
                07 directions
              </span>
            </div>

            <div className="border-t border-line">
              {interests.map((interest, index) => {
                const Icon = interestIcons[interest.icon];
                const isActive = index === activeIndex;

                return (
                  <div key={interest.name} className="border-b border-line">
                    <button
                      type="button"
                      onMouseEnter={() => setActiveIndex(index)}
                      onFocus={() => setActiveIndex(index)}
                      onClick={() => setActiveIndex(index)}
                      aria-pressed={isActive}
                      data-cursor-label={isActive ? undefined : "EXPLORE"}
                      className={cn(
                        "group flex w-full items-center gap-4 py-4 text-left transition-colors duration-300 sm:gap-5 sm:py-5",
                        isActive ? "text-accent" : "text-ink hover:text-accent",
                      )}
                    >
                      <span
                        className={cn(
                          "w-6 shrink-0 font-mono text-[8px] tabular-nums tracking-[0.14em] transition-colors",
                          isActive ? "text-lime" : "text-muted/50",
                        )}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <Icon
                        size={16}
                        strokeWidth={1.4}
                        aria-hidden
                        className={cn(
                          "shrink-0 transition-all duration-300",
                          isActive
                            ? "text-accent"
                            : "text-muted/60 group-hover:text-accent",
                        )}
                      />
                      <span
                        className={cn(
                          "min-w-0 flex-1 font-display text-[clamp(1.1rem,2.1vw,1.7rem)] font-bold uppercase leading-tight tracking-[-0.03em] transition-transform duration-300",
                          isActive
                            ? "translate-x-0"
                            : "group-hover:translate-x-1",
                        )}
                      >
                        {interest.name}
                      </span>
                      <span className="hidden shrink-0 border border-line px-2 py-1 font-mono text-[6.5px] uppercase tracking-[0.14em] text-muted/60 sm:block">
                        {interest.tag}
                      </span>
                      <ArrowUpRight
                        size={15}
                        strokeWidth={1.5}
                        aria-hidden
                        className={cn(
                          "shrink-0 transition-all duration-300",
                          isActive
                            ? "translate-x-0 text-accent opacity-100"
                            : "-translate-x-1 text-muted opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                        )}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isActive ? (
                        <motion.div
                          initial={reduced ? false : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: EASE_OUT }}
                          className="overflow-hidden lg:hidden"
                        >
                          <p className="pb-4 pl-10 pr-6 text-[12px] leading-relaxed text-muted sm:pl-12">
                            {interest.description}
                          </p>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <p className="mt-5 font-mono text-[7px] uppercase leading-relaxed tracking-[0.16em] text-muted/45">
              Hover, focus or select a direction — nothing here is a finished claim
            </p>
          </div>

          <div className="hidden min-w-0 lg:col-span-5 lg:block">
            <Reveal delay={0.08} className="lg:sticky lg:top-28">
              <div className="relative flex min-h-[26rem] flex-col overflow-hidden border border-line bg-base/50 p-7">
                <div aria-hidden className="absolute inset-0 blueprint-grid opacity-30" />
                <div
                  aria-hidden
                  className="absolute -right-16 -top-16 size-64 rounded-full bg-lime/[0.06] blur-[70px]"
                />
                <span
                  aria-hidden
                  className="absolute -bottom-10 right-2 select-none font-display text-[10rem] font-bold leading-none tracking-[-0.07em] text-ink/[0.03]"
                >
                  {String(activeIndex + 1).padStart(2, "0")}
                </span>

                <div className="relative flex items-center justify-between">
                  <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted">
                    Active curiosity
                  </span>
                  <span className="font-mono text-[7.5px] uppercase tracking-[0.16em] text-accent">
                    {active.tag}
                  </span>
                </div>

                <div className="relative mt-8 grid size-16 place-items-center border border-accent/25 bg-lime-soft">
                  <span className="absolute inset-0 border border-dashed border-lime/20 orbit-spin" />
                  <ActiveIcon size={26} strokeWidth={1.25} className="text-accent" aria-hidden />
                </div>

                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={active.name}
                    initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.3, ease: EASE_OUT }}
                    className="relative mt-6"
                  >
                    <h3 className="font-display text-[clamp(1.6rem,2.6vw,2.2rem)] font-bold uppercase leading-[0.98] tracking-[-0.04em] text-ink">
                      {active.name}
                    </h3>
                    <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-muted">
                      {active.description}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <div className="relative mt-auto flex items-center justify-between border-t border-line pt-4">
                  <div className="flex items-center gap-1.5">
                    {interests.map((interest, index) => (
                      <button
                        key={interest.name}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        aria-label={`Show ${interest.name}`}
                        aria-pressed={index === activeIndex}
                        className={cn(
                          "h-1 transition-all duration-300",
                          index === activeIndex
                            ? "w-6 bg-lime"
                            : "w-2 bg-line hover:bg-muted",
                        )}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-[7px] uppercase tracking-[0.16em] text-muted/50">
                    {String(activeIndex + 1).padStart(2, "0")} / 07
                  </span>
                </div>
              </div>

              <p className="mt-4 flex items-start gap-2 font-mono text-[7px] uppercase leading-relaxed tracking-[0.14em] text-muted/45">
                <Sparkles size={10} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                Curiosity in progress — not claimed expertise
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
