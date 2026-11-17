import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Info, MousePointer2, Sparkles } from "lucide-react";
import { skillCategories } from "../../data/profile";
import { cn } from "../../lib/utils";
import { EASE_OUT } from "../../lib/motion";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";
import { TechIcon } from "../ui/TechIcon";

const BASE_ANGLES = [-90, -30, 30, 90, 150, 210];
const NODE_RADIUS = 35;
const ANCHOR_RADIUS = 21;
const SPREAD = 52;

function buildNodes() {
  return skillCategories.flatMap((category, categoryIndex) => {
    const count = category.skills.length;
    const step = count > 1 ? SPREAD / (count - 1) : 0;
    const start = BASE_ANGLES[categoryIndex] - (count > 1 ? SPREAD / 2 : 0);

    return category.skills.map((skill, skillIndex) => {
      const angle = start + skillIndex * step;
      const rad = (angle * Math.PI) / 180;
      return {
        key: `${category.id}:${skill.name}`,
        categoryIndex,
        skillIndex,
        angle,
        x: 50 + Math.cos(rad) * NODE_RADIUS,
        y: 50 + Math.sin(rad) * NODE_RADIUS,
      };
    });
  });
}

function anchorPoint(categoryIndex: number) {
  const rad = (BASE_ANGLES[categoryIndex] * Math.PI) / 180;
  return {
    x: 50 + Math.cos(rad) * ANCHOR_RADIUS,
    y: 50 + Math.sin(rad) * ANCHOR_RADIUS,
  };
}

