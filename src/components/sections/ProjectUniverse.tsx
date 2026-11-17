import {
  Component,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import { Layers, Minus, Plus, RotateCcw } from "lucide-react";
import { projects } from "../../data/profile";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { cn } from "../../lib/utils";
import { DossierPanel } from "./DossierPanel";
import { ProjectConstellation } from "./ProjectConstellation";
import { PLANETS } from "../visuals/universe/planetConfig";

const UniverseCanvas = lazy(
  () => import("../visuals/universe/UniverseCanvas"),
);

const PANEL_ID = "project-dossier";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const CONTROL_CLASS =
  "grid size-7 place-items-center border border-white/12 bg-white/[0.02] text-white/55 transition-colors hover:border-[#c6ff4d]/55 hover:text-[#c6ff4d] disabled:pointer-events-none disabled:opacity-25";

/** One-off capability probe. Client-only app, so this is safe at first render. */
function detectWebgl(): "yes" | "no" {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return gl ? "yes" : "no";
  } catch {
    return "no";
  }
}

/* -------------------------------------------------------------------------- */
/* Failure containment                                                        */
/* -------------------------------------------------------------------------- */

class CanvasBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="absolute inset-0 grid place-items-center px-6 text-center">
        <div>
          <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/50">
            Rendering engine unavailable
          </p>
          <p className="mt-2 text-[11px] text-white/35">
            Switching to the 2D project index.
          </p>
        </div>
      </div>
    );
  }
}

function UniverseLoader() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="text-center">
        <span className="relative mx-auto flex size-9 items-center justify-center rounded-full border border-white/15">
          <span className="absolute inset-1.5 rounded-full border border-dashed border-[#c6ff4d]/30" />
          <span className="pulse-dot size-1.5 rounded-full bg-lime text-lime" />
        </span>
        <p className="mt-3 font-mono text-[7px] uppercase tracking-[0.22em] text-white/40">
          Calibrating observatory
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Universe                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * The Projects observatory. It mounts a lazy WebGL scene on precise, wide
 * pointers and falls back to a large-target 2D index everywhere else. The real
 * case-study rows stay below this stage, so the universe is an additional way
 * into the same verified content — never a replacement for it.
 */
