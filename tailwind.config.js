/** @type {import('tailwindcss').Config} */

/**
 * Plorea Design System — Tailwind Configuration
 * v2.5 · March 2026
 *
 * Structure:
 *   1. Primitive tokens   — raw color values, never reference directly in components
 *   2. Dark primitives    — dark mode raw values
 *   3. Semantic tokens    — light mode role-based aliases
 *   4. Channel tokens     — order-type colour maps (light + dark variants)
 *   5. Tailwind config    — screens, colors, typography, spacing, shadows, motion
 *   6. DaisyUI themes     — plorea (light) + plorea-dark
 *
 * Dark mode:
 *   Toggle by adding `dark` class to <html>.
 *   Components use CSS custom properties (var(--color-surface) etc.) defined in tokens.css.
 *   The dark class triggers a token swap — components never need to know which mode they're in.
 *
 * Rules:
 *   • Components must use semantic or channel tokens, NOT primitives directly
 *   • Primary blue (#6BB8DA) is NOT allowed for body text — use accent token
 *   • All spacing must snap to the 4px grid
 *   • Touch targets must be ≥ 44×44px (48px preferred for kiosk/POS)
 *   • Z-index values must use named tokens — never raw integers
 */

import daisyui from 'daisyui'

// ─────────────────────────────────────────────────────────────────────────────
// 1. PRIMITIVE TOKENS — LIGHT
//    Raw values only. Never import into components.
// ─────────────────────────────────────────────────────────────────────────────

