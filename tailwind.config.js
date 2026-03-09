/** @type {import('tailwindcss').Config} */

/**
 * Plorea Design System — Tailwind Configuration
 * v2.2 · March 2026
 *
 * Structure:
 *   1. Primitive tokens   — raw color values, never reference directly in components
 *   2. Semantic tokens    — role-based aliases (surface, text, border, feedback)
 *   3. Channel tokens     — order-type colour maps with bg/border/text variants
 *   4. Tailwind config    — screens, colors, typography, spacing, shadows, motion
 *   5. DaisyUI theme
 *
 * Rules:
 *   • Components must use semantic or channel tokens, NOT primitives directly
 *   • Primary blue (#6BB8DA) is NOT allowed for body text — use accent (#2E6B87)
 *   • All spacing must snap to the 4px grid
 *   • Touch targets must be ≥ 44×44px (48px preferred for kiosk/POS)
 */

import daisyui from 'daisyui'

// ─────────────────────────────────────────────────────────────────────────────
// 1. PRIMITIVE TOKENS
//    Raw values only. Never import these into components.
//    Access via brand.blue[700], brand.gray[800], etc.
// ─────────────────────────────────────────────────────────────────────────────

const primitives = {
  blue: {
    50:      '#EBF6FB',
    100:     '#C7E7F3',
    200:     '#99D2E8',
    DEFAULT: '#6BB8DA',  // primary brand — decorative/backgrounds only
    600:     '#4FA3C8',
    700:     '#468DAC',  // secondary actions
    800:     '#2E6B87',  // interactive text & links — passes WCAG AA (5.3:1 on white)
    900:     '#1D4A5F',
  },

  gray: {
    50:           '#FAFAFA',
    100:          '#F1F5F9',
    150:          '#EBEBEB',
    200:          '#E9E9E9',
    300:          '#D9D9D9',
    400:          '#C4C4C4',
    DEFAULT:      '#A6A6A6',
    500:          '#808080',
    600:          '#666666',
    700:          '#3F3D45',
    800:          '#2D2C2F',
    900:          '#1A1A1A',
    border:       '#E9E9E9',
    'border-dark':'#E3E3E4',
  },

  feedback: {
    green:  '#6BDAB2',  // success
    yellow: '#DADA6B',  // warning
    red:    '#DA6B6B',  // error / destructive
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. SEMANTIC TOKENS
//    Role-based. These are what components should reference.
//    Light mode defaults — swap values for dark theme.
// ─────────────────────────────────────────────────────────────────────────────

const semantic = {
  // Interactive
  primary:   primitives.blue.DEFAULT,  // brand CTA buttons, accents
  secondary: primitives.blue[700],     // secondary actions
  accent:    primitives.blue[800],     // text links, interactive labels (WCAG AA)

  // Feedback
  success: primitives.feedback.green,
  warning: primitives.feedback.yellow,
  error:   primitives.feedback.red,
  info:    primitives.blue[100],

  // DaisyUI base
  neutral:     primitives.gray.DEFAULT,
  'base-100':  primitives.gray[100],
  'base-200':  primitives.gray[50],
  'base-300':  primitives.gray.border,

  // Surface tokens — use these for backgrounds, not raw gray values
  surface:           primitives.gray[50],
  'surface-hover':   primitives.gray[100],
  'surface-raised':  '#FFFFFF',
  'surface-overlay': 'rgba(0,0,0,0.48)',

  // Text tokens
  'text-primary':   primitives.gray[900],
  'text-secondary': primitives.gray[600],
  'text-muted':     primitives.gray[400],
  'text-inverted':  '#FFFFFF',
  'text-link':      primitives.blue[800],  // the ONLY blue allowed for body text

  // Border tokens
  'border-default': primitives.gray.border,
  'border-strong':  primitives.gray[300],
  'border-focus':   primitives.blue.DEFAULT,

  // Misc
  table:      '#362F4A',          // table-channel identifier (DaisyUI alias)
  'black-90': 'rgba(0,0,0,0.9)', // scrims / overlays
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. ORDER CHANNEL TOKENS
//    Each channel has bg / hover / border / text for consistent UI treatment.
//    Usage: bg-channel-takeaway-bg, border-channel-takeaway-border, etc.
// ─────────────────────────────────────────────────────────────────────────────

const channel = {
  table: {
    bg:     '#362F4A',
    hover:  '#2A2338',
    border: '#4A3E60',
    text:   '#B8A8D4',
  },
  takeaway: {
    bg:     '#D1E7DD',
    hover:  '#B8D9C8',
    border: '#8EC9AD',
    text:   '#1A5C3A',
  },
  'eat-in': {
    bg:     '#E5C1B6',
    hover:  '#D5B1A6',
    border: '#C89888',
    text:   '#6B3020',
  },
  combo: {
    bg:     '#FFB3BA',
    hover:  '#F09DA4',
    border: '#E08088',
    text:   '#8B2040',
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. TAILWIND CONFIG
// ─────────────────────────────────────────────────────────────────────────────

export default {

  // Dark mode — toggle by adding `dark` class to <html>
  darkMode: 'class',

  // Content paths — covers React/TS, Blade templates, JS resources, HTML demos.
  // All paths must be listed to prevent Tailwind from purging used styles.
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './resources/**/*.blade.php',
    './resources/**/*.{js,ts}',
    './public/**/*.html',
  ],

  theme: {
    // ── Breakpoints
    //    Aligned to real device widths.
    //    sm:360  — covers all modern smartphones (old 350 was non-standard)
    //    lg:1024 — standard tablet landscape + kiosk (old 976 was arbitrary)
    //    xxl:1920 — full-HD kiosk / kitchen display (old 1820 was non-standard)
    screens: {
      sm:  '360px',   // mobile — QR guest ordering, small phones
      md:  '768px',   // tablet portrait, QR web
      lg:  '1024px',  // tablet landscape, kiosk touch screen, POS
      xl:  '1440px',  // back-office dashboard, desktop
      xxl: '1920px',  // full-HD kiosk, kitchen displays
    },

    colors: {
      transparent: 'transparent',
      current:     'currentColor',
      white:       '#FFFFFF',
      black:       '#0B0B0B',

      // Semantic tokens — USE THESE in components
      ...semantic,

      // Channel tokens — USE THESE for order-type UI
      channel,

      // Brand primitives — scoped under brand.* to avoid polluting top-level
      // (prevents accidental bg-blue-200 usage in components)
      brand: {
        blue: primitives.blue,
        gray: primitives.gray,
        ...primitives.feedback,
      },
    },

    fontFamily: {
      display: ['Sora', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      sans: [
        'Plus Jakarta Sans',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Helvetica Neue',
        'Arial',
        'sans-serif',
      ],
      mono: [
        'ui-monospace',
        'SFMono-Regular',
        'Menlo',
        'Monaco',
        'Consolas',
        'Liberation Mono',
        'Courier New',
        'monospace',
      ],
    },

    extend: {
      // Font sizes — always use class names, never hardcode px in components
      fontSize: {
        tiny: ['0.6875rem', { lineHeight: '1rem' }],      // 11px
        xxs:  ['0.75rem',   { lineHeight: '1.125rem' }],  // 12px
        xs:   ['0.8125rem', { lineHeight: '1.25rem' }],   // 13px
        md:   ['0.9375rem', { lineHeight: '1.5rem' }],    // 15px
      },

      borderRadius: {
        xl: '14px',
      },

      // Spacing extensions — fills gaps for dashboard layouts
      spacing: {
        '18': '4.5rem',  // 72px  — section gaps
        '22': '5.5rem',  // 88px  — large section padding
        '26': '6.5rem',  // 104px — hero/dashboard spacers
      },

      // Fixed heights for kiosk / POS component rows
      height: {
        '30':   '7.5rem',
        '30.5': '7.625rem',
        '31':   '7.75rem',
        '31.5': '7.875rem',
      },

      // Box shadows
      // xs/sm: cards     md: hover states     lg: dropdowns
      // xl:    modals, drawers, overlays       focus: keyboard ring
      boxShadow: {
        xs:    '0 1px 2px rgba(0,0,0,0.05)',
        sm:    '0 1px 4px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)',
        md:    '0 4px 16px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
        lg:    '0 12px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)',
        xl:    '0 20px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)',
        focus: '0 0 0 3px rgba(107,184,218,0.30)',
      },

      // Motion
      // micro:   button press — feels immediate
      // fast:    hover states
      // DEFAULT: most UI elements
      // slow:    expand/collapse
      // panel:   side panels, drawers
      // page:    route transitions
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'ease-in':  'cubic-bezier(0.4, 0, 1, 1)',
        'ease':     'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        micro:   '80ms',
        fast:    '100ms',
        DEFAULT: '160ms',
        slow:    '240ms',
        panel:   '320ms',
        page:    '400ms',
      },
    },
  },

  daisyui: {
    themes: [
      {
        plorea: {
          primary:    primitives.blue.DEFAULT,
          secondary:  primitives.blue[700],
          accent:     primitives.blue[800],
          neutral:    primitives.gray.DEFAULT,
          'base-100': primitives.gray[100],
          info:       primitives.blue[100],
          success:    primitives.feedback.green,
          warning:    primitives.feedback.yellow,
          error:      primitives.feedback.red,
        },
      },
    ],
    logs: false,
  },

  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui'),
  ],
}
