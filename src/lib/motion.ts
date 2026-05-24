/**
 * Shared motion tokens.
 *
 * Use these instead of inlining `[0.22, 1, 0.36, 1]` or "easeOut" in component
 * files — keeps every Framer transition aligned with the Tailwind motion
 * utilities (`ease-out-quart`, `duration-base`, etc.) defined in
 * tailwind.config.ts and the CSS variables in globals.css.
 *
 * Curves are picked deliberately:
 *   - quart  → standard "settle" — use for most enter/leave animations.
 *   - expo   → premium "lean-in" — use for hero / heading reveals and
 *              container choreography where the entrance should feel
 *              deliberate, almost cinematic.
 */

export const EASE_OUT_QUART = [0.22, 1, 0.36, 1] as const;
export const EASE_OUT_EXPO  = [0.16, 1, 0.3, 1] as const;

/** Durations in seconds (Framer expects seconds, CSS expects ms). */
export const DUR_FAST = 0.18;
export const DUR_BASE = 0.32;
export const DUR_SLOW = 0.52;

/**
 * Spring presets calibrated to the rest of the system. Reuse these by name so
 * navbar, filter pill, and any future layoutId-driven indicator move with the
 * same physics — it's the consistency that reads as premium, not the
 * individual values.
 */
export const SPRING_PILL = { type: "spring" as const, stiffness: 380, damping: 32, mass: 0.6 };
export const SPRING_SOFT = { type: "spring" as const, stiffness: 180, damping: 22, mass: 0.5 };
