import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Layers, Plus, Sparkles } from "lucide-react";
import { GithubMark } from "../ui/BrandIcons";
import { projects, type Project } from "../../data/profile";
import { useToast } from "../../context/ToastProvider";
import { cn, scrollToSection } from "../../lib/utils";
import { EASE_OUT } from "../../lib/motion";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";
import { Button, ButtonLink } from "../ui/Button";
import { ProjectVisual } from "../visuals/ProjectVisual";

function usePlaceholderLinks(project: Project) {
  const { notify } = useToast();
  return {
    github: () =>
      notify(
        `GitHub repository for ${project.shortTitle} is pending — it will be linked once published.`,
      ),
    demo: () =>
      notify(
        `Live demo for ${project.shortTitle} is not published yet — no link has been invented.`,
      ),
  };
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const flipped = index % 2 === 1;
  const reduced = useReducedMotion();
  const links = usePlaceholderLinks(project);
  const href = `/work/${project.id}`;

  return (
    <article
      id={project.id}
      className="group relative scroll-mt-28 border-t border-line pt-8 md:pt-10"
      data-cursor="project"
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute -top-3 hidden select-none font-display text-[clamp(4rem,9vw,8rem)] font-bold leading-none tracking-[-0.06em] text-ink/[0.055] transition-all duration-700 group-hover:-translate-y-2 group-hover:text-accent/20 lg:block",
          flipped ? "left-0" : "right-0",
        )}
      >
        {project.index}
      </span>

      <div className="relative grid items-center gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-14">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.9, ease: EASE_OUT }}
          className={cn(
            "min-w-0 lg:col-span-7",
            flipped ? "lg:order-2" : "lg:order-1",
          )}
        >
          <a
            href={href}
            aria-label={`Read the ${project.title} case study`}
            data-cursor-label="VIEW CASE"
            className="group/preview block w-full text-left"
          >
            <div className="relative overflow-hidden border border-line bg-panel transition-colors duration-500 group-hover/preview:border-accent/40">
              <div className="transition-transform duration-[1100ms] ease-out group-hover/preview:scale-[1.03]">
                <ProjectVisual project={project} />
              </div>

              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between gap-4 bg-gradient-to-t from-[#080808] via-[#080808]/85 to-transparent px-4 pb-4 pt-12 transition-transform duration-500 ease-out group-hover/preview:translate-y-0 sm:px-5"
              >
                <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#f5f5f5]">
                  View case study
                </span>
                <span className="grid size-8 place-items-center rounded-full bg-[#c6ff4d] text-[#080808]">
                  <ArrowUpRight size={14} strokeWidth={1.8} />
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-4 font-mono text-[7px] uppercase tracking-[0.18em] text-muted/50">
              <span>Custom abstract panel / not a screenshot</span>
              <span className="flex items-center gap-1.5">
                <Plus size={9} aria-hidden />
                Case {project.index}
              </span>
            </div>
          </a>
        </motion.div>

        <div
          className={cn(
            "min-w-0 lg:col-span-5",
            flipped ? "lg:order-1" : "lg:order-2",
          )}
        >
          <Reveal y={22} delay={0.08}>
            <div className="flex items-center gap-3">
              <span className="grid size-8 place-items-center border border-accent/35 bg-lime-soft font-mono text-[8px] tabular-nums text-accent">
                {project.index}
              </span>
              <span aria-hidden className="h-px flex-1 bg-line" />
              <span className="font-mono text-[7px] uppercase tracking-[0.16em] text-muted">
                {project.category}
              </span>
            </div>

            <h3 className="mt-5 font-display text-[clamp(1.55rem,2.9vw,2.55rem)] font-bold uppercase leading-[0.94] tracking-[-0.045em] text-ink text-balance transition-colors duration-500">
              <a href={href} className="transition-colors hover:text-accent/95">
                {project.title}
              </a>
            </h3>

            <p className="body-copy mt-4 max-w-lg text-[13px]">
              {project.description}
            </p>

            <div className="mt-5 border-l border-lime/50 pl-4">
              <div className="flex items-center gap-2">
                <Sparkles size={10} className="text-accent" aria-hidden />
                <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-accent">
                  My contribution
                </span>
              </div>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-ink/75">
                {project.contribution}
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {project.stack.map((tech) => (
                <span
                  key={tech.name}
                  className="border border-line px-2.5 py-1.5 font-mono text-[7px] uppercase tracking-[0.13em] text-muted transition-colors duration-300 group-hover:border-accent/25 group-hover:text-ink/85"
                >
                  {tech.name}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <ButtonLink
                href={href}
                variant="outline"
                size="sm"
                icon={<ArrowUpRight size={13} strokeWidth={1.7} />}
              >
                View case study
              </ButtonLink>
              <Button
                type="button"
                variant="quiet"
                size="sm"
                onClick={links.github}
                aria-label={`GitHub repository for ${project.title} — link pending`}
                icon={<GithubMark size={12} />}
                iconSide="left"
                className="text-muted"
              >
                GitHub
              </Button>
              <Button
                type="button"
                variant="quiet"
                size="sm"
                onClick={links.demo}
                aria-label={`Live demo for ${project.title} — link pending`}
                icon={<ArrowUpRight size={12} strokeWidth={1.6} />}
                className="text-muted"
              >
                Live demo
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </article>
  );
}

export function Projects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="section-shell relative overflow-x-clip"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-24 hidden select-none font-display text-[13rem] font-bold uppercase leading-none tracking-[-0.06em] text-ink/[0.016] lg:block"
      >
        Work
      </div>

      <div className="container-x relative">
        <SectionHeading
          index="03"
          label="Work / Case studies"
          id="projects-heading"
          lines={[
            "Selected",
            <>
              case studies<span className="text-lime">.</span>
            </>,
          ]}
          description="Four builds documented as engineering case studies: the problem, the solution, the technologies and my contribution. Each opens as a dedicated page. Visual panels are custom abstractions, not fabricated screenshots."
        />

        <Reveal y={14} className="mt-8 md:mt-10">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-line py-3 font-mono text-[7px] uppercase tracking-[0.18em] text-muted/60">
            <span className="text-accent">04 case studies</span>
            <span aria-hidden className="hidden h-3 w-px bg-line sm:block" />
            <span>Full-stack</span>
            <span>Business systems</span>
            <span>API integration</span>
            <span>IoT</span>
            <span className="ml-auto hidden items-center gap-1.5 sm:flex">
              <Layers size={9} aria-hidden />
              Open any case to read deeper
            </span>
          </div>
        </Reveal>

        <div className="mt-12 space-y-16 md:mt-16 md:space-y-24 lg:space-y-28">
          {projects.map((project, index) => (
            <ProjectRow key={project.id} project={project} index={index} />
          ))}
        </div>

        <Reveal className="mt-20 md:mt-28">
          <div className="flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="flex size-10 items-center justify-center rounded-full border border-line">
                <span className="size-1.5 rounded-full bg-lime" />
              </span>
              <p className="font-display text-lg font-bold tracking-[-0.02em] text-ink sm:text-xl">
                More experiments are always in the lab.
              </p>
            </div>
            <button
              type="button"
              onClick={() => scrollToSection("contact")}
              className="group link-line self-start font-mono text-[9px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-accent sm:self-auto"
            >
              Have a brief in mind? Let&apos;s talk
              <ArrowUpRight
                size={13}
                strokeWidth={1.6}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden
              />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
