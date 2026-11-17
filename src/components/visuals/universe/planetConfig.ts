import type { Project } from "../../../data/profile";

export interface PlanetSpec {
  /** Identity tint used for the body, rings, label and dossier accents. */
  color: string;
  /** Orbit radius around the system core. */
  orbit: number;
  /** Height of the orbital plane. Kept separate so labels never stack. */
  y: number;
  /** Starting angle so the four bodies are readable on first paint. */
  phase: number;
  /** Radians per second — deliberately slow. */
  speed: number;
  /** Base radius of the body itself. */
  size: number;
}

/**
 * Each project keeps its own restrained tint and orbital plane. The palette
 * stays close to the site's lime-on-near-black system, with just enough hue to
 * make the four bodies distinguishable at a glance.
 */
export const PLANETS: Record<Project["visual"], PlanetSpec> = {
  tourism: {
    color: "#c6ff4d",
    orbit: 2.9,
    y: 0.62,
    phase: 0.5,
    speed: 0.042,
    size: 0.5,
  },
  billing: {
    color: "#8fc4ff",
    orbit: 3.35,
    y: 0.18,
    phase: 2.25,
    speed: 0.032,
    size: 0.44,
  },
  weather: {
    color: "#ffc978",
    orbit: 2.45,
    y: -0.28,
    phase: 4,
    speed: 0.05,
    size: 0.38,
  },
  esp32: {
    color: "#ff9c8a",
    orbit: 3,
    y: -0.68,
    phase: 5.4,
    speed: 0.037,
    size: 0.42,
  },
};

/** World-space point the dossier camera frames, offset for the side panel. */
export const FOCUS_DISTANCE = 4.35;
