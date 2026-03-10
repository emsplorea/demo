/**
 * tokens/motion.ts
 * Plorea Design System v3.3
 *
 * Animation tokens — mirrors the CSS custom properties in tokens.css.
 *
 * Use CSS vars (var(--dur-fast)) in style props wherever possible.
 * Import JS values for programmatic use: timeout durations,
 * framer-motion transitions, requestAnimationFrame timing.
 */

export const durations = {
  /** Instant feedback — ripple, badge pop */
  micro:  80,
  /** Button state change, hover */
  fast:   100,
  /** Default transition */
  normal: 160,
  /** Panels sliding in, overlays */
  slow:   240,
  /** Large panels — cart drawer, checkout flow */
  panel:  320,
  /** Page transitions */
  page:   400,
} as const satisfies Record<string, number>

export const easings = {
  /** Default ease — most transitions */
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  /** Elements entering — spring deceleration */
  enter:    'cubic-bezier(0.16, 1, 0.3, 1)',
  /** Elements leaving — fast exit */
  exit:     'cubic-bezier(0.4, 0, 1, 1)',
} as const

/**
 * Pre-composed transitions for common patterns.
 * Use in style={{ transition: transitions.colors }} or
 * as Tailwind's transition-* value.
 */
export const transitions = {
  colors:     `color ${durations.fast}ms ${easings.standard}, background-color ${durations.fast}ms ${easings.standard}, border-color ${durations.fast}ms ${easings.standard}`,
  opacity:    `opacity ${durations.fast}ms ${easings.standard}`,
  transform:  `transform ${durations.normal}ms ${easings.enter}`,
  all:        `all ${durations.normal}ms ${easings.standard}`,
  slide:      `transform ${durations.slow}ms ${easings.enter}, opacity ${durations.slow}ms ${easings.standard}`,
} as const

/**
 * tokens/radius.ts
 * Border radius tokens.
 */
export const radius = {
  sm:   6,
  base: 8,
  md:   10,
  lg:   14,
  xl:   20,
  full: 9999,
} as const satisfies Record<string, number>

/** CSS var references — use in style props */
export const radiusVars = {
  sm:   'var(--r-sm)',
  base: 'var(--r)',
  md:   'var(--r-md)',
  lg:   'var(--r-lg)',
  xl:   'var(--r-xl)',
  full: 'var(--r-full)',
} as const

/**
 * tokens/index.ts re-exported from here for barrel convenience.
 * Do not import from this file directly — use tokens/index.ts.
 */