export function Skills() {
  const nodes = useMemo(buildNodes, []);
  const [activeCategory, setActiveCategory] = useState(0);
  const [activeSkill, setActiveSkill] = useState(0);
  const reduced = useReducedMotion();

  const category = skillCategories[activeCategory];
  const skill = category.skills[activeSkill];
  const activeKey = `${category.id}:${skill.name}`;

  const select = (categoryIndex: number, skillIndex: number) => {
    setActiveCategory(categoryIndex);
    setActiveSkill(skillIndex);
  };

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="section-shell relative overflow-x-clip border-y border-line bg-panel/20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-6 top-16 hidden select-none font-display text-[16rem] font-bold uppercase leading-none tracking-[-0.07em] text-ink/[0.016] xl:block"
      >
        02
      </div>

      <div className="container-x relative">
        <SectionHeading
          index="02"
          label="Territories / Constellation"
          id="skills-heading"
          lines={[
            "Tools in",
            <>
              orbit<span className="text-lime">.</span>
            </>,
          ]}
          description="Six areas, twenty-one technologies, no invented proficiency scores. Solid nodes are used in coursework or builds; dashed nodes are being explored. Select any node to read more."
        />

        <Reveal y={12} delay={0.2} className="mt-6">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[7px] uppercase tracking-[0.15em] text-muted/65">
            <span className="flex items-center gap-2">
              <span
                aria-hidden
                className="size-2 rounded-full border border-line bg-base"
              />
              Used in coursework / builds
            </span>
            <span className="flex items-center gap-2">
              <span
                aria-hidden
                className="size-2 rounded-full border border-dashed border-muted/60"
              />
              Currently exploring
            </span>
            <span className="ml-auto hidden items-center gap-1.5 text-muted/45 sm:flex">
              <Info size={9} aria-hidden />
              No proficiency percentages
            </span>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-12 lg:items-start lg:gap-12 xl:gap-16">
          {/* ---------- Desktop constellation ---------- */}
          <div className="hidden min-w-0 lg:col-span-8 lg:block">
            <div className="relative mx-auto aspect-square w-full max-w-[42rem]">
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(198,255,77,0.055),transparent_62%)]"
              />

              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                <circle
                  cx="50"
                  cy="50"
                  r={ANCHOR_RADIUS}
                  fill="none"
                  stroke="var(--c-line)"
                  strokeWidth="0.16"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={NODE_RADIUS}
                  fill="none"
                  stroke="var(--c-line)"
                  strokeWidth="0.16"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="var(--c-line)"
                  strokeWidth="0.16"
                  strokeDasharray="0.6 1.6"
                  opacity="0.7"
                />

                {skillCategories.map((item, categoryIndex) => {
                  const anchor = anchorPoint(categoryIndex);
                  const isActive = categoryIndex === activeCategory;
                  return (
                    <g key={item.id}>
                      <line
                        x1="50"
                        y1="50"
                        x2={anchor.x}
                        y2={anchor.y}
                        stroke={isActive ? "var(--c-accent)" : "var(--c-line)"}
                        strokeWidth={isActive ? 0.28 : 0.16}
                        opacity={isActive ? 0.8 : 0.6}
                      />
                      {item.skills.map((entry, skillIndex) => {
                        const node = nodes.find(
                          (candidate) =>
                            candidate.categoryIndex === categoryIndex &&
                            candidate.skillIndex === skillIndex,
                        );
                        if (!node) return null;
                        const isNodeActive =
                          categoryIndex === activeCategory &&
                          skillIndex === activeSkill;
                        return (
                          <line
                            key={`${item.id}-${entry.name}`}
                            x1={anchor.x}
                            y1={anchor.y}
                            x2={node.x}
                            y2={node.y}
                            stroke={
                              isNodeActive
                                ? "var(--c-accent)"
                                : isActive
                                  ? "color-mix(in srgb, var(--c-accent) 38%, transparent)"
                                  : "var(--c-line)"
                            }
                            strokeWidth={isNodeActive ? 0.3 : 0.14}
                            opacity={isNodeActive ? 0.95 : 0.7}
                            strokeDasharray={
                              entry.status === "exploring" ? "0.8 1.1" : undefined
                            }
                          />
                        );
                      })}
                    </g>
                  );
                })}
              </svg>

              {/* Category labels */}
              {skillCategories.map((item, categoryIndex) => {
                const anchor = anchorPoint(categoryIndex);
                const isActive = categoryIndex === activeCategory;
                return (
                  <div
                    key={item.id}
                    className="absolute z-10"
                    style={{ left: `${anchor.x}%`, top: `${anchor.y}%` }}
                  >
                    <span
                      className={cn(
                        "absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.16em] transition-colors duration-300",
                        isActive ? "text-accent" : "text-muted/70",
                      )}
                    >
                      <span className="mr-1.5 text-[6.5px] opacity-60">
                        {item.index}
                      </span>
                      {item.label}
                    </span>
                  </div>
                );
              })}

              {/* Core */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 grid size-[6.2rem] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-accent/25 bg-base shadow-[0_0_70px_-20px_rgba(198,255,77,0.4)]">
                <span
                  aria-hidden
                  className="orbit-spin absolute inset-1.5 rounded-full border border-dashed border-lime/25"
                />
                <span className="font-display text-[1.45rem] font-bold leading-none tracking-[-0.07em] text-ink">
                  A<span className="text-accent">H</span>
                </span>
                <span className="mt-1 font-mono text-[5.5px] uppercase tracking-[0.26em] text-muted">
                  Core / {nodes.length}
                </span>
              </div>

              {/* Technology nodes */}
              {skillCategories.map((item, categoryIndex) =>
                item.skills.map((entry, skillIndex) => {
                  const node = nodes.find(
                    (candidate) =>
                      candidate.categoryIndex === categoryIndex &&
                      candidate.skillIndex === skillIndex,
                  );
                  if (!node) return null;
                  const isActive =
                    categoryIndex === activeCategory && skillIndex === activeSkill;

                  return (
                    <button
                      key={`${item.id}-${entry.name}`}
                      type="button"
                      onClick={() => select(categoryIndex, skillIndex)}
                      onMouseEnter={() => select(categoryIndex, skillIndex)}
                      onFocus={() => select(categoryIndex, skillIndex)}
                      aria-pressed={isActive}
                      aria-label={`${entry.name} — ${entry.note}. ${item.label} territory.`}
                      className={cn(
                        "group absolute z-20 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border transition-all duration-300",
                        isActive
                          ? entry.status === "exploring"
                            ? "scale-110 border-dashed border-accent/70 bg-base text-accent"
                            : "scale-110 border-accent bg-lime-soft text-accent shadow-[0_0_26px_-4px_rgba(198,255,77,0.5)]"
                          : entry.status === "exploring"
                            ? "border-dashed border-line/80 bg-transparent text-muted/70 hover:scale-105 hover:border-accent/50 hover:text-accent"
                            : "border-line bg-base/90 text-muted hover:scale-105 hover:border-accent/50 hover:text-accent",
                      )}
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    >
                      <TechIcon icon={entry.icon} size={16} />
                      {isActive ? (
                        <span
                          aria-hidden
                          className="absolute inset-0 rounded-full border border-accent/30 motion-safe:animate-[pulse-ring_2.4s_ease-out_infinite]"
                        />
                      ) : null}
                    </button>
                  );
                }),
              )}

              <span className="absolute bottom-0 left-0 font-mono text-[6.5px] uppercase tracking-[0.24em] text-muted/35">
                {skillCategories.length} territories / {nodes.length} nodes
              </span>
              <span className="absolute bottom-0 right-0 flex items-center gap-1.5 font-mono text-[6.5px] uppercase tracking-[0.2em] text-muted/35">
                <MousePointer2 size={9} aria-hidden />
                Select a node
              </span>
            </div>
          </div>

          {/* ---------- Detail panel (desktop only; mobile has its own index) ---------- */}
          <div className="hidden min-w-0 lg:col-span-4 lg:block">
            <div className="border border-line bg-base/55">
              <div className="flex items-center justify-between border-b border-line px-5 py-3">
                <span className="font-mono text-[7.5px] uppercase tracking-[0.2em] text-muted">
                  Selected node
                </span>
                <span className="font-mono text-[7.5px] uppercase tracking-[0.18em] text-accent">
                  {category.index} / 06
                </span>
              </div>

              <motion.div
                key={activeKey}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, ease: EASE_OUT }}
                className="px-5 py-5"
              >
                <div className="flex items-start gap-4">
                  <span className="grid size-12 shrink-0 place-items-center border border-accent/30 bg-lime-soft text-accent">
                    <TechIcon icon={skill.icon} size={22} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-accent">
                      {category.label}
                    </p>
                    <h3 className="mt-1.5 font-display text-[clamp(1.35rem,2vw,1.75rem)] font-semibold leading-none tracking-[-0.035em] text-ink">
                      {skill.name}
                    </h3>
                    <p className="mt-2 text-[11.5px] leading-relaxed text-muted">
                      {skill.note}
                    </p>
                    <span
                      className={cn(
                        "mt-3 inline-flex items-center gap-1.5 border px-2 py-1 font-mono text-[6.5px] uppercase tracking-[0.14em]",
                        skill.status === "used"
                          ? "border-lime/25 bg-lime-soft text-accent"
                          : "border-dashed border-line text-muted",
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "size-1 rounded-full",
                          skill.status === "used"
                            ? "bg-lime"
                            : "border border-muted/70",
                        )}
                      />
                      {skill.status === "used" ? "Used in practice" : "Currently exploring"}
                    </span>
                  </div>
                </div>

                <p className="mt-4 border-t border-line pt-4 text-[11px] leading-relaxed text-muted/80">
                  {category.blurb}
                </p>

                <div className="mt-5 border-t border-line pt-4">
                  <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-muted/60">
                    Inside {category.label.toLowerCase()}
                  </p>
                  <ul className="mt-2">
                    {category.skills.map((entry, index) => {
                      const isActive = index === activeSkill;
                      return (
                        <li key={entry.name}>
                          <button
                            type="button"
                            onClick={() => select(activeCategory, index)}
                            aria-pressed={isActive}
                            aria-label={`${entry.name} — ${
                              entry.status === "used"
                                ? "used in coursework or builds"
                                : "currently exploring"
                            }`}
                            className={cn(
                              "group flex w-full items-center gap-3 border-b border-line/60 py-2.5 text-left transition-colors",
                              isActive ? "text-accent" : "text-ink hover:text-accent",
                            )}
                          >
                            <span className="font-mono text-[6.5px] tabular-nums text-muted/50">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="flex-1 text-[12px]">{entry.name}</span>
                            <span
                              aria-hidden
                              className={cn(
                                "size-1 rounded-full",
                                entry.status === "used"
                                  ? "bg-lime/60"
                                  : "border border-muted/60",
                              )}
                            />
                            <span
                              aria-hidden
                              className={cn(
                                "h-px transition-all duration-300",
                                isActive ? "w-6 bg-lime" : "w-2 bg-line group-hover:w-4",
                              )}
                            />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </motion.div>

              <div className="flex items-start gap-2 border-t border-line bg-panel/40 px-5 py-4">
                <Info size={11} strokeWidth={1.6} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                <p className="text-[10.5px] leading-relaxed text-muted">
                  A map of usage, not a score. &ldquo;Exploring&rdquo; means curiosity
                  in progress — not claimed mastery.
                </p>
              </div>
            </div>

            <p className="mt-4 font-mono text-[7px] uppercase leading-relaxed tracking-[0.16em] text-muted/45">
              Coursework / personal builds / active practice
            </p>
          </div>

          {/* ---------- Mobile: tabbed constellation index ---------- */}
          <div className="min-w-0 lg:hidden">
            <div
              role="group"
              aria-label="Skill categories"
              className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1"
            >
              {skillCategories.map((item, categoryIndex) => {
                const isActive = categoryIndex === activeCategory;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => select(categoryIndex, 0)}
                    aria-pressed={isActive}
                    className={cn(
                      "flex shrink-0 items-center gap-2 border px-3 py-2 transition-colors",
                      isActive
                        ? "border-accent/40 bg-lime-soft text-accent"
                        : "border-line text-muted hover:border-accent/25 hover:text-ink",
                    )}
                  >
                    <span className="font-mono text-[7px]">{item.index}</span>
                    <span className="font-mono text-[8px] uppercase tracking-[0.12em]">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 border border-line">
              <div className="border-b border-line bg-panel/30 px-5 py-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-accent">
                    {category.index} / 06
                  </span>
                  <span className="font-mono text-[7px] uppercase tracking-[0.16em] text-muted/50">
                    {category.skills.length} nodes
                  </span>
                </div>
                <h3 className="mt-2 font-display text-xl font-semibold tracking-[-0.03em] text-ink">
                  {category.label}
                </h3>
                <p className="mt-2 text-[11.5px] leading-relaxed text-muted">
                  {category.blurb}
                </p>
              </div>

              <ul>
                {category.skills.map((entry, index) => {
                  const isActive = index === activeSkill;
                  return (
                    <li key={entry.name} className="border-b border-line last:border-b-0">
                      <button
                        type="button"
                        onClick={() => select(activeCategory, index)}
                        aria-pressed={isActive}
                        aria-label={`${entry.name} — ${
                          entry.status === "used"
                            ? "used in coursework or builds"
                            : "currently exploring"
                        }`}
                        className="flex w-full items-center gap-3.5 px-5 py-4 text-left"
                      >
                        <span
                          className={cn(
                            "grid size-10 shrink-0 place-items-center border transition-colors",
                            isActive
                              ? "border-accent/40 bg-lime-soft text-accent"
                              : "border-line text-muted",
                          )}
                        >
                          <TechIcon icon={entry.icon} size={18} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span
                            className={cn(
                              "block font-display text-[13.5px] font-semibold",
                              isActive ? "text-accent" : "text-ink",
                            )}
                          >
                            {entry.name}
                          </span>
                          <span className="mt-0.5 block font-mono text-[7px] uppercase leading-relaxed tracking-[0.1em] text-muted">
                            {entry.note}
                          </span>
                          <span
                            className={cn(
                              "mt-1.5 inline-flex items-center gap-1 font-mono text-[6.5px] uppercase tracking-[0.12em]",
                              entry.status === "used"
                                ? "text-accent/80"
                                : "text-muted/60",
                            )}
                          >
                            <span
                              aria-hidden
                              className={cn(
                                "size-1 rounded-full",
                                entry.status === "used"
                                  ? "bg-lime"
                                  : "border border-muted/60",
                              )}
                            />
                            {entry.status === "used" ? "Used" : "Exploring"}
                          </span>
                        </span>
                        <span className="font-mono text-[7px] text-muted/40">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <p className="mt-4 flex items-start gap-2 font-mono text-[7px] uppercase leading-relaxed tracking-[0.14em] text-muted/50">
              <Sparkles size={10} className="mt-0.5 shrink-0 text-accent" aria-hidden />
              No proficiency levels — usage and curiosity only
            </p>
          </div>
        </div>

        <div className="relative mt-14 overflow-hidden border-y border-line py-4 md:mt-20">
          <div className="marquee-track marquee-track--slow items-center gap-8">
            {[...skillCategories.flatMap((item) => item.skills)]
              .filter(
                (entry, index, all) =>
                  all.findIndex((candidate) => candidate.name === entry.name) === index,
              )
              .concat(
                [...skillCategories.flatMap((item) => item.skills)].filter(
                  (entry, index, all) =>
                    all.findIndex((candidate) => candidate.name === entry.name) === index,
                ),
              )
              .map((entry, index) => (
                <span
                  key={`${entry.name}-${index}`}
                  className="flex shrink-0 items-center gap-8 font-mono text-[9px] uppercase tracking-[0.2em] text-muted/70"
                  aria-hidden="true"
                >
                  {entry.name}
                  <span className="text-lime/60">✦</span>
                </span>
              ))}
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-base to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-base to-transparent"
          />
        </div>
      </div>
    </section>
  );
}
