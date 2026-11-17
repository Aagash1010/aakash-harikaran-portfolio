import { useEffect, useRef } from "react";
import {
  ArrowUpRight,
  Briefcase,
  CircleDashed,
  Download,
  GraduationCap,
  MapPin,
} from "lucide-react";
import { profile, timeline, type TimelineItem } from "../../data/profile";
import { cn, scrollToSection } from "../../lib/utils";
import { ButtonLink } from "../ui/Button";
import { Magnetic } from "../ui/Magnetic";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

function StationCard({
  item,
  index,
  hint,
}: {
  item: TimelineItem;
  index: number;
  hint?: boolean;
}) {
  const isEducation = item.type === "Education";
  const Icon = isEducation
    ? GraduationCap
    : item.type === "Internship"
      ? Briefcase
      : CircleDashed;

  return (
    <div
      className={cn(
        "relative flex h-full flex-col border p-5 transition-colors duration-500 sm:p-6",
        hint
          ? "border-dashed border-line bg-transparent"
          : "border-line bg-base/45 hover:border-accent/30",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 font-mono text-[7.5px] uppercase tracking-[0.18em] text-accent">
          <Icon size={11} strokeWidth={1.6} aria-hidden />
          {item.period}
        </span>
        <span className="font-mono text-[7px] uppercase tracking-[0.16em] text-muted/55">
          {String(index + 1).padStart(2, "0")} / {String(timeline.length).padStart(2, "0")}
        </span>
      </div>

      <span className="mt-4 w-fit border border-line px-2 py-1 font-mono text-[6.5px] uppercase tracking-[0.14em] text-muted/70">
        {item.type}
      </span>

      <h3
        className={cn(
          "mt-3 font-display text-[clamp(1.25rem,2.1vw,1.75rem)] font-bold uppercase leading-[0.98] tracking-[-0.035em]",
          hint ? "text-muted" : "text-ink",
        )}
      >
        {item.role}
        {item.current && !hint ? <span className="text-lime">.</span> : null}
      </h3>

      <p className="mt-2 flex items-start gap-1.5 text-[11.5px] leading-snug text-muted">
        {isEducation ? (
          <MapPin size={10} className="mt-0.5 shrink-0 text-accent" aria-hidden />
        ) : null}
        {item.org}
      </p>

      {isEducation ? (
        <div className="mt-3 border-l border-line pl-3">
          <p className="font-mono text-[7px] uppercase leading-relaxed tracking-[0.13em] text-muted/70">
            {profile.degreeShort}
          </p>
          <p className="serif-accent mt-1 text-[12.5px] leading-snug tracking-[-0.01em] text-accent/90">
            {profile.specialization} specialization
          </p>
        </div>
      ) : null}

      <p className="body-copy mt-4 text-[11.5px] leading-relaxed">{item.summary}</p>

      <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
        {item.focus.map((focus) => (
          <span
            key={focus}
            className="border border-line px-2 py-1 font-mono text-[6.5px] uppercase tracking-[0.12em] text-muted/75"
          >
            {focus}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Experience() {
  const desktopRef = useRef<HTMLDivElement>(null);
  const desktopLineRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLOListElement>(null);
  const mobileLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const desktop = desktopRef.current;
    const desktopLine = desktopLineRef.current;
    const mobile = mobileRef.current;
    const mobileLine = mobileLineRef.current;
    if (!desktop || !desktopLine || !mobile || !mobileLine) return;

    // GSAP + ScrollTrigger only matter for this section, so they live in their
    // own chunk instead of the initial bundle. The markup and scroll position
    // are unaffected while the chunk loads.
    let cancelled = false;
    let revert: (() => void) | undefined;

    void (async () => {
      const [gsapModule, scrollTriggerModule] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      const gsap = gsapModule.gsap ?? gsapModule.default;
      const { ScrollTrigger } = scrollTriggerModule;
      gsap.registerPlugin(ScrollTrigger);

      const media = gsap.matchMedia();
      revert = () => media.revert();

      media.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.fromTo(
            desktopLine,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: desktop,
                start: "top 78%",
                end: "bottom 74%",
                scrub: 0.6,
              },
            },
          );

          gsap.fromTo(
            desktop.querySelectorAll("[data-station]"),
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.85,
              stagger: 0.14,
              ease: "power3.out",
              scrollTrigger: { trigger: desktop, start: "top 80%", once: true },
            },
          );
        },
      );

      media.add(
        "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.fromTo(
            mobileLine,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              transformOrigin: "top center",
              scrollTrigger: {
                trigger: mobile,
                start: "top 82%",
                end: "bottom 78%",
                scrub: 0.6,
              },
            },
          );
        },
      );
    })();

    return () => {
      cancelled = true;
      revert?.();
    };
  }, []);

  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="section-shell relative overflow-x-clip border-y border-line bg-panel/20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 top-24 hidden select-none font-display text-[14rem] font-bold uppercase leading-none tracking-[-0.07em] text-ink/[0.016] xl:block"
      >
        Path
      </div>

      <div className="container-x relative">
        <SectionHeading
          index="04"
          label="Journey / Timeline"
          id="experience-heading"
          lines={[
            "The path",
            <>
              so far<span className="text-lime">.</span>
            </>,
          ]}
          description="Education and experience on one axis: a full-stack internship at Codevda Technologies and an Artificial Intelligence specialization at SLIIT. Only verified milestones are listed."
        />

        {/* ---------- Desktop: horizontal axis ---------- */}
        <div ref={desktopRef} className="relative mt-14 hidden md:block lg:mt-20">
          <div className="mb-3 flex items-center justify-between font-mono text-[7px] uppercase tracking-[0.2em] text-muted/45">
            <span>Earlier</span>
            <span className="flex items-center gap-2 text-accent">
              <span className="size-1 rounded-full bg-lime" />
              Now
            </span>
          </div>

          <div className="relative h-px w-full bg-line">
            <div
              ref={desktopLineRef}
              aria-hidden
              className="absolute inset-0 origin-left bg-lime"
            />
            <span
              aria-hidden
              className="absolute -right-px top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-lime"
            />
          </div>

          <div className="grid grid-cols-2 gap-6 lg:gap-10">
            {timeline.map((item, index) => {
              const hint = false;
              return (
                <div key={`${item.org}-${item.period}`} data-station className="relative">
                  <span
                    aria-hidden
                    className={cn(
                      "absolute left-0 top-0 grid size-[15px] -translate-y-1/2 place-items-center rounded-full border",
                      hint
                        ? "border-dashed border-muted/60 bg-base"
                        : item.current
                          ? "border-lime bg-lime"
                          : "border-accent/60 bg-base",
                    )}
                  >
                    {item.current && !hint ? (
                      <span className="pulse-dot absolute inset-0 rounded-full bg-lime text-lime" />
                    ) : null}
                  </span>
                  <span
                    aria-hidden
                    className="absolute left-[7px] top-0 h-8 w-px bg-line"
                  />

                  <div className="pt-9">
                    <StationCard item={item} index={index} hint={hint} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ---------- Mobile: vertical axis ---------- */}
        <ol ref={mobileRef} className="relative mt-10 md:hidden">
          <div aria-hidden className="absolute bottom-2 left-[7px] top-2 w-px bg-line" />
          <div
            ref={mobileLineRef}
            aria-hidden
            className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-lime"
          />

          {timeline.map((item, index) => {
            const hint = false;
            return (
              <li
                key={`${item.org}-${item.period}`}
                className="relative pb-6 pl-8 last:pb-0"
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute left-0 top-1.5 grid size-[15px] place-items-center rounded-full border",
                    hint
                      ? "border-dashed border-muted/60 bg-base"
                      : item.current
                        ? "border-lime bg-lime"
                        : "border-accent/60 bg-base",
                  )}
                >
                  {item.current && !hint ? (
                    <span className="pulse-dot absolute inset-0 rounded-full bg-lime text-lime" />
                  ) : null}
                </span>
                <Reveal y={18} amount={0.1}>
                  <StationCard item={item} index={index} hint={hint} />
                </Reveal>
              </li>
            );
          })}
        </ol>

        <div className="mt-12 flex flex-col gap-5 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between md:mt-16">
          <p className="max-w-xl font-mono text-[7.5px] uppercase leading-relaxed tracking-[0.16em] text-muted/55">
            Currently — {profile.degreeShort} / {profile.specialization} /{" "}
            {profile.university}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Magnetic strength={0.16}>
              <ButtonLink
                href={profile.cv}
                download
                variant="outline"
                size="sm"
                icon={<Download size={13} strokeWidth={1.6} />}
                iconSide="left"
              >
                Download CV
              </ButtonLink>
            </Magnetic>
            <button
              type="button"
              onClick={() => scrollToSection("contact")}
              className="group link-line font-mono text-[8px] uppercase tracking-[0.18em] text-muted hover:text-accent"
            >
              Write the next entry
              <ArrowUpRight
                size={12}
                strokeWidth={1.6}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
