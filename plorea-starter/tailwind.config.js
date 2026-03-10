// Re-uses the Plorea Tailwind config from the component library.
// When published to npm, swap the import path to '@plorea/tailwind-config'.
import baseConfig from '../@plorea/components/../tailwind.config.js'

/** @type {import('tailwindcss').Config} */
export default {
  ...baseConfig,
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    '../@plorea/components/src/**/*.{ts,tsx}',
  ],
}
