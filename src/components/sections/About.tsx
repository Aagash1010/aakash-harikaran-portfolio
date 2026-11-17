import { useRef } from "react";
import { ArrowUpRight, MapPin, ScanFace } from "lucide-react";
import {
  aboutFacts,
  aboutFocus,
  aboutParagraphs,
  profile,
  stats,
} from "../../data/profile";
import { useParallax } from "../../hooks/useParallax";
import { scrollToSection } from "../../lib/utils";
import { DeveloperTerminal } from "../ui/DeveloperTerminal";
import { Reveal, MaskLine } from "../ui/Reveal";

function AboutPortrait() {
  const frameRef = useRef<HTMLDivElement>(null);
  useParallax(frameRef, 44);

  return (
    <div className="relative">
      <div
        ref={frameRef}
        className="group relative aspect-[4/5] overflow-hidden border border-line bg-elevated"
      >
        {profile.photo ? (
          <>
            <img
              src={profile.photo}
              srcSet="/portrait-sm.jpg 640w, /portrait-md.jpg 900w, /portrait.jpg 1215w"
              sizes="(min-width: 1024px) 34vw, (min-width: 640px) 60vw, 90vw"
              alt={profile.photoAlt}
              loading="lazy"
              decoding="async"
              width={1215}
              height={1295}
              className="absolute inset-x-0 -inset-y-12 h-[calc(100%+6rem)] w-full object-cover object-[54%_center] transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/85 via-transparent to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(160deg,#171717_0%,#0c0c0c_60%,#121212_100%)]">
            <div aria-hidden className="absolute inset-0 blueprint-grid opacity-40" />
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(circle_at_64%_26%,rgba(198,255,77,0.13),transparent_56%)]"
            />
            <svg
              viewBox="0 0 500 625"
              preserveAspectRatio="xMidYMid slice"
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              {Array.from({ length: 13 }).map((_, index) => (
                <path
                  key={index}
                  d={`M-40 ${70 + index * 42} C 90 ${20 + index * 44}, 190 ${140 + index * 28}, 290 ${96 + index * 30} S 430 ${34 + index * 38}, 540 ${84 + index * 36}`}
                  fill="none"
                  stroke="var(--c-line)"
                  strokeWidth="0.7"
                />
              ))}
              <circle cx="300" cy="210" r="72" fill="none" stroke="var(--c-accent)" strokeOpacity="0.28" />
              <circle
                cx="300"
                cy="210"
                r="42"
                fill="none"
                stroke="var(--c-accent)"
                strokeOpacity="0.45"
                strokeDasharray="3 6"
              />
              <circle cx="300" cy="210" r="4" fill="var(--c-accent)" />
              <path
                d="M60 470 C120 420 176 440 222 388 S268 330 300 210"
                fill="none"
                stroke="var(--c-accent)"
                strokeOpacity="0.55"
                strokeDasharray="3 7"
              />
            </svg>

            <span className="absolute left-5 top-5 font-mono text-[7px] uppercase tracking-[0.22em] text-[#858585]">
              Identity / 001
            </span>
            <ScanFace
              size={14}
              strokeWidth={1.3}
              className="absolute right-5 top-5 text-[#c6ff4d]/80"
              aria-hidden
            />

            <span className="absolute bottom-16 left-5 font-display text-[clamp(3.4rem,8vw,5.4rem)] font-bold leading-none tracking-[-0.08em] text-[#f5f5f5]/90">
              A<span className="text-[#c6ff4d]">H</span>
            </span>
            <span className="absolute bottom-6 left-5 font-mono text-[7px] uppercase tracking-[0.24em] text-[#858585]">
              Portrait placeholder / awaiting image
            </span>

            <div aria-hidden className="scan-line absolute inset-x-8 top-0 h-20 bg-gradient-to-b from-transparent via-[#c6ff4d]/[0.05] to-transparent" />
          </div>
        )}

        <div aria-hidden className="pointer-events-none absolute inset-3">
          <span className="absolute left-0 top-0 size-4 border-l border-t border-lime/40" />
          <span className="absolute right-0 top-0 size-4 border-r border-t border-lime/40" />
          <span className="absolute bottom-0 left-0 size-4 border-b border-l border-lime/40" />
          <span className="absolute bottom-0 right-0 size-4 border-b border-r border-lime/40" />
        </div>

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 border-t border-white/10 bg-[#0a0a0a]/80 px-4 py-3 backdrop-blur-sm">
          <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-[#858585]">
            Sri Lanka / 06° 55′ N
          </span>
          <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-[#c6ff4d]">
            Est. curiosity
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-muted/55">
          Portrait / studio archive
        </p>
        <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-muted/55">
          Archive 2026
        </span>
      </div>
    </div>
  );
}

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="section-shell relative overflow-x-clip border-t border-line"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-10 top-20 hidden select-none font-display text-[18rem] font-bold uppercase leading-none tracking-[-0.07em] text-ink/[0.015] xl:block"
      >
        01
      </div>

      <div className="container-x relative">
        <Reveal className="flex flex-wrap items-center gap-3.5" y={12}>
          <span className="mono-label text-accent">01</span>
          <span aria-hidden className="h-px w-8 bg-line sm:w-12" />
          <span className="mono-label text-muted">Profile / About</span>
          <span className="mono-label ml-auto hidden text-muted/45 md:block">
            AAGASH HARIKARAN / SOFTWARE DEVELOPER
          </span>
        </Reveal>

        <div className="mt-7 grid items-end gap-6 md:mt-9 md:grid-cols-12 md:gap-10">
          <h2 id="about-heading" className="h-section md:col-span-8">
            <MaskLine>Learning deeply.</MaskLine>
            <MaskLine delay={0.08}>
              Building deliberately<span className="text-lime">.</span>
            </MaskLine>
          </h2>
          <Reveal
            className="body-copy max-w-md md:col-span-4 md:justify-self-end lg:max-w-xs"
            delay={0.16}
          >
            An Information Technology undergraduate specializing in AI, with a
            practical focus on software engineering, full-stack development and
            useful digital products.
          </Reveal>
        </div>

        <Reveal y={12} className="mt-10 md:mt-14">
          <div className="signal-line" />
        </Reveal>

        <div className="mt-10 grid gap-12 md:mt-14 lg:grid-cols-12 lg:gap-14 xl:gap-20">
          <Reveal className="min-w-0 lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <AboutPortrait />

              <dl className="mt-7 border-t border-line">
                {aboutFacts.map((fact) => (
                  <div
                    key={fact.label}
                    className="flex items-start justify-between gap-6 border-b border-line py-3"
                  >
                    <dt className="font-mono text-[7px] uppercase tracking-[0.18em] text-muted/70">
                      {fact.label}
                    </dt>
                    <dd className="max-w-[60%] text-right text-[11.5px] leading-snug text-ink/90">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="mt-4 flex items-center gap-1.5 font-mono text-[7px] uppercase tracking-[0.18em] text-muted/50">
                <MapPin size={10} className="text-accent" aria-hidden />
                {profile.educationLocation} / SLST
              </p>
            </div>
          </Reveal>

          <div className="min-w-0 lg:col-span-7">
            <Reveal>
              <p className="lead-copy max-w-2xl">
                I&apos;m Aagash Harikaran, an Information Technology undergraduate
                at SLIIT, Sri Lanka, specializing in{" "}
                <span className="serif-accent text-accent">Artificial Intelligence</span>.
                My work sits at the intersection of software engineering,
                full-stack development and intelligent systems.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="body-copy mt-6 max-w-2xl">{aboutParagraphs[1]}</p>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="body-copy mt-5 max-w-2xl">{aboutParagraphs[2]}</p>
            </Reveal>

            <Reveal delay={0.12} className="mt-8">
              <div className="flex flex-col gap-4 border-y border-line py-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted">
                  Current focus
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {aboutFocus.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-line px-3 py-1.5 font-mono text-[7.5px] uppercase tracking-[0.14em] text-muted transition-colors hover:border-accent/40 hover:text-accent"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <blockquote className="mt-8 max-w-2xl border-l border-lime/60 pl-5 sm:pl-7">
                <p className="serif-accent text-[clamp(1.4rem,2.3vw,1.95rem)] leading-[1.24] tracking-[-0.02em] text-ink/90">
                  &ldquo;Clean implementation, clear interfaces and software that
                  is useful to the people who use it.&rdquo;
                </p>
              </blockquote>
            </Reveal>

            <div className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              <Reveal delay={0.18}>
                <div>
                  <p className="mono-label text-accent">The foundation</p>
                  <p className="body-copy mt-3 text-[13px]">
                    {aboutParagraphs[3]}
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.21}>
                <div>
                  <p className="mono-label text-accent">The next step</p>
                  <p className="body-copy mt-3 text-[13px]">
                    {aboutParagraphs[4]}
                  </p>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.24} className="mt-9">
              <button
                type="button"
                onClick={() => scrollToSection("contact")}
                className="group link-line font-mono text-[9px] uppercase tracking-[0.16em] text-ink"
              >
                Let&apos;s build something
                <ArrowUpRight
                  size={14}
                  strokeWidth={1.6}
                  className="text-accent transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </button>
            </Reveal>
          </div>
        </div>

        {/* ---------- Interactive developer terminal ---------- */}
        <Reveal y={20} className="mt-16 md:mt-24">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="min-w-0 lg:col-span-4">
              <p className="mono-label text-accent">Interactive / 01</p>
              <h3 className="mt-4 font-display text-[clamp(1.7rem,3vw,2.5rem)] font-bold uppercase leading-[0.96] tracking-[-0.04em] text-ink">
                Ask the terminal<span className="text-lime">.</span>
              </h3>
              <p className="body-copy mt-4 max-w-sm text-[13px]">
                A working shell, not a decoration. Type a command or use a
                shortcut to read the same information that appears across this
                portfolio.
              </p>
              <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-line pt-4 font-mono text-[7px] uppercase tracking-[0.14em] text-muted/70">
                {["whoami", "education", "skills", "projects", "internship", "contact"].map(
                  (command) => (
                    <li key={command} className="flex items-center gap-2">
                      <span aria-hidden className="size-1 rounded-full bg-lime/70" />
                      {command}
                    </li>
                  ),
                )}
              </ul>
              <p className="mt-5 font-mono text-[7px] uppercase leading-relaxed tracking-[0.14em] text-muted/45">
                Runs entirely in the browser. Nothing is sent or stored.
              </p>
            </div>

            <div className="min-w-0 lg:col-span-8">
              <DeveloperTerminal />
            </div>
          </div>
        </Reveal>

        <div className="mt-16 md:mt-24">
          <Reveal y={20}>
            <p className="h-mega text-balance">
              <span className="block text-muted/35">Building</span>
              <span className="block">
                possi<span className="serif-accent normal-case text-accent">bilities.</span>
              </span>
            </p>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 border-t border-line md:mt-14 md:grid-cols-4">
            {stats.map((stat, index) => (
              <Reveal
                key={stat.label}
                delay={index * 0.06}
                className="border-b border-line px-1 py-6 md:border-b-0 md:border-r md:px-6 md:py-8 md:last:border-r-0"
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-[clamp(2rem,4vw,3.4rem)] font-bold leading-none tracking-[-0.05em] text-ink">
                    {stat.value}
                  </span>
                  <span className="font-mono text-[7px] uppercase tracking-[0.16em] text-lime">
                    0{index + 1}
                  </span>
                </div>
                <p className="mt-2 font-mono text-[7.5px] uppercase tracking-[0.18em] text-muted">
                  {stat.label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
