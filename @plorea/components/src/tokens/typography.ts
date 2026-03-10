/**
 * tokens/spacing.ts
 * Plorea Design System v3.3
 *
 * Spacing scale mirrors Tailwind's 4px base.
 * Use these when building outside Tailwind context
 * (e.g. inline style props, canvas, charting).
 *
 * In Tailwind className usage, use standard spacing utilities (p-4, gap-2 etc).
 * These exports exist for programmatic use and documentation.
 */

export const spacing = {
  0:    0,
  px:   1,
  0.5:  2,
  1:    4,
  1.5:  6,
  2:    8,
  2.5:  10,
  3:    12,
  3.5:  14,
  4:    16,
  5:    20,
  6:    24,
  7:    28,
  8:    32,
  10:   40,
  12:   48,
  14:   56,
  16:   64,
} as const satisfies Record<string, number>

export type SpacingKey = keyof typeof spacing

/**
 * Semantic spacing — named values for specific use cases.
 * Prefer these over raw scale values in component documentation.
 */
export const semanticSpacing = {
  /** Outer edge of screens, panels */
  screenEdge:       spacing[4],         // 16px
  /** Card / panel internal padding */
  cardPadding:      spacing[4],         // 16px
  /** Input field padding (horizontal) */
  inputPaddingX:    spacing[3],         // 12px
  /** Gap between form fields */
  formGap:          spacing[2.5],       // 10px
  /** Gap between inline action buttons */
  actionGap:        spacing[1.5],       // 6px
  /** Standard section spacing */
  sectionGap:       spacing[5],         // 20px
  /** Touch target minimum */
  touchTarget:      44,                 // 44px — WCAG 2.5.5
  /** POS touch target (larger for fast-moving environments) */
  touchTargetPos:   48,                 // 48px
} as const

/**
 * tokens/typography.ts
 * Font families, sizes, and line heights.
 */

export const fontFamilies = {
  /** Body — default for all text */
  sans:    "'Plus Jakarta Sans', -apple-system, sans-serif",
  /** Logo / heading accent — wordmarks, step indicators */
  display: "'Sora', sans-serif",
  /** Receipt, Z-report — thermal printer aesthetic */
  mono:    "'Courier New', Courier, monospace",
} as const

export const fontSizes = {
  xs:   10,   // captions, overlines
  sm:   11,   // metadata, badges
  base: 13,   // body
  md:   14,   // larger body, list items
  lg:   15,   // card titles
  xl:   16,   // section headings
  '2xl': 18,  // page subheadings
  '3xl': 20,  // page headings
  '4xl': 24,  // large display
  '5xl': 28,  // hero / totals
} as const satisfies Record<string, number>

export const fontWeights = {
  normal:    400,
  medium:    500,
  semibold:  600,
  bold:      700,
  extrabold: 800,
} as const satisfies Record<string, number>

export const lineHeights = {
  tight:   1.2,
  snug:    1.35,
  normal:  1.5,
  relaxed: 1.625,
} as const satisfies Record<string, number>

/**
 * Semantic type scale — named styles used across components.
 * Each entry maps to a CSS pattern, not specific numbers.
 *
 * Keys mirror common component usage, not abstract hierarchy.
 */
export const typeScale = {
  /** Label above form fields, column headers */
  overline: {
    fontSize:      fontSizes.xs,
    fontWeight:    fontWeights.bold,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    lineHeight:    lineHeights.normal,
  },
  /** Badge text, timestamps, metadata */
  caption: {
    fontSize:   fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
  },
  /** Standard body / list items */
  body: {
    fontSize:   fontSizes.base,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
  },
  /** Emphasized body — product names, row titles */
  bodyStrong: {
    fontSize:   fontSizes.md,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.snug,
  },
  /** Card / section titles */
  title: {
    fontSize:      fontSizes.xl,
    fontWeight:    fontWeights.bold,
    fontFamily:    fontFamilies.display,
    lineHeight:    lineHeights.tight,
  },
  /** Large heading — page, modal title */
  heading: {
    fontSize:      fontSizes['3xl'],
    fontWeight:    fontWeights.extrabold,
    fontFamily:    fontFamilies.display,
    lineHeight:    lineHeights.tight,
  },
  /** Price / total amounts */
  price: {
    fontSize:   fontSizes['2xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
  },
  /** Large amount on checkout / receipt */
  priceLarge: {
    fontSize:      fontSizes['5xl'],
    fontWeight:    fontWeights.extrabold,
    fontFamily:    fontFamilies.display,
    lineHeight:    lineHeights.tight,
  },
} as const
