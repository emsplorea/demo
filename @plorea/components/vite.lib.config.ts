/**
 * Plorea Component Library — Vite Build Config
 *
 * Produces three outputs:
 *   dist/index.js      — CJS (for older bundlers / Jest)
 *   dist/index.esm.js  — ESM (tree-shakeable, Vite/Rollup)
 *   dist/index.d.ts    — TypeScript declarations (via vite-plugin-dts)
 *
 * tokens.css is NOT bundled — it must be imported separately by the consumer.
 * This keeps token overrides outside the JS bundle and lets the host app
 * control CSS load order.
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    dts({
      // Emit declarations for everything under src/
      include: ['src'],
      // Single rolled-up .d.ts — easier to publish
      rollupTypes: true,
      // Point outDir to where types field in package.json expects them
      outDir: 'dist',
    }),
  ],

  build: {
    lib: {
      entry:    resolve(__dirname, 'src/index.ts'),
      name:     'PloreaComponents',
      formats:  ['es', 'cjs'],
      fileName: (format) => format === 'es' ? 'index.esm.js' : 'index.js',
    },

    rollupOptions: {
      // React is a peer dep — never bundle it
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react:              'React',
          'react-dom':        'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
        // Keep CSS assets separate from JS chunks
        assetFileNames: (assetInfo) =>
          assetInfo.name === 'style.css' ? 'index.css' : (assetInfo.name ?? ''),
      },
    },

    // Minify for production; keep readable for debugging during development
    minify: false,

    // Source maps for consumers to debug into library code
    sourcemap: true,
  },
})
