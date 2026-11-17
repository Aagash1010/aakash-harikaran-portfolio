/**
 * Motion design tokens.
 * One timing/easing vocabulary for the whole site so entrances feel related
 * instead of each component inventing its own curve.
 */

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

/** Softer, slower settle used for cinematic hero beats. */
export const EASE_CINEMA = [0.16, 1, 0.3, 1] as const;

export const MOTION = {
  fast: 0.34,
  base: 0.72,
  slow: 1.05,
  cinema: 1.25,
} as const;

export const STAGGER = {
  tight: 0.032,
  base: 0.07,
  loose: 0.11,
} as const;

/** Shared viewport config: reveal once, when a quarter of the element shows. */
export const VIEWPORT = { once: true, amount: 0.25 } as const;
