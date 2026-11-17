import {
  Component,
  Suspense,
  lazy,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowDownRight, Download, MapPin } from "lucide-react";
import { hero, profile } from "../../data/profile";
import { useToast } from "../../context/ToastProvider";
import { EASE_CINEMA, EASE_OUT, STAGGER } from "../../lib/motion";
import { scrollToSection } from "../../lib/utils";
import { Button, ButtonLink } from "../ui/Button";
import { GithubMark, LinkedinMark } from "../ui/BrandIcons";
import { Magnetic } from "../ui/Magnetic";
import { SocialLinks } from "../ui/SocialLinks";
import { SplitText } from "../ui/SplitText";
import { SriLankaClock } from "../ui/SriLankaClock";
import { HeroOrb } from "../visuals/HeroOrb";
import { PortraitFrame } from "../visuals/PortraitFrame";

const HeroScene = lazy(() => import("../visuals/HeroScene"));

class SceneBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    // A missing WebGL context should never take the hero down; the SVG
    // sculpture is a complete substitute.
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.075, delayChildren: 0.18 },
  },
};

const fade = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: EASE_OUT },
  },
};

/** Nested stagger for the role list, CTA row and fact grid. */
const row = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER.loose, delayChildren: 0.05 },
  },
};

export function Hero({ revealed }: { revealed: boolean }) {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [sceneEnabled, setSceneEnabled] = useState(false);
  const { notify } = useToast();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const nameDrift = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const visualDrift = useTransform(scrollYProgress, [0, 1], [0, -46]);

  const linkedin = profile.socials.find((social) => social.icon === "linkedin");
  const github = profile.socials.find((social) => social.icon === "github");

  useEffect(() => {
    // WebGL is desktop-only: phones get the lighter sculpture, which keeps the
    // first paint and mobile battery cost low.
    const query = window.matchMedia(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
    );
    const update = () => setSceneEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      aria-labelledby="hero-heading"
      className="relative flex min-h-[100svh] flex-col overflow-hidden pb-8 pt-24 sm:pt-28 lg:pb-10 lg:pt-32"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="pointer-drift--inverse absolute inset-0 bg-[radial-gradient(ellipse_62%_58%_at_78%_18%,rgba(198,255,77,0.075),transparent_68%)]" />
        <div className="pointer-drift absolute inset-0 blueprint-grid opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" />
        <div className="pointer-drift absolute left-[18%] top-[6%] size-[38rem] rounded-full bg-[radial-gradient(circle,rgba(198,255,77,0.06),transparent_62%)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-base to-transparent" />
        <div className="absolute left-1/2 top-[22%] hidden -translate-x-1/2 whitespace-nowrap font-display text-[13vw] font-bold uppercase leading-none tracking-[-0.06em] text-ink/[0.018] lg:block">
          Beyond
        </div>
      </div>

      <div className="container-x relative z-10 flex flex-1 flex-col">
        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={revealed ? { opacity: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3"
        >
          <p className="eyebrow">
            <span className="text-accent">00</span>
            <span aria-hidden className="h-px w-6 bg-line sm:w-10" />
            <span className="text-ink/80">{hero.eyebrow}</span>
          </p>
          <span className="flex items-center gap-2 border border-line bg-panel/40 px-3 py-1.5 backdrop-blur-sm">
            <span className="relative flex size-1.5">
              <span className="pulse-dot absolute inset-0 rounded-full bg-lime text-lime" />
            </span>
            <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted">
              {profile.availability.short}
            </span>
          </span>
        </motion.div>

        <div className="mt-10 grid items-center gap-12 pb-4 pt-6 sm:gap-14 lg:mt-auto lg:grid-cols-12 lg:gap-8 lg:pb-6 lg:pt-8 xl:gap-10">
          <motion.div
            variants={container}
            initial={reduced ? false : "hidden"}
            animate={revealed ? "visible" : "hidden"}
            className="pointer-drift--soft relative z-10 min-w-0 lg:col-span-8"
          >
            <motion.ul
              variants={row}
              aria-label="Professional roles"
              className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[8.5px] uppercase tracking-[0.2em] text-muted sm:text-[9px]"
            >
              {hero.roles.map((role, index) => (
                <motion.li
                  key={role}
                  variants={fade}
                  className="flex items-center gap-3"
                >
                  {index > 0 ? (
                    <span aria-hidden className="text-lime/70">
                      /
                    </span>
                  ) : null}
                  <span className={index === 0 ? "text-ink/85" : undefined}>
                    {role}
                  </span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.h1
              id="hero-heading"
              aria-label={profile.name}
              className="hero-name mt-4 text-ink sm:mt-5"
            >
              <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                <SplitText
                  text="Aagash"
                  mode="chars"
                  masked={false}
                  active={revealed}
                  delay={0.2}
                  stagger={0.05}
                  duration={1.1}
                />
              </span>
              <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                <SplitText
                  text="Harikaran"
                  mode="chars"
                  masked={false}
                  active={revealed}
                  delay={0.32}
                  stagger={0.045}
                  duration={1.1}
                />
                <motion.span
                  aria-hidden
                  className="inline-block text-lime"
                  initial={reduced ? false : { opacity: 0, scale: 0.3 }}
                  animate={
                    revealed || reduced ? { opacity: 1, scale: 1 } : undefined
                  }
                  transition={{ duration: 0.7, delay: 0.98, ease: EASE_CINEMA }}
                >
                  .
                </motion.span>
              </span>
            </motion.h1>

            <motion.p
              variants={fade}
              className="mt-6 max-w-2xl font-display text-[clamp(1.4rem,2.6vw,2.25rem)] font-medium leading-[1.08] tracking-[-0.04em] text-ink sm:mt-7"
            >
              <SplitText
                text="Turning ideas into"
                active={revealed}
                delay={0.58}
                stagger={0.045}
                duration={0.8}
                masked={false}
              />{" "}
              <motion.span
                className="serif-accent normal-case tracking-[-0.01em] text-accent"
                initial={reduced ? false : { opacity: 0, y: 10 }}
                animate={revealed || reduced ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.9, delay: 0.86, ease: EASE_CINEMA }}
              >
                meaningful digital experiences.
              </motion.span>
            </motion.p>

            <motion.p
              variants={fade}
              className="body-copy mt-5 max-w-xl text-[13.5px] leading-[1.75] sm:text-[14px]"
            >
              {hero.supporting}
            </motion.p>

            <motion.div
              variants={row}
              className="mt-7 flex flex-wrap items-center gap-2.5 sm:mt-9 sm:gap-3"
            >
              <motion.div variants={fade}>
                <Magnetic strength={0.2}>
                  <ButtonLink
                    href="#projects"
                    onClick={(event) => {
                      event.preventDefault();
                      scrollToSection("projects");
                    }}
                    icon={<ArrowDownRight size={15} strokeWidth={1.7} />}
                  >
                    Explore My Work
                  </ButtonLink>
                </Magnetic>
              </motion.div>
              <motion.div variants={fade}>
                <Magnetic strength={0.16}>
                  <ButtonLink
                    href={profile.cv}
                    download
                    variant="outline"
                    icon={<Download size={13} strokeWidth={1.6} />}
                    iconSide="left"
                  >
                    Download My CV
                  </ButtonLink>
                </Magnetic>
              </motion.div>
              <motion.div variants={fade}>
                <Magnetic strength={0.16}>
                  {linkedin?.href ? (
                    <ButtonLink
                      href={linkedin.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      variant="outline"
                      icon={<LinkedinMark size={13} />}
                      iconSide="left"
                    >
                      Connect on LinkedIn
                    </ButtonLink>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        notify(
                          "LinkedIn profile link is not published yet — it will be added once available.",
                        )
                      }
                      icon={<LinkedinMark size={13} />}
                      iconSide="left"
                    >
                      Connect on LinkedIn
                    </Button>
                  )}
                </Magnetic>
              </motion.div>
            </motion.div>

            <motion.dl
              variants={row}
              className="mt-9 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-5 sm:grid-cols-4 sm:gap-x-4"
            >
              {hero.facts.map((fact) => (
                <motion.div key={fact.label} variants={fade}>
                  <dt className="font-mono text-[6.5px] uppercase tracking-[0.18em] text-muted/65">
                    {fact.label}
                  </dt>
                  <dd className="mt-1.5 text-[11.5px] leading-snug text-ink/90">
                    {fact.value}
                  </dd>
                </motion.div>
              ))}
            </motion.dl>
          </motion.div>

          <div className="relative min-w-0 lg:col-span-4">
            {/* Mobile / tablet sculpture: a small orbital presence above the frame. */}
            <motion.div
              aria-hidden
              initial={reduced ? false : { opacity: 0, scale: 0.92 }}
              animate={revealed ? { opacity: 0.62, scale: 1 } : {}}
              transition={{ duration: 1.4, delay: 0.55, ease: EASE_OUT }}
              className="pointer-events-none absolute -right-[4%] -top-[22%] z-0 aspect-square w-[60%] [mask-image:linear-gradient(to_bottom,black_18%,transparent_88%)] sm:w-[52%] lg:hidden"
            >
              <HeroOrb className="h-full w-full" />
            </motion.div>

            {/* Desktop WebGL core — positioned so it reads above and beside the portrait,
                not behind it. */}
            <motion.div
              aria-hidden
              initial={reduced ? false : { opacity: 0, scale: 0.94 }}
              animate={revealed ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1.4, delay: 0.35, ease: EASE_OUT }}
              style={{ y: reduced ? 0 : visualDrift }}
              className="pointer-events-none absolute -left-[42%] -top-[32%] z-0 hidden aspect-square w-[82%] lg:block"
            >
              <div className="absolute inset-[16%] rounded-full bg-[radial-gradient(circle,rgba(198,255,77,0.1),transparent_64%)] blur-2xl" />
              {sceneEnabled ? (
                <Suspense fallback={<HeroOrb className="h-full w-full" />}>
                  <SceneBoundary fallback={<HeroOrb className="h-full w-full" />}>
                    <HeroScene className="h-full w-full" />
                  </SceneBoundary>
                </Suspense>
              ) : (
                <HeroOrb className="h-full w-full" />
              )}
            </motion.div>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 26 }}
              animate={revealed ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.1, delay: 0.5, ease: EASE_OUT }}
              style={{ y: reduced ? 0 : nameDrift }}
              className="relative z-10 mx-auto w-full max-w-[20rem] sm:max-w-[22rem] lg:ml-auto lg:mr-0 lg:max-w-[24rem] xl:max-w-[25rem]"
            >
              <PortraitFrame revealed={revealed} />

              <div className="mt-3 flex items-center justify-between gap-3 border border-line bg-panel/35 px-3 py-2">
                <a
                  href={profile.cv}
                  download
                  className="group inline-flex items-center gap-2 font-mono text-[7px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-accent"
                >
                  <Download size={10} strokeWidth={1.6} aria-hidden />
                  Curriculum vitae
                </a>
                {github?.href ? (
                  <a
                    href={github.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label="Open GitHub profile"
                    className="flex items-center gap-1.5 font-mono text-[7px] uppercase tracking-[0.14em] text-muted/60 transition-colors hover:text-accent"
                  >
                    <GithubMark size={10} aria-hidden />
                    {github.handle}
                  </a>
                ) : (
                  <span className="flex items-center gap-1.5 font-mono text-[7px] uppercase tracking-[0.14em] text-muted/60">
                    <GithubMark size={10} aria-hidden />
                    Links pending
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={revealed ? { opacity: 1 } : {}}
          transition={{ duration: 0.9, delay: 1.05 }}
          className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t border-line pt-5"
        >
          <div className="flex items-center gap-4">
            <span className="hidden font-mono text-[8px] uppercase tracking-[0.2em] text-muted/60 sm:inline">
              Find me
            </span>
            <SocialLinks />
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[8px] uppercase tracking-[0.16em] text-muted">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={11} strokeWidth={1.5} className="text-accent" aria-hidden />
              {profile.location}
            </span>
            <span aria-hidden className="hidden h-3 w-px bg-line sm:block" />
            <div className="hidden sm:block">
              <SriLankaClock />
            </div>
            <button
              type="button"
              onClick={() => scrollToSection("about")}
              className="group ml-auto inline-flex items-center gap-2.5 transition-colors hover:text-accent"
            >
              <span
                aria-hidden
                className="relative hidden h-7 w-3 items-start justify-center rounded-full border border-line/80 transition-colors group-hover:border-accent/50 sm:flex"
              >
                <span className="scroll-cue mt-1 size-1 rounded-full bg-lime" />
              </span>
              <span className="sm:hidden">Scroll</span>
              <span className="hidden sm:inline">Scroll to explore</span>
              <ArrowDownRight
                size={13}
                strokeWidth={1.6}
                className="transition-transform duration-300 group-hover:translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden
              />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
