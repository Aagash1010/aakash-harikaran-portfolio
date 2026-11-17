import { useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleDashed,
  Download,
  FileText,
  Layers,
  Mail,
  Sparkles,
} from "lucide-react";
import {
  profile,
  projects,
  type CaseStudyStatus,
  type Project,
} from "../data/profile";
import { useToast } from "../context/ToastProvider";
import { cn, scrollToSection } from "../lib/utils";
import { GithubMark, LinkedinMark } from "../components/ui/BrandIcons";
import { Button, ButtonLink } from "../components/ui/Button";
import { Magnetic } from "../components/ui/Magnetic";
import { MaskLine, Reveal } from "../components/ui/Reveal";
import { ProjectVisual } from "../components/visuals/ProjectVisual";

const statusCopy: Record<CaseStudyStatus, string> = {
  documented: "Documented",
  partial: "Partially documented",
  pending: "Pending",
};

function StatusBadge({ status }: { status: CaseStudyStatus }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 border px-2 py-1 font-mono text-[6.5px] uppercase tracking-[0.14em]",
        status === "documented" && "border-lime/30 bg-lime-soft text-accent",
        status === "partial" && "border-line text-muted",
        status === "pending" && "border-dashed border-line text-muted/70",
      )}
    >
      {status === "pending" ? (
        <CircleDashed size={9} strokeWidth={1.6} aria-hidden />
      ) : (
        <Check size={9} strokeWidth={2} aria-hidden />
      )}
      {statusCopy[status]}
    </span>
  );
}

