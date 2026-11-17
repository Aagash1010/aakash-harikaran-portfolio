import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, CircleDashed, X } from "lucide-react";
import type { Project } from "../../data/profile";
import { useToast } from "../../context/ToastProvider";
import { EASE_OUT } from "../../lib/motion";
import { cn } from "../../lib/utils";
import { GithubMark } from "../ui/BrandIcons";
import { PlanetSigil } from "../visuals/universe/PlanetSigil";
import { PLANETS } from "../visuals/universe/planetConfig";

interface DossierPanelProps {
  project: Project;
  compact: boolean;
  panelId: string;
  onClose: () => void;
}

/**
 * The project dossier. It is intentionally self-contained and dark: inside the
 * observatory it reads as a glass readout, and it never inherits the page theme
 * in a way that would break contrast.
 */
export function DossierPanel({
  project,
  compact,
  panelId,
  onClose,
}: DossierPanelProps) {
  const reduced = useReducedMotion();
  const { notify } = useToast();
  const panelRef = useRef<HTMLElement>(null);
  const spec = PLANETS[project.visual];

  /* The compact sheet is modal, so focus starts on the sheet itself. The
     desktop panel is inline and deliberately leaves focus on its trigger. */
  useEffect(() => {
    if (!compact) return;
    const frame = requestAnimationFrame(() =>
      panelRef.current?.focus({ preventScroll: true }),
    );
    return () => cancelAnimationFrame(frame);
  }, [compact, project.id]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    // Only the compact presentation is modal; the inline desktop panel keeps
    // the page's natural tab order so the universe stays browsable.
    if (!compact || event.key !== "Tab" || !panelRef.current) return;
    const focusable = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => element.offsetParent !== null);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    } else if (event.shiftKey && document.activeElement === panelRef.current) {
      // Focus starts on the sheet itself, so Shift+Tab must wrap to the end.
      event.preventDefault();
      last.focus();
    }
  };

  const pendingHint = (kind: "repo" | "demo") => {
    notify(
      kind === "repo"
        ? `GitHub repository for ${project.shortTitle} is pending — it will be linked once published.`
        : `Live demo for ${project.shortTitle} is not published yet — no link has been invented.`,
    );
  };

  return (
    <motion.aside
      ref={panelRef}
      id={panelId}
      role="dialog"
      tabIndex={-1}
      aria-modal={compact || undefined}
      aria-labelledby={`${panelId}-title`}
      initial={
        reduced ? false : { opacity: 0, x: compact ? 0 : 34, y: compact ? 18 : 0 }
      }
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={
        reduced
          ? { opacity: 0 }
          : { opacity: 0, x: compact ? 0 : 24, y: compact ? 12 : 0 }
      }
      transition={{ duration: 0.45, ease: EASE_OUT }}
      onKeyDown={onKeyDown}
      className={cn(
        "z-[210] flex flex-col overflow-hidden border-white/12 bg-[#080a07]/95 text-[#f5f5f5] shadow-[0_40px_120px_-24px_rgba(0,0,0,0.95)] backdrop-blur-2xl focus:outline-none",
        compact
          ? "fixed inset-0 pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]"
          : "absolute inset-y-0 right-0 w-[min(430px,42%)] border-l",
      )}
    >
      <div className="flex shrink-0 items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
        <div className="min-w-0">
          <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-[#c6ff4d]">
            Case file / {project.index}
          </p>
          <p className="mt-1 truncate font-mono text-[6px] uppercase tracking-[0.14em] text-white/35">
            {project.category}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          className="grid size-8 shrink-0 place-items-center border border-white/15 text-white/55 transition-colors hover:border-[#c6ff4d]/60 hover:text-[#c6ff4d]"
        >
          <X size={14} strokeWidth={1.7} />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">
        <div className="flex items-start justify-between gap-4">
          <PlanetSigil visual={project.visual} className="size-14" />
          <span className="border border-white/10 px-2 py-1 font-mono text-[6px] uppercase tracking-[0.14em] text-white/35">
            Body {project.index} / 04
          </span>
        </div>

        <h3
          id={`${panelId}-title`}
          className="mt-5 font-display text-[clamp(1.35rem,2.2vw,1.8rem)] font-bold uppercase leading-[0.95] tracking-[-0.04em] text-[#f5f5f5]"
        >
          {project.title}
        </h3>

        <p className="mt-3 text-[12.5px] leading-relaxed text-white/60">
          {project.description}
        </p>

        <div
          className="mt-5 border-l pl-3.5"
          style={{ borderColor: `${spec.color}88` }}
        >
          <p
            className="font-mono text-[6.5px] uppercase tracking-[0.18em]"
            style={{ color: spec.color }}
          >
            My contribution
          </p>
          <p className="mt-1.5 text-[11.5px] leading-relaxed text-white/70">
            {project.contribution}
          </p>
        </div>

        <div className="mt-6">
          <p className="font-mono text-[6.5px] uppercase tracking-[0.18em] text-white/35">
            Technologies
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <span
                key={tech.name}
                title={tech.role}
                className="border border-white/10 bg-white/[0.03] px-2 py-1.5 font-mono text-[6.5px] uppercase tracking-[0.12em] text-white/65"
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[6.5px] uppercase tracking-[0.18em] text-white/35">
              Screenshots
            </p>
            <span className="inline-flex items-center gap-1.5 border border-dashed border-white/15 px-2 py-1 font-mono text-[6px] uppercase tracking-[0.12em] text-white/35">
              <CircleDashed size={8} aria-hidden />
              Pending
            </span>
          </div>
          <div className="mt-2.5 grid grid-cols-3 gap-1.5">
            {[1, 2, 3].map((slot) => (
              <div
                key={slot}
                className="relative flex aspect-[4/3] items-center justify-center border border-dashed border-white/10 bg-white/[0.015]"
              >
                <span className="font-mono text-[6px] uppercase tracking-[0.14em] text-white/20">
                  0{slot}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-2.5 text-[9.5px] leading-relaxed text-white/30">
            No verified captures supplied. Abstract panels elsewhere on this
            site are custom illustrations, not screenshots.
          </p>
        </div>
      </div>

      <div className="shrink-0 border-t border-white/10 px-5 py-4">
        <div className="grid grid-cols-2 gap-2">
          {project.repo ? (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`GitHub repository for ${project.shortTitle} — opens in a new tab`}
              className="flex h-9 items-center gap-2 border border-white/15 px-3 font-mono text-[7px] uppercase tracking-[0.13em] text-white/70 transition-colors hover:border-[#c6ff4d]/60 hover:text-[#c6ff4d]"
            >
              <GithubMark size={11} />
              GitHub
              <ArrowUpRight size={10} className="ml-auto" aria-hidden />
            </a>
          ) : (
            <button
              type="button"
              onClick={() => pendingHint("repo")}
              aria-label={`GitHub repository for ${project.shortTitle} — link pending`}
              className="flex h-9 items-center gap-2 border border-dashed border-white/15 px-3 font-mono text-[7px] uppercase tracking-[0.13em] text-white/40 transition-colors hover:border-white/30 hover:text-white/65"
            >
              <GithubMark size={11} />
              GitHub
              <span className="ml-auto text-[5.5px] text-white/25">
                Pending
              </span>
            </button>
          )}

          {project.demo ? (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Live demo of ${project.shortTitle} — opens in a new tab`}
              className="flex h-9 items-center gap-2 border border-white/15 px-3 font-mono text-[7px] uppercase tracking-[0.13em] text-white/70 transition-colors hover:border-[#c6ff4d]/60 hover:text-[#c6ff4d]"
            >
              <ArrowUpRight size={11} />
              Live demo
            </a>
          ) : (
            <button
              type="button"
              onClick={() => pendingHint("demo")}
              aria-label={`Live demo of ${project.shortTitle} — link pending`}
              className="flex h-9 items-center gap-2 border border-dashed border-white/15 px-3 font-mono text-[7px] uppercase tracking-[0.13em] text-white/40 transition-colors hover:border-white/30 hover:text-white/65"
            >
              <ArrowUpRight size={11} />
              Live demo
              <span className="ml-auto text-[5.5px] text-white/25">
                Pending
              </span>
            </button>
          )}
        </div>

        <a
          href={`/work/${project.id}`}
          className="group mt-2.5 flex h-11 items-center justify-between gap-3 rounded-full bg-[#c6ff4d] pl-4 pr-1.5 text-[#080808] transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0"
        >
          <span className="font-mono text-[8.5px] uppercase tracking-[0.16em]">
            Open full case study
          </span>
          <span className="grid size-8 place-items-center rounded-full bg-[#080808] text-[#c6ff4d] transition-transform duration-500 group-hover:rotate-45">
            <ArrowUpRight size={14} strokeWidth={1.8} />
          </span>
        </a>

        <p className="mt-2 text-center font-mono text-[5.5px] uppercase tracking-[0.16em] text-white/25">
          Esc closes · destinations are verified, never invented
        </p>
      </div>
    </motion.aside>
  );
}
