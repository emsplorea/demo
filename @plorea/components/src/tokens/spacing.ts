/**
 * tokens/spacing.ts
 * Plorea Design System v3.3
 *
 * Spacing scale — 4px base, mirrors Tailwind's default scale.
 *
 * Usage in style props:
 *   import { sp } from '@plorea/components/tokens'
 *   style={{ padding: sp(4) }}         → "16px"
 *   style={{ gap: sp(1.5) }}           → "6px"
 *
 * In Tailwind className, use utilities directly (p-4, gap-2, etc).
 * These JS exports exist for canvas, charting, and programmatic layout.
 */

/** Raw scale in pixels — integer values */
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
  9:    36,
  10:   40,
  11:   44,
  12:   48,
  14:   56,
  16:   64,
  20:   80,
  24:   96,
} as const

export type SpacingKey = keyof typeof spacing

/** Convenience helper — returns px string from scale key */
export function sp(key: SpacingKey): string {
  return `${spacing[key]}px`
}

/**
 * Semantic spacing — named values for recurring layout patterns.
 * Prefer these over raw scale in component documentation and spec.
 */
export const semanticSpacing = {
  /** Outer edge of screens and panels */
  screenEdge:    spacing[4],       // 16px

  /** Internal card / section padding */
  cardPadding:   spacing[4],       // 16px

  /** Input field horizontal padding */
  inputPaddingX: spacing[3],       // 12px

  /** Vertical padding inside input / button */
  inputPaddingY: spacing[3.5],     // 14px

  /** Gap between sibling action buttons */
  actionGap:     spacing[1.5],     // 6px

  /** Gap between form fields */
  formGap:       spacing[2.5],     // 10px

  /** Vertical gap between cards in a list */
  listGap:       spacing[2],       // 8px

  /** Gap between sections on a screen */
  sectionGap:    spacing[5],       // 20px

  /** Bottom sheet / modal bottom padding (safe area buffer) */
  sheetBottomPad: spacing[5],      // 20px

  /**
   * WCAG 2.5.5 minimum touch target.
   * All interactive elements must meet this.
   */
  touchTarget:   44,               // 44px

  /**
   * POS / kiosk touch target.
   * Larger for gloved hands and fast environments.
   */
  touchTargetPos: 48,              // 48px

  /**
   * Kiosk dine-choice button minimum.
   * Oversized intentionally — customers hesitate at these.
   */
  touchTargetKiosk: 120,          // 120px
} as const
