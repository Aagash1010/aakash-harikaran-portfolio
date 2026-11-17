import { ArrowUpRight } from "lucide-react";
import { projects } from "../../data/profile";
import { cn } from "../../lib/utils";
import { PlanetSigil } from "../visuals/universe/PlanetSigil";
import { PLANETS } from "../visuals/universe/planetConfig";

interface ProjectConstellationProps {
  hovered: number | null;
  onHover: (index: number | null) => void;
  onSelect: (index: number) => void;
}

/**
 * Touch / no-WebGL fallback. It keeps the observatory framing and the same four
 * bodies, but replaces the canvas with large, keyboard-friendly targets.
 */
export function ProjectConstellation({
  hovered,
  onHover,
  onSelect,
}: ProjectConstellationProps) {
  return (
    <div data-universe-index="true" className="relative p-4 sm:p-6">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg
          viewBox="0 0 800 600"
          preserveAspectRatio="none"
          className="absolute inset-0 size-full opacity-50"
        >
          {[180, 260, 340, 420].map((radius) => (
            <ellipse
              key={radius}
              cx="400"
              cy="300"
              rx={radius}
              ry={radius * 0.42}
              fill="none"
              stroke="rgba(245,245,245,0.06)"
              strokeWidth="1"
            />
          ))}
          <circle cx="400" cy="300" r="3" fill="#c6ff4d" opacity="0.7" />
          <circle
            cx="400"
            cy="300"
            r="26"
            fill="none"
            stroke="#c6ff4d"
            strokeWidth="0.5"
            opacity="0.25"
          />
        </svg>
      </div>

      <div className="relative flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="relative flex size-1.5">
            <span className="pulse-dot absolute inset-0 rounded-full bg-lime text-lime" />
          </span>
          <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-white/55">
            Simplified index
          </span>
        </div>
        <span className="hidden font-mono text-[6.5px] uppercase tracking-[0.16em] text-white/25 sm:block">
          Select a body to open its dossier
        </span>
      </div>

      <div className="relative mt-5 grid gap-2.5 sm:grid-cols-2">
        {projects.map((project, index) => {
          const spec = PLANETS[project.visual];
          const active = hovered === index;

          return (
            <button
              key={project.id}
              type="button"
              onClick={() => onSelect(index)}
              onMouseEnter={() => onHover(index)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(index)}
              onBlur={() => onHover(null)}
              aria-haspopup="dialog"
              aria-label={`Open the ${project.title} dossier`}
              className={cn(
                "group relative flex h-full flex-col overflow-hidden border bg-white/[0.022] p-4 text-left transition-colors duration-300",
                active
                  ? "border-white/25"
                  : "border-white/10 hover:border-[#c6ff4d]/40",
              )}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -right-8 -top-10 size-32 rounded-full opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-35"
                style={{ background: spec.color }}
              />

              <div className="relative flex items-start justify-between gap-3">
                <PlanetSigil
                  visual={project.visual}
                  className="size-11 transition-transform duration-500 group-hover:scale-105"
                />
                <span className="text-right font-mono text-[6px] uppercase leading-relaxed tracking-[0.14em] text-white/30">
                  {project.category}
                </span>
              </div>

              <p
                className="relative mt-4 font-mono text-[6.5px] uppercase tracking-[0.18em]"
                style={{ color: spec.color }}
              >
                {project.index} / body
              </p>
              <h4 className="relative mt-1 font-display text-[1.05rem] font-bold uppercase leading-[0.95] tracking-[-0.03em] text-[#f5f5f5]">
                {project.shortTitle}
              </h4>
              <p className="relative mt-2 line-clamp-3 text-[11px] leading-relaxed text-white/50">
                {project.description}
              </p>

              <div className="relative mt-3 flex flex-wrap gap-1">
                {project.stack.slice(0, 3).map((tech) => (
                  <span
                    key={tech.name}
                    className="border border-white/10 px-1.5 py-1 font-mono text-[5.5px] uppercase tracking-[0.1em] text-white/40"
                  >
                    {tech.name}
                  </span>
                ))}
                {project.stack.length > 3 ? (
                  <span className="px-1 py-1 font-mono text-[5.5px] uppercase tracking-[0.1em] text-white/25">
                    +{project.stack.length - 3}
                  </span>
                ) : null}
              </div>

              <div className="relative mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-3">
                <span className="font-mono text-[6.5px] uppercase tracking-[0.16em] text-white/40">
                  Open dossier
                </span>
                <ArrowUpRight
                  size={13}
                  strokeWidth={1.6}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  style={{ color: spec.color }}
                  aria-hidden
                />
              </div>
            </button>
          );
        })}
      </div>

      <p className="relative mt-4 text-center font-mono text-[6px] uppercase tracking-[0.16em] text-white/25">
        Simplified view · every case file stays available
      </p>
    </div>
  );
}
