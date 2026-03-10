/**
 * tokens/colors.ts
 * Plorea Design System v3.3
 *
 * TypeScript mirror of tokens.css.
 * Single source of truth for all colour values.
 *
 * Usage:
 *   import { colors } from '@plorea/components/tokens'
 *
 *   // In style props (prefer this — picks up dark mode via CSS vars):
 *   style={{ color: 'var(--color-text-primary)' }}
 *
 *   // In JS logic (theme-switching, charting, canvas, Storybook argTypes):
 *   import { lightColors, darkColors } from '@plorea/components/tokens'
 *
 * Rule: components NEVER import raw hex values directly.
 * Always go through CSS vars in style props.
 * Import hex values only when CSS vars are unavailable
 * (e.g. canvas, SVG fill attributes, charting libraries).
 *
 * ── Naming convention ────────────────────────────────────────────
 *
 *   surface          — card / panel backgrounds
 *   surfaceHover     — hovered row / focused item
 *   surfaceRaised    — dropdowns, modals (above base)
 *   bgPage           — root app background
 *   textPrimary      — headings, body
 *   textSecondary    — metadata, labels
 *   textMuted        — placeholders, disabled (decorative only)
 *   textLink         — interactive text, links (WCAG AA on bg)
 *   primary          — CTA buttons, decorative accents
 *   primaryHover     — button hover
 *   primaryActive    — button pressed
 *   secondary        — secondary actions, interactive blue
 *   accent           — dark interactive text (NOT for body copy)
 *   border           — standard dividers
 *   borderStrong     — table headers, card outlines
 *   borderFocus      — focus ring
 *   success / warning / error / info — feedback
 *   selection        — selected rows / list items
 */

// ── Primitive palette (internal — not exported)
const P = {
  blue100: '#EBF6FB',
  blue400: '#6BB8DA',
  blue600: '#4FA3C8',
  blue700: '#468DAC',
  blue800: '#2E6B87',
  blue900: '#1D4A5F',

  green400: '#6BDAB2',
  yellow400: '#DADA6B',
  red400:   '#DA6B6B',

  gray50:   '#FAFAFA',
  gray100:  '#F1F5F9',
  gray200:  '#E9E9E9',
  gray300:  '#D9D9D9',
  gray400:  '#C4C4C4',
  gray600:  '#666666',
  gray900:  '#1A1A1A',
  white:    '#FFFFFF',

  // Dark primitives
  dark900:  '#16151A',
  dark800:  '#1E1D24',
  dark700:  '#26242E',
  dark600:  '#2E2C38',
  dark500:  '#3D3A4A',
  darkText: '#F0EEF5',
  darkMuted:'#9B98A8',
}

export interface ColorTokens {
  // Surfaces
  bgPage:           string
  surface:          string
  surfaceHover:     string
  surfaceRaised:    string
  surfaceOverlay:   string

  // Text
  textPrimary:      string
  textSecondary:    string
  textMuted:        string
  textLink:         string
  textInverted:     string
  textOnPrimary:    string

  // Borders
  border:           string
  borderStrong:     string
  borderFocus:      string

  // Brand / Interactive
  primary:          string
  primaryHover:     string
  primaryActive:    string
  secondary:        string
  accent:           string

  // Feedback
  success:          string
  successBg:        string
  warning:          string
  warningBg:        string
  error:            string
  errorBg:          string
  info:             string
  infoBg:           string

  // Selection
  selection:        string
  selectionBorder:  string
  selectionText:    string
}

export const lightColors: ColorTokens = {
  bgPage:           P.gray50,
  surface:          P.white,
  surfaceHover:     P.gray100,
  surfaceRaised:    P.white,
  surfaceOverlay:   'rgba(0,0,0,0.48)',

  textPrimary:      P.gray900,
  textSecondary:    P.gray600,
  textMuted:        P.gray400,
  textLink:         P.blue800,
  textInverted:     P.white,
  textOnPrimary:    P.white,

  border:           P.gray200,
  borderStrong:     P.gray300,
  borderFocus:      P.blue400,

  primary:          P.blue400,
  primaryHover:     P.blue600,
  primaryActive:    P.blue700,
  secondary:        P.blue700,
  accent:           P.blue800,

  success:          P.green400,
  successBg:        '#D1FAE5',
  warning:          P.yellow400,
  warningBg:        '#FEF9C3',
  error:            P.red400,
  errorBg:          '#FEE2E2',
  info:             P.blue400,
  infoBg:           P.blue100,

  selection:        P.blue100,
  selectionBorder:  '#99D2E8',
  selectionText:    P.blue900,
}

export const darkColors: ColorTokens = {
  bgPage:           P.dark900,
  surface:          P.dark800,
  surfaceHover:     P.dark700,
  surfaceRaised:    P.dark700,
  surfaceOverlay:   'rgba(0,0,0,0.70)',

  textPrimary:      P.darkText,
  textSecondary:    P.darkMuted,
  textMuted:        '#5C5970',
  textLink:         '#7EC8E3',
  textInverted:     P.dark900,
  textOnPrimary:    '#0D2A38',

  border:           P.dark600,
  borderStrong:     P.dark500,
  borderFocus:      '#7EC8E3',

  primary:          P.blue400,
  primaryHover:     '#7EC8E8',
  primaryActive:    '#5AAAC8',
  secondary:        '#5AAAC8',
  accent:           '#7EC8E3',

  success:          '#4DB896',
  successBg:        '#0D2A1E',
  warning:          '#C4C44A',
  warningBg:        '#1A1A0A',
  error:            '#E08080',
  errorBg:          '#2A0D0D',
  info:             '#7EC8E3',
  infoBg:           '#0D1E28',

  selection:        '#1D3040',
  selectionBorder:  '#3A7A9A',
  selectionText:    '#B8DCF0',
}

/** Resolves the correct token set at runtime based on <html class="dark"> */
export function resolveColors(): ColorTokens {
  if (typeof document !== 'undefined' &&
      document.documentElement.classList.contains('dark')) {
    return darkColors
  }
  return lightColors
}

/**
 * Channel badge colour tokens — used in OrderTable and OrderCard.
 * Separate because they don't follow light/dark inversion — they have
 * dedicated pairs in both modes.
 */
export interface ChannelColorToken {
  bg:     string
  border: string
  text:   string
  hover:  string
}

export const channelColors = {
  light: {
    table:    { bg: '#362F4A', border: '#4A3E60', text: '#B8A8D4', hover: '#2A2338' },
    takeaway: { bg: '#D1E7DD', border: '#8EC9AD', text: '#1A5C3A', hover: '#B8D9C8' },
    eatin:    { bg: '#E5C1B6', border: '#C89888', text: '#6B3020', hover: '#D5B1A6' },
    combo:    { bg: '#FFB3BA', border: '#E08088', text: '#8B2040', hover: '#F09DA4' },
  },
  dark: {
    table:    { bg: '#2D2440', border: '#3D3258', text: '#C4B0E8', hover: '#221B32' },
    takeaway: { bg: '#0D2A1E', border: '#1A5C3A', text: '#6BDAB2', hover: '#0A2218' },
    eatin:    { bg: '#2A1510', border: '#5C2C1A', text: '#E5C1B6', hover: '#220F0A' },
    combo:    { bg: '#2A0D12', border: '#6B2030', text: '#FFB3BA', hover: '#20080E' },
  },
} satisfies Record<'light' | 'dark', Record<string, ChannelColorToken>>
