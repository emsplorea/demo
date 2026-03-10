import type { Preview } from '@storybook/react'
import { useEffect } from 'react'

// ── Plorea tokens — must load before any component renders
import '../tokens.css'

// ── Global styles (fonts + keyframes)
import { FONTS_STYLE, KEYFRAMES_STYLE } from './previewStyles'

// Inject global styles once
if (typeof document !== 'undefined') {
  const styleId = 'plorea-storybook-globals'
  if (!document.getElementById(styleId)) {
    const el = document.createElement('style')
    el.id = styleId
    el.textContent = FONTS_STYLE + KEYFRAMES_STYLE
    document.head.appendChild(el)
  }
}

// ── Dark mode decorator — syncs Storybook background to .dark class on <html>
function DarkModeDecorator(Story: React.ComponentType, context: { globals: { theme?: string } }) {
  const theme = context.globals.theme ?? 'light'

  useEffect(() => {
    const html = document.documentElement
    html.classList.toggle('dark', theme === 'dark')
    return () => { html.classList.remove('dark') }
  }, [theme])

  return (
    <div
      style={{
        background:  'var(--color-bg-page)',
        color:       'var(--color-text-primary)',
        padding:     '32px',
        minHeight:   '100vh',
        fontFamily:  "'Plus Jakarta Sans', -apple-system, sans-serif",
        fontSize:    15,
        lineHeight:  1.6,
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <Story />
    </div>
  )
}

const preview: Preview = {
  decorators: [DarkModeDecorator],

  globalTypes: {
    theme: {
      name:        'Theme',
      description: 'Light / dark mode',
      defaultValue: 'light',
      toolbar: {
        icon:  'circlehollow',
        items: [
          { value: 'light', icon: 'sun',  title: 'Light' },
          { value: 'dark',  icon: 'moon', title: 'Dark'  },
        ],
        showName: true,
      },
    },
  },

  parameters: {
    // Backgrounds mirrors the token colours so the canvas matches the app
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#FAFAFA' },
        { name: 'dark',  value: '#16151A' },
      ],
    },

    // Controls alphabetical + grouped by category
    controls: {
      matchers: {
        color:  /(background|color|bg|border|fill|stroke)$/i,
        date:   /date$/i,
      },
      sort: 'requiredFirst',
    },

    // Viewport presets relevant to Plorea touchpoints
    viewport: {
      viewports: {
        kiosk:   { name: 'Kiosk (1080×1920)', styles: { width: '1080px', height: '1920px' } },
        pos:     { name: 'POS tablet (1024×768)', styles: { width: '1024px', height: '768px'  } },
        desktop: { name: 'Dashboard (1440×900)', styles: { width: '1440px', height: '900px'  } },
        mobile:  { name: 'Mobile (390×844)',     styles: { width: '390px',  height: '844px'  } },
      },
      defaultViewport: 'desktop',
    },

    layout: 'fullscreen',
  },
}

export default preview