export function ProjectUniverse() {
  const reduced = useReducedMotion() ?? false;
  const wide = useMediaQuery("(min-width: 1024px)");
  const eligible = useMediaQuery("(min-width: 1024px) and (pointer: fine)");
  const compactPanel = !wide;

  const [webgl] = useState<"yes" | "no">(detectWebgl);
  const [mode, setMode] = useState<"orbit" | "index">("orbit");
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);

  const mountRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pointerRef = useRef({ x: 0, y: 0 });
  const viewRef = useRef({ yaw: 0, pitch: 0 });
  const dragState = useRef<{
    x: number;
    y: number;
    yaw: number;
    pitch: number;
  } | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  /* Mount the scene only as the section approaches the viewport. */
  useEffect(() => {
    const element = mountRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setMounted(true);
      },
      { threshold: 0.02, rootMargin: "260px 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const update = () => setPageHidden(document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  const show3d =
    wide && eligible && webgl === "yes" && mode === "orbit";

  /* Scroll lock only while the compact, modal dossier is open. */
  useEffect(() => {
    if (!compactPanel || selected === null) return;
    const { body } = document;
    const previous = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = previous;
    };
  }, [compactPanel, selected]);

  /*
   * On wide screens the dossier lives inside the stage. Opening it from the
   * chip row while the stage is partly off-screen should bring it back into
   * view rather than rendering a clipped panel.
   */
  useEffect(() => {
    if (selected === null || !wide) return;
    stageRef.current?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: reduced ? "auto" : "smooth",
    });
  }, [selected, wide, reduced]);

  const openDossier = useCallback((index: number) => {
    returnFocus.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setSelected(index);
    setHovered(index);
  }, []);

  const closeDossier = useCallback(() => {
    setSelected(null);
    setHovered(null);
    const target = returnFocus.current;
    returnFocus.current = null;
    if (target) {
      requestAnimationFrame(() => target.focus({ preventScroll: true }));
    }
  }, []);

  const resetView = useCallback(() => {
    setZoom(1);
    viewRef.current = { yaw: 0, pitch: 0 };
    pointerRef.current = { x: 0, y: 0 };
    setHovered(null);
    if (selected !== null) closeDossier();
  }, [selected, closeDossier]);

  useEffect(() => {
    if (selected === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDossier();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected, closeDossier]);

  /* ---------------------------------------------------------------------- */
  /* Pointer exploration                                                    */
  /* ---------------------------------------------------------------------- */

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || reduced || selected !== null) return;
    if ((event.target as HTMLElement).closest("button, a")) return;
    dragState.current = {
      x: event.clientX,
      y: event.clientY,
      yaw: viewRef.current.yaw,
      pitch: viewRef.current.pitch,
    };
    setDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * 2,
    };

    const drag = dragState.current;
    if (!drag || reduced || selected !== null) return;
    viewRef.current = {
      yaw: clamp(drag.yaw + (event.clientX - drag.x) * 0.0017, -0.5, 0.5),
      pitch: clamp(drag.pitch - (event.clientY - drag.y) * 0.0012, -0.3, 0.3),
    };
  };

  const endDrag = () => {
    if (!dragState.current) return;
    dragState.current = null;
    setDragging(false);
  };

  const handlePointerLeave = () => {
    endDrag();
    pointerRef.current = { x: 0, y: 0 };
    setHovered(null);
  };

  const zoomBy = (factor: number) =>
    setZoom((current) => clamp(current * factor, 0.74, 1.48));

  /* ---------------------------------------------------------------------- */

  const activePanel =
    selected !== null ? (
      <DossierPanel
        key={projects[selected].id}
        project={projects[selected]}
        compact={compactPanel}
        panelId={PANEL_ID}
        onClose={closeDossier}
      />
    ) : null;

  return (
    <div ref={mountRef} className="relative mt-8 md:mt-10">
      <div
        data-theme="dark"
        role="region"
        aria-label="Interactive project universe"
        data-hovered={hovered === null ? undefined : projects[hovered].id}
        data-selected={selected === null ? undefined : projects[selected].id}
        className="universe-shell relative overflow-hidden border border-white/12 bg-[#060806] text-[#f5f5f5]"
      >
        {/* ---------------------------------------------------------------- */}
        {/* Chrome                                                           */}
        {/* ---------------------------------------------------------------- */}
        <div className="relative z-30 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#070907]/92 px-4 py-3 backdrop-blur-md sm:px-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="relative flex size-1.5 shrink-0">
              <span className="pulse-dot absolute inset-0 rounded-full bg-lime text-lime" />
            </span>
            <span className="truncate font-mono text-[7px] uppercase tracking-[0.2em] text-white/60">
              Project universe
            </span>
            <span aria-hidden className="h-3 w-px shrink-0 bg-white/12" />
            <span className="shrink-0 font-mono text-[6.5px] uppercase tracking-[0.16em] text-white/30">
              {show3d ? "Live orbit" : "2D index"} / 04
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {eligible && webgl === "yes" ? (
              <button
                type="button"
                onClick={() =>
                  setMode((current) =>
                    current === "orbit" ? "index" : "orbit",
                  )
                }
                aria-label={
                  mode === "orbit"
                    ? "Switch to the 2D index view"
                    : "Switch to the 3D orbit view"
                }
                className="mr-1 inline-flex h-7 items-center gap-1.5 border border-white/12 bg-white/[0.02] px-2.5 font-mono text-[6.5px] uppercase tracking-[0.14em] text-white/55 transition-colors hover:border-[#c6ff4d]/55 hover:text-[#c6ff4d]"
              >
                <Layers size={9} aria-hidden />
                {mode === "orbit" ? "2D index" : "3D orbit"}
              </button>
            ) : null}

            {show3d ? (
              <>
                <span
                  aria-hidden
                  className="mr-1 hidden font-mono text-[6.5px] tabular-nums tracking-[0.12em] text-white/30 sm:block"
                >
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => zoomBy(0.84)}
                  disabled={selected !== null}
                  aria-label="Zoom out of the project universe"
                  className={CONTROL_CLASS}
                >
                  <Minus size={11} strokeWidth={1.8} />
                </button>
                <button
                  type="button"
                  onClick={() => zoomBy(1.19)}
                  disabled={selected !== null}
                  aria-label="Zoom into the project universe"
                  className={CONTROL_CLASS}
                >
                  <Plus size={11} strokeWidth={1.8} />
                </button>
              </>
            ) : null}

            <button
              type="button"
              onClick={resetView}
              aria-label="Reset the universe view"
              title="Reset view"
              className={cn(CONTROL_CLASS, !show3d && "hidden")}
            >
              <RotateCcw size={10} strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Stage                                                            */}
        {/* ---------------------------------------------------------------- */}
        <div
          ref={stageRef}
          className={cn(
            "relative select-none",
            show3d && "h-[clamp(430px,64vh,620px)]",
          )}
        >
          {show3d ? (
            <div
              className={cn(
                "absolute inset-0 overflow-hidden",
                dragging ? "cursor-grabbing" : "cursor-grab",
              )}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onPointerLeave={handlePointerLeave}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 20% 16%, rgba(198,255,77,0.07), transparent 42%), radial-gradient(circle at 84% 78%, rgba(143,196,255,0.07), transparent 46%), linear-gradient(180deg, #060806 0%, #050605 100%)",
                }}
              />

              <CanvasBoundary
                onError={() => {
                  setMode("index");
                  setSelected(null);
                }}
              >
                <Suspense fallback={<UniverseLoader />}>
                  <UniverseCanvas
                    hovered={hovered}
                    selected={selected}
                    onHover={setHovered}
                    onSelect={openDossier}
                    reduced={reduced}
                    zoom={zoom}
                    active={mounted && inView && !pageHidden}
                    labelRefs={labelRefs}
                    pointerRef={pointerRef}
                    viewRef={viewRef}
                  />
                </Suspense>
              </CanvasBoundary>

              {/* Projected labels; the canvas writes their transforms. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-10"
              >
                {projects.map((project, index) => {
                  const spec = PLANETS[project.visual];
                  return (
                    <div
                      key={project.id}
                      ref={(element) => {
                        labelRefs.current[index] = element;
                      }}
                      className="absolute left-0 top-0 will-change-transform"
                      style={{ opacity: 0, visibility: "hidden" }}
                    >
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => openDossier(index)}
                        onPointerEnter={() => setHovered(index)}
                        onPointerLeave={() => setHovered(null)}
                        className="group/label pointer-events-auto flex -translate-x-1/2 translate-y-1 flex-col items-center gap-1 text-center"
                      >
                        <span
                          aria-hidden
                          className="h-3 w-px opacity-60"
                          style={{ background: spec.color }}
                        />
                        <span className="flex items-center gap-1.5 border border-white/12 bg-[#060806]/80 px-2 py-1 backdrop-blur-sm transition-colors group-hover/label:border-white/30">
                          <span
                            aria-hidden
                            className="size-1 rounded-full"
                            style={{
                              background: spec.color,
                              boxShadow: `0 0 6px ${spec.color}`,
                            }}
                          />
                          <span className="whitespace-nowrap font-mono text-[6.5px] uppercase tracking-[0.13em] text-white/75">
                            {project.shortTitle}
                          </span>
                        </span>
                        <span className="max-w-[170px] text-[8px] leading-snug text-white/40 opacity-0 transition-opacity duration-200 group-hover/label:opacity-100 group-focus-visible/label:opacity-100">
                          {project.description}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-4 bg-gradient-to-t from-[#060806] via-[#060806]/58 to-transparent px-4 pb-3.5 pt-10 sm:px-5">
                <p className="font-mono text-[6.5px] uppercase tracking-[0.18em] text-white/35">
                  Drag to tilt / click a body to inspect
                </p>
                <p className="hidden items-center gap-1.5 font-mono text-[6.5px] uppercase tracking-[0.18em] text-white/25 sm:flex">
                  <span className="size-1 rounded-full bg-[#c6ff4d]" />
                  Zoom + reset in the controls
                </p>
              </div>
            </div>
          ) : (
            <ProjectConstellation
              hovered={hovered}
              onHover={setHovered}
              onSelect={openDossier}
            />
          )}

          {/* Inline dossier on wide screens. */}
          {wide ? (
            <AnimatePresence>{activePanel}</AnimatePresence>
          ) : null}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Keyboard / legend controls                                       */}
        {/* ---------------------------------------------------------------- */}
        <div
          className={cn(
            "relative z-20 grid-cols-2 gap-px border-t border-white/10 bg-white/10",
            show3d || wide ? "grid" : "hidden",
            "lg:grid-cols-4",
          )}
        >
          {projects.map((project, index) => {
            const spec = PLANETS[project.visual];
            const active = selected === index;
            return (
              <button
                key={project.id}
                type="button"
                onClick={() => openDossier(index)}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(index)}
                onBlur={() => setHovered(null)}
                aria-haspopup="dialog"
                aria-expanded={active}
                aria-controls={active ? PANEL_ID : undefined}
                aria-label={`Open the ${project.title} dossier`}
                className={cn(
                  "group flex items-center gap-2.5 bg-[#070907] px-4 py-3.5 text-left transition-colors duration-300",
                  active
                    ? "bg-white/[0.06]"
                    : "hover:bg-white/[0.035] focus-visible:bg-white/[0.035]",
                )}
              >
                <span className="font-mono text-[7px] tabular-nums text-white/25">
                  {project.index}
                </span>
                <span
                  aria-hidden
                  className="size-1.5 shrink-0 rounded-full"
                  style={{
                    background: spec.color,
                    boxShadow: `0 0 9px ${spec.color}aa`,
                  }}
                />
                <span
                  className={cn(
                    "min-w-0 flex-1 truncate font-mono text-[7.5px] uppercase tracking-[0.13em] transition-colors",
                    active
                      ? "text-white"
                      : "text-white/55 group-hover:text-white/85",
                  )}
                >
                  {project.shortTitle}
                </span>
                <span className="hidden shrink-0 font-mono text-[5.5px] uppercase tracking-[0.1em] text-white/25 xl:block">
                  {project.stack[0]?.name}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "shrink-0 font-mono text-[8px] transition-transform duration-300",
                    active
                      ? "translate-x-0 text-[#c6ff4d]"
                      : "-translate-x-0.5 text-white/20 group-hover:translate-x-0 group-hover:text-white/45",
                  )}
                >
                  +
                </span>
              </button>
            );
          })}
        </div>

        {/* Compact dossier escapes the stage so no ancestor transform clips it. */}
        {!wide && typeof document !== "undefined"
          ? createPortal(
              <AnimatePresence>{activePanel}</AnimatePresence>,
              document.body,
            )
          : null}

        <p className="sr-only" aria-live="polite">
          {selected !== null
            ? `${projects[selected].title} dossier opened. Press Escape to close.`
            : "No project dossier is open."}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[7px] uppercase tracking-[0.18em] text-muted/50">
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="size-1 rounded-full bg-lime" />
          Interactive observatory / {show3d ? "WebGL orbit" : "2D index"}
        </span>
        <span>
          Four real projects / every case file stays below
        </span>
      </div>
    </div>
  );
}
