import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Points to the local @plorea/components package (sibling directory in this zip)
      // After publishing to npm, remove this alias and install the package normally.
      '@plorea/components': path.resolve(__dirname, '../@plorea/components/src'),
    },
  },
})
