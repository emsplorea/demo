/**
 * @plorea/components/tokens
 * Plorea Design System v3.3
 *
 * Token barrel — import everything from here.
 *
 * Usage:
 *   import { lightColors, spacing, typeScale } from '@plorea/components/tokens'
 *
 * For CSS var usage in style props, you do NOT need to import tokens at all:
 *   style={{ color: 'var(--color-text-primary)' }}
 *
 * Import JS tokens only for:
 *   - Canvas / WebGL rendering
 *   - Charting libraries (recharts, d3, plotly)
 *   - Storybook argTypes and decorators
 *   - Animation libraries (framer-motion, GSAP)
 *   - Jest/Vitest snapshot tests
 *   - Code that needs to branch on specific values
 */

export {
  lightColors,
  darkColors,
  resolveColors,
  channelColors,
} from './colors'

export type {
  ColorTokens,
  ChannelColorToken,
} from './colors'

export {
  spacing,
  semanticSpacing,
  sp,
} from './spacing'

export type {
  SpacingKey,
} from './spacing'

export {
  fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
  typeScale,
} from './typography'

export {
  durations,
  easings,
  transitions,
  radius,
  radiusVars,
} from './motion'
