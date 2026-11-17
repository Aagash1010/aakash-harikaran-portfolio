import type { Project } from "../../../data/profile";
import { PLANETS } from "./planetConfig";
import { cn } from "../../../lib/utils";

/**
 * A lightweight 2D echo of a project body. Used by the touch fallback, the
 * dossier header and the loading surface so the universe keeps one silhouette
 * language even when WebGL is unavailable.
 */
export function PlanetSigil({
  visual,
  className,
}: {
  visual: Project["visual"];
  className?: string;
}) {
  const spec = PLANETS[visual];

  return (
    <span
      aria-hidden
      className={cn("relative block shrink-0", className)}
    >
      <span
        className="absolute inset-[14%] rounded-full"
        style={{
          background: `radial-gradient(circle at 34% 28%, ${spec.color} 0%, ${spec.color}66 26%, #0c0f0a 72%)`,
          boxShadow: `0 0 28px -8px ${spec.color}88`,
        }}
      />
      <span
        className="absolute inset-0 rounded-full border opacity-30"
        style={{ borderColor: spec.color }}
      />
      <span
        className="absolute left-1/2 top-1/2 h-px w-[132%] -translate-x-1/2 -translate-y-1/2 rotate-[-24deg]"
        style={{
          background: `linear-gradient(90deg, transparent, ${spec.color}, transparent)`,
        }}
      />
      <span
        className="absolute left-1/2 top-1/2 size-[5%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: spec.color }}
      />
    </span>
  );
}