function CaseBlock({
  index,
  title,
  description,
  children,
  className,
}: {
  index: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const headingId = `case-section-${index}`;
  return (
    <section aria-labelledby={headingId} className={cn("border-t border-line pt-8", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[8px] tabular-nums tracking-[0.16em] text-accent">
            {index}
          </span>
          <h2
            id={headingId}
            className="font-display text-[clamp(1.25rem,2.4vw,1.9rem)] font-bold uppercase leading-none tracking-[-0.035em] text-ink"
          >
            {title}
          </h2>
        </div>
        {description ? (
          <p className="max-w-md font-mono text-[7px] uppercase leading-relaxed tracking-[0.14em] text-muted/55">
            {description}
          </p>
        ) : null}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function ProjectPage({ project }: { project: Project }) {
  const { notify } = useToast();
  const currentIndex = projects.findIndex((entry) => entry.id === project.id);
  const previous = projects[(currentIndex - 1 + projects.length) % projects.length];
  const next = projects[(currentIndex + 1) % projects.length];

  useEffect(() => {
    const previousTitle = document.title;
    const descriptionMeta = document.querySelector('meta[name="description"]');
    const previousDescription = descriptionMeta?.getAttribute("content") ?? null;
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const previousOgTitle = ogTitle?.getAttribute("content") ?? null;
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const previousOgDescription = ogDescription?.getAttribute("content") ?? null;

    document.title = `${project.title} — Case study · Aagash Harikaran`;
    descriptionMeta?.setAttribute(
      "content",
      `${project.shortTitle}: ${project.description}`,
    );
    ogTitle?.setAttribute("content", `${project.title} — Aagash Harikaran`);
    ogDescription?.setAttribute("content", project.description);
    window.scrollTo({ top: 0, behavior: "auto" });

    return () => {
      document.title = previousTitle;
      if (descriptionMeta && previousDescription !== null) {
        descriptionMeta.setAttribute("content", previousDescription);
      }
      if (ogTitle && previousOgTitle !== null) {
        ogTitle.setAttribute("content", previousOgTitle);
      }
      if (ogDescription && previousOgDescription !== null) {
        ogDescription.setAttribute("content", previousOgDescription);
      }
    };
  }, [project]);

  const pendingRepo = () =>
    notify(
      `GitHub repository for ${project.shortTitle} is pending — it will be linked once published.`,
    );
  const pendingDemo = () =>
    notify(
      `Live demo for ${project.shortTitle} is not published yet — no link has been invented.`,
    );

  return (
    <main id="main" className="relative z-10 pb-16 pt-24 sm:pt-28 lg:pb-24 lg:pt-32">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[42rem]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_54%_46%_at_76%_8%,rgba(198,255,77,0.07),transparent_70%)]" />
        <div className="absolute inset-0 blueprint-grid opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
      </div>

      <div className="container-x relative">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 font-mono text-[7px] uppercase tracking-[0.16em] text-muted/60">
          <a href="/" className="transition-colors hover:text-accent">
            Home
          </a>
          <span aria-hidden>/</span>
          <a
            href="/#projects"
            onClick={(event) => {
              if (window.location.pathname === "/") return;
              event.preventDefault();
              scrollToSection("projects");
            }}
            className="transition-colors hover:text-accent"
          >
            Work
          </a>
          <span aria-hidden>/</span>
          <span aria-current="page" className="text-ink/80">
            Case {project.index}
          </span>
        </nav>

        <div className="mt-8 grid gap-10 lg:mt-12 lg:grid-cols-12 lg:gap-12">
          <div className="min-w-0 lg:col-span-8">
            <Reveal y={14} className="flex flex-wrap items-center gap-3">
              <span className="border border-lime/25 bg-lime-soft px-2.5 py-1 font-mono text-[7px] uppercase tracking-[0.16em] text-accent">
                Case file / {project.index} of 04
              </span>
              <span className="font-mono text-[7px] uppercase tracking-[0.16em] text-muted">
                {project.category}
              </span>
            </Reveal>

            <h1 className="mt-5 font-display text-[clamp(2.15rem,5.6vw,4.5rem)] font-bold uppercase leading-[0.92] tracking-[-0.05em] text-ink">
              <MaskLine>{project.title}</MaskLine>
            </h1>

            <Reveal y={16} delay={0.1}>
              <p className="lead-copy mt-6 max-w-3xl text-[clamp(1.05rem,1.5vw,1.3rem)]">
                {project.description}
              </p>
            </Reveal>

            <Reveal y={16} delay={0.16} className="mt-7 flex flex-wrap items-center gap-2.5">
              <Magnetic strength={0.16}>
                <ButtonLink
                  href="/#projects"
                  variant="outline"
                  size="sm"
                  icon={<ArrowLeft size={13} strokeWidth={1.6} />}
                  iconSide="left"
                >
                  All work
                </ButtonLink>
              </Magnetic>
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
              <Magnetic strength={0.16}>
                <ButtonLink
                  href={`mailto:${profile.email}?subject=${encodeURIComponent(
                    `Question about ${project.title}`,
                  )}`}
                  variant="quiet"
                  size="sm"
                  icon={<Mail size={12} strokeWidth={1.6} />}
                  iconSide="left"
                >
                  Ask about this build
                </ButtonLink>
              </Magnetic>
            </Reveal>
          </div>

          <Reveal
            y={20}
            delay={0.1}
            className="min-w-0 lg:col-span-4 lg:self-start"
          >
            <div className="border border-line bg-panel/35">
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-muted">
                  Case record
                </span>
                <span className="font-mono text-[7px] uppercase tracking-[0.16em] text-accent">
                  {project.index} / 04
                </span>
              </div>
              <dl className="divide-y divide-line">
                {[
                  { label: "Category", value: project.category },
                  { label: "Stack", value: `${project.stack.length} technologies` },
                  {
                    label: "Repository",
                    value: project.repo ? "Published" : "Not published",
                  },
                  {
                    label: "Live demo",
                    value: project.demo ? "Published" : "Not published",
                  },
                  {
                    label: "Screenshots",
                    value: project.screenshots.status === "pending" ? "Not supplied" : "Included",
                  },
                ].map((row) => (
                  <div key={row.label} className="flex items-baseline justify-between gap-4 px-4 py-2.5">
                    <dt className="font-mono text-[6.5px] uppercase tracking-[0.16em] text-muted/60">
                      {row.label}
                    </dt>
                    <dd className="text-right text-[11px] leading-snug text-ink/85">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="flex items-start gap-2 border-t border-line bg-base/40 px-4 py-3">
                <CircleDashed
                  size={11}
                  strokeWidth={1.6}
                  className="mt-0.5 shrink-0 text-muted/60"
                  aria-hidden
                />
                <p className="font-mono text-[6.5px] uppercase leading-relaxed tracking-[0.12em] text-muted/55">
                  Only verified information is stated. Pending sections are
                  labelled, never invented.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ---------- Visual ---------- */}
        <Reveal y={22} className="mt-10 md:mt-14">
          <div className="overflow-hidden border border-line">
            <ProjectVisual project={project} />
          </div>
          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-6 gap-y-1.5 font-mono text-[6.5px] uppercase tracking-[0.16em] text-muted/50">
            <span>Custom abstract panel — not a screenshot</span>
            <span>
              {project.stack.map((tech) => tech.name).join(" / ")}
            </span>
          </div>
        </Reveal>

        {/* ---------- Case study ---------- */}
        <div className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-8">
            <CaseBlock
              index="01"
              title="Overview"
              description="What the build is and the context it sits in"
            >
              <p className="max-w-3xl text-[14px] leading-relaxed text-ink/85">
                {project.overview}
              </p>
            </CaseBlock>

            <CaseBlock index="02" title="Problem" className="mt-10 md:mt-12">
              <p className="max-w-3xl text-[14px] leading-relaxed text-muted">
                {project.problem}
              </p>
            </CaseBlock>

            <CaseBlock index="03" title="Solution" className="mt-10 md:mt-12">
              <p className="max-w-3xl text-[14px] leading-relaxed text-muted">
                {project.solution}
              </p>
            </CaseBlock>

            <CaseBlock
              index="04"
              title="Key functionality"
              description="Documented scope of the build"
              className="mt-10 md:mt-12"
            >
              <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {project.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 border-b border-line/60 pb-3 text-[12.5px] leading-snug text-ink/80"
                  >
                    <Check
                      size={11}
                      strokeWidth={2}
                      className="mt-0.5 shrink-0 text-accent"
                      aria-hidden
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </CaseBlock>

            <CaseBlock
              index="05"
              title="Technical implementation"
              description="What can be verified from the build"
              className="mt-10 md:mt-12"
            >
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <StatusBadge status={project.implementation.status} />
                <span className="font-mono text-[6.5px] uppercase tracking-[0.14em] text-muted/50">
                  Detailed notes expand as they are written
                </span>
              </div>
              <ul className="space-y-3">
                {project.implementation.body.map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-3 text-[13px] leading-relaxed text-muted"
                  >
                    <span
                      aria-hidden
                      className="mt-[0.55rem] block size-1 shrink-0 rounded-full bg-lime/70"
                    />
                    {line}
                  </li>
                ))}
              </ul>
            </CaseBlock>

            <CaseBlock
              index="06"
              title="Challenges & learnings"
              description="Intentionally left pending until verified"
              className="mt-10 md:mt-12"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { title: "Challenges", section: project.challenges },
                  { title: "Learnings", section: project.learnings },
                ].map((item) => (
                  <div key={item.title} className="border border-dashed border-line p-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="mono-label text-muted">{item.title}</p>
                      <StatusBadge status={item.section.status} />
                    </div>
                    {item.section.body.map((line) => (
                      <p
                        key={line}
                        className="mt-3 text-[12px] leading-relaxed text-muted/80"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </CaseBlock>

            <CaseBlock
              index="07"
              title="Screenshots"
              description="No verified captures supplied"
              className="mt-10 md:mt-12"
            >
              <div className="flex items-center justify-between gap-3">
                <StatusBadge status={project.screenshots.status} />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[1, 2, 3].map((slot) => (
                  <div
                    key={slot}
                    className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border border-dashed border-line bg-panel/30"
                  >
                    <div aria-hidden className="absolute inset-0 blueprint-grid opacity-30" />
                    <span className="absolute left-2 top-2 font-mono text-[6px] uppercase tracking-[0.16em] text-muted/40">
                      Shot / 0{slot}
                    </span>
                    <span className="relative font-mono text-[7px] uppercase tracking-[0.16em] text-muted/55">
                      Awaiting capture
                    </span>
                  </div>
                ))}
              </div>
              {project.screenshots.body.map((line) => (
                <p
                  key={line}
                  className="mt-3 font-mono text-[7px] uppercase leading-relaxed tracking-[0.14em] text-muted/50"
                >
                  {line}
                </p>
              ))}
            </CaseBlock>

            <CaseBlock
              index="08"
              title="Repository & live demonstration"
              description="No destination is invented"
              className="mt-10 md:mt-12"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="border border-line p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 mono-label text-muted">
                      <GithubMark size={12} className="text-accent" />
                      GitHub repository
                    </span>
                    <span className="border border-dashed border-line px-2 py-1 font-mono text-[6px] uppercase tracking-[0.14em] text-muted/60">
                      Pending
                    </span>
                  </div>
                  <p className="mt-3 text-[12px] leading-relaxed text-muted/80">
                    The source repository is not published yet. No placeholder
                    URL has been invented.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={pendingRepo}
                    icon={<ArrowUpRight size={12} strokeWidth={1.6} />}
                  >
                    Link status
                  </Button>
                </div>

                <div className="border border-line p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 mono-label text-muted">
                      <ArrowUpRight size={12} className="text-accent" />
                      Live demo
                    </span>
                    <span className="border border-dashed border-line px-2 py-1 font-mono text-[6px] uppercase tracking-[0.14em] text-muted/60">
                      Pending
                    </span>
                  </div>
                  <p className="mt-3 text-[12px] leading-relaxed text-muted/80">
                    A hosted demonstration is not available yet. The build is
                    documented from its verified scope.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={pendingDemo}
                    icon={<ArrowUpRight size={12} strokeWidth={1.6} />}
                  >
                    Demo status
                  </Button>
                </div>
              </div>
            </CaseBlock>
          </div>

          {/* ---------- Sidebar ---------- */}
          <aside className="min-w-0 lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <div className="border border-line bg-panel/35 p-5">
                  <div className="flex items-center gap-2">
                    <Sparkles size={11} className="text-accent" aria-hidden />
                    <span className="mono-label text-accent">My contribution</span>
                  </div>
                  <p className="mt-3 text-[13px] leading-relaxed text-ink/85">
                    {project.contribution}
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.08} className="mt-4">
                <div className="border border-line p-5">
                  <div className="flex items-center gap-2">
                    <Layers size={11} className="text-accent" aria-hidden />
                    <span className="mono-label text-muted">Technologies</span>
                  </div>
                  <ul className="mt-4 divide-y divide-line">
                    {project.stack.map((tech) => (
                      <li
                        key={tech.name}
                        className="flex items-baseline justify-between gap-4 py-2"
                      >
                        <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-ink/85">
                          {tech.name}
                        </span>
                        <span className="text-right text-[10px] leading-snug text-muted">
                          {tech.role}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={0.12} className="mt-4">
                <div className="border border-line p-5">
                  <div className="flex items-center gap-2">
                    <FileText size={11} className="text-accent" aria-hidden />
                    <span className="mono-label text-muted">Documentation status</span>
                  </div>
                  <dl className="mt-4 space-y-3">
                    {[
                      { label: "Overview", status: "documented" as const },
                      { label: "Implementation", status: project.implementation.status },
                      { label: "Challenges", status: project.challenges.status },
                      { label: "Learnings", status: project.learnings.status },
                      { label: "Screenshots", status: project.screenshots.status },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between gap-3">
                        <dt className="text-[11px] text-muted">{row.label}</dt>
                        <dd>
                          <StatusBadge status={row.status} />
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>

              <Reveal delay={0.16} className="mt-4">
                <div className="border border-line p-5">
                  <div className="flex items-center gap-2">
                    <LinkedinMark size={11} className="text-accent" />
                    <span className="mono-label text-muted">Recruiter shortcuts</span>
                  </div>
                  <div className="mt-3 flex flex-col gap-2">
                    <a
                      href={profile.cv}
                      download
                      className="group flex items-center justify-between gap-3 border-b border-line py-2.5 font-mono text-[8px] uppercase tracking-[0.14em] text-ink transition-colors hover:text-accent"
                    >
                      Download CV
                      <Download size={12} strokeWidth={1.6} aria-hidden />
                    </a>
                    <a
                      href={`mailto:${profile.email}`}
                      className="group flex items-center justify-between gap-3 border-b border-line py-2.5 font-mono text-[8px] uppercase tracking-[0.14em] text-ink transition-colors hover:text-accent"
                    >
                      Email Aagash
                      <Mail size={12} strokeWidth={1.6} aria-hidden />
                    </a>
                    <a
                      href="/#contact"
                      className="group flex items-center justify-between gap-3 py-2.5 font-mono text-[8px] uppercase tracking-[0.14em] text-ink transition-colors hover:text-accent"
                    >
                      Contact & availability
                      <ArrowUpRight size={12} strokeWidth={1.6} aria-hidden />
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>
          </aside>
        </div>

        {/* ---------- Next / previous ---------- */}
        <nav
          aria-label="Case study navigation"
          className="mt-16 grid gap-4 border-t border-line pt-8 sm:grid-cols-2 md:mt-24"
        >
          <a
            href={`/work/${previous.id}`}
            className="group flex items-center gap-4 border border-line p-5 transition-colors hover:border-accent/40"
          >
            <ArrowLeft
              size={16}
              strokeWidth={1.6}
              className="shrink-0 text-muted transition-all duration-300 group-hover:-translate-x-1 group-hover:text-accent"
              aria-hidden
            />
            <span className="min-w-0">
              <span className="block font-mono text-[6.5px] uppercase tracking-[0.16em] text-muted/60">
                Previous case
              </span>
              <span className="mt-1 block truncate font-display text-[13px] font-semibold text-ink">
                {previous.shortTitle}
              </span>
            </span>
          </a>
          <a
            href={`/work/${next.id}`}
            className="group flex items-center justify-end gap-4 border border-line p-5 text-right transition-colors hover:border-accent/40"
          >
            <span className="min-w-0">
              <span className="block font-mono text-[6.5px] uppercase tracking-[0.16em] text-muted/60">
                Next case
              </span>
              <span className="mt-1 block truncate font-display text-[13px] font-semibold text-ink">
                {next.shortTitle}
              </span>
            </span>
            <ArrowRight
              size={16}
              strokeWidth={1.6}
              className="shrink-0 text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent"
              aria-hidden
            />
          </a>
        </nav>
      </div>
    </main>
  );
}