const primitives = {
  blue: {
    50:      '#EBF6FB',
    100:     '#C7E7F3',
    200:     '#99D2E8',
    DEFAULT: '#6BB8DA',  // primary brand — decorative/backgrounds only
    600:     '#4FA3C8',
    700:     '#468DAC',  // secondary actions
    800:     '#2E6B87',  // interactive text & links — WCAG AA on white (5.3:1)
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
    green:  '#6BDAB2',
    yellow: '#DADA6B',
    red:    '#DA6B6B',
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. PRIMITIVE TOKENS — DARK
//    Warm dark palette. All backgrounds share a subtle purple undertone from
//    channel.table (#362F4A) — gives the palette internal visual coherence.
//    Never use #000000 or pure black — too harsh for long restaurant shifts.
// ─────────────────────────────────────────────────────────────────────────────

const dark = {
  // Backgrounds — each step is ~8px lighter on the z-axis
  bg: {
    page:    '#16151A',  // base app background — warm near-black
    surface: '#1E1D24',  // cards, panels — elevation 1
    raised:  '#26242E',  // hover rows, active items — elevation 1 hover
    overlay: '#2E2C38',  // side panels, modals — elevation 3+
  },

  // Borders
  border: {
    DEFAULT: '#2E2C38',  // subtle, only visible against bg.surface
    strong:  '#3D3A4A',  // stronger separation, table headers
  },

  // Text — off-white, never pure #FFFFFF
  text: {
    primary:   '#F0EEF5',  // body, headings — warm off-white
    secondary: '#9B98A8',  // metadata, labels, captions
    muted:     '#5C5970',  // placeholder, disabled text
    link:      '#7EC8E3',  // interactive — slightly cyan-shifted for contrast
    inverted:  '#16151A',  // text on light buttons in dark mode
  },

  // Brand blue — light mode primary works well on dark surfaces
  blue: {
    primary:      '#6BB8DA',  // CTA buttons — keep as-is, reads well on dark
    primaryHover: '#7EC8E8',  // slightly lighter on hover
    accent:       '#7EC8E3',  // links — cyan-shifted vs #2E6B87 for dark bg contrast
    focus:        'rgba(107,184,218,0.35)',  // slightly stronger than light mode
  },

  // Feedback — slightly desaturated, less aggressive in dark environments
  feedback: {
    green:  '#4DB896',  // success — darker/more muted than light #6BDAB2
    yellow: '#C4C44A',  // warning — warm, not neon
    red:    '#D45858',  // error — softer red, less alarming
  },

  // Channel backgrounds — deep + saturated, pastels don't work on dark
  channel: {
    table:    { bg: '#2A2340', border: '#3D3260', text: '#C4AFEE' },
    takeaway: { bg: '#1A3328', border: '#2A5040', text: '#7DD4AA' },
    eatIn:    { bg: '#3D2218', border: '#5A3425', text: '#E8A890' },
    combo:    { bg: '#3D1A20', border: '#5A2830', text: '#F0A0AA' },
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. SEMANTIC TOKENS — LIGHT MODE
//    Role-based. Components reference these — never primitives directly.
//    Dark mode equivalents live in tokens.css under .dark { }
// ─────────────────────────────────────────────────────────────────────────────

const semantic = {
  // Interactive
  primary:   primitives.blue.DEFAULT,
  secondary: primitives.blue[700],
  accent:    primitives.blue[800],

  // Feedback
  success: primitives.feedback.green,
  warning: primitives.feedback.yellow,
  error:   primitives.feedback.red,
  info:    primitives.blue[100],

  // DaisyUI base aliases
  neutral:     primitives.gray.DEFAULT,
  'base-100':  primitives.gray[100],
  'base-200':  primitives.gray[50],
  'base-300':  primitives.gray.border,

  // Surface tokens
  surface:           primitives.gray[50],
  'surface-hover':   primitives.gray[100],
  'surface-raised':  '#FFFFFF',
  'surface-overlay': 'rgba(0,0,0,0.48)',

  // Text tokens
  'text-primary':   primitives.gray[900],
  'text-secondary': primitives.gray[600],
  'text-muted':     primitives.gray[400],
  'text-inverted':  '#FFFFFF',
  'text-link':      primitives.blue[800],

  // Border tokens
  'border-default': primitives.gray.border,
  'border-strong':  primitives.gray[300],
  'border-focus':   primitives.blue.DEFAULT,

  // Elevation aliases (light mode — subtle ring-based shadows)
  'elevation-0': 'none',
  'elevation-1': '0 1px 4px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)',
  'elevation-2': '0 4px 16px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
  'elevation-3': '0 12px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)',
  'elevation-4': '0 20px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)',

  // Misc
  table:      '#362F4A',
  'black-90': 'rgba(0,0,0,0.9)',
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. ORDER CHANNEL TOKENS — LIGHT MODE
//    Dark mode channel overrides live in tokens.css under .dark { }
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
// 5. TAILWIND CONFIG
// ─────────────────────────────────────────────────────────────────────────────

export default {

  // Dark mode — toggle by adding `dark` class to <html>
  // document.documentElement.classList.toggle('dark')
  darkMode: 'class',

  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './resources/**/*.blade.php',
    './resources/**/*.{js,ts}',
    './public/**/*.html',
  ],

  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem',
        md:      '2rem',
        lg:      '2.5rem',
        xl:      '3rem',
      },
    },

    screens: {
      sm:  '360px',
      md:  '768px',
      lg:  '1024px',
      xl:  '1440px',
      xxl: '1920px',
    },

    colors: {
      transparent: 'transparent',
      current:     'currentColor',
      white:       '#FFFFFF',
      black:       '#0B0B0B',

      // ── Semantic tokens (light mode) — use these in components
      ...semantic,

      // ── Channel tokens — use these for order-type UI
      channel,

      // ── Dark primitives — exported for use in tokens.css and DaisyUI dark theme
      dark,

      // ── Brand primitives — scoped under brand.* to prevent bg-blue-200 usage
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
      fontSize: {
        tiny: ['0.6875rem', { lineHeight: '1rem' }],
        xxs:  ['0.75rem',   { lineHeight: '1.125rem' }],
        xs:   ['0.8125rem', { lineHeight: '1.25rem' }],
        md:   ['0.9375rem', { lineHeight: '1.5rem' }],
      },

      borderRadius: {
        xl: '14px',
      },

      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
      },

      density: {
        comfortable: { row: '56px', gap: '16px', py: '14px' },
        compact:     { row: '44px', gap: '12px', py: '10px' },
        ultra:       { row: '36px', gap: '8px',  py: '7px'  },
      },

      layout: {
        page:      '48px',
        section:   '32px',
        card:      '24px',
        component: '12px',
      },

      height: {
        '30':   '7.5rem',
        '30.5': '7.625rem',
        '31':   '7.75rem',
        '31.5': '7.875rem',
      },

      boxShadow: {
        xs:    '0 1px 2px rgba(0,0,0,0.05)',
        sm:    '0 1px 4px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)',
        md:    '0 4px 16px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
        lg:    '0 12px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)',
        xl:    '0 20px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)',
        // Dark mode elevations use opacity-based shadows (more visible on dark bg)
        'dark-sm': '0 1px 4px rgba(0,0,0,0.40), 0 0 0 1px rgba(255,255,255,0.04)',
        'dark-md': '0 4px 16px rgba(0,0,0,0.50), 0 0 0 1px rgba(255,255,255,0.04)',
        'dark-lg': '0 12px 40px rgba(0,0,0,0.60), 0 0 0 1px rgba(255,255,255,0.05)',
        'dark-xl': '0 20px 60px rgba(0,0,0,0.70), 0 0 0 1px rgba(255,255,255,0.06)',
        focus:     '0 0 0 3px rgba(107,184,218,0.30)',
        'dark-focus': '0 0 0 3px rgba(126,200,227,0.40)',
      },

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

      zIndex: {
        base:     '0',
        raised:   '10',
        dropdown: '1000',
        sticky:   '1100',
        overlay:  '1200',
        modal:    '1300',
        toast:    '1400',
      },

      keyframes: {
        'skeleton':     { '0%, 100%': { opacity: '1' },   '50%': { opacity: '0.4' } },
        'pulse-subtle': { '0%, 100%': { opacity: '1' },   '50%': { opacity: '0.65' } },
        'spin-slow':    { 'to': { transform: 'rotate(360deg)' } },
        'slide-up':     { 'from': { transform: 'translateY(8px)',  opacity: '0' }, 'to': { transform: 'translateY(0)', opacity: '1' } },
        'slide-down':   { 'from': { transform: 'translateY(-8px)', opacity: '0' }, 'to': { transform: 'translateY(0)', opacity: '1' } },
        'fade-in':      { 'from': { opacity: '0' }, 'to': { opacity: '1' } },
      },
      animation: {
        'skeleton':     'skeleton 1.5s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 1.6s ease-in-out infinite',
        'spin-slow':    'spin-slow 1s linear infinite',
        'slide-up':     'slide-up 160ms cubic-bezier(0.16,1,0.3,1)',
        'slide-down':   'slide-down 160ms cubic-bezier(0.16,1,0.3,1)',
        'fade-in':      'fade-in 120ms ease-out',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 6. DAISY UI THEMES
  // ─────────────────────────────────────────────────────────────────────────
  daisyui: {
    themes: [
      {
        // Light theme
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
      {
        // Dark theme — warm dark, matched to dark primitive tokens above
        'plorea-dark': {
          primary:    dark.blue.primary,       // #6BB8DA — keeps brand consistency
          secondary:  '#468DAC',
          accent:     dark.blue.accent,        // #7EC8E3 — cyan-shifted for dark bg
          neutral:    '#3D3A4A',
          'base-100': dark.bg.surface,         // #1E1D24
          'base-200': dark.bg.page,            // #16151A
          'base-300': dark.border.DEFAULT,     // #2E2C38
          info:       '#1D4A5F',
          success:    dark.feedback.green,     // #4DB896
          warning:    dark.feedback.yellow,    // #C4C44A
          error:      dark.feedback.red,       // #D45858
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
